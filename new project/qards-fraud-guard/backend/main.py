from __future__ import annotations

import logging
from io import BytesIO
from time import time
from typing import Any

import numpy as np
import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from backend.schemas import BatchPredictionSummary, PredictionResponse, StatsResponse, Transaction
from fraud_guard.config import BASE_FEATURES, FEATURE_COLUMNS
from fraud_guard.explainability import ShapExplainer
from fraud_guard.features import build_inference_features, build_training_features, validate_feature_columns
from fraud_guard.metrics_store import PredictionEvent, PredictionMetricsStore
from fraud_guard.model_io import FraudArtifacts, ModelArtifactsMissing, load_artifacts


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("qards-fraud-guard")

app = FastAPI(
    title="qards Fraud Guard",
    description="Classical ML fraud scoring with XGBoost, Isolation Forest and SHAP explanations.",
    version="1.0.0",
)

metrics_store = PredictionMetricsStore()
artifacts: FraudArtifacts | None = None
explainer: ShapExplainer | None = None


@app.on_event("startup")
def load_models_on_startup() -> None:
    global artifacts, explainer
    try:
        artifacts = load_artifacts()
        explainer = ShapExplainer(artifacts.xgb_model, artifacts.feature_names)
        logger.info("Model artifacts loaded successfully.")
    except ModelArtifactsMissing as exc:
        logger.error("%s", exc)
        artifacts = None
        explainer = None


def require_artifacts() -> FraudArtifacts:
    if artifacts is None:
        raise HTTPException(
            status_code=503,
            detail="Model artifacts are unavailable. Run scripts/download_data.py and scripts/train.py first.",
        )
    return artifacts


def isolation_score(raw_decision: float) -> float:
    return float(np.clip((-raw_decision + 0.08) / 0.22, 0.0, 1.0))


def risk_level(score: float, risk_thresholds: dict[str, float]) -> str:
    if score >= risk_thresholds.get("high", 0.70):
        return "high"
    if score >= risk_thresholds.get("medium", 0.35):
        return "medium"
    return "low"


def score_feature_frame(feature_frame: pd.DataFrame, transaction: dict[str, Any]) -> PredictionResponse:
    loaded = require_artifacts()
    validate_feature_columns(feature_frame.columns)
    scaled = pd.DataFrame(loaded.preprocessor.transform(feature_frame[FEATURE_COLUMNS]), columns=loaded.feature_names)
    xgb_score = float(loaded.xgb_model.predict_proba(scaled)[:, 1][0])
    if_decision = float(loaded.isolation_forest.decision_function(scaled)[0])
    if_score = isolation_score(if_decision)
    fraud_score = float(np.clip((0.88 * xgb_score) + (0.12 * if_score), 0.0, 1.0))
    flagged = fraud_score >= loaded.decision_threshold
    level = risk_level(fraud_score, loaded.risk_thresholds)
    reasons = explainer.top_reasons(scaled, limit=3) if flagged and explainer else []

    metrics_store.append(
        PredictionEvent(
            fraud_score=fraud_score,
            is_fraud=flagged,
            amount=float(transaction.get("Amount", 0.0)),
            merchant_id=str(transaction.get("merchant_id", "unknown_merchant")),
            risk_level=level,
        )
    )
    logger.info(
        "prediction transaction_id=%s merchant_id=%s score=%.5f flagged=%s risk=%s amount=%.2f",
        transaction.get("transaction_id"),
        transaction.get("merchant_id"),
        fraud_score,
        flagged,
        level,
        float(transaction.get("Amount", 0.0)),
    )

    return PredictionResponse(
        transaction_id=transaction.get("transaction_id"),
        fraud_score=fraud_score,
        xgboost_score=xgb_score,
        isolation_forest_score=if_score,
        is_fraud=flagged,
        risk_level=level,
        threshold=loaded.decision_threshold,
        reasons=reasons,
    )


@app.get("/health")
def health() -> dict[str, object]:
    return {"status": "ok", "model_loaded": artifacts is not None, "timestamp": time()}


@app.post("/predict", response_model=PredictionResponse)
def predict(transaction: Transaction) -> PredictionResponse:
    feature_frame = build_inference_features(transaction.model_dump())
    return score_feature_frame(feature_frame, transaction.model_dump())


@app.post("/predict/batch", response_model=BatchPredictionSummary)
async def predict_batch(file: UploadFile = File(...)) -> BatchPredictionSummary:
    loaded = require_artifacts()
    if not file.filename or not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Upload a CSV file.")
    content = await file.read()
    try:
        frame = pd.read_csv(BytesIO(content))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not parse CSV: {exc}") from exc

    missing = [column for column in BASE_FEATURES if column not in frame.columns]
    if missing:
        raise HTTPException(status_code=400, detail=f"CSV missing required columns: {', '.join(missing)}")

    engineered = build_training_features(frame)
    feature_frame = engineered[FEATURE_COLUMNS]
    scaled = pd.DataFrame(loaded.preprocessor.transform(feature_frame), columns=loaded.feature_names)
    xgb_scores = loaded.xgb_model.predict_proba(scaled)[:, 1]
    if_scores = np.array([isolation_score(value) for value in loaded.isolation_forest.decision_function(scaled)])
    fraud_scores = np.clip((0.88 * xgb_scores) + (0.12 * if_scores), 0.0, 1.0)
    flagged_mask = fraud_scores >= loaded.decision_threshold

    flagged_rows: list[dict[str, object]] = []
    for row_index, row in frame.iterrows():
        score = float(fraud_scores[row_index])
        level = risk_level(score, loaded.risk_thresholds)
        flagged = bool(flagged_mask[row_index])
        merchant_id = str(row.get("merchant_id", engineered.iloc[row_index].get("merchant_id", "unknown_merchant")))
        transaction_id = str(row.get("transaction_id", row_index))
        metrics_store.append(
            PredictionEvent(
                fraud_score=score,
                is_fraud=flagged,
                amount=float(row["Amount"]),
                merchant_id=merchant_id,
                risk_level=level,
            )
        )
        if flagged:
            reasons = explainer.top_reasons(scaled.iloc[[row_index]], limit=3) if explainer else []
            flagged_rows.append(
                {
                    "transaction_id": transaction_id,
                    "merchant_id": merchant_id,
                    "amount": float(row["Amount"]),
                    "fraud_score": score,
                    "risk_level": level,
                    "reasons": reasons,
                }
            )

    logger.info(
        "batch_prediction filename=%s total=%s flagged=%s",
        file.filename,
        len(frame),
        len(flagged_rows),
    )
    return BatchPredictionSummary(
        total_transactions=int(len(frame)),
        flagged_transactions=len(flagged_rows),
        fraud_rate=float(len(flagged_rows) / len(frame)) if len(frame) else 0.0,
        amount_at_risk=round(sum(float(row["amount"]) for row in flagged_rows), 2),
        flagged=flagged_rows,
    )


@app.get("/stats", response_model=StatsResponse)
def stats() -> StatsResponse:
    return StatsResponse(**metrics_store.snapshot())


@app.exception_handler(ModelArtifactsMissing)
def model_artifacts_exception_handler(_: Any, exc: ModelArtifactsMissing) -> JSONResponse:
    return JSONResponse(status_code=503, content={"detail": str(exc)})

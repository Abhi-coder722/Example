from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

import joblib

from fraud_guard.config import (
    DEFAULT_RISK_THRESHOLDS,
    FEATURES_PATH,
    IF_MODEL_PATH,
    MODEL_DIR,
    PREPROCESSOR_PATH,
    THRESHOLD_PATH,
    XGB_MODEL_PATH,
)


class ModelArtifactsMissing(RuntimeError):
    """Raised when trained model artifacts are not available for inference."""


@dataclass(frozen=True)
class FraudArtifacts:
    xgb_model: object
    isolation_forest: object
    preprocessor: object
    feature_names: list[str]
    decision_threshold: float
    risk_thresholds: dict[str, float]


def _ensure_artifacts_exist() -> None:
    required = [XGB_MODEL_PATH, IF_MODEL_PATH, PREPROCESSOR_PATH, THRESHOLD_PATH, FEATURES_PATH]
    missing = [path for path in required if not path.exists()]
    if missing:
        missing_names = ", ".join(path.name for path in missing)
        raise ModelArtifactsMissing(
            f"Model artifacts are missing: {missing_names}. Run `python scripts/download_data.py` "
            "then `python scripts/train.py`, or provide Kaggle credentials and run `docker-compose up`."
        )


def load_artifacts() -> FraudArtifacts:
    _ensure_artifacts_exist()
    with THRESHOLD_PATH.open("r", encoding="utf-8") as handle:
        thresholds = json.load(handle)
    with FEATURES_PATH.open("r", encoding="utf-8") as handle:
        feature_names = json.load(handle)
    return FraudArtifacts(
        xgb_model=joblib.load(XGB_MODEL_PATH),
        isolation_forest=joblib.load(IF_MODEL_PATH),
        preprocessor=joblib.load(PREPROCESSOR_PATH),
        feature_names=feature_names,
        decision_threshold=float(thresholds["decision_threshold"]),
        risk_thresholds=thresholds.get("risk_thresholds", DEFAULT_RISK_THRESHOLDS),
    )


def artifacts_ready() -> bool:
    try:
        _ensure_artifacts_exist()
    except ModelArtifactsMissing:
        return False
    return MODEL_DIR.exists()

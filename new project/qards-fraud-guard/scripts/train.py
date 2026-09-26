from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.metrics import (
    average_precision_score,
    confusion_matrix,
    f1_score,
    precision_recall_curve,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier

from fraud_guard.config import (
    CONFUSION_MATRIX_PATH,
    DEFAULT_RISK_THRESHOLDS,
    FEATURE_COLUMNS,
    FEATURES_PATH,
    IF_MODEL_PATH,
    MODEL_DIR,
    MODEL_REPORT_PATH,
    PREPROCESSOR_PATH,
    RAW_DATA_PATH,
    REPORT_DIR,
    SHAP_BACKGROUND_PATH,
    THRESHOLD_PATH,
    XGB_MODEL_PATH,
)
from fraud_guard.features import build_training_features


def artifacts_exist() -> bool:
    return all(path.exists() for path in [XGB_MODEL_PATH, IF_MODEL_PATH, PREPROCESSOR_PATH, THRESHOLD_PATH, FEATURES_PATH])


def choose_recall_oriented_threshold(y_true: np.ndarray, probabilities: np.ndarray) -> float:
    precision, recall, thresholds = precision_recall_curve(y_true, probabilities)
    beta = 2.0
    f_beta = (1 + beta**2) * (precision * recall) / ((beta**2 * precision) + recall + 1e-12)
    valid = thresholds
    if len(valid) == 0:
        return 0.5
    best_index = int(np.nanargmax(f_beta[:-1]))
    return float(valid[best_index])


def plot_confusion_matrix(matrix: np.ndarray, output_path: Path) -> None:
    fig, ax = plt.subplots(figsize=(5.5, 4.8))
    image = ax.imshow(matrix, cmap="Blues")
    ax.figure.colorbar(image, ax=ax)
    ax.set(
        xticks=np.arange(2),
        yticks=np.arange(2),
        xticklabels=["Legitimate", "Fraud"],
        yticklabels=["Legitimate", "Fraud"],
        ylabel="Actual",
        xlabel="Predicted",
        title="Confusion Matrix at Recall-Oriented Threshold",
    )
    for i in range(2):
        for j in range(2):
            ax.text(j, i, str(matrix[i, j]), ha="center", va="center", color="black", fontweight="bold")
    fig.tight_layout()
    fig.savefig(output_path, dpi=160)
    plt.close(fig)


def write_report(
    precision: float,
    recall: float,
    f1: float,
    auc_pr: float,
    threshold: float,
    matrix: np.ndarray,
    positive_count: int,
    negative_count: int,
) -> None:
    report = f"""# qards Fraud Guard Model Report

## Dataset

- Source: Kaggle `mlg-ulb/creditcardfraud`
- Negative class: {negative_count:,} transactions
- Positive fraud class: {positive_count:,} transactions
- Imbalance handling: stratified split, XGBoost `scale_pos_weight`, recall-oriented threshold tuning, and Isolation Forest anomaly score.

## Validation Metrics

| Metric | Value |
| --- | ---: |
| Precision | {precision:.4f} |
| Recall | {recall:.4f} |
| F1 | {f1:.4f} |
| AUC-PR | {auc_pr:.4f} |
| Decision threshold | {threshold:.4f} |

Fraud operations optimize for recall because missed fraud is usually more expensive than analyst review. Precision remains visible because review capacity matters.

## Confusion Matrix

![Confusion matrix](confusion_matrix.png)

```text
TN={matrix[0, 0]}  FP={matrix[0, 1]}
FN={matrix[1, 0]}  TP={matrix[1, 1]}
```

## Feature Notes

The public dataset contains anonymized PCA features `V1` to `V28`, `Time`, `Amount`, and `Class`. It does not include true cardholder or merchant IDs. For training only, the pipeline derives stable anonymized user and merchant proxies from PCA components so transaction velocity and amount z-score features can be learned without leaking labels. In production, the same inference contract accepts real `user_id`, `merchant_id`, and optional live velocity features from the authorization stream.
"""
    MODEL_REPORT_PATH.write_text(report, encoding="utf-8")


def train(skip_if_artifacts_exist: bool) -> None:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    REPORT_DIR.mkdir(parents=True, exist_ok=True)

    if skip_if_artifacts_exist and artifacts_exist():
        print("Model artifacts already exist. Skipping training.")
        return

    if not RAW_DATA_PATH.exists():
        raise FileNotFoundError(
            f"{RAW_DATA_PATH} does not exist. Run `python scripts/download_data.py` before training."
        )

    raw = pd.read_csv(RAW_DATA_PATH)
    engineered = build_training_features(raw)
    if "Class" not in engineered.columns:
        raise ValueError("Training data must include the Kaggle `Class` label.")

    x = engineered[FEATURE_COLUMNS]
    y = engineered["Class"].astype(int)
    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    preprocessor = StandardScaler()
    x_train_scaled = pd.DataFrame(preprocessor.fit_transform(x_train), columns=FEATURE_COLUMNS, index=x_train.index)
    x_test_scaled = pd.DataFrame(preprocessor.transform(x_test), columns=FEATURE_COLUMNS, index=x_test.index)

    negative_count = int((y_train == 0).sum())
    positive_count = int((y_train == 1).sum())
    scale_pos_weight = negative_count / max(positive_count, 1)

    xgb_model = XGBClassifier(
        n_estimators=450,
        max_depth=4,
        learning_rate=0.035,
        subsample=0.9,
        colsample_bytree=0.9,
        min_child_weight=1,
        reg_lambda=2.0,
        objective="binary:logistic",
        eval_metric="aucpr",
        scale_pos_weight=scale_pos_weight,
        n_jobs=-1,
        random_state=42,
    )
    xgb_model.fit(x_train_scaled, y_train)

    isolation_forest = IsolationForest(
        n_estimators=220,
        contamination=float(y_train.mean()),
        random_state=42,
        n_jobs=-1,
    )
    isolation_forest.fit(x_train_scaled[y_train == 0])

    probabilities = xgb_model.predict_proba(x_test_scaled)[:, 1]
    threshold = choose_recall_oriented_threshold(y_test.to_numpy(), probabilities)
    predictions = (probabilities >= threshold).astype(int)

    precision = precision_score(y_test, predictions, zero_division=0)
    recall = recall_score(y_test, predictions, zero_division=0)
    f1 = f1_score(y_test, predictions, zero_division=0)
    auc_pr = average_precision_score(y_test, probabilities)
    matrix = confusion_matrix(y_test, predictions)

    joblib.dump(xgb_model, XGB_MODEL_PATH)
    joblib.dump(isolation_forest, IF_MODEL_PATH)
    joblib.dump(preprocessor, PREPROCESSOR_PATH)
    FEATURES_PATH.write_text(json.dumps(FEATURE_COLUMNS, indent=2), encoding="utf-8")
    THRESHOLD_PATH.write_text(
        json.dumps(
            {
                "decision_threshold": threshold,
                "risk_thresholds": DEFAULT_RISK_THRESHOLDS,
                "optimized_for": "recall_f2_score",
            },
            indent=2,
        ),
        encoding="utf-8",
    )
    x_train_scaled.sample(n=min(1000, len(x_train_scaled)), random_state=42).to_csv(SHAP_BACKGROUND_PATH, index=False)

    plot_confusion_matrix(matrix, CONFUSION_MATRIX_PATH)
    write_report(
        precision=precision,
        recall=recall,
        f1=f1,
        auc_pr=auc_pr,
        threshold=threshold,
        matrix=matrix,
        positive_count=int((y == 1).sum()),
        negative_count=int((y == 0).sum()),
    )
    print(f"Training complete. Report written to {MODEL_REPORT_PATH}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train qards Fraud Guard classical ML models.")
    parser.add_argument("--skip-if-artifacts-exist", action="store_true", help="Skip training when all model artifacts exist.")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    train(skip_if_artifacts_exist=args.skip_if_artifacts_exist)

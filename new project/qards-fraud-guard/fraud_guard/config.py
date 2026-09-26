from __future__ import annotations

from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = PROJECT_ROOT / "data"
MODEL_DIR = PROJECT_ROOT / "models"
REPORT_DIR = PROJECT_ROOT / "reports"

DATASET_NAME = "mlg-ulb/creditcardfraud"
RAW_DATA_PATH = DATA_DIR / "creditcard.csv"

XGB_MODEL_PATH = MODEL_DIR / "xgboost_fraud.joblib"
IF_MODEL_PATH = MODEL_DIR / "isolation_forest.joblib"
PREPROCESSOR_PATH = MODEL_DIR / "preprocessor.joblib"
THRESHOLD_PATH = MODEL_DIR / "threshold.json"
FEATURES_PATH = MODEL_DIR / "feature_names.json"
SHAP_BACKGROUND_PATH = MODEL_DIR / "shap_background.csv"

MODEL_REPORT_PATH = REPORT_DIR / "model_report.md"
CONFUSION_MATRIX_PATH = REPORT_DIR / "confusion_matrix.png"

BASE_FEATURES = ["Time", "Amount"] + [f"V{i}" for i in range(1, 29)]
ENGINEERED_FEATURES = [
    "transaction_velocity_1h",
    "transaction_velocity_24h",
    "amount_zscore_user",
    "amount_log",
]
FEATURE_COLUMNS = BASE_FEATURES + ENGINEERED_FEATURES

DEFAULT_RISK_THRESHOLDS = {
    "medium": 0.35,
    "high": 0.70,
}

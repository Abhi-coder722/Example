# qards Fraud Guard

Classical machine-learning fraud detection project for card authorization review. The project uses the Kaggle `mlg-ulb/creditcardfraud` dataset, trains XGBoost and Isolation Forest models, exposes real FastAPI inference endpoints, and provides a Streamlit dashboard for analyst workflows.

The design matches a lightweight German banking environment: explicit validation, audit-friendly metrics, no LLM dependencies, no synthetic UI dataset, and deployable containers.

## Architecture

```text
                         Kaggle mlg-ulb/creditcardfraud
                                      |
                                      v
                           scripts/download_data.py
                                      |
                                      v
                              data/creditcard.csv
                                      |
                                      v
                              scripts/train.py
                                      |
          +---------------------------+----------------------------+
          |                                                        |
          v                                                        v
   models/xgboost_fraud.joblib                         models/isolation_forest.joblib
   models/preprocessor.joblib                          reports/model_report.md
   models/threshold.json                               reports/confusion_matrix.png
          |
          v
   FastAPI backend, /predict, /predict/batch, /stats
          |
          v
   Streamlit analyst dashboard
   Real-time checker, batch analysis, fraud operations view
```

## What It Does

- Downloads the real Kaggle credit card fraud dataset through the Kaggle API.
- Engineers transaction features:
  - `Amount`
  - `Time`
  - `V1` to `V28`
  - transaction velocity over 1 hour and 24 hours
  - amount z-score per anonymized user
  - log amount
- Handles class imbalance with stratified validation, XGBoost `scale_pos_weight`, and recall-oriented threshold tuning.
- Trains two classical fraud models:
  - XGBoost supervised fraud classifier
  - Isolation Forest anomaly detector trained on legitimate transactions
- Saves model artifacts to `models/`.
- Generates `reports/model_report.md` with Precision, Recall, F1, AUC-PR, and a confusion matrix image.
- Serves real model inference through FastAPI.
- Shows SHAP top 3 reasons for flagged transactions.
- Provides a banking-style Streamlit dashboard for analyst demos.

## Dataset Note

The Kaggle dataset is anonymized and contains `Time`, `Amount`, PCA features `V1` to `V28`, and `Class`. It does not contain real cardholder, merchant, Sparkasse, or terminal identifiers. To support velocity and per-user amount z-score features during training, the pipeline derives stable anonymized user and merchant proxies from PCA feature buckets. In a production authorization stream, the same API accepts real `user_id`, `merchant_id`, and optional live velocity features.

## One-Command Docker Run

1. Create Kaggle API credentials in your Kaggle account.
2. Copy the environment file and fill in the values:

```bash
cp .env.example .env
```

3. Run the full stack:

```bash
docker compose up --build
```

The first run downloads the dataset and trains the models. Later runs reuse existing files in `data/` and `models/`.

Services:

- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- Streamlit dashboard: `http://localhost:8501`

## Local Development

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scripts/download_data.py
python scripts/train.py
uvicorn backend.main:app --reload
streamlit run frontend/app.py
```

Run tests:

```bash
pytest -q
```

## API

### `POST /predict`

Scores one transaction. Required fields are `Time`, `Amount`, and `V1` to `V28`. Recommended fields are `transaction_id`, `user_id`, and `merchant_id`.

Response:

```json
{
  "transaction_id": "txn_001",
  "fraud_score": 0.82,
  "xgboost_score": 0.89,
  "isolation_forest_score": 0.31,
  "is_fraud": true,
  "risk_level": "high",
  "threshold": 0.41,
  "reasons": [
    {"feature": "V14", "impact": 1.24, "value": -2.81}
  ]
}
```

### `POST /predict/batch`

Uploads a CSV and returns flagged transactions with SHAP reasons.

Required CSV columns:

```text
Time, Amount, V1, V2, ..., V28
```

Optional CSV columns:

```text
transaction_id, user_id, merchant_id
```

### `GET /stats`

Returns operational KPIs from predictions scored during the current backend session:

- total transactions
- flagged transactions
- fraud rate
- estimated chargeback amount saved
- high-risk merchants
- trend data for the operations chart

## Model Artifacts

Training writes:

```text
models/xgboost_fraud.joblib
models/isolation_forest.joblib
models/preprocessor.joblib
models/threshold.json
models/feature_names.json
models/shap_background.csv
reports/model_report.md
reports/confusion_matrix.png
```

These files are ignored by git so the repository remains small. The generated artifacts can be recreated from the Kaggle dataset.

## CV Talking Points

- Built a full fraud detection workflow with recall-oriented model evaluation instead of accuracy.
- Combined supervised fraud classification with anomaly detection.
- Added explainability with SHAP for analyst review.
- Implemented production-style API validation, batch scoring, logging, and operational KPIs.
- Containerized the stack with a reproducible download, train, serve, and dashboard flow.

## Repository Structure

```text
qards-fraud-guard/
  backend/
    main.py
    schemas.py
  fraud_guard/
    config.py
    explainability.py
    features.py
    metrics_store.py
    model_io.py
  frontend/
    app.py
  scripts/
    download_data.py
    train.py
  tests/
    test_features.py
    test_schemas.py
  data/
  models/
  reports/
  Dockerfile.backend
  Dockerfile.frontend
  docker-compose.yml
  requirements.txt
```

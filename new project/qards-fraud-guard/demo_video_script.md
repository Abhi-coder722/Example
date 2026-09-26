# Demo Video Script

## 0:00 to 0:20, Opening

"This is qards Fraud Guard, a lightweight fraud detection project I built for card transaction monitoring. It uses the real Kaggle credit card fraud dataset, classical machine learning, and a deployable FastAPI plus Streamlit stack."

Show the repository structure and point to `scripts/download_data.py`, `scripts/train.py`, `backend/main.py`, and `frontend/app.py`.

## 0:20 to 0:50, Data and Training

"The data pipeline downloads `mlg-ulb/creditcardfraud` through the Kaggle API. The dataset is heavily imbalanced, so the training flow does not optimize for accuracy. It uses stratified validation, XGBoost class weighting, and a recall-oriented threshold based on F2 score."

Show:

```bash
python scripts/download_data.py
python scripts/train.py
```

Open `reports/model_report.md` and highlight Precision, Recall, F1, AUC-PR, and the confusion matrix.

## 0:50 to 1:20, API

"The FastAPI backend exposes real model inference. `/predict` scores one transaction, `/predict/batch` accepts a CSV upload, and `/stats` gives fraud operations KPIs from the live scoring session."

Open `http://localhost:8000/docs`.

Show the response fields:

- fraud score
- XGBoost score
- Isolation Forest score
- fraud decision
- risk level
- SHAP top reasons

## 1:20 to 2:10, Real-Time Transaction Checker

Open the Streamlit dashboard at `http://localhost:8501`.

"This page is designed for an analyst checking a single authorization. The form accepts the transaction amount, time, card-network PCA features, velocity features, and user amount profile. The result shows the fraud score, final decision, model component scores, and SHAP reasons for flagged cases."

Score one transaction copied from a Kaggle row or a case export.

## 2:10 to 2:50, Batch Analysis

"For operational review, analysts often work with a batch of transactions. This page uploads a CSV, sends it to `/predict/batch`, and returns only the flagged transactions with risk level, amount at risk, and explanation."

Upload a CSV with `Time`, `Amount`, and `V1` to `V28`. Download the flagged transaction report.

## 2:50 to 3:30, Fraud Operations View

"The operations view tracks what the backend has scored in this session: transaction count, fraud rate, estimated chargeback amount saved, score trend, and high-risk merchants. The chart uses Altair and the table ranks merchants by flagged amount."

Show the KPI tiles, trend chart, and merchant table.

## 3:30 to 4:00, Deployment

"The full stack runs with Docker Compose. The trainer downloads data and trains models first, then the backend and frontend start. Model artifacts are mounted into the services and ignored by git to keep the repository small."

Show:

```bash
docker compose up --build
```

Close with:

"The key point is that this is not a mock dashboard. It is an end-to-end classical fraud detection system with trained models, explainability, validation, batch scoring, and deployable services."

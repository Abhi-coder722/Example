from __future__ import annotations

import os
from io import StringIO
from typing import Any

import altair as alt
import pandas as pd
import requests
import streamlit as st


API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")
V_COLUMNS = [f"V{i}" for i in range(1, 29)]


st.set_page_config(
    page_title="qards Fraud Guard",
    page_icon="",
    layout="wide",
    initial_sidebar_state="expanded",
)

st.markdown(
    """
    <style>
    .main { background: #f5f7fa; }
    h1, h2, h3 { color: #17202a; letter-spacing: 0; }
    .stMetric { background: white; border: 1px solid #d7dee8; border-radius: 6px; padding: 12px; }
    div[data-testid="stSidebar"] { background: #17202a; }
    div[data-testid="stSidebar"] * { color: #f8fafc; }
    .risk-low { color: #146c53; font-weight: 700; }
    .risk-medium { color: #8a570f; font-weight: 700; }
    .risk-high { color: #9b2c27; font-weight: 700; }
    </style>
    """,
    unsafe_allow_html=True,
)


def api_get(path: str) -> dict[str, Any]:
    response = requests.get(f"{API_BASE_URL}{path}", timeout=20)
    response.raise_for_status()
    return response.json()


def api_post(path: str, payload: dict[str, Any]) -> dict[str, Any]:
    response = requests.post(f"{API_BASE_URL}{path}", json=payload, timeout=30)
    if response.status_code >= 400:
        detail = response.json().get("detail", response.text)
        raise RuntimeError(detail)
    return response.json()


def api_post_file(path: str, file_name: str, content: bytes) -> dict[str, Any]:
    response = requests.post(
        f"{API_BASE_URL}{path}",
        files={"file": (file_name, content, "text/csv")},
        timeout=120,
    )
    if response.status_code >= 400:
        detail = response.json().get("detail", response.text)
        raise RuntimeError(detail)
    return response.json()


def render_status() -> None:
    try:
        health = api_get("/health")
        if health.get("model_loaded"):
            st.sidebar.success("Backend online. Model loaded.")
        else:
            st.sidebar.warning("Backend online. Train model artifacts before scoring.")
    except Exception as exc:
        st.sidebar.error(f"Backend unavailable: {exc}")


def transaction_form() -> dict[str, Any]:
    st.subheader("Transaction details")
    left, right = st.columns(2)
    with left:
        transaction_id = st.text_input("Transaction ID", value="")
        user_id = st.text_input("User ID", value="analyst_input_user")
        merchant_id = st.text_input("Merchant ID", value="merchant_input")
        time_value = st.number_input("Time seconds from dataset baseline", min_value=0.0, value=0.0, step=60.0)
    with right:
        amount = st.number_input("Amount", min_value=0.0, value=0.0, step=10.0)
        velocity_1h = st.number_input("Transactions by user in last hour", min_value=0.0, value=1.0, step=1.0)
        velocity_24h = st.number_input("Transactions by user in last 24h", min_value=0.0, value=1.0, step=1.0)
        amount_zscore = st.number_input("Amount z-score for user", value=0.0, step=0.1)

    st.subheader("Anonymized card network features")
    st.caption("The Kaggle dataset supplies PCA-transformed features V1 to V28. Paste values from a transaction row or a case export.")
    values: dict[str, float] = {}
    for row_start in range(1, 29, 4):
        cols = st.columns(4)
        for offset, col in enumerate(cols):
            feature = f"V{row_start + offset}"
            with col:
                values[feature] = st.number_input(feature, value=0.0, step=0.01, format="%.6f")

    return {
        "transaction_id": transaction_id or None,
        "user_id": user_id,
        "merchant_id": merchant_id,
        "Time": time_value,
        "Amount": amount,
        "transaction_velocity_1h": velocity_1h,
        "transaction_velocity_24h": velocity_24h,
        "amount_zscore_user": amount_zscore,
        **values,
    }


def render_reasons(reasons: list[dict[str, Any]]) -> None:
    if not reasons:
        st.info("No SHAP reasons returned. This can happen when SHAP artifacts are not available or the transaction was not flagged.")
        return
    reason_frame = pd.DataFrame(reasons)
    st.dataframe(reason_frame, hide_index=True, use_container_width=True)


def page_realtime_checker() -> None:
    st.title("Real-time transaction checker")
    transaction = transaction_form()
    if st.button("Score transaction", type="primary"):
        try:
            result = api_post("/predict", transaction)
            score_col, decision_col, risk_col = st.columns(3)
            score_col.metric("Fraud score", f"{result['fraud_score']:.3f}")
            decision_col.metric("Decision", "Flagged" if result["is_fraud"] else "Not flagged")
            risk_col.metric("Risk level", result["risk_level"].upper())
            st.write("Model components")
            st.dataframe(
                pd.DataFrame(
                    [
                        {"model": "XGBoost", "score": result["xgboost_score"]},
                        {"model": "Isolation Forest", "score": result["isolation_forest_score"]},
                    ]
                ),
                hide_index=True,
                use_container_width=True,
            )
            st.write("Top SHAP reasons for flagged transactions")
            render_reasons(result["reasons"])
        except Exception as exc:
            st.error(str(exc))


def page_batch_analysis() -> None:
    st.title("Batch analysis")
    st.write("Upload a CSV with Kaggle-compatible columns: Time, Amount, V1 to V28. Optional columns: transaction_id, user_id, merchant_id.")
    uploaded = st.file_uploader("Transaction CSV", type=["csv"])
    if uploaded is None:
        return

    content = uploaded.getvalue()
    preview = pd.read_csv(StringIO(content.decode("utf-8")), nrows=20)
    st.write("Preview")
    st.dataframe(preview, use_container_width=True)

    if st.button("Run batch scoring", type="primary"):
        try:
            result = api_post_file("/predict/batch", uploaded.name, content)
            c1, c2, c3, c4 = st.columns(4)
            c1.metric("Transactions", f"{result['total_transactions']:,}")
            c2.metric("Flagged", f"{result['flagged_transactions']:,}")
            c3.metric("Fraud rate", f"{result['fraud_rate']:.2%}")
            c4.metric("Amount at risk", f"{result['amount_at_risk']:,.2f}")
            flagged = pd.DataFrame(result["flagged"])
            st.write("Flagged transactions")
            st.dataframe(flagged, use_container_width=True, hide_index=True)
            csv = flagged.to_csv(index=False).encode("utf-8")
            st.download_button("Download flagged report", csv, "flagged_transactions.csv", "text/csv")
        except Exception as exc:
            st.error(str(exc))


def page_operations() -> None:
    st.title("Fraud Operations View")
    try:
        stats = api_get("/stats")
    except Exception as exc:
        st.error(str(exc))
        return

    kpi1, kpi2, kpi3, kpi4 = st.columns(4)
    kpi1.metric("Total transactions", f"{stats['total_transactions']:,}")
    kpi2.metric("Flagged transactions", f"{stats['flagged_transactions']:,}")
    kpi3.metric("Fraud rate", f"{stats['fraud_rate']:.2%}")
    kpi4.metric("Chargeback amount saved", f"{stats['chargeback_amount_saved']:,.2f}")

    trend = pd.DataFrame(stats["trend"])
    if not trend.empty:
        trend["created_at"] = pd.to_datetime(trend["created_at"], unit="s")
        chart = (
            alt.Chart(trend)
            .mark_line(point=True)
            .encode(
                x=alt.X("created_at:T", title="Prediction time"),
                y=alt.Y("fraud_score:Q", title="Fraud score", scale=alt.Scale(domain=[0, 1])),
                color=alt.Color(
                    "risk_level:N",
                    title="Risk",
                    scale=alt.Scale(domain=["low", "medium", "high"], range=["#146c53", "#8a570f", "#9b2c27"]),
                ),
                tooltip=["created_at:T", "fraud_score:Q", "risk_level:N", "amount:Q"],
            )
            .properties(height=360, title="Fraud score trend")
        )
        st.altair_chart(chart, use_container_width=True)
    else:
        st.info("No predictions have been scored in this session yet.")

    merchants = pd.DataFrame(stats["high_risk_merchants"])
    st.subheader("High-risk merchants")
    if merchants.empty:
        st.write("No flagged merchants yet.")
    else:
        st.dataframe(merchants, hide_index=True, use_container_width=True)


def main() -> None:
    st.sidebar.title("qards Fraud Guard")
    st.sidebar.caption("Classical ML fraud detection for card authorization review")
    render_status()
    page = st.sidebar.radio(
        "Workspace",
        ["Real-time transaction checker", "Batch analysis", "Fraud Operations View"],
    )

    if page == "Real-time transaction checker":
        page_realtime_checker()
    elif page == "Batch analysis":
        page_batch_analysis()
    else:
        page_operations()


if __name__ == "__main__":
    main()

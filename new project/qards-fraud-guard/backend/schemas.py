from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field, field_validator


class Transaction(BaseModel):
    transaction_id: str | None = Field(default=None, max_length=80)
    user_id: str = Field(default="unknown_user", max_length=80)
    merchant_id: str = Field(default="unknown_merchant", max_length=80)
    Time: float = Field(ge=0)
    Amount: float = Field(ge=0)
    V1: float
    V2: float
    V3: float
    V4: float
    V5: float
    V6: float
    V7: float
    V8: float
    V9: float
    V10: float
    V11: float
    V12: float
    V13: float
    V14: float
    V15: float
    V16: float
    V17: float
    V18: float
    V19: float
    V20: float
    V21: float
    V22: float
    V23: float
    V24: float
    V25: float
    V26: float
    V27: float
    V28: float
    transaction_velocity_1h: float | None = Field(default=None, ge=0)
    transaction_velocity_24h: float | None = Field(default=None, ge=0)
    amount_zscore_user: float | None = None

    @field_validator("merchant_id", "user_id")
    @classmethod
    def non_empty_identifier(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Identifier must not be empty.")
        return cleaned


class Reason(BaseModel):
    feature: str
    impact: float
    value: float


class PredictionResponse(BaseModel):
    transaction_id: str | None
    fraud_score: float
    xgboost_score: float
    isolation_forest_score: float
    is_fraud: bool
    risk_level: Literal["low", "medium", "high"]
    threshold: float
    reasons: list[Reason]


class BatchPredictionSummary(BaseModel):
    total_transactions: int
    flagged_transactions: int
    fraud_rate: float
    amount_at_risk: float
    flagged: list[dict[str, object]]


class StatsResponse(BaseModel):
    total_transactions: int
    flagged_transactions: int
    fraud_rate: float
    chargeback_amount_saved: float
    high_risk_merchants: list[dict[str, object]]
    trend: list[dict[str, object]]

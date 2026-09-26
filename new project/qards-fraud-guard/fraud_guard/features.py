from __future__ import annotations

import hashlib
from dataclasses import dataclass
from typing import Iterable

import numpy as np
import pandas as pd

from fraud_guard.config import BASE_FEATURES, FEATURE_COLUMNS


@dataclass(frozen=True)
class UserProfile:
    transaction_count_1h: float = 1.0
    transaction_count_24h: float = 1.0
    mean_amount: float = 88.35
    std_amount: float = 250.12


def stable_bucket(value: str, modulo: int) -> int:
    digest = hashlib.sha256(value.encode("utf-8")).hexdigest()
    return int(digest[:12], 16) % modulo


def add_anonymized_entities(frame: pd.DataFrame) -> pd.DataFrame:
    """Create deterministic user and merchant proxies for the anonymized Kaggle data."""
    enriched = frame.copy()
    if "user_id" not in enriched.columns:
        source = enriched[["V1", "V2", "V3", "Amount"]].round(2).astype(str).agg("|".join, axis=1)
        enriched["user_id"] = source.map(lambda item: f"user_{stable_bucket(item, 25000):05d}")
    if "merchant_id" not in enriched.columns:
        source = enriched[["V4", "V5", "V6", "Amount"]].round(2).astype(str).agg("|".join, axis=1)
        enriched["merchant_id"] = source.map(lambda item: f"merchant_{stable_bucket(item, 3500):04d}")
    return enriched


def add_velocity_features(frame: pd.DataFrame) -> pd.DataFrame:
    enriched = add_anonymized_entities(frame).sort_values(["user_id", "Time"]).copy()
    time_seconds = enriched["Time"].astype(float)
    enriched["transaction_velocity_1h"] = 1.0
    enriched["transaction_velocity_24h"] = 1.0

    for _, idx in enriched.groupby("user_id").groups.items():
        user_times = time_seconds.loc[idx]
        enriched.loc[idx, "transaction_velocity_1h"] = [
            float(((user_times >= ts - 3600) & (user_times <= ts)).sum()) for ts in user_times
        ]
        enriched.loc[idx, "transaction_velocity_24h"] = [
            float(((user_times >= ts - 86400) & (user_times <= ts)).sum()) for ts in user_times
        ]

    return enriched.sort_index()


def add_amount_features(frame: pd.DataFrame) -> pd.DataFrame:
    enriched = frame.copy()
    grouped = enriched.groupby("user_id")["Amount"]
    mean_amount = grouped.transform("mean")
    std_amount = grouped.transform("std").replace(0, np.nan).fillna(grouped.transform("mean").abs() + 1.0)
    enriched["amount_zscore_user"] = ((enriched["Amount"] - mean_amount) / std_amount).replace([np.inf, -np.inf], 0).fillna(0)
    enriched["amount_log"] = np.log1p(enriched["Amount"].clip(lower=0))
    return enriched


def build_training_features(raw_frame: pd.DataFrame) -> pd.DataFrame:
    missing = [column for column in BASE_FEATURES if column not in raw_frame.columns]
    if missing:
        raise ValueError(f"Missing required Kaggle columns: {', '.join(missing)}")
    engineered = add_velocity_features(raw_frame)
    engineered = add_amount_features(engineered)
    return engineered[FEATURE_COLUMNS + [column for column in ["Class", "user_id", "merchant_id"] if column in engineered.columns]]


def build_inference_features(transaction: dict, profile: UserProfile | None = None) -> pd.DataFrame:
    profile = profile or UserProfile()
    row = {column: float(transaction.get(column, 0.0)) for column in BASE_FEATURES}
    amount = row["Amount"]
    row["transaction_velocity_1h"] = float(transaction.get("transaction_velocity_1h", profile.transaction_count_1h))
    row["transaction_velocity_24h"] = float(transaction.get("transaction_velocity_24h", profile.transaction_count_24h))
    std_amount = profile.std_amount if profile.std_amount > 0 else 1.0
    row["amount_zscore_user"] = float(transaction.get("amount_zscore_user", (amount - profile.mean_amount) / std_amount))
    row["amount_log"] = float(np.log1p(max(amount, 0.0)))
    return pd.DataFrame([row], columns=FEATURE_COLUMNS)


def validate_feature_columns(columns: Iterable[str]) -> None:
    missing = [column for column in FEATURE_COLUMNS if column not in columns]
    if missing:
        raise ValueError(f"Missing feature columns: {', '.join(missing)}")

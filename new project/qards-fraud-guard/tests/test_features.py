from __future__ import annotations

import pandas as pd

from fraud_guard.config import FEATURE_COLUMNS
from fraud_guard.features import UserProfile, build_inference_features, build_training_features


def test_inference_features_have_expected_columns() -> None:
    transaction = {"Time": 10, "Amount": 100, **{f"V{i}": 0.1 for i in range(1, 29)}}
    features = build_inference_features(transaction, UserProfile(mean_amount=50, std_amount=25))

    assert list(features.columns) == FEATURE_COLUMNS
    assert features.loc[0, "amount_zscore_user"] == 2.0
    assert features.loc[0, "transaction_velocity_1h"] == 1.0


def test_training_features_add_velocity_and_amount_features() -> None:
    frame = pd.DataFrame(
        {
            "Time": [0, 10, 4000],
            "Amount": [20.0, 50.0, 80.0],
            "Class": [0, 0, 1],
            **{f"V{i}": [0.1, 0.2, 0.3] for i in range(1, 29)},
        }
    )
    engineered = build_training_features(frame)

    assert set(FEATURE_COLUMNS).issubset(engineered.columns)
    assert "user_id" in engineered.columns
    assert "merchant_id" in engineered.columns
    assert engineered["transaction_velocity_1h"].min() >= 1

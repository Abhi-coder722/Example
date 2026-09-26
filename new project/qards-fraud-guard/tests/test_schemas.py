from __future__ import annotations

import pytest
from pydantic import ValidationError

from backend.schemas import Transaction


def valid_transaction_payload() -> dict[str, float | str]:
    return {
        "transaction_id": "txn_1",
        "user_id": "user_1",
        "merchant_id": "merchant_1",
        "Time": 1.0,
        "Amount": 42.5,
        **{f"V{i}": 0.0 for i in range(1, 29)},
    }


def test_transaction_schema_accepts_valid_payload() -> None:
    transaction = Transaction(**valid_transaction_payload())
    assert transaction.Amount == 42.5
    assert transaction.merchant_id == "merchant_1"


def test_transaction_schema_rejects_negative_amount() -> None:
    payload = valid_transaction_payload()
    payload["Amount"] = -1.0
    with pytest.raises(ValidationError):
        Transaction(**payload)

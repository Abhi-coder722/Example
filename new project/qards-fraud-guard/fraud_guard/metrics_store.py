from __future__ import annotations

from dataclasses import dataclass, field
from threading import Lock
from time import time


@dataclass
class PredictionEvent:
    fraud_score: float
    is_fraud: bool
    amount: float
    merchant_id: str
    risk_level: str
    created_at: float = field(default_factory=time)


class PredictionMetricsStore:
    def __init__(self) -> None:
        self._events: list[PredictionEvent] = []
        self._lock = Lock()

    def append(self, event: PredictionEvent) -> None:
        with self._lock:
            self._events.append(event)

    def snapshot(self) -> dict[str, object]:
        with self._lock:
            events = list(self._events)
        total = len(events)
        flagged = [event for event in events if event.is_fraud]
        fraud_rate = len(flagged) / total if total else 0.0
        chargeback_amount_saved = round(sum(event.amount for event in flagged) * 0.85, 2)
        high_risk_merchants: dict[str, dict[str, float | int | str]] = {}
        for event in flagged:
            bucket = high_risk_merchants.setdefault(
                event.merchant_id,
                {"merchant_id": event.merchant_id, "flagged_transactions": 0, "amount_at_risk": 0.0},
            )
            bucket["flagged_transactions"] = int(bucket["flagged_transactions"]) + 1
            bucket["amount_at_risk"] = round(float(bucket["amount_at_risk"]) + event.amount, 2)

        return {
            "total_transactions": total,
            "flagged_transactions": len(flagged),
            "fraud_rate": fraud_rate,
            "chargeback_amount_saved": chargeback_amount_saved,
            "high_risk_merchants": sorted(
                high_risk_merchants.values(),
                key=lambda item: float(item["amount_at_risk"]),
                reverse=True,
            )[:10],
            "trend": [
                {
                    "created_at": event.created_at,
                    "fraud_score": event.fraud_score,
                    "risk_level": event.risk_level,
                    "amount": event.amount,
                }
                for event in events[-500:]
            ],
        }

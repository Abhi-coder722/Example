from __future__ import annotations

import logging

import numpy as np
import pandas as pd

from fraud_guard.config import SHAP_BACKGROUND_PATH

logger = logging.getLogger(__name__)


class ShapExplainer:
    def __init__(self, model: object, feature_names: list[str]) -> None:
        self.feature_names = feature_names
        self._explainer = None
        try:
            import shap

            if SHAP_BACKGROUND_PATH.exists():
                background_frame = pd.read_csv(SHAP_BACKGROUND_PATH)
                background = background_frame[feature_names].sample(n=min(200, len(background_frame)), random_state=42)
                self._explainer = shap.TreeExplainer(model, data=background, feature_perturbation="interventional")
            else:
                self._explainer = shap.TreeExplainer(model)
        except Exception as exc:  # SHAP should not take down fraud operations.
            logger.warning("SHAP explainer unavailable: %s", exc)

    def top_reasons(self, features: pd.DataFrame, limit: int = 3) -> list[dict[str, float | str]]:
        if self._explainer is None:
            return []
        try:
            shap_values = self._explainer.shap_values(features[self.feature_names])
            values = shap_values[0] if isinstance(shap_values, list) else np.asarray(shap_values)[0]
            ranked = np.argsort(np.abs(values))[::-1][:limit]
            return [
                {
                    "feature": self.feature_names[index],
                    "impact": float(values[index]),
                    "value": float(features.iloc[0][self.feature_names[index]]),
                }
                for index in ranked
            ]
        except Exception as exc:
            logger.warning("SHAP explanation failed: %s", exc)
            return []

"""Sensory Rheology Predictor — 6-Axis Radar Vector Generator.

Uses a Multi-Output XGBoost regressor exported to ONNX Runtime for
sub-2ms CPU inference. Predicts viscosity, creaminess, mouthfeel,
sweetness_balance, thermal_stability, and aftertaste_cleanliness.

TODO (Teammate 1 — Day 2):
1. Collect USDA FoodData Central compositional features
2. Train Multi-Output XGBoost on [fat%, moisture%, temp] -> [6 axes]
3. Export to ONNX using skl2onnx or xgboost built-in
4. Load via onnxruntime.InferenceSession
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Optional

logger = logging.getLogger(__name__)

RADAR_AXES = [
    "viscosity",
    "creaminess",
    "mouthfeel",
    "sweetness_balance",
    "thermal_stability",
    "aftertaste_cleanliness",
]


class SensoryPredictor:
    """Predicts 6-axis sensory radar metrics from compositional features."""

    def __init__(self, model_path: str = "data/sensory_model/sensory_model.onnx"):
        self.model_path = Path(model_path)
        self.session: Optional[Any] = None  # onnxruntime.InferenceSession
        self._loaded = False

    async def load(self) -> None:
        """Load ONNX model from disk."""
        if self._loaded:
            return
        if not self.model_path.exists():
            logger.warning(
                "Sensory ONNX model not found at %s. "
                "Using heuristic predictions until model is trained.",
                self.model_path,
            )
            return
        try:
            import onnxruntime as ort

            self.session = ort.InferenceSession(str(self.model_path))
            self._loaded = True
            logger.info("SensoryPredictor: ONNX model loaded successfully.")
        except ImportError:
            logger.warning("onnxruntime not installed. Using heuristic predictions.")
        except Exception as exc:
            logger.error("Failed to load ONNX model: %s", exc)

    def predict(
        self,
        substitute_name: str,
        fat_percentage: float,
        moisture_percentage: float,
        simmer_temperature_c: float,
    ) -> dict[str, Any]:
        """Predict 6-axis sensory profile and curdling risk.

        Returns:
            dict matching SensoryProfileResponse contract.
        """
        if self.session is not None:
            # TODO: Run ONNX session.run(...)
            pass

        # Heuristic physics-based rheology approximation
        fat_norm = min(max(fat_percentage, 0.0) / 35.0, 1.0)
        moisture_norm = min(max(moisture_percentage, 0.0) / 80.0, 1.0)
        temp_risk = max(0.0, (simmer_temperature_c - 80.0) / 40.0)

        radar = {
            "viscosity": round(7.0 + fat_norm * 2.8, 1),
            "creaminess": round(7.2 + fat_norm * 2.6, 1),
            "mouthfeel": round(7.0 + (fat_norm + moisture_norm) * 1.3, 1),
            "sweetness_balance": round(8.0 + fat_norm * 1.4, 1),
            "thermal_stability": round(max(9.8 - temp_risk * 2.2, 5.0), 1),
            "aftertaste_cleanliness": round(8.5 + moisture_norm * 1.1, 1),
        }

        curdling_risk = (
            "Low"
            if simmer_temperature_c < 90
            else ("Medium" if simmer_temperature_c < 100 else "High")
        )

        tip = (
            "Stable under prolonged simmer. No tempering required."
            if curdling_risk == "Low"
            else "Add substitute off-heat and fold gently. Avoid rolling boil."
        )

        return {
            "substitute_name": substitute_name,
            "radar_metrics": radar,
            "curdling_risk": curdling_risk,
            "culinary_prep_tip": tip,
        }


# Process-wide singleton
sensory_predictor = SensoryPredictor()

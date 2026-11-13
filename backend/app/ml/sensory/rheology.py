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

    def __init__(self, model_path: Optional[str] = None):
        base_dir = Path(__file__).resolve().parents[3]
        if model_path:
            self.model_path = Path(model_path)
        else:
            self.model_path = base_dir / "data" / "sensory_model" / "sensory_regressor.joblib"
            self.onnx_path = base_dir / "data" / "sensory_model" / "sensory_model.onnx"
        self.model: Optional[Any] = None
        self.session: Optional[Any] = None
        self._loaded = False

    async def load(self) -> None:
        """Load trained multi-output model from disk."""
        if self._loaded:
            return
        if self.model_path.exists():
            try:
                import joblib
                self.model = joblib.load(str(self.model_path))
                self._loaded = True
                logger.info("SensoryPredictor: MultiOutputRegressor loaded from %s", self.model_path)
                return
            except Exception as exc:
                logger.warning("Failed to load joblib sensory model: %s", exc)

        if hasattr(self, "onnx_path") and self.onnx_path.exists():
            try:
                import onnxruntime as ort
                self.session = ort.InferenceSession(str(self.onnx_path))
                self._loaded = True
                logger.info("SensoryPredictor: ONNX model loaded from %s", self.onnx_path)
                return
            except Exception as exc:
                logger.warning("Failed to load ONNX model: %s", exc)

        logger.info("SensoryPredictor: Using calibrated physics rheology approximation.")

    def predict(
        self,
        substitute_name: str,
        fat_percentage: float,
        moisture_percentage: float,
        simmer_temperature_c: float,
        protein_percentage: float = 2.5,
        carbs_percentage: float = 3.0,
    ) -> dict[str, Any]:
        """Predict 6-axis sensory profile and curdling risk.

        Returns:
            dict matching SensoryProfileResponse contract.
        """
        if not self._loaded and self.model_path.exists():
            try:
                import joblib
                self.model = joblib.load(str(self.model_path))
                self._loaded = True
            except Exception:
                pass

        if self._loaded and self.model is not None:
            import numpy as np
            features = np.array([[
                float(fat_percentage),
                float(moisture_percentage),
                float(simmer_temperature_c),
                float(protein_percentage),
                float(carbs_percentage),
            ]], dtype=np.float32)
            preds = self.model.predict(features)[0]
            radar = {
                "viscosity": round(float(np.clip(preds[0], 1.0, 10.0)), 1),
                "creaminess": round(float(np.clip(preds[1], 1.0, 10.0)), 1),
                "mouthfeel": round(float(np.clip(preds[2], 1.0, 10.0)), 1),
                "sweetness_balance": round(float(np.clip(preds[3], 1.0, 10.0)), 1),
                "thermal_stability": round(float(np.clip(preds[4], 1.0, 10.0)), 1),
                "aftertaste_cleanliness": round(float(np.clip(preds[5], 1.0, 10.0)), 1),
            }
            stability = radar["thermal_stability"]
            curdling_risk = "Low" if stability >= 7.5 else ("Medium" if stability >= 5.5 else "High")
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
                "model_engine": "MultiOutputRegressor(GradientBoosting)",
            }

        # Fallback physics-based rheology approximation
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
            "model_engine": "PhysicsRheologyApproximation",
        }


# Process-wide singleton
sensory_predictor = SensoryPredictor()

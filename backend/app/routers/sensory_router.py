"""Sensory Rheology API — Multi-Output XGBoost ONNX 6-Axis Predictor."""

from fastapi import APIRouter

from app.ml.sensory import sensory_predictor
from app.schemas.sensory import SensoryProfileRequest, SensoryProfileResponse

router = APIRouter(prefix="/sensory", tags=["Sensory Rheology"])


@router.post("/predict-profile", response_model=SensoryProfileResponse)
async def predict_sensory_profile(request: SensoryProfileRequest):
    """Predict 6-axis sensory radar metrics and curdling risk.

    Uses Multi-Output XGBoost regressor exported to ONNX Runtime
    for sub-2ms CPU inference.
    """
    result = sensory_predictor.predict(
        substitute_name=request.substitute_name,
        fat_percentage=request.fat_percentage,
        moisture_percentage=request.moisture_percentage,
        simmer_temperature_c=request.simmer_temperature_c,
    )
    return SensoryProfileResponse(
        substitute_name=result["substitute_name"],
        radar_metrics=result["radar_metrics"],
        curdling_risk=result["curdling_risk"],
        culinary_prep_tip=result["culinary_prep_tip"],
    )

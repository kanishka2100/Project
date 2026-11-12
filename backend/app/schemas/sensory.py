"""Pydantic v2 schemas for Sensory Rheology Profiling."""
from pydantic import BaseModel, Field


class SensoryProfileRequest(BaseModel):
    """Request payload for sensory profile prediction."""

    substitute_name: str = Field(..., examples=["Cashew-Milk Puree"])
    fat_percentage: float = Field(..., examples=[22.5])
    moisture_percentage: float = Field(..., examples=[64.0])
    simmer_temperature_c: float = Field(..., examples=[95.0])


class SensoryProfileResponse(BaseModel):
    """Response payload with 6-axis sensory radar metrics."""

    substitute_name: str
    radar_metrics: dict = Field(..., examples=[{
        "viscosity": 9.2,
        "creaminess": 9.5,
        "mouthfeel": 9.1,
        "sweetness_balance": 9.4,
        "thermal_stability": 9.8,
        "aftertaste_cleanliness": 9.6
    }])
    curdling_risk: str = Field(..., examples=["Low"])
    culinary_prep_tip: str = Field(..., examples=[
        "Stable under prolonged simmer. No tempering required."
    ])

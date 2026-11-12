"""Pydantic v2 schemas for Flavor Chemistry Compatibility."""
from pydantic import BaseModel, Field


class FlavorCompatibilityRequest(BaseModel):
    """Request payload for flavor compatibility analysis."""

    original_ingredient: str = Field(..., examples=["Fresh Cream"])
    candidate_substitute: str = Field(..., examples=["Cashew Nut"])


class FlavorCompatibilityResponse(BaseModel):
    """Response payload with volatile aroma compound overlap analysis."""

    original_ingredient: str
    candidate_substitute: str
    compatibility_score: float = Field(..., examples=[0.982])
    match_percentage: str = Field(..., examples=["98.2%"])
    match_verdict: str = Field(..., examples=["Exceptional Aroma Parity"])
    shared_volatile_compounds: list[str] = Field(..., examples=[
        ["delta-lactones (creamy)", "acetoin (buttery)", "benzaldehyde (nutty)"]
    ])
    flavor_delta: dict = Field(..., examples=[
        {"sweetness": "+2%", "fatty_mouthfeel": "-1%", "bitterness": "0%"}
    ])

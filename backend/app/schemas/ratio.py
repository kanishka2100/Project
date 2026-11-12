"""Pydantic v2 schemas for Substitution Ratio Optimization."""
from pydantic import BaseModel, Field


class RatioOptimizationRequest(BaseModel):
    """Request payload for ingredient substitution ratio optimization."""

    recipe_id: str = Field(..., examples=["paneer-butter-masala"])
    missing_ingredient: str = Field(..., examples=["Fresh Cream"])
    original_quantity: float = Field(..., examples=[100.0])
    original_unit: str = Field(..., examples=["g"])
    persons: int = Field(1, ge=1, le=500)
    target_mode: str = Field("budget", pattern="^(budget|calorie|vegan)$")


class RatioOptimizationResponse(BaseModel):
    """Response payload with optimized substitution ratios and cost savings."""

    recipe_id: str
    target_mode: str
    scaled_substitutes: list[dict] = Field(..., examples=[[
        {"name": "Soaked Cashew Paste", "grams": 60.0, "scaled_qty": "60g", "unit_cost": 0.30},
        {"name": "Warm Milk", "grams": 40.0, "scaled_qty": "40ml", "unit_cost": 0.05}
    ]])
    cost_per_person: float = Field(..., examples=[1.15])
    savings_per_person: float = Field(..., examples=[0.95])
    savings_percentage: str = Field(..., examples=["45%"])
    total_batch_cost: float = Field(..., examples=[4.60])
    calorie_delta_percentage: str = Field(..., examples=["-12%"])

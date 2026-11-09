"""Pydantic v2 schemas for Recipe Adaptation SOP Rewriting."""
from typing import Optional

from pydantic import BaseModel, Field


class RecipeAdaptationRequest(BaseModel):
    """Request payload for recipe step adaptation."""

    recipe_id: str = Field(..., examples=["paneer-butter-masala"])
    original_steps: list[str]
    missing_ingredient: str = Field(..., examples=["Fresh Cream"])
    replacement_name: str = Field(..., examples=["Cashew-Milk Velvet Puree"])
    replacement_ratio_text: str = Field(..., examples=["60g Cashew Paste + 40g Warm Milk"])


class RecipeAdaptationResponse(BaseModel):
    """Response payload with adapted recipe steps."""

    recipe_id: str
    adapted_steps: list[str]
    modified_step_indices: list[int] = Field(..., examples=[[2]])
    culinary_safety_warning: Optional[str] = Field(
        None, examples=["Maintain gentle heat; fold puree slowly to lock emulsion."]
    )

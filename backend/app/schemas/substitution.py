"""Pydantic v2 schemas for Intelligent Ingredient Substitution & Flavor Identity Scoring."""
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class SubstitutionRecommendRequest(BaseModel):
    """Input payload for intelligent substitution recommendation."""

    missing_ingredient: str = Field(..., min_length=1, max_length=100, examples=["Heavy Cream"])
    recipe_context: Optional[str] = Field("General / All Dishes", examples=["Curries & Gravies"])
    dish_name: Optional[str] = Field(None, examples=["Paneer Butter Masala"])
    dietary_preferences: Optional[List[str]] = Field(default_factory=list, examples=[["vegan"]])
    allergens_to_avoid: Optional[List[str]] = Field(default_factory=list, examples=[["dairy"]])
    original_quantity: Optional[float] = Field(100.0, gt=0, examples=[100.0])
    original_unit: Optional[str] = Field("g", examples=["g"])
    servings: Optional[int] = Field(4, gt=0, le=50, examples=[4])
    weights: Optional[Dict[str, float]] = Field(
        None,
        examples=[{"wF": 0.40, "wR": 0.40, "wC": 0.20}]
    )


class SubstituteContribution(BaseModel):
    """Integer percentage point breakdown of the score components."""

    flavor: int = Field(..., ge=0, le=100, examples=[38])
    recipe: int = Field(..., ge=0, le=100, examples=[36])
    cost: int = Field(..., ge=0, le=100, examples=[20])


class EvaluatedSubstitute(BaseModel):
    """A scored, ranked, and mathematically calibrated replacement ingredient."""

    name: str = Field(..., examples=["Whisked Malai & Hung Curd (50/50)"])
    score: int = Field(..., ge=0, le=100, examples=[94])
    score_raw: float = Field(..., ge=0.0, le=1.0, examples=[0.942])
    gate: int = Field(1, examples=[1])
    flavor_similarity: float = Field(..., ge=0.0, le=1.0, examples=[0.95])
    recipe_compatibility: float = Field(..., ge=0.0, le=1.0, examples=[0.92])
    cost_efficiency: float = Field(..., ge=0.0, le=1.0, examples=[1.0])
    contributions: SubstituteContribution
    scaled_quantity: float = Field(..., gt=0, examples=[100.0])
    scaled_unit: str = Field("g", examples=["g"])
    substitution_ratio: float = Field(..., gt=0, examples=[1.0])
    culinary_role_match: str = Field(..., examples=["Fat Carrier & Emulsion"])
    taste_delta: str = Field(..., examples=["Subtle lactic tang with identical richness"])
    texture_delta: str = Field(..., examples=["Thick velvety coat; stable emulsion"])
    scientific_mechanism: str = Field(..., examples=["Lactic casein micelle network binds sauce"])
    cooking_tip: str = Field(..., examples=["Whisk until smooth; temper with warm sauce"])
    allergens: List[str] = Field(default_factory=list, examples=[["dairy"]])
    is_vegan: bool = Field(False)
    is_vegetarian: bool = Field(True)
    is_gluten_free: bool = Field(True)
    is_dairy_free: bool = Field(False)


class ExcludedSubstitute(BaseModel):
    """Candidate excluded by hard gate filtering."""

    name: str = Field(..., examples=["Whisked Malai & Hung Curd (50/50)"])
    gate: int = Field(0, examples=[0])
    rejection_reason: str = Field(..., examples=["Contains dairy (violates vegan preference)"])


class SubstitutionRecommendResponse(BaseModel):
    """Complete intelligent substitution recommendation response."""

    status: str = Field(..., examples=["success"])
    message: Optional[str] = None
    missing_ingredient: str = Field(..., examples=["Heavy Cream"])
    canonical_name: Optional[str] = Field(None, examples=["Heavy Cream"])
    category: Optional[str] = Field(None, examples=["Dairy"])
    primary_function: Optional[str] = Field(None, examples=["Fat Carrier & Emulsion"])
    all_functions: Optional[List[str]] = Field(default_factory=list)
    flavor_profile: Optional[str] = None
    texture_profile: Optional[str] = None
    recipe_context: str = Field(..., examples=["Curries & Gravies"])
    original_quantity: float = Field(100.0)
    original_unit: str = Field("g")
    servings: int = Field(4)
    recommendations: List[EvaluatedSubstitute] = Field(default_factory=list)
    excluded_candidates: List[ExcludedSubstitute] = Field(default_factory=list)
    weights_used: Dict[str, float] = Field(..., examples=[{"wF": 0.40, "wR": 0.40, "wC": 0.20}])
    formula_expression: str = Field(
        ...,
        examples=["Score = Gate * (0.40*F + 0.40*R + 0.20*C) * 100"]
    )


class GateValidationRequest(BaseModel):
    """Request to check gate compatibility for an ingredient."""

    candidate_name: str
    candidate_allergens: List[str] = Field(default_factory=list)
    dietary_preferences: List[str] = Field(default_factory=list)
    allergens_to_avoid: List[str] = Field(default_factory=list)


class GateValidationResponse(BaseModel):
    """Result of gate validation."""

    candidate_name: str
    gate: int = Field(..., ge=0, le=1)
    passed: bool
    rejection_reason: Optional[str] = None

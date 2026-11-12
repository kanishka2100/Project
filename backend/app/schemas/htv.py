"""Pydantic v2 schemas for Human Taste Validation Feedback."""
from pydantic import BaseModel, Field


class HtvFeedbackRequest(BaseModel):
    """Request payload for kitchen trial feedback analysis."""

    recipe_id: str = Field(..., examples=["paneer-butter-masala"])
    author_name: str = Field(..., examples=["Chef Vikram"])
    kitchen_name: str = Field(..., examples=["Saffron Cloud Kitchen"])
    review_text: str = Field(..., examples=[
        "Gravy had perfect gloss and thickness! Cashew made it slightly sweet, but guests loved it."
    ])
    raw_rating: int = Field(5, ge=1, le=5)


class HtvFeedbackResponse(BaseModel):
    """Response payload with aspect-based sentiment analysis results."""

    review_id: str
    is_authentic: bool = Field(..., examples=[True])
    aspect_sentiments: list[dict] = Field(..., examples=[[
        {"aspect": "Texture & Gloss", "sentiment": "Positive", "confidence": 0.98},
        {"aspect": "Taste & Sweetness", "sentiment": "Neutral / Advisory", "confidence": 0.84},
        {"aspect": "Thermal Stability", "sentiment": "Positive", "confidence": 0.96}
    ]])
    new_bayesian_trust_score: float = Field(..., examples=[9.84])
    validation_badge: str = Field(..., examples=["HTV Verified Gold"])

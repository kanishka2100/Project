"""Frozen Pydantic v2 API contracts for FlavorShift AI.

These schemas represent the non-negotiable interface contract between
all backend services. Changes require approval from both teammates.
"""

from app.schemas.flavor import (
    FlavorCompatibilityRequest,
    FlavorCompatibilityResponse,
)
from app.schemas.htv import (
    HtvFeedbackRequest,
    HtvFeedbackResponse,
)
from app.schemas.ratio import (
    RatioOptimizationRequest,
    RatioOptimizationResponse,
)
from app.schemas.sensory import (
    SensoryProfileRequest,
    SensoryProfileResponse,
)
from app.schemas.sop import (
    RecipeAdaptationRequest,
    RecipeAdaptationResponse,
)

__all__ = [
    "RatioOptimizationRequest",
    "RatioOptimizationResponse",
    "FlavorCompatibilityRequest",
    "FlavorCompatibilityResponse",
    "SensoryProfileRequest",
    "SensoryProfileResponse",
    "RecipeAdaptationRequest",
    "RecipeAdaptationResponse",
    "HtvFeedbackRequest",
    "HtvFeedbackResponse",
]

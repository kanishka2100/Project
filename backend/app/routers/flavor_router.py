"""Flavor Chemistry API — FlavorGraph 300D Volatile Aroma Matching."""

from fastapi import APIRouter

from app.ml.flavorgraph import flavor_matcher
from app.schemas.flavor import FlavorCompatibilityRequest, FlavorCompatibilityResponse

router = APIRouter(prefix="/flavor", tags=["Flavor Chemistry"])


@router.post("/compatibility", response_model=FlavorCompatibilityResponse)
async def compute_flavor_compatibility(request: FlavorCompatibilityRequest):
    """Compute volatile aroma compound overlap between two ingredients.

    Uses pre-computed FlavorGraph 300D Node2Vec embeddings to calculate
    cosine similarity and extract shared volatile compound names.
    """
    result = flavor_matcher.compute_similarity(
        request.original_ingredient,
        request.candidate_substitute,
    )
    return FlavorCompatibilityResponse(
        original_ingredient=request.original_ingredient,
        candidate_substitute=request.candidate_substitute,
        compatibility_score=result["compatibility_score"],
        match_percentage=result["match_percentage"],
        match_verdict=result["match_verdict"],
        shared_volatile_compounds=result["shared_volatile_compounds"],
        flavor_delta=result["flavor_delta"],
    )

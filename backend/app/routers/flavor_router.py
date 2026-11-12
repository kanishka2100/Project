"""Flavor Chemistry API — FlavorGraph 300D Volatile Aroma Matching & Foodoscope FlavorDB."""

from fastapi import APIRouter

from app.ml.flavorgraph import flavor_matcher
from app.schemas.flavor import FlavorCompatibilityRequest, FlavorCompatibilityResponse
from app.services.foodoscope_client import foodoscope_client

router = APIRouter(prefix="/flavor", tags=["Flavor Chemistry"])


@router.post("/compatibility", response_model=FlavorCompatibilityResponse)
async def compute_flavor_compatibility(request: FlavorCompatibilityRequest):
    """Compute volatile aroma compound overlap between two ingredients.

    Leverages live Foodoscope FlavorDB API molecules data with fallback to
    pre-computed FlavorGraph 300D embeddings.
    """
    # 1. Compute baseline similarity
    result = flavor_matcher.compute_similarity(
        request.original_ingredient,
        request.candidate_substitute,
    )

    # 2. Augment with live Foodoscope FlavorDB profile if available
    live_orig = await foodoscope_client.get_ingredient_flavor(request.original_ingredient)
    live_sub = await foodoscope_client.get_ingredient_flavor(request.candidate_substitute)

    shared_compounds = list(result.get("shared_volatile_compounds", []))
    if live_orig and live_orig.get("molecules"):
        for mol in live_orig["molecules"]:
            if mol and mol not in shared_compounds:
                shared_compounds.append(mol)

    if live_sub and live_sub.get("molecules"):
        for mol in live_sub["molecules"]:
            if mol and mol not in shared_compounds:
                shared_compounds.append(mol)

    return FlavorCompatibilityResponse(
        original_ingredient=request.original_ingredient,
        candidate_substitute=request.candidate_substitute,
        compatibility_score=result["compatibility_score"],
        match_percentage=result["match_percentage"],
        match_verdict=result["match_verdict"],
        shared_volatile_compounds=shared_compounds[:6],
        flavor_delta=result["flavor_delta"],
    )


@router.get("/foodoscope/ingredient/{name}")
async def get_foodoscope_ingredient(name: str):
    """Direct proxy query to Foodoscope FlavorDB for ingredient profile."""
    data = await foodoscope_client.get_ingredient_flavor(name)
    if data:
        return {"status": "success", "data": data}
    return {
        "status": "fallback",
        "data": {
            "ingredient": name,
            "canonical_name": name.strip().lower(),
            "flavor_profile": "Natural culinary aroma profile",
            "source": "FlavorShift Offline Resilient Cache"
        }
    }


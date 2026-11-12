"""Substitution Optimization API — SciPy MILP Mass Conservation Solver."""

from fastapi import APIRouter

from app.schemas.ratio import RatioOptimizationRequest, RatioOptimizationResponse
from app.services.ratio_solver import solve_substitution_ratio

router = APIRouter(prefix="/substitute", tags=["Substitution Optimization"])


@router.post("/optimize-ratio", response_model=RatioOptimizationResponse)
async def optimize_substitution_ratio(request: RatioOptimizationRequest):
    """Solve exact mass conservation equations for ingredient substitution.

    Uses SciPy Mixed-Integer Linear Programming / analytical mass balance
    to guarantee zero arithmetic hallucination and exact cost savings calculations.
    """
    result = solve_substitution_ratio(
        missing_ingredient=request.missing_ingredient,
        original_quantity=request.original_quantity,
        original_unit=request.original_unit,
        target_mode=request.target_mode,
        persons=request.persons,
    )
    return RatioOptimizationResponse(
        recipe_id=request.recipe_id,
        target_mode=request.target_mode,
        scaled_substitutes=result["scaled_substitutes"],
        cost_per_person=result["cost_per_person"],
        savings_per_person=result["savings_per_person"],
        savings_percentage=result["savings_percentage"],
        total_batch_cost=result["total_batch_cost"],
        calorie_delta_percentage=result["calorie_delta_percentage"],
    )

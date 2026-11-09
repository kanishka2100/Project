"""Recipe Adaptation API — Llama 3.1-8B Contextual SOP Rewriter."""

from fastapi import APIRouter

from app.ml.llm.sop_client import sop_client
from app.schemas.sop import RecipeAdaptationRequest, RecipeAdaptationResponse

router = APIRouter(prefix="/recipes", tags=["Recipe Adaptation"])


@router.post("/adapt-sop", response_model=RecipeAdaptationResponse)
async def adapt_recipe_sop(request: RecipeAdaptationRequest):
    """Rewrite recipe steps to incorporate ingredient substitutions.

    Uses Meta Llama-3.1-8B-Instruct via Groq Cloud or culinary heuristics
    to contextually modify cooking instructions with culinary safety methods.
    """
    result = await sop_client.rewrite_steps(
        recipe_id=request.recipe_id,
        original_steps=request.original_steps,
        missing_ingredient=request.missing_ingredient,
        replacement_name=request.replacement_name,
        replacement_ratio_text=request.replacement_ratio_text,
    )
    return RecipeAdaptationResponse(
        recipe_id=result["recipe_id"],
        adapted_steps=result["adapted_steps"],
        modified_step_indices=result["modified_step_indices"],
        culinary_safety_warning=result["culinary_safety_warning"],
    )

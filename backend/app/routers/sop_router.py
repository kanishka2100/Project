"""Standard Operating Procedure (SOP) Recipe Adaptation API."""

from fastapi import APIRouter

from app.schemas.sop import RecipeAdaptationRequest, RecipeAdaptationResponse
from app.services.foodoscope_client import foodoscope_client
from app.services.sop_generator import sop_generator

router = APIRouter(prefix="/recipes", tags=["Recipe SOP"])


@router.post("/adapt-sop", response_model=RecipeAdaptationResponse)
async def adapt_recipe_sop(request: RecipeAdaptationRequest):
    """Adapt recipe SOP steps when an ingredient is substituted.

    Updates ingredient amounts, step temperatures, cooking durations,
    and returns a tailored culinary safety warning.
    """
    data = request.model_dump()
    result = sop_generator.generate_adapted_sop(
        recipe_id=request.recipe_id,
        recipe_title=data.get("recipe_title") or request.recipe_id,
        original_ingredient=data.get("original_ingredient") or data.get("missing_ingredient") or "",
        substitute_ingredient=data.get("substitute_ingredient") or data.get("replacement_name") or "",
        substitute_ratio=data.get("substitute_ratio") or data.get("replacement_ratio_text") or "",
        scaling_factor=data.get("scaling_factor", 1.0),
        original_steps=request.original_steps,
    )
    return RecipeAdaptationResponse(
        recipe_id=request.recipe_id,
        adapted_steps=result["adapted_steps"],
        modified_step_indices=result["modified_step_indices"],
        culinary_safety_warning=result["culinary_safety_warning"],
    )


@router.get("/foodoscope/search")
async def search_foodoscope_recipes(title: str = "", limit: int = 10, page: int = 1):
    """Search recipes in Foodoscope RecipeDB API by title."""
    recipes = await foodoscope_client.search_recipes(title, limit=limit, page=page)
    return {
        "status": "success" if recipes else "empty",
        "query": title,
        "count": len(recipes),
        "recipes": recipes,
    }


@router.get("/foodoscope/recipe/{recipe_id}")
async def get_foodoscope_recipe_info(recipe_id: str):
    """Fetch complete nutrition, macros, utensils, and processes for a recipe from Foodoscope RecipeDB."""
    recipe_info = await foodoscope_client.get_recipe_info(recipe_id)
    if recipe_info:
        return {"status": "success", "recipe": recipe_info}
    return {"status": "not_found", "message": f"Recipe {recipe_id} not found."}


@router.get("/foodoscope/by-ingredient")
async def search_foodoscope_by_ingredient(
    ingredient: str,
    title: str = "",
    limit: int = 10,
    page: int = 1
):
    """Filter recipes in Foodoscope RecipeDB by specific ingredient and optional dish keyword."""
    recipes = await foodoscope_client.search_by_ingredient(
        include_ingredient=ingredient,
        title=title,
        limit=limit,
        page=page,
    )
    return {
        "status": "success" if recipes else "empty",
        "ingredient": ingredient,
        "title": title,
        "count": len(recipes),
        "recipes": recipes,
    }

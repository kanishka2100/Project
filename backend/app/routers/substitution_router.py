"""Intelligent Substitution API Router.

Endpoints for AI-driven culinary substitution, Flavor Identity Scoring,
and dietary/allergen gate validation.
"""
from typing import Any, Dict
from fastapi import APIRouter

from app.schemas.substitution import (
    GateValidationRequest,
    GateValidationResponse,
    SubstitutionRecommendRequest,
    SubstitutionRecommendResponse,
)
from app.services.intelligent_substitution_service import substitution_service

router = APIRouter(prefix="/substitutions", tags=["Intelligent Substitutions"])


@router.post("/recommend", response_model=SubstitutionRecommendResponse)
async def recommend_substitutions(request: SubstitutionRecommendRequest):
    """Recommend and rank ingredient substitutes using the Flavor Identity Engine.

    Formula:
        Score = Gate * (wF * F + wR * R + wC * C) * 100

    Evaluates:
        - Strict boolean gate: allergen safety, dietary constraints (vegan, GF, dairy-free)
        - Flavor similarity (F): 12D volatile aroma vector cosine similarity
        - Recipe compatibility (R): Contextual pairing affinity
        - Cost efficiency (C): Market price optimization
        - Dynamic quantity scaling: mass-conservation balance
    """
    return substitution_service.recommend(request)


@router.get("/ontology")
async def get_substitution_ontology():
    """Retrieve master ingredient ontology metadata and functional profiles."""
    if not substitution_service._kb:
        return {"status": "empty", "ingredients": []}
    return {
        "status": "success",
        "version": substitution_service._kb.get("_meta", {}).get("version", "2.0.0"),
        "dimensions": substitution_service._kb.get("_meta", {}).get("dimensions", []),
        "ingredients_count": len(substitution_service._kb.get("ingredients", [])),
        "ingredients": [
            {
                "id": ing.get("id"),
                "canonical_name": ing.get("canonical_name"),
                "category": ing.get("category"),
                "primary_function": ing.get("primary_function"),
                "substitutes_count": len(ing.get("substitutes", []))
            }
            for ing in substitution_service._kb.get("ingredients", [])
        ]
    }


@router.post("/validate-gate", response_model=GateValidationResponse)
async def validate_gate(request: GateValidationRequest):
    """Validate whether an ingredient passes boolean dietary and allergen gates."""
    dummy_cand = {
        "name": request.candidate_name,
        "allergens": request.candidate_allergens,
        "dietary": {
            "is_vegan": "dairy" not in [a.lower() for a in request.candidate_allergens] and "eggs" not in [a.lower() for a in request.candidate_allergens],
            "is_vegetarian": True,
            "is_gluten_free": "gluten" not in [a.lower() for a in request.candidate_allergens],
            "is_dairy_free": "dairy" not in [a.lower() for a in request.candidate_allergens]
        },
        "in_stock": True
    }
    gate, reason = substitution_service.evaluate_gate(
        dummy_cand,
        request.dietary_preferences,
        request.allergens_to_avoid,
    )
    return GateValidationResponse(
        candidate_name=request.candidate_name,
        gate=gate,
        passed=gate == 1,
        rejection_reason=reason
    )


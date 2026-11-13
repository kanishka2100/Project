"""Unit and integration tests for Intelligent Ingredient Substitution System."""
import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.services.intelligent_substitution_service import (
    is_non_food,
    substitution_service,
)
from app.schemas.substitution import SubstitutionRecommendRequest


def test_is_non_food_guard():
    """Verify non-food stopwords and gibberish are properly rejected."""
    assert is_non_food("laptop") is True
    assert is_non_food("plastic") is True
    assert is_non_food("petrol") is True
    assert is_non_food("asdfghjkl") is True
    assert is_non_food("12345") is True
    assert is_non_food("") is True

    # Real foods must pass
    assert is_non_food("Heavy Cream") is False
    assert is_non_food("butter") is False
    assert is_non_food("Paneer") is False
    assert is_non_food("all-purpose flour") is False
    assert is_non_food("soy sauce") is False


def test_recommend_heavy_cream_scoring_and_math():
    """Verify Flavor Identity Score formula and contribution consistency."""
    req = SubstitutionRecommendRequest(
        missing_ingredient="Heavy Cream",
        recipe_context="Curries & Gravies",
        dish_name="Paneer Butter Masala",
        original_quantity=100.0,
        servings=4
    )
    res = substitution_service.recommend(req)
    assert res.status == "success"
    assert len(res.recommendations) >= 3

    # Verify sorting: scores must be monotonically non-increasing
    scores = [r.score for r in res.recommendations]
    assert scores == sorted(scores, reverse=True)

    # Verify score formula and contributions integrity
    for rec in res.recommendations:
        assert rec.gate == 1
        assert 0 <= rec.score <= 100
        contrib = rec.contributions
        assert contrib.flavor + contrib.recipe + contrib.cost == rec.score
        assert rec.scaled_quantity > 0


def test_vegan_gate_filtering():
    """Verify vegan constraint strictly excludes dairy and egg candidates."""
    req = SubstitutionRecommendRequest(
        missing_ingredient="Heavy Cream",
        recipe_context="Curries & Gravies",
        dietary_preferences=["vegan"],
        original_quantity=100.0,
        servings=4
    )
    res = substitution_service.recommend(req)
    assert res.status == "success"

    # All recommended candidates must be vegan
    for rec in res.recommendations:
        assert rec.is_vegan is True
        assert "dairy" not in [a.lower() for a in rec.allergens]

    # Excluded list must contain dairy items with explicit reasons
    assert len(res.excluded_candidates) > 0
    dairy_rejections = [
        exc for exc in res.excluded_candidates
        if "dairy" in exc.rejection_reason.lower() or "animal" in exc.rejection_reason.lower()
    ]
    assert len(dairy_rejections) > 0


def test_allergen_avoidance_gating():
    """Verify allergen constraint excludes items containing specified allergens."""
    req = SubstitutionRecommendRequest(
        missing_ingredient="Heavy Cream",
        recipe_context="Curries & Gravies",
        allergens_to_avoid=["tree_nuts"],
        original_quantity=100.0,
        servings=4
    )
    res = substitution_service.recommend(req)
    assert res.status == "success"

    for rec in res.recommendations:
        assert "tree_nuts" not in [a.lower() for a in rec.allergens]

    nut_rejections = [
        exc for exc in res.excluded_candidates
        if "tree_nuts" in exc.rejection_reason.lower()
    ]
    assert len(nut_rejections) > 0


def test_quantity_scaling_formula():
    """Verify mass conservation scaling: orig_qty * ratio * (servings / 4)."""
    req = SubstitutionRecommendRequest(
        missing_ingredient="Heavy Cream",
        original_quantity=200.0,
        servings=8  # double standard batch
    )
    res = substitution_service.recommend(req)
    assert res.status == "success"

    for rec in res.recommendations:
        expected_qty = round(200.0 * rec.substitution_ratio * (8 / 4), 1)
        assert abs(rec.scaled_quantity - expected_qty) < 0.1


@pytest.mark.asyncio
async def test_api_router_recommend_and_ontology():
    """Verify HTTP API endpoints using FastAPI AsyncClient."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. Test POST /api/v1/substitutions/recommend
        resp = await ac.post(
            "/api/v1/substitutions/recommend",
            json={
                "missing_ingredient": "Heavy Cream",
                "recipe_context": "Curries & Gravies",
                "dietary_preferences": ["vegan"]
            }
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "success"
        assert len(data["recommendations"]) > 0

        # 2. Test GET /api/v1/substitutions/ontology
        ont_resp = await ac.get("/api/v1/substitutions/ontology")
        assert ont_resp.status_code == 200
        ont_data = ont_resp.json()
        assert ont_data["status"] == "success"
        assert ont_data["ingredients_count"] >= 5

        # 3. Test POST /api/v1/substitutions/validate-gate
        gate_resp = await ac.post(
            "/api/v1/substitutions/validate-gate",
            json={
                "candidate_name": "Whole Milk Yogurt",
                "candidate_allergens": ["dairy"],
                "dietary_preferences": ["vegan"],
                "allergens_to_avoid": []
            }
        )
        assert gate_resp.status_code == 200
        gate_data = gate_resp.json()
        assert gate_data["passed"] is False
        assert gate_data["gate"] == 0


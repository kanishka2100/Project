"""LLM SOP adaptation API tests."""
import pytest


@pytest.mark.asyncio
async def test_sop_adaptation_endpoint(client):
    """Test SOP rewriter with pass-through mode."""
    payload = {
        "recipe_id": "paneer-butter-masala",
        "original_steps": [
            "Sauté onions and tomatoes.",
            "Add fresh cream and simmer.",
            "Add paneer cubes and garnish."
        ],
        "missing_ingredient": "Fresh Cream",
        "replacement_name": "Cashew-Milk Puree",
        "replacement_ratio_text": "60g Cashew + 40g Milk"
    }
    response = await client.post("/api/v1/recipes/adapt-sop", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["recipe_id"] == "paneer-butter-masala"
    assert isinstance(data["adapted_steps"], list)
    assert len(data["adapted_steps"]) == 3  # Pass-through returns same count

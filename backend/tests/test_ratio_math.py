"""Ratio optimization API tests."""

import pytest


@pytest.mark.asyncio
async def test_ratio_optimization_endpoint(client):
    """Test ratio solver with mock data."""
    payload = {
        "recipe_id": "paneer-butter-masala",
        "missing_ingredient": "Fresh Cream",
        "original_quantity": 100.0,
        "original_unit": "g",
        "persons": 2,
        "target_mode": "budget",
    }
    response = await client.post("/api/v1/substitute/optimize-ratio", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["recipe_id"] == "paneer-butter-masala"
    assert len(data["scaled_substitutes"]) > 0
    assert data["cost_per_person"] > 0
    assert data["savings_per_person"] > 0


@pytest.mark.asyncio
async def test_ratio_invalid_mode(client):
    """Test that invalid target_mode is rejected by schema validator."""
    payload = {
        "recipe_id": "test",
        "missing_ingredient": "Test",
        "original_quantity": 100.0,
        "original_unit": "g",
        "target_mode": "invalid_mode",
    }
    response = await client.post("/api/v1/substitute/optimize-ratio", json=payload)
    assert response.status_code == 422  # Pydantic validation error

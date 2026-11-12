"""Foodoscope RecipeDB & FlavorDB Integration API tests."""
import pytest


@pytest.mark.asyncio
async def test_foodoscope_health_in_health_check(client):
    """Test that health check includes Foodoscope API status."""
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert "foodoscope_api" in data
    assert "status" in data["foodoscope_api"]


@pytest.mark.asyncio
async def test_foodoscope_ingredient_proxy(client):
    """Test Foodoscope FlavorDB ingredient lookup endpoint."""
    response = await client.get("/api/v1/flavor/foodoscope/ingredient/cashew")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "data" in data
    assert "ingredient" in data["data"]


@pytest.mark.asyncio
async def test_foodoscope_recipe_search_endpoint(client):
    """Test Foodoscope RecipeDB search proxy endpoint."""
    response = await client.get("/api/v1/recipes/foodoscope/search?title=paneer&limit=5")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "recipes" in data
    assert isinstance(data["recipes"], list)


@pytest.mark.asyncio
async def test_foodoscope_recipe_info_endpoint(client):
    """Test Foodoscope Recipe details endpoint."""
    response = await client.get("/api/v1/recipes/foodoscope/recipe/4009")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data


@pytest.mark.asyncio
async def test_foodoscope_by_ingredient_endpoint(client):
    """Test Foodoscope by-ingredient search proxy endpoint."""
    response = await client.get("/api/v1/recipes/foodoscope/by-ingredient?ingredient=paneer&limit=3")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data

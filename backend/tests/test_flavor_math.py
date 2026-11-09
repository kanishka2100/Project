"""Flavor compatibility API tests."""
import pytest


@pytest.mark.asyncio
async def test_flavor_compatibility_endpoint(client):
    """Test flavor compatibility with mock data."""
    payload = {
        "original_ingredient": "Fresh Cream",
        "candidate_substitute": "Cashew Nut"
    }
    response = await client.post("/api/v1/flavor/compatibility", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "compatibility_score" in data
    assert 0.0 <= data["compatibility_score"] <= 1.0
    assert "shared_volatile_compounds" in data
    assert isinstance(data["shared_volatile_compounds"], list)

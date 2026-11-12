"""Sensory rheology API tests."""
import pytest


@pytest.mark.asyncio
async def test_sensory_profile_endpoint(client):
    """Test sensory predictor with heuristic fallback."""
    payload = {
        "substitute_name": "Cashew-Milk Puree",
        "fat_percentage": 22.5,
        "moisture_percentage": 64.0,
        "simmer_temperature_c": 95.0
    }
    response = await client.post("/api/v1/sensory/predict-profile", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "radar_metrics" in data
    metrics = data["radar_metrics"]
    assert all(axis in metrics for axis in [
        "viscosity", "creaminess", "mouthfeel",
        "sweetness_balance", "thermal_stability", "aftertaste_cleanliness"
    ])
    assert data["curdling_risk"] in ["Low", "Medium", "High"]

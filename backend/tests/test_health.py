"""Health endpoint tests."""
import pytest


@pytest.mark.asyncio
async def test_health_endpoint(client):
    """Test that the health endpoint returns 200."""
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_root_endpoint(client):
    """Test that the root endpoint returns API info."""
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "FlavorShift AI" in data["message"]

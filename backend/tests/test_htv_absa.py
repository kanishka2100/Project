"""HTV feedback analysis API tests."""
import pytest


@pytest.mark.asyncio
async def test_htv_feedback_endpoint(client):
    """Test HTV sentiment analysis with rule-based fallback."""
    payload = {
        "recipe_id": "paneer-butter-masala",
        "author_name": "Chef Vikram",
        "kitchen_name": "Saffron Cloud Kitchen",
        "review_text": "Gravy had perfect gloss and thickness!",
        "raw_rating": 5
    }
    response = await client.post("/api/v1/htv/analyze-feedback", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "review_id" in data
    assert data["is_authentic"] is True
    assert len(data["aspect_sentiments"]) > 0
    assert data["validation_badge"] in [
        "HTV Verified Gold", "HTV Verified Silver",
        "HTV Verified Bronze", "HTV Pending"
    ]

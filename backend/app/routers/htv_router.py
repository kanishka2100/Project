"""Human Taste Validation API — DeBERTa-v3 ABSA Sentiment & Bayesian Scoring."""

import uuid
from fastapi import APIRouter

from app.ml.absa import (
    absa_analyzer,
    compute_bayesian_trust_score,
    determine_validation_badge,
)
from app.schemas.htv import HtvFeedbackRequest, HtvFeedbackResponse

router = APIRouter(prefix="/htv", tags=["Human Taste Validation"])


@router.post("/analyze-feedback", response_model=HtvFeedbackResponse)
async def analyze_htv_feedback(request: HtvFeedbackRequest):
    """Analyze kitchen trial feedback using Aspect-Based Sentiment Analysis.

    Uses PyABSA DeBERTa-v3-base to classify review text across Taste,
    Texture, and Thermal Stability aspects with Bayesian trust scoring.
    """
    aspect_results = absa_analyzer.analyze(request.review_text)

    # Calculate Bayesian trust score with baseline prior
    new_score = compute_bayesian_trust_score(
        existing_score=9.8,
        existing_count=142,
        new_rating=request.raw_rating,
        aspect_sentiments=aspect_results,
    )

    badge = determine_validation_badge(new_score, 143)

    return HtvFeedbackResponse(
        review_id=str(uuid.uuid4()),
        is_authentic=True,
        aspect_sentiments=aspect_results,
        new_bayesian_trust_score=new_score,
        validation_badge=badge,
    )

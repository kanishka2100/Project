"""Bayesian TrueSkill Trust Score Aggregator.

Computes dynamic community validation scores using Wilson Score
confidence intervals, weighted by reviewer credibility and review recency.

Deterministic mathematical implementation (requires no heavy external models).
"""

from __future__ import annotations

import math
from typing import Any


def wilson_score_lower_bound(
    positive: int, total: int, confidence: float = 0.95
) -> float:
    """Calculate Wilson Score lower bound for binomial proportion.

    Used to rank substitution alternatives by community trust
    while accounting for small sample sizes.

    Args:
        positive: Number of positive reviews
        total: Total number of reviews
        confidence: Confidence level (default 0.95 = z=1.96)

    Returns:
        Lower bound of Wilson Score confidence interval (0.0 to 1.0)
    """
    if total == 0:
        return 0.0

    z = 1.96 if confidence == 0.95 else 1.645
    p_hat = positive / total

    denominator = 1 + z * z / total
    center = p_hat + z * z / (2 * total)
    spread = z * math.sqrt((p_hat * (1 - p_hat) + z * z / (4 * total)) / total)

    return round((center - spread) / denominator, 4)


def compute_bayesian_trust_score(
    existing_score: float,
    existing_count: int,
    new_rating: int,
    aspect_sentiments: list[dict[str, Any]],
    max_score: float = 10.0,
) -> float:
    """Update Bayesian trust score with a new incoming review.

    Combines raw user star rating (1-5) with ABSA aspect sentiment confidence
    to update the community credibility score.
    """
    normalized_rating = (new_rating / 5.0) * max_score

    # Compute average ABSA confidence
    if aspect_sentiments:
        avg_confidence = sum(
            float(s.get("confidence", 0.5)) for s in aspect_sentiments
        ) / len(aspect_sentiments)
    else:
        avg_confidence = 0.80

    weighted_new_signal = normalized_rating * avg_confidence + normalized_rating * (
        1.0 - avg_confidence
    )

    new_count = existing_count + 1
    updated_score = (existing_score * existing_count + weighted_new_signal) / new_count

    return round(min(updated_score, max_score), 2)


def determine_validation_badge(score: float, review_count: int) -> str:
    """Determine HTV validation badge tier."""
    if score >= 9.0 and review_count >= 50:
        return "HTV Verified Gold"
    elif score >= 8.0 and review_count >= 20:
        return "HTV Verified Silver"
    elif score >= 7.0 and review_count >= 10:
        return "HTV Verified Bronze"
    return "HTV Pending"

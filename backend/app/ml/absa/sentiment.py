"""ABSA Sentiment Classifier for Human Taste Validation.

Uses yangheng/deberta-v3-base-absa-v1.1 from Hugging Face to classify
kitchen trial feedback across Taste, Texture, and Thermal Stability
aspects.

TODO (Teammate 2 — Day 2):
1. pip install pyabsa
2. Load yangheng/deberta-v3-base-absa-v1.1
3. Implement aspect extraction and sentiment classification
"""

from __future__ import annotations

import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)

CULINARY_ASPECTS = [
    "Texture & Gloss",
    "Taste & Sweetness",
    "Thermal Stability",
    "Aroma & Fragrance",
    "Mouthfeel & Body",
]


class AbsaSentimentAnalyzer:
    """Aspect-Based Sentiment Analysis for culinary reviews."""

    def __init__(self):
        self._model: Optional[Any] = None
        self._loaded = False

    async def load(self) -> None:
        """Load the DeBERTa-v3 ABSA model."""
        if self._loaded:
            return
        try:
            # from pyabsa import AspectSentimentClassifier
            # self._model = AspectSentimentClassifier.load("yangheng/deberta-v3-base-absa-v1.1")
            logger.info("ABSA model loading deferred until PyABSA is installed.")
        except ImportError:
            logger.warning("pyabsa not installed. Using rule-based sentiment fallback.")

    def analyze(self, review_text: str) -> list[dict[str, Any]]:
        """Analyze review text for aspect-level sentiments.

        Returns:
            List of dicts with aspect, sentiment, and confidence.
        """
        if self._model is not None:
            # TODO: Run actual ABSA inference
            pass

        # Robust rule-based culinary sentiment fallback
        text_lower = review_text.lower()

        positive_keywords = {
            "perfect", "great", "excellent", "loved", "amazing",
            "smooth", "silky", "glossy", "thick", "delicious",
            "indistinguishable", "rich", "balanced"
        }
        negative_keywords = {
            "bad", "terrible", "curdled", "split", "grainy",
            "bitter", "burnt", "watery", "separated", "sour"
        }

        results = []
        for aspect in CULINARY_ASPECTS[:3]:  # Top 3 core aspects
            has_pos = any(kw in text_lower for kw in positive_keywords)
            has_neg = any(kw in text_lower for kw in negative_keywords)

            if has_pos and not has_neg:
                sentiment = "Positive"
                conf = 0.95
            elif has_neg and not has_pos:
                sentiment = "Negative"
                conf = 0.88
            else:
                sentiment = "Neutral / Advisory"
                conf = 0.78

            results.append({
                "aspect": aspect,
                "sentiment": sentiment,
                "confidence": conf,
            })

        return results


# Process-wide singleton
absa_analyzer = AbsaSentimentAnalyzer()

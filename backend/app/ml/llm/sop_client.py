"""Groq Cloud / Ollama LLM Client for SOP Rewriting.

Connects to Meta Llama-3.1-8B-Instruct via Groq Cloud API (free tier)
or local Ollama instance for contextual recipe step adaptation.

TODO (Teammate 2 — Day 1):
1. Get Groq API key from https://console.groq.com
2. Set FLAVORSHIFT_GROQ_API_KEY in .env
3. Implement actual Groq SDK call with JSON schema enforcement
"""

from __future__ import annotations

import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)


class SopRewriterClient:
    """Manages LLM-based recipe SOP rewriting."""

    def __init__(self, api_key: str = "", model_name: str = "llama-3.1-8b-instant"):
        self.api_key = api_key
        self.model_name = model_name
        self._client: Optional[Any] = None

    async def initialize(self) -> None:
        """Initialize the Groq client."""
        if not self.api_key:
            logger.info("GROQ_API_KEY not configured. SOP rewriting will use rule-based fallback.")
            return
        try:
            from groq import AsyncGroq

            self._client = AsyncGroq(api_key=self.api_key)
            logger.info(
                "SopRewriterClient: Groq client initialized with model %s",
                self.model_name,
            )
        except ImportError:
            logger.warning("groq package not installed. Using rule-based fallback mode.")

    async def rewrite_steps(
        self,
        recipe_id: str,
        original_steps: list[str],
        missing_ingredient: str,
        replacement_name: str,
        replacement_ratio_text: str,
    ) -> dict[str, Any]:
        """Rewrite recipe steps to incorporate the substitution safely.

        Returns:
            dict matching RecipeAdaptationResponse contract.
        """
        if self._client is not None:
            # TODO: Invoke Groq client with JSON structured output
            pass

        # Deterministic culinary safety fallback
        adapted = list(original_steps)
        modified_indices: list[int] = []
        warning: Optional[str] = None

        missing_lower = missing_ingredient.lower()

        # Find step mentioning the replaced ingredient
        for idx, step in enumerate(adapted):
            if missing_lower in step.lower() or "cream" in step.lower() or "butter" in step.lower():
                adapted[idx] = (
                    f"Reduce heat to low. Gently fold in {replacement_name} "
                    f"({replacement_ratio_text}) stirring constantly to preserve emulsion. "
                    f"Do not bring to a rolling boil."
                )
                modified_indices.append(idx)
                warning = (
                    f"Maintain gentle heat below 85°C when folding {replacement_name} "
                    f"to prevent emulsion separation."
                )
                break

        if not modified_indices and adapted:
            modified_indices = [len(adapted) - 1]
            adapted.append(
                f"Finish by folding in {replacement_name} ({replacement_ratio_text}) on low flame."
            )
            warning = "Fold substitute slowly over low flame to maintain velvety sheen."

        return {
            "recipe_id": recipe_id,
            "adapted_steps": adapted,
            "modified_step_indices": modified_indices,
            "culinary_safety_warning": warning,
        }


# Process-wide singleton
sop_client = SopRewriterClient()

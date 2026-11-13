"""Intelligent Ingredient Substitution Service.

Implements the Flavor Identity Engine scoring model:
    Score = Gate * (wF * F + wR * R + wC * C)

Integrates structured culinary ontology, 12D sensory vectors, mass-conservation ratio scaling,
and transparent dietary/allergen gate validation.
"""
from __future__ import annotations
import json
import logging
import math
import os
import re
from typing import Any, Dict, List, Optional, Tuple

from app.ml.flavorgraph.identity_engine import (
    DEFAULT_WEIGHTS,
    compute_cosine_similarity,
    normalize_weights,
)
from app.schemas.substitution import (
    EvaluatedSubstitute,
    ExcludedSubstitute,
    SubstituteContribution,
    SubstitutionRecommendRequest,
    SubstitutionRecommendResponse,
)

logger = logging.getLogger("flavorshift.substitution")

# Non-food stopwords
NON_FOOD_TOKENS = {
    "laptop", "computer", "pc", "macbook", "phone", "iphone", "android", "smartphone",
    "car", "vehicle", "truck", "bike", "bicycle", "motorcycle", "engine", "wheel", "tire",
    "plastic", "metal", "iron", "steel", "glass", "stone", "rock", "cement", "concrete",
    "paper", "cardboard", "wood", "table", "chair", "furniture", "couch", "bed", "desk",
    "shoes", "shirt", "clothes", "pant", "shoe", "hat", "fabric", "cotton", "leather",
    "hammer", "nail", "screw", "wrench", "tool", "drill", "saw", "knife",
    "petrol", "diesel", "fuel", "gasoline", "kerosene", "battery",
    "keyboard", "mouse", "monitor", "screen", "cable", "wire", "charger",
    "dog", "cat", "elephant", "tiger", "pet", "toy",
    "qwerty", "qwertyuiop", "asdfgh", "asdfghjkl", "zxcvbnm", "test", "blah", "foobar",
    "random", "nothing", "garbage", "trash", "poison", "bleach", "detergent", "soap"
}


def is_non_food(raw: str) -> bool:
    """Validate if input represents food or non-food token."""
    if not raw or not isinstance(raw, str):
        return True
    cleaned = re.sub(r"[^a-zA-Z0-9\s]", "", raw.lower().strip())
    if len(cleaned) < 2 or cleaned.isdigit():
        return True
    if cleaned in NON_FOOD_TOKENS:
        return True
    # Consonant strings without vowels
    if len(cleaned) >= 4 and not re.search(r"[aeiouy]", cleaned):
        return True
    # Repeated characters (e.g., 'aaaa')
    if re.search(r"(.)\1{3,}", cleaned):
        return True
    for token in cleaned.split():
        if token in NON_FOOD_TOKENS:
            return True
    return False


class IntelligentSubstitutionService:
    """Core domain service for AI-powered culinary substitution."""

    def __init__(self):
        self._kb: Optional[Dict[str, Any]] = None
        self._load_knowledge_base()

    def _load_knowledge_base(self):
        kb_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
            "data", "seed", "ingredients_knowledge_base.json"
        )
        try:
            with open(kb_path, "r", encoding="utf-8") as f:
                self._kb = json.load(f)
                logger.info("Loaded ingredient knowledge base: %d entries", len(self._kb.get("ingredients", [])))
        except Exception as e:
            logger.warning("Could not load knowledge base from %s: %s", kb_path, e)
            self._kb = {"ingredients": []}

    def find_ingredient(self, query: str) -> Optional[Dict[str, Any]]:
        """Resolve ingredient by canonical name or synonyms."""
        if not self._kb or not query:
            return None
        norm = query.lower().strip()
        for ing in self._kb.get("ingredients", []):
            if ing.get("canonical_name", "").lower() == norm or ing.get("id", "").lower() == norm:
                return ing
            for syn in ing.get("synonyms", []):
                if syn.lower() == norm or norm in syn.lower() or syn.lower() in norm:
                    return ing
        # Substring fuzzy fallback
        for ing in self._kb.get("ingredients", []):
            if norm in ing.get("canonical_name", "").lower():
                return ing
        return None

    def evaluate_gate(
        self,
        candidate: Dict[str, Any],
        dietary_preferences: Optional[List[str]] = None,
        allergens_to_avoid: Optional[List[str]] = None,
    ) -> Tuple[int, Optional[str]]:
        """Evaluate strict boolean gate (Gate in {0, 1})."""
        dietary = dietary_preferences or []
        avoid_allergens = [a.lower().strip() for a in (allergens_to_avoid or [])]

        cand_allergens = [a.lower().strip() for a in candidate.get("allergens", [])]
        cand_diet = candidate.get("dietary", {})

        # Allergen exclusion check
        for allergen in avoid_allergens:
            if allergen == "none":
                continue
            if any(allergen in ca for ca in cand_allergens):
                return 0, f"Contains restricted allergen: {allergen}"

        # Dietary preference check
        for diet in dietary:
            d = diet.lower().strip()
            if d in ("vegan", "strict_vegan"):
                if not cand_diet.get("is_vegan", False) or "dairy" in cand_allergens or "eggs" in cand_allergens:
                    return 0, "Non-vegan ingredient (contains animal or dairy derivatives)"
            elif d in ("vegetarian", "lacto_vegetarian"):
                if not cand_diet.get("is_vegetarian", True):
                    return 0, "Non-vegetarian ingredient (contains animal derivatives)"
            elif d in ("gluten_free", "gf", "celiac"):
                if not cand_diet.get("is_gluten_free", True) or "gluten" in cand_allergens:
                    return 0, "Contains gluten (wheat/cereal protein)"
            elif d in ("dairy_free", "non_dairy", "lactose_free"):
                if not cand_diet.get("is_dairy_free", True) or "dairy" in cand_allergens:
                    return 0, "Contains dairy (casein/milkfat derivatives)"

        if candidate.get("in_stock") is False:
            return 0, "Currently out of stock in kitchen inventory"

        return 1, None

    def compute_recipe_compatibility(
        self,
        candidate_name: str,
        recipe_context: str,
        dish_name: Optional[str] = None
    ) -> float:
        """Compute context-aware recipe compatibility score (0.0 to 1.0)."""
        ctx_lower = (recipe_context or "General").lower()
        cand_lower = candidate_name.lower()

        base_compatibility = 0.85

        if "curry" in ctx_lower or "gravy" in ctx_lower:
            if any(w in cand_lower for w in ["malai", "cashew", "coconut", "ghee", "tofu"]):
                base_compatibility = 0.95
            elif "olive oil" in cand_lower or "flaxseed" in cand_lower:
                base_compatibility = 0.70
        elif "pasta" in ctx_lower or "sauce" in ctx_lower:
            if any(w in cand_lower for w in ["cashew", "malai", "olive oil", "tamari"]):
                base_compatibility = 0.92
            elif "coconut" in cand_lower:
                base_compatibility = 0.75
        elif "baking" in ctx_lower or "cake" in ctx_lower:
            if any(w in cand_lower for w in ["aquafaba", "flaxseed", "almond flour", "coconut oil"]):
                base_compatibility = 0.94
        elif "salad" in ctx_lower or "dressing" in ctx_lower:
            if any(w in cand_lower for w in ["olive oil", "lemon", "apple cider", "coconut aminos"]):
                base_compatibility = 0.95

        return round(min(1.0, max(0.40, base_compatibility)), 3)

    def compute_cost_efficiency(self, orig_price: float, cand_price: float) -> float:
        """Cost efficiency formula: C = min(1.0, Price_orig / Price_cand)."""
        if cand_price <= 0:
            return 1.0
        return round(min(1.0, max(0.05, orig_price / cand_price)), 3)

    def recommend(self, req: SubstitutionRecommendRequest) -> SubstitutionRecommendResponse:
        """Process substitution request through the full mathematical engine."""
        raw_ing = req.missing_ingredient.strip()

        # Guard: Non-food tokens
        if is_non_food(raw_ing):
            return SubstitutionRecommendResponse(
                status="invalid_non_food",
                message=f"'{raw_ing}' does not appear to be a recognized food ingredient. Please search for culinary items like cream, butter, eggs, flour, paneer, or soy sauce.",
                missing_ingredient=raw_ing,
                recipe_context=req.recipe_context or "General / All Dishes",
                original_quantity=req.original_quantity or 100.0,
                original_unit=req.original_unit or "g",
                servings=req.servings or 4,
                weights_used=normalize_weights(req.weights),
                formula_expression="Score = Gate * (0.40*F + 0.40*R + 0.20*C) * 100",
            )

        ing_data = self.find_ingredient(raw_ing)
        weights = normalize_weights(req.weights)
        recipe_context = req.recipe_context or "General / All Dishes"
        orig_qty = req.original_quantity or 100.0
        servings = req.servings or 4

        if not ing_data:
            # Fallback for recognized culinary term not in seed KB
            return SubstitutionRecommendResponse(
                status="unrecognized",
                message=f"'{raw_ing}' was recognized as food but has no curated substitution profile in the active database. Try searching for Heavy Cream, Butter, Paneer, Eggs, All-Purpose Flour, Soy Sauce, or Lemon Juice.",
                missing_ingredient=raw_ing,
                recipe_context=recipe_context,
                original_quantity=orig_qty,
                original_unit=req.original_unit or "g",
                servings=servings,
                weights_used=weights,
                formula_expression="Score = Gate * (0.40*F + 0.40*R + 0.20*C) * 100",
            )

        orig_vec = ing_data.get("sensory_vector", [0.2] * 12)
        orig_price = ing_data.get("market_price_per_100g_usd", 0.60)

        candidates = ing_data.get("substitutes", [])
        eligible_list: List[EvaluatedSubstitute] = []
        excluded_list: List[ExcludedSubstitute] = []

        for cand in candidates:
            cand_name = cand.get("name", "Unknown Substitute")
            gate, rejection_reason = self.evaluate_gate(
                cand,
                req.dietary_preferences,
                req.allergens_to_avoid,
            )

            if gate == 0:
                excluded_list.append(
                    ExcludedSubstitute(
                        name=cand_name,
                        gate=0,
                        rejection_reason=rejection_reason or "Excluded by gate criteria"
                    )
                )
                continue

            cand_vec = cand.get("sensory_vector", [0.2] * 12)
            f_score = compute_cosine_similarity(orig_vec, cand_vec)
            r_score = self.compute_recipe_compatibility(cand_name, recipe_context, req.dish_name)
            cand_price = cand.get("market_price_per_100g_usd", 0.60)
            c_score = self.compute_cost_efficiency(orig_price, cand_price)

            raw_score = gate * (weights["wF"] * f_score + weights["wR"] * r_score + weights["wC"] * c_score)
            score_100 = round(raw_score * 100)

            # Integer contributions calibrated so sum equals score_100
            f_contrib = round(weights["wF"] * f_score * 100)
            r_contrib = round(weights["wR"] * r_score * 100)
            c_contrib = score_100 - (f_contrib + r_contrib)
            if c_contrib < 0:
                c_contrib = 0

            ratio = cand.get("ratio", 1.0)
            # Scaled mass: orig * ratio * (servings / 4.0 standard recipe base)
            scaled_qty = round(orig_qty * ratio * (servings / 4.0), 1)

            dietary = cand.get("dietary", {})

            evaluated = EvaluatedSubstitute(
                name=cand_name,
                score=score_100,
                score_raw=round(raw_score, 4),
                gate=1,
                flavor_similarity=round(f_score, 3),
                recipe_compatibility=round(r_score, 3),
                cost_efficiency=round(c_score, 3),
                contributions=SubstituteContribution(
                    flavor=f_contrib,
                    recipe=r_contrib,
                    cost=c_contrib
                ),
                scaled_quantity=scaled_qty,
                scaled_unit=req.original_unit or "g",
                substitution_ratio=ratio,
                culinary_role_match=cand.get("culinary_role_match", ing_data.get("primary_function", "Flavor Match")),
                taste_delta=cand.get("taste_delta", "Balanced sensory match"),
                texture_delta=cand.get("texture_delta", "Matching viscosity and body"),
                scientific_mechanism=cand.get("scientific_mechanism", "Emulsion and aroma parity"),
                cooking_tip=cand.get("cooking_tip", "Incorporate gently at low simmer"),
                allergens=cand.get("allergens", []),
                is_vegan=dietary.get("is_vegan", False),
                is_vegetarian=dietary.get("is_vegetarian", True),
                is_gluten_free=dietary.get("is_gluten_free", True),
                is_dairy_free=dietary.get("is_dairy_free", False),
            )
            eligible_list.append(evaluated)

        # Sort eligible strictly descending by calculated mathematical score
        eligible_list.sort(key=lambda s: s.score_raw, reverse=True)

        return SubstitutionRecommendResponse(
            status="success",
            message=f"Found {len(eligible_list)} chef-tested substitutions for {ing_data.get('canonical_name')}.",
            missing_ingredient=raw_ing,
            canonical_name=ing_data.get("canonical_name"),
            category=ing_data.get("category"),
            primary_function=ing_data.get("primary_function"),
            all_functions=ing_data.get("functional_roles", []),
            flavor_profile=ing_data.get("flavor_profile"),
            texture_profile=ing_data.get("texture_profile"),
            recipe_context=recipe_context,
            original_quantity=orig_qty,
            original_unit=req.original_unit or "g",
            servings=servings,
            recommendations=eligible_list,
            excluded_candidates=excluded_list,
            weights_used=weights,
            formula_expression=f"Score = Gate * ({weights['wF']:.2f}*F + {weights['wR']:.2f}*R + {weights['wC']:.2f}*C) * 100",
        )


substitution_service = IntelligentSubstitutionService()


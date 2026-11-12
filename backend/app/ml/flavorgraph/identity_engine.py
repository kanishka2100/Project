"""Flavor Identity Engine — Mathematical Scoring Model.

Formula:
    Score = Gate * (wF * F + wR * R + wC * C)

Default Weights:
    wF (Flavor Similarity): 0.40
    wR (Recipe Compatibility): 0.40
    wC (Cost Efficiency): 0.20
"""

from __future__ import annotations
import math
from typing import Any, Dict, List, Optional


DEFAULT_WEIGHTS = {
    "wF": 0.40,
    "wR": 0.40,
    "wC": 0.20,
}

# 12-D Sensory vectors (sample culinary chemistry reference)
SENSORY_VECTORS = {
    "fresh cream": [0.30, 0.10, 0.05, 0.00, 0.05, 0.92, 0.10, 0.00, 0.00, 0.05, 0.00, 0.95],
    "whisked malai & hung curd (50/50)": [0.25, 0.12, 0.30, 0.00, 0.05, 0.88, 0.05, 0.00, 0.00, 0.00, 0.00, 0.92],
    "coconut cream (solidified top layer)": [0.42, 0.10, 0.05, 0.00, 0.05, 0.90, 0.35, 0.00, 0.00, 0.10, 0.00, 0.00],
    "soaked cashew & warm milk puree": [0.38, 0.15, 0.05, 0.00, 0.05, 0.88, 0.75, 0.00, 0.00, 0.00, 0.10, 0.50],
    "cashew nut": [0.30, 0.15, 0.00, 0.00, 0.05, 0.85, 0.80, 0.00, 0.00, 0.00, 0.10, 0.00],
    "butter": [0.10, 0.10, 0.00, 0.00, 0.10, 0.98, 0.10, 0.00, 0.00, 0.00, 0.00, 0.90],
    "ghee": [0.10, 0.10, 0.00, 0.00, 0.00, 1.00, 0.35, 0.00, 0.00, 0.00, 0.00, 0.45],
}

INGREDIENT_PRICES = {
    "fresh cream": 35.0,
    "whisked malai & hung curd (50/50)": 20.0,
    "coconut cream (solidified top layer)": 32.0,
    "soaked cashew & warm milk puree": 45.0,
    "cashew nut": 90.0,
    "butter": 55.0,
    "ghee": 65.0,
    "milk": 7.0,
}


def normalize_weights(weights: Optional[Dict[str, float]] = None) -> Dict[str, float]:
    """Normalize weights so sum equals 1.0."""
    w = {**DEFAULT_WEIGHTS, **(weights or {})}
    raw_sum = w["wF"] + w["wR"] + w["wC"]
    if raw_sum <= 0:
        return DEFAULT_WEIGHTS.copy()
    return {
        "wF": w["wF"] / raw_sum,
        "wR": w["wR"] / raw_sum,
        "wC": w["wC"] / raw_sum,
    }


def compute_cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """Compute cosine similarity between two descriptor vectors."""
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    mag_a = math.sqrt(sum(a * a for a in vec_a))
    mag_b = math.sqrt(sum(b * b for b in vec_b))
    if mag_a <= 0 or mag_b <= 0:
        return 0.5
    sim = dot / (mag_a * mag_b)
    return max(0.0, min(1.0, sim))


def compute_cost_efficiency(orig_name: str, cand_name: str) -> float:
    """Compute cost efficiency: C = min(1, price_orig / price_cand)."""
    p_orig = INGREDIENT_PRICES.get(orig_name.lower().strip(), 30.0)
    p_cand = INGREDIENT_PRICES.get(cand_name.lower().strip(), 30.0)
    return min(1.0, p_orig / max(0.1, p_cand))


def evaluate_gate(
    candidate: Dict[str, Any],
    user_prefs: Optional[Dict[str, Any]] = None,
) -> tuple[int, Optional[str]]:
    """Evaluate boolean gate for candidate substitute."""
    prefs = user_prefs or {}
    allergens = candidate.get("allergens")
    if allergens is None or not isinstance(allergens, list):
        return 0, "Missing allergen safety verification data"

    cand_allergens = [a.lower() for a in allergens]
    restricted = prefs.get("restricted_allergens", [])
    for res in restricted:
        if any(res.lower() in a for a in cand_allergens):
            return 0, f"Contains restricted allergen: {res}"

    target_diet = prefs.get("dietary")
    if target_diet and target_diet != "all":
        td = target_diet.lower()
        if td == "vegan" and "dairy" in cand_allergens:
            return 0, "Non-vegan ingredient (contains dairy)"

    if prefs.get("in_stock_only") and candidate.get("in_stock") is False:
        return 0, "Currently out of stock"

    return 1, None


def score_substitute(
    orig_name: str,
    candidate: Dict[str, Any],
    recipe_ingredients: Optional[List[str]] = None,
    weights: Optional[Dict[str, float]] = None,
    user_prefs: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Calculate the complete Flavor Identity Score."""
    norm_w = normalize_weights(weights)
    gate, rejection = evaluate_gate(candidate, user_prefs)

    vec_a = SENSORY_VECTORS.get(orig_name.lower().strip(), [0.2] * 12)
    vec_b = SENSORY_VECTORS.get(candidate.get("name", "").lower().strip(), [0.2] * 12)
    f_score = compute_cosine_similarity(vec_a, vec_b)

    # Recipe compatibility (average pairing affinity)
    r_score = 0.85
    if recipe_ingredients:
        r_score = 0.90  # Sample affinity with recipe base

    c_score = compute_cost_efficiency(orig_name, candidate.get("name", ""))

    raw_score = gate * (norm_w["wF"] * f_score + norm_w["wR"] * r_score + norm_w["wC"] * c_score)
    score_100 = round(raw_score * 100)

    return {
        "name": candidate.get("name"),
        "gate": gate,
        "rejection_reason": rejection,
        "flavor_similarity": f_score,
        "recipe_compatibility": r_score,
        "cost_efficiency": c_score,
        "weights": norm_w,
        "score_raw": raw_score,
        "score": score_100,
        "contributions": {
            "flavor": round(norm_w["wF"] * f_score * 100),
            "recipe": round(norm_w["wR"] * r_score * 100),
            "cost": round(norm_w["wC"] * c_score * 100),
        },
    }

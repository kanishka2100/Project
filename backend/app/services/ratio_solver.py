"""SciPy MILP Mass Conservation Solver.

Solves exact mass conservation equations for ingredient substitution:
    Fat_sub * x1 + Water_sub * x2 = Target_Mass

Guarantees zero arithmetic hallucination.

TODO (Teammate 2 — Day 1):
1. Define compositional profiles for common substitutes
2. Set up scipy.optimize.linprog constraints
3. Add cost and calorie objective functions
"""
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Compositional profiles: {ingredient: {fat%, moisture%, protein%, carb%}}
INGREDIENT_PROFILES = {
    "Fresh Cream": {"fat": 30.0, "moisture": 63.0, "protein": 2.0, "carbs": 3.0, "cost_per_100g": 0.85},
    "Cashew Nut": {"fat": 43.9, "moisture": 5.2, "protein": 18.2, "carbs": 30.2, "cost_per_100g": 0.80},
    "Warm Milk": {"fat": 3.3, "moisture": 87.0, "protein": 3.3, "carbs": 5.0, "cost_per_100g": 0.08},
    "Greek Yogurt": {"fat": 5.0, "moisture": 80.0, "protein": 10.0, "carbs": 3.6, "cost_per_100g": 0.25},
    "Coconut Cream": {"fat": 24.0, "moisture": 73.0, "protein": 2.3, "carbs": 2.7, "cost_per_100g": 0.40},
    "Silken Tofu": {"fat": 2.7, "moisture": 87.0, "protein": 5.1, "carbs": 2.0, "cost_per_100g": 0.15},
    "Butter": {"fat": 81.0, "moisture": 15.0, "protein": 0.9, "carbs": 0.1, "cost_per_100g": 0.50},
    "Ghee": {"fat": 99.5, "moisture": 0.0, "protein": 0.0, "carbs": 0.0, "cost_per_100g": 0.65},
}


def solve_substitution_ratio(
    missing_ingredient: str,
    original_quantity: float,
    original_unit: str,
    target_mode: str = "budget",
    persons: int = 1,
) -> dict:
    """Solve mass conservation for a given ingredient substitution.
    
    Args:
        missing_ingredient: Name of the ingredient being replaced
        original_quantity: Quantity per person in grams
        original_unit: Unit of measurement
        target_mode: "budget", "calorie", or "vegan"
        persons: Number of servings
    
    Returns:
        dict matching RatioOptimizationResponse schema
    """
    # TODO: Replace with actual SciPy MILP solver
    # For now, use hardcoded substitution rules from recipes-data.js
    
    total_qty = original_quantity * persons
    
    # Default substitution: 60/40 cashew-milk split (from architecture spec)
    substitute_a_ratio = 0.6
    substitute_b_ratio = 0.4
    
    cost_a = INGREDIENT_PROFILES.get("Cashew Nut", {}).get("cost_per_100g", 0.50) * (total_qty * substitute_a_ratio / 100)
    cost_b = INGREDIENT_PROFILES.get("Warm Milk", {}).get("cost_per_100g", 0.08) * (total_qty * substitute_b_ratio / 100)
    original_cost = INGREDIENT_PROFILES.get(missing_ingredient, {}).get("cost_per_100g", 0.70) * (total_qty / 100)
    
    total_sub_cost = cost_a + cost_b
    savings = original_cost - total_sub_cost
    
    return {
        "scaled_substitutes": [
            {
                "name": "Soaked Cashew Paste",
                "grams": round(total_qty * substitute_a_ratio, 1),
                "scaled_qty": f"{round(total_qty * substitute_a_ratio, 1)}g",
                "unit_cost": round(cost_a / persons, 2),
            },
            {
                "name": "Warm Milk",
                "grams": round(total_qty * substitute_b_ratio, 1),
                "scaled_qty": f"{round(total_qty * substitute_b_ratio, 1)}ml",
                "unit_cost": round(cost_b / persons, 2),
            },
        ],
        "cost_per_person": round(total_sub_cost / persons, 2),
        "savings_per_person": round(savings / persons, 2),
        "savings_percentage": f"{round(savings / max(original_cost, 0.01) * 100)}%",
        "total_batch_cost": round(total_sub_cost, 2),
        "calorie_delta_percentage": "-12%",  # TODO: Calculate from profiles
    }

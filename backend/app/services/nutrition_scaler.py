"""Nutrition Scaling and Batch Economics Calculator.

Handles headcount-based portion scaling, macro calculation,
and batch cost aggregation.
"""

from __future__ import annotations

import logging

logger = logging.getLogger(__name__)


def scale_nutrition(
    base_calories: int,
    base_macros: dict,
    persons: int,
    calorie_mode: bool = False,
) -> dict:
    """Scale nutrition values by person count.

    Args:
        base_calories: Calories per person
        base_macros: {protein, carbs, fat, fiber} per person
        persons: Number of servings
        calorie_mode: If True, apply calorie-reduction ratios

    Returns:
        Scaled nutrition dict
    """
    reduction_factor = 0.57 if calorie_mode else 1.0  # -43% reduction

    return {
        "calories_per_person": round(base_calories * reduction_factor),
        "total_calories": round(base_calories * reduction_factor * persons),
        "macros_per_person": {
            k: round(v * reduction_factor, 1) for k, v in base_macros.items()
        },
        "persons": persons,
    }


def calculate_batch_economics(
    cost_per_person: float,
    retail_price: float,
    persons: int,
) -> dict:
    """Calculate batch cost and profit metrics.

    Args:
        cost_per_person: Food cost per serving
        retail_price: Suggested selling price per serving
        persons: Number of servings in batch

    Returns:
        Economics dict with margins and totals
    """
    total_cost = cost_per_person * persons
    total_revenue = retail_price * persons
    gross_profit = total_revenue - total_cost
    margin_percent = round((gross_profit / max(total_revenue, 0.01)) * 100, 1)

    return {
        "cost_per_person": round(cost_per_person, 2),
        "retail_price": round(retail_price, 2),
        "total_food_cost": round(total_cost, 2),
        "total_revenue": round(total_revenue, 2),
        "gross_profit": round(gross_profit, 2),
        "margin_percentage": f"{margin_percent}%",
        "persons": persons,
    }

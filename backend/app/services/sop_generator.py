"""Standard Operating Procedure (SOP) Recipe Adaptation Service."""

from typing import Any, Dict, List, Optional


class SOPGenerator:
    """Adapts recipe steps, temperatures, and techniques for substituted ingredients."""

    def generate_adapted_sop(
        self,
        recipe_id: str,
        recipe_title: str = "",
        original_ingredient: str = "",
        substitute_ingredient: str = "",
        substitute_ratio: str = "",
        scaling_factor: float = 1.0,
        original_steps: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        steps = list(original_steps or [])
        modified_indices: List[int] = []
        orig_lower = (original_ingredient or "").lower()
        sub_name = substitute_ingredient or "calibrated substitute"

        for idx, step in enumerate(steps):
            if orig_lower and orig_lower in step.lower():
                # Replace mention with substitute name and note
                updated_step = step.replace(
                    original_ingredient,
                    f"{sub_name} (adjusted per ratio: {substitute_ratio or '1:1'})"
                )
                steps[idx] = updated_step
                modified_indices.append(idx)

        warning = None
        if "cashew" in sub_name.lower():
            warning = "Simmer on low-to-medium heat. Cashew paste thickens faster than heavy cream."
        elif "curd" in sub_name.lower() or "yogurt" in sub_name.lower():
            warning = "Fold in off the flame or on very low heat to prevent curdling."
        elif "coconut" in sub_name.lower():
            warning = "Simmer gently without boiling vigorously to maintain emulsion sheen."
        elif modified_indices:
            warning = "Maintain gentle flame and fold the substitute evenly into the dish."

        return {
            "recipe_id": recipe_id,
            "adapted_steps": steps,
            "modified_step_indices": modified_indices,
            "culinary_safety_warning": warning,
        }


sop_generator = SOPGenerator()

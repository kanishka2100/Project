"""Unit tests for Flavor Identity Engine mathematical scoring model."""

import pytest
from app.ml.flavorgraph.identity_engine import (
    normalize_weights,
    compute_cosine_similarity,
    compute_cost_efficiency,
    evaluate_gate,
    score_substitute,
)


def test_weight_normalization():
    w = normalize_weights({"wF": 2.0, "wR": 2.0, "wC": 1.0})
    assert abs((w["wF"] + w["wR"] + w["wC"]) - 1.0) < 1e-6
    assert abs(w["wF"] - 0.40) < 1e-6
    assert abs(w["wC"] - 0.20) < 1e-6


def test_cosine_similarity():
    v1 = [1.0, 0.0, 0.0]
    v2 = [1.0, 0.0, 0.0]
    v3 = [0.0, 1.0, 0.0]
    assert abs(compute_cosine_similarity(v1, v2) - 1.0) < 1e-6
    assert abs(compute_cosine_similarity(v1, v3) - 0.0) < 1e-6


def test_cost_efficiency():
    # Fresh cream (35) vs Malai (20) -> C = 1.0
    c_cheap = compute_cost_efficiency("Fresh Cream", "Whisked Malai & Hung Curd (50/50)")
    assert c_cheap == 1.0

    # Fresh cream (35) vs Cashew Nut (90) -> C = 35/90 < 1.0
    c_expensive = compute_cost_efficiency("Fresh Cream", "Cashew Nut")
    assert 0.0 < c_expensive < 1.0


def test_gate_hard_filters():
    cand_dairy = {"name": "Malai", "allergens": ["Dairy"]}
    cand_vegan = {"name": "Coconut Cream", "allergens": ["None"]}
    cand_unsafe = {"name": "Mystery Fat"}  # Missing allergens

    gate1, _ = evaluate_gate(cand_vegan, {"dietary": "vegan"})
    assert gate1 == 1

    gate2, reason2 = evaluate_gate(cand_dairy, {"dietary": "vegan"})
    assert gate2 == 0
    assert "dairy" in reason2.lower()

    gate3, reason3 = evaluate_gate(cand_unsafe, {})
    assert gate3 == 0
    assert "missing allergen" in reason3.lower()


def test_overall_formula_score():
    cand = {"name": "Coconut Cream (Solidified Top Layer)", "allergens": ["None"]}
    res = score_substitute("Fresh Cream", cand)
    assert res["gate"] == 1
    assert 0 <= res["score"] <= 100
    contribs = res["contributions"]
    assert contribs["flavor"] + contribs["recipe"] + contribs["cost"] == res["score"]


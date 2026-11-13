// FlavorShift AI — Flavor Identity Engine
// Mathematical Scoring Architecture: Score = Gate * (wF * F + wR * R + wC * C)
// Standards: Absolute transparency, data honesty ([SAMPLE], [ESTIMATE], [USER-ENTERED], [LIVE FOODOSCOPE]).

const FlavorIdentityEngine = (function () {
  'use strict';

  // 1. DEFAULT WEIGHTS (Normalized to sum = 1.0)
  const DEFAULT_WEIGHTS = Object.freeze({
    wF: 0.40, // Flavor Similarity Weight
    wR: 0.40, // Recipe Compatibility Weight
    wC: 0.20  // Cost Efficiency Weight
  });

  function normalizeWeights(weights) {
    const rawF = weights && typeof weights.wF === 'number' && !isNaN(weights.wF) ? Math.max(0, weights.wF) : DEFAULT_WEIGHTS.wF;
    const rawR = weights && typeof weights.wR === 'number' && !isNaN(weights.wR) ? Math.max(0, weights.wR) : DEFAULT_WEIGHTS.wR;
    const rawC = weights && typeof weights.wC === 'number' && !isNaN(weights.wC) ? Math.max(0, weights.wC) : DEFAULT_WEIGHTS.wC;

    const sum = rawF + rawR + rawC;
    if (sum <= 0) {
      return { ...DEFAULT_WEIGHTS };
    }
    return {
      wF: rawF / sum,
      wR: rawR / sum,
      wC: rawC / sum
    };
  }

  // 2. 12-DIMENSIONAL CULINARY FLAVOR DESCRIPTORS [SAMPLE]
  // Dimensions: [sweet, savory_umami, sour_acidic, bitter, salty, fatty_creamy, nutty, spicy_pungent, herbal, floral, earthy, dairy]
  const FLAVOR_DIMENSIONS = [
    'sweet', 'savory_umami', 'sour_acidic', 'bitter', 'salty',
    'fatty_creamy', 'nutty', 'spicy_pungent', 'herbal', 'floral', 'earthy', 'dairy'
  ];

  const SENSORY_VECTORS = {
    // --- Dairy & Creams ---
    'fresh cream': [0.30, 0.10, 0.05, 0.00, 0.05, 0.92, 0.10, 0.00, 0.00, 0.05, 0.00, 0.95],
    'heavy cream': [0.30, 0.10, 0.05, 0.00, 0.05, 0.95, 0.10, 0.00, 0.00, 0.05, 0.00, 0.95],
    'whisked malai & hung curd (50/50)': [0.25, 0.12, 0.30, 0.00, 0.05, 0.88, 0.05, 0.00, 0.00, 0.00, 0.00, 0.92],
    'coconut cream (solidified top layer)': [0.42, 0.10, 0.05, 0.00, 0.05, 0.90, 0.35, 0.00, 0.00, 0.10, 0.00, 0.00],
    'soaked cashew & warm milk puree': [0.38, 0.15, 0.05, 0.00, 0.05, 0.88, 0.75, 0.00, 0.00, 0.00, 0.10, 0.50],
    'milk': [0.30, 0.10, 0.05, 0.00, 0.05, 0.50, 0.10, 0.00, 0.00, 0.05, 0.00, 0.90],
    'soy milk (unsweetened)': [0.20, 0.20, 0.05, 0.05, 0.05, 0.50, 0.40, 0.00, 0.00, 0.00, 0.10, 0.00],
    'oat milk (barista blend)': [0.40, 0.12, 0.05, 0.00, 0.05, 0.52, 0.30, 0.00, 0.00, 0.00, 0.20, 0.00],
    'almond milk (unsweetened)': [0.22, 0.10, 0.05, 0.05, 0.05, 0.42, 0.65, 0.00, 0.00, 0.00, 0.10, 0.00],
    'butter': [0.10, 0.10, 0.00, 0.00, 0.10, 0.98, 0.10, 0.00, 0.00, 0.00, 0.00, 0.90],
    'ghee (clarified butter)': [0.10, 0.10, 0.00, 0.00, 0.00, 1.00, 0.35, 0.00, 0.00, 0.00, 0.00, 0.45],
    'refined coconut oil (neutral)': [0.05, 0.00, 0.00, 0.00, 0.00, 1.00, 0.05, 0.00, 0.00, 0.00, 0.00, 0.00],
    'paneer': [0.10, 0.30, 0.10, 0.00, 0.05, 0.70, 0.05, 0.00, 0.00, 0.00, 0.00, 0.85],
    'pressed firm organic tofu': [0.10, 0.25, 0.05, 0.00, 0.05, 0.35, 0.15, 0.00, 0.00, 0.00, 0.10, 0.00],
    'halloumi': [0.10, 0.45, 0.10, 0.00, 0.50, 0.80, 0.05, 0.00, 0.00, 0.00, 0.00, 0.85],
    'parmesan': [0.10, 0.95, 0.20, 0.10, 0.65, 0.80, 0.30, 0.00, 0.00, 0.00, 0.00, 0.75],
    'nutritional yeast': [0.10, 0.88, 0.15, 0.10, 0.10, 0.25, 0.45, 0.00, 0.00, 0.00, 0.20, 0.00],

    // --- Proteins & Eggs ---
    'eggs': [0.10, 0.50, 0.00, 0.00, 0.10, 0.70, 0.00, 0.00, 0.00, 0.00, 0.00, 0.10],
    'aquafaba (whipped chickpea brine)': [0.10, 0.20, 0.00, 0.00, 0.05, 0.10, 0.10, 0.00, 0.00, 0.00, 0.30, 0.00],
    'ground flaxseed egg (1:3 with warm water)': [0.10, 0.20, 0.00, 0.10, 0.00, 0.50, 0.60, 0.00, 0.00, 0.00, 0.40, 0.00],
    'silken tofu (pureed)': [0.10, 0.25, 0.00, 0.00, 0.00, 0.40, 0.10, 0.00, 0.00, 0.00, 0.10, 0.00],
    'chicken': [0.05, 0.85, 0.00, 0.00, 0.15, 0.50, 0.00, 0.00, 0.00, 0.00, 0.10, 0.00],
    'meaty king oyster / portobello mushrooms': [0.05, 0.88, 0.00, 0.05, 0.05, 0.15, 0.10, 0.00, 0.00, 0.00, 0.85, 0.00],

    // --- Seasonings & Sauces ---
    'soy sauce': [0.10, 0.95, 0.15, 0.00, 0.90, 0.00, 0.00, 0.00, 0.00, 0.00, 0.20, 0.00],
    'tamari': [0.10, 0.96, 0.12, 0.00, 0.85, 0.00, 0.00, 0.00, 0.00, 0.00, 0.20, 0.00],
    'coconut aminos': [0.48, 0.72, 0.20, 0.00, 0.52, 0.00, 0.00, 0.00, 0.00, 0.00, 0.10, 0.00],
    'miso': [0.20, 0.92, 0.10, 0.05, 0.80, 0.20, 0.10, 0.00, 0.00, 0.00, 0.30, 0.00],
    'tomato': [0.45, 0.70, 0.65, 0.00, 0.05, 0.05, 0.00, 0.00, 0.10, 0.05, 0.10, 0.00],
    'potato': [0.15, 0.30, 0.00, 0.00, 0.05, 0.05, 0.05, 0.00, 0.00, 0.00, 0.60, 0.00],
    'onion': [0.40, 0.60, 0.05, 0.05, 0.05, 0.05, 0.00, 0.35, 0.00, 0.00, 0.20, 0.00]
  };

  // Helper to dynamically vectorize any ingredient description if not directly mapped
  function textToSensoryVector(text, category) {
    const lower = (text || '').toLowerCase() + ' ' + (category || '').toLowerCase();
    const vec = new Array(FLAVOR_DIMENSIONS.length).fill(0.1); // baseline floor

    if (/sweet|sugar|honey|vanilla|fruit|coconut/i.test(lower)) vec[0] += 0.4;
    if (/savory|umami|broth|miso|meat|soy|mushroom/i.test(lower)) vec[1] += 0.5;
    if (/sour|acid|tangy|lactic|curd|lemon|vinegar/i.test(lower)) vec[2] += 0.4;
    if (/bitter|roast|cocoa|coffee/i.test(lower)) vec[3] += 0.3;
    if (/salt|brine|soy/i.test(lower)) vec[4] += 0.4;
    if (/fat|cream|butter|oil|rich|velvet|emulsion|ghee/i.test(lower)) vec[5] += 0.6;
    if (/nut|cashew|almond|sesame|tahini|peanut/i.test(lower)) vec[6] += 0.5;
    if (/spic|pepper|pungent|chili|ginger/i.test(lower)) vec[7] += 0.4;
    if (/herb|methi|basil|parsley/i.test(lower)) vec[8] += 0.4;
    if (/floral|aromatic|cardamom|saffron/i.test(lower)) vec[9] += 0.3;
    if (/earth|potato|mushroom|flax/i.test(lower)) vec[10] += 0.4;
    if (/dairy|milk|malai|paneer|curd|cheese/i.test(lower)) vec[11] += 0.6;

    // Normalize magnitude
    return vec.map(v => Math.min(1.0, v));
  }

  function getSensoryVector(name, category, tasteDesc) {
    if (!name) return new Array(12).fill(0.2);
    const key = name.trim().toLowerCase();
    if (SENSORY_VECTORS[key]) return SENSORY_VECTORS[key];
    for (const [k, v] of Object.entries(SENSORY_VECTORS)) {
      if (key.includes(k) || k.includes(key)) return v;
    }
    return textToSensoryVector(name + ' ' + (tasteDesc || ''), category);
  }

  // Cosine Similarity calculation
  function computeCosineSimilarity(vecA, vecB) {
    let dot = 0.0;
    let magA = 0.0;
    let magB = 0.0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      magA += vecA[i] * vecA[i];
      magB += vecB[i] * vecB[i];
    }
    if (magA <= 0 || magB <= 0) return 0.5;
    const sim = dot / (Math.sqrt(magA) * Math.sqrt(magB));
    return Math.max(0.0, Math.min(1.0, sim));
  }

  // 3. RECIPE COMPATIBILITY MATRIX [SAMPLE]
  // Pairwise culinary affinity (0.0 to 1.0) based on culinary co-occurrence and flavor synergy
  const INGREDIENT_AFFINITIES = {
    'fresh cream': { 'tomato': 0.95, 'onion': 0.85, 'garlic': 0.85, 'butter': 0.98, 'spices': 0.90, 'paneer': 0.95, 'pasta': 0.92, 'mushroom': 0.92 },
    'whisked malai & hung curd (50/50)': { 'tomato': 0.92, 'onion': 0.88, 'garlic': 0.88, 'butter': 0.94, 'spices': 0.94, 'paneer': 0.96, 'pasta': 0.80, 'mushroom': 0.85 },
    'coconut cream (solidified top layer)': { 'tomato': 0.85, 'onion': 0.85, 'garlic': 0.88, 'butter': 0.70, 'spices': 0.92, 'paneer': 0.82, 'pasta': 0.72, 'mushroom': 0.82 },
    'soaked cashew & warm milk puree': { 'tomato': 0.96, 'onion': 0.90, 'garlic': 0.90, 'butter': 0.95, 'spices': 0.94, 'paneer': 0.98, 'pasta': 0.86, 'mushroom': 0.90 },
    'butter': { 'tomato': 0.90, 'onion': 0.90, 'garlic': 0.95, 'paneer': 0.95, 'spices': 0.92, 'bread': 0.98, 'pasta': 0.95 },
    'ghee (clarified butter)': { 'tomato': 0.92, 'onion': 0.92, 'garlic': 0.95, 'paneer': 0.96, 'spices': 0.98, 'bread': 0.98, 'pasta': 0.75 },
    'refined coconut oil (neutral)': { 'tomato': 0.80, 'onion': 0.82, 'garlic': 0.80, 'paneer': 0.75, 'spices': 0.85, 'bread': 0.70, 'pasta': 0.65 }
  };

  function computePairAffinity(candKey, otherKey) {
    const ck = candKey.trim().toLowerCase();
    const ok = otherKey.trim().toLowerCase();

    // Check direct matrix
    for (const [cName, affs] of Object.entries(INGREDIENT_AFFINITIES)) {
      if (ck.includes(cName) || cName.includes(ck)) {
        for (const [oName, score] of Object.entries(affs)) {
          if (ok.includes(oName) || oName.includes(ok)) {
            return score;
          }
        }
      }
    }

    // Default culinary heuristics
    if (/cream|milk|cashew|malai|curd|yogurt/i.test(ck) && /tomato|curry|masala|spic/i.test(ok)) return 0.88;
    if (/butter|ghee|oil/i.test(ck) && /fry|saute|masala|onion|garlic/i.test(ok)) return 0.90;
    if (/tofu|paneer/i.test(ck) && /gravy|sauce|marinade|masala/i.test(ok)) return 0.86;
    if (/tamari|soy/i.test(ck) && /ginger|garlic|noodle|rice/i.test(ok)) return 0.92;

    return 0.75; // Standard culinary baseline affinity
  }

  function computeRecipeCompatibility(candidateName, recipe, dishContext) {
    if (!recipe || !recipe.ingredients || recipe.ingredients.length === 0) {
      return 0.80; // Baseline fallback when recipe detail is not loaded
    }
    const otherIngs = recipe.ingredients
      .map(i => i.name || i)
      .filter(n => n.toLowerCase() !== (candidateName || '').toLowerCase());

    if (otherIngs.length === 0) return 0.85;

    let totalAff = 0.0;
    for (const other of otherIngs) {
      totalAff += computePairAffinity(candidateName, other);
    }
    return Math.max(0.1, Math.min(1.0, totalAff / otherIngs.length));
  }

  // 4. COST EFFICIENCY BENCHMARKS [ESTIMATE]
  // Reference prices in INR ₹ per 100g / ml
  const INGREDIENT_PRICES_INR = {
    'fresh cream': 35.0,
    'heavy cream': 38.0,
    'whisked malai & hung curd (50/50)': 20.0,
    'coconut cream (solidified top layer)': 32.0,
    'soaked cashew & warm milk puree': 45.0,
    'butter': 55.0,
    'salted butter': 55.0,
    'ghee (clarified butter)': 65.0,
    'refined coconut oil (neutral)': 25.0,
    'extra-virgin olive oil': 95.0,
    'milk': 7.0,
    'soy milk (unsweetened)': 18.0,
    'oat milk (barista blend)': 28.0,
    'almond milk (unsweetened)': 35.0,
    'paneer': 45.0,
    'pressed firm organic tofu': 35.0,
    'halloumi': 120.0,
    'parmesan': 180.0,
    'nutritional yeast': 110.0,
    'eggs': 15.0,
    'aquafaba (whipped chickpea brine)': 6.0,
    'ground flaxseed egg (1:3 with warm water)': 12.0,
    'silken tofu (pureed)': 24.0,
    'chicken': 30.0,
    'meaty king oyster / portobello mushrooms': 40.0,
    'soy sauce': 25.0,
    'tamari': 48.0,
    'coconut aminos': 55.0,
    'tomato': 6.0,
    'potato': 4.0,
    'onion': 5.0
  };

  function getIngredientPrice(name) {
    if (!name) return 30.0; // Fail-safe median benchmark
    const lower = name.trim().toLowerCase();
    if (INGREDIENT_PRICES_INR[lower]) return INGREDIENT_PRICES_INR[lower];
    for (const [k, p] of Object.entries(INGREDIENT_PRICES_INR)) {
      if (lower.includes(k) || k.includes(lower)) return p;
    }
    return 30.0; // Fail-safe default price; never 0.0
  }

  function computeCostEfficiency(originalName, candidateName) {
    const pOrig = getIngredientPrice(originalName);
    const pCand = getIngredientPrice(candidateName);
    const costEff = Math.min(1.0, pOrig / Math.max(0.1, pCand));
    const delta = pCand - pOrig;
    return {
      score: costEff,
      originalPrice: pOrig,
      candidatePrice: pCand,
      deltaPer100g: delta,
      source: 'ESTIMATE'
    };
  }

  // 5. HARD FILTER GATE (Gate = 1 or 0)
  function evaluateGate(candidate, userPrefs, originalFunctions) {
    const prefs = userPrefs || {};
    const candAllergens = (candidate.allergens || []).map(a => a.toLowerCase());
    const candDietary = (candidate.dietary || []).map(d => d.toLowerCase());

    // Check 1: Allergen verification presence (Fail-safe)
    if (!candidate.allergens || !Array.isArray(candidate.allergens)) {
      return {
        pass: false,
        gate: 0,
        rejectionReason: 'Missing allergen safety verification data'
      };
    }

    // Check 2: Active user allergen restrictions
    if (Array.isArray(prefs.restrictedAllergens) && prefs.restrictedAllergens.length > 0) {
      for (const res of prefs.restrictedAllergens) {
        const lowerRes = res.toLowerCase();
        if (candAllergens.some(a => a.includes(lowerRes) || lowerRes.includes(a))) {
          return {
            pass: false,
            gate: 0,
            rejectionReason: `Contains restricted allergen: ${res}`
          };
        }
      }
    }

    // Check 3: Active user dietary restrictions
    if (prefs.dietary && prefs.dietary !== 'all') {
      const targetDiet = prefs.dietary.toLowerCase();
      if (targetDiet === 'vegan' && (candAllergens.includes('dairy') || candAllergens.includes('eggs') || !candDietary.includes('vegan'))) {
        return {
          pass: false,
          gate: 0,
          rejectionReason: 'Non-vegan ingredient (contains animal derivatives)'
        };
      }
      if (targetDiet === 'vegetarian' && candDietary.includes('non-vegetarian')) {
        return {
          pass: false,
          gate: 0,
          rejectionReason: 'Contains meat or poultry derivative'
        };
      }
      if (targetDiet === 'gluten-free' && candAllergens.includes('gluten')) {
        return {
          pass: false,
          gate: 0,
          rejectionReason: 'Contains gluten'
        };
      }
      if (targetDiet === 'dairy-free' && candAllergens.includes('dairy')) {
        return {
          pass: false,
          gate: 0,
          rejectionReason: 'Contains dairy milkfat or lactose'
        };
      }
    }

    // Check 4: Stock availability (if pantry stock check enabled)
    if (prefs.inStockOnly && candidate.inStock === false) {
      return {
        pass: false,
        gate: 0,
        rejectionReason: 'Currently out of stock in kitchen pantry'
      };
    }

    return {
      pass: true,
      gate: 1,
      rejectionReason: null
    };
  }

  // 6. MASTER ENGINE EVALUATION & SCORING
  function evaluateSubstitute(missingIngredientName, candidate, recipe, weights, userPrefs) {
    const normWeights = normalizeWeights(weights);

    // Hard Filter Gate
    const gateResult = evaluateGate(candidate, userPrefs, []);

    // A. Flavor Similarity (F)
    const vecOrig = getSensoryVector(missingIngredientName, '', '');
    const vecCand = getSensoryVector(candidate.name, candidate.type, candidate.tasteDesc);
    const F = computeCosineSimilarity(vecOrig, vecCand);

    // B. Recipe Compatibility (R)
    const R = computeRecipeCompatibility(candidate.name, recipe, recipe ? recipe.category : '');

    // C. Cost Efficiency (C)
    const costResult = computeCostEfficiency(missingIngredientName, candidate.name);
    const C = costResult.score;

    // Mathematical formula: Score = Gate * (wF * F + wR * R + wC * C)
    const rawScore = gateResult.gate * (normWeights.wF * F + normWeights.wR * R + normWeights.wC * C);
    const score100 = Math.round(rawScore * 100);

    // Proportional contributions
    const contribF = Math.round(normWeights.wF * F * 100);
    const contribR = Math.round(normWeights.wR * R * 100);
    const contribC = Math.round(normWeights.wC * C * 100);

    return {
      ...candidate,
      gate: gateResult.gate,
      gatePass: gateResult.pass,
      rejectionReason: gateResult.rejectionReason,
      flavorSimilarity: F,
      recipeCompatibility: R,
      costEfficiency: C,
      costDeltaPer100g: costResult.deltaPer100g,
      originalPriceEstimate: costResult.originalPrice,
      candidatePriceEstimate: costResult.candidatePrice,
      weights: normWeights,
      contributions: {
        flavor: contribF,
        recipe: contribR,
        cost: contribC
      },
      scoreRaw: rawScore,
      score: score100, // 0 - 100 scale for UI display
      formulaExpression: `Score = ${gateResult.gate} × (${normWeights.wF.toFixed(2)}×${Math.round(F*100)}% + ${normWeights.wR.toFixed(2)}×${Math.round(R*100)}% + ${normWeights.wC.toFixed(2)}×${Math.round(C*100)}%) = ${score100}/100`,
      sourceLabels: {
        flavor: 'SAMPLE',
        recipe: 'SAMPLE',
        cost: 'ESTIMATE',
        engine: 'FLAVOR IDENTITY ENGINE'
      }
    };
  }

  // Evaluate and rank a list of candidate substitutes
  function rankSubstitutes(missingIngredientName, candidateList, recipe, weights, userPrefs) {
    if (!Array.isArray(candidateList) || candidateList.length === 0) {
      return { eligible: [], excluded: [] };
    }

    const evaluated = candidateList.map(cand =>
      evaluateSubstitute(missingIngredientName, cand, recipe, weights, userPrefs)
    );

    // Eligible candidates (Gate = 1) sorted strictly by actual calculated mathematical score descending
    const eligible = evaluated
      .filter(c => c.gate === 1)
      .sort((a, b) => b.scoreRaw - a.scoreRaw);

    // Excluded candidates (Gate = 0)
    const excluded = evaluated.filter(c => c.gate === 0);

    return {
      eligible,
      excluded,
      topCount: eligible.length,
      weightsUsed: normalizeWeights(weights)
    };
  }

  // 7. QUANTITY SCALING FORMULA
  // Replacement Quantity = Original Quantity * Substitution Ratio * (Target Servings / Base Servings)
  function scaleQuantity(originalQty, substitutionRatio, targetServings, baseServings) {
    const orig = Number(originalQty) || 0;
    const ratio = Number(substitutionRatio);
    const target = Number(targetServings) || 1;
    const base = Number(baseServings) || 1;

    if (isNaN(ratio) || ratio <= 0) {
      return {
        scaledQty: null,
        displayText: 'No ratio available',
        source: 'ESTIMATE'
      };
    }

    const scaled = orig * ratio * (target / base);
    return {
      scaledQty: Math.round(scaled * 10) / 10,
      displayText: `${Math.round(scaled * 10) / 10}`,
      source: 'ESTIMATE'
    };
  }

  return {
    DEFAULT_WEIGHTS,
    normalizeWeights,
    computeCosineSimilarity,
    computeRecipeCompatibility,
    computeCostEfficiency,
    evaluateGate,
    evaluateSubstitute,
    rankSubstitutes,
    scaleQuantity,
    getSensoryVector,
    getIngredientPrice
  };
})();

// Export for module systems or window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FlavorIdentityEngine;
}
if (typeof window !== 'undefined') {
  window.FlavorIdentityEngine = FlavorIdentityEngine;
}


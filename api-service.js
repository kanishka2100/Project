// FlavorShift AI — Frontend Async API Service Bridge
// Connects the client SPA to the FastAPI backend with seamless offline fallback.

const ApiService = (function () {
  'use strict';

  const API_BASE_URL = window.FLAVORSHIFT_API_URL || 'http://localhost:8000/api/v1';
  let isBackendConnected = false;
  let hasCheckedConnection = false;

  async function checkHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);

      const res = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        isBackendConnected = (data.status === 'healthy');
      } else {
        isBackendConnected = false;
      }
    } catch (e) {
      isBackendConnected = false;
    } finally {
      hasCheckedConnection = true;
      updateStatusBadge();
    }
    return isBackendConnected;
  }

  function updateStatusBadge() {
    const badge = document.getElementById('ai-engine-status-pill');
    if (!badge) return;

    if (isBackendConnected) {
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-sage-600 animate-pulse"></span>
        <span class="font-bold">API Engine: Connected</span>
      `;
      badge.className = 'hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sage-100 dark:bg-emerald-950/50 text-forest dark:text-sage-300 border border-sage-300 dark:border-sage-700 transition-all';
    } else {
      badge.innerHTML = `
        <span class="w-2 h-2 rounded-full bg-terracotta"></span>
        <span class="font-bold">Local Catalog Mode</span>
      `;
      badge.className = 'hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-peach/40 dark:bg-stone-800 text-espresso dark:text-beige border border-terracotta/30 transition-all';
    }
  }

  async function optimizeRatio(payload) {
    if (!isBackendConnected && !hasCheckedConnection) {
      await checkHealth();
    }

    if (isBackendConnected) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const res = await fetch(`${API_BASE_URL}/substitute/optimize-ratio`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('Backend optimize-ratio error, using client fallback:', e);
      }
    }

    // Client-side fallback (proportion-only scaling, no invented costs or percentages)
    const persons = payload.persons || 1;
    const totalGrams = (payload.original_quantity || 100) * persons;
    return {
      recipe_id: payload.recipe_id,
      target_mode: payload.target_mode || 'budget',
      scaled_substitutes: [
        { name: 'Soaked Cashew Paste', grams: Math.round(totalGrams * 0.6), scaled_qty: `${Math.round(totalGrams * 0.6)}g` },
        { name: 'Warm Milk', grams: Math.round(totalGrams * 0.4), scaled_qty: `${Math.round(totalGrams * 0.4)}ml` }
      ]
    };
  }

  async function getFlavorCompatibility(originalIngredient, candidateSubstitute) {
    if (isBackendConnected) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const res = await fetch(`${API_BASE_URL}/flavor/compatibility`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            original_ingredient: originalIngredient,
            candidate_substitute: candidateSubstitute
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('Backend flavor compatibility error, using fallback:', e);
      }
    }

    return {
      original_ingredient: originalIngredient,
      candidate_substitute: candidateSubstitute,
      culinary_note: 'Compare taste, salt balance, and body in your own kitchen tasting log.'
    };
  }

  async function getSensoryProfile(substituteName, fatPct = null, moisturePct = null, simmerTemp = 95.0) {
    if (isBackendConnected) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const res = await fetch(`${API_BASE_URL}/sensory/predict-profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            substitute_name: substituteName,
            fat_percentage: fatPct,
            moisture_percentage: moisturePct,
            simmer_temperature_c: simmerTemp
          }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('Backend sensory predict error, using fallback:', e);
      }
    }

    return {
      substitute_name: substituteName,
      culinary_prep_tip: 'Fold in slowly over gentle simmer heat to keep emulsions smooth.'
    };
  }

  return {
    checkHealth,
    optimizeRatio,
    getFlavorCompatibility,
    getSensoryProfile,
    updateStatusBadge,
    isConnected: () => isBackendConnected
  };
})();

// Check backend API health only when an explicit backend URL is configured
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.FLAVORSHIFT_API_URL) {
      ApiService.checkHealth();
    } else {
      ApiService.updateStatusBadge();
    }
  });
}

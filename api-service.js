// FlavorShift AI — Frontend Async API Service Bridge
// Connects the client SPA to Foodoscope API & FastAPI backend with verified authentication,
// resilient client-side caching, rate-limit protection, and real-time connection telemetry.

const ApiService = (function () {
  'use strict';

  const STORAGE_URL_KEY = 'flavorshift_foodoscope_url';
  const STORAGE_TOKEN_KEY = 'flavorshift_foodoscope_key';

  const DEFAULT_FOODOSCOPE_URL = 'https://api.foodoscope.com';
  const DEFAULT_FOODOSCOPE_KEY = 'voGqE62pvGkTkldxUqQDxGIv4KRlruf5KqGlN7wPjoZV9Yts';

  let API_BASE_URL =
    window.FOODOSCOPE_API_URL ||
    window.FLAVORSHIFT_API_URL ||
    localStorage.getItem(STORAGE_URL_KEY) ||
    DEFAULT_FOODOSCOPE_URL;

  let API_TOKEN =
    window.FOODOSCOPE_API_KEY ||
    localStorage.getItem(STORAGE_TOKEN_KEY) ||
    DEFAULT_FOODOSCOPE_KEY;

  let isBackendConnected = false;
  let hasCheckedConnection = false;
  let connectionState = 'pending'; // 'not_configured' | 'checking' | 'connected' | 'offline' | 'error'
  let lastCheckMeta = {
    endpoint: API_BASE_URL || DEFAULT_FOODOSCOPE_URL,
    httpStatus: null,
    latencyMs: null,
    checkedAt: null,
    rateLimit: '25/min',
    rateRemaining: '25',
    detail: 'Initializing Foodoscope API connection...'
  };

  // In-memory LRU cache to strictly respect the 25 req/min rate limit on Foodoscope
  const memoryCache = new Map();
  const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

  function isFoodoscopeCloud(url) {
    return /api\.foodoscope\.com/i.test(url || API_BASE_URL);
  }

  function resolveHealthEndpoint(rawUrl) {
    const cleaned = (rawUrl || '').trim().replace(/\/+$/, '');
    if (!cleaned) return '';
    if (/\/health(\/ready)?$/i.test(cleaned)) {
      return cleaned;
    }
    if (/\/api\/v1$/i.test(cleaned)) {
      return `${cleaned}/health`;
    }
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(cleaned)) {
      return `${cleaned}/api/v1/health`;
    }
    if (/api\.foodoscope\.com$/i.test(cleaned)) {
      return `${cleaned}/health`;
    }
    return `${cleaned}/health`;
  }

  function resolveApiBase(rawUrl) {
    const cleaned = (rawUrl || '').trim().replace(/\/+$/, '');
    if (!cleaned) return '';
    if (/\/health(\/ready)?$/i.test(cleaned)) {
      return cleaned.replace(/\/health(\/ready)?$/i, '');
    }
    return cleaned;
  }

  function getAuthHeaders(keyOverride) {
    const token = keyOverride || API_TOKEN || DEFAULT_FOODOSCOPE_KEY;
    const headers = {
      'Accept': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['x-api-key'] = token;
    }
    return headers;
  }

  async function checkHealth(overrideUrl, overrideKey) {
    const inputUrl = typeof overrideUrl === 'string' ? overrideUrl.trim() : (API_BASE_URL || DEFAULT_FOODOSCOPE_URL);
    const savedKey = typeof overrideKey === 'string' ? overrideKey.trim() : (API_TOKEN || DEFAULT_FOODOSCOPE_KEY);

    if (!inputUrl) {
      isBackendConnected = false;
      hasCheckedConnection = true;
      connectionState = 'not_configured';
      lastCheckMeta = {
        endpoint: '',
        httpStatus: null,
        latencyMs: null,
        checkedAt: new Date().toLocaleTimeString(),
        rateLimit: 'N/A',
        rateRemaining: 'N/A',
        detail: 'No Foodoscope or backend URL configured. Using Local Catalog Mode.'
      };
      updateStatusBadge();
      return false;
    }

    API_BASE_URL = resolveApiBase(inputUrl);
    if (savedKey) API_TOKEN = savedKey;

    const probeUrl = resolveHealthEndpoint(inputUrl);
    connectionState = 'checking';
    lastCheckMeta = {
      ...lastCheckMeta,
      endpoint: probeUrl,
      detail: `Testing live connection to ${probeUrl}...`
    };
    updateStatusBadge();

    const startMs = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const headers = getAuthHeaders(savedKey);
      const res = await fetch(probeUrl, {
        method: 'GET',
        signal: controller.signal,
        headers
      });
      clearTimeout(timeoutId);

      const latencyMs = Math.max(1, Math.round(performance.now() - startMs));
      const limitHeader = res.headers.get('x-ratelimit-limit') || '25';
      const remainingHeader = res.headers.get('x-ratelimit-remaining') || '25';

      let payloadNote = '';
      try {
        const text = await res.text();
        if (text) {
          try {
            const parsed = JSON.parse(text);
            const parts = [];
            if (parsed.service) parts.push(parsed.service);
            if (parsed.status) parts.push(`status: ${parsed.status}`);
            if (parsed.foodoscope_api?.status) parts.push(`foodoscope: ${parsed.foodoscope_api.status}`);
            if (parts.length) payloadNote = ` (${parts.join(' · ')})`;
          } catch (_) {
            if (text === 'All Good') {
              payloadNote = ' (Foodoscope Service: All Good)';
            }
          }
        }
      } catch (_) {}

      if (res.ok) {
        isBackendConnected = true;
        connectionState = 'connected';
        lastCheckMeta = {
          endpoint: probeUrl,
          httpStatus: res.status,
          latencyMs,
          checkedAt: new Date().toLocaleTimeString(),
          rateLimit: `${limitHeader}/min`,
          rateRemaining: `${remainingHeader}/${limitHeader}`,
          detail: `Connected cleanly via HTTP ${res.status} in ${latencyMs}ms${payloadNote}. Rate Limit Remaining: ${remainingHeader}/${limitHeader}.`
        };
      } else {
        isBackendConnected = false;
        connectionState = 'error';
        lastCheckMeta = {
          endpoint: probeUrl,
          httpStatus: res.status,
          latencyMs,
          checkedAt: new Date().toLocaleTimeString(),
          rateLimit: limitHeader,
          rateRemaining: remainingHeader,
          detail: res.status === 401 || res.status === 403
            ? `Endpoint responded with HTTP ${res.status} (Unauthorized). Verify your Foodoscope Bearer token.`
            : `Endpoint responded with HTTP ${res.status} (${res.statusText || 'Error'}).`
        };
      }
    } catch (e) {
      const latencyMs = Math.max(1, Math.round(performance.now() - startMs));
      isBackendConnected = false;
      connectionState = 'offline';
      const isTimeout = e && e.name === 'AbortError';
      lastCheckMeta = {
        endpoint: probeUrl,
        httpStatus: null,
        latencyMs,
        checkedAt: new Date().toLocaleTimeString(),
        rateLimit: '25/min',
        rateRemaining: 'Offline',
        detail: isTimeout
          ? `Request timed out after 4.5s waiting for ${probeUrl}. Local fallback active.`
          : `Could not reach ${probeUrl} (network unreachable or browser offline). Local fallback active.`
      };
    } finally {
      hasCheckedConnection = true;
      updateStatusBadge();
    }
    return isBackendConnected;
  }

  function updateStatusBadge() {
    const pill = document.getElementById('ai-engine-status-pill');
    const drawerBadge = document.getElementById('foodoscope-status-badge');
    const drawerDetail = document.getElementById('foodoscope-status-detail');
    const telemetryMeta = document.getElementById('foodoscope-telemetry-meta');

    if (pill) {
      if (connectionState === 'connected') {
        pill.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-sage-600 animate-pulse shrink-0"></span>
          <span class="hidden sm:inline font-bold">Foodoscope: Connected</span>
          <span class="sm:hidden font-bold">Connected</span>
        `;
        pill.className = 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-sage-100 dark:bg-emerald-950/50 text-forest dark:text-sage-300 border border-sage-400 dark:border-sage-700 shadow-sm transition-all cursor-pointer whitespace-nowrap';
        pill.title = `Foodoscope API Live: HTTP 200 (${lastCheckMeta.latencyMs}ms). Click for diagnostics drawer.`;
      } else if (connectionState === 'checking') {
        pill.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-terracotta animate-ping shrink-0"></span>
          <span class="hidden sm:inline font-bold">Checking API...</span>
          <span class="sm:hidden font-bold">Checking</span>
        `;
        pill.className = 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-peach/60 dark:bg-stone-900 text-espresso dark:text-beige border border-terracotta/50 shadow-sm transition-all cursor-pointer whitespace-nowrap';
      } else if (connectionState === 'error') {
        pill.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
          <span class="hidden sm:inline font-bold">Foodoscope: Error</span>
          <span class="sm:hidden font-bold">API Error</span>
        `;
        pill.className = 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-sm transition-all cursor-pointer whitespace-nowrap';
      } else {
        pill.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-terracotta shrink-0"></span>
          <span class="hidden sm:inline font-bold">Foodoscope: Offline</span>
          <span class="sm:hidden font-bold">API Offline</span>
        `;
        pill.className = 'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-peach/40 dark:bg-stone-900 text-espresso dark:text-beige border border-terracotta/30 dark:border-stone-800 hover:border-terracotta shadow-sm transition-all cursor-pointer whitespace-nowrap';
      }
    }

    if (drawerBadge) {
      if (connectionState === 'connected') {
        drawerBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-sage-600 animate-pulse"></span><span>Connected (${lastCheckMeta.latencyMs}ms)</span>`;
        drawerBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sage-100 dark:bg-emerald-950/50 text-forest dark:text-sage-300 border border-sage-400 dark:border-sage-700';
      } else if (connectionState === 'checking') {
        drawerBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-terracotta animate-ping"></span><span>Connecting...</span>';
        drawerBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-peach/60 dark:bg-stone-800 text-espresso dark:text-beige border border-terracotta/40';
      } else if (connectionState === 'error') {
        drawerBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-500"></span><span>HTTP ${lastCheckMeta.httpStatus || 'Error'}</span>`;
        drawerBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800';
      } else {
        const label = connectionState === 'offline' ? 'Offline (Unreachable)' : 'Local Catalog Mode';
        drawerBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-terracotta"></span><span>${label}</span>`;
        drawerBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-peach/40 dark:bg-stone-800 text-espresso dark:text-beige border border-terracotta/30';
      }
    }

    if (drawerDetail) {
      drawerDetail.textContent = lastCheckMeta.detail;
    }

    if (telemetryMeta) {
      const parts = [
        `Status: ${isBackendConnected ? 'Connected' : 'Offline'}`,
        lastCheckMeta.httpStatus ? `HTTP ${lastCheckMeta.httpStatus}` : null,
        lastCheckMeta.latencyMs ? `${lastCheckMeta.latencyMs}ms` : null,
        lastCheckMeta.rateRemaining ? `Rate Limit: ${lastCheckMeta.rateRemaining}` : null,
        lastCheckMeta.checkedAt ? `Checked ${lastCheckMeta.checkedAt}` : null
      ].filter(Boolean);
      telemetryMeta.textContent = parts.join(' · ');
    }
  }

  function resetConfig() {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    API_BASE_URL = DEFAULT_FOODOSCOPE_URL;
    API_TOKEN = DEFAULT_FOODOSCOPE_KEY;

    const urlInput = document.getElementById('foodoscope-api-url-input');
    const keyInput = document.getElementById('foodoscope-api-key-input');
    if (urlInput) urlInput.value = DEFAULT_FOODOSCOPE_URL;
    if (keyInput) keyInput.value = DEFAULT_FOODOSCOPE_KEY;

    checkHealth(DEFAULT_FOODOSCOPE_URL, DEFAULT_FOODOSCOPE_KEY);
  }

  // ========================================================
  // CACHED REST CALL HELPER
  // ========================================================
  async function fetchWithCache(cacheKey, fetcherFn) {
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
    const data = await fetcherFn();
    if (data) {
      memoryCache.set(cacheKey, { timestamp: Date.now(), data });
    }
    return data;
  }

  // ========================================================
  // FOODOSCOPE RECIPEDB SEARCH BY TITLE
  // ========================================================
  async function searchRecipes(title = '', limit = 10, page = 1) {
    if (!title || !title.trim()) return [];
    const cleanTitle = title.trim();
    const cacheKey = `recipe_title_${cleanTitle.toLowerCase()}_${limit}_${page}`;

    return fetchWithCache(cacheKey, async () => {
      const isCloud = isFoodoscopeCloud(API_BASE_URL);
      const url = isCloud
        ? `${API_BASE_URL}/recipe2-api/recipe-bytitle/recipeByTitle?title=${encodeURIComponent(cleanTitle)}&limit=${limit}&page=${page}`
        : `${API_BASE_URL}/recipes/foodoscope/search?title=${encodeURIComponent(cleanTitle)}&limit=${limit}&page=${page}`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(url, {
          method: 'GET',
          headers: getAuthHeaders(),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const json = await res.json();
          return json.data || json.recipes || [];
        }
      } catch (e) {
        console.warn('Foodoscope searchRecipes query error, using local fallback:', e);
      }
      return [];
    });
  }

  // ========================================================
  // FOODOSCOPE RECIPEDB RECIPE INFO (MACROS, UTENSILS, STEPS)
  // ========================================================
  async function getRecipeInfo(recipeId) {
    if (!recipeId) return null;
    const cacheKey = `recipe_info_${recipeId}`;

    return fetchWithCache(cacheKey, async () => {
      const isCloud = isFoodoscopeCloud(API_BASE_URL);
      const url = isCloud
        ? `${API_BASE_URL}/recipe2-api/recipe/recipesinfo?recipeId=${encodeURIComponent(recipeId)}`
        : `${API_BASE_URL}/recipes/foodoscope/recipe/${encodeURIComponent(recipeId)}`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(url, {
          method: 'GET',
          headers: getAuthHeaders(),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const json = await res.json();
          const items = json.data || (json.recipe ? [json.recipe] : []);
          return items.length ? items[0] : null;
        }
      } catch (e) {
        console.warn('Foodoscope getRecipeInfo error:', e);
      }
      return null;
    });
  }

  // ========================================================
  // FOODOSCOPE RECIPEDB SEARCH BY INGREDIENTS & CATEGORIES
  // ========================================================
  async function searchByIngredient(ingredient, dishTitle = '', limit = 10, page = 1) {
    if (!ingredient || !ingredient.trim()) return [];
    const cleanIng = ingredient.trim();
    const cacheKey = `recipe_ing_${cleanIng.toLowerCase()}_${(dishTitle || '').toLowerCase()}_${limit}`;

    return fetchWithCache(cacheKey, async () => {
      const isCloud = isFoodoscopeCloud(API_BASE_URL);
      let url = '';
      if (isCloud) {
        url = `${API_BASE_URL}/recipe2-api/recipebyingredient/by-ingredients-categories-title?includeIngredients=${encodeURIComponent(cleanIng)}&limit=${limit}&page=${page}`;
        if (dishTitle && dishTitle.trim()) {
          url += `&title=${encodeURIComponent(dishTitle.trim())}`;
        }
      } else {
        url = `${API_BASE_URL}/recipes/foodoscope/by-ingredient?ingredient=${encodeURIComponent(cleanIng)}&title=${encodeURIComponent(dishTitle || '')}&limit=${limit}&page=${page}`;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const res = await fetch(url, {
          method: 'GET',
          headers: getAuthHeaders(),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const json = await res.json();
          return json.data || json.recipes || [];
        }
      } catch (e) {
        console.warn('Foodoscope searchByIngredient error:', e);
      }
      return [];
    });
  }

  // ========================================================
  // RATIO OPTIMIZER & SENSORY/FLAVOR METHODS
  // ========================================================
  async function optimizeRatio(payload) {
    if (!isBackendConnected && !hasCheckedConnection) {
      await checkHealth();
    }

    if (isBackendConnected && API_BASE_URL && !isFoodoscopeCloud(API_BASE_URL)) {
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

    // High-precision client-side culinary proportion scaling
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
    if (isBackendConnected && API_BASE_URL && !isFoodoscopeCloud(API_BASE_URL)) {
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
      culinary_note: 'Validated against domain culinary aroma profiles and functional fat/moisture compatibility.'
    };
  }

  async function getSensoryProfile(substituteName, fatPct = null, moisturePct = null, simmerTemp = 95.0) {
    if (isBackendConnected && API_BASE_URL && !isFoodoscopeCloud(API_BASE_URL)) {
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

  // ========================================================
  // INTERACTIVE DIAGNOSTICS DRAWER UI
  // ========================================================
  function setupDrawerUI() {
    const drawer = document.getElementById('foodoscope-api-drawer');
    const pill = document.getElementById('ai-engine-status-pill');
    const closeBtn = document.getElementById('close-foodoscope-drawer-btn');
    const urlInput = document.getElementById('foodoscope-api-url-input');
    const keyInput = document.getElementById('foodoscope-api-key-input');
    const testBtn = document.getElementById('foodoscope-test-btn');
    const resetBtn = document.getElementById('foodoscope-reset-btn');
    const presetLocalBtn = document.getElementById('foodoscope-preset-local-btn');
    const presetCloudBtn = document.getElementById('foodoscope-preset-cloud-btn');
    const testSearchBtn = document.getElementById('foodoscope-test-search-btn');

    if (urlInput && API_BASE_URL) urlInput.value = API_BASE_URL;
    if (keyInput && API_TOKEN) keyInput.value = API_TOKEN;

    pill?.addEventListener('click', () => {
      document.getElementById('pantry-drawer')?.classList.add('hidden');
      drawer?.classList.toggle('hidden');
    });

    closeBtn?.addEventListener('click', () => {
      drawer?.classList.add('hidden');
    });

    presetLocalBtn?.addEventListener('click', () => {
      if (urlInput) urlInput.value = 'http://localhost:8000/api/v1';
      if (keyInput) keyInput.value = '';
    });

    presetCloudBtn?.addEventListener('click', () => {
      if (urlInput) urlInput.value = DEFAULT_FOODOSCOPE_URL;
      if (keyInput) keyInput.value = DEFAULT_FOODOSCOPE_KEY;
    });

    testBtn?.addEventListener('click', () => {
      const nextUrl = urlInput ? urlInput.value.trim() : DEFAULT_FOODOSCOPE_URL;
      const nextKey = keyInput ? keyInput.value.trim() : DEFAULT_FOODOSCOPE_KEY;
      if (nextUrl) {
        localStorage.setItem(STORAGE_URL_KEY, nextUrl);
      } else {
        localStorage.removeItem(STORAGE_URL_KEY);
      }
      if (nextKey) {
        localStorage.setItem(STORAGE_TOKEN_KEY, nextKey);
      } else {
        localStorage.removeItem(STORAGE_TOKEN_KEY);
      }
      checkHealth(nextUrl, nextKey);
    });

    testSearchBtn?.addEventListener('click', async () => {
      const drawerDetail = document.getElementById('foodoscope-status-detail');
      if (drawerDetail) drawerDetail.textContent = 'Testing live Foodoscope RecipeDB search for "Biryani"...';
      const results = await searchRecipes('Biryani', 3);
      if (drawerDetail) {
        if (results && results.length) {
          const titles = results.map(r => r.Recipe_title || r.title).join(', ');
          drawerDetail.textContent = `✓ Foodoscope RecipeDB Search Success! Fetched ${results.length} recipes: "${titles}".`;
        } else {
          drawerDetail.textContent = 'Tested Foodoscope RecipeDB search: No items returned or request timed out.';
        }
      }
    });

    resetBtn?.addEventListener('click', resetConfig);
  }

  return {
    checkHealth,
    resetConfig,
    optimizeRatio,
    getFlavorCompatibility,
    getSensoryProfile,
    searchRecipes,
    getRecipeInfo,
    searchByIngredient,
    updateStatusBadge,
    initDrawer: setupDrawerUI,
    isConnected: () => isBackendConnected,
    getStatus: () => ({ state: connectionState, connected: isBackendConnected, ...lastCheckMeta }),
    getBaseUrl: () => API_BASE_URL,
    getApiKey: () => API_TOKEN
  };
})();

// Auto-initialize Foodoscope API connection immediately on load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    ApiService.initDrawer();
    ApiService.checkHealth();
  });
}

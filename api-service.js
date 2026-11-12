// FlavorShift AI — Frontend Async API Service Bridge
// Connects the client SPA to the FastAPI / Foodoscope API backend with honest connection telemetry.

const ApiService = (function () {
  'use strict';

  const STORAGE_URL_KEY = 'flavorshift_foodoscope_url';
  const STORAGE_TOKEN_KEY = 'flavorshift_foodoscope_key';

  let API_BASE_URL =
    window.FOODOSCOPE_API_URL ||
    window.FLAVORSHIFT_API_URL ||
    localStorage.getItem(STORAGE_URL_KEY) ||
    '';

  let isBackendConnected = false;
  let hasCheckedConnection = false;
  let connectionState = API_BASE_URL ? 'pending' : 'not_configured'; // 'not_configured' | 'checking' | 'connected' | 'offline' | 'error'
  let lastCheckMeta = {
    endpoint: API_BASE_URL || '',
    httpStatus: null,
    latencyMs: null,
    checkedAt: null,
    detail: API_BASE_URL
      ? 'Ready to verify endpoint connectivity.'
      : 'No API URL configured yet. Running from the local browser catalog & substitution ontology.'
  };

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
    return cleaned;
  }

  function resolveApiBase(rawUrl) {
    const cleaned = (rawUrl || '').trim().replace(/\/+$/, '');
    if (!cleaned) return '';
    if (/\/health(\/ready)?$/i.test(cleaned)) {
      return cleaned.replace(/\/health(\/ready)?$/i, '');
    }
    return cleaned;
  }

  async function checkHealth(overrideUrl, overrideKey) {
    const inputUrl = typeof overrideUrl === 'string' ? overrideUrl.trim() : API_BASE_URL;
    const savedKey = typeof overrideKey === 'string'
      ? overrideKey.trim()
      : (localStorage.getItem(STORAGE_TOKEN_KEY) || '');

    if (!inputUrl) {
      isBackendConnected = false;
      hasCheckedConnection = false;
      connectionState = 'not_configured';
      lastCheckMeta = {
        endpoint: '',
        httpStatus: null,
        latencyMs: null,
        checkedAt: new Date().toLocaleTimeString(),
        detail: 'No Foodoscope or backend URL configured. Using Local Catalog Mode.'
      };
      updateStatusBadge();
      return false;
    }

    API_BASE_URL = resolveApiBase(inputUrl);
    const probeUrl = resolveHealthEndpoint(inputUrl);

    connectionState = 'checking';
    lastCheckMeta = {
      ...lastCheckMeta,
      endpoint: probeUrl,
      detail: `Testing connection to ${probeUrl}...`
    };
    updateStatusBadge();

    const startMs = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const headers = { 'Accept': 'application/json' };
      if (savedKey) {
        headers['x-api-key'] = savedKey;
        headers['Authorization'] = `Bearer ${savedKey}`;
      }

      const res = await fetch(probeUrl, {
        method: 'GET',
        signal: controller.signal,
        headers
      });
      clearTimeout(timeoutId);

      const latencyMs = Math.max(1, Math.round(performance.now() - startMs));
      let payloadNote = '';
      try {
        const text = await res.text();
        if (text) {
          const parsed = JSON.parse(text);
          const parts = [];
          if (parsed.service) parts.push(parsed.service);
          if (parsed.status) parts.push(`status: ${parsed.status}`);
          if (parsed.version) parts.push(`v${parsed.version}`);
          if (parsed.database) parts.push(`db: ${parsed.database}`);
          if (parts.length) payloadNote = ` (${parts.join(' · ')})`;
        }
      } catch (_) {
        // Non-JSON 2xx/error body is acceptable when probing third-party endpoints
      }

      if (res.ok) {
        isBackendConnected = true;
        connectionState = 'connected';
        lastCheckMeta = {
          endpoint: probeUrl,
          httpStatus: res.status,
          latencyMs,
          checkedAt: new Date().toLocaleTimeString(),
          detail: `Connected cleanly via HTTP ${res.status} in ${latencyMs}ms${payloadNote}.`
        };
      } else {
        isBackendConnected = false;
        connectionState = 'error';
        lastCheckMeta = {
          endpoint: probeUrl,
          httpStatus: res.status,
          latencyMs,
          checkedAt: new Date().toLocaleTimeString(),
          detail: res.status === 401 || res.status === 403
            ? `Endpoint responded with HTTP ${res.status} (${res.statusText || 'Unauthorized'}). Check your Foodoscope API key.`
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
        detail: isTimeout
          ? `Request timed out after 3.5s waiting for ${probeUrl}. Local fallback active.`
          : `Could not reach ${probeUrl} (server offline, unreachable, or blocked by browser CORS policy). Local fallback active.`
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
          <span class="hidden sm:inline font-bold">Foodoscope API: Connected</span>
          <span class="sm:hidden font-bold">Connected</span>
        `;
        pill.className = 'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-sage-100 dark:bg-emerald-950/50 text-forest dark:text-sage-300 border border-sage-400 dark:border-sage-700 shadow-sm transition-all cursor-pointer whitespace-nowrap';
      } else if (connectionState === 'checking') {
        pill.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-terracotta animate-ping shrink-0"></span>
          <span class="hidden sm:inline font-bold">Checking API...</span>
          <span class="sm:hidden font-bold">Checking</span>
        `;
        pill.className = 'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-peach/60 dark:bg-stone-900 text-espresso dark:text-beige border border-terracotta/50 shadow-sm transition-all cursor-pointer whitespace-nowrap';
      } else if (connectionState === 'error') {
        pill.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
          <span class="hidden sm:inline font-bold">Foodoscope API: Auth/HTTP Error</span>
          <span class="sm:hidden font-bold">API Error</span>
        `;
        pill.className = 'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-sm transition-all cursor-pointer whitespace-nowrap';
      } else {
        pill.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-terracotta shrink-0"></span>
          <span class="hidden sm:inline font-bold">Foodoscope API: Offline</span>
          <span class="sm:hidden font-bold">API</span>
        `;
        pill.className = 'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-peach/40 dark:bg-stone-900 text-espresso dark:text-beige border border-terracotta/30 dark:border-stone-800 hover:border-terracotta shadow-sm transition-all cursor-pointer whitespace-nowrap';
      }
    }

    if (drawerBadge) {
      if (connectionState === 'connected') {
        drawerBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-sage-600 animate-pulse"></span><span>Connected</span>';
        drawerBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sage-100 dark:bg-emerald-950/50 text-forest dark:text-sage-300 border border-sage-400 dark:border-sage-700';
      } else if (connectionState === 'checking') {
        drawerBadge.innerHTML = '<span class="w-2 h-2 rounded-full bg-terracotta animate-ping"></span><span>Checking...</span>';
        drawerBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-peach/60 dark:bg-stone-800 text-espresso dark:text-beige border border-terracotta/40';
      } else if (connectionState === 'error') {
        drawerBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-rose-500"></span><span>HTTP ${lastCheckMeta.httpStatus || 'Error'}</span>`;
        drawerBadge.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800';
      } else {
        const label = connectionState === 'offline' ? 'Not Connected (Unreachable)' : 'Not Connected (Local Catalog Mode)';
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
        lastCheckMeta.checkedAt ? `Checked ${lastCheckMeta.checkedAt}` : null
      ].filter(Boolean);
      telemetryMeta.textContent = parts.join(' · ');
    }
  }

  function resetConfig() {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    API_BASE_URL = window.FOODOSCOPE_API_URL || window.FLAVORSHIFT_API_URL || '';
    const urlInput = document.getElementById('foodoscope-api-url-input');
    const keyInput = document.getElementById('foodoscope-api-key-input');
    if (urlInput) urlInput.value = API_BASE_URL;
    if (keyInput) keyInput.value = '';
    isBackendConnected = false;
    hasCheckedConnection = false;
    connectionState = API_BASE_URL ? 'pending' : 'not_configured';
    lastCheckMeta = {
      endpoint: API_BASE_URL,
      httpStatus: null,
      latencyMs: null,
      checkedAt: null,
      detail: 'Reset to Local Catalog Mode.'
    };
    updateStatusBadge();
  }

  async function optimizeRatio(payload) {
    if (API_BASE_URL && !isBackendConnected && !hasCheckedConnection) {
      await checkHealth();
    }

    if (isBackendConnected && API_BASE_URL) {
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
    if (isBackendConnected && API_BASE_URL) {
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
    if (isBackendConnected && API_BASE_URL) {
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

  function setupDrawerUI() {
    const drawer = document.getElementById('foodoscope-api-drawer');
    const pill = document.getElementById('ai-engine-status-pill');
    const closeBtn = document.getElementById('close-foodoscope-drawer-btn');
    const urlInput = document.getElementById('foodoscope-api-url-input');
    const keyInput = document.getElementById('foodoscope-api-key-input');
    const testBtn = document.getElementById('foodoscope-test-btn');
    const resetBtn = document.getElementById('foodoscope-reset-btn');
    const presetLocalBtn = document.getElementById('foodoscope-preset-local-btn');

    if (urlInput && API_BASE_URL) urlInput.value = API_BASE_URL;
    const storedKey = localStorage.getItem(STORAGE_TOKEN_KEY);
    if (keyInput && storedKey) keyInput.value = storedKey;

    pill?.addEventListener('click', () => {
      document.getElementById('pantry-drawer')?.classList.add('hidden');
      drawer?.classList.toggle('hidden');
    });

    closeBtn?.addEventListener('click', () => {
      drawer?.classList.add('hidden');
    });

    presetLocalBtn?.addEventListener('click', () => {
      if (urlInput) {
        urlInput.value = 'http://localhost:8000/api/v1';
      }
    });

    testBtn?.addEventListener('click', () => {
      const nextUrl = urlInput ? urlInput.value.trim() : '';
      const nextKey = keyInput ? keyInput.value.trim() : '';
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

    resetBtn?.addEventListener('click', resetConfig);
  }

  return {
    checkHealth,
    resetConfig,
    optimizeRatio,
    getFlavorCompatibility,
    getSensoryProfile,
    updateStatusBadge,
    initDrawer: setupDrawerUI,
    isConnected: () => isBackendConnected,
    getStatus: () => ({ state: connectionState, connected: isBackendConnected, ...lastCheckMeta })
  };
})();

// Initialize API connection drawer & probe only when an API URL is explicitly configured
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    ApiService.initDrawer();
    const status = ApiService.getStatus();
    if (status.endpoint) {
      ApiService.checkHealth();
    } else {
      ApiService.updateStatusBadge();
    }
  });
}

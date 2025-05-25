const isDataLoaded = key => {
  const data = window.getCacheData?.[key]?.();
  if (Array.isArray(data)) return data.length > 0;
  if (data && typeof data === 'object') return Object.keys(data).length > 0;
  return false;
};

// check if localStorage.cache_<key> exists and is younger than ttl (ms)
const isCacheFresh = (key, ttl = 24 * 60 * 60 * 1000) => {
  // anything you manually cleared must be fetched again
  if (forceloadfromnetwork.includes(key)) return false;

  const raw = localStorage.getItem(`cache_${key}`);
  if (!raw) return false;
  try {
    const { ts } = JSON.parse(raw);
    return Date.now() - ts < ttl;
  } catch {
    localStorage.removeItem(`cache_${key}`);
    return false;
  }
};

// walk through cacheConfigs, loading missing or stale datasets on idle
function startIdleFetchSequence(cacheConfigs, {
  cacheTTL = 24 * 60 * 60 * 1000,
  inactivityDelay = 5000,
  quickThreshold = 1000
} = {}) {
  console.log("starting idle fetch sequence");
  let idx = 0, cumulative = 0, timer;

  const onActivity = () => {
    clearTimeout(timer);
    timer = setTimeout(onIdle, inactivityDelay);
  };

  async function onIdle() {
    console.log("user is idle.");
    // skip any datasets already loaded into memory AND fresh
    while (idx < cacheConfigs.length) {
      const { key } = cacheConfigs[idx];
      if (isDataLoaded(key) && isCacheFresh(key, cacheTTL)) idx++;
      else break;
    }

    if (idx >= cacheConfigs.length) {
      cleanup();
      return setTimeout(reset, cacheTTL);
    }

    do {
      const { key, fn } = cacheConfigs[idx++];
      const stale = !isCacheFresh(key, cacheTTL);
      const start = performance.now();
      try {
        // this calls your getDataset wrapper (or equivalent) with
        // checkCache = !stale, forceApi = stale
        await window[fn](!stale, stale);
      } catch (e) {
        console.warn(`idle load ${key} failed:`, e);
      }
      cumulative += performance.now() - start;

      // skip any that just became fresh
      while (idx < cacheConfigs.length) {
        const { key: next } = cacheConfigs[idx];
        if (isDataLoaded(next) && isCacheFresh(next, cacheTTL)) idx++;
        else break;
      }
    }
    while (idx < cacheConfigs.length
           && cumulative < inactivityDelay
           && performance.now() - start < quickThreshold);

    if (idx >= cacheConfigs.length || cumulative >= inactivityDelay) {
      cleanup();
      setTimeout(reset, cacheTTL);
    } else {
      timer = setTimeout(onIdle, inactivityDelay);
    }
  }

  function reset() {
    idx = 0;
    cumulative = 0;
    startIdleFetchSequence(cacheConfigs, { cacheTTL, inactivityDelay, quickThreshold });
  }

  function cleanup() {
    clearTimeout(timer);
    ['mousemove','mousedown','keydown','scroll','touchstart']
      .forEach(evt => document.removeEventListener(evt, onActivity));
  }

  ['mousemove','mousedown','keydown','scroll','touchstart']
    .forEach(evt => document.addEventListener(evt, onActivity, { passive:true }));

  timer = setTimeout(onIdle, inactivityDelay);
}
const isDataLoaded = key => {
  const data = window.getCacheData?.[key]?.();
  if (Array.isArray(data)) return data.length > 0;
  if (data && typeof data === 'object') return Object.keys(data).length > 0;
  return false;
};

// check if localStorage.cache_<key> exists and is younger than ttl (ms)
const isCacheFresh = (key, ttl = 24 * 60 * 60 * 1000) => {
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
function startidlefetchsequence(cacheConfigs, {
  cacheTTL = 24 * 60 * 60 * 1000,
  inactivityDelay = 5000,
  quickThreshold = 1000
} = {}) {
  let index = 0;
  let cumulative = 0;
  let timerId;

  const reset = () => {
    index = 0;
    cumulative = 0;
    startIdleFetchSequence(cacheConfigs, { cacheTTL, inactivityDelay, quickThreshold });
  };

  const onActivity = () => {
    clearTimeout(timerId);
    timerId = setTimeout(onIdle, inactivityDelay);
  };

  async function onIdle() {
    // skip already loaded & fresh
    while (index < cacheConfigs.length) {
      const { key } = cacheConfigs[index];
      if (isDataLoaded(key) && isCacheFresh(key, cacheTTL)) index++;
      else break;
    }

    // all done → schedule next full pass
    if (index >= cacheConfigs.length) {
      cleanup();
      return setTimeout(reset, cacheTTL);
    }

    let lastTime = Infinity;
    do {
      const { key, fn } = cacheConfigs[index++];
      const bypass = !isCacheFresh(key, cacheTTL);
      const start = performance.now();
      try {
        // skip localStorage AND force a cache-busting HTTP fetch when stale/missing
        await window[fn](bypass, bypass);
      } catch (err) {
        console.warn(`warn loading ${key}:`, err);
      }

      lastTime = performance.now() - start;
      cumulative += lastTime;

      // skip newly loaded & fresh
      while (index < cacheConfigs.length) {
        const { key: nextKey } = cacheConfigs[index];
        if (isDataLoaded(nextKey) && isCacheFresh(nextKey, cacheTTL)) index++;
        else break;
      }
    } while (
      index < cacheConfigs.length &&
      lastTime < quickThreshold &&
      cumulative < inactivityDelay
    );

    // finish or wait
    if (index >= cacheConfigs.length || cumulative >= inactivityDelay) {
      cleanup();
      setTimeout(reset, cacheTTL);
    } else {
      timerId = setTimeout(onIdle, inactivityDelay);
    }
  }

  function cleanup() {
    clearTimeout(timerId);
    ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
      .forEach(evt => document.removeEventListener(evt, onActivity));
  }

  ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
    .forEach(evt => document.addEventListener(evt, onActivity, { passive: true }));

  timerId = setTimeout(onIdle, inactivityDelay);
}
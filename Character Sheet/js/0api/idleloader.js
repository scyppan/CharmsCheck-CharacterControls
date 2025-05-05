/**
 * Returns true if the global variable for `key` is non-empty.
 */
function isDataLoaded(key) {
  const data = getCacheData[key]();
  if (Array.isArray(data)) {
    return data.length > 0;
  } else if (data && typeof data === 'object') {
    return Object.keys(data).length > 0;
  }
  return false;
}

/**
 * Utility to check if cache_<key> exists and is still fresh
 */
function isCacheFresh(key) {
  const storageKey = `cache_${key}`;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return false;
  try {
    const { ts } = JSON.parse(raw);
    return (Date.now() - ts) < cache_ttl;
  } catch {
    localStorage.removeItem(storageKey);
    return false;
  }
}

/**
 * Idle‐loader: prioritizes loading any global var that's empty,
 * then falls back to freshness of cache, without losing existing behavior.
 */
function startidlefetchsequence() {
  const inactivityDelay = 5000;   // ms of no activity before loading
  const quickThreshold  = 1000;   // ms per load to auto-continue
  let timerId, index = 0, cumulativeloadtime = 0;

  function onActivity() {
    clearTimeout(timerId);
    timerId = setTimeout(onIdle, inactivityDelay);
  }

  async function onIdle() {
    // 1) skip all keys where data is loaded AND cache is fresh
    while (index < cache_configs.length) {
      const { key } = cache_configs[index];
      if (isDataLoaded(key) && isCacheFresh(key)) {
        index++;
      } else {
        break;
      }
    }

    // 2) if we've loaded everything, schedule next pass after TTL
    if (index >= cache_configs.length) {
      cleanup();
      return void setTimeout(startidlefetchsequence, cache_ttl);
    }

    // 3) load in batch until we hit a slow load or run out of time
    let lastLoadTime = Infinity;
    do {
      const { key, fn } = cache_configs[index++];
      const start = performance.now();
      try {
        const bypassCache = !isCacheFresh(key);
        await window[fn](bypassCache);

        // update the settings UI after each fetch
        loadcachemini();

        lastLoadTime = performance.now() - start;
        cumulativeloadtime += lastLoadTime;
        console.log(`${index} of ${cache_configs.length} items loaded`);
      } catch (err) {
        lastLoadTime = quickThreshold;
        console.error(`Error loading ${key}: ${err}`);
      }

      // 4) skip any newly loaded & fresh ones
      while (index < cache_configs.length) {
        const { key: nextKey } = cache_configs[index];
        if (isDataLoaded(nextKey) && isCacheFresh(nextKey)) {
          index++;
        } else {
          break;
        }
      }
    } while (
      index < cache_configs.length &&
      lastLoadTime < quickThreshold &&
      cumulativeloadtime < inactivityDelay
    );

    // 5) finish or wait for next idle/event
    if (index >= cache_configs.length || cumulativeloadtime >= inactivityDelay) {
      cleanup();
      setTimeout(startidlefetchsequence, cache_ttl);
    } else {
      timerId = setTimeout(onIdle, inactivityDelay);
    }
  }

  function cleanup() {
    clearTimeout(timerId);
    ['mousemove','mousedown','keydown','scroll','touchstart']
      .forEach(evt => document.removeEventListener(evt, onActivity));
  }

  ['mousedown','keydown','touchstart']
    .forEach(evt => document.addEventListener(evt, onActivity, { passive: true }));
  timerId = setTimeout(onIdle, inactivityDelay);
}

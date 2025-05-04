// 1) Utility to check if cache_<key> exists and is still fresh
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

// 2) The idle‐loader itself, now calling loadcachemini() after each successful cache update
function startidlefetchsequence() {
  const inactivityDelay = 5000;   // ms of no activity before loading
  const quickThreshold  = 1000;   // ms per load to auto-continue
  let timerId, index = 0, cumulativeloadtime = 0;

  function onActivity() {
    clearTimeout(timerId);
    timerId = setTimeout(onIdle, inactivityDelay);
  }

  async function onIdle() {
    // skip already fresh
    while (index < cache_configs.length) {
      const { key } = cache_configs[index];
      if (getCacheData[key]() != null && isCacheFresh(key)) {
        index++;
      } else break;
    }

    // if done, schedule next pass
    if (index >= cache_configs.length) {
      cleanup();
      return void setTimeout(startidlefetchsequence, cache_ttl);
    }

    // load in batch
    let lastLoadTime = Infinity;
    do {
      const { key, fn } = cache_configs[index++];
      const start = performance.now();
      try {
        const bypassCache = !isCacheFresh(key);
        await window[fn](bypassCache);

        loadcachemini();

        lastLoadTime = performance.now() - start;
        cumulativeloadtime += lastLoadTime;
        console.log(`${index} of ${cache_configs.length} items loaded`);
      } catch (err) {
        lastLoadTime = quickThreshold; 
        console.error(`Error loading ${key}: ${err}`);
      }

      // skip newly fresh ones
      while (index < cache_configs.length) {
        const { key: nextKey } = cache_configs[index];
        if (getCacheData[nextKey]() != null && isCacheFresh(nextKey)) {
          index++;
        } else break;
      }
    } while (
      index < cache_configs.length &&
      lastLoadTime < quickThreshold &&
      cumulativeloadtime < inactivityDelay
    );

    // finish or wait for next idle
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
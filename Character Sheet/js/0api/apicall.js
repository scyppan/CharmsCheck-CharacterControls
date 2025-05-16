/* ========================================================================
   abstracted dataset fetch/cache module — WITH VERBOSE LOGGING
   (requires: cache_ttl, cache_meta, and your `let`-globals declared elsewhere)
   Steps: 1) cache → 2) API → 3) throw if still empty
   ===================================================================== */

/* ---------- network helpers ---------- */
async function fetchjson(url, skipHttpCache = false) {
  // 1) build cache-busting suffix if needed
  const bust = skipHttpCache
    ? (url.includes('?') ? `&_cb=${Date.now()}` : `?_cb=${Date.now()}`)
    : '';
  const fullUrl = url + bust;

  // 2) standalone fetch options
  const opts = {
    method: 'GET',
    redirect: 'follow',
    cache: skipHttpCache ? 'no-store' : 'default'
  };

  // 3) perform fetch
  const res = await fetch(fullUrl, opts);
  if (res.status === 200) {
    return res.json();
  }
  throw new Error(`HTTP ${res.status}`);
}

const fetchdata = (url, skipHttpCache = false) => fetchjson(url, skipHttpCache);


/* ---------- cache helpers ---------- */
function getCacheEntry(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts < cache_ttl) return { ts, data };
    localStorage.removeItem(key);
  } catch (e) {
    localStorage.removeItem(key);
  }
  return null;
}

function setCacheEntry(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch (e) {}
}

/* ---------- normaliser ---------- */
function toArray(raw) {
  return Array.isArray(raw) ? raw : Object.values(raw || {});
}

/* ---------- assign both globalThis & lexical ---------- */
function assign(name, arr) {
  globalThis[name] = arr;
  try { eval(`${name} = arr`); } catch {}
}

/* ---------- generic getter ---------- */
async function getDataset(name, url, checkCache = true, forceApi = false) {
  const key = `cache_${name}`;

  if (forceApi) {
    url = url + (url.includes('?') ? '&' : '?') + 'bust=1';
  }
  
  const networkOnly = Array.isArray(forceloadfromnetwork) &&
                      forceloadfromnetwork.indexOf(name) !== -1;
  const skipLocal = forceApi || networkOnly;

  console.log(
    `[getDataset:${name}] checkCache=${checkCache}, forceApi=${forceApi}, networkOnly=${networkOnly}`
  );

  // 1) In-memory cache (only if not forcing API)
  if (!skipLocal) {
    const inMem = globalThis[name];
    if (Array.isArray(inMem) && inMem.length) {
      console.log(`[getDataset:${name}] returned ${inMem.length} from memory`);
      return inMem;
    }
  }

  // 2) Local-storage cache
  if (checkCache && !skipLocal) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const { ts, data } = JSON.parse(raw);
        if (Date.now() - ts < cache_ttl) {
          const arr = Array.isArray(data) ? data : Object.values(data || {});
          assign(name, arr);
          cache_meta.push({ dataset: name, lastcache: new Date(ts) });
          console.log(`[getDataset:${name}] returned ${arr.length} from localStorage`);
          return arr;
        } else {
          localStorage.removeItem(key);
          console.log(`[getDataset:${name}] cache expired, removed`);
        }
      }
    } catch (e) {
      localStorage.removeItem(key);
      console.warn(`[getDataset:${name}] cache parse error, cleared`, e);
    }
  }

  // 3) Network fetch (first attempt, retry once with cache-bust on error)
  let rawJson;
  try {
    rawJson = await fetchjson(url, skipLocal);
  } catch (err) {
    console.warn(
      `[getDataset:${name}] fetch error (${err.message}), retrying with cache-bust`
    );
    localStorage.removeItem(key);
    rawJson = await fetchjson(url, true);
  }

  // 4) If the proxy sent back an error object, purge and throw
  if (rawJson && rawJson.error) {
    localStorage.removeItem(key);
    throw new Error(rawJson.error);
  }

  // 5) Normalize & assign into memory
  const arr = Array.isArray(rawJson) ? rawJson : Object.values(rawJson || {});
  assign(name, arr);

  // 6) Write-through to localStorage only on valid, non-empty arrays
  if (arr.length) {
    try {
      localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data: arr }));
    } catch (e) {
      console.warn(`[getDataset:${name}] could not write to localStorage`, e);
    }
  }

  cache_meta.push({ dataset: name, lastcache: new Date() });
  console.log(`[getDataset:${name}] fetched ${arr.length} from API`);

  // 7) Validate final result
  if (!arr.length) {
    throw new Error(`no ${name} entries`);
  }
  return arr;
}

/* ---------- concrete getters ---------- */
const getcharacters     = (...a) => getDataset('characters',     'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=972',  ...a);
const gettraits         = (...a) => getDataset('traits',         'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=979',  ...a);
const getaccessories    = (...a) => getDataset('accessories',    'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=995',  ...a);
const getwands          = (...a) => getDataset('wands',          'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=114',  ...a);
const getwandwoods      = (...a) => getDataset('wandwoods',      'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=120',  ...a);
const getwandcores      = (...a) => getDataset('wandcores',      'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=116',  ...a);
const getwandqualities  = (...a) => getDataset('wandqualities',  'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=124',  ...a);
const getspells         = (...a) => getDataset('spells',         'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=191',  ...a);
const getbooks          = (...a) => getDataset('books',          'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=8',    ...a);
const getschools        = (...a) => getDataset('schools',        'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=3',    ...a);
const getproficiencies  = (...a) => getDataset('proficiencies',  'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=944',  ...a);
const getpotions        = (...a) => getDataset('potions',        'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=34',   ...a);
const getnamedcreatures = (...a) => getDataset('namedcreatures', 'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=170',  ...a);
const getitems          = (...a) => getDataset('items',          'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=964',  ...a);
const getitemsinhand    = (...a) => getDataset('itemsinhand',    'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=1085', ...a);
const getgeneralitems   = (...a) => getDataset('generalitems',   'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=126',  ...a);
const getcreatures      = (...a) => getDataset('creatures',      'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=48',   ...a);
const getcreatureparts  = (...a) => getDataset('creatureparts',  'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=53',   ...a);
const getplants         = (...a) => getDataset('plants',         'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=2',    ...a);
const getplantparts     = (...a) => getDataset('plantparts',     'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=43',   ...a);
const getpreparations   = (...a) => getDataset('preparations',   'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=908',  ...a);
const getfooddrink      = (...a) => getDataset('fooddrink',      'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=67',   ...a);

async function forcefetchapi(key) {
  console.log("FORCEFETCHAPI for", key);
  const fnName = 'get' + key;            // e.g. "gettraits"
  let fn;
  try {
    fn = eval(fnName);
  } catch (e) {
    console.error(`No function named ${fnName}()`);
    return;
  }
  if (typeof fn !== 'function') {
    console.error(`${fnName} is not a function`);
    return;
  }

  const cacheKey = `cache_${key}`;

  // 1) Purge old cache
  try {
    localStorage.removeItem(cacheKey);
  } catch (e) {
    console.warn(`Could not remove ${cacheKey} from localStorage`, e);
  }
  // Purge in-memory as well
  if (Array.isArray(globalThis[key])) {
    delete globalThis[key];
  }

  try {
    // 2) Force a fresh API fetch
    const data = await fn(false, true);

    // 3) Validate we got an array back
    if (!Array.isArray(data)) {
      throw new Error(`Expected array, got ${typeof data}`);
    }

    // 4) Re-assign into memory
    assign(key, data);

    // 5) Re-cache on localStorage
    try {
      setCacheEntry(cacheKey, data);
    } catch (e) {
      console.warn(`Could not write ${cacheKey} to localStorage`, e);
    }

    console.log(`${fnName} force-fetched and cached ${data.length} items`);
    return data;

  } catch (err) {
    console.error(`Error force fetching ${fnName}():`, err);
    throw err;
  }
}

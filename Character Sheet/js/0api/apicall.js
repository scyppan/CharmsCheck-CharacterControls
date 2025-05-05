/* ========================================================================
   abstracted dataset fetch/cache module — WITH VERBOSE LOGGING
   (requires: cache_ttl, cache_meta, and your `let`-globals declared elsewhere)
   Steps: 1) cache → 2) API → 3) throw if still empty
   ===================================================================== */

/* ---------- config ---------- */
const headers = new Headers();
headers.append('authorization','Basic Q0E2RS1LUjdaLUtCT0wtTlVYUTp4');
const requestoptions = { method:'GET', headers, redirect:'follow' };

/* ---------- network helpers ---------- */
async function fetchjson(url) {
  const res = await fetch(url, requestoptions);
  if (res.status === 200) return res.json();
  throw new Error(`HTTP ${res.status}`);
}
const fetchdata = url => fetchjson(url);

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
async function getDataset(name, url, checkCache = true) {
  const key = `cache_${name}`;

  // 1) cache
  if (checkCache) {
    const entry = getCacheEntry(key);
    if (entry) {
      const arr = toArray(entry.data);
      assign(name, arr);
      cache_meta.push({ dataset: name, lastcache: new Date(entry.ts) });
      if (arr.length) return arr;
    }
  }

  // 2) API
  const arr = toArray(await fetchdata(url));
  assign(name, arr);
  setCacheEntry(key, arr);
  cache_meta.push({ dataset: name, lastcache: new Date() });

  // 3) validate
  if (!arr.length) throw new Error(`no ${name} entries`);
  return arr;
}

/* ---------- concrete getters ---------- */
const getcharacters     = (...a) => getDataset('characters',     'https://charmscheck.com/wp-json/frm/v2/forms/972/entries?page_size=10000', ...a);
const gettraits         = (...a) => getDataset('traits',         'https://charmscheck.com/wp-json/frm/v2/forms/979/entries?page_size=10000', ...a);
const getaccessories    = (...a) => getDataset('accessories',    'https://charmscheck.com/wp-json/frm/v2/forms/995/entries?page_size=10000', ...a);
const getwands          = (...a) => getDataset('wands',          'https://charmscheck.com/wp-json/frm/v2/forms/114/entries?page_size=10000', ...a);
const getwandwoods      = (...a) => getDataset('wandwoods',      'https://charmscheck.com/wp-json/frm/v2/forms/120/entries?page_size=10000', ...a);
const getwandcores      = (...a) => getDataset('wandcores',      'https://charmscheck.com/wp-json/frm/v2/forms/116/entries?page_size=10000', ...a);
const getwandqualities  = (...a) => getDataset('wandqualities',  'https://charmscheck.com/wp-json/frm/v2/forms/124/entries?page_size=10000', ...a);
const getspells         = (...a) => getDataset('spells',         'https://charmscheck.com/wp-json/frm/v2/forms/191/entries?page_size=10000', ...a);
const getbooks          = (...a) => getDataset('books',          'https://charmscheck.com/wp-json/frm/v2/forms/8/entries?page_size=10000',   ...a);
const getschools        = (...a) => getDataset('schools',        'https://charmscheck.com/wp-json/frm/v2/forms/3/entries?page_size=10000',   ...a);
const getproficiencies  = (...a) => getDataset('proficiencies',  'https://charmscheck.com/wp-json/frm/v2/forms/944/entries?page_size=10000', ...a);
const getpotions        = (...a) => getDataset('potions',        'https://charmscheck.com/wp-json/frm/v2/forms/34/entries?page_size=10000',  ...a);
const getnamedcreatures = (...a) => getDataset('namedcreatures', 'https://charmscheck.com/wp-json/frm/v2/forms/170/entries?page_size=10000', ...a);
const getitems          = (...a) => getDataset('items',          'https://charmscheck.com/wp-json/frm/v2/forms/964/entries?page_size=10000', ...a);
const getitemsinhand    = (...a) => getDataset('itemsinhand',    'https://charmscheck.com/wp-json/frm/v2/forms/1085/entries?page_size=10000',...a);
const getgeneralitems   = (...a) => getDataset('generalitems',   'https://charmscheck.com/wp-json/frm/v2/forms/126/entries?page_size=10000',...a);
const getcreatures      = (...a) => getDataset('creatures',      'https://charmscheck.com/wp-json/frm/v2/forms/48/entries?page_size=10000',  ...a);
const getcreatureparts  = (...a) => getDataset('creatureparts',  'https://charmscheck.com/wp-json/frm/v2/forms/53/entries?page_size=10000',  ...a);
const getplants         = (...a) => getDataset('plants',         'https://charmscheck.com/wp-json/frm/v2/forms/2/entries?page_size=10000',   ...a);
const getplantparts     = (...a) => getDataset('plantparts',     'https://charmscheck.com/wp-json/frm/v2/forms/43/entries?page_size=10000',  ...a);
const getpreparations   = (...a) => getDataset('preparations',   'https://charmscheck.com/wp-json/frm/v2/forms/908/entries?page_size=10000', ...a);
const getfooddrink      = (...a) => getDataset('fooddrink',      'https://charmscheck.com/wp-json/frm/v2/forms/67/entries?page_size=10000',  ...a);

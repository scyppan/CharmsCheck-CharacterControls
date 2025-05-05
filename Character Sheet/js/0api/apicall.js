// configuration
const headers = new Headers();
headers.append('Authorization','Basic Q0E2RS1LUjdaLUtCT0wtTlVYUTp4');
const requestoptions = { method:'GET', headers, redirect:'follow' };

// core fetch + cache
const fetchjson = async url => {
  const res = await fetch(url, requestoptions);
  if (res.status === 200) return res.json();
  throw new Error(res.status);
};
const fetchdata = url => fetchjson(url);

const getCacheEntry = key => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts < cache_ttl) return { ts, data };
    localStorage.removeItem(key);
  } catch {
    localStorage.removeItem(key);
  }
  return null;
};
const setCacheEntry = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch {}
};

// ensure ≥1 entry
const validateEntries = (data, name) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.error(`no ${name} entries`);
    throw new Error(`no ${name} entries found`);
  }
  return data;
};

// generator for all getters
const makeGetter = (varName, dataset, url) => {
  return async (checkCache = true) => {
    const cacheKey = `cache_${dataset}`;
    if (checkCache && Array.isArray(globalThis[varName]) && globalThis[varName].length)
      return globalThis[varName];
    if (checkCache) {
      const entry = getCacheEntry(cacheKey);
      if (entry) {
        globalThis[varName] = entry.data;
        cache_meta.push({ dataset, lastcache: new Date(entry.ts) });
        console.log(`${dataset} loaded from cache (${entry.data.length})`);
        return validateEntries(entry.data, dataset);
      }
    }
    try {
      console.log(`Fetching ${dataset}…`);
      const data = await fetchdata(url);
      setCacheEntry(cacheKey, data);
      cache_meta.push({ dataset, lastcache: new Date() });
      console.log(`${dataset} fetched (${data.length})`);
      globalThis[varName] = data;
      return validateEntries(data, dataset);
    } catch (err) {
      console.error(`${dataset} fetch error:`, err);
      globalThis[varName] = [];
      return validateEntries(globalThis[varName], dataset);
    }
  };
};

// instantiate getters
const getcharacters       = makeGetter('characters',       'characters',       'https://charmscheck.com/wp-json/frm/v2/forms/972/entries?page_size=10000');
const gettraits           = makeGetter('traits',           'traits',           'https://charmscheck.com/wp-json/frm/v2/forms/979/entries?page_size=10000');
const getaccessories      = makeGetter('accessories',      'accessories',      'https://charmscheck.com/wp-json/frm/v2/forms/995/entries?page_size=10000');
const getwands            = makeGetter('wands',            'wands',            'https://charmscheck.com/wp-json/frm/v2/forms/114/entries?page_size=10000');
const getwandwoods        = makeGetter('wandwoods',        'wandwoods',        'https://charmscheck.com/wp-json/frm/v2/forms/120/entries?page_size=10000');
const getwandcores        = makeGetter('wandcores',        'wandcores',        'https://charmscheck.com/wp-json/frm/v2/forms/116/entries?page_size=10000');
const getwandqualities    = makeGetter('wandqualities',    'wandqualities',    'https://charmscheck.com/wp-json/frm/v2/forms/124/entries?page_size=10000');
const getspells           = makeGetter('spells',           'spells',           'https://charmscheck.com/wp-json/frm/v2/forms/191/entries?page_size=10000');
const getbooks            = makeGetter('books',            'books',            'https://charmscheck.com/wp-json/frm/v2/forms/8/entries?page_size=10000');
const getschools          = makeGetter('schools',          'schools',          'https://charmscheck.com/wp-json/frm/v2/forms/3/entries?page_size=10000');
const getproficiencies    = makeGetter('proficiencies',    'proficiencies',    'https://charmscheck.com/wp-json/frm/v2/forms/944/entries?page_size=10000');
const getpotions          = makeGetter('potions',          'potions',          'https://charmscheck.com/wp-json/frm/v2/forms/34/entries?page_size=10000');
const getnamedcreatures   = makeGetter('namedcreatures',   'namedcreatures',   'https://charmscheck.com/wp-json/frm/v2/forms/170/entries?page_size=10000');
const getitems            = makeGetter('items',            'items',            'https://charmscheck.com/wp-json/frm/v2/forms/964/entries?page_size=10000');
const getitemsinhand      = makeGetter('itemsinhand',      'itemsinhand',      'https://charmscheck.com/wp-json/frm/v2/forms/1085/entries?page_size=10000');
const getgeneralitems     = makeGetter('generalitems',     'generalitems',     'https://charmscheck.com/wp-json/frm/v2/forms/126/entries?page_size=10000');
const getcreatures        = makeGetter('creatures',        'creatures',        'https://charmscheck.com/wp-json/frm/v2/forms/48/entries?page_size=10000');
const getcreatureparts    = makeGetter('creatureparts',    'creatureparts',    'https://charmscheck.com/wp-json/frm/v2/forms/53/entries?page_size=10000');
const getplants           = makeGetter('plants',           'plants',           'https://charmscheck.com/wp-json/frm/v2/forms/2/entries?page_size=10000');
const getplantparts       = makeGetter('plantparts',       'plantparts',       'https://charmscheck.com/wp-json/frm/v2/forms/43/entries?page_size=10000');
const getpreparations     = makeGetter('preparations',     'preparations',     'https://charmscheck.com/wp-json/frm/v2/forms/908/entries?page_size=10000');
const getfooddrink        = makeGetter('fooddrink',        'fooddrink',        'https://charmscheck.com/wp-json/frm/v2/forms/67/entries?page_size=10000');

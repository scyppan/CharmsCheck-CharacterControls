// === existing fetch logic ===
const headers = new Headers();
headers.append("Authorization", "Basic Q0E2RS1LUjdaLUtCT0wtTlVYUTp4");
const requestoptions = {
  method: 'GET',
  headers,
  redirect: 'follow'
};

async function fetchjson(url) {
  const res = await fetch(url, requestoptions);
  if (res.status === 200) {
    hidegif();     // loadgiflogic.js
    createfuse();  // searchbox.js
    return res.json();
  }
  throw new Error(res.status);
}

const fetchdata = url => fetchjson(url);

// === caching helpers ===
function getCacheEntry(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts < cache_ttl) {
      return { ts, data };
    }
    localStorage.removeItem(key);
  } catch (e) {
    localStorage.removeItem(key);
  }
  return null;
}

function setCacheEntry(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch (e) {
    // ignore storage errors
  }
}

// === API getters with optional cache check ===
async function gettraits(checkCache = true) {
  const cacheKey = 'cache_traits';
  if (checkCache && traits !== undefined) return;
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      traits = entry.data;
      cache_meta.push({ dataset: 'traits', lastcache: new Date(entry.ts) });
      console.log('traits loaded from cache');
      return;
    }
  }
  try {
    console.log('Fetching traits...');
    traits = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/979/entries?page_size=10000");
    setCacheEntry(cacheKey, traits);
    cache_meta.push({ dataset: 'traits', lastcache: new Date() });
    console.log(`traits fetched (${Array.isArray(traits)?traits.length:Object.keys(traits).length} items)`);
  } catch (err) {
    console.error('Trait fetch error:', err);
    traits = [];
  }
}

async function getaccessories(checkCache = true) {
  const cacheKey = 'cache_accessories';
  if (checkCache && accessories !== undefined) return;
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      accessories = entry.data;
      cache_meta.push({ dataset: 'accessories', lastcache: new Date(entry.ts) });
      console.log('accessories loaded from cache');
      return;
    }
  }
  try {
    console.log('Fetching accessories...');
    accessories = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/995/entries?page_size=10000");
    setCacheEntry(cacheKey, accessories);
    cache_meta.push({ dataset: 'accessories', lastcache: new Date() });
    console.log(`accessories fetched (${Array.isArray(accessories)?accessories.length:Object.keys(accessories).length} items)`);
  } catch (err) {
    console.error('Accessory fetch error:', err);
    accessories = [];
  }
}

async function getwands(checkCache = true) {
  const cacheKey = 'cache_wands';
  if (checkCache && wands !== undefined) return;
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      wands = entry.data;
      cache_meta.push({ dataset: 'wands', lastcache: new Date(entry.ts) });
      console.log('wands loaded from cache');
      return;
    }
  }
  try {
    console.log('Fetching wands...');
    wands = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/114/entries?page_size=10000");
    setCacheEntry(cacheKey, wands);
    cache_meta.push({ dataset: 'wands', lastcache: new Date() });
    console.log(`wands fetched (${Array.isArray(wands)?wands.length:Object.keys(wands).length} items)`);
  } catch (err) {
    console.error('Wands fetch error:', err);
    wands = [];
  }
}

async function getwandwoods(checkCache = true) {
  const cacheKey = 'cache_wandwoods';
  if (checkCache && wandwoods !== undefined) return;
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      wandwoods = entry.data;
      cache_meta.push({ dataset: 'wandwoods', lastcache: new Date(entry.ts) });
      console.log('wandwoods loaded from cache');
      return;
    }
  }
  try {
    console.log('Fetching wandwoods...');
    wandwoods = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/120/entries?page_size=10000");
    setCacheEntry(cacheKey, wandwoods);
    cache_meta.push({ dataset: 'wandwoods', lastcache: new Date() });
    console.log(`wandwoods fetched (${Array.isArray(wandwoods)?wandwoods.length:Object.keys(wandwoods).length} items)`);
  } catch (err) {
    console.error('Wandwoods fetch error:', err);
    wandwoods = [];
  }
}

async function getwandcores(checkCache = true) {
  const cacheKey = 'cache_wandcores';
  if (checkCache && wandcores !== undefined) return;
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      wandcores = entry.data;
      cache_meta.push({ dataset: 'wandcores', lastcache: new Date(entry.ts) });
      console.log('wandcores loaded from cache');
      return;
    }
  }
  try {
    console.log('Fetching wandcores...');
    wandcores = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/116/entries?page_size=10000");
    setCacheEntry(cacheKey, wandcores);
    cache_meta.push({ dataset: 'wandcores', lastcache: new Date() });
    console.log(`wandcores fetched (${Array.isArray(wandcores)?wandcores.length:Object.keys(wandcores).length} items)`);
  } catch (err) {
    console.error('Wandcores fetch error:', err);
    wandcores = [];
  }
}

async function getwandqualities(checkCache = true) {
  const cacheKey = 'cache_wandqualities';
  if (checkCache && wandqualities !== undefined) return;
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      wandqualities = entry.data;
      cache_meta.push({ dataset: 'wandqualities', lastcache: new Date(entry.ts) });
      console.log('wandqualities loaded from cache');
      return;
    }
  }
  try {
    console.log('Fetching wandqualities...');
    wandqualities = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/124/entries?page_size=10000");
    setCacheEntry(cacheKey, wandqualities);
    cache_meta.push({ dataset: 'wandqualities', lastcache: new Date() });
    console.log(`wandqualities fetched (${Array.isArray(wandqualities)?wandqualities.length:Object.keys(wandqualities).length} items)`);
  } catch (err) {
    console.error('Wandqualities fetch error:', err);
    wandqualities = [];
  }
}

async function getspells(checkCache = true) {
  const cacheKey = 'cache_spells';
  if (checkCache && spells !== undefined) return;
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      spells = entry.data;
      cache_meta.push({ dataset: 'spells', lastcache: new Date(entry.ts) });
      console.log('spells loaded from cache');
      return;
    }
  }
  try {
    console.log('Fetching spells...');
    spells = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/191/entries?page_size=10000");
    setCacheEntry(cacheKey, spells);
    cache_meta.push({ dataset: 'spells', lastcache: new Date() });
    console.log(`spells fetched (${Array.isArray(spells)?spells.length:Object.keys(spells).length} items)`);
  } catch (err) {
    console.error('Spells fetch error:', err);
    spells = [];
  }
}

async function getbooks(checkCache = true) {
  const cacheKey = 'cache_books';
  if (checkCache && books !== undefined) return;
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      books = entry.data;
      cache_meta.push({ dataset: 'books', lastcache: new Date(entry.ts) });
      console.log('books loaded from cache');
      return;
    }
  }
  try {
    console.log('Fetching books...');
    books = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/8/entries?page_size=10000");
    setCacheEntry(cacheKey, books);
    cache_meta.push({ dataset: 'books', lastcache: new Date() });
    console.log(`books fetched (${Array.isArray(books)?books.length:Object.keys(books).length} items)`);
  } catch (err) {
    console.error('Books fetch error:', err);
    books = [];
  }
}

async function getschools(checkCache = true) {
  const cacheKey = 'cache_schools';
  if (checkCache && schools !== undefined) return;
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      schools = entry.data;
      cache_meta.push({ dataset: 'schools', lastcache: new Date(entry.ts) });
      console.log('schools loaded from cache');
      return;
    }
  }
  try {
    console.log('Fetching schools...');
    schools = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/3/entries?page_size=10000");
    setCacheEntry(cacheKey, schools);
    cache_meta.push({ dataset: 'schools', lastcache: new Date() });
    console.log(`schools fetched (${Array.isArray(schools)?schools.length:Object.keys(schools).length} items)`);
  } catch (err) {
    console.error('Schools fetch error:', err);
    schools = [];
  }
}

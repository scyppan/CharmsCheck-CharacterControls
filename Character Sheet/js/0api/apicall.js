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

async function getproficiencies(checkCache = true) {
  const cacheKey = 'cache_proficiencies';
  // 1) if already loaded in-memory, skip
  if (checkCache && proficiencies !== undefined) return;
  
  // 2) try cache
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      proficiencies = entry.data;
      cache_meta.push({ dataset: 'proficiencies', lastcache: new Date(entry.ts) });
      console.log('proficiencies loaded from cache');
      return;
    }
  }

  // 3) fetch from API
  try {
    console.log('Fetching proficiencies...');
    proficiencies = await fetchdata(
      // replace FORM_ID with your actual form ID for proficiencies
      "https://charmscheck.com/wp-json/frm/v2/forms/944/entries?page_size=10000"
    );
    setCacheEntry(cacheKey, proficiencies);
    cache_meta.push({ dataset: 'proficiencies', lastcache: new Date() });
    const count = Array.isArray(proficiencies)
      ? proficiencies.length
      : Object.keys(proficiencies).length;
    console.log(`proficiencies fetched (${count} items)`);
  } catch (err) {
    console.error('Proficiencies fetch error:', err);
    proficiencies = [];
  }
}
// Fetch potions similarly to proficiencies and books
async function getpotions(checkCache = true) {
  const cacheKey = 'cache_potions';
  // 1) if already loaded in-memory, skip
  if (checkCache && potions !== undefined) return;

  // 2) try cache
  if (checkCache) {
      const entry = getCacheEntry(cacheKey);
      if (entry) {
          potions = entry.data;
          cache_meta.push({ dataset: 'potions', lastcache: new Date(entry.ts) });
          console.log('potions loaded from cache');
          return;
      }
  }

  // 3) fetch from API
  try {
      console.log('Fetching potions...');
      potions = await fetchdata(
          // replace FORM_ID with your actual form ID for potions
          "https://charmscheck.com/wp-json/frm/v2/forms/34/entries?page_size=10000"
      );
      setCacheEntry(cacheKey, potions);
      cache_meta.push({ dataset: 'potions', lastcache: new Date() });
      const count = Array.isArray(potions)
          ? potions.length
          : Object.keys(potions).length;
      console.log(`potions fetched (${count} items)`);
  } catch (err) {
      console.error('Potions fetch error:', err);
      potions = [];
  }
}

async function getnamedcreatures(checkCache = true) {
  const cacheKey = 'cache_namedcreatures';
  // 1) if already loaded in-memory, skip
  if (checkCache && namedcreatures !== undefined) return;

  // 2) try cache
  if (checkCache) {
      const entry = getCacheEntry(cacheKey);
      if (entry) {
          namedcreatures = entry.data;
          cache_meta.push({ dataset: 'namedcreatures', lastcache: new Date(entry.ts) });
          console.log('namedcreatures loaded from cache');
          return;
      }
  }

  // 3) fetch from API
  try {
      console.log('Fetching named creatures...');
      namedcreatures = await fetchdata(
          // replace FORM_ID with your actual form ID for named creatures
          "https://charmscheck.com/wp-json/frm/v2/forms/170/entries?page_size=10000"
      );
      setCacheEntry(cacheKey, namedcreatures);
      cache_meta.push({ dataset: 'namedcreatures', lastcache: new Date() });
      const count = Array.isArray(namedcreatures)
          ? namedcreatures.length
          : Object.keys(namedcreatures).length;
      console.log(`namedcreatures fetched (${count} items)`);
  } catch (err) {
      console.error('Named creatures fetch error:', err);
      namedcreatures = [];
  }
}

async function getitems(checkCache = true) {
  const cacheKey = 'cache_items';

  // 1) If already loaded in-memory, skip
  if (checkCache && items !== undefined) return;

  // 2) Try cache
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      items = entry.data;
      cache_meta.push({ dataset: 'items', lastcache: new Date(entry.ts) });
      console.log('items loaded from cache');
      return;
    }
  }

  // 3) Fetch from API
  try {
    console.log('Fetching items...');
    items = await fetchdata(
      // replace FORM_ID with your actual form ID for items
      "https://charmscheck.com/wp-json/frm/v2/forms/964/entries?page_size=10000"
    );
    setCacheEntry(cacheKey, items);
    cache_meta.push({ dataset: 'items', lastcache: new Date() });

    const count = Array.isArray(items)
      ? items.length
      : Object.keys(items).length;
    console.log(`items fetched (${count} items)`);
  } catch (err) {
    console.error('Items fetch error:', err);
    items = [];
  }
}

async function getitemsinhand(checkCache = true) {
  const cacheKey = 'cache_itemsinhand';

  // 1) If already loaded in-memory, skip
  if (checkCache && itemsinhand !== undefined) return;

  // 2) Try cache
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      itemsinhand = entry.data;
      cache_meta.push({ dataset: 'itemsinhand', lastcache: new Date(entry.ts) });
      console.log('items in hand loaded from cache');
      return;
    }
  }

  // 3) Fetch from API
  try {
    console.log('Fetching items in hand...');
    itemsinhand = await fetchdata(
      "https://charmscheck.com/wp-json/frm/v2/forms/1085/entries?page_size=10000"
    );
    setCacheEntry(cacheKey, itemsinhand);
    cache_meta.push({ dataset: 'itemsinhand', lastcache: new Date() });

    const count = Array.isArray(itemsinhand)
      ? itemsinhand.length
      : Object.keys(itemsinhand).length;
    console.log(`items in hand fetched (${count} items)`);
  } catch (err) {
    console.error('Items in hand fetch error:', err);
    itemsinhand = [];
  }
}

async function getgeneralitems(checkCache = true) {
  const cacheKey = 'cache_generalitems';

  // 1) If already loaded in-memory, skip
  if (checkCache && generalitems !== undefined) return;

  // 2) Try cache
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      generalitems = entry.data;
      cache_meta.push({ dataset: 'generalitems', lastcache: new Date(entry.ts) });
      console.log('general items loaded from cache');
      return;
    }
  }

  // 3) Fetch from API
  try {
    console.log('Fetching general items...');
    generalitems = await fetchdata(
      "https://charmscheck.com/wp-json/frm/v2/forms/126/entries?page_size=10000"
    );
    setCacheEntry(cacheKey, generalitems);
    cache_meta.push({ dataset: 'generalitems', lastcache: new Date() });

    const count = Array.isArray(generalitems)
      ? generalitems.length
      : Object.keys(generalitems).length;
    console.log(`general items fetched (${count} items)`);
  } catch (err) {
    console.error('General items fetch error:', err);
    generalitems = [];
  }
}

async function getcreatures(checkCache = true) {
  const cacheKey = 'cache_creatures';

  // 1) If already loaded in-memory, skip
  if (checkCache && creatures !== undefined) return;

  // 2) Try cache
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      creatures = entry.data;
      cache_meta.push({ dataset: 'creatures', lastcache: new Date(entry.ts) });
      console.log('creatures loaded from cache');
      return;
    }
  }

  // 3) Fetch from API
  try {
    console.log('Fetching creatures...');
    creatures = await fetchdata(
      "https://charmscheck.com/wp-json/frm/v2/forms/48/entries?page_size=10000"
    );
    setCacheEntry(cacheKey, creatures);
    cache_meta.push({ dataset: 'creatures', lastcache: new Date() });

    const count = Array.isArray(creatures)
      ? creatures.length
      : Object.keys(creatures).length;
    console.log(`creatures fetched (${count} items)`);
  } catch (err) {
    console.error('Creatures fetch error:', err);
    creatures = [];
  }
}

async function getcreatureparts(checkCache = true) {
  const cacheKey = 'cache_creatureparts';

  // 1) If already loaded in-memory, skip
  if (checkCache && creatureparts !== undefined) return;

  // 2) Try cache
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      creatureparts = entry.data;
      cache_meta.push({ dataset: 'creatureparts', lastcache: new Date(entry.ts) });
      console.log('creature parts loaded from cache');
      return;
    }
  }

  // 3) Fetch from API
  try {
    console.log('Fetching creature parts...');
    creatureparts = await fetchdata(
      "https://charmscheck.com/wp-json/frm/v2/forms/53/entries?page_size=10000"
    );
    setCacheEntry(cacheKey, creatureparts);
    cache_meta.push({ dataset: 'creatureparts', lastcache: new Date() });

    const count = Array.isArray(creatureparts)
      ? creatureparts.length
      : Object.keys(creatureparts).length;
    console.log(`creature parts fetched (${count} items)`);
  } catch (err) {
    console.error('Creature parts fetch error:', err);
    creatureparts = [];
  }
}

async function getplants(checkCache = true) {
  const cacheKey = 'cache_plants';

  // 1) If already loaded in-memory, skip
  if (checkCache && plants !== undefined) return;

  // 2) Try cache
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      plants = entry.data;
      cache_meta.push({ dataset: 'plants', lastcache: new Date(entry.ts) });
      console.log('plants loaded from cache');
      return;
    }
  }

  // 3) Fetch from API
  try {
    console.log('Fetching plants...');
    plants = await fetchdata(
      "https://charmscheck.com/wp-json/frm/v2/forms/2/entries?page_size=10000"
    );
    setCacheEntry(cacheKey, plants);
    cache_meta.push({ dataset: 'plants', lastcache: new Date() });

    const count = Array.isArray(plants)
      ? plants.length
      : Object.keys(plants).length;
    console.log(`plants fetched (${count} items)`);
  } catch (err) {
    console.error('Plants fetch error:', err);
    plants = [];
  }
}

async function getplantparts(checkCache = true) {
  const cacheKey = 'cache_plantparts';

  // 1) If already loaded in-memory, skip
  if (checkCache && plantparts !== undefined) return;

  // 2) Try cache
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      plantparts = entry.data;
      cache_meta.push({ dataset: 'plantparts', lastcache: new Date(entry.ts) });
      console.log('plant parts loaded from cache');
      return;
    }
  }

  // 3) Fetch from API
  try {
    console.log('Fetching plant parts...');
    plantparts = await fetchdata(
      "https://charmscheck.com/wp-json/frm/v2/forms/43/entries?page_size=10000"
    );
    setCacheEntry(cacheKey, plantparts);
    cache_meta.push({ dataset: 'plantparts', lastcache: new Date() });

    const count = Array.isArray(plantparts)
      ? plantparts.length
      : Object.keys(plantparts).length;
    console.log(`plant parts fetched (${count} items)`);
  } catch (err) {
    console.error('Plant parts fetch error:', err);
    plantparts = [];
  }
}

async function getpreparations(checkCache = true) {
  const cacheKey = 'cache_preparations';

  // 1) If already loaded in-memory, skip
  if (checkCache && preparations !== undefined) return;

  // 2) Try cache
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      preparations = entry.data;
      cache_meta.push({ dataset: 'preparations', lastcache: new Date(entry.ts) });
      console.log('preparations loaded from cache');
      return;
    }
  }

  // 3) Fetch from API
  try {
    console.log('Fetching preparations...');
    preparations = await fetchdata(
      "https://charmscheck.com/wp-json/frm/v2/forms/908/entries?page_size=10000"
    );
    setCacheEntry(cacheKey, preparations);
    cache_meta.push({ dataset: 'preparations', lastcache: new Date() });

    const count = Array.isArray(preparations)
      ? preparations.length
      : Object.keys(preparations).length;
    console.log(`preparations fetched (${count} items)`);
  } catch (err) {
    console.error('Preparations fetch error:', err);
    preparations = [];
  }
}

async function getfooddrink(checkCache = true) {
  const cacheKey = 'cache_fooddrink';

  // 1) If already loaded in-memory, skip
  if (checkCache && fooddrink !== undefined) return;

  // 2) Try cache
  if (checkCache) {
    const entry = getCacheEntry(cacheKey);
    if (entry) {
      fooddrink = entry.data;
      cache_meta.push({ dataset: 'fooddrink', lastcache: new Date(entry.ts) });
      console.log('food & drinks loaded from cache');
      return;
    }
  }

  // 3) Fetch from API
  try {
    console.log('Fetching food & drinks...');
    fooddrink = await fetchdata(
      "https://charmscheck.com/wp-json/frm/v2/forms/67/entries?page_size=10000"
    );
    setCacheEntry(cacheKey, fooddrink);
    cache_meta.push({ dataset: 'fooddrink', lastcache: new Date() });

    const count = Array.isArray(fooddrink)
      ? fooddrink.length
      : Object.keys(fooddrink).length;
    console.log(`food & drinks fetched (${count} items)`);
  } catch (err) {
    console.error('Food & drinks fetch error:', err);
    fooddrink = [];
  }
}


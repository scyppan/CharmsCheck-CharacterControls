// ================= Config =================
const cache_configs = [
  { key: 'characters',     fn: 'getcharacters'      },
  { key: 'books',          fn: 'getbooks'           },
  { key: 'spells',         fn: 'getspells'          },
  { key: 'proficiencies',  fn: 'getproficiencies'   },
  { key: 'items',          fn: 'getitems'           },
  { key: 'traits',         fn: 'gettraits'          },
  { key: 'accessories',    fn: 'getaccessories'     },
  { key: 'wands',          fn: 'getwands'           },
  { key: 'wandwoods',      fn: 'getwandwoods'       },
  { key: 'wandcores',      fn: 'getwandcores'       },
  { key: 'wandqualities',  fn: 'getwandqualities'   },
  { key: 'schools',        fn: 'getschools'         },
  { key: 'potions',        fn: 'getpotions'         },
  { key: 'namedcreatures', fn: 'getnamedcreatures'  },
  { key: 'itemsinhand',    fn: 'getitemsinhand'     },
  { key: 'generalitems',   fn: 'getgeneralitems'    },
  { key: 'creatures',      fn: 'getcreatures'       },
  { key: 'creatureparts',  fn: 'getcreatureparts'   },
  { key: 'plants',         fn: 'getplants'          },
  { key: 'plantparts',     fn: 'getplantparts'      },
  { key: 'preparations',   fn: 'getpreparations'    },
  { key: 'fooddrink',      fn: 'getfooddrink'       }
];

const assignCacheData = {
  characters:     v => characters     = v,
  traits:         v => traits         = v,
  accessories:    v => accessories    = v,
  wands:          v => wands          = v,
  wandwoods:      v => wandwoods      = v,
  wandcores:      v => wandcores      = v,
  wandqualities:  v => wandqualities  = v,
  spells:         v => spells         = v,
  books:          v => books          = v,
  schools:        v => schools        = v,
  proficiencies:  v => proficiencies  = v,
  potions:        v => potions        = v,
  namedcreatures: v => namedcreatures = v,
  items:          v => items          = v,
  itemsinhand:    v => itemsinhand    = v,
  generalitems:   v => generalitems   = v,
  creatures:      v => creatures      = v,
  creatureparts:  v => creatureparts  = v,
  plants:         v => plants         = v,
  plantparts:     v => plantparts     = v,
  preparations:   v => preparations   = v,
  fooddrink:      v => fooddrink      = v
};

const getCacheData = {
  characters:     () => characters,
  traits:         () => traits,
  accessories:    () => accessories,
  wands:          () => wands,
  wandwoods:      () => wandwoods,
  wandcores:      () => wandcores,
  wandqualities:  () => wandqualities,
  spells:         () => spells,
  books:          () => books,
  schools:        () => schools,
  proficiencies:  () => proficiencies,
  potions:        () => potions,
  namedcreatures: () => namedcreatures,
  items:          () => items,
  itemsinhand:    () => itemsinhand,
  generalitems:   () => generalitems,
  creatures:      () => creatures,
  creatureparts:  () => creatureparts,
  plants:         () => plants,
  plantparts:     () => plantparts,
  preparations:   () => preparations,
  fooddrink:      () => fooddrink
};

// ================ Indexing ================
const INDEX_FIELDS = {
  spells:         ['spellname','skill','subtype'],
  items:          ['name','category'],
  proficiencies:  ['name','type'],
  namedcreatures: ['name','species'],
  potions:        ['name'],
  characters:     ['shortname']
};
window.indexes = window.indexes || {};

function buildIndexes(key) {
  const fields = INDEX_FIELDS[key];
  if (!fields) return;
  const data = getCacheData[key]() || [];
  const idxObj = {};
  fields.forEach(f => { idxObj[f] = {}; });
  data.forEach(rec => {
    fields.forEach(f => {
      const val = rec[f];
      if (val != null) {
        idxObj[f][val] = idxObj[f][val] || [];
        idxObj[f][val].push(rec);
      }
    });
  });
  window.indexes[key] = idxObj;
}

// ============== init_cache ================
async function init_cache(forceApi = false) {
  for (const { key, fn } of cache_configs) {
    const storageKey = `cache_${key}`;
    let loadedFromCache = false;

    // 1) Try localStorage (unless forcing)
    if (!forceApi) {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        try {
          const { ts, data } = JSON.parse(raw);
          if (Date.now() - ts < cache_ttl) {
            assignCacheData[key](data);
            cache_meta.push({ dataset: key, lastcache: new Date(ts) });
            console.log(`cache hit: loaded ${key} (ts=${new Date(ts).toISOString()})`);
            loadedFromCache = true;
            buildIndexes(key);
          } else {
            localStorage.removeItem(storageKey);
            console.log(`cache expired for ${key}`);
          }
        } catch (e) {
          localStorage.removeItem(storageKey);
          console.warn(`cache parse error for ${key}, clearing`, e);
        }
      }
    }

    // 2) Should we fetch fresh?
    const current = getCacheData[key]();
    const isEmpty = Array.isArray(current) && current.length === 0;
    if (forceApi || !loadedFromCache || current == null || isEmpty) {
      console.warn(`fetching fresh ${key} (forceApi=${forceApi})…`);
      try {
        // first: load from network
        console.log(window);
        const data = await window[fn](false, forceApi);

        // reject single‐string or error payloads
        if (
          Array.isArray(data) &&
          data.length === 1 &&
          typeof data[0] === 'string'
        ) {
          throw new Error(`invalid payload for ${key}: ${data[0]}`);
        }
        if (!Array.isArray(data)) {
          throw new Error(`non-array payload for ${key}`);
        }

        // assign & index
        assignCacheData[key](data);
        buildIndexes(key);

        // only now write to localStorage
        localStorage.setItem(
          storageKey,
          JSON.stringify({ ts: Date.now(), data })
        );
        cache_meta.push({ dataset: key, lastcache: new Date() });
        console.log(`cache refreshed: ${key} (${data.length} items)`);
      } catch (err) {
        console.error(`failed to fetch fresh ${key}:`, err);
        // nuke any stale or error cache
        localStorage.removeItem(storageKey);
      }
    }
  }
}

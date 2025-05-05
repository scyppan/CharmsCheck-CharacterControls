/* cache.js – drop-in replacement with in-memory indexing added */

const cache_configs = [
    { key: 'characters',     fn: 'getcharacters'      },
    { key: 'traits',         fn: 'gettraits'          },
    { key: 'accessories',    fn: 'getaccessories'     },
    { key: 'wands',          fn: 'getwands'           },
    { key: 'wandwoods',      fn: 'getwandwoods'       },
    { key: 'wandcores',      fn: 'getwandcores'       },
    { key: 'wandqualities',  fn: 'getwandqualities'   },
    { key: 'spells',         fn: 'getspells'          },
    { key: 'books',          fn: 'getbooks'           },
    { key: 'schools',        fn: 'getschools'         },
    { key: 'proficiencies',  fn: 'getproficiencies'   },
    { key: 'potions',        fn: 'getpotions'         },
    { key: 'namedcreatures', fn: 'getnamedcreatures'  },
    { key: 'items',          fn: 'getitems'           },
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
  
  /* ── INDEX CONFIGURATION ────────────────────────────────────────────────── */
  /* Define which fields to index for each dataset. */
  const INDEX_FIELDS = {
    spells:         ['spellname','skill','subtype'],
    items:          ['name','category'],
    proficiencies:  ['name','type'],
    namedcreatures: ['name','species'],
    potions:        ['name'],
    characters:     ['shortname']
  };
  /* Global container for indexes */
  window.indexes = window.indexes || {};
  
  /**
   * Build in-memory indexes for one dataset.
   * Creates window.indexes[key][field] = { value1: [records], value2: [...] }
   */
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
          if (!idxObj[f][val]) idxObj[f][val] = [];
          idxObj[f][val].push(rec);
        }
      });
    });
    window.indexes[key] = idxObj;
  }
  
  async function init_cache() {
    for (const { key, fn } of cache_configs) {
      const storageKey = `cache_${key}`;
      let loadedFromCache = false;
  
      // 1) try loading from localStorage
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        try {
          const { ts, data } = JSON.parse(raw);
          if (Date.now() - ts < cache_ttl) {
            assignCacheData[key](data);
            cache_meta.push({ dataset: key, lastcache: new Date(ts) });
            console.log(`cache hit: loaded ${key} (ts=${new Date(ts).toISOString()})`);
            loadedFromCache = true;
            buildIndexes(key);                // ← index on cache hit
          } else {
            localStorage.removeItem(storageKey);
            console.log(`cache expired for ${key}`);
          }
        } catch (e) {
          localStorage.removeItem(storageKey);
          console.warn(`cache parse error for ${key}, clearing`, e);
        }
      }
  
      // 2) fresh fetch if needed
      const current = getCacheData[key]();
      const isEmptyArray = Array.isArray(current) && current.length === 0;
      if (!loadedFromCache || current == null || isEmptyArray) {
        console.warn(`cache missing or empty for ${key}, fetching fresh…`);
        localStorage.removeItem(storageKey);
  
        try {
          await window[fn](true);          // e.g. getspells(true)
          const fresh = getCacheData[key]();
          cache_meta.push({ dataset: key, lastcache: new Date() });
          localStorage.setItem(storageKey,
            JSON.stringify({ ts: Date.now(), data: fresh }));
          console.log(`cache refreshed: ${key}`);
          buildIndexes(key);               // ← index on fresh fetch
        } catch (err) {
          console.error(`failed to fetch fresh ${key}:`, err);
        }
      }
    }
  }
  
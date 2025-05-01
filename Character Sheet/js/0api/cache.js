const cache_configs = [
    { key: 'traits',        fn: 'gettraits'        },
    { key: 'accessories',   fn: 'getaccessories'   },
    { key: 'wands',         fn: 'getwands'         },
    { key: 'wandwoods',     fn: 'getwandwoods'     },
    { key: 'wandcores',     fn: 'getwandcores'     },
    { key: 'wandqualities', fn: 'getwandqualities' },
    { key: 'spells',        fn: 'getspells'        },
    { key: 'books',         fn: 'getbooks'         },
    { key: 'schools',       fn: 'getschools'       },
    { key: 'proficiencies', fn: 'getproficiencies' },
    { key: 'potions',       fn: 'getpotions'       },
    { key: 'namedcreatures',fn: 'getnamedcreatures'},
    { key: 'items',fn: 'getitems'},
  ];
  
  const assignCacheData = {
    traits:        v => traits        = v,
    accessories:   v => accessories   = v,
    wands:         v => wands         = v,
    wandwoods:     v => wandwoods     = v,
    wandcores:     v => wandcores     = v,
    wandqualities: v => wandqualities = v,
    spells:        v => spells        = v,
    books:         v => books         = v,
    schools:       v => schools       = v,
    proficiencies: v => proficiencies = v,
    potions:       v => potions       = v,
    namedcreatures:v => namedcreatures= v,
    items:         v => items         = v

  };
  
  // 3) A mirror map to read those same locals by key
  const getCacheData = {
    traits:        () => traits,
    accessories:   () => accessories,
    wands:         () => wands,
    wandwoods:     () => wandwoods,
    wandcores:     () => wandcores,
    wandqualities: () => wandqualities,
    spells:        () => spells,
    books:         () => books,
    schools:       () => schools,
    proficiencies: () => proficiencies,
    potions:       () => potions,
    namedcreatures:() => namedcreatures,
    items:         () => items
  };
  
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
          } else {
            localStorage.removeItem(storageKey);
            console.log(`cache expired for ${key}`);
          }
        } catch (e) {
          localStorage.removeItem(storageKey);
          console.warn(`cache parse error for ${key}, clearing`, e);
        }
      }
  
      // 2) check if the local var is actually populated
      const current = getCacheData[key]();
      const isEmptyArray = Array.isArray(current) && current.length === 0;
      if (!loadedFromCache || current == null || isEmptyArray) {
        console.warn(`cache missing or empty for ${key}, fetching fresh…`);
        localStorage.removeItem(storageKey);
  
        try {
          // window[fn] should be your get... function that returns a Promise
          await window[fn](true);
          const fresh = getCacheData[key]();
          cache_meta.push({ dataset: key, lastcache: new Date() });
          localStorage.setItem(storageKey,
            JSON.stringify({ ts: Date.now(), data: fresh }));
          console.log(`cache refreshed: ${key}`);
        } catch (err) {
          console.error(`failed to fetch fresh ${key}:`, err);
        }
      }
    }
  }
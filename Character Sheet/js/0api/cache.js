// list of datasets and their corresponding get-functions
const cache_configs = [
  { key: 'traits',       fn: 'gettraits'       },
  { key: 'accessories',  fn: 'getaccessories'  },
  { key: 'wands',        fn: 'getwands'        },
  { key: 'wandwoods',    fn: 'getwandwoods'    },
  { key: 'wandcores',    fn: 'getwandcores'    },
  { key: 'wandqualities',fn: 'getwandqualities'},
  { key: 'spells',       fn: 'getspells'       },
  { key: 'books',        fn: 'getbooks'        },
  { key: 'schools',      fn: 'getschools'      }
];

/**
 * initialize in-memory globals from localStorage if fresh
 */
function init_cache() {
  cache_configs.forEach(({ key }) => {
    const storageKey = `cache_${key}`;
    const raw = localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const { ts, data } = JSON.parse(raw);
      if (Date.now() - ts < cache_ttl) {
        window[key] = data;
        cache_meta.push({ dataset: key, lastcache: new Date(ts) });
        console.log(`cache hit: loaded ${key} (ts=${new Date(ts).toISOString()})`);
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (e) {
      localStorage.removeItem(storageKey);
    }
  });
}



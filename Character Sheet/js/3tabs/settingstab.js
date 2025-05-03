// settings.js

// list of datasets to inspect/clear
const cacheDatasets = [
  'traits',
  'accessories',
  'wands',
  'wandwoods',
  'wandcores',
  'wandqualities',
  'spells',
  'books',
  'schools',
  'proficiencies',
  'potions',
  'namedcreatures',
  'items',
  'itemsinhand',
  'generalitems',
  'creatures',
  'creatureparts',
  'plants',
  'plantparts',
  'preparations',
  'fooddrink'
];

/**
 * clear cache for a single dataset and reset its global var
 * @param {string} key
 */
function clearcachefor(key) {
  localStorage.removeItem('cache_' + key);
  window[key] = undefined;
  // remove from cache_meta
  if (Array.isArray(cache_meta)) {
    const idx = cache_meta.findIndex(e => e.dataset === key);
    if (idx > -1) cache_meta.splice(idx, 1);
  }
  renderSettingsUI();
  console.log(`cache cleared for ${key}`);
}

/**
 * fetch a dataset anew (after clearing or first time)
 * and update cache timestamp
 * @param {string} key
 */
async function fetchcachefor(key) {
  const fnName = 'get' + key;
  const fn = window[fnName];
  if (typeof fn !== 'function') {
    console.error(`Function ${fnName} not found for dataset ${key}`);
    return;
  }
  try {
    // perform the API load
    await fn(false);
    // after load, store to localStorage manually
    const storageKey = 'cache_' + key;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ ts: Date.now(), data: window[key] }));
      // update cache_meta for settings history
      if (Array.isArray(cache_meta)) {
        const oldIdx = cache_meta.findIndex(e => e.dataset === key);
        if (oldIdx > -1) cache_meta.splice(oldIdx, 1);
        cache_meta.push({ dataset: key, lastcache: new Date() });
      }
      console.log(`${key} cache saved via fetchcachefor`);
    } catch (e) {
      console.warn(`Failed to write cache for ${key}:`, e);
    }
    // refresh UI immediately
    renderSettingsUI();
    console.log(`${key} fetched and UI updated`);
  } catch (err) {
    console.error(`Error fetching ${key}:`, err);
  }
}

/**
 * render the settings tab UI:
 * - show last cache datetime for each dataset
 * - clear and fetch buttons per dataset
 * - note about reloading form
 */
function renderSettingsUI() {
  const tabcontent = document.getElementById('tabcontent');
  tabcontent.textContent = '';

  const mini = document.createElement('div');
  mini.id = 'settingsminiwindow';
  Object.assign(mini.style, {
    border: '1px solid #ccc',
    padding: '10px',
    maxWidth: '400px'
  });

  const header = document.createElement('h3');
  header.textContent = 'Cached Datasets';
  mini.appendChild(header);

  const list = document.createElement('ul');
  cacheDatasets.forEach(key => {
    const item = document.createElement('li');
    item.style.marginBottom = '8px';

    // name and timestamp
    const storageKey = 'cache_' + key;
    const raw = localStorage.getItem(storageKey);
    let text;
    if (raw) {
      try {
        const { ts } = JSON.parse(raw);
        text = key + ': ' + new Date(ts).toLocaleString();
      } catch {
        text = key + ': Invalid cache data';
      }
    } else {
      text = key + ': Not cached';
    }
    const span = document.createElement('span');
    span.textContent = text;
    item.appendChild(span);

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear';
    clearBtn.style.marginLeft = '8px';
    clearBtn.addEventListener('click', () => clearcachefor(key));
    item.appendChild(clearBtn);

    const fetchBtn = document.createElement('button');
    fetchBtn.textContent = 'Fetch';
    fetchBtn.style.marginLeft = '4px';
    fetchBtn.addEventListener('click', () => fetchcachefor(key));
    item.appendChild(fetchBtn);

    list.appendChild(item);
  });
  mini.appendChild(list);

  const clearAll = document.createElement('button');
  clearAll.textContent = 'Clear All Cache';
  clearAll.style.marginTop = '10px';
  clearAll.addEventListener('click', () => cacheDatasets.forEach(clearcachefor));
  mini.appendChild(clearAll);

  const note = document.createElement('div');
  note.style.marginTop = '12px';
  note.style.fontSize = '12px';
  note.style.color = '#555';
  note.textContent = "Note: After clearing a dataset's cache, reload the form to update displayed data.";
  mini.appendChild(note);

  tabcontent.appendChild(mini);
}

/**
 * entry point for settings tab
 */
function settingstab() {
  renderSettingsUI();
}

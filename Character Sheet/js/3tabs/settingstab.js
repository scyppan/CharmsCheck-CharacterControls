// settings.js

// list of datasets to inspect/clear
const cacheDatasets = ['characters',
  'traits', 'accessories', 'wands', 'wandwoods', 'wandcores', 'wandqualities',
  'spells', 'books', 'schools', 'proficiencies', 'potions', 'namedcreatures',
  'items', 'itemsinhand', 'generalitems', 'creatures', 'creatureparts',
  'plants', 'plantparts', 'preparations', 'fooddrink'
];

async function settingstab() {
  const tabcontent = document.getElementById('tabcontent');
  tabcontent.textContent = 'Loading settings…';
  rendersettingstabui();
  loadcachemini();                   // default view
  activateSettingTab('btncache');
}

function rendersettingstabui() {
  const tabcontent = document.getElementById('tabcontent');
  tabcontent.textContent = '';

  // button bar
  const bar = document.createElement('div');
  bar.id = 'settingstabbuttonbar';
  const btnCache = Object.assign(document.createElement('button'), { id: 'btncache', textContent: 'Cache' });
  const btnHistory = Object.assign(document.createElement('button'), { id: 'btnhistory', textContent: 'Roll History' });
  btnCache.addEventListener('click', () => { activateSettingTab('btncache'); loadcachemini(); });
  btnHistory.addEventListener('click', () => { activateSettingTab('btnhistory'); loadhistorymini(); });
  bar.append(btnCache, btnHistory);
  tabcontent.append(bar);

  // two mini-windows
  const cachePane = document.createElement('div'); cachePane.id = 'cacheminiwindow';
  const historyPane = document.createElement('div'); historyPane.id = 'historyminiwindow';
  tabcontent.append(cachePane, historyPane);
}

function activateSettingTab(tabId) {
  document.querySelectorAll('#settingstabbuttonbar > button')
    .forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');

  document.getElementById('cacheminiwindow').style.display = (tabId === 'btncache') ? '' : 'none';
  document.getElementById('historyminiwindow').style.display = (tabId === 'btnhistory') ? '' : 'none';
}

/**
 * Displays each cache dataset with timestamp (if any)
 * and the number of items currently loaded in the corresponding global variable.
 */
function loadcachemini() {
  const container = document.getElementById('cacheminiwindow');
  container.textContent = '';

  const list = document.createElement('ul');
  list.id = 'settingsminiwindow';

  cacheDatasets.forEach(key => {
    const li = document.createElement('li');

    // 1. Timestamp or “Not cached”
    const raw = localStorage.getItem('cache_' + key);
    let label = key + ': Not cached';
    if (raw) {
      try {
        const { ts } = JSON.parse(raw);
        label = `${key}: ${new Date(ts).toLocaleString()}`;
      } catch { /* invalid JSON, leave as "Not cached" */ }
    }

    // 2. Number of items in the global variable named by `key`
    let loadedCount = 0;
    try {
      const data = eval(key);
      if (Array.isArray(data)) {
        loadedCount = data.length;
      } else if (data && typeof data === 'object') {
        loadedCount = Object.keys(data).length;
      }
    } catch {
      // variable not defined or other error: count stays 0
    }
    label += ` (${loadedCount} items loaded)`;

    // 3. Build UI
    const span = document.createElement('span');
    span.textContent = label;

    const btnFetch = document.createElement('button');
    btnFetch.textContent = 'Fetch';
    btnFetch.addEventListener('click', async () => {
      await forcefetchapi(key);
      loadcachemini();
    });


    const btnClear = document.createElement('button');
    btnClear.textContent = 'Clear';
    btnClear.addEventListener('click', () => {
      clearcachefor(key);
    });

    li.append(span, btnFetch, btnClear);
    list.append(li);
  });

  container.append(list);
}

function loadhistorymini() {
  const container = document.getElementById('historyminiwindow');
  container.textContent = '';

  if (!Array.isArray(rollhistory) || rollhistory.length === 0) {
    container.textContent = 'No rolls yet';
    return;
  }

  // show most recent 20 rolls in reverse order
  rollhistory
    .slice(-20)
    .reverse()
    .forEach(hit => {
      const details = document.createElement('details');

      // choose display label: use hit.spell when type is 'spell'
      const label = hit.type === 'spell' ? hit.spell : hit.type;
      const time = new Date(hit.timestamp).toLocaleTimeString();

      const summary = document.createElement('summary');
      summary.textContent = hit.dice === 1
        ? `${label} (CRIT FAIL) — ${time}`
        : hit.dice === 10
          ? `${label} (CRIT SUCCEED ${hit.total}) — ${time}`
          : `${label} (${hit.total}) — ${time}`;

      details.appendChild(summary);

      // show the full roll object when expanded
      const content = document.createElement('pre');
      content.textContent = JSON.stringify(hit, null, 2);
      details.appendChild(content);

      container.appendChild(details);
    });
}

/** clear cache for one dataset */
function clearcachefor(key) {
  // 1) remove your localStorage copy
  localStorage.removeItem('cache_' + key);
  // 2) drop the in-memory copy
  window[key] = undefined;
  // 3) remove its entry from cache_meta
  if (Array.isArray(cache_meta)) {
    const idx = cache_meta.findIndex(e => e.dataset === key);
    if (idx > -1) cache_meta.splice(idx, 1);
  }
  // 4) mark it for a fresh network load next time
  if (forceloadfromnetwork.indexOf(key) === -1) {
    forceloadfromnetwork.push(key);
  }
  console.log(`cache cleared for ${key}`);
  // your mini‐loader (alias for init_cache or similar)
  loadcachemini();
}


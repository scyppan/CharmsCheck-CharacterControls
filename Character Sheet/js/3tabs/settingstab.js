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

function loadcachemini() {
  const container = document.getElementById('cacheminiwindow');
  container.textContent = '';

  const list = document.createElement('ul');
  list.id = 'settingsminiwindow';
  cacheDatasets.forEach(key => {
    const li = document.createElement('li');

    // timestamp or “Not cached”
    const raw = localStorage.getItem('cache_' + key);
    let label = key + ': Not cached';
    if (raw) {
      try {
        const { ts } = JSON.parse(raw);
        label = `${key}: ${new Date(ts).toLocaleString()}`;
      } catch { }
    }

    const span = document.createElement('span');
    span.textContent = label;

    const btnFetch = document.createElement('button');
    btnFetch.textContent = 'Fetch';
    btnFetch.addEventListener('click', async () => {
      await fetchcachefor(key);
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

/**
 * Renders the most recent 20 rolls into the history mini‐window,
 * using hit.spell when hit.type === 'spell'.
 */
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
  localStorage.removeItem('cache_' + key);
  window[key] = undefined;
  if (Array.isArray(cache_meta)) {
    const idx = cache_meta.findIndex(e => e.dataset === key);
    if (idx > -1) cache_meta.splice(idx, 1);
  }
  console.log(`cache cleared for ${key}`);
  loadcachemini();
}

/** fetch/re-cache one dataset */
async function fetchcachefor(key) {
  const fn = window['get' + key];
  if (typeof fn !== 'function') return console.error(`No get${key}()`);
  await fn(false);
  try {
    localStorage.setItem(
      'cache_' + key,
      JSON.stringify({ ts: Date.now(), data: window[key] })
    );
    if (Array.isArray(cache_meta)) {
      const old = cache_meta.findIndex(e => e.dataset === key);
      if (old > -1) cache_meta.splice(old, 1);
      cache_meta.push({ dataset: key, lastcache: new Date() });
    }
    console.log(`${key} fetched`);
  } catch (e) {
    console.warn(`Failed saving cache for ${key}`, e);
  }
}

//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------
var idb_cache_dbname = 'charmscheck_cache';
var idb_cache_store = 'datasets';
var idb_cache_version = 1;
var idb_db = null;

//---------
//ENTRY FUNCTION
//---------
async function initializedbcache() {
  open_idb();
  // wait briefly for open to resolve (non-blocking fallback if it can’t)
  for (var i = 0; i < 10 && !idb_db; i++) await new Promise(r => setTimeout(r, 20));
}

//---------
//MAJOR FUNCTIONS
//---------
function getcacheentry(cachekey) {
  var k = normalize_key(cachekey);
  var full = 'cache_' + k;

  return ensure_idb().then(function () {
    return idb_get(full).then(function (record) {
      if (!record) {
        var legacy = read_legacy_localstorage(full);
        if (!legacy) return null;
        idb_put(full, legacy.ts, legacy.data).catch(function(){});
        touch_datasetinfo_on_hit(k, legacy.ts);
        return legacy; // { ts, data }
      }

      var ttl = typeof cache_ttl === 'number' ? cache_ttl : 0;
      if (ttl && Date.now() - record.ts > ttl) {
        clearcache(k);
        return null;
      }

      touch_datasetinfo_on_hit(k, record.ts);
      return { ts: record.ts, data: record.data };
    });
  });
}

function setcacheentry(cachekey, data) {
  var k = normalize_key(cachekey);
  var full = 'cache_' + k;
  var ts = Date.now();

  return ensure_idb().then(function () {
    return idb_put(full, ts, data).then(function () {
      write_manifest_ts(k, ts);
      write_shadow_ts(full, ts);
      if (datasetinfo && datasetinfo[k]) datasetinfo[k].lastcache = ts;
      return true;
    });
  }).catch(function () {
    try {
      localStorage.setItem(full, JSON.stringify({ ts: ts, data: data }));
      write_manifest_ts(k, ts);
      if (datasetinfo && datasetinfo[k]) datasetinfo[k].lastcache = ts;
      return true;
    } catch (e) {
      return false;
    }
  });
}

function clearcache(cachekey) {
  var k = normalize_key(cachekey);
  var full = 'cache_' + k;

  ensure_idb().then(function(){ idb_del(full); }).catch(function(){});
  try { localStorage.removeItem(full); } catch(e) {}
  try { localStorage.removeItem(k); } catch(e) {}

  if (datasetinfo && datasetinfo[k]) datasetinfo[k].lastcache = null;
}

//---------
//HELPER FUNCTIONS
//---------
function normalize_key(s) {
  if (!s) return '';
  return String(s).replace(/^cache_/, '');
}

function touch_datasetinfo_on_hit(k, ts) {
  if (!datasetinfo || !datasetinfo[k]) return;
  datasetinfo[k].lastassigned = Date.now();
  datasetinfo[k].assignedfrom = 'cache';
  datasetinfo[k].lastcache = ts;
}

function write_manifest_ts(k, ts) {
  try {
    var raw = localStorage.getItem('charms_manifest');
    var man = raw ? JSON.parse(raw) : {};
    man[k] = man[k] || {};
    man[k].ts = ts;
    localStorage.setItem('charms_manifest', JSON.stringify(man));
  } catch (e) {}
}

function write_shadow_ts(full, ts) {
  try { localStorage.setItem(full + '_ts', String(ts)); } catch (e) {}
}

function read_legacy_localstorage(full) {
  try {
    var raw = localStorage.getItem(full);
    if (!raw) return null;
    var parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.ts !== 'number') return null;
    return { ts: parsed.ts, data: parsed.data };
  } catch (e) {
    return null;
  }
}

// idb open
function open_idb() {
  try {
    var req = indexedDB.open(idb_cache_dbname, idb_cache_version);
    req.onupgradeneeded = function (ev) {
      var db = ev.target.result;
      if (!db.objectStoreNames.contains(idb_cache_store)) {
        db.createObjectStore(idb_cache_store, { keyPath: 'key' });
      }
    };
    req.onsuccess = function (ev) { idb_db = ev.target.result; };
    req.onerror = function () { idb_db = null; };
  } catch (e) { idb_db = null; }
}

function ensure_idb() {
  return new Promise(function (resolve) {
    if (idb_db) return resolve(idb_db);
    var tries = 0;
    var t = setInterval(function () {
      tries++;
      if (idb_db || tries > 10) {
        clearInterval(t);
        resolve(idb_db);
      }
    }, 20);
  });
}

function idb_get(key) {
  if (!idb_db) return Promise.resolve(null);
  return new Promise(function (resolve) {
    try {
      var tx = idb_db.transaction(idb_cache_store, 'readonly');
      var st = tx.objectStore(idb_cache_store);
      var req = st.get(key);
      req.onsuccess = function () {
        var r = req.result;
        if (!r) return resolve(null);
        resolve({ ts: r.ts, data: r.data });
      };
      req.onerror = function () { resolve(null); };
    } catch (e) { resolve(null); }
  });
}

function idb_put(key, ts, data) {
  if (!idb_db) return Promise.reject();
  return new Promise(function (resolve, reject) {
    try {
      var tx = idb_db.transaction(idb_cache_store, 'readwrite');
      var st = tx.objectStore(idb_cache_store);
      var req = st.put({ key: key, ts: ts, data: data });
      req.onsuccess = function () { resolve(true); };
      req.onerror = function () { reject(); };
    } catch (e) { reject(); }
  });
}

function idb_del(key) {
  if (!idb_db) return;
  try {
    var tx = idb_db.transaction(idb_cache_store, 'readwrite');
    var st = tx.objectStore(idb_cache_store);
    st.delete(key);
  } catch (e) {}
}

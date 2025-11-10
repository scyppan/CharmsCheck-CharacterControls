/*
//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------
// safe fallbacks so getDataset() never throws if globals aren't defined yet
*/
var datadate = (typeof window !== 'undefined' && typeof window.datadate === 'number')
  ? window.datadate
  : (typeof window !== 'undefined' && typeof window.datadate === 'string'
      ? Date.parse(window.datadate.replace(' ', 'T') + 'Z')
      : 0);

var cache_ttl = (typeof window !== 'undefined' && typeof window.cache_ttl === 'number')
  ? window.cache_ttl
  : 7 * 24 * 60 * 60 * 1000; // 7d default

const datasetinfo = {
  characters:      { formId: 972,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  traits:          { formId: 979,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  accessories:     { formId: 995,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  wands:           { formId: 114,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  wandwoods:       { formId: 120,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  wandcores:       { formId: 116,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  wandqualities:   { formId: 124,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  spells:          { formId: 191,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  books:           { formId:   8,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  schools:         { formId:   3,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  proficiencies:   { formId: 944,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  potions:         { formId:  34,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  namedcreatures:  { formId: 170,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  items:           { formId: 964,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  itemsinhand:     { formId:1085,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  generalitems:    { formId: 126,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  creatures:       { formId:  48,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  creatureparts:   { formId:  53,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  plants:          { formId:   2,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  plantparts:      { formId:  43,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  preparations:    { formId: 908,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
  fooddrink:       { formId:  67,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null },
};

/*
//---------
//MAJOR FUNCTIONS
//---------
*/
var inflight_fetches = {};

async function getDataset(key) {
  if (!datasetinfo[key]) throw new Error('unknown dataset key: ' + key);

  if (!datasetinfo[key].lastassigned) {
    // Fast path: return cached immediately if present; refresh in background
    const cached0 = await getCacheEntry('cache_' + key) || await getCacheEntry(key);
    if (cached0 && cached0.data) {
      datasetinfo[key].lastassigned = Date.now();
      datasetinfo[key].assignedfrom = 'cache';
      datasetinfo[key].lastcache    = cached0.ts;
      refresh_if_stale(key, cached0.ts).catch(function(){});
      return cached0.data;
    }

    // No cache — check DB freshness, then fetch or fall back
    const formid = datasetinfo[key].formId;
    const dbstr  = await checkdblastupdated(formid).catch(function(){ return null; });
    const dbms   = dbstr ? parse_wp_ts(dbstr) : 0;
    const cachems= datasetinfo[key].lastcache || 0;

    if (dbms > datadate && dbms > cachems) {
      const data = await fetchfresh_once(key, formid);
      const now  = Date.now();
      datasetinfo[key].lastcache    = now;
      datasetinfo[key].lastassigned = now;
      datasetinfo[key].assignedfrom = 'db';
      return data;
    }

    if (cachems > 0) {
      const cached = await getCacheEntry('cache_' + key) || await getCacheEntry(key);
      datasetinfo[key].lastassigned = Date.now();
      datasetinfo[key].assignedfrom = cached ? 'cache' : 'hardcode';
      return cached ? cached.data : null;
    }

    datasetinfo[key].lastassigned = Date.now();
    datasetinfo[key].assignedfrom = 'hardcode';
    return null;
  }
}

async function refresh_if_stale(key, knowncachets) {
  try {
    const formid = datasetinfo[key].formId;
    const dbstr  = await checkdblastupdated(formid);
    const dbms   = parse_wp_ts(dbstr);
    if (!knowncachets || dbms > knowncachets) {
      const data = await fetchfresh_once(key, formid);
      datasetinfo[key].lastcache = Date.now();
      return data;
    }
  } catch(e) {}
  return null;
}

async function fetchfresh_once(key, formid) {
  if (inflight_fetches[key]) return inflight_fetches[key];
  inflight_fetches[key] = (async function() {
    const data = await fetchfresh(formid);
    await setCacheEntry('cache_' + key, data);
    return data;
  })();
  try {
    const result = await inflight_fetches[key];
    return result;
  } finally {
    delete inflight_fetches[key];
  }
}

const parse_wp_ts = ts => Date.parse(ts.replace(' ', 'T') + 'Z');

async function compare_hardcode_dblastupdate(formid) {
  const dbstr = await checkdblastupdated(formid);
  const dbms  = parse_wp_ts(dbstr);
  if (dbms > datadate) return 'db';
  if (dbms < datadate) return 'hardcode';
  return 'identical';
}

async function compare_cache_dblastupdate(formid) {
  const key = Object.keys(datasetinfo).find(k => datasetinfo[k].formId === formid);
  if (!key) throw new Error('unknown formid: ' + formid);

  const dblast = datasetinfo[key].dblastupdated || await checkdblastupdated(formid);
  const dbms   = parse_wp_ts(dblast);
  const cachems= datasetinfo[key].lastcache || 0;

  if (!cachems) return 'nocache';
  if (cachems > dbms) return 'cache';
  if (cachems < dbms) return 'db';
  return 'identical';
}

/*
//---------
//HELPER FUNCTIONS
//---------
// Cache helpers (localStorage version kept for drop-in; uses 'cache_' prefix)
*/
function getCacheEntry(cachekey) {
  try {
    const raw = localStorage.getItem(cachekey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.ts !== 'number') {
      localStorage.removeItem(cachekey);
      return null;
    }
    if (cache_ttl && Date.now() - parsed.ts >= cache_ttl) {
      localStorage.removeItem(cachekey);
      return null;
    }
    const key = cachekey.replace(/^cache_/, '');
    if (datasetinfo[key]) {
      datasetinfo[key].lastassigned = Date.now();
      datasetinfo[key].assignedfrom = 'cache';
      datasetinfo[key].lastcache    = parsed.ts;
    }
    return { ts: parsed.ts, data: parsed.data };
  } catch (e) {
    try { localStorage.removeItem(cachekey); } catch(_) {}
    return null;
  }
}

function setCacheEntry(key, data) {
  try {
    const ts = Date.now();
    const storagekey = key.startsWith('cache_') ? key : ('cache_' + key);
    localStorage.setItem(storagekey, JSON.stringify({ ts, data }));
    const name = storagekey.replace(/^cache_/, '');
    if (datasetinfo[name]) datasetinfo[name].lastcache = ts;
    return true;
  } catch (e) {
    return false;
  }
}

function clearcache(key) {
  const k1 = 'cache_' + key;
  try { localStorage.removeItem(k1); } catch(_) {}
  try { localStorage.removeItem(key); } catch(_) {} // legacy
  if (datasetinfo[key]) datasetinfo[key].lastcache = null;
}

/*
//---------
//NETWORK FUNCTIONS
//---------
*/
async function fetchformdata(formid, bust) {
  const params = new URLSearchParams({ action: 'get_form_data', form: formid });
  if (bust) params.append('bust', '1');
  const url = '/wp-admin/admin-ajax.php?' + params.toString();
  const res = await fetch_with_timeout(url, { credentials: 'same-origin' }, 15000);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

async function fetchfresh(formid) {
  return fetchformdata(formid, true);
}

async function checkdblastupdated(formid) {
  const url = '/wp-admin/admin-ajax.php?action=get_form_last_update&form=' + formid;
  const res = await fetch_with_timeout(url, {}, 8000);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const j = await res.json();

  const key = Object.keys(datasetinfo).find(function(k){ return datasetinfo[k].formId === formid; });
  if (key) {
    datasetinfo[key].lastdbcheck   = Date.now();
    datasetinfo[key].dblastupdated = j.last_updated;
  }
  return j.last_updated;
}

function fetch_with_timeout(url, options, ms) {
  let controller = null;
  if (typeof AbortController !== 'undefined') {
    controller = new AbortController();
    options = Object.assign({}, options || {}, { signal: controller.signal });
  }
  let timer = null;
  return new Promise(function(resolve, reject) {
    timer = setTimeout(function(){
      if (controller) { try { controller.abort(); } catch(e){} }
      reject(new Error('timeout'));
    }, ms || 15000);

    fetch(url, options).then(function(res){
      clearTimeout(timer);
      resolve(res);
    }).catch(function(err){
      clearTimeout(timer);
      reject(err);
    });
  });
}

/*
//---------
//PUBLIC GETTERS
//---------
*/
const getcharacters     = async () => { const d = await getDataset('characters');     return d == null ? characters     : (characters     = d) };
const gettraits         = async () => { const d = await getDataset('traits');         return d == null ? traits         : (traits         = d) };
const getaccessories    = async () => { const d = await getDataset('accessories');    return d == null ? accessories    : (accessories    = d) };
const getwands          = async () => { const d = await getDataset('wands');          return d == null ? wands          : (wands          = d) };
const getwandwoods      = async () => { const d = await getDataset('wandwoods');      return d == null ? wandwoods      : (wandwoods      = d) };
const getwandcores      = async () => { const d = await getDataset('wandcores');      return d == null ? wandcores      : (wandcores      = d) };
const getwandqualities  = async () => { const d = await getDataset('wandqualities');  return d == null ? wandqualities  : (wandqualities  = d) };
const getspells         = async () => { const d = await getDataset('spells');         return d == null ? spells         : (spells         = d) };
const getbooks          = async () => { const d = await getDataset('books');          return d == null ? books          : (books          = d) };
const getschools        = async () => { const d = await getDataset('schools');        return d == null ? schools        : (schools        = d) };
const getproficiencies  = async () => { const d = await getDataset('proficiencies');  return d == null ? proficiencies  : (proficiencies  = d) };
const getpotions        = async () => { const d = await getDataset('potions');        return d == null ? potions        : (potions        = d) };
const getnamedcreatures = async () => { const d = await getDataset('namedcreatures'); return d == null ? namedcreatures : (namedcreatures = d) };
const getitems          = async () => { const d = await getDataset('items');          return d == null ? items          : (items          = d) };
const getitemsinhand    = async () => { const d = await getDataset('itemsinhand');    return d == null ? itemsinhand    : (itemsinhand    = d) };
const getgeneralitems   = async () => { const d = await getDataset('generalitems');   return d == null ? generalitems   : (generalitems   = d) };
const getcreatures      = async () => { const d = await getDataset('creatures');      return d == null ? creatures      : (creatures      = d) };
const getcreatureparts  = async () => { const d = await getDataset('creatureparts');  return d == null ? creatureparts  : (creatureparts  = d) };
const getplants         = async () => { const d = await getDataset('plants');         return d == null ? plants         : (plants         = d) };
const getplantparts     = async () => { const d = await getDataset('plantparts');     return d == null ? plantparts     : (plantparts     = d) };
const getpreparations   = async () => { const d = await getDataset('preparations');   return d == null ? preparations   : (preparations   = d) };
const getfooddrink      = async () => { const d = await getDataset('fooddrink');      return d == null ? fooddrink      : (fooddrink      = d) };

//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

// dataset registry and metadata
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
  fooddrink:       { formId:  67,  lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null, lastidleloadercheck: null }
};

// safe fallbacks (use existing globals if present)
var datadate = (typeof datadate === 'number') ? datadate
  : (typeof window !== 'undefined' && typeof window.datadate === 'number') ? window.datadate
  : 0;

var cache_ttl = (typeof cache_ttl === 'number') ? cache_ttl
  : (typeof window !== 'undefined' && typeof window.cache_ttl === 'number') ? window.cache_ttl
  : 7 * 24 * 60 * 60 * 1000; // 7d

//---------
//ENTRY FUNCTION
//---------

function initapicall(){
  // reserved for future warmups/diagnostics
}

//---------
//MAJOR FUNCTIONS
//---------

async function getdataset(key) {
  if (!datasetinfo[key]) throw new Error('unknown dataset key: ' + key);

  // already assigned this session → use current/baked/global
  if (datasetinfo[key].lastassigned) {
    return null;
  }

  const formid  = datasetinfo[key].formId;
  const cachems = datasetinfo[key].lastcache || 0;

  // fetch DB last-updated
  const dbstr = await checkdblastupdated(formid); // 'YYYY-MM-DD hh:mm:ss'
  datasetinfo[key].lastdbcheck   = Date.now();
  datasetinfo[key].dblastupdated = dbstr;
  const dbms = parsewpts(dbstr);

  // 1) DB newer than baked + cache → refetch
  if (dbms > datadate && dbms > cachems) {
    const data = await fetchfresh(formid);
    setcacheentry(key, data);
    datasetinfo[key].lastcache    = Date.now();
    datasetinfo[key].lastassigned = Date.now();
    datasetinfo[key].assignedfrom = 'db';
    return data;
  }

  // 2) Cache newer than baked → use cache
  const cached = getcacheentry(key); // raw data or null
  if (cached != null && (datasetinfo[key].lastcache || 0) > datadate) {
    datasetinfo[key].lastassigned = Date.now();
    datasetinfo[key].assignedfrom = 'cache';
    return cached;
  }

  // 3) Fall back to baked-in default
  datasetinfo[key].lastassigned = Date.now();
  datasetinfo[key].assignedfrom = 'hardcode';
  return null;
}

async function compare_hardcode_dblastupdate(formid) {
  const dbstr = await checkdblastupdated(formid);
  const dbms = parsewpts(dbstr);
  if (dbms > datadate) return 'db';
  if (dbms < datadate) return 'hardcode';
  return 'identical';
}

async function compare_cache_dblastupdate(formid) {
  const key = Object.keys(datasetinfo).find(function(k){ return datasetinfo[k].formId === formid; });
  if (!key) throw new Error('unknown formid: ' + formid);

  const dbms = parsewpts(datasetinfo[key].dblastupdated || await checkdblastupdated(formid));
  const cachems = datasetinfo[key].lastcache || 0;

  if (!cachems) return 'nocache';
  if (cachems > dbms) return 'cache';
  if (cachems < dbms) return 'db';
  return 'identical';
}

async function fetchformdata(formid, bust) {
  const params = new URLSearchParams({ action: 'get_form_data', form: String(formid) });
  if (bust) params.append('bust', '1');
  const res = await fetch('/wp-admin/admin-ajax.php?' + params.toString(), { credentials: 'same-origin' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

async function fetchfresh(formid) {
  return fetchformdata(formid, true);
}

async function checkdblastupdated(formid) {
  const key = Object.keys(datasetinfo).find(function(k){ return datasetinfo[k].formId === formid; });
  if (!key) throw new Error('unknown formid: ' + formid);

  const res = await fetch('/wp-admin/admin-ajax.php?action=get_form_last_update&form=' + String(formid));
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const payload = await res.json();
  const last_updated = payload && payload.last_updated ? payload.last_updated : null;
  if (!last_updated) throw new Error('missing last_updated for form ' + formid);

  datasetinfo[key].lastdbcheck   = Date.now();
  datasetinfo[key].dblastupdated = last_updated;
  return last_updated; // 'YYYY-MM-DD hh:mm:ss'
}

// dataset getters exposed as global functions so idleloader can call window['get' + key]()
function getcharacters(){ return getdataset('characters').then(function(d){ return d == null ? characters : (characters = d); }); }
function gettraits(){ return getdataset('traits').then(function(d){ return d == null ? traits : (traits = d); }); }
function getaccessories(){ return getdataset('accessories').then(function(d){ return d == null ? accessories : (accessories = d); }); }
function getwands(){ return getdataset('wands').then(function(d){ return d == null ? wands : (wands = d); }); }
function getwandwoods(){ return getdataset('wandwoods').then(function(d){ return d == null ? wandwoods : (wandwoods = d); }); }
function getwandcores(){ return getdataset('wandcores').then(function(d){ return d == null ? wandcores : (wandcores = d); }); }
function getwandqualities(){ return getdataset('wandqualities').then(function(d){ return d == null ? wandqualities : (wandqualities = d); }); }
function getspells(){ return getdataset('spells').then(function(d){ return d == null ? spells : (spells = d); }); }
function getbooks(){ return getdataset('books').then(function(d){ return d == null ? books : (books = d); }); }
function getschools(){ return getdataset('schools').then(function(d){ return d == null ? schools : (schools = d); }); }
function getproficiencies(){ return getdataset('proficiencies').then(function(d){ return d == null ? proficiencies : (proficiencies = d); }); }
function getpotions(){ return getdataset('potions').then(function(d){ return d == null ? potions : (potions = d); }); }
function getnamedcreatures(){ return getdataset('namedcreatures').then(function(d){ return d == null ? namedcreatures : (namedcreatures = d); }); }
function getitems(){ return getdataset('items').then(function(d){ return d == null ? items : (items = d); }); }
function getitemsinhand(){ return getdataset('itemsinhand').then(function(d){ return d == null ? itemsinhand : (itemsinhand = d); }); }
function getgeneralitems(){ return getdataset('generalitems').then(function(d){ return d == null ? generalitems : (generalitems = d); }); }
function getcreatures(){ return getdataset('creatures').then(function(d){ return d == null ? creatures : (creatures = d); }); }
function getcreatureparts(){ return getdataset('creatureparts').then(function(d){ return d == null ? creatureparts : (creatureparts = d); }); }
function getplants(){ return getdataset('plants').then(function(d){ return d == null ? plants : (plants = d); }); }
function getplantparts(){ return getdataset('plantparts').then(function(d){ return d == null ? plantparts : (plantparts = d); }); }
function getpreparations(){ return getdataset('preparations').then(function(d){ return d == null ? preparations : (preparations = d); }); }
function getfooddrink(){ return getdataset('fooddrink').then(function(d){ return d == null ? fooddrink : (fooddrink = d); }); }

//---------
//HELPER FUNCTIONS
//---------

function parsewpts(ts){
  // expects 'YYYY-MM-DD hh:mm:ss' from WP
  return Date.parse(String(ts).replace(' ', 'T') + 'Z');
}

function cachekey(name){ return 'cache_' + name; }
function legacycachekey(name){ return name; } // backward compatibility

function getcacheentry(key) {
  try {
    // prefer new key; fall back to legacy key
    var raw = localStorage.getItem(cachekey(key));
    if (!raw) raw = localStorage.getItem(legacycachekey(key));
    if (!raw) return null;

    var obj = JSON.parse(raw); // { ts, data }
    if (!obj || typeof obj.ts !== 'number') {
      localStorage.removeItem(cachekey(key));
      localStorage.removeItem(legacycachekey(key));
      return null;
    }
    if (Date.now() - obj.ts < cache_ttl) {
      datasetinfo[key].lastcache = obj.ts;
      return obj.data; // return raw data
    }
    localStorage.removeItem(cachekey(key));
    localStorage.removeItem(legacycachekey(key));
  } catch(e) {
    localStorage.removeItem(cachekey(key));
    localStorage.removeItem(legacycachekey(key));
  }
  return null;
}

function setcacheentry(key, data) {
  try {
    var ts = Date.now();
    localStorage.setItem(cachekey(key), JSON.stringify({ ts: ts, data: data }));
    datasetinfo[key].lastcache = ts;
  } catch(e) { }
}

function clearcache(key) {
  try {
    localStorage.removeItem(cachekey(key));
    localStorage.removeItem(legacycachekey(key));
  } finally {
    if (datasetinfo[key]) datasetinfo[key].lastcache = null;
  }
}

//---------
//IMMEDIATE FUNCTIONS
//---------

// none

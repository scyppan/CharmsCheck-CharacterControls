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

async function getDataset(key) {
    
    //in order to "fetch fresh forcibly from the settings page"
    //we just need to unassign lastassigned

    if (!datasetinfo[key].lastassigned) {

        const formId = datasetinfo[key].formId; 
        //console.log(datasetinfo[key], key);
        const cachems = datasetinfo[key].lastcache || 0;

        // fetch and parse WP’s last‐update
        const dbstr = await checkdblastupdated(formId);
        datasetinfo[key].lastdbcheck = Date.now();
        datasetinfo[key].dblastupdated = parse_wp_ts(dbstr);
        const dbms = parse_wp_ts(dbstr);

        // 1) DB is freshest → refetch
        if (dbms > datadate && dbms > cachems) {
            const data = await fetchfresh(formId);
            setCacheEntry(key, data);
            datasetinfo[key].lastcache = Date.now();
            datasetinfo[key].lastassigned = Date.now();
            datasetinfo[key].assignedfrom = "db";
            return data;
        }

        // 2) Cache is fresher than hardcode → use cache
        if (cachems > datadate) {
            datasetinfo[key].lastassigned = Date.now();
            datasetinfo[key].assignedfrom = "cache";
            return getCacheEntry(key);
        }

        // 3) Otherwise → fall back to baked‐in default
        datasetinfo[key].lastassigned = Date.now();
        datasetinfo[key].assignedfrom = "hardcode";
        return null;
    }
}

const parse_wp_ts = ts => Date.parse(ts.replace(' ', 'T') + 'Z');

async function compare_hardcode_dblastupdate(formid) {
    const dbstr = await checkdblastupdated(formid);        // e.g. '2025-05-24 01:23:47'
    const dbms = parse_wp_ts(dbstr);

    if (dbms > datadate) return 'db';
    if (dbms < datadate) return 'hardcode';
    return 'identical';
}

async function compare_cache_dblastupdate(formid) {
    const key = Object.keys(datasetinfo).find(k => datasetinfo[k].formId === formid);
    if (!key) throw new Error(`unknown formid: ${formid}`);

    const dbms = parse_wp_ts(datasetinfo[key].dblastupdated ?? await checkdblastupdated(formid));
    const cachems = datasetinfo[key].lastcache ?? 0;

    if (!cachems) return 'nocache';
    if (cachems > dbms) return 'cache';
    if (cachems < dbms) return 'db';
    return 'identical';
}

function getCacheEntry(name) {
  try {
    const canonical = storageKeyFor(name);
    // read canonical; fall back to legacy plain key for backward compatibility
    let raw = localStorage.getItem(canonical);
    if (!raw) raw = localStorage.getItem(name);
    if (!raw) return null;

    const obj = JSON.parse(raw);
    const ts = obj && obj.ts;
    const data = obj && obj.data;

    if (typeof ts !== 'number') {
      localStorage.removeItem(canonical);
      localStorage.removeItem(name);
      return null;
    }

    if (Date.now() - ts < cache_ttl) {
      if (datasetinfo[name]) {
        datasetinfo[name].lastassigned = Date.now();
        datasetinfo[name].assignedfrom = 'cache';
        datasetinfo[name].lastcache = ts;
      }
      // migrate legacy entry into canonical key
      if (!localStorage.getItem(canonical)) {
        localStorage.setItem(canonical, JSON.stringify({ ts: ts, data: data }));
      }
      return { ts: ts, data: data };
    }

    // expired → clear both keys
    localStorage.removeItem(canonical);
    localStorage.removeItem(name);
  } catch(e) {
    localStorage.removeItem(storageKeyFor(name));
    localStorage.removeItem(name);
  }
  return null;
}

function setCacheEntry(name, data) {
  try {
    const ts = Date.now();
    localStorage.setItem(storageKeyFor(name), JSON.stringify({ ts: ts, data: data }));
    if (datasetinfo[name]) datasetinfo[name].lastcache = ts;
  } catch(e) { }
}

function clearcache(name) {
  try {
    localStorage.removeItem(storageKeyFor(name));
    // also remove legacy plain key to avoid ghosts
    localStorage.removeItem(name);
  } finally {
    if (datasetinfo[name]) datasetinfo[name].lastcache = null;
  }
}

async function fetchformdata(formId, bust = true) {
    const params = new URLSearchParams({ action: 'get_form_data', form: formId });
    if (bust) params.append('bust', '1');
    const res = await fetch(`/wp-admin/admin-ajax.php?${params}`, {
        credentials: 'same-origin'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

async function fetchfresh(formid) {
    const findata = await fetchformdata(formid, true);
    return findata;
}

async function checkdblastupdated(formid) {
    //console.log("formid=" + formid);
    const key = Object.keys(datasetinfo).find(k => datasetinfo[k].formId === formid);
    if (!key) throw new Error(`Unknown formid: ${formid}`);

    const res = await fetch(
        `/wp-admin/admin-ajax.php?action=get_form_last_update&form=${formid}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { last_updated } = await res.json();

    datasetinfo[key].lastdbcheck = Date.now();
    datasetinfo[key].dblastupdated = last_updated;

    //console.log(key + ' ' + formid + ' dblast updated: ' + last_updated);
    return last_updated;
}

function storageKeyFor(name){ return 'cache_' + name; }

var getcharacters = async function(){
  const formid = datasetinfo.characters.formId;
  const data = await fetchfresh(formid);        // always hit DB
  setCacheEntry('characters', data);            // keep cache in sync
  const now = Date.now();
  datasetinfo.characters.lastcache    = now;
  datasetinfo.characters.lastassigned = now;
  datasetinfo.characters.assignedfrom = 'db';
  return (characters = data);                   // replace baked/global with fresh
};

var  gettraits = async () => { const d = await getDataset('traits'); return d == null ? traits : (traits = d) };
var getaccessories = async () => { const d = await getDataset('accessories'); return d == null ? accessories : (accessories = d) };
var getwands = async () => { const d = await getDataset('wands'); return d == null ? wands : (wands = d) };
var getwandwoods = async () => { const d = await getDataset('wandwoods'); return d == null ? wandwoods : (wandwoods = d) };
var getwandcores = async () => { const d = await getDataset('wandcores'); return d == null ? wandcores : (wandcores = d) };
var getwandqualities = async () => { const d = await getDataset('wandqualities'); return d == null ? wandqualities : (wandqualities = d) };
var getspells = async () => { const d = await getDataset('spells'); return d == null ? spells : (spells = d) };
var getbooks = async () => { const d = await getDataset('books'); return d == null ? books : (books = d) };
var getschools = async () => { const d = await getDataset('schools'); return d == null ? schools : (schools = d) };
var getproficiencies = async () => { const d = await getDataset('proficiencies'); return d == null ? proficiencies : (proficiencies = d) };
var getpotions = async () => { const d = await getDataset('potions'); return d == null ? potions : (potions = d) };
var getnamedcreatures = async () => { const d = await getDataset('namedcreatures'); return d == null ? namedcreatures : (namedcreatures = d) };
var getitems = async () => { const d = await getDataset('items'); return d == null ? items : (items = d) };
var getitemsinhand = async () => { const d = await getDataset('itemsinhand'); return d == null ? itemsinhand : (itemsinhand = d) };
var getgeneralitems = async () => { const d = await getDataset('generalitems'); return d == null ? generalitems : (generalitems = d) };
var getcreatures = async () => { const d = await getDataset('creatures'); return d == null ? creatures : (creatures = d) };
var getcreatureparts = async () => { const d = await getDataset('creatureparts'); return d == null ? creatureparts : (creatureparts = d) };
var getplants = async () => { const d = await getDataset('plants'); return d == null ? plants : (plants = d) };
var getplantparts = async () => { const d = await getDataset('plantparts'); return d == null ? plantparts : (plantparts = d) };
var getpreparations = async () => { const d = await getDataset('preparations'); return d == null ? preparations : (preparations = d) };
var getfooddrink = async () => { const d = await getDataset('fooddrink'); return d == null ? fooddrink : (fooddrink = d) };

// await fetchfresh(8);
// await checkdblastupdated(8);

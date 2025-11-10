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
  if (!datasetinfo[key].lastassigned) {

    const formId  = datasetinfo[key].formId;
    const cachems = datasetinfo[key].lastcache || 0;

    const dbstr = await checkdblastupdated(formId);
    datasetinfo[key].lastdbcheck   = Date.now();
    datasetinfo[key].dblastupdated = dbstr;
    const dbms = parse_wp_ts(dbstr);

    if (dbms > datadate && dbms > cachems) {
      const data = await fetchfresh(formId);
      await setCacheEntry('cache_' + key, data);
      const now = Date.now();
      datasetinfo[key].lastcache    = now;
      datasetinfo[key].lastassigned = now;
      datasetinfo[key].assignedfrom = 'db';
      return data;
    }

    if (cachems > datadate) {
      datasetinfo[key].lastassigned = Date.now();
      datasetinfo[key].assignedfrom = 'cache';
      const cached = await getCacheEntry('cache_' + key) || await getCacheEntry(key);
      return cached ? cached.data : null;
    }

    datasetinfo[key].lastassigned = Date.now();
    datasetinfo[key].assignedfrom = 'hardcode';
    return null;
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

function getCacheEntry(cacheKey) {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.ts !== 'number') {
      localStorage.removeItem(cacheKey);
      return null;
    }
    if (typeof cache_ttl === 'number' && cache_ttl > 0) {
      if (Date.now() - parsed.ts >= cache_ttl) {
        localStorage.removeItem(cacheKey);
        return null;
      }
    }
    const key = cacheKey.replace(/^cache_/, '');
    if (datasetinfo[key]) {
      datasetinfo[key].lastassigned = Date.now();
      datasetinfo[key].assignedfrom = 'cache';
      datasetinfo[key].lastcache    = parsed.ts;
    }
    return { ts: parsed.ts, data: parsed.data };
  } catch (e) {
    try { localStorage.removeItem(cacheKey); } catch(_) {}
    return null;
  }
}

function setCacheEntry(key, data) {
  try {
    const ts = Date.now();
    const storageKey = key.startsWith('cache_') ? key : ('cache_' + key);
    localStorage.setItem(storageKey, JSON.stringify({ ts, data }));
    const name = storageKey.replace(/^cache_/, '');
    if (datasetinfo[name]) datasetinfo[name].lastcache = ts;
    return true;
  } catch (e) {
    return false;
  }
}

function clearcache(key) {
  const k1 = 'cache_' + key;
  try { localStorage.removeItem(k1); } catch(_) {}
  try { localStorage.removeItem(key); } catch(_) {}
  if (datasetinfo[key]) datasetinfo[key].lastcache = null;
}

async function fetchformdata(formId, bust = true) {
  const params = new URLSearchParams({ action: 'get_form_data', form: formId });
  if (bust) params.append('bust', '1');
  const res = await fetch(`/wp-admin/admin-ajax.php?${params}`, { credentials: 'same-origin' });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

async function fetchfresh(formid) {
  return fetchformdata(formid, true);
}

async function checkdblastupdated(formid) {
  const key = Object.keys(datasetinfo).find(k => datasetinfo[k].formId === formid);
  if (!key) throw new Error('Unknown formid: ' + formid);

  const res = await fetch(`/wp-admin/admin-ajax.php?action=get_form_last_update&form=${formid}`);
  if (!res.ok) throw new Error('HTTP ' + res.status);
  const json = await res.json();
  const last_updated = json.last_updated;

  datasetinfo[key].lastdbcheck    = Date.now();
  datasetinfo[key].dblastupdated  = last_updated;

  return last_updated;
}

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

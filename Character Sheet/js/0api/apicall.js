const datasetinfo = {
    characters: { formId: 972, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    traits: { formId: 979, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    accessories: { formId: 995, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    wands: { formId: 114, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    wandwoods: { formId: 120, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    wandcores: { formId: 116, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    wandqualities: { formId: 124, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    spells: { formId: 191, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    books: { formId: 8, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    schools: { formId: 3, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    proficiencies: { formId: 944, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    potions: { formId: 34, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    namedcreatures: { formId: 170, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    items: { formId: 964, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    itemsinhand: { formId: 1085, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    generalitems: { formId: 126, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    creatures: { formId: 48, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    creatureparts: { formId: 53, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    plants: { formId: 2, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    plantparts: { formId: 43, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    preparations: { formId: 908, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
    fooddrink: { formId: 67, lastcache: null, lastdbcheck: null, dblastupdated: null, lastassigned: null, assignedfrom: null },
};

async function getDataset(key) {
  const formId = datasetinfo[key].formid;
  const cachems = datasetinfo[key].lastcache || 0;

  // fetch and parse WP’s last‐update
  const dbstr = await checkdblastupdated(formId);
  const dbms  = parse_wp_ts(dbstr);

  // 1) DB is freshest → refetch
  if (dbms > datadate && dbms > cachems) {
    const data = await fetchfresh(formId);
    setCacheEntry(key, data);
    datasetinfo[key].lastcache = Date.now();
    return data;
  }

  // 2) Cache is fresher than hardcode → use cache
  if (cachems > datadate) {
    return getCacheEntry(key);
  }

  // 3) Otherwise → fall back to baked‐in default
  return null;
}

const parse_wp_ts = ts => Date.parse(ts.replace(' ', 'T') + 'Z');

async function compare_hardcode_dblastupdate(formid) {
  const dbstr = await checkdblastupdated(formid);        // e.g. '2025-05-24 01:23:47'
  const dbms  = parse_wp_ts(dbstr);

  if (dbms > datadate) return 'db';
  if (dbms < datadate) return 'hardcode';
  return 'identical';
}

async function compare_cache_dblastupdate(formid) {
  const key = Object.keys(datasetinfo).find(k => datasetinfo[k].formId === formid);
  if (!key) throw new Error(`unknown formid: ${formid}`);

  const dbms    = parse_wp_ts(datasetinfo[key].dblastupdated ?? await checkdblastupdated(formid));
  const cachems = datasetinfo[key].lastcache ?? 0;

  if (!cachems)        return 'nocache';
  if (cachems > dbms)  return 'cache';
  if (cachems < dbms)  return 'db';
  return 'identical';
}

function getCacheEntry(cacheKey) {
    try {
        const raw = localStorage.getItem(cacheKey);
        if (!raw) return null;
        const { ts, data } = JSON.parse(raw);
        if (Date.now() - ts < cache_ttl) {
            // update datasetinfo
            const key = cacheKey.replace(/^cache_/, '');
            if (datasetinfo[key]) {
                datasetinfo[key].lastassigned = Date.now();
                datasetinfo[key].assignedfrom = 'cache';
                datasetinfo[key].lastcache = ts;
            }
            return { ts, data };
        }
        localStorage.removeItem(cacheKey);
    } catch (e) {
        localStorage.removeItem(cacheKey);
    }
    return null;
}

function setCacheEntry(key, data) {

    try {
        const ts = Date.now();
        localStorage.setItem(key, JSON.stringify({ ts, data }));
        const name = key.replace(/^cache_/, '');
        if (datasetinfo[name]) {
            datasetinfo[name].lastcache = ts;
        }
        console.log(key + "data cached");
    } catch (e) { }

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

async function checkdblastupdated(formid) {console.log("formid=" + formid);
  const key = Object.keys(datasetinfo).find(k => datasetinfo[k].formId === formid);
  if (!key) throw new Error(`Unknown formid: ${formid}`);

  const res = await fetch(
    `/wp-admin/admin-ajax.php?action=get_form_last_update&form=${formid}`
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { last_updated } = await res.json();

  datasetinfo[key].lastdbcheck = Date.now();
  datasetinfo[key].dblastupdated = last_updated;

  console.log(key + ' ' + formid + ' dblast updated: ' + last_updated);
  return last_updated;
}

const getcharacters       = async ()=>{const d=await getDataset('characters');       return d==null?characters:       (characters=d)};
const gettraits           = async ()=>{const d=await getDataset('traits');           return d==null?traits:           (traits=d)};
const getaccessories      = async ()=>{const d=await getDataset('accessories');      return d==null?accessories:      (accessories=d)};
const getwands            = async ()=>{const d=await getDataset('wands');            return d==null?wands:            (wands=d)};
const getwandwoods        = async ()=>{const d=await getDataset('wandwoods');        return d==null?wandwoods:        (wandwoods=d)};
const getwandcores        = async ()=>{const d=await getDataset('wandcores');        return d==null?wandcores:        (wandcores=d)};
const getwandqualities    = async ()=>{const d=await getDataset('wandqualities');    return d==null?wandqualities:    (wandqualities=d)};
const getspells           = async ()=>{const d=await getDataset('spells');           return d==null?spells:           (spells=d)};
const getbooks            = async ()=>{const d=await getDataset('books');            return d==null?books:            (books=d)};
const getschools          = async ()=>{const d=await getDataset('schools');          return d==null?schools:          (schools=d)};
const getproficiencies    = async ()=>{const d=await getDataset('proficiencies');    return d==null?proficiencies:    (proficiencies=d)};
const getpotions          = async ()=>{const d=await getDataset('potions');          return d==null?potions:          (potions=d)};
const getnamedcreatures   = async ()=>{const d=await getDataset('namedcreatures');   return d==null?namedcreatures:   (namedcreatures=d)};
const getitems            = async ()=>{const d=await getDataset('items');            return d==null?items:            (items=d)};
const getitemsinhand      = async ()=>{const d=await getDataset('itemsinhand');      return d==null?itemsinhand:      (itemsinhand=d)};
const getgeneralitems     = async ()=>{const d=await getDataset('generalitems');     return d==null?generalitems:     (generalitems=d)};
const getcreatures        = async ()=>{const d=await getDataset('creatures');        return d==null?creatures:        (creatures=d)};
const getcreatureparts    = async ()=>{const d=await getDataset('creatureparts');    return d==null?creatureparts:    (creatureparts=d)};
const getplants           = async ()=>{const d=await getDataset('plants');           return d==null?plants:           (plants=d)};
const getplantparts       = async ()=>{const d=await getDataset('plantparts');       return d==null?plantparts:       (plantparts=d)};
const getpreparations     = async ()=>{const d=await getDataset('preparations');     return d==null?preparations:     (preparations=d)};
const getfooddrink        = async ()=>{const d=await getDataset('fooddrink');        return d==null?fooddrink:        (fooddrink=d)};

// await fetchfresh(8);
// await checkdblastupdated(8);

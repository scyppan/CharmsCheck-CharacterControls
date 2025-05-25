/* ---------- network helpers ---------- */
async function fetchjson(url, skipHttpCache = false) {
  // 1) build cache-busting suffix if needed
  const bust = skipHttpCache
    ? (url.includes('?') ? `&_cb=${Date.now()}` : `?_cb=${Date.now()}`)
    : '';
  const fullUrl = url + bust;

  // 2) standalone fetch options
  const opts = {
    method: 'GET',
    redirect: 'follow',
    cache: skipHttpCache ? 'no-store' : 'default'
  };

  // 3) perform fetch
  const res = await fetch(fullUrl, opts);
  if (res.status === 200) {
    return res.json();
  }
  throw new Error(`HTTP ${res.status}`);
}

const fetchdata = (url, skipHttpCache = false) => fetchjson(url, skipHttpCache);

/* ---------- normaliser ---------- */
function toArray(raw) {
  return Array.isArray(raw) ? raw : Object.values(raw || {});
}

/* ---------- assign both globalThis & lexical ---------- */
function assign(name, arr) {
  globalThis[name] = arr;
  try { eval(`${name} = arr`); } catch {}
}

/* ---------- generic getter ---------- */
async function getDataset(name, url, checkCache = false, forceApi = false) {
  console.log(`[getDataset:${name}] fetching from API`);
  const rawJson = await fetchjson(url, true);

  if (rawJson && rawJson.error) {
    throw new Error(rawJson.error);
  }

  const arr = Array.isArray(rawJson) ? rawJson : Object.values(rawJson || {});
  assign(name, arr);

  if (!arr.length) {
    throw new Error(`no ${name} entries`);
  }

  return arr;
}

/* ---------- concrete getters ---------- */
const getcharacters     = (...a) => getDataset('characters',     'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=972',  ...a);
const gettraits         = (...a) => getDataset('traits',         'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=979',  ...a);
const getaccessories    = (...a) => getDataset('accessories',    'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=995',  ...a);
const getwands          = (...a) => getDataset('wands',          'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=114',  ...a);
const getwandwoods      = (...a) => getDataset('wandwoods',      'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=120',  ...a);
const getwandcores      = (...a) => getDataset('wandcores',      'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=116',  ...a);
const getwandqualities  = (...a) => getDataset('wandqualities',  'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=124',  ...a);
const getspells         = (...a) => getDataset('spells',         'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=191',  ...a);
const getbooks          = (...a) => getDataset('books',          'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=8',    ...a);
const getschools        = (...a) => getDataset('schools',        'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=3',    ...a);
const getproficiencies  = (...a) => getDataset('proficiencies',  'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=944',  ...a);
const getpotions        = (...a) => getDataset('potions',        'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=34',   ...a);
const getnamedcreatures = (...a) => getDataset('namedcreatures', 'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=170',  ...a);
const getitems          = (...a) => getDataset('items',          'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=964',  ...a);
const getitemsinhand    = (...a) => getDataset('itemsinhand',    'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=1085', ...a);
const getgeneralitems   = (...a) => getDataset('generalitems',   'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=126',  ...a);
const getcreatures      = (...a) => getDataset('creatures',      'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=48',   ...a);
const getcreatureparts  = (...a) => getDataset('creatureparts',  'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=53',   ...a);
const getplants         = (...a) => getDataset('plants',         'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=2',    ...a);
const getplantparts     = (...a) => getDataset('plantparts',     'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=43',   ...a);
const getpreparations   = (...a) => getDataset('preparations',   'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=908',  ...a);
const getfooddrink      = (...a) => getDataset('fooddrink',      'https://charmscheck.com/wp-admin/admin-ajax.php?action=get_form_data&form=67',   ...a);
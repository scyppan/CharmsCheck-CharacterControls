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
    console.log(key);
    //check when db was last updated
    const formId = datasetinfo[key].formid;
    const dblastupdated = await checkdblastupdated(formId);

    //check when data was last assigned
    //check last assignment origin
    //check when data was last cached
    let lastdbcheck = datasetinfo[key].lastdbcheck;
    let lastassigned = datasetinfo[key].lastassigned;
    let assignedfrom = datasetinfo[key].assignedfrom;
    let lastcache = datasetinfo[key].lastcache;

    //dblastupdated is newest
    if (new Date(dblastupdated.getTime()) > lastassigned) {
        datasetinfo[key].lastassigned = new Date(dblastupdated).getTime();
        datasetinfo[key].assignedfrom = "db";
        return fetchfresh(formid);
    } else {
        const cache = getCacheEntry(`cache_${key}`);
        if (cache) {
            datasetinfo[key].lastassigned = cache.ts;
            datasetinfo[key].assignedfrom = 'cache';
            return cache.data;
        }
        datasetinfo[key].lastassigned = Date.now();
        datasetinfo[key].assignedfrom = 'db';
        return fetchfresh(datasetinfo[key].formId);
    }
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
    } catch (e) { }

}

async function fetchformdata(formId, bust = false) {
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

    const res = await fetch(
        `/wp-admin/admin-ajax.php?action=get_form_last_update&form=${formid}`
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { last_updated } = await res.json();

    datasetinfo[key].lastdbcheck = Date.now();
    datasetinfo[key].dblastupdated = last_updated;

    return last_updated;
}

const getcharacters = async () => characters = characters = await getDataset('characters');
const gettraits = async () => traits = traits = await getDataset('traits');
const getaccessories = async () => accessories = accessories = await getDataset('accessories');
const getwands = async () => wands = wands = await getDataset('wands');
const getwandwoods = async () => wandwoods = wandwoods = await getDataset('wandwoods');
const getwandcores = async () => wandcores = wandcores = await getDataset('wandcores');
const getwandqualities = async () => wandqualities = wandqualities = await getDataset('wandqualities');
const getspells = async () => spells = spells = await getDataset('spells');
const getbooks = async () => books = books = await getDataset('books');
const getschools = async () => schools = schools = await getDataset('schools');
const getproficiencies = async () => proficiencies = proficiencies = await getDataset('proficiencies');
const getpotions = async () => potions = potions = await getDataset('potions');
const getnamedcreatures = async () => namedcreatures = namedcreatures = await getDataset('namedcreatures');
const getitems = async () => items = items = await getDataset('items');
const getitemsinhand = async () => itemsinhand = itemsinhand = await getDataset('itemsinhand');
const getgeneralitems = async () => generalitems = generalitems = await getDataset('generalitems');
const getcreatures = async () => creatures = creatures = await getDataset('creatures');
const getcreatureparts = async () => creatureparts = creatureparts = await getDataset('creatureparts');
const getplants = async () => plants = plants = await getDataset('plants');
const getplantparts = async () => plantparts = plantparts = await getDataset('plantparts');
const getpreparations = async () => preparations = preparations = await getDataset('preparations');
const getfooddrink = async () => fooddrink = fooddrink = await getDataset('fooddrink');


// await fetchfresh(8);
// await checkdblastupdated(8);

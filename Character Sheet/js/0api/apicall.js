const isloaded = d =>
  (Array.isArray(d) && d.length > 0) ||
  (d && typeof d === 'object' && !Array.isArray(d) && Object.keys(d).length > 0);

const headers = new Headers();
headers.append('Authorization', 'Basic Q0E2RS1LUjdaLUtCT0wtTlVYUTp4');
const requestOptions = { method: 'GET', headers, redirect: 'follow' };

async function fetchjson(url, prevEtag) {
  const hdrs = new Headers(headers);
  if (prevEtag) hdrs.append('If-None-Match', prevEtag);
  const res = await fetch(url, { ...requestOptions, headers: hdrs });
  if (res.status === 304) return null;
  if (res.ok) {
    const data = await res.json();
    return { data, etag: res.headers.get('ETag') };
  }
  throw new Error(`HTTP ${res.status}`);
}

const fetchdata = (url, prevEtag) => fetchjson(url, prevEtag);

async function getcharacters() {
  if (isloaded(characters)) return characters;
  const meta = cache_meta.find(m => m.dataset === 'characters');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/972/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    characters = result.data;
    cache_meta.push({ dataset:'characters', etag:result.etag, lastcache:new Date() });
  }
  return characters;
}

async function gettraits() {
  if (isloaded(traits)) return traits;
  const meta = cache_meta.find(m => m.dataset === 'traits');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/979/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    traits = result.data;
    cache_meta.push({ dataset:'traits', etag:result.etag, lastcache:new Date() });
  }
  return traits;
}

async function getaccessories() {
  if (isloaded(accessories)) return accessories;
  const meta = cache_meta.find(m => m.dataset === 'accessories');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/995/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    accessories = result.data;
    cache_meta.push({ dataset:'accessories', etag:result.etag, lastcache:new Date() });
  }
  return accessories;
}

async function getitemsinhand() {
  if (isloaded(itemsinhand)) return itemsinhand;
  const meta = cache_meta.find(m => m.dataset === 'itemsinhand');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/1085/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    itemsinhand = result.data;
    cache_meta.push({ dataset:'itemsinhand', etag:result.etag, lastcache:new Date() });
  }
  return itemsinhand;
}

async function getitems() {
  if (isloaded(items)) return items;
  const meta = cache_meta.find(m => m.dataset === 'items');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/964/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    items = result.data;
    cache_meta.push({ dataset:'items', etag:result.etag, lastcache:new Date() });
  }
  return items;
}

async function getspells() {
  if (isloaded(spells)) return spells;
  const meta = cache_meta.find(m => m.dataset === 'spells');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/191/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    spells = result.data;
    cache_meta.push({ dataset:'spells', etag:result.etag, lastcache:new Date() });
  }
  return spells;
}

async function getproficiencies() {
  if (isloaded(proficiencies)) return proficiencies;
  const meta = cache_meta.find(m => m.dataset === 'proficiencies');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/944/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    proficiencies = result.data;
    cache_meta.push({ dataset:'proficiencies', etag:result.etag, lastcache:new Date() });
  }
  return proficiencies;
}

async function getpotions() {
  if (isloaded(potions)) return potions;
  const meta = cache_meta.find(m => m.dataset === 'potions');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/34/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    potions = result.data;
    cache_meta.push({ dataset:'potions', etag:result.etag, lastcache:new Date() });
  }
  return potions;
}

async function getnamedcreatures() {
  if (isloaded(namedcreatures)) return namedcreatures;
  const meta = cache_meta.find(m => m.dataset === 'namedcreatures');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/170/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    namedcreatures = result.data;
    cache_meta.push({ dataset:'namedcreatures', etag:result.etag, lastcache:new Date() });
  }
  return namedcreatures;
}

async function getbooks() {
  if (isloaded(books)) return books;
  const meta = cache_meta.find(m => m.dataset === 'books');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/8/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    books = result.data;
    cache_meta.push({ dataset:'books', etag:result.etag, lastcache:new Date() });
  }
  return books;
}

async function getschools() {
  if (isloaded(schools)) return schools;
  const meta = cache_meta.find(m => m.dataset === 'schools');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/3/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    schools = result.data;
    cache_meta.push({ dataset:'schools', etag:result.etag, lastcache:new Date() });
  }
  return schools;
}

async function getwands() {
  if (isloaded(wands)) return wands;
  const meta = cache_meta.find(m => m.dataset === 'wands');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/114/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    wands = result.data;
    cache_meta.push({ dataset:'wands', etag:result.etag, lastcache:new Date() });
  }
  return wands;
}

async function getwandwoods() {
  if (isloaded(wandwoods)) return wandwoods;
  const meta = cache_meta.find(m => m.dataset === 'wandwoods');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/120/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    wandwoods = result.data;
    cache_meta.push({ dataset:'wandwoods', etag:result.etag, lastcache:new Date() });
  }
  return wandwoods;
}

async function getwandcores() {
  if (isloaded(wandcores)) return wandcores;
  const meta = cache_meta.find(m => m.dataset === 'wandcores');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/116/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    wandcores = result.data;
    cache_meta.push({ dataset:'wandcores', etag:result.etag, lastcache:new Date() });
  }
  return wandcores;
}

async function getwandqualities() {
  if (isloaded(wandqualities)) return wandqualities;
  const meta = cache_meta.find(m => m.dataset === 'wandqualities');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/124/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    wandqualities = result.data;
    cache_meta.push({ dataset:'wandqualities', etag:result.etag, lastcache:new Date() });
  }
  return wandqualities;
}

async function getgeneralitems() {
  if (isloaded(generalitems)) return generalitems;
  const meta = cache_meta.find(m => m.dataset === 'generalitems');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/126/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    generalitems = result.data;
    cache_meta.push({ dataset:'generalitems', etag:result.etag, lastcache:new Date() });
  }
  return generalitems;
}

async function getcreatures() {
  if (isloaded(creatures)) return creatures;
  const meta = cache_meta.find(m => m.dataset === 'creatures');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/48/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    creatures = result.data;
    cache_meta.push({ dataset:'creatures', etag:result.etag, lastcache:new Date() });
  }
  return creatures;
}

async function getcreatureparts() {
  if (isloaded(creatureparts)) return creatureparts;
  const meta = cache_meta.find(m => m.dataset === 'creatureparts');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/53/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    creatureparts = result.data;
    cache_meta.push({ dataset:'creatureparts', etag:result.etag, lastcache:new Date() });
  }
  return creatureparts;
}

async function getplants() {
  if (isloaded(plants)) return plants;
  const meta = cache_meta.find(m => m.dataset === 'plants');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/2/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    plants = result.data;
    cache_meta.push({ dataset:'plants', etag:result.etag, lastcache:new Date() });
  }
  return plants;
}

async function getplantparts() {
  if (isloaded(plantparts)) return plantparts;
  const meta = cache_meta.find(m => m.dataset === 'plantparts');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/43/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    plantparts = result.data;
    cache_meta.push({ dataset:'plantparts', etag:result.etag, lastcache:new Date() });
  }
  return plantparts;
}

async function getpreparations() {
  if (isloaded(preparations)) return preparations;
  const meta = cache_meta.find(m => m.dataset === 'preparations');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/908/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    preparations = result.data;
    cache_meta.push({ dataset:'preparations', etag:result.etag, lastcache:new Date() });
  }
  return preparations;
}

async function getfooddrink() {
  if (isloaded(fooddrink)) return fooddrink;
  const meta = cache_meta.find(m => m.dataset === 'fooddrink');
  const result = await fetchdata(
    'https://charmscheck.com/wp-json/frm/v2/forms/67/entries?page_size=10000',
    meta?.etag
  );
  if (result) {
    fooddrink = result.data;
    cache_meta.push({ dataset:'fooddrink', etag:result.etag, lastcache:new Date() });
  }
  return fooddrink;
}
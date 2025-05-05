// apicall.js

const headers = new Headers()
headers.append('Authorization','Basic Q0E2RS1LUjdaLUtCT0wtTlVYUTp4')
const requestoptions = { method:'GET', headers, redirect:'follow' }

async function fetchjson(url) {
  const res = await fetch(url, requestoptions)
  if (res.status === 200) return res.json()
  throw new Error(res.status)
}

const fetchdata = url => fetchjson(url)

async function getcharacters() {
  if (characters?.length) return characters
  characters = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/972/entries?page_size=10000')
  cache_meta.push({ dataset:'characters', lastcache:new Date() })
  return characters
}

async function gettraits() {
  if (traits) return traits
  traits = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/979/entries?page_size=10000')
  cache_meta.push({ dataset:'traits', lastcache:new Date() })
  return traits
}

async function getaccessories() {
  if (accessories) return accessories
  accessories = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/995/entries?page_size=10000')
  cache_meta.push({ dataset:'accessories', lastcache:new Date() })
  return accessories
}

async function getitemsinhand() {
  if (itemsinhand) return itemsinhand
  itemsinhand = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/1085/entries?page_size=10000')
  cache_meta.push({ dataset:'itemsinhand', lastcache:new Date() })
  return itemsinhand
}

async function getitems() {
  if (items) return items
  items = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/964/entries?page_size=10000')
  cache_meta.push({ dataset:'items', lastcache:new Date() })
  return items
}

async function getspells() {
  if (spells) return spells
  spells = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/191/entries?page_size=10000')
  cache_meta.push({ dataset:'spells', lastcache:new Date() })
  return spells
}

async function getproficiencies() {
  if (proficiencies) return proficiencies
  proficiencies = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/944/entries?page_size=10000')
  cache_meta.push({ dataset:'proficiencies', lastcache:new Date() })
  return proficiencies
}

async function getpotions() {
  if (potions) return potions
  potions = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/34/entries?page_size=10000')
  cache_meta.push({ dataset:'potions', lastcache:new Date() })
  return potions
}

async function getnamedcreatures() {
  if (namedcreatures) return namedcreatures
  namedcreatures = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/170/entries?page_size=10000')
  cache_meta.push({ dataset:'namedcreatures', lastcache:new Date() })
  return namedcreatures
}

async function getbooks() {
  if (books) return books
  books = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/8/entries?page_size=10000')
  cache_meta.push({ dataset:'books', lastcache:new Date() })
  return books
}

async function getschools() {
  if (schools) return schools
  schools = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/3/entries?page_size=10000')
  cache_meta.push({ dataset:'schools', lastcache:new Date() })
  return schools
}

async function getwands() {
  if (wands) return wands
  wands = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/114/entries?page_size=10000')
  cache_meta.push({ dataset:'wands', lastcache:new Date() })
  return wands
}

async function getwandwoods() {
  if (wandwoods) return wandwoods
  wandwoods = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/120/entries?page_size=10000')
  cache_meta.push({ dataset:'wandwoods', lastcache:new Date() })
  return wandwoods
}

async function getwandcores() {
  if (wandcores) return wandcores
  wandcores = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/116/entries?page_size=10000')
  cache_meta.push({ dataset:'wandcores', lastcache:new Date() })
  return wandcores
}

async function getwandqualities() {
  if (wandqualities) return wandqualities
  wandqualities = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/124/entries?page_size=10000')
  cache_meta.push({ dataset:'wandqualities', lastcache:new Date() })
  return wandqualities
}

async function getgeneralitems() {
  if (generalitems) return generalitems
  generalitems = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/126/entries?page_size=10000')
  cache_meta.push({ dataset:'generalitems', lastcache:new Date() })
  return generalitems
}

async function getcreatures() {
  if (creatures) return creatures
  creatures = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/48/entries?page_size=10000')
  cache_meta.push({ dataset:'creatures', lastcache:new Date() })
  return creatures
}

async function getcreatureparts() {
  if (creatureparts) return creatureparts
  creatureparts = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/53/entries?page_size=10000')
  cache_meta.push({ dataset:'creatureparts', lastcache:new Date() })
  return creatureparts
}

async function getplants() {
  if (plants) return plants
  plants = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/2/entries?page_size=10000')
  cache_meta.push({ dataset:'plants', lastcache:new Date() })
  return plants
}

async function getplantparts() {
  if (plantparts) return plantparts
  plantparts = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/43/entries?page_size=10000')
  cache_meta.push({ dataset:'plantparts', lastcache:new Date() })
  return plantparts
}

async function getpreparations() {
  if (preparations) return preparations
  preparations = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/908/entries?page_size=10000')
  cache_meta.push({ dataset:'preparations', lastcache:new Date() })
  return preparations
}

async function getfooddrink() {
  if (fooddrink) return fooddrink
  fooddrink = await fetchdata('https://charmscheck.com/wp-json/frm/v2/forms/67/entries?page_size=10000')
  cache_meta.push({ dataset:'fooddrink', lastcache:new Date() })
  return fooddrink
}

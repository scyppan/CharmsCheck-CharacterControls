// simple fetch helper
async function fetchdata(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`http ${res.status}`);
  return res.json();
}

function hydrate(item) {
  const metaObj = Object.fromEntries(
    (item.meta || []).map(({ meta_key, meta_value }) => [meta_key, meta_value])
  );
  return { ...item, meta: metaObj, name: metaObj.name || '' };
}

// all dataset getters
const getcharacters     = async () => characters      = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=972')).map(hydrate);
const gettraits         = async () => traits          = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=979')).map(hydrate);
const getaccessories    = async () => accessories     = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=995')).map(hydrate);
const getwands          = async () => wands           = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=114')).map(hydrate);
const getwandwoods      = async () => wandwoods       = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=120')).map(hydrate);
const getwandcores      = async () => wandcores       = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=116')).map(hydrate);
const getwandqualities  = async () => wandqualities   = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=124')).map(hydrate);
const getspells         = async () => spells          = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=191')).map(hydrate);
const getbooks          = async () => books           = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=8')).map(hydrate);
const getschools        = async () => schools         = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=3')).map(hydrate);
const getproficiencies  = async () => proficiencies   = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=944')).map(hydrate);
const getpotions        = async () => potions         = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=34')).map(hydrate);
const getnamedcreatures = async () => namedcreatures  = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=170')).map(hydrate);
const getitems          = async () => items           = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=964')).map(hydrate);
const getitemsinhand    = async () => itemsinhand     = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=1085')).map(hydrate);
const getgeneralitems   = async () => generalitems    = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=126')).map(hydrate);
const getcreatures      = async () => creatures       = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=48')).map(hydrate);
const getcreatureparts  = async () => creatureparts   = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=53')).map(hydrate);
const getplants         = async () => plants          = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=2')).map(hydrate);
const getplantparts     = async () => plantparts      = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=43')).map(hydrate);
const getpreparations   = async () => preparations    = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=908')).map(hydrate);
const getfooddrink      = async () => fooddrink       = (await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=67')).map(hydrate);
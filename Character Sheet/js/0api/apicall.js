// simple fetch helper
async function fetchdata(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`http ${res.status}`);
  return res.json();
}

const getcharacters      = async () => characters      = characters      = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=972');
const gettraits          = async () => traits          = traits          = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=979');
const getaccessories     = async () => accessories     = accessories     = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=995');
const getwands           = async () => wands           = wands           = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=114');
const getwandwoods       = async () => wandwoods       = wandwoods       = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=120');
const getwandcores       = async () => wandcores       = wandcores       = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=116');
const getwandqualities   = async () => wandqualities   = wandqualities   = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=124');
const getspells          = async () => spells          = spells          = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=191');
const getbooks           = async () => books           = books           = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=8');
const getschools         = async () => schools         = schools         = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=3');
const getproficiencies   = async () => proficiencies   = proficiencies   = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=944');
const getpotions         = async () => potions         = potions         = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=34');
const getnamedcreatures  = async () => namedcreatures  = namedcreatures  = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=170');
const getitems           = async () => items           = items           = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=964');
const getitemsinhand     = async () => itemsinhand     = itemsinhand     = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=1085');
const getgeneralitems    = async () => generalitems    = generalitems    = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=126');
const getcreatures       = async () => creatures       = creatures       = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=48');
const getcreatureparts   = async () => creatureparts   = creatureparts   = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=53');
const getplants          = async () => plants          = plants          = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=2');
const getplantparts      = async () => plantparts      = plantparts      = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=43');
const getpreparations    = async () => preparations    = preparations    = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=908');
const getfooddrink       = async () => fooddrink       = fooddrink       = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=67');

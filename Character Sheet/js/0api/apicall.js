// simple fetch helper
async function fetchdata(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`http ${res.status}`);
  return res.json();
}

async function loaddata() {
  characters      = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=972');
  traits          = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=979');
  accessories     = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=995');
  wands           = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=114');
  wandwoods       = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=120');
  wandcores       = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=116');
  wandqualities   = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=124');
  spells          = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=191');
  books           = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=8');
  schools         = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=3');
  proficiencies   = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=944');
  potions         = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=34');
  namedcreatures  = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=170');
  items           = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=964');
  itemsinhand     = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=1085');
  generalitems    = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=126');
  creatures       = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=48');
  creatureparts   = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=53');
  plants          = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=2');
  plantparts      = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=43');
  preparations    = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=908');
  fooddrink       = await fetchdata('/wp-admin/admin-ajax.php?action=get_form_data&form=67');
}
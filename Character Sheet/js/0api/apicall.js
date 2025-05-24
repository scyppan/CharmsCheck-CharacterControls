// simple fetch helper
async function fetchdata(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`http ${res.status}`);
  return res.json();
}

// generic getter by form ID
const getdataset = id =>
  fetchdata(`/wp-admin/admin-ajax.php?action=get_form_data&form=${id}`);

// concrete getters
const getcharacters     = () => getdataset(972);
const gettraits         = () => getdataset(979);
const getaccessories    = () => getdataset(995);
const getwands          = () => getdataset(114);
const getwandwoods      = () => getdataset(120);
const getwandcores      = () => getdataset(116);
const getwandqualities  = () => getdataset(124);
const getspells         = () => getdataset(191);
const getbooks          = () => getdataset(8);
const getschools        = () => getdataset(3);
const getproficiencies  = () => getdataset(944);
const getpotions        = () => getdataset(34);
const getnamedcreatures = () => getdataset(170);
const getitems          = () => getdataset(964);
const getitemsinhand    = () => getdataset(1085);
const getgeneralitems   = () => getdataset(126);
const getcreatures      = () => getdataset(48);
const getcreatureparts  = () => getdataset(53);
const getplants         = () => getdataset(2);
const getplantparts     = () => getdataset(43);
const getpreparations   = () => getdataset(908);
const getfooddrink      = () => getdataset(67);
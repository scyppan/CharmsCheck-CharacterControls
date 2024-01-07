//=====================
//Setup Functions
//=====================
function assignelements() {
  let submit=document.getElementsByClassName("frm_button_submit frm_final_submit");
  submitbutton = submit[0];
  charactersheet=document.getElementById("frm_field_7715_container");
  equipment=document.getElementById("frm_field_7717_container");
  relationships=document.getElementById("frm_field_7775_container");

  bloodstatus = document.getElementById("field_bloodstatus");
  currentyear = document.getElementById("field_currentyear");
  birthyear=document.getElementById("field_birthyear");
  birthmonth=document.getElementById("field_birthmonth");
  birthday=document.getElementById("field_birthday");
  gregoriandesc=document.getElementById("gregoriandesc");
  gregoriandesc.style="display:none";
  startyear=document.getElementById("startyear");
  
  generosity = document.getElementById("field_generosity2");
  wealth = document.getElementById("field_wealth2");
  permissiveness = document.getElementById("field_permissiveness");
  
  traitlimittextdisplay = document.getElementById("traitselectionlimit");
  trait_animallover = document.getElementById("field_traits-0");
  trait_bookworm = document.getElementById("field_traits-1");
  trait_caring = document.getElementById("field_traits-2");
  trait_clairvoyant = document.getElementById("field_traits-3");
  trait_contrarian = document.getElementById("field_traits-4");
  trait_controlling = document.getElementById("field_traits-5");
  trait_crafty = document.getElementById("field_traits-6");
  trait_curious = document.getElementById("field_traits-7");
  trait_environmentalist = document.getElementById("field_traits-8");
  trait_frugal = document.getElementById("field_traits-9");
  trait_greenthumb = document.getElementById("field_traits-10");
  trait_inventive = document.getElementById("field_traits-11");
  trait_navigator = document.getElementById("field_traits-12");
  trait_needler = document.getElementById("field_traits-13");
  trait_observant = document.getElementById("field_traits-14");
  trait_ouster = document.getElementById("field_traits-15");
  trait_peopleperson = document.getElementById("field_traits-16");
  trait_protective = document.getElementById("field_traits-17");
  trait_resistant = document.getElementById("field_traits-18");
  trait_runologist = document.getElementById("field_traits-19");
  trait_secretive = document.getElementById("field_traits-20");
  trait_stargazer = document.getElementById("field_traits-21");
  trait_supportive = document.getElementById("field_traits-22");
  traits = [
    trait_animallover, trait_bookworm, trait_caring, trait_clairvoyant, 
    trait_contrarian, trait_controlling, trait_crafty, trait_curious, 
    trait_environmentalist, trait_frugal, trait_greenthumb, trait_inventive, 
    trait_navigator, trait_needler, trait_observant, trait_ouster, 
    trait_peopleperson, trait_protective, trait_resistant, trait_runologist, 
    trait_secretive, trait_stargazer, trait_supportive
	];

  characteristiclimittextdisplay = document.getElementById("characteristicselectionlimit");
  creativity = document.getElementById("field_creativity");
  equanimity = document.getElementById("field_equanimity");
  charisma = document.getElementById("field_charisma");
  attractiveness = document.getElementById("field_attractiveness");
  strength = document.getElementById("field_strength");
  agility = document.getElementById("field_agility");
  intellect = document.getElementById("field_intellect");
  willpower = document.getElementById("field_willpower");
  fortitude = document.getElementById("field_fortitude");
	characteristics=[creativity, equanimity, charisma, attractiveness, strength, agility, intellect, willpower, fortitude];
  
  electives1=document.getElementById("frm_field_7514_container");
  electives2=document.getElementById("frm_field_7608_container");
  electives3=document.getElementById("frm_field_7616_container");
  electives4=document.getElementById("frm_field_7623_container");
  electives5=document.getElementById("frm_field_7629_container");
  electives6=document.getElementById("frm_field_7637_container");
  electives7=document.getElementById("frm_field_7644_container");
  electives1.style="display:none"; 
  electives2.style="display:none";
  electives3.style="display:none";
  electives4.style="display:none";
  electives5.style="display:none";
  electives6.style="display:none";
  electives7.style="display:none";
  electivedesc1 = document.getElementById("frm_desc_field_electives1");
  electivedesc2 = document.getElementById("frm_desc_field_electives2");
  electivedesc3 = document.getElementById("frm_desc_field_electives3");
  electivedesc4 = document.getElementById("frm_desc_field_electives4");
  electivedesc5 = document.getElementById("frm_desc_field_electives5");
  electivedesc6 = document.getElementById("frm_desc_field_electives6");
  electivedesc7 = document.getElementById("frm_desc_field_electives7");
  electivelimit1 = document.getElementById("field_electivelimits1");
  electivelimit2 = document.getElementById("field_electivelimits2");
  electivelimit3 = document.getElementById("field_electivelimits3");
  electivelimit4 = document.getElementById("field_electivelimits4");
  electivelimit5 = document.getElementById("field_electivelimits5");
  electivelimit6 = document.getElementById("field_electivelimits6");
  electivelimit7 = document.getElementById("field_electivelimits7");
  
	let container1=document.getElementById("frm_field_7514_container");
	let container2=document.getElementById("frm_field_7608_container");
	let container3=document.getElementById("frm_field_7616_container");
	let container4=document.getElementById("frm_field_7623_container");
	let container5=document.getElementById("frm_field_7629_container");
	let container6=document.getElementById("frm_field_7637_container");
	let container7=document.getElementById("frm_field_7644_container");
	electiveset1=container1.children[1];
	electiveset2=container2.children[1];
	electiveset3=container3.children[1];
	electiveset4=container4.children[1];
	electiveset5=container5.children[1];
	electiveset6=container6.children[1];
	electiveset7=container7.children[1];
	
  //document.getElementById("loadingimg").style="display:none";
  school=document.getElementById("field_school");
	
}
function setupdatefunctions(){
	for (let i=0;i<traits.length;i++){
		traits[i].setAttribute('onchange', 'settraitlimit()');
	}
	
	currentyear.setAttribute('onchange', 'yearchanged()');
	school.setAttribute('onchange', 'schoolchanged()');
	birthyear.setAttribute('onchange', 'birthdatechanged()');
	birthmonth.setAttribute('onchange', 'birthdatechanged()');
	birthday.setAttribute('onchange', 'birthdatechanged()');
	bloodstatus.setAttribute('onchange', 'settraitlimit()');
	permissiveness.setAttribute('onchange', 'settraitlimit()');
	
	for(let i=0;i<characteristics.length; i++){
		characteristics[i].setAttribute('onchange', 'characteristicpointspent(this.id)');
	}
}
function setrandparental(){
	if(!generosity.value){generosity.value=randbetween(1,10);}
	if(!wealth.value){wealth.value=randbetween(1,10);}
	if(!permissiveness.value){permissiveness.value=randbetween(1,10);}
}
function setallelectiveupdatefunctions(){
	setelectiveupdatefunctionsforoneyear(electives.year1);
	setelectiveupdatefunctionsforoneyear(electives.year2);
	setelectiveupdatefunctionsforoneyear(electives.year3);
	setelectiveupdatefunctionsforoneyear(electives.year4);
	setelectiveupdatefunctionsforoneyear(electives.year5);
	setelectiveupdatefunctionsforoneyear(electives.year6);
	setelectiveupdatefunctionsforoneyear(electives.year7);
}
function setelectiveupdatefunctionsforoneyear(year){
	for(let i=0;i<year.length;i++){
		year[i].setAttribute('onchange', 'electivechanged()');
	}
}
//=====================
//UI Functions
//=====================
function btnclicked(which){

	switch(which){
	case "charactersheetbtn":
		charactersheet.style = "display: block";
		equipment.style = "display: none";
		relationships.style = "display: none";
	break;
	case "equipmentbtn":
		charactersheet.style = "display: none";
		equipment.style = "display: block";
		relationships.style = "display: none";
	break;
	case "relationshipsbtn":
		charactersheet.style = "display: none";
		equipment.style = "display: none";
		relationships.style = "display: block";
	break;
	}
}
//=====================
//Update Functions
//=====================
function yearchanged(){
	
	setcharacteristicpointstospendtxt();
	checktoomanycharpointsspent();
}
function birthdatechanged(){
	let monthval=parseInt(birthmonth.value);
	let yearval=parseInt(birthyear.value);
	let calcyear=yearval+11;
	
	if(monthval>=9){
		calcyear=yearval+12;
	}else{
		calcyear=yearval+11;
	}
	startyear.innerHTML="Academic start year: " + calcyear;
	fixdaysinmonth(monthval, yearval);
	checkspecialskippeddays(birthday.value, monthval, yearval);
}
function fixdaysinmonth(month, year){
	let max=getnumdaysinmonth(month, year);
	if(birthday.value>max){
		birthday.value=max;
	}
	birthday.max=max;
}
function schoolchanged(){
	console.log("School changed! Do Stuff");
}
function electivechanged(){
	checkallelectivelimits();
}
function electivesetchanged(){
	
	setTimeout(function(){
	assignelectivecheckboxes();
	setelectivelimitdesc();
	setallelectiveupdatefunctions();
	},100);
}
//=====================
//Traits
//=====================
function settraitlimit(){
	
	switch(bloodstatus.value){
		case "Pureblood": traitlimit=0; break;
		case "Wizard-Raised Halfblood": traitlimit=1; break;
		case "Muggle-Raised Halfblood": traitlimit=2; break;
		case "Muggleborn": traitlimit=3; break;
	}
	
	if(permissiveness.value<4){traitlimit--}
	if (permissiveness.value > 6) { traitlimit++ }
	
	for (let i = 0; i < traits.length; i++) {
		if (traits[i].checked) { traitlimit--; }
	}
	
	if (traitlimit < 0) { traitlimit = 0 }

	if (traitlimit <= 0) {
		for (let i = 0; i < traits.length; i++) {
			if (!traits[i].checked) { traits[i].disabled = true; } else { traits[i].disabled = false; }
		}
	} else {
		for (let i = 0; i < traits.length; i++) {
			traits[i].disabled = false;
		}
	}
	traitselectionlimit.innerHTML=`Pick ${traitlimit} more`;
	
}
//=====================
//Characteristics
//=====================
function characteristicpointspent(field){
	
	let char = document.getElementById(field);
	let inputval = parseInt(char.value);
	let limit=parseInt(getcharacteristiclimit());
	let spent=parseInt(getcharacteristicpointsspent());
	
	if(spent>limit){
		char.value=inputval+(limit-spent);
	}
	
	checktoomanycharpointsspent();
	setcharacteristicpointstospendtxt();
}
function getcharacteristiclimit(){
	return 8+parseInt(currentyear.value);
}
function getcharacteristicpointsspent(){
	let count=0;
	for(let i=0;i<characteristics.length; i++){
		count+=parseInt(characteristics[i].value-1);
	}
	
	return count;
}
function checktoomanycharpointsspent(){
	let limit=getcharacteristiclimit();
	let spent=getcharacteristicpointsspent();
	
	if(spent>limit){
		submitbutton.disabled=true;
	}else{
		submitbutton.disabled=false;
	}
}
function setcharacteristicpointstospendtxt(){
	let limit=getcharacteristiclimit();
	let spent=getcharacteristicpointsspent();
	
	if(spent>limit){
		characteristiclimittextdisplay.innerHTML=`Spent too many points! Unspend ${spent-limit} points`;
	}//end if
	else{
			let count=0;
			for(let i=0;i<characteristics.length; i++){
			count+=parseInt(characteristics[i].value-1);
		}

		let remaining = getcharacteristiclimit()-count;
		if(remaining<0){remaining=0;}

		characteristiclimittextdisplay.innerHTML=`${remaining} points to spend`;
	}//end else
}
//=====================
//Electives
//=====================
function assignelectivecheckboxes(){
	electives=new Electives();
	
	for(let i=1;i<=7;i++){
		let boxes=[];
		for(let j=0;j<18;j++){
			let boxname=`field_electives${i}-${j}`;
			let thisbox=document.getElementById(boxname);
			if (thisbox != null && thisbox != undefined && thisbox.value != null && thisbox.value != "") { boxes.push(thisbox); thisbox.checked = false; }
		}//end of inner for
		switch(i){
			case 1: electives.year1=boxes; break;
			case 2: electives.year2=boxes; break;
			case 3: electives.year3=boxes; break;
			case 4: electives.year4=boxes; break;
			case 5: electives.year5=boxes; break;
			case 6: electives.year6=boxes; break;
			case 7: electives.year7=boxes; break;
		}
	}//end of outter for
}
function setelectivelimitdesc(){
	electivedesc1.innerHTML=getelectivelimittxt(electives.year1);
	electivedesc2.innerHTML=getelectivelimittxt(electives.year2);
	electivedesc3.innerHTML=getelectivelimittxt(electives.year3);
	electivedesc4.innerHTML=getelectivelimittxt(electives.year4);
	electivedesc5.innerHTML=getelectivelimittxt(electives.year5);
	electivedesc6.innerHTML=getelectivelimittxt(electives.year6);
	electivedesc7.innerHTML=getelectivelimittxt(electives.year7);
}
function getelectivelimittxt(year){
	let val = 0;
	
	switch(year){
		case electives.year1: val=parseInt(electivelimit1.value)-getcountofelectives(electives.year1); break;
		case electives.year2: val=parseInt(electivelimit2.value)-getcountofelectives(electives.year2); break;
		case electives.year3: val=parseInt(electivelimit3.value)-getcountofelectives(electives.year3); break;
		case electives.year4: val=parseInt(electivelimit4.value)-getcountofelectives(electives.year4); break;
		case electives.year5: val=parseInt(electivelimit5.value)-getcountofelectives(electives.year5); break;
		case electives.year6: val=parseInt(electivelimit6.value)-getcountofelectives(electives.year6); break;
		case electives.year7: val=parseInt(electivelimit7.value)-getcountofelectives(electives.year7); break;
	}
	
	if(val==0){return "Elective limit reached!";}
	else{return `Pick ${val} more`;}
}
function buildmutationobservers(){
	mo1=new MutationObserver(entries => {electivesetchanged();});
	mo1.observe(electiveset1, {childList:true});	
	
	mo2=new MutationObserver(entries => {electivesetchanged();});
	mo2.observe(electiveset2, {childList:true});	
	
	mo3=new MutationObserver(entries => {electivesetchanged();});
	mo3.observe(electiveset3, {childList:true});	
	
	mo4=new MutationObserver(entries => {electivesetchanged();});
	mo4.observe(electiveset4, {childList:true});	
	
	mo5=new MutationObserver(entries => {electivesetchanged();});
	mo5.observe(electiveset5, {childList:true});	
	
	mo6=new MutationObserver(entries => {electivesetchanged();});
	mo6.observe(electiveset6, {childList:true});	
	
	mo7=new MutationObserver(entries => {electivesetchanged();});
	mo7.observe(electiveset7, {childList:true});	
}
function checkallelectivelimits(){
	checkyearelectivelimit(electives.year1, parseInt(electivelimit1.value));
	checkyearelectivelimit(electives.year2, parseInt(electivelimit2.value));
	checkyearelectivelimit(electives.year3, parseInt(electivelimit3.value));
	checkyearelectivelimit(electives.year4, parseInt(electivelimit4.value));
	checkyearelectivelimit(electives.year5, parseInt(electivelimit5.value));
	checkyearelectivelimit(electives.year6, parseInt(electivelimit6.value));
	checkyearelectivelimit(electives.year7, parseInt(electivelimit7.value));
}
function checkyearelectivelimit(year, limit){
	
	let count=getcountofelectives(year);
	
	if(count>=limit){
		for(let i=0;i<year.length;i++){
			if(!year[i].checked){
				year[i].disabled=true;
				year[i].style.backgroundColor="rgba(235,42,45,.2)";
			}
		}
	}else{
		for(let i=0;i<year.length;i++){
			year[i].disabled=false;
			year[i].style.backgroundColor="white";
		}
	}
	
	setelectivelimitdesc();
}
function getcountofelectives(year){
	let count=0;
	for(let i=0;i<year.length;i++){
		if(year[i].checked){count++;}
	}
	
	return count;
}
//=====================
//Global vars & Classes
//=====================
//Btns and Divs
let submitbutton = null;
let charactersheet = null;
let equipment = null;
let relationships = null;

// demographics
let bloodstatus = null;
let currentyear = null;
let birthyear = null;
let birthmonth = null;
let birthday = null;
let gregoriandesc = null;
let startyear = null;

// parental
let generosity = null;
let wealth = null;
let permissiveness = null;

// traits
let traitlimit = null;
let traitlimittextdisplay = null;
let trait_animallover = null;
let trait_bookworm = null;
let trait_caring = null;
let trait_clairvoyant = null;
let trait_contrarian = null;
let trait_controlling = null;
let trait_crafty = null;
let trait_curious = null;
let trait_environmentalist = null;
let trait_frugal = null;
let trait_greenthumb = null;
let trait_inventive = null;
let trait_navigator = null;  
let trait_needler = null;
let trait_observant = null;
let trait_ouster = null;
let trait_peopleperson = null;
let trait_protective = null;
let trait_resistant = null;
let trait_runologist = null;  
let trait_secretive = null;
let trait_stargazer = null;
let trait_supportive = null;

let traits=[];

// characteristics
let characteristiclimittextdisplay = null;
let creativity = null;
let equanimity = null;
let charisma = null;
let attractiveness = null;
let strength = null;
let agility = null;
let intellect = null;
let willpower = null;
let fortitude = null;
let characteristics=[];

// electives
class Electives{
	constructor(year1, year2, year3, year4, year5, year6, year7){
		this.year1=year1;
		this.year2=year2;
		this.year3=year3;
		this.year4=year4;
		this.year5=year5;
		this.year6=year6;
		this.year7=year7;
	}
}

let electiveset1=null;
let electiveset2=null;
let electiveset3=null;
let electiveset4=null;
let electiveset5=null;
let electiveset6=null;
let electiveset7=null;

let mo1 = null;
let mo2 = null;
let mo3 = null;
let mo4 = null;
let mo5 = null;
let mo6 = null;
let mo7 = null;

let electives=null;

//equipment
//========================
//Liio Tools
//========================
function getnumdaysinmonth(month, year){
	switch(month){
		case 2: if(checkleapyear(year)){return 29;} return 28;
		case 4: return 30;
		case 6: return 30;
		case 9: return 30;
		case 11: return 30;
		default: return 31;
	}
}
function checkleapyear(year){
	//source: https://scienceworld.wolfram.com/astronomy/LeapYear.html#:~:text=Leap%20years%20were%20therefore%2045,out%20of%20every%20four%20centuries).
	let leapyears = [-45,-42,-39,-36,-33,-30,-27,-24,-21,-18,-15,-12,-9,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100,104,108,112,116,120,124,128,132,136,140,144,148,152,156,160,164,168,172,176,180,184,188,192,196,200,204,208,212,216,220,224,228,232,236,240,244,248,252,256,260,264,268,272,276,280,284,288,292,296,300,304,308,312,316,320,324,328,332,336,340,344,348,352,356,360,364,368,372,376,380,384,388,392,396,400,404,408,412,416,420,424,428,432,436,440,444,448,452,456,460,464,468,472,476,480,484,488,492,496,500,504,508,512,516,520,524,528,532,536,540,544,548,552,556,560,564,568,572,576,580,584,588,592,596,600,604,608,612,616,620,624,628,632,636,640,644,648,652,656,660,664,668,672,676,680,684,688,692,696,700,704,708,712,716,720,724,728,732,736,740,744,748,752,756,760,764,768,772,776,780,784,788,792,796,800,804,808,812,816,820,824,828,832,836,840,844,848,852,856,860,864,868,872,876,880,884,888,892,896,900,904,908,912,916,920,924,928,932,936,940,944,948,952,956,960,964,968,972,976,980,984,988,992,996,1000,1004,1008,1012,1016,1020,1024,1028,1032,1036,1040,1044,1048,1052,1056,1060,1064,1068,1072,1076,1080,1084,1088,1092,1096,1100,1104,1108,1112,1116,1120,1124,1128,1132,1136,1140,1144,1148,1152,1156,1160,1164,1168,1172,1176,1180,1184,1188,1192,1196,1200,1204,1208,1212,1216,1220,1224,1228,1232,1236,1240,1244,1248,1252,1256,1260,1264,1268,1272,1276,1280,1284,1288,1292,1296,1300,1304,1308,1312,1316,1320,1324,1328,1332,1336,1340,1344,1348,1352,1356,1360,1364,1368,1372,1376,1380,1384,1388,1392,1396,1400,1404,1408,1412,1416,1420,1424,1428,1432,1436,1440,1444,1448,1452,1456,1460,1464,1468,1472,1476,1480,1484,1488,1492,1496,1500,1504,1508,1512,1516,1520,1524,1528,1532,1536,1540,1544,1548,1552,1556,1560,1564,1568,1572,1576,1580,1584,1588,1592,1596,1600,1604,1608,1612,1616,1620,1624,1628,1632,1636,1640,1644,1648,1652,1656,1660,1664,1668,1672,1676,1680,1684,1688,1692,1696,1704,1708,1712,1716,1720,1724,1728,1732,1736,1740,1744,1748,1752,1756,1760,1764,1768,1772,1776,1780,1784,1788,1792,1796,1804,1808,1812,1816,1820,1824,1828,1832,1836,1840,1844,1848,1852,1856,1860,1864,1868,1872,1876,1880,1884,1888,1892,1896,1904,1908,1912,1916,1920,1924,1928,1932,1936,1940,1944,1948,1952,1956,1960,1964,1968,1972,1976,1980,1984,1988,1992,1996,2000,2004,2008,2012,2016,2020,2024,2028,2032, 2036, 2040, 2044, 2048, 2052, 2056, 2060, 2064, 2068, 2072, 2076, 2080, 2084, 2088, 2092, 2096];
	
	for(let i=0; i<leapyears.length; i++){
		if(year==leapyears[i]){
			return true;
		}
	}
	
	return false;
}
function checkspecialskippeddays(day, month, year){
	if(month==10&&year==1582&&day>4&&day<15){
		gregoriandesc.style="display:block";
	}else{
		gregoriandesc.style="display:none";
	}
}
function validateWholeNumericInput(id, val) {

      if (val < 0) {val = 0;}

      if (!Number.isInteger(val)) {
        var newval = Math.round(val);
        document.getElementById(id).value = newval;
      }
    }
function randbetween(min, max) { // min and max included 

  var val = Math.floor(Math.random() * (max - min + 1) + min);
  return val;
}
function returninrange(lo, hi, val){
	if(val>hi){return hi;}
  if(val<lo){return lo;}else{
  return val;
  }
}
function castarrayasint(array){
	let result = array.map(function (x) { 
  		return parseInt(x, 10); 
		});
    
  return result;
}
function sortarray(array){
	let newarray = array.sort(function(a,b) {
  return (+a) - (+b);
});
	return newarray;
}
//=====================
//Initializing functions
//=====================
function loadup(){

	//setup
	assignelements();
	buildmutationobservers();
	setupdatefunctions();
	setrandparental();
	
	//traits
	settraitlimit();
	
	//characteristics
	setcharacteristicpointstospendtxt();
	
	//view
	btnclicked("charactersheetbtn");
	document.getElementById("loadinggif").style="display:none;";
	let outercontainerparent=document.getElementById("outercontainer").parentElement;
	let outercontainerchild1=document.getElementById("outercontainer").children[0];
	outercontainerparent.appendChild(outercontainerchild1);
	
}
setTimeout(function (){
	document.addEventListener('DOMContentLoaded', loadup());	
},1500);


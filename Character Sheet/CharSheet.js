//All spells are listed in known spells, however, clicking leads to a new tab being opened to get the spell details. Instead, the game needs to roll the spell.
//Then all proficiencies need to be added
//Then all potions (broken down into Standard Potions and Alchemical potions)
//After that we need to work on pets
//After that we need to work on items - remember the which form is referenced depends on the item type
//After that we need to work on relationships
//need to make a potioncreationroll(name) function

//the old way of dealing with traits was to hard code the values in. But with the api calls, you're now able to think of something more sophisticated and pliable. 
//remember when adding spell and proficiency casting that the personality traits values needs to be included
//next, we need to pull the player's favorite spells, assign their subtypes, and add them as a div under favorite spells
//same for favorite proficiencies
//include a notes section
//include temp states in rolls including spells; proficiency
//api call for traits
//api call for books
//Add option to list quantity of items
//remember that wands, accessories, outfits and other items can have multiple effects, so you need to create an array of effects
//don't forget that healing attempts can exist in proficiencies and need to check for the caring trait
//also check items for known spells and proficiencies
//remember to check for passive bonuses from items stored in inventory
//there are many items in items new new that have not been added to the general items database
//add outfits, wands, accessories to items new new
//still need to factor equipment and passive bonuses from inventory items into rolls

let global = {};

let charvals = [];

let traits = [];
let spells = [];
let proficiencies=[];

let outfits=[];
let accessories=[];

let woods=[];
let cores=[];
let qualities=[];
let wands=[];

let items=[];
let generalitems=[];
let creatures=[];
let creatureparts=[];
let plants=[];
let plantparts=[];
let preparations=[];
let fooddrink=[];

let standardpotions=[];
let alchemicalpotions=[];

let namedcreatures=[];


let books=[];

//==========
//rolls
//==========
function postroll(rolldeets){
	
	let rollinittext=getrolltypetext(rolldeets);
	let rollthreshtext=getrollthreshtext(rolldeets);
	let rollresult=getrollresulttext(rolldeets);
	let alltext=`${charvals.name} ${rollinittext}. `;
	
	if(rollthreshtext!=""){alltext+=`${rollthreshtext}. `}
	
	alltext+=`${rollresult}.`;
	
	console.log(alltext);
	console.log(rolldeets);
	window.parent.postMessage(alltext,"*");
	displayroll(rolldeets, alltext);
}
function roll(id){
	
	rolldeets={
		rollid: `${id}`,
		type: "",
		val: "",
		threshold: 0,
		skillname: normalizename(id),
		abilityval: 0,
		skillval: 0,
		trait: 0,
		parental: 0,
		equipment: 0,
		characteristic: 0,
		temp: parseInt(document.getElementById("addtrollmod").value)|| 0,
		dice: 0,
	}
	
	rolldeets=getrollvals(rolldeets); //adds the skill and ability values to rolldeets;
	rolldeets.trait=addtraitbonus(id,"empty");
	rolldeets=getequipmentbonuses(rolldeets);
	
	return rolldeets;
}

function basicroll(id){
	let rolldeets=roll(id);
	postroll(rolldeets);
}
function spellroll(name){
	let spell=spells.find(x=>x.name==name);
	let rolldeets=roll(spell.skill);
	rolldeets.type="spell";
	rolldeets.val=spell.name;
	rolldeets.threshold=spell.threshold;
	rolldeets.trait=addtraitbonus(spell.skill, spell.subtype);
	postroll(rolldeets);
}

function proficiencyroll(name, type){
	let proficiency=proficiencies.find(x=>x.name==name);
	let rolldeets=roll(proficiency.skill);
	rolldeets.type="proficiency";
	rolldeets.val=proficiency.name;
	rolldeets.threshold=proficiency.threshold;
	postroll(rolldeets);
}
function potioncreationroll(name, type){
	
	let rolldeets;
	let record;
	
	switch(type){
	case "standard":
		record=standardpotions.find(x=>x.name==name);
		rolldeets=roll("Potions");
		rolldeets.type="potion";
	break;
	case "alchemical":
		record=alchemicalpotions.find(x=>x.name==name);
		rolldeets=roll("Alchemy");
		rolldeets.type="alchemy";
	break;
	}
	
	rolldeets.val=record.name;
	rolldeets.threshold=record.threshold;
	postroll(rolldeets);
	
}

function addtraitbonus(skill, subtype){
	
	let bonusamt=0;
	
	charvals.traits.forEach(trait=>{
		trait.bonuses.forEach(bonus=>{
			if(bonus.type==normalizename(skill)){bonusamt+=parseInt(bonus.amount);}
			if(bonus.type==subtype){bonusamt+=parseInt(bonus.amount);}
		});
	});
	
	return bonusamt
}

function getequipmentbonuses(rolldeets){
	
	//outfit
	if(charvals.gear.outfit.bonuses){
		charvals.gear.outfit.bonuses.forEach(bns=>{
			
			if(rolldeets.val==normalizename(bns.type)){rolldeets.equipment+=parseInt(bns.amount);}

		});}

	//wand
	if(charvals.gear.wand.bonuses){
		charvals.gear.wand.bonuses.forEach(bns=>{
			
			if(rolldeets.val==normalizename(bns.type)){rolldeets.equipment+=parseInt(bns.amount);}

		});}

	//accessory1
	if(charvals.gear.accessory1.bonuses){
		charvals.gear.accessory1.bonuses.forEach(bns=>{
			
			if(rolldeets.val==normalizename(bns.type)){rolldeets.equipment+=parseInt(bns.amount);}

		});}
	
	//accessory2
	if(charvals.gear.accessory2.bonuses){
		charvals.gear.accessory2.bonuses.forEach(bns=>{
			
			if(rolldeets.val==normalizename(bns.type)){rolldeets.equipment+=parseInt(bns.amount);}

		});}

	//accessory3
	if(charvals.gear.accessory3.bonuses){
		charvals.gear.accessory3.bonuses.forEach(bns=>{
			
			if(rolldeets.val==normalizename(bns.type)){rolldeets.equipment+=parseInt(bns.amount);}

		});}

		return rolldeets;
}

function getrollvals(rolldeets){
	switch(rolldeets.skillname){
		case "Power": rolldeets.abilityval = charvals.power; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Power"; break;
		case "Erudition": rolldeets.abilityval = charvals.erudition; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Erudition";break;
		case "Naturalism": rolldeets.abilityval = charvals.naturalism; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Naturalism";break;
		case "Panache": rolldeets.abilityval = charvals.panache; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Panache";break;
		
		case "Charms": rolldeets.abilityval = charvals.power; rolldeets.skillval = charvals.charms; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Charms"; break;
		case "DarkArts": rolldeets.abilityval = charvals.power; rolldeets.skillval = charvals.darkarts; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Dark Arts"; break;
		case "Defense": rolldeets.abilityval = charvals.power; rolldeets.skillval = charvals.defense; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Defense"; break;
		case "Transfiguration": rolldeets.abilityval = charvals.power; rolldeets.skillval = charvals.transfiguration; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Transfiguration"; break;
		
		case "Runes": rolldeets.abilityval = charvals.erudition; rolldeets.skillval = charvals.runes; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Runes"; break;
		case "Arithmancy": rolldeets.abilityval = charvals.erudition; rolldeets.skillval = charvals.arithmancy; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Arithmancy"; break;
		case "Muggles": rolldeets.abilityval = charvals.erudition; rolldeets.skillval = charvals.muggles; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Muggle Studies"; break;
		case "History": rolldeets.abilityval = charvals.erudition; rolldeets.skillval = charvals.history; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="History"; break;
		
		case "Astronomy": rolldeets.abilityval = charvals.naturalism; rolldeets.skillval = charvals.astronomy; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Astronomy"; break;
		case "Divination": rolldeets.abilityval = charvals.naturalism; rolldeets.skillval = charvals.divination; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Divination"; break;
		case "Creatures": rolldeets.abilityval = charvals.naturalism; rolldeets.skillval = charvals.creatures; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Magical Creatures"; break;
		case "Perception": rolldeets.abilityval = charvals.naturalism; rolldeets.skillval = charvals.perception; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Perception"; break;
		case "Social": rolldeets.abilityval = charvals.naturalism; rolldeets.skillval = charvals.social; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Social Skills"; break;
		
		case "Flying": rolldeets.abilityval = charvals.panache; rolldeets.skillval = charvals.flying; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Flying"; break;
		case "Alchemy": rolldeets.abilityval = charvals.panache; rolldeets.skillval = charvals.alchemy; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Alchemy"; break;
		case "Potions": rolldeets.abilityval = charvals.panache; rolldeets.skillval = charvals.potions; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Potions"; break;
		case "Artificing": rolldeets.abilityval = charvals.panache; rolldeets.skillval = charvals.artificing; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Artificing"; break;
		case "Herbology": rolldeets.abilityval = charvals.panache; rolldeets.skillval = charvals.herbology; rolldeets.dice=randbetween(1,10); rolldeets.type="straight"; rolldeets.val="Herbology"; break;
		
		case "Fortitude": rolldeets.characteristic = getcharacaristicroll(charvals.fortitude); rolldeets.dice=0; rolldeets.type="characteristic"; rolldeets.val="Mental Fortitude"; break;
		case "Willpower": rolldeets.characteristic = getcharacaristicroll(charvals.willpower); rolldeets.dice=0; rolldeets.type="characteristic"; rolldeets.val="Willpower"; break;
		case "Intellect": rolldeets.characteristic = getcharacaristicroll(charvals.intellect); rolldeets.dice=0; rolldeets.type="characteristic"; rolldeets.val="Intellect"; break;
		case "Creativity": rolldeets.characteristic = getcharacaristicroll(charvals.creativity); rolldeets.dice=0; rolldeets.type="characteristic"; rolldeets.val="Creativity"; break;
		case "Equanimity": rolldeets.characteristic = getcharacaristicroll(charvals.equanimity); rolldeets.dice=0; rolldeets.type="characteristic"; rolldeets.val="Equanimity"; break;
		case "Charisma": rolldeets.characteristic = getcharacaristicroll(charvals.charisma); rolldeets.dice=0; rolldeets.type="characteristic"; rolldeets.val="Charisma"; break;
		case "Attractiveness": rolldeets.characteristic = getcharacaristicroll(charvals.attractiveness); rolldeets.dice=0; rolldeets.type="characteristic"; rolldeets.val="Attractiveness"; break;
		case "Strength": rolldeets.characteristic = getcharacaristicroll(charvals.strength); rolldeets.dice=0; rolldeets.type="characteristic"; rolldeets.val="Strength"; break;
		case "Agility": rolldeets.characteristic = getcharacaristicroll(charvals.agility); rolldeets.dice=0; rolldeets.type="characteristic"; rolldeets.val="Agility"; break;
		
		case "Generosity": rolldeets.parental = parseInt(charvals.generosity); rolldeets.dice=randbetween(1,10); rolldeets.type="parental"; rolldeets.val="Parental Generosity"; break;
		case "Permissiveness": rolldeets.parental = parseInt(charvals.permissiveness); rolldeets.dice=randbetween(1,10); rolldeets.type="parental"; rolldeets.val="Parental Permissiveness"; break;
		case "Wealth": rolldeets.parental = parseInt(charvals.wealth); rolldeets.dice=randbetween(1,10); rolldeets.type="parental"; rolldeets.val="Parental Wealth"; break;
	}
	rolldeets.val=normalizename(rolldeets.val); //one final check to make sure the roll deets value is normalized.
	return rolldeets;
}

function getcharacaristicroll(num){
	
	let rollval=0;
	let rolls=[];
	
	for(let i=0;i<num;i++){
		let thisroll=randbetween(1,10);
		rolls.push(`roll ${i+1} is ${thisroll}`);
		rollval+=thisroll;
	}
	console.log(rolls);
	return rollval;
}

function displayroll(rolldeets, rolltext){
	let contentdiv = document.getElementById("masthead");
	let newdiv = document.createElement('div');
	newdiv.id="rolldisplayer";
	newdiv.innerHTML=`${rolltext}
	
-------------------Roll Details-------------------
DICE:        ${rolldeets.dice} 
Ablty:       ${rolldeets.abilityval}
Skill:        ${rolldeets.skillval}
Chrstc:    ${rolldeets.characteristic}
Trait:       ${rolldeets.trait}
Eqpmnt:  ${rolldeets.equipment}
Prntl:       ${rolldeets.parental}
Temp:       ${rolldeets.temp}
Thrsh:       ${rolldeets.threshold}
Type:       ${rolldeets.type}
Value:     ${rolldeets.val}

Note: hit F12 and view the console to examine these values more closely`;

	contentdiv.prepend(newdiv);
	
	setTimeout(() => {contentdiv.removeChild(newdiv);}, 10000); // 10000 milliseconds = 10 seconds
}
//==========
//set vals
//==========
function setcharvalues(){
    charvals={
    name: document.getElementById('name').textContent,
    currentyear: document.getElementById('current_year').textContent,
    hasothernames: document.getElementById('has_other_names').textContent,
    maidenname: document.getElementById('maiden_name').textContent,
    nicknamealias: document.getElementById('nickname_alias').textContent,
    birthyear: document.getElementById('birth_year').textContent,
    birthmonth: document.getElementById('birth_month').textContent,
    birthday: document.getElementById('birth_day').textContent,
    canon: document.getElementById('canon').textContent,
    playercharacter: document.getElementById('player_character').textContent,
    muggle: document.getElementById('muggle').textContent,
    squib: document.getElementById('squib').textContent,
    bloodstatus: document.getElementById('blood_status').textContent,
    biologicalmother: document.getElementById('biological_mother').textContent,
    biologicalfather: document.getElementById('biological_father').textContent,
    generosity: document.getElementById('_generosity').textContent,
    wealth: document.getElementById('_wealth').textContent,
    permissiveness: document.getElementById('_permissiveness').textContent,
    initialabilitybuy1: document.getElementById('initial_ability_buy1').textContent,
    initialabilitybuy2: document.getElementById('initial_ability_buy2').textContent,
    initialskillbuy1: document.getElementById('initial_skill_buy_1').textContent,
    initialskillbuy2: document.getElementById('initial_skill_buy_2').textContent,
    initialskillbuy3: document.getElementById('initial_skill_buy_3').textContent,
    traits: [],
    creativity: parseInt(document.getElementById('_creativity').textContent),
    equanimity: parseInt(document.getElementById('_equanimity').textContent),
    charisma: parseInt(document.getElementById('_charisma').textContent),
    attractiveness: parseInt(document.getElementById('_attractiveness').textContent),
    strength: parseInt(document.getElementById('_strength').textContent),
    agility: parseInt(document.getElementById('_agility').textContent),
    intellect: parseInt(document.getElementById('_intellect').textContent),
    willpower: parseInt(document.getElementById('_willpower').textContent),
    fortitude: parseInt(document.getElementById('_fortitude').textContent),
    school: document.getElementById('school').textContent,
    year1corecourses: document.getElementById('year_1_core_courses').textContent,
    year1abilitybuy: document.getElementById('year_1_ability_buy').textContent,
    year1skillbuy1: document.getElementById('year_1_skill_buy_1').textContent,
    year1skillbuy2: document.getElementById('year_1_skill_buy_2').textContent,
    year1electives: document.getElementById('year_1_electives').textContent,
    year2corecourses: document.getElementById('year_2_core_courses').textContent,
    year2abilitybuy: document.getElementById('year_2_ability_buy').textContent,
    year2skillbuy1: document.getElementById('year_2_skill_buy_1').textContent,
    year2skillbuy2: document.getElementById('year_2_skill_buy_2').textContent,
    year2electives: document.getElementById('year_2_electives').textContent,
    year3corecourses: document.getElementById('year_3_core_courses').textContent,
    year3abilitybuy: document.getElementById('year_3_ability_buy').textContent,
    year3skillbuy1: document.getElementById('year_3_skill_buy_1').textContent,
    year3skillbuy2: document.getElementById('year_3_skill_buy_2').textContent,
    year3electives: document.getElementById('year_3_electives').textContent,
    year4corecourses: document.getElementById('year_4_core_courses').textContent,
    year4abilitybuy: document.getElementById('year_4_ability_buy').textContent,
    year4skillbuy1: document.getElementById('year_4_skill_buy_1').textContent,
    year4skillbuy2: document.getElementById('year_4_skill_buy_2').textContent,
    year4electives: document.getElementById('year_4_electives').textContent,
    year5corecourses: document.getElementById('year_5_core_courses').textContent,
    year5abilitybuy: document.getElementById('year_5_ability_buy').textContent,
    year5skillbuy1: document.getElementById('year_5_skill_buy_1').textContent,
    year5skillbuy2: document.getElementById('year_5_skill_buy_2').textContent,
    year5electives: document.getElementById('year_5_electives').textContent,
    year6corecourses: document.getElementById('year_6_core_courses').textContent,
    year6abilitybuy: document.getElementById('year_6_ability_buy').textContent,
    year6skillbuy1: document.getElementById('year_6_skill_buy_1').textContent,
    year6skillbuy2: document.getElementById('year_6_skill_buy_2').textContent,
    year6electives: document.getElementById('year_6_electives').textContent,
    year7corecourses: document.getElementById('year_7_core_courses').textContent,
    year7abilitybuy: document.getElementById('year_7_ability_buy').textContent,
    year7skillbuy1: document.getElementById('year_7_skill_buy_1').textContent,
    year7skillbuy2: document.getElementById('year_7_skill_buy_2').textContent,
    year7electives: document.getElementById('year_7_electives').textContent,
    eminencebuys: document.getElementById('eminencebuys').textContent,
    notes: document.getElementById('notes').textContent,
	power: 0,
	erudition: 0,
	naturalism: 0,
	panache: 0,
	charms: 0,
	darkarts: 0,
	defense: 0,
	transfiguration: 0,
	runes: 0,
	arithmancy: 0,
	muggles: 0,
	history: 0,
	astronomy: 0,
	divination: 0,
	creatures: 0,
	perception: 0,
	social: 0,
	flying: 0,
	alchemy: 0,
	potions: 0,
	artificing: 0,
	herbology: 0,
	books: [],
	spells: [],
	proficiencies: [],
	standardpotions: [],
	alchemicalpotions: [],
	gear: setgear(),
	pets: setpets(),
	inventory: setinventory(),
	relationships: setrelationships()
	}
	
	charvals.books = setbooks();
	charvals.spells = setspells(); //must be done after the fact because the setspells function depends on books;
	charvals.proficiencies = setproficiencies();//must be done after the fact because the setproficiencies function depends on books;
	charvals.standardpotions=setpotions();
	charvals.alchemicalpotions=setalchemical();
	
	parsetraits();
	
	if(charvals.bloodstatus=="Muggleborn"||charvals.bloodstatus=="Muggle-Raised Halfblood"){
		charvals.muggles=charvals.muggles+11;
	}
	
	document.getElementsByClassName("entry-title")[0].textContent=charvals.name;
}

function setspells(){
	let spellsection=document.getElementById("spells");
	let favspells=[];

	if (spellsection && spellsection.children.length > 0) {
		favspells=Array.from(spellsection.children).map(child => ({
			name: child.children[1].textContent,
			fav: child.children[0].textContent
		}));
	}
	
	let spellsfrombooks = charvals.books.reduce((accumulator, book) => {
    if (book.spells && Array.isArray(book.spells)) {
        let bookSpellsAsObjects = book.spells.map(spellName => ({
            name: spellName,
            fav: "No"
        }));
        return accumulator.concat(bookSpellsAsObjects);
    }
    return accumulator;
	}, []);
	
	// Add spells from spellsfrombooks first
	let spellsmap = new Map();
	spellsfrombooks.forEach(spell => {
		if (!spellsmap.has(spell.name)) {
			spellsmap.set(spell.name, spell);
		}
	});
	
	// Then add or overwrite with spells from favspells
	favspells.forEach(spell => {
    let existingSpell = spellsmap.get(spell.name);
    if (existingSpell) {
        // Merge 'fav' flag while keeping existing spell details
        spellsmap.set(spell.name, { ...existingSpell, fav: spell.fav });
    } else {
        // Add new spell from favspells
        spellsmap.set(spell.name, spell);
    }
	});
	
	// Convert the Map values to an array
	let spellsarray = Array.from(spellsmap.values());
	let myspells = [];

	spellsarray.forEach(spell => {
		
		let record = spells.find(x=>x.name==spell.name);
		
		let thisspell;
		
		if (record) {
			thisspell = {
				id: record.id,
				name: spell.name,
				description: record.description || "",
				incantation: record.incantation || "",
				skill: record.skill || "",
				subtype: record.subtype || "",
				threshold: record.threshold || 0,
				fav: spell.fav || "No"
			};
		} else {
			thisspell = {
				id: -1,
				name: spell.name,
				description: "Error: Unable to find this spell. Check the database record or try reassigning the spell from your character sheet",
				incantation: "",
				skill: "",
				subtype: "",
				threshold: 0,
				fav: ""
			};
		}

		myspells.push(thisspell);
	});

	return myspells;
}

function setproficiencies(){
	
	let proficienciesection=document.getElementById("proficiencies");
	let favproficiencies=[];
	
	if (proficienciesection && proficienciesection.children.length > 0) {
		favproficiencies=Array.from(proficienciesection.children).map(child => ({
			name: child.children[1].textContent,
			fav: child.children[0].textContent
		}));
	}
	
	let proficienciesfrombooks = charvals.books.reduce((accumulator, book) => {
    if (book.proficiencies && Array.isArray(book.proficiencies)) {
        let bookproficienciesAsObjects = book.proficiencies.map(proficiencyName => ({
            name: proficiencyName,
            fav: "No"
        }));
        return accumulator.concat(bookproficienciesAsObjects);
    }
    return accumulator;
	}, []);
	
	// Add proficiencies from proficienciesfrombooks first
	let proficienciesmap = new Map();
	proficienciesfrombooks.forEach(proficiency => {
		if (!proficienciesmap.has(proficiency.name)) {
			proficienciesmap.set(proficiency.name, proficiency);
		}
	});
	
	// Then add or overwrite with proficiencies from favproficiencies
	favproficiencies.forEach(proficiency => {
    let existingproficiency = proficienciesmap.get(proficiency.name);
    if (existingproficiency) {
        // Merge 'fav' flag while keeping existing proficiency details
        proficienciesmap.set(proficiency.name, { ...existingproficiency, fav: proficiency.fav });
    } else {
        // Add new proficiency from favproficiencies
        proficienciesmap.set(proficiency.name, proficiency);
    }
	});
	
	// Convert the Map values to an array
	let proficienciesarray = Array.from(proficienciesmap.values());
	let myproficiencies = [];

	proficienciesarray.forEach(proficiency => {
		
		let record = proficiencies.find(x=>x.name==proficiency.name);
		
		let thisproficiency;
		
		if (record) {
			thisproficiency = {
				id: record.id,
				name: proficiency.name,
				description: record.description || "",
				incantation: record.incantation || "",
				skill: record.skill || "",
				subtype: record.subtype || "",
				threshold: record.threshold || 0,
				fav: proficiency.fav || "No"
			};
		} else {
			thisproficiency = {
				id: -1,
				name: proficiency.name,
				description: "Error: Unable to find this proficiency. Check the database record or try reassigning the proficiency from your character sheet",
				incantation: "",
				skill: "",
				subtype: "",
				threshold: 0,
				fav: ""
			};
		}

		myproficiencies.push(thisproficiency);
	});

	return myproficiencies;
}


function setskillpoints(){

	//initial skill buys
	addpoint(normalizename(charvals.initialskillbuy1));
	addpoint(normalizename(charvals.initialskillbuy2));
	addpoint(normalizename(charvals.initialskillbuy3));
	
	//annual skill buys
	addpoint(normalizename(charvals.year1skillbuy1));
	addpoint(normalizename(charvals.year1skillbuy2));
	addpoint(normalizename(charvals.year2skillbuy1));
	addpoint(normalizename(charvals.year2skillbuy2));
	addpoint(normalizename(charvals.year3skillbuy1));
	addpoint(normalizename(charvals.year3skillbuy2));
	addpoint(normalizename(charvals.year4skillbuy1));
	addpoint(normalizename(charvals.year4skillbuy2));
	addpoint(normalizename(charvals.year5skillbuy1));
	addpoint(normalizename(charvals.year5skillbuy2));
	addpoint(normalizename(charvals.year6skillbuy1));
	addpoint(normalizename(charvals.year6skillbuy2));
	addpoint(normalizename(charvals.year7skillbuy1));
	addpoint(normalizename(charvals.year7skillbuy2));
	
	//core courses
	let corelist = [
    ...convertskilllisttoarray(charvals.year1corecourses),
    ...convertskilllisttoarray(charvals.year2corecourses),
    ...convertskilllisttoarray(charvals.year3corecourses),
    ...convertskilllisttoarray(charvals.year4corecourses),
    ...convertskilllisttoarray(charvals.year5corecourses),
    ...convertskilllisttoarray(charvals.year6corecourses),
    ...convertskilllisttoarray(charvals.year7corecourses)
	];
	
	for(let i=0;i<corelist.length;i++){
		addpoint(normalizename(corelist[i]));
	}

	//electivelist
	let electivelist = [
    ...convertskilllisttoarray(charvals.year1electives),
    ...convertskilllisttoarray(charvals.year2electives),
    ...convertskilllisttoarray(charvals.year3electives),
    ...convertskilllisttoarray(charvals.year4electives),
    ...convertskilllisttoarray(charvals.year5electives),
    ...convertskilllisttoarray(charvals.year6electives),
    ...convertskilllisttoarray(charvals.year7electives)
	];
	
	for(let i=0;i<electivelist.length;i++){
		addpoint(normalizename(electivelist[i]));
	}
	
	let eminencebuys = convertskilllisttoarray(charvals.eminencebuys);
	
	//eminence
	for(let i=0;i<eminencebuys.length;i++){
		addpoint(normalizename(eminencebuys[i]));
	}
	
	
	
}

function setabilitypoints(){

	addpoint(charvals.initialabilitybuy1);
	addpoint(charvals.initialabilitybuy2);
	addpoint(charvals.year1abilitybuy);
	addpoint(charvals.year2abilitybuy);
	addpoint(charvals.year3abilitybuy);
	addpoint(charvals.year4abilitybuy);
	addpoint(charvals.year5abilitybuy);
	addpoint(charvals.year6abilitybuy);
	addpoint(charvals.year7abilitybuy);

}

function setgear(){
	let outfit = document.getElementById("outfit").textContent;
	let wand = document.getElementById("wand").textContent;
	let accessory1 = document.getElementById("accessory1").textContent;
	let accessory2 = document.getElementById("accessory2").textContent;
	let accessory3 = document.getElementById("accessory3").textContent;
	
	let gear = {
		outfit: {},
		wand: {},
		accessory1: {},
		accessory2: {},
		accessory3: {}
	}
	
	//find and assign
	gear.outfit=outfits.find(entry=>outfit ==entry.name) || {};
	gear.wand=wands.find(entry=>wand==entry.name) || {};
	gear.accessory1=accessories.find(entry=>accessory1==entry.name) || {};
	gear.accessory2=accessories.find(entry=>accessory2==entry.name) || {};
	gear.accessory3=accessories.find(entry=>accessory3==entry.name) || {};

	return gear;
	
}

function addpoint(field){

	if(field!="" && field !=null){
		switch(field){
			case "Power": charvals.power++; break;
			case "Erudition": charvals.erudition++; break;
			case "Naturalism": charvals.naturalism++; break;
			case "Panache": charvals.panache++; break;
			
			case "Charms": charvals.charms++; break;
			case "DarkArts": charvals.darkarts++; break;
			case "Defense": charvals.defense++; break;
			case "Transfiguration": charvals.transfiguration++; break;
			case "Astronomy": charvals.astronomy++; break;
			case "Divination": charvals.divination++; break;
			case "Creatures": charvals.creatures++; break;
			case "Perception": charvals.perception++; break;
			case "Social": charvals.social++; break;
			case "Runes": charvals.runes++; break;
			case "Arithmancy": charvals.arithmancy++; break;
			case "Muggles": charvals.muggles++; break;
			case "History": charvals.history++; break;
			case "Flying": charvals.flying++; break;
			case "Alchemy": charvals.alchemy++; break;
			case "Potions": charvals.potions++; break;
			case "Artificing": charvals.artificing++; break;
			case "Herbology": charvals.herbology++; break;
		}
	}
}

function settraits() {
    if (charvals.traits.length > 0) {
        let traitsection = document.getElementById("traitsection");
        traitsection.textContent = "";
        
        charvals.traits.forEach(trait => {
			if(trait){
            let newdiv = document.createElement("div");
            newdiv.textContent = trait.name;
            
            let titletxt = `${trait.name}`;
            trait.bonuses.forEach(bonus => { 
                titletxt += `
${bonus.type} (${bonus.amount})`; 
            });
            newdiv.title = titletxt;
            newdiv.className = "trait";
            traitsection.appendChild(newdiv);
			}
        });
    }
}

function setbooks(){

	let readbooks = document.getElementsByClassName("readbook");
	let books=[];
	
	readbooks.forEach(book=>{
		let record = findbookrecord(book);
		
		if(record){
			books.push(record);
		}
	});
	
	return books;
	
}
function setpotions(){
	let standardpotionssection = document.getElementById("standardpotions");
	let nonbookpotions=[];
	
	if (standardpotionssection && standardpotionssection.children.length > 0) {
	nonbookpotions=Array.from(standardpotionssection.children).map(child => ({
			name: child.children[1].textContent,
			fav: child.children[0].textContent
		}));	
	}
		
	let potionsfrombooks=charvals.books.reduce((accumulator, book)=>{
		
		if(book.potion &&Array.isArray(book.potion)){
			let bookpotionsasobjects=book.potion.map(potname=>({
				name: potname,
				fav: "No"
			}));
			return accumulator.concat(bookpotionsasobjects);
		}
		return accumulator
	},[]);
	
	let potmap = new Map();
	potionsfrombooks.forEach(pot=> {
		if (!potmap.has(pot.name)) {
			potmap.set(pot.name, pot);
		}
	});
	
	nonbookpotions.forEach(pot => {
    let existingpot = potmap.get(pot.name);
    if (existingpot) {
        // Merge 'fav' flag while keeping existing spell details
        potmap.set(pot.name, { ...existingpot, fav: pot.fav });
    } else {
        // Add new spell from favspells
        potmap.set(pot.name, pot);
    }
	});
	
	// Convert the Map values to an array
	let potarray = Array.from(potmap.values());
	let mypots = [];
	
	potarray.forEach(pot => {
		
		let record = standardpotions.find(x=>x.name==pot.name);
		
		let thispot;
		
		if (record) {
			thispot = {
				id: record.id,
				name: pot.name,
				inventor: record.inventor || "",
				brewtime: record.brewtime || "",
				raweffect: record.raweffect|| "",
				threshold: record.threshold || 0,
				fav: pot.fav || "No"
			};
		} else {
			thispot = {
				id: -1,
				name: pot.name,
				raweffect: "Error: Unable to find this potion. Check the database record or try reassigning the spell from your character sheet",
				inventor: "",
				brewtime: "",
				threshold: 0,
				fav: ""
			};
		}	
		
		mypots.push(thispot);
		});
		
		return mypots;
}


function setalchemical(){
	let alchemicalpotionssection = document.getElementById("alchemicalpotions");
	let nonbookpotions=[];
	
	if (alchemicalpotionssection && alchemicalpotionssection.children.length > 0) {
	nonbookpotions=Array.from(alchemicalpotionssection.children).map(child => ({
			name: child.children[1].textContent,
			fav: child.children[0].textContent
		}));	
	}
		
	let potionsfrombooks=charvals.books.reduce((accumulator, book)=>{
		
		if(book.bookalchemical &&Array.isArray(book.bookalchemical)){
			let bookpotionsasobjects=book.potion.map(potname=>({
				name: potname,
				fav: "No"
			}));
			return accumulator.concat(bookpotionsasobjects);
		}
		return accumulator
	},[]);
	
	let potmap = new Map();
	potionsfrombooks.forEach(pot=> {
		if (!potmap.has(pot.name)) {
			potmap.set(pot.name, pot);
		}
	});
	
	nonbookpotions.forEach(pot => {
    let existingpot = potmap.get(pot.name);
    if (existingpot) {
        // Merge 'fav' flag while keeping existing spell details
        potmap.set(pot.name, { ...existingpot, fav: pot.fav });
    } else {
        // Add new spell from favspells
        potmap.set(pot.name, pot);
    }
	});
	
	// Convert the Map values to an array
	let potarray = Array.from(potmap.values());
	let mypots = [];
	
	potarray.forEach(pot => {
		
		let record = alchemicalpotions.find(x=>x.name==pot.name);
		
		let thispot;
		
		if (record) {
			thispot = {
				id: record.id,
				name: pot.name,
				inventor: record.inventor || "",
				brewtime: record.brewtime || "",
				raweffect: record.raweffect|| "",
				threshold: record.threshold || 0,
				fav: pot.fav || "No"
			};
		} else {
			thispot = {
				id: -1,
				name: pot.name,
				raweffect: "Error: Unable to find thisalchemical potion. Check the database record or try reassigning the spell from your character sheet",
				inventor: "",
				brewtime: "",
				threshold: 0,
				fav: ""
			};
		}	
		
		mypots.push(thispot);
		});
		
		return mypots || [];
}
function setpets(){
	let allpets=Array.from(document.getElementById("allpets").children).map(child => child.textContent);
	let mypets=[];
	
	allpets.forEach(pet=>{
		let record=namedcreatures.find(x=>x.name==pet);
		let thispet={
			id: record.id,
			name: record.name,
			species: record.species,
			size: record.size,
			heavywoundcap: record.heavywoundcap,
			resistance: record.resistance,
			beastintel: record.beastintel,
			humanintel: record.humanintel,
			humansocial: record.humansocial,
			ground: record.ground,
			water: record.water,
			air: record.air
		}
		mypets.push(thispet);
	});
	
	return mypets;
}
function setinventory(){
	let inventory=Array.from(document.getElementById("inventoryitems").children).map(child => child.textContent);
	let inventoryitems=[];
	
	inventory.forEach(itm=>{
		let itemrecord=items.find(x=>x.name==itm);
		let record;
		
		switch(itemrecord.type){
		case "Alchemy":
			record = alchemicalpotions.find(x=>x.name==itemrecord.name) || {name: itemrecord.name, type: itemrecord.type, error: "item not found"};
			record.type="Alchemy";
			inventoryitems.push(record);
		break;
		case "Creature":
			record = creatures.find(x=>x.name==itemrecord.name) || {name: itemrecord.name, type: itemrecord.type, error: "item not found"};
			record.type="Creature";
			inventoryitems.push(record);
		break;
		case "Food/Drink":
			record=fooddrink.find(x=>x.name==itemrecord.name) || {name: itemrecord.name, type: itemrecord.type, error: "item not found"};
			record.type="Food/Drink";
			inventoryitems.push(record);
		break;
		case "General":
			record=generalitems.find(x=>x.name==itemrecord.name) || {name: itemrecord.name, type: itemrecord.type, error: "item not found"};
			record.type="General";
			inventoryitems.push(record);
		break;
		case "Plant":
			record=plants.find(x=>x.name==itemrecord.name) || {name: itemrecord.name, type: itemrecord.type, error: "item not found"};
			record.type="Plant";
			inventoryitems.push(record);
		break;
		case "Plant Part":
			record=plantparts.find(x=>x.name==itemrecord.name) || {name: itemrecord.name, type: itemrecord.type, error: "item not found"};
			record.type="Plant Part";
			inventoryitems.push(record);
		break;
		case "Preparation":
			record=preparations.find(x=>x.name==itemrecord.name) || {name: itemrecord.name, type: itemrecord.type, error: "item not found"};
			record.type="Preparation";
			inventoryitems.push(record);
		break;
		case "Creature Part":
			record=creatureparts.find(x=>x.name==itemrecord.name) || {name: itemrecord.name, type: itemrecord.type, error: "item not found"};
			record.type="Creature Part";
			inventoryitems.push(record);
		break;
		}
	});
	
	return inventoryitems;
}
function setrelationships(){
let relationshipsection = document.getElementById("relationships");
let relationships = [];

if (relationshipsection && relationshipsection.children.length > 0) {
    relationships = Array.from(relationshipsection.children)
                         .reduce((acc, child, index, children) => {
                             if (index % 2 === 0) { // Check if the index is even, indicating a person's name
                                 let person = child.innerText;
                                 let notes = "";
                                 
                                 if (index + 1 < children.length) { // Check for the next sibling for notes
                                     notes = children[index + 1].innerText;
                                 }
                                 
                                 acc.push({ person, notes });
                             }
                             return acc;
                         }, []);
}

return relationships;
}
//==========
//Utility
//==========
function getproficiencydeets(proficiencyname, favorite){
		for(let i=0;i<proficiencies.length;i++){
		if(proficiencies[i].name==proficiencyname){
			proficiency={
				favorite: favorite,
				name: proficiencyname,
				description: proficiencies[i].description,
				skill: proficiencies[i].skill,
				threshold: proficiencies[i].threshold
			}
			return proficiency;
		}
	}
	return null;
}

function parsetraits(){
	
	let traitarray = document.getElementById("traits").textContent.split(', ');
	
	traitarray.forEach(trait=>{
		charvals.traits.push(traits.find(x=>x.name==trait));
	});
}

function normalizename(name){
	switch(name){
		case "Dark Arts": return "DarkArts";
		case "Dark arts": return "DarkArts";
		case "Darkarts": return "DarkArts";
		case "darkarts": return "DarkArts";
		case "Ancient Runes": return "Runes";
		case "AncientRunes": return "Runes";
		case "Ancientrunes": return "Runes";
		case "Ancient runes": return "Runes";
		case "ancientrunes": return "Runes";
		case "runes": return "Runes";
		case "Transfig": return "Transfiguration";
		case "Transfiguratino": return "Transfiguration";
		case "transfiguration": return "Transfiguration";
		case "charms": return "Charms";
		case "Defense Against the Dark Arts": return "Defense";
		case "Defense against the Dark Arts": return "Defense";
		case "Defense Against the dark arts": return "Defense";
		case "Defense Against the Dark arts": return "Defense";
		case "Defense against the Dark arts": return "Defense";
		case "Defense Against the Dark Arts": return "Defense";
		case "defense": return "Defense";
		case "Defensive Magic": return "Defense";
		case "astronomy": return "Astronomy";
		case "divination": return "Divination";
		case "creatures": return "Creatures";
		case "Magical Creatures": return "Creatures";
		case "Magical creatures": return "Creatures";
		case "perception": return "Perception";
		case "perceptino": return "Perception";
		case "Social Skills": return "Social";
		case "Social skills": return "Social";
		case "Socialskills": return "Social";
		case "socialskills": return "Social";
		case "social skills": return "Social";
		case "social": return "Social";
		case "arithmancy": return "Arithmancy";
		case "muggles": return "Muggles";
		case "Muggle Studies": return "Muggles";
		case "Muggle studies": return "Muggles";
		case "muggle studies": return "Muggles";
		case "mugglestudies": return "Muggles";
		case "MuggleStudies": return "Muggles";
		case "history": return "History";
		case "History of magic": return "History";
		case "History of Magic": return "History";
		case "flying": return "Flying";
		case "alchemy": return "Alchemy";
		case "potions": return "Potions";
		case "artificing": return "Artificing";
		case "herbology": return "Herbology";
		
		case "power": return "Power";
		case "erudition": return "Erudition";
		case "naturalism": return "Naturalism";
		case "panache": return "Panache";
		
		case "Mental Fortitude": return "Fortitude";
		case "fortitude": return "Fortitude";
		case "willpower": return "Willpower";
		case "intellect": return "Intellect";
		case "creativity": return "Creativity";
		case "equanimity": return "Equanimity";
		case "charisma": return "Charisma";
		case "attractiveness": return "Attractiveness";
		case "strength": return "Strength";
		case "agility": return "Agility";
		
		case "generosity": return "Generosity";
		case "Generocity": return "Generosity";
		case "permissiveness": return "Permissiveness";
		case "wealth": return "Wealth";
		
		default: return name;
	}
}

function getrolltypetext(rolldeets){

	switch(rolldeets.type){
		case "straight": return `attempts to roll a straight ${rolldeets.val} roll`;
		case "spell": return `attempts to cast ${rolldeets.val}`;
		case "proficiency": return `attempts to perform the ${rolldeets.val} proficiency`;
		case "characteristic": return `rolls a ${rolldeets.val} roll`;
		case "parental": return `rolls a ${rolldeets.val} roll`;
		case "potion": return `attempts to brew a standard potion`;
		case "alchemy": return `attempts to brew an alchemical potion`;
		default: return `rolls a ${rolldeets.val} roll`;
	}
}
function getrollthreshtext(rolldeets){
	if(rolldeets.threshold){return `(needs a total of ${rolldeets.threshold} or higher)`} else{return "";}
}
function getrollresulttext(rolldeets){
    
    let resulttext = "";
    let total = getrolltotal(rolldeets);
    
    if (rolldeets.threshold) {
        if (rolldeets.dice == 1) {
            resulttext = `CRITICAL FAILURE!!! (Total roll value: ${total})`;
        }
		else if (rolldeets.dice == 10 && total < rolldeets.threshold) {
            resulttext = `Critical success roll! However, total is less than threshold. (Total roll value: ${total})`;
        }
        else if (rolldeets.dice == 10 && total >= rolldeets.threshold) {
            resulttext = `CRITICAL SUCCESS!!! (Total roll value: ${total})`;
        }
        else if (rolldeets.dice > 1 && rolldeets.dice < 10 && total >= rolldeets.threshold) {
            resulttext = `Success! (Total roll value: ${total})`;
        }
        else if (rolldeets.dice > 1 && rolldeets.dice < 10 && total < rolldeets.threshold) {
            resulttext = `Failed! (Total roll value: ${total})`;
        }
    } else {
        if (rolldeets.dice == 1) {
            resulttext = `CRITICAL FAILURE!!! (Total roll value: ${total})`;
        }
        else if (rolldeets.dice == 10) {
            resulttext = `CRITICAL SUCCESS!!! (Total roll value: ${total})`;
        }
        else {
            resulttext = `Total roll value: ${total}`;
        }
    }
    
    return resulttext;
}

function getrolltotal(rolldeets){
	return rolldeets.abilityval+rolldeets.characteristic+rolldeets.dice+rolldeets.equipment+rolldeets.parental+rolldeets.skillval+rolldeets.temp+rolldeets.trait;
}
function convertskilllisttoarray(list){
	return list.split(', ');
}



function getuncategorizedbooks(bookrecords){

	let uncatbooks = [];
	
	bookrecords.forEach(record=>{
		if(record.categories.length==0){
			uncatbooks.push(record);
		}
	});
	
	return uncatbooks;
}

function getuniquebookcategories(bookrecords){
	let cats = [];
	
	bookrecords.forEach(bookrecord=>{
			bookrecord.categories.forEach(selectedcat=>{
				if (!cats.includes(selectedcat)) {
                cats.push(selectedcat);
            }
			});
        });
    return cats
}

function findbookrecord(book) {

    const normalizeApostrophe = text => text.replace(/’/g, "'");

    let normalizedBookTextContent = normalizeApostrophe(book.textContent);
    return books.find(x => normalizeApostrophe(x.name) === normalizedBookTextContent);
}

function collapse(elem) { //misnomer. It actually just toggles
    if (elem.style.display == "none") {
        elem.style.display = "block";
    } else {
        elem.style.display = "none";
    }
}

function collapseall(className) { 

    let elems = document.getElementsByClassName(className);
    Array.from(elems).forEach(elem => {
        collapse(elem);
    });
}
function togglespellproflistings(){
	let btn = document.getElementById("collapseallbtn");
	
	if(btn.textContent=="collapse all"){
		document.getElementById('gearsection').style.display="none";
		document.getElementById('allreadbooks').style.display="none";
		document.getElementById("allknownspells").style.display="none";
		document.getElementById("allknownprofs").style.display="none";
		document.getElementById("allknownpots").style.display="none";
		document.getElementById("petsection").style.display="none";
		document.getElementById("inventorysection").style.display="none";
		btn.textContent="expand all";
	}else{
		document.getElementById('gearsection').style.display="block";
		document.getElementById('allreadbooks').style.display="block";
		document.getElementById("allknownspells").style.display="block";
		document.getElementById("allknownprofs").style.display="block";
		document.getElementById("allknownpots").style.display="block";
		document.getElementById("petsection").style.display="block";
		document.getElementById("inventorysection").style.display="block";
		btn.textContent="collapse all";
	}
}

function reallycollapseall(className){
	 let elems = document.getElementsByClassName(className);
	 Array.from(elems).forEach(elem => {
        elem.style.display="none";
    });
}

function reallyexpandall(){
	let elems = document.getElementsByClassName(className);
	 Array.from(elems).forEach(elem => {
        elem.style.display="block";
    });
}
function btnclicked(id){
	
	let charsheet = document.getElementById("charsheetsection"); 
	let equip = document.getElementById("equipmentsection");
	let relationship = document.getElementById("relationshipsection");
	
	charsheet.style="display:none";
	equip.style="display:none";
	relationship.style="display:none";
	
	switch(id){
		case "charactersheetbtn":
			charsheet.style="display:block";
		break;
		case "equipmentbtn":
			equip.style="display:block";
		break;
		case "relationshipsbtn":
			relationship.style="display:block";
		break;
	}
}

function setheader(){

let entrytitle = document.getElementsByClassName("entry-title")[0];
let imgelem = document.getElementById("charimg");
let parentelem=document.getElementById("headerbtns").parentNode;

if(imgelem){

entrytitle.textContent="";

let newdiv=document.createElement('div');
newdiv.id="headerdiv";
newdiv.appendChild(imgelem);
let txtdiv=document.createElement('div');
txtdiv.id="headertextdiv";
txtdiv.textContent=charvals.name;
newdiv.appendChild(txtdiv);
parentelem.prepend(newdiv);

}

};
//==========
//interface
//==========
function assignbtntxt(){
	document.getElementById("power").textContent = `Power ${charvals.power}`;
	document.getElementById("erudition").textContent = `Erudition ${charvals.erudition}`;
	document.getElementById("naturalism").textContent = `Naturalism ${charvals.naturalism}`;
	document.getElementById("panache").textContent = `Panache ${charvals.panache}`;
	
	document.getElementById("charms").textContent = `Charms ${charvals.charms}`;
	document.getElementById("darkarts").textContent = `Dark Arts ${charvals.darkarts}`;
	document.getElementById("defense").textContent = `Defense ${charvals.defense}`;
	document.getElementById("transfiguration").textContent = `Transfiguration ${charvals.transfiguration}`;
	document.getElementById("astronomy").textContent = `Astronomy ${charvals.astronomy}`;
	document.getElementById("divination").textContent = `Divination ${charvals.divination}`;
	document.getElementById("creatures").textContent = `Creatures ${charvals.creatures}`;
	document.getElementById("perception").textContent = `Perception ${charvals.perception}`;
	document.getElementById("social").textContent = `Social Skills ${charvals.social}`;
	document.getElementById("runes").textContent = `Runes ${charvals.runes}`;
	document.getElementById("arithmancy").textContent = `Arithmancy ${charvals.arithmancy}`;
	document.getElementById("muggles").textContent = `Muggles ${charvals.muggles}`;
	document.getElementById("history").textContent = `History ${charvals.history}`;
	document.getElementById("flying").textContent = `Flying ${charvals.flying}`;
	document.getElementById("alchemy").textContent = `Alchemy ${charvals.alchemy}`;
	document.getElementById("potions").textContent = `Potions ${charvals.potions}`;
	document.getElementById("artificing").textContent = `Artificing ${charvals.artificing}`;
	document.getElementById("herbology").textContent = `Herbology ${charvals.herbology}`;
	
	document.getElementById("fortitude").textContent = `Mental Fortitude ${charvals.fortitude}`;
	document.getElementById("willpower").textContent = `Willpower ${charvals.willpower}`;
	document.getElementById("intellect").textContent = `Intellect ${charvals.intellect}`;
	document.getElementById("creativity").textContent = `Creativity ${charvals.creativity}`;
	document.getElementById("equanimity").textContent = `Equanimity ${charvals.equanimity}`;
	document.getElementById("charisma").textContent = `Charisma ${charvals.charisma}`;
	document.getElementById("attractiveness").textContent = `Attractiveness ${charvals.attractiveness}`;
	document.getElementById("strength").textContent = `Strength ${charvals.strength}`;
	document.getElementById("agility").textContent = `Agility ${charvals.agility}`;
	
	document.getElementById("generosity").textContent = `Generosity ${charvals.generosity}`;
	document.getElementById("permissiveness").textContent = `Permissiveness ${charvals.permissiveness}`;
	document.getElementById("wealth").textContent = `Wealth ${charvals.wealth}`;
}


function assignfavspells(){
	
	let spellsection=document.getElementById("spellssection");

	charvals.spells.forEach(spell=>{
	
	if(spell.fav==='Yes'){
		let btn = document.createElement('button');
		btn.dataset.spellName = spell.name ;
		btn.innerHTML = `${spell.name} (${spell.threshold}) <br>`;
		btn.className = "spellprof";
		btn.setAttribute("onclick", "spellroll(this.dataset.spellName);");
		btn.title=`${spell.name} (${spell.skill}: ${spell.subtype})
Description: ${spell.description}`;
		spellsection.appendChild(btn);
	}
	
	});
}

function assignfavproficiencies(){
	
	let proficienciesection=document.getElementById("proficienciessection");

	charvals.proficiencies.forEach(proficiency=>{
	
	if(proficiency.fav==='Yes'){
		let btn = document.createElement('button');
		btn.dataset.proficiencyName = proficiency.name ;
		btn.innerHTML = `${proficiency.name} (${proficiency.threshold}) <br>`;
		btn.className = "spellprof";
		btn.setAttribute("onclick", "proficiencyroll(this.dataset.proficiencyName);");
		btn.title=`${proficiency.name} (${proficiency.skill}: ${proficiency.subtype})
Description: ${proficiency.description}`;
		proficienciesection.appendChild(btn);
	}
	
	});
}

function assigngear(){
	
	let gearsection = document.getElementById("gearsection");
	
	// Creating div elements for each variable
	let outfitdiv = document.createElement('div');
	outfitdiv.textContent = `Equiped Outfit: ${charvals.gear.outfit.name}`;
	outfitdiv.className = "equipment";
	
let outfittitletxt = `${charvals.gear.outfit.name} 
Description: ${charvals.gear.outfit.description}`;

if (charvals.gear.outfit.bonuses) {
    charvals.gear.outfit.bonuses.forEach(entry => {
        outfittitletxt += `
Bonus: ${entry.type} (${entry.amount})`;
    });
}
	
	let wanddiv = document.createElement('div');
	wanddiv.textContent = `Equiped Wand: ${charvals.gear.wand.name}`;;
	wanddiv.className = "equipment";
	
let wandtitletxt = `${charvals.gear.wand.name}
Description: ${charvals.gear.outfit.description}`;

	if(charvals.gear.wand.bonuses){
	charvals.gear.wand.bonuses.forEach(entry=>{
		wandtitletxt+=`
${entry.source} Bonus: ${entry.type} (${entry.amount})`;

});
	
	}
	
// Accessory 1
let accessory1div = document.createElement('div');
accessory1div.textContent = `Equipped Accessory: ${charvals.gear.accessory1.name}`;
accessory1div.className = "equipment";

let accessory1titletxt = `${charvals.gear.accessory1.name}
Description: ${charvals.gear.accessory1.description}`;

if (charvals.gear.accessory1.bonuses) {
    charvals.gear.accessory1.bonuses.forEach(entry => {
        accessory1titletxt += `
Bonuses: ${entry.type} (${entry.amount})`;
    });
}

// Accessory 2
let accessory2div = document.createElement('div');
accessory2div.textContent = `Equipped Accessory: ${charvals.gear.accessory2.name}`;
accessory2div.className = "equipment";

let accessory2titletxt = `${charvals.gear.accessory2.name}
Description: ${charvals.gear.accessory2.description}`;

if (charvals.gear.accessory2.bonuses) {
    charvals.gear.accessory2.bonuses.forEach(entry => {
        accessory2titletxt += `
Bonuses: ${entry.type} (${entry.amount})`;
    });
}

// Accessory 3
let accessory3div = document.createElement('div');
accessory3div.textContent = `Equipped Accessory: ${charvals.gear.accessory3.name}`;
accessory3div.className = "equipment";

let accessory3titletxt = `${charvals.gear.accessory3.name}
Description: ${charvals.gear.accessory3.description}`;

if (charvals.gear.accessory3.bonuses) {
    charvals.gear.accessory3.bonuses.forEach(entry => {
        accessory3titletxt += `
Bonuses: ${entry.type} (${entry.amount})`;
    });
}

	outfitdiv.title=outfittitletxt;
	wanddiv.title=wandtitletxt;
	accessory1div.title=accessory1titletxt;
	accessory2div.title=accessory2titletxt;
	accessory3div.title=accessory3titletxt;
	
	gearsection.appendChild(outfitdiv);
	gearsection.appendChild(wanddiv);
	gearsection.appendChild(accessory1div);
	gearsection.appendChild(accessory2div);
	gearsection.appendChild(accessory3div);
	
}
function assignreadbooks(){

	let allreadbooks = document.getElementById("allreadbooks"); //display of books
	let readbooksstorage = document.getElementsByClassName("readbook"); //storage of read books
	
	let bookrecords=[];
	let errorbooks=[];
	
	//get book records; if no record found, put in error books list
	readbooksstorage.forEach(readbook=>{
		let bookrecord = findbookrecord(readbook);
		if(bookrecord){bookrecords.push(bookrecord);}else{errorbooks.push(readbook.textContent)}
	});
	
	//get all uncategorized books
	let uncategorized=getuncategorizedbooks(bookrecords);
	
	assigncategorizedbooks(bookrecords, allreadbooks);
	assignuncategorizedbooks(uncategorized, allreadbooks);
	assignerrorbooks(errorbooks, allreadbooks);
	
}

function assigncategorizedbooks(records, allreadbooks) {
    // Get all unique categories
    let categories = getuniquebookcategories(records) || [];

    categories.forEach(cat => {
		let newbookcatdiv = document.createElement('div');
        newbookcatdiv.className = "bookcat";
        newbookcatdiv.id = `${cat}-bookcat`;
        allreadbooks.appendChild(newbookcatdiv);
	
        let newl2header = document.createElement('h6');
        newl2header.className = "l2header";
        newl2header.textContent = `${cat}`;
		newl2header.title= "Click header to expand or collapse this section";
        newbookcatdiv.appendChild(newl2header);

		newl2header.setAttribute("onclick", `collapseall('bookrecord-${newbookcatdiv.id}');`);

        records.forEach(record => {
            if (record.categories.includes(cat)) {
                let newa = document.createElement('a');
				newa.textContent = record.name;
				newa.title = `${record.name}
Description: ${record.description}`;
				newa.className = `bookrecord-${newbookcatdiv.id} bookrecord`;
				newa.href = "https://charmscheck.com/frm_display/books-grid/entry/" + record.id + "/";
				newa.target = "_blank";
				newbookcatdiv.appendChild(newa);
            }
        });
    });
}

function assignuncategorizedbooks(records, allreadbooks) {
    if (records.length > 0) {
        let newbookcatdiv = document.createElement('div');
        newbookcatdiv.className = "bookcat";
        newbookcatdiv.id = "uncatbooks";
        allreadbooks.appendChild(newbookcatdiv);

        let newl2header = document.createElement('h6');
        newl2header.className = "l2header";
        newl2header.textContent = "Uncategorized Books {click to expand/collapse} ";
		newl2header.title= "Click header to expand or collapse this section";
        newl2header.id = "uncatbooksheader";
        newbookcatdiv.appendChild(newl2header);

        newl2header.setAttribute("onclick", `collapseall('bookrecord-${newbookcatdiv.id}');`);

        records.forEach(record => {
            let newa = document.createElement('a');
            newa.textContent = record.name;
            newa.title = `${record.name}
Description: ${record.description}`;
            newa.className = `bookrecord-${newbookcatdiv.id} bookrecord`;
            newa.href = "https://charmscheck.com/frm_display/books-grid/entry/" + record.id + "/";
            newa.target = "_blank";
            newbookcatdiv.appendChild(newa);
        });
    }
}


function assignerrorbooks(records, allreadbooks){
	
	if(records.length>0){
		let newbookcatdiv = document.createElement('div');
        newbookcatdiv.className = "bookcat";
        newbookcatdiv.id = "errorbooks";
        allreadbooks.appendChild(newbookcatdiv);
		
		let newl2header = document.createElement('h6');
        newl2header.className = "l2header";
        newl2header.textContent = "error books";
		newl2header.title= "Click header to expand or collapse this section";
        newl2header.id = "errorbooksheader";
        newbookcatdiv.appendChild(newl2header);
		
		newl2header.setAttribute("onclick", `collapseall('bookrecord-${newbookcatdiv.id}');`);
		
		records.forEach(record => {
            let newdiv = document.createElement('div');
            newdiv.textContent = record;
            newdiv.title = `Error: This book record was not found in the database. Perhaps the record has been renamed or deleted? Recommend reassigning the book when you next edit your character sheet`;
            newdiv.className = `bookrecord-${newbookcatdiv.id} bookrecord`;
            newbookcatdiv.appendChild(newdiv);
			
        });
    }
}
function assignallknownspells(){
	
	let sortedlist=charvals.spells.sort((a, b) => {
		return a.threshold - b.threshold;
	});
	
	sortedlist.forEach(spell=>{
		let spellentrydiv=document.createElement('div');
		spellentrydiv.title = `${spell.name} (${spell.threshold})
${spell.skill} (${spell.subtype})
Description: ${spell.description}`;
		
	
		let spellrollerbtn=document.createElement('button');
		spellrollerbtn.textContent = `${spell.name} (${spell.threshold})`;
		spellrollerbtn.setAttribute('onclick', "spellroll('" + spell.name + "');");
		spellrollerbtn.className="spellprof";
		spellentrydiv.appendChild(spellrollerbtn);
	
		let newa = document.createElement('a');
		newa.innerHTML = "&#9432;";
		newa.href = "https://charmscheck.com/spells/entry/" + spell.id + "/";
		newa.target = "_blank";
		newa.className="infobtn";
		spellentrydiv.appendChild(newa);
		
		switch(normalizename(spell.skill)){
			case "Charms":
				spellentrydiv.className="knowncharm spellentry";
				document.getElementById("allknownspells-Charmsdiv").appendChild(spellentrydiv);
			break;
			case "Transfiguration":
				spellentrydiv.className="knowntransfig spellentry";
				document.getElementById("allknownspells-Transfigdiv").appendChild(spellentrydiv);
			break;
			case "Defense":
				spellentrydiv.className="knowndefense spellentry";
				document.getElementById("allknownspells-Defensediv").appendChild(spellentrydiv);
			break;
			case "DarkArts":
				spellentrydiv.className="knowndarkarts spellentry";
				document.getElementById("allknownspells-Darkartsdiv").appendChild(spellentrydiv);
			break;
		}
	});
}

function assignallknownproficiencies(){
	
	let sortedlist=charvals.proficiencies.sort((a, b) => {
		return a.threshold - b.threshold;
	});
	
	sortedlist.forEach(prof=>{
		let profentrydiv=document.createElement('div');
		profentrydiv.title=`${prof.name} (${prof.threshold})
${prof.skill} (${prof.subtype})`;

		let profrollerbtn=document.createElement('button');
		profrollerbtn.textContent=`${prof.name} (${prof.threshold})`;
		profrollerbtn.setAttribute('onclick', "proficiencyroll('"+prof.name+"');");
		profrollerbtn.className="spellprof";
		profentrydiv.appendChild(profrollerbtn);
		
		let newa = document.createElement('a');
		newa.innerHTML = "&#9432;";
		newa.href="https://charmscheck.com/proficiencies/entry/"+prof.id+"/";
		newa.target = "_blank";
		newa.className="infobtn";
		profentrydiv.appendChild(newa);
		
		switch(normalizename(prof.skill)){
			case "Potions":
				profentrydiv.className="knownpotionsprof profentry";
				document.getElementById("allknownprofs-Potionsdiv").appendChild(profentrydiv);			
			break;
			case "Alchemy":
				profentrydiv.className="knownalchemyprof profentry";
				document.getElementById("allknownprofs-Alchemydiv").appendChild(profentrydiv);			
			break;
			case "Arithmancy":
				profentrydiv.className="knownarithmancyprof profentry";
				document.getElementById("allknownprofs-Arithmancydiv").appendChild(profentrydiv);			
			break;
			case "Artificing":
				profentrydiv.className="knownartificingprof profentry";
				document.getElementById("allknownprofs-Artificingdiv").appendChild(profentrydiv);			
			break;
			case "Astronomy":
				profentrydiv.className="knownastronomyprof profentry";
				document.getElementById("allknownprofs-Astronomydiv").appendChild(profentrydiv);			
			break;
			case "Creatures":
				profentrydiv.className="knowncreaturesprof profentry";
				document.getElementById("allknownprofs-Creaturesdiv").appendChild(profentrydiv);			
			break;
			case "Divination":
				profentrydiv.className="knowndivinationprof profentry";
				document.getElementById("allknownprofs-Divinationdiv").appendChild(profentrydiv);			
			break;
			case "Herbology":
				profentrydiv.className="knownherbologyprof profentry";
				document.getElementById("allknownprofs-Herbologydiv").appendChild(profentrydiv);			
			break;
			case "History":
				profentrydiv.className="knownhistoryprof profentry";
				document.getElementById("allknownprofs-Historydiv").appendChild(profentrydiv);			
			break;
			case "Muggles":
				profentrydiv.className="knownmuggleprof profentry";
				document.getElementById("allknownprofs-Mugglesdiv").appendChild(profentrydiv);			
			break;
			case "Runes":
				profentrydiv.className="knownrunesprof profentry";
				document.getElementById("allknownprofs-Runesdiv").appendChild(profentrydiv);			
			break;
		}
	});
}
function assignallknownstandardpotions(){
	let sortedlist=charvals.standardpotions.sort((a,b)=>{
		return a.threshold - b.threshold;
	});
	
	sortedlist.forEach(pot=>{
	
	let ingredients="unknown";
	if(pot.ingredients && pot.ingredients.length>0){
		ingredients=pot.ingredients.join(', ');
	}
	
		let potentrydiv=document.createElement('div');
		potentrydiv.title=`${pot.name} (${pot.threshold})
Invented by: ${pot.inventor}
Brewtime: ${pot.brewtime}
Ingredients Required: ${ingredients}
Raw Effect: ${pot.raweffect}`;
	
	let potrollerbtn=document.createElement('button');
	potrollerbtn.textContent=`${pot.name} (${pot.threshold})`;
	potrollerbtn.setAttribute('onclick', "potioncreationroll('"+pot.name+"', 'standard');");
	potrollerbtn.className="pot";
	potentrydiv.appendChild(potrollerbtn);
	
	let newa = document.createElement('a');
	newa.innerHTML = "&#9432;";
	newa.href="https://charmscheck.com/potions-2//entry/"+pot.id+"/";
	newa.target = "_blank";
	newa.className="infobtn";
	potentrydiv.className="knownstandardpot"
	potentrydiv.appendChild(newa);
	
	document.getElementById("allknownpots-Standarddiv").appendChild(potentrydiv);
	});
}

function assignallknownalchemicalpotions(){
	let sortedlist=charvals.alchemicalpotions.sort((a,b)=>{
		return a.threshold - b.threshold;
	});
	
	sortedlist.forEach(pot=>{
	
	let ingredients="unknown";
	if(pot.ingredients && pot.ingredients.length>0){
		ingredients=pot.ingredients.join(', ');
	}
	
		let potentrydiv=document.createElement('div');
		potentrydiv.title=`${pot.name} (${pot.threshold})
Invented by: ${pot.inventor}
Brewtime: ${pot.brewtime}
Ingredients Required: ${ingredients}
Raw Effect: ${pot.raweffect}`;
	
	let potrollerbtn=document.createElement('button');
	potrollerbtn.textContent=`${pot.name} (${pot.threshold})`;
	potrollerbtn.setAttribute('onclick', "potioncreationroll('"+pot.name+"', 'alchemical');");
	potrollerbtn.className="pot";
	potentrydiv.appendChild(potrollerbtn);
	
	let newa = document.createElement('a');
	newa.innerHTML = "&#9432;";
	newa.href="https://charmscheck.com/alchemical-potions/entry/"+pot.id+"/";
	newa.target = "_blank";
	newa.className="infobtn";
	potentrydiv.className="knownalchemicalpot"
	potentrydiv.appendChild(newa);
	
	document.getElementById("allknownpots-Alchemicaldiv").appendChild(potentrydiv);
	});
}
function assignpets(){

	charvals.pets.forEach(pet=>{
	
		let intellect="";
		if(pet.humanintel>0){
			intellect="Human Intellect: " + pet.humanintel;
		}else{
			intellect="Beastial Intellect: " + pet.beastintel;
		}
	
		let petentrydiv=document.createElement('div');
		petentrydiv.textContent=`${pet.name} (${pet.species})`;
		petentrydiv.title=`${pet.name} (${pet.species}; Size: ${pet.size})
Heavy Wound Cap: ${pet.heavywoundcap} | Res: ${pet.resistance}
${intellect}
Movement: Ground: ${pet.ground} | Water: ${pet.water} | Air: ${pet.air}`;
		petentrydiv.className="pet";
		document.getElementById("petsection").appendChild(petentrydiv);
	});
}
function assigninventory(){
	charvals.inventory.forEach(itm=>{
	
	let itementrydiv=document.createElement('div');
	itementrydiv.textContent=`${itm.name} (${itm.type})`;
	
	let passivebonuses="None"; //Used for general items;
	let ingredients="not listed";
	
		switch(itm.type){
			case "General":
				if(itm.passivebonuses && itm.passivebonuses.length>0){
					passivebonuses="";
					itm.passivebonuses.forEach(bns=>{
						passivebonuses+=`${bns.type} (${bns.amount}`+'\n';
					});
				}
				itementrydiv.title=`${itm.name}
Description: ${itm.description}
Passive Bonuses: ${passivebonuses}`;
			itementrydiv.className="inv-general";
			break;
			case "Alchemy":
				itementrydiv.title= `${itm.name}
Raw Effect: ${pot.raweffect}`;
			itementrydiv.className="inv-alchemy";
			break;
			case "Potion":
				itementrydiv.title= `${itm.name}
Raw Effect: ${pot.raweffect}`;
			itementrydiv.className="inv-potion";
			break;
			case "Creature":
				itementrydiv.title=`${itm.name}
Description: ${itm.description}`;
				let newa = document.createElement('a');
				newa.innerHTML = "&#9432;";
				newa.href="https://charmscheck.com/creatures-2//entry/"+itm.id+"/";
				newa.target = "_blank";
				newa.className="infobtn";
				itementrydiv.appendChild(newa);
				itementrydiv.className="inv-creature";
			break;
			case "Creature Part":
				itementrydiv.title= `${itm.name}
Description: ${itm.description}
Raw Effects: ${itm.raweffects}
Potion Effects: ${itm.potioneffects}`;
				newa.innerHTML = "&#9432;";
				newa.href="https://charmscheck.com/creatures-parts//entry/"+itm.id+"/";
				newa.target = "_blank";
				newa.className="infobtn";
				itementrydiv.appendChild(newa);
				itementrydiv.className="inv-creaturepart";
			break;
			case "Plant":
				itementrydiv.title=`${itm.name}
Description: ${itm.description}`;
			itementrydiv.className="inv-plant";
			break;
			case "Plant Part":
				itementrydiv.title= `${itm.name}
Description: ${itm.description}
Raw Effects: ${itm.raweffects}
Potion Effects: ${itm.potioneffects}`;
			itementrydiv.className="inv-plantpart";
			break;
			case "Food/Drink":
				itementrydiv.title= `${itm.name}
Description: ${itm.description}
Raw Effects: ${itm.raweffects}
Potion Effects: ${itm.potioneffects}`;
			itementrydiv.className="inv-fooddrink";
			break;
			case "Preparation":
				itementrydiv.title= `${itm.name}
Description: ${itm.description}
Raw Effects: ${itm.raweffects}
Potion Effects: ${itm.potioneffects}`;
			itementrydiv.className="inv-preparation";
			break;
			}		
			document.getElementById("inventorysection").appendChild(itementrydiv);
			});
			}
			
function assignrelationships(){

	charvals.relationships.forEach(rel=>{
		let relentrydiv=document.createElement('div');
		relentrydiv.textContent=`${rel.person}`;
		relentrydiv.title=`${rel.person} 
${rel.notes.trimStart()}`;
		relentrydiv.className="rel";
		document.getElementById("allrelationships").appendChild(relentrydiv);
	});

}
//==========
//Liio Tools
//==========
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
//==========
//Startup
//Data
//==========
function startscripts(){

	setcharvalues(); 
	setabilitypoints(); 
	setskillpoints(); 
	assignbtntxt(); 
	settraits(); 
	assignfavspells();
	assignfavproficiencies();
	assigngear();
	assignreadbooks();
	assignallknownspells();
	assignallknownproficiencies();
	assignallknownstandardpotions();
	assignallknownalchemicalpotions();
	assignpets();
	assigninventory();
	assignrelationships();

	setheader();
	togglespellproflistings();
	showelements();
}
function hideelements() {
    let interval = setInterval(() => {
        let elms = document.getElementsByClassName("maindisplay");
        let areAllHidden = true;

        for (let i = 0; i < elms.length; i++) {
            if (elms[i].style.display !== 'none') {
                elms[i].style.display = 'none';
                areAllHidden = false;
            }
        }

        if (areAllHidden) {
            clearInterval(interval); // Stop the interval if all elements are hidden
        }
    }, 25); // Check every 25 milliseconds

    let hrInterval = setInterval(() => {
        let hrs = document.querySelectorAll('hr');
        let areAllHidden = true;

        hrs.forEach(hr => {
            if (hr.style.display !== 'none') {
                hr.style.display = 'none';
                areAllHidden = false;
            }
        });

        if (areAllHidden) {
            clearInterval(hrInterval); // Stop the interval if all <hr> elements are hidden
        }
    }, 25); // Check every 25 milliseconds
}

function showelements(){
	loadinggif.style="display:none";
	
	let elms=document.getElementsByClassName("maindisplay");
	for(let i=0;i<elms.length;i++){
	elms[i].style="display:block";
	}
	
	document.getElementById("headerbtns").style="display: flex; justify-content: center; align-items: center; margin-bottom: 15px; margin-top:15px;";
	let hrs = document.querySelectorAll('hr');
	
	hrs.forEach(function(hr) {
      hr.style.display = 'block';
	});
	
	document.getElementById("charsheetsection").style="display:block";
	document.getElementById("equipmentsection").style="display:none";
	document.getElementById("relationshipsection").style="display:none";
}

function processtraits(traitdata){
	
	Object.keys(traitdata).forEach(key => {
		let entry = traitdata[key];
		
		let bonuses=[];
		if(entry.meta.traitbonuses){
			for(let i=0;i<entry.meta['b78xl'].length;i++){
				bonus={
					type: normalizename(entry.meta.traitbonusskill[i]) || entry.meta.traitbonussubtype[i] || "Ancillary",
					amount: entry.meta.traitbonusamt[i] || entry.meta.traitancillarybonus[i] || 0
				}
				bonuses.push(bonus);
			}
		}
		
		let trait= {
			name: entry.meta.traitname,
			bonuses: bonuses
		}
		
		traits.push(trait);
	});
}

function processspells(spellsdata) {
    Object.keys(spellsdata).forEach(key => {
        let entry = spellsdata[key];
        let spell = {
			id: parseInt(entry.id),
            name: entry.meta['1nyqa13'],
            description: entry.meta['4x6t713'],
            incantation: entry.meta['dtey72'],
            skill: entry.meta['xsf9s'],
            subtype: entry.meta['m7sdz2'],
            threshold: parseInt(entry.meta['r87jo13'])
        };
        spells.push(spell);
    });
}

function processproficiencies(proficienciesdata) {
    Object.keys(proficienciesdata).forEach(key => {
        let entry = proficienciesdata[key];
        let requirements = [];
        let yields = [];

        if (entry.meta['aiwl3'] !== undefined) {
            entry.meta['aiwl3'].forEach(requirement => {
                requirements.push(requirement);
            });
        }

        if (entry.meta['53wtd'] !== undefined) {
            entry.meta['53wtd'].forEach(ayield => {
                yields.push(ayield);
            });
        }

        let proficiency = {
			id: entry.id,
            name: entry.meta['fy85e'],
            description: entry.meta['e3usn'] || "",
            skill: entry.meta['s71z0'],
            threshold: parseInt(entry.meta['ipjf3']) || 0,
            subtype: entry.meta['pm37m'] || entry.meta['e5ltj'] || "",
            association: entry.meta['pn177'] || entry.meta['iw2jn'] || "",
            tradition: entry.meta['kv517'] || "",
            requirements: requirements,
            yields: yields
        };

        proficiencies.push(proficiency);
    });
}
function processoutfits(outfitsdata){
	Object.keys(outfitsdata).forEach(key => {
		let entry = outfitsdata[key];
		
		let bonuses=[];
		
		if(entry.meta.bonustype){
			for(let i=0;i<entry.meta.bonustype.length;i++){
				let bonus={
					type: entry.meta.outfitbonusability || entry.meta.outfitbonusskill || entry.meta.outfitbonussubtype || entry.meta.outfitbonuscharacteristic,
					amount: parseInt(entry.meta.outfitbonusamt) || 0
				}
				bonuses.push(bonus);
			}
		}
		
        let outfit = {
            name: entry.meta.outfitname || "",
            description: entry.meta.outfitdescription || "",
            bonuses: bonuses
        };
        outfits.push(outfit);
    });
}

function processwoods(woodsdata){
	Object.keys(woodsdata).forEach(key => {
		let entry = woodsdata[key];
		
		let bonuses=[];
		
		if(entry.meta.woodbonustype){
			for(let i=0;i<entry.meta.woodbonustype.length;i++){
				
				let type="";
	
				switch(entry.meta.woodbonustype[i]){
					case "Casting": type="Casting"; break;
					case "Ability": type=entry.meta.woodbonusability[i]; break;
					case "Skill": type=entry.meta.woodbonusskill[i]; break;
					case "Characteristic": type=entry.meta.woodbonuscharacteristic[i]; break;
					case "Subtype": type=entry.meta.woodbonussubtype[i]; break;
				}
					
				let bonus={
					type: normalizename(type),
					source: "Wood",
					amount: parseInt(entry.meta.woodbonusamt[i]) || 0
				}
				bonuses.push(bonus);
			}
		}
		
		let wood = {
			name: entry.meta.woodname,
			description: entry.meta.wooddescription,
			bonuses: bonuses
		}
		
		woods.push(wood);
	});
}

function processcores(coresdata){
	Object.keys(coresdata).forEach(key => {
		let entry = coresdata[key];
		
		let bonuses=[];

		if(entry.meta.corebonustype){
			for(let i=0;i<entry.meta.corebonustype.length;i++){
				
				let type="";
				switch(entry.meta.corebonustype[i]){
					case "Casting": type="Casting"; break;
					case "Ability": type=entry.meta.corebonusability[i]; break;
					case "Skill": type=entry.meta.corebonusskill[i]; break;
					case "Characteristic": type=entry.meta.corebonuscharacteristic[i]; break;
					case "Subtype": type=entry.meta.corebonussubtype[i]; break;
				}
					
				let bonus={
					type: normalizename(type),
					source: "Core",
					amount: parseInt(entry.meta.corebonusamt[i]) || 0
				}
				bonuses.push(bonus);
			}
		}
		
		let core = {
			name: entry.meta.corename,
			description: entry.meta.coredescription,
			bonuses: bonuses
		}
		
		cores.push(core);
	});
}	

function processqualities(qualitiesdata){
	Object.keys(qualitiesdata).forEach(key => {
		let entry = qualitiesdata[key];
		
		let bonuses = [{ type: "Casting", source: "Quality", amount: parseInt(entry.meta.qualitycastingeffect) || 0 }];
		
		let quality = {
			name: entry.meta.qualityname,
			bonuses: bonuses
		}
		
		qualities.push(quality);
	});
}

function processwands(wandsdata){
	Object.keys(wandsdata).forEach(key => {
		let entry = wandsdata[key];

		let thiscore=cores.find(x=>entry.meta.wandcore==x.name);
		let thiswood=woods.find(x=>entry.meta.wandwood==x.name);
		let thisquality=qualities.find(x=>entry.meta.wandquality==x.name);
		
		let bonuses=[];
		
		if(thiscore.bonuses){
			for(let i=0;i<thiscore.bonuses.length;i++){
				bonuses.push(thiscore.bonuses[i]);
			}
		}
		
		if(thiswood.bonuses){
			for(let i=0;i<thiswood.bonuses.length;i++){
				bonuses.push(thiswood.bonuses[i]);
			}
		}
		
		if(thisquality.bonuses){
			for(let i=0;i<thisquality.bonuses.length;i++){
				bonuses.push(thisquality.bonuses[i]);
			}
		}
		
		let wand = {
			name: entry.meta.wandname,
			maker: entry.meta.wandmaker,
			core: entry.meta.wandcore,
			wood: entry.meta.wandwood,
			quality: entry.meta.wandquality,
			bonuses: bonuses
		}

		wands.push(wand);
	});
}

function processaccessories(accessoriesdata){
	Object.keys(accessoriesdata).forEach(key=>{
		let entry=accessoriesdata[key];		
		
		let bonuses = [];
		
		if(entry.meta.accessorybonustype){
			for(let i=0;i<entry.meta.accessorybonustype.length;i++){
				
				let bonus={
					type: entry.meta.accessoryabilitybonus[i] || entry.meta.accessoryskillbonus[i] || entry.meta.accessorysubtypebonus[i] || entry.meta.accessorycharacteristicbonus[i],
					amount: entry.meta.accessorybonusamt[i] || 0
				}
				
					bonuses.push(bonus);
			}
		}
			
		let accessory={
			name: entry.meta.accessoryname,
			description: entry.meta.description || "",
			bonuses: bonuses
		}
		accessories.push(accessory);
	});
}

function processbooks(booksdata){
		Object.keys(booksdata).forEach(key=>{
		
		let entry=booksdata[key];		
		
		let thisbookprereqs = [];
		let thisbookspells = [];
		let thisbookpotions = [];
		let thisbookproficiencies = [];
		let thisbookaddltadvs = []; //additional advantages
		let thisbookcategories=[];
		
		if(entry.meta.bookselectedcategories){
			thisbookcategories=entry.meta.bookselectedcategories.toString().split(",");
		}
		
		if(entry.meta.bookprereq){
			entry.meta.bookprereq.forEach(prereq=>{
				thisbookprereqs.push(bookprereq); //only storing the name
			});
		}
		
		if(entry.meta.bookspell){
			entry.meta.bookspell.forEach(spell=>{
				thisbookspells.push(spell); //only storing the name
			});
		}
		
		if(entry.meta.bookproficiency){
			entry.meta.bookproficiency.forEach(proficiency=>{
				thisbookproficiencies.push(proficiency); //only storing the name
			});
		}

		if(entry.meta.bookpotion){
			entry.meta.bookpotion.forEach(potion=>{
				thisbookpotions.push(potion); //only storing the name
			});
		}
		
		if(entry.meta.bookaddtladv){
			entry.meta.bookaddtladv.forEach(addltadv=>{
				thisbookaddltadvs.push(addtladv); //only storing the name
			});
		}
			
		
		let book={
			id: entry.id,
			name: entry.meta.bookname,
			author: entry.meta.author || "", //can use the name of the person to lookup their whole character
			description: entry.meta.description || "",
			prereqs: thisbookprereqs || [],
			spells: thisbookspells || [],
			proficiencies: thisbookproficiencies || [],
			addltadvs: thisbookaddltadvs || [],
			categories: thisbookcategories || []
		}
		
		books.push(book);
		});
}
function processstandardpotions(potionsdata){
	Object.keys(potionsdata).forEach(key=>{
		let entry=potionsdata[key];
		
		let thispotingreds=[];
		
		if(entry.meta.potioningredient){
			thispotingreds=entry.meta.potioningredient.toString().split(",");//these will all be found in "items" table
		}
		
		let potion={
			id: entry.id,
			name: entry.meta.potionname,
			inventor: entry.meta.potioninventor || "unknown",
			brewtime: entry.meta.potionbrewtime || "",
			threshold: parseInt(entry.meta.potionthreshold) || 0,
			raweffect: entry.meta.potionraweffect || "",
			ingredients: thispotingreds
		}		
		standardpotions.push(potion);
	});
}

function processalchemicalpotions(potionsdata){
	Object.keys(potionsdata).forEach(key=>{
		let entry=potionsdata[key];
		
		let thispotingreds=[];
		
		if(entry.meta.alchemicalingredient){
			thispotingreds=entry.meta.alchemicalingredient.toString().split(",");
		}
		
		let potion={
			id: entry.id,
			name: entry.meta.alchemicalname,
			inventor: entry.meta.alchemicalinventor || "unknown",
			brewtime: entry.meta.alchemicalbrewtime || "",
			threshold: parseInt(entry.meta.alchemicalthreshold) || 0,
			raweffect: entry.meta.alchemicalraweffect || "",
			ingredients: thispotingreds
		}		
		alchemicalpotions.push(potion);
	});
}
function processnamedcreatures(namedcreaturesdata){
	Object.keys(namedcreaturesdata).forEach(key=>{
		let entry=namedcreaturesdata[key];
			
		let namedcreature={
			id: entry.id,
			name: entry.meta.namedcreaturesname,
			species: entry.meta.namedcreaturesspecies || "",
			heavywoundcap: parseInt(entry.meta.namedcreaturesheavywoundcap) || 0,
			size: parseInt(entry.meta.namedcreaturessize) || 0,
			resistance: parseInt(entry.meta.namedcreaturesresistance) || 0,
			beastintel: parseInt(entry.meta.namedcreaturesbeastintel) || 0,
			humanintel: parseInt(entry.meta.namedcreatureshumanintel) || 0,
			humansocial: parseInt(entry.meta.namedcreatureshumansocial) || 0,
			ground: parseInt(entry.meta.namedcreaturesground) || 0,
			water: parseInt(entry.meta.namedcreaturesground) || 0,
			air: parseInt(entry.meta.namedcreaturesground) || 0
		}		
		namedcreatures.push(namedcreature);
	});
}
function processitems(itemsdata){

	Object.keys(itemsdata).forEach(key=>{
		let entry=itemsdata[key];
		
		let item={
			itemid: entry.id, //this is the id of the record in the items table
			name: entry.meta.itemname,
			type: entry.meta.itemtype,
			tradition: entry.meta.itemtradition,
			baseknuts: parseInt(entry.meta.itembaseknuts),
		}
		items.push(item);
	});
}
function processgeneralitems(generalitemsdata){
	Object.keys(generalitemsdata).forEach(key=>{
		let entry=generalitemsdata[key];
		let passivebonuses=[];
		
		if(entry.meta.generalitempassiveabilitytype && entry.meta.generalitempassiveabilitytype.length>0){
			for(let i=0;i<entry.meta.generalitempassiveabilitytype.length;i++){
				passivebonus={
					type: entry.meta.generalitempassiveabilitybonus[i] || normalizename(entry.meta.generalitempassiveskillbonus[i]) || entry.meta.generalitempassivecharacteristicbonus[i] || entry.meta.generalitempassivesubtypebonus[i],
					amount: entry.meta.generalitempassivebonusamt[i]
				}
			}
			passivebonuses.push(passivebonus);
		}
		
		let generalitem={
			id: entry.id,
			name: entry.meta.generalitemname,
			description: entry.meta.generalitemdescription,
			passivebonuses: passivebonuses
		}		
		generalitems.push(generalitem);
	});
}



function processcreatureparts(creaturepartsdata){
	Object.keys(creaturepartsdata).forEach(key=>{
	let entry=creaturepartsdata[key];
	
	let part={
		id: entry.id,
		name: entry.meta.creaturepartname,
		description: entry.meta.creaturepartdescription,
		raweffects: entry.meta.creaturepartraweffects,
		potioneffects: entry.meta.creaturepartpotioneffects
	};
	
	creatureparts.push(part);
	
	});
	
}

function processplantparts(plantpartsdata){
	Object.keys(plantpartsdata).forEach(key=>{
	let entry=plantpartsdata[key];
	
	let part={
		id: entry.id,
		name: entry.meta.plantpartname,
		description: entry.meta.plantpartdescription,
		raweffects: entry.meta.plantpartraweffects,
		potioneffects: entry.meta.plantpartpotioneffects
	};
	
	plantparts.push(part);

	});
}
function processcreatures(creaturesdata){
	Object.keys(creaturesdata).forEach(key=>{
	let entry=creaturesdata[key];
	
	let parts=[];
	if(entry.meta.parts && entry.meta.parts.length>0){
		entry.meta.parts.forEach(prt=>{
			let part = creatureparts.find(x=>x.name==prt);
			parts.push(part);
		});
	}
	
	let creature={
		id: entry.id,
		name: entry.meta.creaturename,
		type: entry.meta.creaturetype,
		classification: entry.meta.classification,
		heavywoundcap: entry.meta.woundcaplo + "to" + entry.meta.woundcaphi,
		size: entry.meta.sizelo + "to" + entry.meta.sizehi,
		magical: entry.meta.magical || "No",
		resistance: entry.meta.magicalresistlo + "to" + entry.meta.magicalresisthi || "none",
		sentient: entry.meta.issentient || "No",
		beastintel: entry.meta.beastintello + "to" + entry.meta.beastintelhi || "NA",
		humanintel: entry.meta.humanintello + "to" + entry.meta.humanintelhi || "NA",
		humansocial: entry.meta.sociallo + "to" + entry.meta.socialhi || "NA",
		lure: entry.meta.lured,
		tame: entry.meta.tamed,
		bond: entry.meta.bond,
		addtlsocialrules: entry.meta.addtlrules,
		ground: entry.meta.groundlo + "to" + entry.meta.groundhi || "Cannot move on land",
		water: entry.meta.waterlo + "to" + entry.meta.waterhi || "Will drown",
		air: entry.meta.airlo + "to" + entry.meta.airhi || "Will fall",
		attacks: entry.meta.attack || [],
		abilities: entry.meta.ability || [],
		parts: parts || []
	}
	
	creatures.push(creature);
	});
}
function processplants(plantsdata){
	Object.keys(plantsdata).forEach(key=>{
	let entry=plantsdata[key];
	
	let parts=[];
	if(entry.meta.plantparts && entry.meta.plantparts.length>0){
		entry.meta.plantparts.forEach(prt=>{
			let part = plantparts.find(x=>x.name==prt);
			parts.push(part);
		});
	}
	
	let plant={
		id: entry.id,
		name: entry.meta.plantname,
		description: entry.meta.plantdescription,
		parts: parts
	}
	plants.push(plant);
	
	});	
}
function processpreparations(preparationsdata){
	Object.keys(preparationsdata).forEach(key=>{
	let entry=preparationsdata[key];
	
	let reqprofs=[];
	if(entry.meta.prepreqprof && entry.meta.prepreqprof.length>0){
		entry.meta.prepreqprof.forEach(prof=>{
			reqprofs.push(proficiencies.find(x=>x.name==prof));
		});
	}
	
	let preparation={
		id: entry.id,
		name: entry.meta.prepname,
		ingredients: entry.meta.prepingredients || [],
		requiredproficiencies: reqprofs || [],
		description: entry.meta.prepdescription || "",
		raweffects: entry.meta.prepraweffects || "",
		potioneffects: entry.meta.preppotioneffects || ""
	}
	
	preparations.push(preparation);
	
	});
}
function processfooddrink(fooddrinkdata){
	Object.keys(fooddrinkdata).forEach(key=>{
	let entry=fooddrinkdata[key];
	
	let thisfooddrink={
		id: entry.id,
		name: entry.meta.fooddrinkname,
		ingredients: entry.meta.fooddrinkingredient || [],
		description: entry.meta.fooddrinkdescription || "",
		raweffects: entry.meta.fooddrinkraweffects || "",
		effectinpotions: entry.meta.fooddrinkeffectinpotions
	}
	
	fooddrink.push(thisfooddrink);
	
	});
}

//==========
//API
//==========
//global vars
let headers=new Headers();
headers.append("Authorization", "Basic Q0E2RS1LUjdaLUtCT0wtTlVYUTp4");
let requestoptions = {
  method: 'GET',
  headers: headers,
  redirect: 'follow'
};

//main api call function
async function fetchjson(url) {
    let res = await fetch(url, requestoptions);
    if (res.status === 200) {
        return res.json();
    }

    throw new Error(res.status);
}

async function fetchdata() {
    // Fetch all data concurrently
    let [traitdata, spellsdata, proficienciesdata, outfitsdata, woodsdata, coresdata, qualitiesdata, wandsdata, accessoriesdata, booksdata, standardpotionsdata, alchemicalpotionsdata, namedcreaturesdata, generalitemsdata, creaturepartsdata, plantpartsdata, creaturesdata, plantsdata, preparationdata, fooddrinkdata, itemsdata] = await Promise.all([
        fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/979/entries?page_size=10000"),//traits
		fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/191/entries?page_size=10000"),//spells
        fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/944/entries?page_size=10000"),//proficiencies
        fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/993/entries?page_size=10000"),//outfits
        fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/120/entries?page_size=10000"),//wand woods
        fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/116/entries?page_size=10000"),//wand cores
        fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/124/entries?page_size=10000"),//wand qualities
        fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/114/entries?page_size=10000"),//wands 
        fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/995/entries?page_size=10000"), //accessories
		fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/8/entries?page_size=10000"), //books
		fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/34/entries?page_size=10000"), //standard potions
		fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/1005/entries?page_size=10000"), //alchemical potions
		fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/170/entries?page_size=10000"), //named creatures
		fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/126/entries?page_size=10000"), //general items
		fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/53/entries?page_size=10000"), //creature parts
		fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/43/entries?page_size=10000"), //plant parts
		fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/48/entries?page_size=10000"), //creatures
		fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/2/entries?page_size=10000"), //plants
		fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/908/entries?page_size=10000"), //preparations
		fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/67/entries?page_size=10000"), //fooddrink
		fetchjson("https://charmscheck.com/wp-json/frm/v2/forms/964/entries?page_size=10000") //items
	]);
	
	// Process each data type
	processtraits(traitdata);
    processspells(spellsdata);
    processproficiencies(proficienciesdata);
    processoutfits(outfitsdata);
    processwoods(woodsdata);
    processcores(coresdata);
    processqualities(qualitiesdata);
    processwands(wandsdata, coresdata, woodsdata, qualitiesdata);
    processaccessories(accessoriesdata);
	processbooks(booksdata);
	processstandardpotions(standardpotionsdata);
	processalchemicalpotions(alchemicalpotionsdata);
	processnamedcreatures(namedcreaturesdata);
	processgeneralitems(generalitemsdata);
	processcreatureparts(creaturepartsdata);
	processplantparts(plantpartsdata);
	processcreatures(creaturesdata);
	processplants(plantsdata);
	processpreparations(preparationdata);
	processfooddrink(fooddrinkdata);
	processitems(itemsdata);

    startscripts();
}

hideelements();
fetchdata(); //This code begins the entire chain of events.
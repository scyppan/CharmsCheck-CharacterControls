//this is the script to put in wordpress scripts n' styles
async function initApp() {
	console.log("loading scripts");
	await initCharmsCheckLoader();
	console.log("scripts loaded; now loading characters");
	await getcharacters();
	console.log("got characters");
  
	hidegif();
	createfuse();
	document.getElementById('charsheetmain').classList.remove('hidden');
	searchbox.focus();
  
	//init_cache();
	//startidlefetchsequence();
	
	starttimer();
	createCharacterSheet();
  }
  
  async function initCharmsCheckLoader() {
	const version = 'a25.5.26.003';
	const subDir  = 'Character%20Sheet/';
	const base    = `https://cdn.jsdelivr.net/gh/scyppan/CharmsCheck-CharacterControls@${version}/${subDir}`;
  
	const css = [
	  'css/page.css','css/searchbox.css','css/charsheetlayout.css','css/overview.css',
	  'css/skills.css','css/spelldisplay.css','css/proficiencydisplay.css',
	  'css/potionsdisplay.css','css/petsdisplay.css','css/inventorydisplay.css',
	  'css/relationshipdisplay.css','css/settingdisplay.css','css/rolldisplay.css', 'css/wounddisplay.css'
	];
	const js = [
	  //'js/0globalvars/globalvars.js',
	  //'js/0api/cache.js','js/0api/idleloader.js'
	  'js/0api/loadgiflogic.js',
	  ,'js/0api/apicall.js',
	  'js/0tools/tools.js',
	  'js/1htmlelements/searchbox.js','js/1htmlelements/charsheetsetup.js',
	  'js/2loadchar/loadchar.js',
	  'js/3tabs/overviewtab.js','js/3tabs/attributestab.js','js/3tabs/spellstab.js',
	  'js/3tabs/proficienciestab.js','js/3tabs/potionstab.js','js/3tabs/petstab.js',
	  'js/3tabs/inventorytab.js','js/3tabs/relationshipstab.js','js/3tabs/settingstab.js',
	  'js/tools/relationships.js','js/tools/inventory.js','js/tools/pets.js',
	  'js/tools/potions.js','js/tools/proficiencies.js','js/tools/spells.js',
	  'js/tools/books.js','js/tools/courses.js','js/tools/accessories.js',
	  'js/tools/attributes.js','js/tools/wands.js','js/3tabs/woundstab.js','js/tools/wounds.js',
	  'js/tools/traits.js','js/tools/shortname.js','js/tools/addvalstobtns.js',
	  'js/4Functionality/roll.js','js/4Functionality/rollclicks.js',
	  'js/4Functionality/rolltools.js','js/4Functionality/rolltext.js'
	];
  
	const addCSS = href => {
	  const link = document.createElement('link');
	  link.rel  = 'stylesheet';
	  link.href = `${href}?v=${version}`;
	  document.head.appendChild(link);
	};
	const addJS = src => new Promise((res, rej) => {
	  const script = document.createElement('script');
	  script.src   = `${src}?v=${version}`;
	  script.async = false;
	  script.onload  = () => { console.log('✓', src.split('/').pop()); res(); };
	  script.onerror = () => rej(new Error('Failed to load ' + src));
	  document.head.appendChild(script);
	});
  
	css.forEach(f => addCSS(base + f));
	addCSS('https://fonts.googleapis.com/css2?family=Pangolin&display=swap');
  
	try {
	  await addJS('https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.js');
	  for (const file of js) {
		await addJS(base + file);
	  }
	  console.log('CharmsCheck loader — all done');
	} catch (err) {
	  console.error(err);
	}
  }
  
  document.addEventListener('DOMContentLoaded', () => {
	initApp().catch(err => console.error('Initialization failed:', err));
  });
  
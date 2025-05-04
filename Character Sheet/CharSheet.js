//initialize the app
async function initApp() {
	console.log("starting");
	await getcharacters();
	console.log("got characters");
	
	hidegif();       // remove loading indicator
	createfuse();    // initialize search box
	main.classList.remove('hidden');
	searchbox.focus();

	init_cache();
	startidlefetchsequence();
	createCharacterSheet();
}

initApp();
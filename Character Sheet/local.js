async function initApp() {
	console.log("scripts loaded; now loading characters");
	await getcharacters();
	console.log("got characters");

	hidegif();       // remove loading indicator
	createfuse();    // initialize search box
	document.getElementById('charsheetmain').classList.remove('hidden');
	searchbox.focus();

	//init_cache();
	startIdleFetchSequence(cache_configs, {
		cacheTTL: cache_ttl,
		inactivityDelay: 5000,
		quickThreshold: 1000
	});

	createCharacterSheet();

}

initApp();
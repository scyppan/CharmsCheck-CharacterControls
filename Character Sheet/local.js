async function initApp() {
	console.log("scripts loaded; now loading characters");
	await getcharacters();
	console.log("got characters");

	hidegif();       // remove loading indicator
	createfuse();    // initialize search box
	document.getElementById('charsheetmain').classList.remove('hidden');
	searchbox.focus();

	createCharacterSheet();

}

initApp();
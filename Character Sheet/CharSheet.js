//This is the entry point for the whole program
(async () => {
	characters = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/972/entries?page_size=10000").catch(console.error);
	hidegif();     // loadgiflogic.js
    createfuse();  // searchbox.js
	main.classList.remove('hidden');
	searchbox.focus();
	init_cache();
	startidlefetchsequence();
  })();  
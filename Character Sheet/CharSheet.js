(async () => {
	characters = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/972/entries?page_size=10000").catch(console.error);//apicall.js
	main.classList.remove('hidden');
	searchbox.focus();
	startidlefetchsequence();
  })();  
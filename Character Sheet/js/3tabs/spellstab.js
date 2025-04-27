async function spellstab() {
    const tabcontent = document.getElementById('tabcontent');
    tabcontent.textContent = 'Fetching API Data 1/3...';
    await getspells();//make sure we've loaded spells
    tabcontent.textContent = 'Fetching API Data 2/3....';
    await getbooks();//make sure we've loaded books
    tabcontent.textContent = 'Fetching API Data 3/3.....';
    await getschools();//make sure we've loaded schools
}




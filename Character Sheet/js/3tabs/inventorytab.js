async function inventorytab() {
    const tabcontent = document.getElementById('tabcontent');

    tabcontent.textContent = 'Fetching Inventory Data 1/3...';
    await getitems(true);

    tabcontent.textContent = 'Fetching Inventory Data 2/3...';
    await getnamedcreatures(true); // if your items include creature references

    tabcontent.textContent = 'Fetching Inventory Data 3/3...';
    await getbooks(true); // for book-type inventory entries

    renderinventorytabui();
    loadEquippedItems(); // default view
    activateInventoryTab('btninv_equipped');
}

function renderinventorytabui() {
    const tabcontent = document.getElementById('tabcontent');
    tabcontent.textContent = '';

    const buttonbar = document.createElement('div');
    buttonbar.id = 'inventorytabbuttonbar';

    const buttons = [
        { id: 'btninv_equipped',  label: 'Equipped Items',            handler: loadEquippedItems },
        { id: 'btninv_general',   label: 'General Items',             handler: loadGeneralItems },
        { id: 'btninv_potions',   label: 'Potions',                   handler: loadPotions },
        { id: 'btninv_food',      label: 'Food and Drinks',           handler: loadFood },
        { id: 'btninv_creatures', label: 'Creatures & Plants',        handler: loadCreaturesAndPlants },
        { id: 'btninv_parts',     label: 'Preparations / Parts',      handler: loadPreparations },
        { id: 'btninv_books',     label: 'Books',                     handler: loadBooks }
    ];

    buttons.forEach(({ id, label, handler }) => {
        const btn = document.createElement('button');
        btn.id = id;
        btn.textContent = label;
        btn.addEventListener('click', () => {
            activateInventoryTab(id);
            handler();
        });
        buttonbar.appendChild(btn);
    });

    tabcontent.appendChild(buttonbar);

    const mini = document.createElement('div');
    mini.id = 'inventoryminiwindow';
    tabcontent.appendChild(mini);
}

function activateInventoryTab(tabId) {
    const kids = document.querySelectorAll('#inventorytabbuttonbar > button');
    kids.forEach(btn => btn.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}
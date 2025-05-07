async function inventorytab() {
    const tabcontent = document.getElementById('tabcontent');
    tabcontent.textContent = 'Fetching API Data 1/6...';

    // Equipment sources
    await getwands(true);
    tabcontent.textContent = 'Fetching API Data 2/6...';
    await getaccessories(true);
    tabcontent.textContent = 'Fetching API Data 3/6...';
    await getitemsinhand(true);
    await getitems(true);

    // Other‐items sources
    tabcontent.textContent = 'Fetching API Data 4/6...';
    await getgeneralitems(true);
    await getcreatures(true);
    await getcreatureparts(true);
    await getplants(true);
    await getplantparts(true);

    tabcontent.textContent = 'Fetching API Data 5/6...';
    await getpreparations(true);
    await getfooddrink(true);
    await getpotions(true);

    tabcontent.textContent = 'Fetching API Data 6/6...';
    await getbooks(true);

    tabcontent.textContent = 'Rendering inventory…';
    renderInventoryTabUI();
    activateTab('btnEquipment');
}

function renderInventoryTabUI() {
    const tabcontent = document.getElementById('tabcontent');
    tabcontent.textContent = '';

    // 1) Button bar with seven tabs
    const buttonBar = document.createElement('div');
    buttonBar.id = 'inventorytabbuttonbar';
    const tabs = [
        { id: 'Equipment', label: 'Equipment', renderFn: renderEquipment },
        { id: 'GeneralItems', label: 'General Items', renderFn: renderGeneralItems },
        { id: 'CreaturesPlants', label: 'Creatures & Plants', renderFn: renderCreaturesAndPlants },
        { id: 'PrepsAndParts', label: 'Preparations & Parts', renderFn: renderPreparationsAndParts },
        { id: 'FoodDrinks', label: 'Food & Drinks', renderFn: renderFoodAndDrinks },
        { id: 'Potions', label: 'Potions', renderFn: renderPotions },
        { id: 'Books', label: 'Books', renderFn: renderBooks },
    ];

    tabs.forEach(({ id, label, renderFn }) => {
        const btn = document.createElement('button');
        btn.id = 'btn' + id;
        btn.textContent = label;
        btn.addEventListener('click', () => {
            // toggle active
            buttonBar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // render content
            const contentDiv = document.getElementById('inventorycontent');
            renderFn(contentDiv);
        });
        buttonBar.appendChild(btn);
    });

    tabcontent.appendChild(buttonBar);

    // 2) Content container
    const contentDiv = document.createElement('div');
    contentDiv.id = 'inventorycontent';
    tabcontent.appendChild(contentDiv);

    // 3) Activate first tab
    document.getElementById('btnEquipment').classList.add('active');
    renderEquipment(contentDiv);
}

function renderEquipment(container) {
    container.textContent = '';
    const all = getuniqueequippableitems();
    const equipped = all.filter(i => i.equipped);
    const unequipped = all.filter(i => !i.equipped);

    container.appendChild(createEquipmentSection('Equipped', equipped));
    container.appendChild(createEquipmentSection('Unequipped', unequipped));
}

function createEquipmentSection(title, entries) {
    const section = document.createElement('div');
    section.classList.add('equipment-section');

    // section heading
    const h3 = document.createElement('h3');
    h3.textContent = title;
    section.appendChild(h3);

    // 1) Wand or Item in hand line
    const wandOrHand = entries.find(e => e.type === 'Wand')
        || entries.find(e => e.type === 'Item in hand');
    if (wandOrHand) {
        const line = document.createElement('div');
        line.classList.add('equipment-line');
        line.textContent = wandOrHand.type + ': ';
        const btn = document.createElement('span');
        btn.classList.add('inventory-plate');
        const field = wandOrHand.type === 'Wand' ? 'wandname' : 'itemname';
        btn.textContent = wandOrHand.item.meta[field];
        btn.title=getequippedtitle(wandOrHand);
        line.appendChild(btn);
        section.appendChild(line);
    }

    // 2) Accessories (up to 2, but will show however many)
    const accessories = entries.filter(e => e.type === 'Accessory');
    accessories.forEach((ent, idx) => {
        const line = document.createElement('div');
        line.classList.add('equipment-line');
        line.textContent = `Accessory ${idx + 1}: `;
        const btn = document.createElement('span');
        btn.classList.add('inventory-plate');
        btn.textContent = ent.item.meta.accessoryname;
        btn.title=getequippedtitle(ent);
        line.appendChild(btn);
        section.appendChild(line);
    });

    return section;
}

function renderGeneralItems(container) {
    container.textContent = '';
    const entries = getcompleteinventorylist().filter(i => i.type === 'General');
    container.appendChild(createCategorySection('General Items', entries));
}

function renderCreaturesAndPlants(container) {
    container.textContent = '';
    const all = getcompleteinventorylist();
    container.appendChild(createCategorySection('Creatures', all.filter(i => i.type === 'Creature')));
    container.appendChild(createCategorySection('Plants', all.filter(i => i.type === 'Plant')));
}

function renderPreparationsAndParts(container) {
    container.textContent = '';
    const all = getcompleteinventorylist();
    container.appendChild(createCategorySection('Preparations', all.filter(i => i.type === 'Preparation')));
    container.appendChild(createCategorySection('Creature Parts', all.filter(i => i.type === 'Creature Part')));
    container.appendChild(createCategorySection('Plant Parts', all.filter(i => i.type === 'Plant Part')));
}

function renderFoodAndDrinks(container) {
    container.textContent = '';
    const entries = getcompleteinventorylist().filter(i => i.type === 'Food/Drink');
    container.appendChild(createCategorySection('Food & Drinks', entries));
}

function renderPotions(container) {
    container.textContent = '';
    const entries = getcompleteinventorylist().filter(i => i.type === 'Potion');
    container.appendChild(createCategorySection('Potions', entries));
}

function renderBooks(container) {
    container.textContent = '';
    const entries = getcompleteinventorylist().filter(i => i.type === 'Book');
    container.appendChild(createCategorySection('Books', entries));
}

function createCategorySection(title, entries) {
    const details = document.createElement('details');
    details.classList.add('inventory-category', title.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-'));

    const summary = document.createElement('summary');
    summary.textContent = title;
    details.appendChild(summary);

    const listDiv = document.createElement('div');
    listDiv.classList.add('item-list');

    entries.forEach(({ item, type, equipped }) => {
        if (!item) return;
        const span = document.createElement('span');
        span.classList.add('inventory-plate');
        span.textContent = item.meta[lookupMetaField(type)];
        if (equipped) span.title = `${type} (equipped): ${span.textContent}`;
        listDiv.appendChild(span);
    });

    details.appendChild(listDiv);
    return details;
}

function lookupMetaField(type) {
    switch (type) {
        case 'Wand': return 'wandname';
        case 'Item in hand': return 'itemname';
        case 'Accessory': return 'accessoryname';
        case 'General': return 'generalitemname';
        case 'Creature': return 'creaturename';
        case 'Plant': return 'plantname';
        case 'Creature Part': return 'creaturepartname';
        case 'Plant Part': return 'plantpartname';
        case 'Preparation': return 'prepname';
        case 'Food/Drink': return 'fooddrinkname';
        case 'Potion': return 'potionname';
        case 'Book': return 'bookname';
        default: return 'name';
    }
}
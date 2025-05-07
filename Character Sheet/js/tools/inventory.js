function getcompleteinventorylist() {
    return [
        ...getuniqueequippableitems(),
        ...getallunequippableitems()
    ]
}

function getequippeditems() {
    const rawWand = currentchar.meta.bru22;
    const rawItemInHand = currentchar.meta.iteminhand;
    const accessory1 = currentchar.meta.qb029;
    const accessory2 = currentchar.meta.vykq1;

    const equipped = [];

    // Either a wand or an item in hand
    if (rawWand) {
        const wandObj = Object.values(wands).find(w => w.meta.wandname === rawWand);
        equipped.push({
            type: "Wand",
            item: wandObj || null
        });
    } else if (rawItemInHand) {
        const handItemObj = Object.values(itemsinhand).find(i => i.meta.itemname === rawItemInHand);
        equipped.push({
            type: "Item in hand",
            item: handItemObj || null
        });
    }

    // Accessories (always included if present)
    if (accessory1) {
        const acc1 = Object.values(accessories).find(a => a.meta.accessoryname === accessory1);
        equipped.push({
            type: "Accessory",
            item: acc1 || null
        });
    }
    if (accessory2) {
        const acc2 = Object.values(accessories).find(a => a.meta.accessoryname === accessory2);
        equipped.push({
            type: "Accessory",
            item: acc2 || null
        });
    }

    return equipped;
}

function getallequippableitems() {

    let equippableitems = [];
    if (currentchar.meta.equippableitemtype) {


        let length = currentchar.meta.equippableitemtype.length;


        for (let i = 0; i < length; i++) {
            equippableitems.push({
                type: currentchar.meta.equippableitemtype[i],
                item:
                    Object.values(wands).find(w => w.meta.wandname == currentchar.meta.equippablewandname[i]) ||
                    Object.values(itemsinhand).find(item => item.meta.iteminhanditemname == currentchar.meta.equippableiteminhand[i]) ||
                    Object.values(accessories).find(a => a.meta.accessoryname == currentchar.meta.equippableaccessoryname[i])
            })
        }
    }

    return equippableitems;
}

function getallunequippableitems() {
    const rawTypes = currentchar.meta.wlivm || [];
    const rawNames = currentchar.meta.exsiy || [];
    const length = rawTypes.length;

    // 1) Build a raw list pairing type with the base item object from `items`
    const unequippableitemsraw = [];
    for (let i = 0; i < length; i++) {
        const type = rawTypes[i];
        const name = rawNames[i];
        const baseItem = Object
            .values(items)
            .find(it => it.meta.itemname === name) || null;
        unequippableitemsraw.push({ type, item: baseItem });
    }

    console.log(unequippableitemsraw);

    // 2) For each raw entry, look up the final object in its own collection
    const finalitems = [];
    unequippableitemsraw.forEach(entry => {
        console.log(entry);
        const { type, item: wrapped } = entry;
        if (!wrapped) {
            finalitems.push({ type, item: null });
            return;
        }

        const rawName = wrapped.meta.itemname;
        let finalitem = null;

        switch (type) {
            case "General":
                finalitem = Object
                    .values(generalitems)
                    .find(x => x.meta.generalitemname === rawName) || null;
                break;
            case "Creature":
                finalitem = Object
                    .values(creatures)
                    .find(x => x.meta.creaturename === rawName) || null;
                break;
            case "Creature Part":
                finalitem = Object
                    .values(creatureparts)
                    .find(x => x.meta.creaturepartname === rawName) || null;
                break;
            case "Plant":
                finalitem = Object
                    .values(plants)
                    .find(x => x.meta.plantname === rawName) || null;
                break;
            case "Plant Part":
                finalitem = Object
                    .values(plantparts)
                    .find(x => x.meta.plantpartname === rawName) || null;
                break;
            case "Preparation":
                finalitem = Object
                    .values(preparations)
                    .find(x => x.meta.prepname === rawName) || null;
                break;
            case "Food/Drink":
                finalitem = Object
                    .values(fooddrink)
                    .find(x => x.meta.fooddrinkname === rawName) || null;
                break;
            case "Potion":
                finalitem = Object
                    .values(potions)
                    .find(x => x.meta.potionname === rawName) || null;
                break;
            case "Book":
                finalitem = Object
                    .values(books)
                    .find(x => x.meta.bookname === rawName) || null;
                break;
            default:
                console.warn(`Unknown unequippable type "${type}"`);
        }

        finalitems.push({ type, item: finalitem });
    });

    return finalitems;
}

function getuniqueequippableitems() {
    // 1) get raw lists, tag equipped vs. unequipped
    const equippedList = getequippeditems()
        .filter(e => e.item)
        .map(e => ({ type: e.type, item: e.item, equipped: true }));

    const equippableList = getallequippableitems()
        .filter(e => e.item)
        .map(e => ({ type: e.type, item: e.item, equipped: false }));

    // 2) merge into a Map keyed by item.id so we can dedupe and let 'equipped' win
    const merged = new Map();
    equippableList.forEach(entry => {
        merged.set(entry.item.id, entry);
    });
    equippedList.forEach(entry => {
        const id = entry.item.id;
        if (merged.has(id)) {
            // upgrade existing entry to equipped
            const existing = merged.get(id);
            existing.equipped = true;
            existing.type = entry.type;
        } else {
            merged.set(id, entry);
        }
    });

    // 3) return array of unique items with their equipped flag
    return Array.from(merged.values());
}

function getequippedtitle(entry) {console.log(entry);
    if (entry.type === 'Wand') {
        return entry.item.meta.efpc5 || '';
    }
    if (entry.type === 'Item in hand') {
        return entry.item.meta.iteminhanddescription || '';
    }
    if(entry.type ==="Accessory"){
        return entry.item.meta.accessorydescription || '';
    }
    return '';
}
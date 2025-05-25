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
        const handItemObj = Object.values(itemsinhand).find(i => i.meta.iteminhanditemname === rawItemInHand);
        equipped.push({
            type: "iteminhand",
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

    // 2) For each raw entry, look up the final object in its own collection
    const finalitems = [];
    unequippableitemsraw.forEach(entry => {

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

function getunequipableitembonuses() {
    let bonuslist = [];
    let itemlist = getallunequippableitems();
    itemlist.forEach(item => {

        if (item.type == "General") {
            const generalitem = item.item;

            if (generalitem.meta.generalitempassiveabilitytype) {
                const bonuslen = generalitem.meta.generalitempassiveabilitytype.length || 0;

                for (let i = 0; i < bonuslen; i++) {
                    bonuslist.push({
                        source: generalitem.meta.generalitemname,
                        bonustype: generalitem.meta.generalitempassiveabilitybonus[i] ||
                            generalitem.meta.generalitempassiveskillbonus[i] ||
                            generalitem.meta.generalitempassivecharacteristicbonus[i] ||
                            generalitem.meta.generalitempassivesubtypebonus[i] || "none",
                        amt: generalitem.meta.generalitempassivebonusamt
                    });
                }
            }



        }
    });
    return bonuslist;
}

function getpassivebonusesbyattribute(attribute) {
    const bonuses = getunequipableitembonuses();

    return bonuses.reduce((sum, bonus) => {

        if (getname(bonus.bonustype, 'standard').toLowerCase() === getname(attribute, 'standard').toLowerCase()) {
            if (Array.isArray(bonus.amt)) {
                return sum + bonus.amt.reduce((subsum, val) => subsum + parseFloat(val), 0);
            } else {
                return sum + parseFloat(bonus.amt);
            }
        }
        return sum;
    }, 0);
}

function getPassiveBonusesBySource(source) {
    return getunequipableitembonuses()
        .filter(bonus => bonus.source === source);
}

function collapsewandattributes(fields) {
    const totals = {};
    const contributions = {};
    const notes = [];
    const zeroNotes = [];
    const specials = [];

    fields.forEach(function (field) {
        if (!field.value) return;
        field.value.split(',').forEach(function (token) {
            const entry = token.trim();
            const m = entry.match(/^([A-Za-z\s]+?)\s*([+-]\d+)$/);
            if (m) {
                const attr = m[1].trim();
                const val = parseInt(m[2], 10);

                totals[attr] = (totals[attr] || 0) + val;
                contributions[attr] = contributions[attr] || {};
                contributions[attr][field.type] = (contributions[attr][field.type] || 0) + val;
            }
            else if (entry.toLowerCase() === 'no effect') {
                if (field.type === 'core') notes.push('No Wand Core Effect');
                if (field.type === 'wood') notes.push('No Wand Wood Effect');
                if (field.type === 'quality') notes.push('No Wand Quality Effect');
            }
            else {
                specials.push(entry);
            }
        });
    });

    const lines = [];
    const negations = [];

    // 1) Special effects first
    specials.forEach(function (effect) {
        lines.push('Special Effect: ' + effect);
    });

    // 2) Numeric totals & zero‐sum negations
    Object.keys(contributions).forEach(function (attr) {
        const total = totals[attr] || 0;
        if (total === 0) {
            const parts = Object.keys(contributions[attr]).map(function (type) {
                return type === 'core' ? 'Wand Core'
                    : type === 'wood' ? 'Wand Wood'
                        : /* quality */        'Wand Quality';
            });
            let joined;
            if (parts.length === 1) {
                joined = parts[0];
            } else if (parts.length === 2) {
                joined = parts.join(' and ');
            } else {
                joined = parts.slice(0, -1).join(', ') + ', and ' + parts.slice(-1);
            }
            negations.push('Negating ' + joined + ' values for ' + attr + ' (no net effect)');
        } else {
            const sign = total > 0 ? '+' : '';
            lines.push(attr + ' ' + sign + total);
        }
    });

    // 3) “No effect” notes
    if (notes.length) {
        notes.forEach(function (note) {
            lines.push(note);
        });
    }

    // 4) Zero‐sum negation notes
    if (negations.length) {
        negations.forEach(function (note) {
            lines.push(note);
        });
    }

    // prefix each line with a bullet
    return lines.map(function (line) {
        return '• ' + line;
    }).join('\n');
}

function getequippedtitle(entry) {
    if (entry.type === 'Wand') {
        return entry.item.meta.wandname + '\n' +
            (collapsewandattributes([
                { type: 'core', value: entry.item.meta.dqhhs },
                { type: 'quality', value: entry.item.meta.oiyq8 },
                { type: 'wood', value: entry.item.meta.efpc5 }
            ]) || '');
    }
    else if (entry.type === 'iteminhand') {
        return entry.item.meta.iteminhanditemname + '\n' +
            (entry.item.meta.iteminhanddescription || 'No description');
    }
    else if (entry.type === 'Accessory') {
        const name = entry.item.meta.accessoryname;
        const desc = entry.item.meta.accessorydescription || 'No description';
        const bonuses = getaccessorybonuses(entry);
        const profile = bonuses.length
            ? '\n\nBonuses if equipped:\n' + bonuses.join(', ')
            : '';
        return name + '\n' + desc + profile;
    }
    return '';
}

function getaccessorybonuses(entry) {
    const meta = entry.item.meta;
    const bonusList = [];
    const types = meta.accessorybonustype || [];
    const amounts = meta.accessorybonusamt || [];
    const skillBonuses = meta.accessoryskillbonus || [];
    const charBonuses = meta.accessorycharacteristicbonus || [];
    const abilityBonuses = meta.accessoryabilitybonus || [];
    const subtypeBonuses = meta.accessorysubtypebonus || [];

    for (let i = 0; i < types.length; i++) {
        let attribute;
        switch (types[i]) {
            case 'Skill':
                attribute = skillBonuses[i];
                break;
            case 'Characteristic':
                attribute = charBonuses[i];
                break;
            case 'Ability':
                attribute = abilityBonuses[i];
                break;
            case 'Subtype':
                attribute = subtypeBonuses[i];
                break;
            default:
                attribute = types[i];
        }
        if (!attribute) continue;

        const numAmt = parseFloat(amounts[i]);
        if (isNaN(numAmt)) continue;

        const sign = numAmt > 0 ? '+' : '';
        bonusList.push(attribute + ' ' + sign + numAmt);
    }

    return bonusList; // e.g. [ "Social Skills +1", "Charisma +2" ]
}
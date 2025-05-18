function getrollresult(rollobj) {
    switch (rollobj.type.toLowerCase()) {
        case "power":
        case "panache":
        case "erudition":
        case "naturalism":
            rollobj.total =
                rollobj.dice + rollobj.ability +
                rollobj.wand + rollobj.iteminhand +
                rollobj.accessories + rollobj.inventory;
            break;
        case "charms":
        case "darkarts":
        case "defense":
        case "transfiguration":
            rollobj.total =
                rollobj.dice + rollobj.ability +
                rollobj.wand + rollobj.iteminhand +
                rollobj.accessories + rollobj.inventory;
            break;
        case 'alchemy':
        case 'flying':
        case 'muggles':
        case 'runes':
        case 'divination':
        case 'arithmancy':
        case 'astronomy':
        case 'history':
        case 'potions':
        case 'artificing':
        case 'herbology':
        case 'creatures':
        case 'perception':
        case 'social':
            rollobj.total =
                (Number(rollobj.dice) || 0) +
                (Number(rollobj.ability) || 0) +
                (Number(rollobj.skill) || 0) +
                (Number(rollobj.iteminhand) || 0) +
                (Number(rollobj.accessories) || 0) +
                (Number(rollobj.inventory) || 0) +
                (Number(rollobj.trait) || 0);
            break;
        case 'fortitude':
        case 'willpower':
        case 'intellect':
        case 'creativity':
        case 'equanimity':
        case 'charisma':
        case 'attractiveness':
        case 'strength':
        case 'agility':
            let charval = getcharacteristicval(rollobj.type.toLowerCase());
            let rolls = [];
            for (let i = 0; i < charval; i++) {
                rolls.push(randbetween(1, 10));
            }

            rollobj.dice =
                rolls.reduce((total, roll) => total + roll, 0);
            rollobj.characteristicrolls = rolls;
            rollobj.accessories = getattrbvalfromaccessories(rollobj.type);

            rollobj.total =
                rollobj.dice +
                rollobj.iteminhand +
                rollobj.accessories +
                rollobj.inventory;

            break;
        case 'generosity':
        case 'wealth':
        case 'permissiveness':
            rollobj.total =
                rollobj.dice +
                rollobj.parental;
            break;
        case "spell":
            rollobj.total =
                rollobj.dice + rollobj.ability + rollobj.skill +
                rollobj.wand + rollobj.iteminhand +
                rollobj.accessories + rollobj.inventory+rollobj.trait;
            break;
        case "proficiency":
            rollobj.total =
                (Number(rollobj.dice) || 0) +
                (Number(rollobj.ability) || 0) +
                (Number(rollobj.skill) || 0) +
                (Number(rollobj.iteminhand) || 0) +
                (Number(rollobj.accessories) || 0) +
                (Number(rollobj.inventory) || 0) +
                (Number(rollobj.trait) || 0);
            break;

        case "potion":
            rollobj.total =
                rollobj.dice + rollobj.ability + rollobj.skill +
                rollobj.iteminhand + rollobj.accessories +
                rollobj.inventory;
            break;
    }

    rollobj = rolltext(rollobj); //adds the rolltext and gives back a rollobj
    addtorollhistory(rollobj);
    return rollobj;
}

function constructrollobj(type) {

    return {
        type: type.toLowerCase(),
        dice: 0,
        ability: 0,
        skill: 0,
        characteristic: 0,
        parental: 0,
        trait: 0,
        wand: 0,
        iteminhand: 0,
        accessories: 0,
        inventory: 0, //unequippable items with passive bonuses on them
        threshold: 0,
        text: '',
        total: 0
    };
}
function getrollresult(rollobj){
    switch(rollobj.type.toLowerCase()){
        case "power":
        case "panache":
        case "erudition":
        case "naturalism":
            rollobj.total=
                rollobj.dice+rollobj.ability+
                rollobj.wand+rollobj.iteminhand+
                rollobj.accessories+rollobj.inventory;
        break;
        case "charms":
        case "darkarts":
        case "defense":
        case "transfiguration":
            rollobj.total=
                rollobj.dice+rollobj.ability+
                rollobj.wand+rollobj.iteminhand+
                rollobj.accessories+rollobj.inventory;
        break;
    }

    rollobj = rolltext(rollobj); //adds the rolltext and gives back a rollobj
    addtorollhistory(rollobj);
    return rollobj;
}

function constructrollobj(type){

    return {
        type: '',
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


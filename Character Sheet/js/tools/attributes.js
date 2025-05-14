function getabilityvalue(ability) {
    ability = getname(ability, 'standard');
    const abilitybuys = getabilitybuys();
    let startval = abilitybuys.filter(val => getname(val, 'standard') === ability).length;
    let wandbonus = getabilityvalfromwand(ability);
    let wandquality = getwandqualityadjustmentforability(ability);
    let iteminhand = getabilityvalfromiteminhand(ability);
    let accessories = getattrbvalfromaccessories(ability);

    //eventually need to add in passive inventory bonuses

    return {
        base: startval,
        wandbonus: wandbonus,
        wandquality: wandquality,
        iteminhand: iteminhand,
        accessories: accessories
    }
}

function getskillvalue(skill) {
    skill = getname(skill, 'standard');
    let buys = getskillbuys().filter(val => val === getname(skill, 'standard')).length;
    let corecourses = getcorecourses().filter(val => val === getname(skill, 'standard')).length;
    let electivecourses = getelectives().filter(val => val === getname(skill, 'standard')).length;
    let wandbonus = getskillvalfromwand(skill);
    let iteminhand = getabilityvalfromiteminhand(getabilityfromskill(skill));
    let accessories = getattrbvalfromaccessories(skill);
    let eminence = geteminencebuys().filter(val => val === getname(skill, 'standard')).length;
    let wandquality = getwandqualityadjustment();
    let trait = getskillbonusfromtrait(skill);

    return {
        buys: buys,
        corecourses: corecourses,
        electivecourses: electivecourses,
        wandbonus: wandbonus,
        accessories: accessories,
        eminence: eminence,
        wandquality: wandquality,
        trait: trait,
        iteminhand: iteminhand
    };
}

// =============================

function getskillbonusfromtrait(skill) {
    let traitbonuses = getskillbonusesfromtraits();
    let totalbonus = 0;
    traitbonuses.forEach(bns => {
        if (bns.skill == skill) {
            totalbonus += Number(bns.amt);
        }
    });
    return totalbonus;
}

function getabilityvalfromiteminhand(ability) {
    const abilityLower = ability.toLowerCase();
    const iteminhand = Object.values(itemsinhand)
        .find(item => item.meta.iteminhanditemname === currentchar.meta.iteminhand);

    let totalbonus = 0;

    if (iteminhand && Array.isArray(iteminhand.meta.iteminhandabilitybonus)) {
        for (let i = 0; i < iteminhand.meta.iteminhandabilitybonus.length; i++) {
            if (iteminhand.meta.iteminhandabilitybonus[i].toLowerCase() === abilityLower) {
                totalbonus += Number(iteminhand.meta.iteminhandbonusamt[i]);
            }
        }
    }

    return totalbonus;
}

function getabilityvalfromwand(ability) {
    const effects = getwandeffects();
    const matchingeffects = effects.filter(effect =>
        effect.attribute && effect.attribute.toLowerCase().trim() === ability.toLowerCase().trim()
    );
    const sum = matchingeffects.reduce((total, effect) => total + (parseInt(effect.amt, 10) || 0), 0);
    return sum;
}

function getskillvalfromiteminhand(skill) {
    const skillLower = String(skill).toLowerCase();
    const iteminhand = Object.values(itemsinhand)
        .find(item => item.meta.iteminhanditemname === currentchar.meta.iteminhand);

    let totalbonus = 0;
    const bonuses = iteminhand?.meta?.iteminhandskillbonus;
    const amounts = iteminhand?.meta?.iteminhandbonusamt;

    if (Array.isArray(bonuses) && Array.isArray(amounts)) {
        for (let i = 0; i < bonuses.length; i++) {
            if (String(bonuses[i]).toLowerCase() === skillLower) {
                totalbonus += Number(amounts[i]);
            }
        }
    }

    return totalbonus;
}

function getsubtypevalfromiteminhand(subtype) {
    const subtypeLower = String(subtype).toLowerCase();
    const iteminhand = Object.values(itemsinhand)
        .find(item => item.meta.iteminhanditemname === currentchar.meta.iteminhand);
    if (!iteminhand) return 0;

    let totalbonus = 0;
    const bonuses = iteminhand.meta.iteminhandsubtypebonus;
    const amounts = iteminhand.meta.iteminhandbonusamt;

    if (Array.isArray(bonuses) && Array.isArray(amounts)) {
        for (let i = 0; i < bonuses.length; i++) {
            if (String(bonuses[i]).toLowerCase() === subtypeLower) {
                totalbonus += Number(amounts[i]);
            }
        }
    }

    return totalbonus;
}

function getcharacteristicvalfromiteminhand(characteristic) {
    const charLower = String(characteristic).toLowerCase();
    const iteminhand = Object.values(itemsinhand)
        .find(item => item.meta.iteminhanditemname === currentchar.meta.iteminhand);

    let totalbonus = 0;
    const bonuses = iteminhand?.meta?.iteminhandcharacteristicbonus;
    const amounts = iteminhand?.meta?.iteminhandbonusamt;

    if (Array.isArray(bonuses) && Array.isArray(amounts)) {
        for (let i = 0; i < bonuses.length; i++) {
            if (String(bonuses[i]).toLowerCase() === charLower) {
                totalbonus += Number(amounts[i]);
            }
        }
    }

    return totalbonus;
}

function getattrbvalfromaccessories(attrb) {
    attrb = getname(attrb, 'standard');
    const effects = getallaccessorybonusprofile();
    const matchingeffects = effects.filter(effect =>
        effect.attribute && effect.attribute.toLowerCase().trim() === attrb.toLowerCase().trim()
    );
    const sum = matchingeffects.reduce((total, effect) => total + (parseInt(effect.amt, 10) || 0), 0);
    return sum;
}

function getabilitybuys() {
    return [
        currentchar.meta['d2nab'], //initbuy1
        currentchar.meta['4rgqv'], //initbuy2
        currentchar.meta['zfyou'], //year1
        currentchar.meta['b466d'], //year2
        currentchar.meta['7xk5s'], //year3
        currentchar.meta['4p7kz'], //year4
        currentchar.meta['od098'], //year5
        currentchar.meta['g00g3'], //year6
        currentchar.meta['p0o5p'] //year7
    ];
}

function getskillbuys() {
    return [
        getname(currentchar.meta['tu70t'], 'standard'),
        getname(currentchar.meta['295yh'], 'standard'),
        getname(currentchar.meta['yy3sy'], 'standard'),
        getname(currentchar.meta['fe1et'], 'standard'),
        getname(currentchar.meta['olvkl'], 'standard'),
        getname(currentchar.meta['pxh6z'], 'standard'),
        getname(currentchar.meta['o4rd8'], 'standard'),
        getname(currentchar.meta['mp181'], 'standard'),
        getname(currentchar.meta['y6x1n'], 'standard'),
        getname(currentchar.meta['lbg6a'], 'standard'),
        getname(currentchar.meta['by0y'], 'standard'),
        getname(currentchar.meta['ws3kt'], 'standard'),
        getname(currentchar.meta['38wnu'], 'standard'),
        getname(currentchar.meta['fxzo'], 'standard'),
        getname(currentchar.meta['kfo7o'], 'standard'),
        getname(currentchar.meta['dbc3s'], 'standard'),
        getname(currentchar.meta['f3ef7'], 'standard'),
    ];
}

function geteminencebuys() {
    if(currentchar.meta['ixbnr']){
    return currentchar.meta['ixbnr'].map(name => getname(name, 'standard'));
    }else{
        return [];
    }
}

function getcorecourses() {
    const coreKeys = ['8f03b', 'njcra', 'mrbb3', 'vd8s6', 'sv4hr', 'dz83x', 'n8pqz'];
    let courses = [];
    coreKeys.forEach(key => {
        if (currentchar.meta[key] && currentchar.meta[key].trim() !== "") {
            let names = currentchar.meta[key]
                .split(', ')
                .map(name => getname(name, 'standard'))
                .filter(name => name && name.trim() !== "");
            courses.push(...names);
        }
    });
    return courses;
}

function getelectives() {
    const electiveKeys = ['electives1', 'electives2', 'electives3', 'electives4', 'electives5', 'electives6', 'electives7'];
    let courses = [];
    electiveKeys.forEach(key => {
        if (currentchar.meta[key] && Array.isArray(currentchar.meta[key])) {
            let names = currentchar.meta[key]
                .map(name => getname(name, 'standard'))
                .filter(name => name && name.trim() !== "");
            courses.push(...names);
        }
    });
    return courses;
}

function getskillvalfromwand(skill) {
    const standardSkill = getname(skill, 'standard').toLowerCase().trim();
    const effects = getwandeffects();
    const matchingeffects = effects.filter(effect =>
        effect.attribute && getname(effect.attribute.toLowerCase().trim(), 'standard') === standardSkill
    );
    const sum = matchingeffects.reduce((total, effect) => total + (parseInt(effect.amt, 10) || 0), 0);
    return sum;
}

function getcharacteristicval(characteristic) {
    const values = getcharacteristics();
    const normalized = String(characteristic).trim().toLowerCase();

    for (const [key, value] of Object.entries(values)) {
        if (key.toLowerCase() === normalized) {
            return value;
        }
    }

    console.warn(`getcharacteristicval: unknown characteristic "${characteristic}"`);
    return 0;
}

function getcharacteristics() {
    return {
        creativity: currentchar.meta['creativity'],
        equanimity: currentchar.meta['equanimity'],
        charisma: currentchar.meta['charisma'],
        attractiveness: currentchar.meta['attractiveness'],
        strength: currentchar.meta['strength'],
        agility: currentchar.meta['agility'],
        intellect: currentchar.meta['intellect'],
        willpower: currentchar.meta['willpower'],
        fortitude: currentchar.meta['fortitude']
    }
}

function getparental() {
    return {
        generosity: Number(currentchar.meta['generosity2']),
        permissiveness: Number(currentchar.meta['permissiveness']),
        wealth: Number(currentchar.meta['wealth2'])
    }
}

function getequipment() {
    return {
        wand: currentchar.meta['bru22'],
        acc1: currentchar.meta['qb029'],
        acc2: currentchar.meta['vykq1']
    }
}

function getabilityfromskill(skill) {
    switch (skill.toLowerCase()) {
        case 'charms':
        case 'defense':
        case 'darkarts':
        case 'transfiguration':
            return 'Power';

        case 'runes':
        case 'arithmancy':
        case 'muggles':
        case 'history':
            return 'Erudition';

        case 'flying':
        case 'alchemy':
        case 'potions':
        case 'artificing':
        case 'herbology':
            return 'Panache';

        case 'astronomy':
        case 'divination':
        case 'creatures':
        case 'perception':
        case 'social':
            return 'Naturalism';


        default:
            return null;
    }
}

function gettotalsubtypebonus(rollobj) {
    return getsubtypebonusesfromtraits()
      .reduce((sum, bonus) => {
        return bonus.subtype === rollobj.subtype
          ? sum + bonus.amt
          : sum;
      }, 0);
  }
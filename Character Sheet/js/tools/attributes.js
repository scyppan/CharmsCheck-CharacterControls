function getabilityvalue(ability) {
    ability = getname(ability, 'standard');
    const abilitybuys = getabilitybuys();
    let startval = abilitybuys.filter(val => getname(val, 'standard') === ability).length;
    let wand = getabilityvalfromwand(ability);
    let iteminhand = getabilityvalfromiteminhand(ability);
    let accessories = getattrbvalfromaccessories(ability);

    //eventually need to add in passive inventory bonuses

    return {
        base: startval,
        wand: wand,
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
    let accessories = getattrbvalfromaccessories(skill);
    let eminence = geteminencebuys().filter(val => val === getname(skill, 'standard')).length;

    let wandquality = getwandqualityadjustment();

    return {
        buys: buys,
        corecourses: corecourses,
        electivecourses: electivecourses,
        wandbonus: wandbonus,
        accessories: accessories,
        eminence: eminence,
        wandquality: wandquality
    };
}

// =============================

function getabilityvalfromiteminhand(ability) {
    let iteminhand = Object.values(itemsinhand).find(item => item.meta.iteminhanditemname == currentchar.meta.iteminhand);
    let totalbonus = 0;

    if (iteminhand) {


        for (let i = 0; i < iteminhand.meta.iteminhandbonustype.length; i++) {
            if (iteminhand.meta.iteminhandabilitybonus[i] == ability) {
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
    return currentchar.meta['ixbnr'].map(name => getname(name, 'standard'));
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
        generosity: currentchar.meta['generosity2'],
        permissiveness: currentchar.meta['permissiveness'],
        wealth: currentchar.meta['wealth2']
    }
}

function getequipment() {
    return {
        wand: currentchar.meta['bru22'],
        acc1: currentchar.meta['qb029'],
        acc2: currentchar.meta['vykq1']
    }
}
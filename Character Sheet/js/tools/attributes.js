function getabilityvalue(ability) {
    const abilitybuys = getabilitybuys();
    return getabilitybuys().filter(val => val === ability).length;
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

function getskillvalue(skill) {

    return getskillbuys().filter(val => val === getname(skill, 'standard')).length;
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
        ...currentchar.meta['ixbnr'].map(name => getname(name, 'standard')),
        ...getcourses()
    ];
}

function getcourses(){

    return [
    
    ...currentchar.meta['8f03b'].split(', ').map(name => getname(name, 'standard')), // year1core
    ...currentchar.meta['njcra'].split(', ').map(name => getname(name, 'standard')), // year2core
    ...currentchar.meta['mrbb3'].split(', ').map(name => getname(name, 'standard')), // year3core
    ...currentchar.meta['vd8s6'].split(', ').map(name => getname(name, 'standard')), // year4core
    ...currentchar.meta['sv4hr'].split(', ').map(name => getname(name, 'standard')), // year5core
    ...currentchar.meta['dz83x'].split(', ').map(name => getname(name, 'standard')), // year6core
    ...currentchar.meta['n8pqz'].split(', ').map(name => getname(name, 'standard')), // year7core    

    ...currentchar.meta['electives1'].map(name => getname(name, 'standard')), // electives1
    ...currentchar.meta['electives2'].map(name => getname(name, 'standard')), // electives2
    ...currentchar.meta['electives3'].map(name => getname(name, 'standard')), // electives3
    ...currentchar.meta['electives4'].map(name => getname(name, 'standard')), // electives4
    ...currentchar.meta['electives5'].map(name => getname(name, 'standard')), // electives5
    ...currentchar.meta['electives6'].map(name => getname(name, 'standard')), // electives6
    ...currentchar.meta['electives7'].map(name => getname(name, 'standard')), // electives7   

    ]
}

function getcharacteristics(){
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

function getparental(){
    return {
        generosity: currentchar.meta['generosity2'],
        permissiveness: currentchar.meta['permissiveness'],
        wealth: currentchar.meta['wealth2']
    }
}

function getequipment(){
    return {
        wand: currentchar.meta['bru22'],
        acc1: currentchar.meta['qb029'],
        acc2: currentchar.meta['vykq1']
    }
}
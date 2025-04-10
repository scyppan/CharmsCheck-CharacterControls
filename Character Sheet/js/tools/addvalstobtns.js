function addvalstobtns(){
    let buttonassignments = getbuttonassignments();

    
}

function getbuttonassignments(){
    return {
        power: document.getElementById('Power'),
        charms: document.getElementById('Charms'),
        darkarts: document.getElementById('Dark Arts'),
        defense: document.getElementById('Defense'),
        transfiguration: document.getElementById('Transfiguration'),

        erudition: document.getElementById('Erudition'),
        runes: document.getElementById('Runes'),
        arithmancy: document.getElementById('Arithmancy'),
        muggles: document.getElementById('Muggles'),
        history: document.getElementById('History'),

        naturalism: document.getElementById('Naturalism'),
        astronomy: document.getElementById('Astronomy'),
        divination: document.getElementById('Divination'),
        creatures: document.getElementById('Creatures'),
        perception: document.getElementById('Perception'),
        social: document.getElementById('Social Skills'),

        panache: document.getElementById('Panache'),
        flying: document.getElementById('Flying'),
        alchemy: document.getElementById('Alchemy'),
        potions: document.getElementById('Potions'),
        artificing: document.getElementById('Artificing'),
        herbology: document.getElementById('Herbology'),

        fortitude: document.getElementById('Fortitude'),
        willpower: document.getElementById('Willpower'),
        intellect: document.getElementById('Intellect'),
        creativity: document.getElementById('Creativity'),
        equanimity: document.getElementById('Equanimity'),
        charisma: document.getElementById('Charisma'),
        attractiveness: document.getElementById('Attractiveness'),
        strength: document.getElementById('Strength'),
        agility: document.getElementById('Agility')
    }
}
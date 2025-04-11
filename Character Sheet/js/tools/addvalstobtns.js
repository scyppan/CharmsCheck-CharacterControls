function addvalstobtns() {
    let buttonassignments = getbuttonassignments();
    let abilities = getabilities();
    let skills = getskills();
    let characteristics = getcharacteristics();
    let parental = getparental();

    updateabilitybuttons(abilities, buttonassignments);
    updateskillbuttons(skills, buttonassignments);
    updatecharacteristicstobtns(characteristics, buttonassignments);
    updateparentalbuttons(parental, buttonassignments);
}

// =============================

function updatecharacteristicstobtns(characteristics, buttonassignments) {
    Object.entries(characteristics).forEach(([trait, value]) => {
      if (buttonassignments[trait]) {
        const val = Number(value) || 0;
        buttonassignments[trait].innerHTML = `${getname(trait, 'display')} ${val}d10`;
        buttonassignments[trait].title = `${getname(trait, 'display')}: ${val}`;
        buttonassignments[trait].dataset.total = val;
      }
    });
  }  

function getabilities() {
    let powerval = getabilityvalue("power");
    let eruditionval = getabilityvalue("erudition");
    let naturalismval = getabilityvalue("naturalism");
    let panacheval = getabilityvalue("panache");

    return {
        power: powerval,
        erudition: eruditionval,
        naturalism: naturalismval,
        panache: panacheval
    };
}

function getskills() {
    let charmsval = getskillvalue("charms");
    let transfigurationval = getskillvalue("transfiguration");
    let defenseval = getskillvalue("defense");
    let darkartsval = getskillvalue("dark arts");
    let runesval = getskillvalue("runes");
    let arithmancyval = getskillvalue("arithmancy");
    let mugglesval = getskillvalue("muggles");
    let historyval = getskillvalue("history");
    let astronomyval = getskillvalue("astronomy");
    let divinationval = getskillvalue("divination");
    let creaturesval = getskillvalue("creatures");
    let perceptionval = getskillvalue("perception");
    let socialval = getskillvalue("social");
    let flyingval = getskillvalue("flying");
    let alchemyval = getskillvalue("alchemy");
    let potionsval = getskillvalue("potions");
    let artificingval = getskillvalue("artificing");
    let herbologyval = getskillvalue("herbology");

    return {
        charms: charmsval,
        transfiguration: transfigurationval,
        defense: defenseval,
        darkarts: darkartsval,
        runes: runesval,
        arithmancy: arithmancyval,
        muggles: mugglesval,
        history: historyval,
        astronomy: astronomyval,
        divination: divinationval,
        creatures: creaturesval,
        perception: perceptionval,
        social: socialval,
        flying: flyingval,
        alchemy: alchemyval,
        potions: potionsval,
        artificing: artificingval,
        herbology: herbologyval
    };
}

function updateabilitybuttons(abilities, buttonassignments) {
    Object.entries(abilities).forEach(([stat, { base, wand, accessories }]) => {
      const baseval = Number(base) || 0;
      const wandval = Number(wand) || 0;
      const accval = Number(accessories) || 0;
      const equipment = wandval + accval;
      const bonustext = equipment !== 0
        ? (equipment > 0 ? ` (+${equipment})` : ` (${equipment})`)
        : "";
      const total = baseval + equipment;
      buttonassignments[stat].textContent = `${getname(stat, 'display')} ${baseval}${bonustext}`;
      buttonassignments[stat].title = `base: ${baseval}\nwand: ${wandval}\naccessories: ${accval}`;
      buttonassignments[stat].dataset.total = total;
    });
  }
  

  function updateskillbuttons(skills, buttonassignments) {
    // Get all trait bonuses once.
    const traitbonuses = getskillbonusesfromtraits();
  
    Object.entries(skills).forEach(([skill, { buys, corecourses, electivecourses, wandbonus, accessories, eminence, wandquality }]) => {
      const includequality = (skill === "transfiguration" || skill === "charms" || skill === "darkarts" || skill === "defense");
      const quality = includequality ? Number(wandquality) || 0 : 0;
      
      // Calculate base without eminence bonus.
      const basewithouteminence = (Number(buys) || 0) + (Number(corecourses) || 0) + (Number(electivecourses) || 0);
      let finalbase = basewithouteminence;
      
      // *** TRAIT BONUS CALCULATION ***
      // Filter trait bonuses matching the standardized skill name and sum their amounts.
      const traitbonus = traitbonuses
        .filter(tb => getname(tb.skill, 'standard') === getname(skill, 'standard'))
        .reduce((sum, tb) => sum + (Number(tb.amt) || 0), 0);
      finalbase += traitbonus;
      
      // For muggles, add a background bonus (always show it in title even if 0).
      let backgroundbonus = 0;
      let backgroundtext = "";
      if (skill === "muggles") {
        if (currentchar.meta.bloodstatus) {
          const bloodstatus = currentchar.meta.bloodstatus.toLowerCase().trim();
          if (bloodstatus === "muggleborn" || bloodstatus === "muggle-raised halfblood") {
            backgroundbonus = 10;
          }
        }
        backgroundtext = `background: ${backgroundbonus}\n`;
        finalbase += backgroundbonus;
      }
      
      // Add eminence last.
      finalbase += Number(eminence) || 0;
      
      const equipment = (Number(wandbonus) || 0) + (Number(accessories) || 0) + quality;
      const bonustext = equipment !== 0 
        ? (equipment > 0 ? ` (+${equipment})` : ` (${equipment})`)
        : "";
        
      const total = finalbase + equipment;
      
      buttonassignments[skill].textContent = `${getname(skill, 'display')} ${finalbase}${bonustext}`;
      buttonassignments[skill].title =
        backgroundtext +
        `buys: ${buys}\n` +
        `corecourses: ${corecourses}\n` +
        `electivecourses: ${electivecourses}\n` +
        `trait bonus: ${traitbonus}\n` + // Shows the trait bonus sum.
        `wandbonus: ${wandbonus}\n` +
        `accessories: ${accessories}\n` +
        `eminence: ${eminence}\n` +
        (includequality ? `wandquality: ${wandquality}\n` : "");
        
      buttonassignments[skill].dataset.total = total;
    });
  }  
  
  function updateparentalbuttons(parental, buttonassignments) {
 
    Object.entries(parental).forEach(([trait, value]) => {
      if (buttonassignments[trait]) {
        const val = Number(value) || 0;
        buttonassignments[trait].textContent = `${getname(trait, 'display')} ${val}`;
        buttonassignments[trait].title = `${getname(trait, 'display')}: ${val}`;
        buttonassignments[trait].dataset.total = val;
      }
    });
  }

function getbuttonassignments() {
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
        agility: document.getElementById('Agility'),

        generosity: document.getElementById('Generosity'),
        permissiveness: document.getElementById('Permissiveness'),
        wealth: document.getElementById('Wealth')
    }
}


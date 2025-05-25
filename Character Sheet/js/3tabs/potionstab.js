// ————— Tab loader remains the same —————
async function potionstab() {
  const tabcontent = document.getElementById('tabcontent');
  tabcontent.textContent = 'Fetching API Data 1/11...'; await getpotions(true);
  tabcontent.textContent = 'Fetching API Data 2/11...'; await gettraits(true);
  tabcontent.textContent = 'Fetching API Data 3/11...'; await getwands(true);
  tabcontent.textContent = 'Fetching API Data 4/11...'; await getaccessories(true);
  tabcontent.textContent = 'Fetching API Data 5/11...'; await getwandwoods(true);
  tabcontent.textContent = 'Fetching API Data 6/11...'; await getwandcores(true);
  tabcontent.textContent = 'Fetching API Data 7/11...'; await getwandqualities(true);
  tabcontent.textContent = 'Fetching API Data 8/11...'; await getitemsinhand(true);
  tabcontent.textContent = 'Fetching API Data 9/11...'; await getitems(true);
  tabcontent.textContent = 'Fetching API Data 10/11...'; await getgeneralitems(true);
  tabcontent.textContent = 'Fetching API Data 11/11...'; await getbooks(true);


    renderpotionstabui();
    loadfavoritepotions(); // default view
    activatePotionTab('btnpotfavorites');
}

// ————— Favorites: grouped by Skill → Difficulty —————
function loadfavoritepotions() {
    const mini = document.getElementById('potionminiwindow');
    mini.textContent = '';

    const favorites = getknownpotions();
    // bucket by skill (undefined → "None")
    const bySkill = favorites.reduce((acc, p) => {
        const rec   = Object.values(potions).find(r => r.meta.potionname === p.potionname);
        const skill = rec?.meta.potionskill || 'Undefined';
        (acc[skill] ||= []).push(p);
        return acc;
    }, {});

    Object.keys(bySkill)
        .sort((a, b) => a.localeCompare(b))
        .forEach(skill => {
            const skillDetails = document.createElement('details');
            skillDetails.className = 'potion-category byskill favorites';

            const skillSummary = document.createElement('summary');
            skillSummary.textContent = skill;
            skillDetails.appendChild(skillSummary);

            // within each skill, group by difficulty
            const byDifficulty = bySkill[skill].reduce((acc, p) => {
                (acc[p.difficulty] ||= []).push(p);
                return acc;
            }, {});

            Object.keys(byDifficulty)
                .map(Number)
                .sort((a, b) => a - b)
                .forEach(difficulty => {
                    const groupDiv = document.createElement('div');
                    groupDiv.className = 'difficulty-group';

                    const label = document.createElement('div');
                    label.className = 'difficulty-label';
                    label.textContent = `Difficulty ${difficulty}`;
                    groupDiv.appendChild(label);

                    byDifficulty[difficulty].forEach(p =>
                        groupDiv.appendChild(createpotionplate(p.potionname))
                    );

                    skillDetails.appendChild(groupDiv);
                });

            mini.appendChild(skillDetails);
        });

    if (!mini.hasChildNodes()) {
        mini.textContent = 'No potions to display';
    }
}

// ————— By Difficulty: grouped by Skill → Difficulty —————
function loadbypotiondifficulty() {
    const mini = document.getElementById('potionminiwindow');
    mini.textContent = '';

    const all = getcompletepotionslist();
    // bucket by skill
    const bySkill = all.reduce((acc, p) => {
        const skill = p.skill || (Object.values(potions).find(r => r.meta.potionname === p.potionname)?.meta.potionskill) || 'None';
        (acc[skill] ||= []).push(p);
        return acc;
    }, {});

    Object.keys(bySkill)
        .sort((a, b) => a.localeCompare(b))
        .forEach(skill => {
            const skillDetails = document.createElement('details');
            skillDetails.className = 'potion-category byskill bydifficulty';

            const skillSummary = document.createElement('summary');
            skillSummary.textContent = skill;
            skillDetails.appendChild(skillSummary);

            // within each skill, bucket by difficulty
            const byDifficulty = bySkill[skill].reduce((acc, p) => {
                (acc[p.difficulty] ||= []).push(p);
                return acc;
            }, {});

            Object.keys(byDifficulty)
                .map(Number)
                .sort((a, b) => a - b)
                .forEach(difficulty => {
                    const groupDiv = document.createElement('div');
                    groupDiv.className = 'difficulty-group';

                    const label = document.createElement('div');
                    label.className = 'difficulty-label';
                    label.textContent = `Difficulty ${difficulty}`;
                    groupDiv.appendChild(label);

                    byDifficulty[difficulty].forEach(p =>
                        groupDiv.appendChild(createpotionplate(p.potionname))
                    );

                    skillDetails.appendChild(groupDiv);
                });

            mini.appendChild(skillDetails);
        });

    if (!mini.hasChildNodes()) {
        mini.textContent = 'No potions to display';
    }
}

// ————— By Book: grouped by Skill → Source → Difficulty —————
function loadbypotionbook() {
    const mini = document.getElementById('potionminiwindow');
    mini.textContent = '';

    const all = getcompletepotionslist();
    // bucket by skill
    const bySkill = all.reduce((acc, p) => {
        const skill = p.skill || (Object.values(potions).find(r => r.meta.potionname === p.potionname)?.meta.potionskill) || 'None';
        (acc[skill] ||= []).push(p);
        return acc;
    }, {});

    Object.keys(bySkill)
        .sort((a, b) => a.localeCompare(b))
        .forEach(skill => {
            const skillDetails = document.createElement('details');
            skillDetails.className = 'potion-category byskill';

            const skillSummary = document.createElement('summary');
            skillSummary.textContent = skill;
            skillDetails.appendChild(skillSummary);

            // within each skill, list sources
            const sources = Array.from(
                new Set(bySkill[skill].map(p => p.source).filter(src => src))
            );
            sources.forEach(source => {
                const bookPotions = bySkill[skill].filter(p => p.source === source);
                if (!bookPotions.length) return;

                const bookDetails = document.createElement('details');
                bookDetails.className = 'potion-category bybook';

                const bookSummary = document.createElement('summary');
                bookSummary.textContent = source;
                bookDetails.appendChild(bookSummary);

                // within each source, bucket by difficulty
                const byDifficulty = bookPotions.reduce((acc, p) => {
                    (acc[p.difficulty] ||= []).push(p);
                    return acc;
                }, {});

                Object.keys(byDifficulty)
                    .map(Number)
                    .sort((a, b) => a - b)
                    .forEach(difficulty => {
                        const groupDiv = document.createElement('div');
                        groupDiv.className = 'difficulty-group';

                        const label = document.createElement('div');
                        label.className = 'difficulty-label';
                        label.textContent = `Difficulty ${difficulty}`;
                        groupDiv.appendChild(label);

                        byDifficulty[difficulty].forEach(p =>
                            groupDiv.appendChild(createpotionplate(p.potionname))
                        );

                        bookDetails.appendChild(groupDiv);
                    });

                skillDetails.appendChild(bookDetails);
            });

            mini.appendChild(skillDetails);
        });

    if (!mini.hasChildNodes()) {
        mini.textContent = 'No potions to display';
    }
}


// ————— UI bar with only Favorites, Difficulty, Source —————
function renderpotionstabui() {
    const tabcontent = document.getElementById('tabcontent');
    tabcontent.textContent = '';

    const buttonbar = document.createElement('div');
    buttonbar.id = 'potiontabbuttonbar';

    const btnfav = document.createElement('button');
    btnfav.id = 'btnpotfavorites';
    btnfav.textContent = 'Favorites';
    btnfav.addEventListener('click', () => {
        activatePotionTab('btnpotfavorites');
        loadfavoritepotions();
    });

    const btnDiff = document.createElement('button');
    btnDiff.id = 'btnpotbydifficulty';
    btnDiff.textContent = 'By Difficulty';
    btnDiff.addEventListener('click', () => {
        activatePotionTab('btnpotbydifficulty');
        loadbypotiondifficulty();
    });

    const btnBook = document.createElement('button');
    btnBook.id = 'btnpotbybook';
    btnBook.textContent = 'By Source';
    btnBook.addEventListener('click', () => {
        activatePotionTab('btnpotbybook');
        loadbypotionbook();
    });

    buttonbar.append(btnfav, btnDiff, btnBook);
    tabcontent.appendChild(buttonbar);

    const mini = document.createElement('div');
    mini.id = 'potionminiwindow';
    tabcontent.appendChild(mini);
}

function createpotionplate(potionname) {
  // 1) Look up the full potion record
  const record = Object.values(potions)
    .find(p => p.meta.potionname === potionname);
  if (!record) throw new Error(`Potion "${potionname}" not found`);

  // 2) Pull out all the fields we need, with fallbacks for missing values
  const name           = record.meta.potionname;
  const skill          = record.meta.potionskill    || '';
  const typelabel      = skill === 'Potions'
                         ? 'Standard Potion'
                         : 'Alchemical Potion';
  const difficulty     = Number(record.meta.potionthreshold);
  let description      = record.meta.qs2u8           || '';
  let raweffect        = record.meta.potionraweffect || '';
  let detailedeffect   = record.meta.ag82a           || '';
  const profs          = Array.isArray(record.meta.potionrequiredproficiencies)
                         ? record.meta.potionrequiredproficiencies
                         : [];
  const ingredients    = Array.isArray(record.meta.potioningredient)
                         ? record.meta.potioningredient
                         : [];
  const brewtime       = record.meta.potionbrewtime  || '';

  // 2a) Default text for missing or trivial fields
  if (!description.trim() || description.trim() === '.') {
    description = 'No description';
  }
  if (!raweffect.trim() || raweffect.trim() === '.') {
    raweffect = 'No raw effect';
  }
  if (!detailedeffect.trim() || detailedeffect.trim() === '.') {
    detailedeffect = 'No detailed effect';
  }

  // 3) Build the button
  const btn = document.createElement('button');
  btn.type      = 'button';
  btn.className = 'potion-plate';
  btn.textContent = name;

  // 4) Build tooltip/title
  const proftext = profs.length ? profs.join(', ') : 'None';
  const ingtext  = ingredients.length ? ingredients.join(', ') : 'DETERMINED BY HEADMASTER';

  const titleText =
    `${name} (${typelabel} | ${difficulty})\n` +
    `Proficiencies: ${proftext}\n` +
    `Ingredients:    ${ingtext}\n` +
    `Brew Time:      ${brewtime}\n` +
    `${description}\n\n` +
    `Raw Effect:\n${raweffect}\n\n` +
    `${detailedeffect}`;

  btn.title = titleText;

  // 5) Store metadata in data-attributes
  btn.dataset.potionname = potionname;
  btn.dataset.skill      = skill;
  btn.dataset.threshold  = difficulty.toString();

  // 6) Attach the roll-listener
  attachpotionroll(btn);

  return btn;
}

function printpotiondescription(btn) {
    console.log(btn.title);
}

function activatePotionTab(tabId) {
    const kids = document.querySelectorAll('#potiontabbuttonbar > button');
    kids.forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// ————— Tab loader remains the same —————
async function potionstab() {
    const tabcontent = document.getElementById('tabcontent');
    tabcontent.textContent = 'Fetching API Data 1/2...';
    await getpotions(true);
    tabcontent.textContent = 'Fetching API Data 2/2...';
    await getbooks(true);

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
    const record = Object.values(potions)
        .find(p => p.meta.potionname === potionname);
    if (!record) throw new Error(`Potion "${potionname}" not found`);

    const desc        = record.meta.qs2u8;
    const difficulty  = Number(record.meta.potionthreshold);
    const ingredients = record.meta.potioningredient;
    const effects     = record.meta.ag82a;
    const favorite = getknownpotions()
      .find(p => p.potionname === potionname && p.favorite === 'Yes');

    const btn = document.createElement('button');
    btn.className   = 'potion-plate';
    btn.textContent = potionname;

    const titleLines = [];
    titleLines.push(`${potionname} (${difficulty})`);
    titleLines.push(desc);
    if (ingredients) titleLines.push(`Ingredients: ${ingredients}`);
    if (effects)     titleLines.push(`Effects: ${effects}`);
    btn.title = titleLines.join("\n");

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

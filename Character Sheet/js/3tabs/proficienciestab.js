async function proficiencestab() {
    const tabcontent = document.getElementById('tabcontent');
    tabcontent.textContent = 'Fetching API Data 1/2...';
    await getproficiencies(true);
    tabcontent.textContent = 'Fetching API Data 2/2...';
    await getbooks(true);

    renderproficienciestabui();
    loadfavoriteproficiencies();      // default view
    activateProficiencyTab('btnproffavorites');
}

function loadfavoriteproficiencies() {
    const mini = document.getElementById('proficiencyminiwindow');
    mini.textContent = '';

    const favorites = getknownproficiencies();
    SKILL_ORDER.forEach(category => {
        const grp = favorites.filter(p => p.skill === category);
        if (!grp.length) return;

        const details = document.createElement('details');
        details.className = 'proficiency-category favorites';

        const summary = document.createElement('summary');
        summary.textContent = category;
        details.appendChild(summary);

        const byDifficulty = grp.reduce((acc, p) => {
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
                    groupDiv.appendChild(createproficiencyplate(p.proficiencyname))
                );
                details.appendChild(groupDiv);
            });

        mini.appendChild(details);
    });

    if (!mini.hasChildNodes()) {
        mini.textContent = 'No proficiencies to display';
    }
}

function loadbyproficiencyskill() {
    const mini = document.getElementById('proficiencyminiwindow');
    mini.textContent = '';

    const all = getcompleteproficiencieslist();
    SKILL_ORDER.forEach(skillName => {
        const skillProfs = all.filter(p => p.skill === skillName);
        if (!skillProfs.length) return;

        const details = document.createElement('details');
        details.className = 'proficiency-category byskill';

        const summary = document.createElement('summary');
        summary.textContent = skillName;
        details.appendChild(summary);

        const byDifficulty = skillProfs.reduce((acc, p) => {
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
                    groupDiv.appendChild(createproficiencyplate(p.proficiencyname))
                );
                details.appendChild(groupDiv);
            });

        mini.appendChild(details);
    });

    if (!mini.hasChildNodes()) {
        mini.textContent = 'No proficiencies to display';
    }
}

function loadbyproficiencybook() {
    const mini = document.getElementById('proficiencyminiwindow');
    mini.textContent = '';

    const all = getcompleteproficiencieslist();
    SKILL_ORDER.forEach(skillName => {
        const profs = all.filter(p => p.skill === skillName);
        if (!profs.length) return;

        const skillDetails = document.createElement('details');
        skillDetails.className = 'proficiency-category';
        const skillSummary = document.createElement('summary');
        skillSummary.textContent = skillName;
        skillDetails.appendChild(skillSummary);

        const sources = Array.from(
            new Set(profs.map(p => p.source).filter(src => src))
        );
        sources.forEach(source => {
            const subset = profs.filter(p => p.source === source);
            if (!subset.length) return;

            const bookDetails = document.createElement('details');
            bookDetails.className = 'proficiency-category bybook';
            const bookSummary = document.createElement('summary');
            bookSummary.textContent = source;
            bookDetails.appendChild(bookSummary);

            const byDifficulty = subset.reduce((acc, p) => {
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
                        groupDiv.appendChild(createproficiencyplate(p.proficiencyname))
                    );
                    bookDetails.appendChild(groupDiv);
                });

            skillDetails.appendChild(bookDetails);
        });

        mini.appendChild(skillDetails);
    });

    if (!mini.hasChildNodes()) {
        mini.textContent = 'No proficiencies to display';
    }
}

function renderproficienciestabui() {
    const tabcontent = document.getElementById('tabcontent');
    tabcontent.textContent = '';

    const buttonbar = document.createElement('div');
    buttonbar.id = 'proficiencytabbuttonbar';

    const btnfav = document.createElement('button');
    btnfav.id = 'btnproffavorites';
    btnfav.textContent = 'Favorites';
    btnfav.addEventListener('click', () => {
        activateProficiencyTab('btnproffavorites');
        loadfavoriteproficiencies();
    });

    const btnSkill = document.createElement('button');
    btnSkill.id = 'btnprofbyskill';
    btnSkill.textContent = 'By Skill';
    btnSkill.addEventListener('click', () => {
        activateProficiencyTab('btnprofbyskill');
        loadbyproficiencyskill();
    });

    const btnBook = document.createElement('button');
    btnBook.id = 'btnprofbybook';
    btnBook.textContent = 'By Source';
    btnBook.addEventListener('click', () => {
        activateProficiencyTab('btnprofbybook');
        loadbyproficiencybook();
    });

    buttonbar.append(btnfav, btnSkill, btnBook);
    tabcontent.appendChild(buttonbar);

    const mini = document.createElement('div');
    mini.id = 'proficiencyminiwindow';
    tabcontent.appendChild(mini);
}

function createproficiencyplate(proficiencyname) {
    const record = Object.values(proficiencies)
        .find(p => p.meta.proficiencyname === proficiencyname);
    if (!record) throw new Error(`Proficiency "${proficiencyname}" not found`);

    const desc       = record.meta.e3usn;
    const skill      = getname(record.meta.s71z0, 'standard');
    const difficulty = Number(record.meta.ipjf3);
    const prereqs    = record.meta.nt3s3;
    const items      = record.meta.aiwl3;
    const known      = getknownproficiencies().find(p => p.proficiencyname === proficiencyname);
    const source     = known?.source || '';

    const btn = document.createElement('button');
    btn.className   = 'proficiency-plate';
    btn.textContent = proficiencyname;

    const titleLines = [
        `${proficiencyname} (${skill}; ${difficulty})`,
        desc
    ];
    if (prereqs) titleLines.push(`Prereqs: ${prereqs}`);
    if (items)   titleLines.push(`Items: ${items}`);
    if (source)  titleLines.push(`Source: ${source}`);
    btn.title = titleLines.join('\n');

    attachproficiencyroll(btn);

    btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
        }
    });

    return btn;
}

function printproficiencydescription(btn) {
    console.log(btn.title);
}

function activateProficiencyTab(tabId) {
    const kids = document.querySelectorAll('#proficiencytabbuttonbar > button');
    kids.forEach(b => b.classList.remove('active'));    
    document.getElementById(tabId).classList.add('active');
}

async function relationshiptab() {
    const tabcontent = document.getElementById('tabcontent');
    tabcontent.textContent = 'Loading relationships...';

    const relationships = getcompleterelationshiplist();
    if (!relationships.length) {
        tabcontent.textContent = 'No relationships found.';
        return;
    }

    const categoryMap = {
        'Acquaintance': ['Acquaintances'],
        'Friend': ['Friends'],
        'Romantic interest': ['Friends'],
        'Romantic partner': ['Friends'],
        'Former romantic interest': ['Friends'],
        'Former romantic partner': ['Friends'],
        'Parent': ['Family'],
        'Child': ['Family'],
        'Extended family': ['Family'],
        'Mentor': ['Advisors'],
        'Leader': ['Advisors'],
        'Caretaker': ['Advisors'],
        'Revengee': ['Enemies'],
        'Enemy': ['Enemies'],
        'Nemesis': ['Enemies'],
        'Rival': ['Enemies'],
        'Opponent': ['Enemies'],
        'Roommate': ['Acquaintances'],
        'Coworker': ['Business', 'Acquaintances'],
        'Teammate': ['Acquaintances'],
        'Boss': ['Business'],
        'Employee': ['Business'],
        'Fan': ['Followers'],
        'Parasocial': ['Followers'],
        'Client': ['Business'],
        'Service provider': ['Business'],
        'Business partner': ['Business'],
    };

    // Categorize into overlapping categories
    const grouped = {};
    for (const rel of relationships) {
        const cats = categoryMap[rel.type] || ['Other'];
        for (const cat of cats) {
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(rel);
        }
    }

    // Filter categories with at least two relationships
    const filtered = Object.entries(grouped).filter(([_, list]) => list.length >= 2);
    const hasMulti = filtered.length > 0;

    let finalMap = {};

    if (!hasMulti) {
        finalMap = { 'All Relationships': relationships };
    } else {
        // Keep only categories with 2+ and group all others in "Other"
        for (const [cat, rels] of Object.entries(grouped)) {
            if (rels.length >= 2) finalMap[cat] = rels;
        }

        const other = relationships.filter(rel => {
            const cats = categoryMap[rel.type] || ['Other'];
            return !cats.some(cat => finalMap[cat]);
        });

        if (other.length) finalMap['Other'] = other;
    }

    renderRelationshipTabUI(finalMap);
}

function renderRelationshipTabUI(categoryMap) {
    const tabcontent = document.getElementById('tabcontent');
    tabcontent.textContent = '';

    const buttonBar = document.createElement('div');
    buttonBar.id = 'relationshiptabbuttonbar';

    const contentDiv = document.createElement('div');
    contentDiv.id = 'relationshipcontent';

    const keys = Object.keys(categoryMap);
    keys.forEach((cat, idx) => {
        const btn = document.createElement('button');
        btn.id = 'btn' + cat.replace(/\s+/g, '');
        btn.textContent = cat;
        btn.addEventListener('click', () => {
            buttonBar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderRelationshipCategory(contentDiv, cat, categoryMap[cat]);
        });
        buttonBar.appendChild(btn);
    });

    tabcontent.appendChild(buttonBar);
    tabcontent.appendChild(contentDiv);

    // Activate first tab
    document.getElementById('btn' + keys[0].replace(/\s+/g, '')).classList.add('active');
    renderRelationshipCategory(contentDiv, keys[0], categoryMap[keys[0]]);
}

function renderRelationshipCategory(container, title, rels) {
    container.textContent = '';

    // Group relationships by type
    const typeMap = {};
    for (const rel of rels) {
        if (!typeMap[rel.type]) typeMap[rel.type] = [];
        typeMap[rel.type].push(rel);
    }

    // Check if any type has ≥2 entries
    const useSections = Object.values(typeMap).some(group => group.length >= 2);

    if (!useSections) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('relationship-list');
        rels.forEach(rel => {
            const btn = document.createElement('button');
            btn.className = 'relationship-plate';
            // just the name...
            btn.textContent = rel.person;
            // ...full plate as tooltip
            btn.title = `${rel.person} (${rel.type})${rel.note ? '\n' + rel.note : ''}`;
            wrapper.appendChild(btn);
        });
        container.appendChild(wrapper);
    }
     else {
        // Use collapsibles per type (only for types with ≥2), rest go in 'Other'
        for (const [type, group] of Object.entries(typeMap)) {
            if (group.length >= 2) {
                const section = createRelationshipSection(type, group);
                container.appendChild(section);
            }
        }

        const leftovers = Object.entries(typeMap)
            .filter(([_, group]) => group.length < 2)
            .flatMap(([_, group]) => group);

        if (leftovers.length) {
            const otherSection = createRelationshipSection('Other', leftovers);
            container.appendChild(otherSection);
        }
    }
}

function createRelationshipSection(label, entries) {
    const details = document.createElement('details');
    details.classList.add('relationship-category');
    details.open = true;

    const summary = document.createElement('summary');
    summary.textContent = label;
    details.appendChild(summary);

    const listDiv = document.createElement('div');
    listDiv.classList.add('relationship-list');

    entries.forEach(rel => {
        const btn = document.createElement('button');
        btn.classList.add('relationship-plate');
        // only name visible
        btn.textContent = rel.person;
        // tooltip shows name, type, and note
        btn.title = `${rel.person} (${rel.type})${rel.note ? '\n' + rel.note : ''}`;
        listDiv.appendChild(btn);
    });

    details.appendChild(listDiv);
    return details;
}


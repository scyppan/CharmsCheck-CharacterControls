// ————— Tab loader for named creatures —————
async function petstab() {
    const tabcontent = document.getElementById('tabcontent');
    tabcontent.textContent = 'Fetching API Data 1/2...';
    await getnamedcreatures(true);
    tabcontent.textContent = 'Fetching API Data 2/2...';
    await getbooks(true);

    rendercreaturestabui();
    
}

function rendercreaturestabui() {
    const tabcontent = document.getElementById('tabcontent');
    tabcontent.textContent = '';

    const mini = document.createElement('div');
    mini.id = 'creatureminiwindow';
    tabcontent.appendChild(mini);

    const pets = getpetlist();
    if (!pets.length) {
        mini.textContent = 'No creatures to display.';
        return;
    }

    // Group pets by species
    const speciesGroups = {};
    pets.forEach(pet => {
        const sp = pet.species || 'Unknown';
        (speciesGroups[sp] ||= []).push(pet);
    });

    const speciesEntries = Object.entries(speciesGroups);
    const multiSpecies = speciesEntries.filter(([_, arr]) => arr.length > 1);
    const singleSpecies = speciesEntries.filter(([_, arr]) => arr.length === 1);

    if (multiSpecies.length === 0) {
        // Case 1: No species has more than 1 member → flat list
        pets.forEach(pet => {
            const btn = createpetplate(pet);
            btn.textContent = `${pet.name} (${pet.species || 'Unknown'})`;
            mini.appendChild(btn);
        });
    } else {
        // Case 2: Some species have more than 1 member
        // First, create <details> for each multi-member species
        multiSpecies.forEach(([species, group]) => {
            const details = document.createElement('details');
            details.className = 'pet-category';
            const summary = document.createElement('summary');
            summary.textContent = species;
            details.appendChild(summary);

            group.forEach(pet => {
                const btn = createpetplate(pet);
                btn.textContent = `${pet.name} (${species})`;
                details.appendChild(btn);
            });

            mini.appendChild(details);
        });

        // Now, collect all the single-member species under "Other species"
        if (singleSpecies.length) {
            const details = document.createElement('details');
            details.className = 'pet-category';
            const summary = document.createElement('summary');
            summary.textContent = 'Other species';
            details.appendChild(summary);

            singleSpecies.forEach(([species, [pet]]) => {
                const btn = createpetplate(pet);
                btn.textContent = `${pet.name} (${species})`;
                details.appendChild(btn);
            });

            mini.appendChild(details);
        }
    }
}

function createpetplate(pet) {

    const species        = pet.species;
    const size           = pet.size;
    const heavywoundcap  = pet.heavywoundcap;
    const resistance     = pet.resistance;
    const beastintel     = pet.beastialintelligence;
    const humanintel     = pet.humanintelligence;
    const humansocial    = pet.humansocialskills;
    const ground         = pet.groundspeed;
    const water          = pet.waterspeed;
    const air            = pet.airspeed;

    const btn = document.createElement('button');
    btn.className   = 'pet-plate';
    btn.textContent = pet.name;

    const titleLines = [];

    titleLines.push(`${pet.name} (${species}: Size: ${size})`);
    titleLines.push(`Heavy Wound Cap. ${heavywoundcap} | Res. ${resistance}`);
    titleLines.push(
        humanintel
            ? `Human Intel. ${humanintel}`
            : `Beastial Intel. ${beastintel}`
    );
    if (humansocial) {
        titleLines.push(`Human Social Skills: ${humansocial}`);
    }
    titleLines.push(`Movement - Ground: ${ground} | Water: ${water} | Air: ${air}`);

    btn.title = titleLines.join("\n");

    btn.addEventListener('click', e => {
        if (e.altKey) {
            printpetdescription(btn);
        } else {
            displayPetDetails(pet.name);
        }
    });

    btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
        }
    });

    return btn;
}


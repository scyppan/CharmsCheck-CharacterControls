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
  
    // 1) grab your pet list and zip in the new relationship field
    const pets = getpetlist();
    const relArr = currentchar.meta.petrelationshipquality || [];
    const petsWithRel = pets.map((pet, i) => ({
      ...pet,
      relationship: relArr[i] || 'Unknown relationship'
    }));
  
    if (!petsWithRel.length) {
      mini.textContent = 'No creatures to display.';
      return;
    }
  
    // 2) top-level grouping by relationship
    const relGroups = {};
    petsWithRel.forEach(pet => {
      const rel = pet.relationship;
      (relGroups[rel] ||= []).push(pet);
    });
  
    // 3) render each relationship bucket
    Object.entries(relGroups).forEach(([rel, group]) => {
      const relDetails = document.createElement('details');
      relDetails.className = 'pet-category';
      const relSummary = document.createElement('summary');
      relSummary.textContent = rel;
      relDetails.appendChild(relSummary);
  
      // 4) inside each, group by species
      const speciesGroups = {};
      group.forEach(pet => {
        const sp = pet.species || 'Unknown';
        (speciesGroups[sp] ||= []).push(pet);
      });
      const multi = Object.entries(speciesGroups).filter(([, arr]) => arr.length > 1);
      const single = Object.entries(speciesGroups).filter(([, arr]) => arr.length === 1);
  
      if (multi.length === 0) {
        // no repeated species → flat list
        group.forEach(pet => {
          const btn = createpetplate(pet);
          btn.textContent = `${pet.name} (${pet.species || 'Unknown'})`;
          relDetails.appendChild(btn);
        });
      } else {
        // species with multiples
        multi.forEach(([sp, arr]) => {
          const spDet = document.createElement('details');
          spDet.className = 'pet-category';
          const spSum = document.createElement('summary');
          spSum.textContent = sp;
          spDet.appendChild(spSum);
          arr.forEach(pet => {
            const btn = createpetplate(pet);
            btn.textContent = `${pet.name} (${sp})`;
            spDet.appendChild(btn);
          });
          relDetails.appendChild(spDet);
        });
        // all the singleton species under “Other species”
        if (single.length) {
          const otherDet = document.createElement('details');
          otherDet.className = 'pet-category';
          const otherSum = document.createElement('summary');
          otherSum.textContent = 'Other species';
          otherDet.appendChild(otherSum);
          single.forEach(([, arr]) => {
            const pet = arr[0];
            const btn = createpetplate(pet);
            btn.textContent = `${pet.name} (${pet.species || 'Unknown'})`;
            otherDet.appendChild(btn);
          });
          relDetails.appendChild(otherDet);
        }
      }
  
      mini.appendChild(relDetails);
    });
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
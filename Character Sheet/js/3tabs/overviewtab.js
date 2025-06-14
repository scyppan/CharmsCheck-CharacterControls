function overviewtab() {

  const tabcontent = document.getElementById('tabcontent');
  tabcontent.innerHTML = '';

  // ─── Top Section (Photo Left, Demographics Right) ─────────────────────────────
  const topSection = document.createElement('div');
  topSection.classList.add('overview-top');

  // Left Panel: Photo
  const leftPanel = document.createElement('div');
  leftPanel.classList.add('overview-left');

  const photo = document.createElement('img');
  photo.classList.add('character-photo');
  photo.src = currentchar.meta.zwc7o || "./icons/defaultcharacter.svg";
  photo.alt = 'Character Photo';

  leftPanel.appendChild(photo);

  // Right Panel: Demographic info
  const rightPanel = document.createElement('div');
  rightPanel.classList.add('overview-right');

  const demographicsList = document.createElement('ul');
  demographicsList.classList.add('demographics');

  const eminencePoints = (Array.isArray(currentchar.meta.ixbnr) && currentchar.meta.ixbnr.length > 0 && currentchar.meta.ixbnr[0])
    ? currentchar.meta.ixbnr.length
    : 0;

  //creates the name li that clicks to edit char
  let charnameli = document.createElement('li');
  let charnamespan = document.createElement('span');
  let charnamea = document.createElement('a');
  charnamea.target = '_blank'; // Open in new tab
  charnamespan.textContent = "Name:";
  charnamea.href = `https://charmscheck.com/character-creator-25/?frm_action=edit&entry=${currentchar.id}#`;
  charnamea.textContent = currentchar.name;
  charnamea.title = "Click to edit this character in a new window. Note, you will have to refresh this page for changes to show.";
  charnameli.appendChild(charnamespan);
  charnameli.appendChild(charnamea);

  charnamea.addEventListener('click', function () {
    // 1. Clear all character-related localStorage entries
    for (let key in localStorage) {
      if (key.startsWith('cache_char_')) {
        localStorage.removeItem(key);
      }
    }

    // 2. Clear matching in-memory global cache
    for (let key in globalThis) {
      if (key.startsWith('char_')) {
        delete globalThis[key];
      }
    }

    if(currentchar.meta.dead =="Yes"){charnamea.textContent += ' (dead)';}

    // 3. Optional: force next fetch to skip HTTP cache
    sessionStorage.setItem('force_fresh_api', 'true');

    console.log('[charnamea click] Cleared character localStorage, memory, and flagged API cache-busting');
  });

  // Add placeholder demographics
  demographicsList.appendChild(charnameli);
  demographicsList.appendChild(createDemoItem('Canon:', currentchar.meta.s4ee3 || "No"));
  demographicsList.appendChild(createDemoItem('Birthdate:', createBirthdate()));
  demographicsList.appendChild(createDemoItem('School:', currentchar.meta.school));
  demographicsList.appendChild(createDemoItem('Eminence Points:', eminencePoints));

  rightPanel.appendChild(demographicsList);
  rightPanel.appendChild(createCastAtAgeSelect());

  // Put photo and demographics into the top section
  topSection.appendChild(leftPanel);
  topSection.appendChild(rightPanel);

  // ─── Bottom Section (Full-width Narrative) ────────────────────────────────────
  const bottomSection = document.createElement('div');
  bottomSection.classList.add('overview-bottom');

  const narrativePara = document.createElement('p');
  narrativePara.textContent = currentchar.meta.narrative || ``;
  bottomSection.appendChild(narrativePara);

  // ─── Combine all sections in the container ────────────────────────────────────
  tabcontent.appendChild(topSection);
  tabcontent.appendChild(bottomSection);

}

// Helper function to create each demographic line item
function createDemoItem(label, value) {
  const li = document.createElement('li');
  const spanLabel = document.createElement('span');
  spanLabel.textContent = label;
  li.appendChild(spanLabel);
  li.append(' ' + value);
  return li;
}

function createBirthdate() {
  const year = currentchar.meta.birthyear || "unknown";
  const month = currentchar.meta.birthmonth;
  const day = currentchar.meta.birthday;

  if (year == "unknown") {
    return "unknown";
  } else {
    if (day && month) {
      return `${day} ${month} ${year}`;
    } else if (day) {
      return year
    } else {
      return `${month} ${year}`
    }
  }
}

function createCastAtAgeSelect() {
  // Create a wrapper container
  const container = document.createElement('div');

  // Create the label
  const label = document.createElement('label');
  label.textContent = 'Cast at age: ';
  // Optionally assign an ID for the select, then match the label "for" attribute
  label.setAttribute('for', 'castAtAgeSelect');

  // Create the select
  const select = document.createElement('select');
  select.id = 'castAtAgeSelect';
  select.name = 'castAtAge';

  // Define the options
  const optionsData = [
    { value: 'before_school', text: 'Before School' },
    { value: 'year_1', text: '1st year' },
    { value: 'year_2', text: '2nd year' },
    { value: 'year_3', text: '3rd year' },
    { value: 'year_4', text: '4th year' },
    { value: 'year_5', text: '5th year' },
    { value: 'year_6', text: '6th year' },
    { value: 'year_7', text: '7th year' },
    { value: 'full', text: 'Fully Developed' }
  ];

  // Build each option element
  optionsData.forEach(optData => {
    const option = document.createElement('option');
    option.value = optData.value;
    option.textContent = optData.text;
    select.appendChild(option);
  });

  //reset the age we'll cast at
  castatage = 8;
  select.selectedIndex = castatage;

  select.addEventListener('change', () => {
    castatage = select.selectedIndex;
  });

  // Append label and select to the container
  //container.appendChild(label);
  //container.appendChild(select); //removing age-linked casting for now

  return container;
}
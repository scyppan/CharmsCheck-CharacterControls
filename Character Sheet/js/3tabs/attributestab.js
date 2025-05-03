async function attributestab() {

  const tabcontent = document.getElementById('tabcontent');
  tabcontent.textContent = 'Fetching API Data 1/6...';
  await gettraits(true);//make sure we've loaded traits first.
  tabcontent.textContent = 'Fetching API Data 2/6....';
  await getwands(true);
  tabcontent.textContent = 'Fetching API Data 3/6.....';
  await getaccessories(true);
  tabcontent.textContent = 'Fetching API Data 4/6......';
  await getwandwoods(true);
  tabcontent.textContent = 'Fetching API Data 5/6.......';
  await getwandcores(true);
  tabcontent.textContent = 'Fetching API Data 6/6........';
  await getwandqualities(true);
  tabcontent.textContent = '';

  const quadrant = document.createElement('div');
  quadrant.id = 'quadrant';

  const abilityandskillheader = document.createElement('div');
  abilityandskillheader.classList.add('rollheaders');
  abilityandskillheader.textContent = `Ability and Skill Rolls`;
  tabcontent.prepend(abilityandskillheader);

  // Create four child divs
  const upperleft = document.createElement('div');
  upperleft.id = 'upperleft';

  const upperright = document.createElement('div');
  upperright.id = 'upperright';

  const lowerleft = document.createElement('div');
  lowerleft.id = 'lowerleft';

  const lowerright = document.createElement('div');
  lowerright.id = 'lowerright';

  // Append them in a consistent order
  quadrant.appendChild(upperleft);
  quadrant.appendChild(upperright);
  quadrant.appendChild(lowerleft);
  quadrant.appendChild(lowerright);

  tabcontent.appendChild(quadrant);

  const abilitySkillsData = [
    { name: 'Power', value: 8, type: 'ability' },
    { name: 'Charms', value: 25, type: 'skill' },
    { name: 'Dark Arts', value: 0, type: 'skill' },
    { name: 'Defense', value: 7, type: 'skill' },
    { name: 'Transfiguration', value: 7, type: 'skill' },
    { name: 'Naturalism', value: 0, type: 'ability' },
    { name: 'Astronomy', value: 5, type: 'skill' },
    { name: 'Divination', value: 0, type: 'skill' },
    { name: 'Creatures', value: 5, type: 'skill' },
    { name: 'Perception', value: 0, type: 'skill' },
    { name: 'Social Skills', value: 0, type: 'skill' },
    { name: 'Erudition', value: 0, type: 'ability' },
    { name: 'Runes', value: 2, type: 'skill' },
    { name: 'Arithmancy', value: 3, type: 'skill' },
    { name: 'Muggles', value: 5, type: 'skill' },
    { name: 'History', value: 7, type: 'skill' },
    { name: 'Panache', value: 0, type: 'ability' },
    { name: 'Flying', value: 1, type: 'skill' },
    { name: 'Alchemy', value: 2, type: 'skill' },
    { name: 'Potions', value: 5, type: 'skill' },
    { name: 'Artificing', value: 0, type: 'skill' },
    { name: 'Herbology', value: 5, type: 'skill' }
  ];

  // Populate the grid with skill chips
  abilitySkillsData.forEach(entry => {
    let btn = createbtn(entry);
    switch (entry.name) {
      case 'Power': upperleft.appendChild(btn); break;
      case 'Erudition': upperright.appendChild(btn); break;
      case 'Naturalism': upperleft.appendChild(btn); break;
      case 'Panache': upperright.appendChild(btn); break;

      case 'Charms': upperleft.appendChild(btn); break;
      case 'Dark Arts': upperleft.appendChild(btn); break;
      case 'Defense': upperleft.appendChild(btn); break;
      case 'Transfiguration': upperleft.appendChild(btn); break;
      case 'Naturalism': upperleft.appendChild(btn); break;
      case 'Astronomy': upperleft.appendChild(btn); break;
      case 'Divination': upperleft.appendChild(btn); break;
      case 'Creatures': upperleft.appendChild(btn); break;
      case 'Perception': upperleft.appendChild(btn); break;
      case 'Social Skills': upperleft.appendChild(btn); break;
      case 'Runes': upperright.appendChild(btn); break;
      case 'Arithmancy': upperright.appendChild(btn); break;
      case 'Muggles': upperright.appendChild(btn); break;
      case 'History': upperright.appendChild(btn); break;
      case 'Flying': upperright.appendChild(btn); break;
      case 'Alchemy': upperright.appendChild(btn); break;
      case 'Potions': upperright.appendChild(btn); break;
      case 'Artificing': upperright.appendChild(btn); break;
      case 'Herbology': upperright.appendChild(btn); break;
    }
  });

  const characteristicsdata = [
    { name: 'Fortitude', type: "characteristic" },
    { name: 'Willpower', type: "characteristic" },
    { name: 'Intellect', type: "characteristic" },
    { name: 'Creativity', type: "characteristic" },
    { name: 'Equanimity', type: "characteristic" },
    { name: 'Charisma', type: "characteristic" },
    { name: 'Attractiveness', type: "characteristic" },
    { name: 'Strength', type: "characteristic" },
    { name: 'Agility', type: "characteristic" }
  ];

  const characteristicheader = document.createElement('div');
  characteristicheader.classList.add('rollheaders');
  characteristicheader.textContent = `Characteristics Rolls`;
  lowerleft.prepend(characteristicheader);

  characteristicsdata.forEach(entry => {
    let btn = createbtn(entry);
    lowerleft.appendChild(btn);
  });

  const parentaldata = [
    { name: 'Generosity', type: "parental" },
    { name: 'Permissiveness', type: "parental" },
    { name: 'Wealth', type: "parental" }
  ]

  const parentalheader = document.createElement('div');
  parentalheader.classList.add('rollheaders');
  parentalheader.textContent = `Parental Rolls`;
  lowerright.prepend(parentalheader);

  parentaldata.forEach(entry => {
    let btn = createbtn(entry);
    lowerright.appendChild(btn);
  });

  const traitsheader = document.createElement('div');
  traitsheader.classList.add('rollheaders');
  traitsheader.textContent = `Traits`;
  lowerright.appendChild(traitsheader);

  if (Array.isArray(currentchar.meta.traits)) {
    currentchar.meta.traits.forEach(trait => {
      let plate = maketraitplate(trait);
      lowerright.appendChild(plate);
    });
  } else if (currentchar.meta.traits) {
    let plate = maketraitplate(currentchar.meta.traits);
    lowerright.appendChild(plate);
  }

  addvalstobtns();
  attachattributelisteners();

}

function createbtn(entry) {
  const btn = document.createElement('button');
  btn.id = entry.name;
  btn.textContent = entry.name;
  btn.classList.add(entry.type, 'btn');

  if (entry.name == 'Naturalism' || entry.name == 'Panache') {
    btn.classList.add('bottomability');
  }

  return btn;
}

function attachattributelisteners() {
  document.querySelectorAll('.basic').forEach(attachbasicroll);
  document.querySelectorAll('.ability').forEach(attachabilityroll);
  document.querySelectorAll('.skill').forEach(attachskillroll);
  document.querySelectorAll('.characteristic').forEach(attachcharacteristicroll);
  document.querySelectorAll('.parental').forEach(attachparentalroll);
}

function maketraitplate(trait) {
  const plate = document.createElement('div');
  plate.id = trait;
  plate.textContent = `• ${trait}`;
  plate.classList.add('trait');

  plate.title = gettraitdescription(trait);
  return plate;
}




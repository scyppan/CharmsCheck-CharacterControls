function createCharacterSheet() {
  console.log("creating character sheet");
  const container = createContainer();
  const tabColumn = createTabColumn();
  const content = createContentArea();
  createTabs(tabColumn, content);
  container.appendChild(tabColumn);
  container.appendChild(content);
  document.getElementById('charsheetmain').appendChild(container);
}

function createContainer() {
  const container = document.createElement("div");
  container.id = 'charsheet-container';
  container.classList.add("charsheet-container", 'hidden');

  return container;
}

function createTabColumn() {
  const tabColumn = document.createElement("div");
  tabColumn.classList.add("charsheet-tabs");
  return tabColumn;
}

function createContentArea() {
  const content = document.createElement("div");
  content.id = 'tabcontent';
  content.classList.add("charsheet-content");
  return content;
}

function createTabs(tabColumn, content) {
const iconbase = 'https://cdn.jsdelivr.net/gh/scyppan/CharmsCheck-CharacterControls@Character-Controls-25/Character%20Sheet/icons/';
  const pages = [
    { name: "Overview", icon: "overview.svg" },
    { name: "Attributes", icon: "attributes.svg" },
    { name: "Spells", icon: "spells.svg" },
    { name: "Proficiencies", icon: "proficiencies.svg" },
    { name: "Potions", icon: "potions.svg" },
    { name: "Pets", icon: "pets.svg" },
    { name: "Inventory", icon: "equipment.svg" },
    { name: "Relationships", icon: "relationships.svg" },
    { name: "Wounds", icon: "wounds.svg" },
    { name: "Settings", icon: "settings.svg" }
  ];

  pages.forEach(page => {
    const tab = document.createElement("div");
    const img = document.createElement("img");
    img.src = `${iconbase}/${page.icon}`;
    img.alt = page.name;
    tab.name = page.name;
    tab.title = page.name;
    tab.appendChild(img);
    tab.addEventListener("click", () => {
      console.log(tab.name, "Clicked");
      tabclick(tab.name);
    });
    tabColumn.appendChild(tab);
  });
}

function tabclick(tabname) {

  let tabcontent = document.getElementById('tabcontent');
  if(!tabname=="Wounds") {tabcontent.innerHTML = ``;}

  switch (tabname) {
    case "Overview":
      overviewtab();
      break;
    case "Attributes":
      attributestab();
      break;
    case "Spells":
      spellstab();
      break;
    case "Proficiencies":
      proficiencestab();
      break;
    case "Potions":
      potionstab();
      break;
    case "Pets":
      petstab();
      break;
    case "Inventory":
      inventorytab();
      break;
    case "Relationships":
      relationshiptab();
      break;
    case "Settings":
      settingstab();
      break;
    case "Wounds":
      woundstab();
      break;
    default:
      tabcontent.innerHTML = `<h2>${tabname}</h2><p>Placeholder content for ${tabname}.</p>`;
      break;
  }
}

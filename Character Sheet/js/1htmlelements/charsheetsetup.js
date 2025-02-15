  function createCharacterSheet() {
    const container = createContainer();
    const tabColumn = createTabColumn();
    const content = createContentArea();
    createTabs(tabColumn, content);
    container.appendChild(tabColumn);
    container.appendChild(content);
    document.body.appendChild(container);
  }

  function createContainer() {
    const container = document.createElement("div");
    container.id='charsheet-container';
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
    content.classList.add("charsheet-content");
    return content;
  }

  function createTabs(tabColumn, content) {
    const pages = [
      { name: "Overview", icon: "./icons/overview.svg" },
      { name: "Skills", icon: "./icons/skills.svg" },
      { name: "Spells", icon: "./icons/spells.svg" },
      { name: "Proficiencies", icon: "./icons/proficiencies.svg" },
      { name: "Potions", icon: "./icons/potions.svg" },
      { name: "Inventory", icon: "./icons/equipment.svg" },
      { name: "Books", icon: "./icons/books.svg" },
      { name: "Relationships", icon: "./icons/relationships.svg" }
    ];
    pages.forEach(page => {
      const tab = document.createElement("div");
      const img = document.createElement("img");
      img.src = page.icon;
      img.alt = page.name;
      tab.appendChild(img);
      tab.addEventListener("click", () => {
        content.innerHTML = `<h2>${page.name}</h2><p>Placeholder content for ${page.name}.</p>`;
      });
      tabColumn.appendChild(tab);
    });
    content.innerHTML = `<h2>${pages[0].name}</h2><p>Placeholder content for ${pages[0].name}.</p>`;
  }

  createCharacterSheet();
  
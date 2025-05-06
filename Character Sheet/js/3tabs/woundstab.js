// ————— Tab loader for wound tracker —————
async function woundstab() {
  const overlay = document.querySelector('.wound-overlay');
  if (overlay) {
    overlay.classList.toggle('hidden');
  } else {
    renderwoundstabui();
  };
}

function renderwoundstabui() {
  const btn = document.querySelector('div[title="Wounds"]');
  if (!btn || btn.querySelector('.wound-overlay')) return;

  createwoundminiwindow(btn);
  updateWoundsSummary();

  const overlay = btn.querySelector('.wound-overlay');
  const addSection = overlay.querySelector('#wt-add');
  addSection.innerHTML = '';
  addSection.appendChild(createInjuryActionTable());
}

function createWoundsSummarySection() {
  const section = document.createElement('div');
  const h6 = document.createElement('h6');
  h6.textContent = 'Total Wounds';

  const ul = document.createElement('ul');

  ['Heavy', 'Medium', 'Light'].forEach(level => {
    const li = document.createElement('li');

    // label for the type
    const spanType = document.createElement('span');
    spanType.className = 'wt-label';
    spanType.textContent = `${level} wounds: `;

    // span for the number, with an easy selector
    const spanCount = document.createElement('span');
    spanCount.className = 'wt-count';
    spanCount.dataset.level = level.toLowerCase();
    spanCount.textContent = '0';

    li.append(spanType, spanCount);
    ul.appendChild(li);
  });

  const note = document.createElement('p');
  note.innerHTML = '<em>Note: 7 heavy wounds kills a human.</em>';

  section.append(h6, ul, note);
  return section;
}

function createInjuryBreakdownSection() {
  const section = document.createElement('div');
  section.className = 'wt-injuries';

  const header = document.createElement('h4');
  header.textContent = 'Injury Breakdown';
  section.appendChild(header);

  const table = document.createElement('table');
  table.className = 'wt-injuries-table';

  // header row
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Injury Type', 'Heavy', 'Medium', 'Light'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // data rows
  const tbody = document.createElement('tbody');
  const injuries = [
    {
      name: 'Cuts/Scratches',
      desc: 'Linear incisions or scratches; can penetrate deep tissue and bleed heavily.'
    },
    {
      name: 'Abrasions/Scrapes',
      desc: 'Skin rubbed away over an area; painful and prone to bleeding or scarring.'
    },
    {
      name: 'Slashes/Gashes',
      desc: 'Deep slicing wounds from blades; capable of severing vessels or nerves.'
    },
    {
      name: 'Punctures/Piercing',
      desc: 'Narrow, deep holes—often trap debris; require object removal to heal.'
    },
    {
      name: 'Gouges',
      desc: 'Large, rounded tissue removal—like from a spear or claw—causing severe bleeding.'
    },
    {
      name: 'Burns',
      desc: 'Tissue damage by heat, chemicals, or magic; ranges from superficial to full-thickness.'
    },
    {
      name: 'Disease/Toxic',
      desc: 'Internal damage from infection or poison; worsens over time without antidote.'
    },
    {
      name: 'Blunt force/Crushing',
      desc: 'Injury from heavy impact or compression; can fracture bones or rupture organs.'
    },
    {
      name: 'Despairing/Depressing',
      desc: 'Psychological harm inducing hopelessness; undermines willpower and recovery.'
    },
    {
      name: 'Terror/Anxiety-inducing',
      desc: 'Acute mental trauma causing intense fear or panic.'
    },
    {
      name: 'Sanity-shaking',
      desc: 'Severe psychological shock threatening long-term mental stability.'
    },
    {
      name: 'Eruption/Explosion',
      desc: 'Violent tissue rupture from blasts or magical force; catastrophic damage.'
    },
    {
      name: 'Vital',
      desc: 'Damage to critical functions (breathing, circulation); typically fatal if untreated.'
    }
  ];

  injuries.forEach(({ name, desc }) => {
    const row = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.textContent = name;
    tdName.title = desc;
    row.appendChild(tdName);

    ['Heavy', 'Medium', 'Light'].forEach(() => {
      const td = document.createElement('td');
      td.textContent = '0';
      row.appendChild(td);
    });

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  section.appendChild(table);
  return section;
}

function createHistorySection() {
  const details = document.createElement('details');
  details.className = 'wt-history';

  const summary = document.createElement('summary');
  summary.textContent = 'Wound History';

  const content = document.createElement('div');
  details.append(summary, content);

  return details;
}

function createwoundminiwindow(btn) {
  const overlay = document.createElement('div');
  overlay.classList.add('wound-overlay');
  overlay.addEventListener('click', e => e.stopPropagation());

  const btnbar = document.createElement('div');
  btnbar.className = 'wt-btnbar';
  const overviewBtn = document.createElement('button');
  overviewBtn.textContent = 'Wounds Overview';
  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add Wound/Heal';
  btnbar.append(overviewBtn, addBtn);

  const overviewSection = document.createElement('div');
  overviewSection.id = 'wt-overview';

  const addSection = document.createElement('div');
  addSection.id = 'wt-add';
  addSection.innerHTML = '<p>placeholder for add wound/heal</p>';
  addSection.classList.add('hidden');

  const container = document.createElement('div');
  container.className = 'wt-container';
  container.append(overviewSection, addSection);

  overviewBtn.addEventListener('click', () => {
    overviewSection.classList.remove('hidden');
    addSection.classList.add('hidden');
  });
  addBtn.addEventListener('click', () => {
    overviewSection.classList.add('hidden');
    addSection.classList.remove('hidden');
  });

  overlay.append(btnbar, createWoundsSummarySection(), container);
  btn.appendChild(overlay);

  
  overviewSection.append(
    createInjuryBreakdownSection(),
    createHistorySection()
  );

  overviewBtn.click();
}

const createInjuryActionTable = () => {
  const injuryTypes = [
    'Cuts/Scratches','Abrasions/Scrapes','Slashes/Gashes',
    'Punctures/Piercing','Gouges','Burns','Disease/Toxic',
    'Blunt force/Crushing','Despairing/Depressing',
    'Terror/Anxiety-inducing','Sanity-shaking',
    'Eruption/Explosion','Vital'
  ];
  const levels = ['Heavy','Medium','Light'];
  const codeMap = { Heavy: 'H', Medium: 'M', Light: 'L' };
  const lightUnits = { H: 3, M: 3*3, L: 1 }; 
  // Note: 1M = 3L, 1H = 2M = 6L

  const table = document.createElement('table');
  table.className = 'wt-action-table';

  // header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Injury Type', ...levels].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // body
  const tbody = document.createElement('tbody');
  injuryTypes.forEach(type => {
    const tr = document.createElement('tr');

    // type column
    const tdType = document.createElement('td');
    tdType.textContent = type;
    tr.appendChild(tdType);

    // action columns
    levels.forEach(level => {
      const code = codeMap[level];
      const unit = code === 'H' ? 6 : code === 'M' ? 3 : 1;

      const td = document.createElement('td');
      const woundBtn = document.createElement('button');
      woundBtn.textContent = '+ Wound';
      attachWoundHandler(woundBtn, type, `1${code}`, unit);

      const healBtn = document.createElement('button');
      healBtn.textContent = '+ Heal';
      attachWoundHandler(healBtn, type, `-1${code}`, -unit);

      td.append(woundBtn, healBtn);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
};

function attachWoundHandler(button, type, amtStr, lightDelta) {
  button.addEventListener('click', () => {
    // 1) compute current “light” for this type
    const currentLight = woundhistory
      .filter(e => e.type === type)
      .reduce((sum, e) => sum + e.applied, 0);

    // 2) clamp healing so it never goes below zero
    const applied = lightDelta > 0
      ? lightDelta
      : -Math.min(Math.abs(lightDelta), currentLight);

    // 3) parse severity & amount
    const code = amtStr.slice(-1); // 'H'|'M'|'L'
    const severity = { H: 'Heavy', M: 'Medium', L: 'Light' }[code];
    const amount   = Math.abs(parseInt(amtStr, 10));

    // 4) decide event type
    const isHeal = lightDelta < 0;
    let eventType;
    if (isHeal && applied === 0) {
      eventType = 'healIneffective';
    } else if (!isHeal) {
      const futureTotals = normalizeWounds(totallightwounds + applied);
      eventType = futureTotals.heavy >= 7 ? 'fatal' : 'regdmg';
    } else {
      eventType = 'healEffective';
    }

    // 5) prepare display text
    const text = woundText(eventType, amount, severity, type);

    // 6) record in woundhistory
    woundhistory.push({ type, amtStr, applied, heal: isHeal, text });
    addHistoryEntry(type, amtStr, isHeal);

    // 7) update breakdown row
    const row = Array.from(
      document.querySelectorAll('.wt-injuries-table tbody tr')
    ).find(r => r.cells[0].textContent === type);
    if (row) {
      const { heavy, medium, light } = normalizeWounds(currentLight + applied);
      row.cells[1].textContent = heavy;
      row.cells[2].textContent = medium;
      row.cells[3].textContent = light;
    }

    // 8) rebuild global total & refresh summary
    recalcTotals();
    updateWoundsSummary();

    // 9) show the last three entries
    showwoundmodal();
  });
}

function updateWoundsSummary() {
  const totals = normalizeWounds(totallightwounds);
  ['heavy','medium','light'].forEach(level => {
    document
      .querySelectorAll(`.wt-count[data-level="${level}"]`)
      .forEach(span => span.textContent = totals[level]);
  });
}

function addHistoryEntry(type, amtStr, heal) {
  const ts = new Date().toLocaleString();
  const histContent = document.querySelector('.wt-history > div');
  if (!histContent) return;
  const p = document.createElement('p');
  p.textContent = `${type}: ${amtStr} – heal: ${heal} – ${ts}`;
  histContent.appendChild(p);
}

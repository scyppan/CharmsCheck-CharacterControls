const normalizeWounds = lightCount => {
    const mediumFromLight = Math.floor(lightCount / 3);
    const light = lightCount % 3;
    const heavy = Math.floor(mediumFromLight / 2);
    const medium = mediumFromLight % 2;
    return { heavy, medium, light };
};

function woundText(eventType, amount, severity, injuryType) {
    const name = currentchar.meta['5syv4'];
    const sev = severity.toLowerCase();
    switch (eventType) {
        case 'regdmg':
            return `${name} takes ${amount} ${sev} wound of ${injuryType} damage.`;
        case 'fatal':
            return `${name} takes fatal damage (${amount} ${sev} of ${injuryType} damage) suffers fatal wounds and collapses!`;
        case 'healEffective':
            return `${name} heals ${amount} ${sev} wound of ${injuryType} damage.`;
        case 'healIneffective':
            return `${name} attempts to heal ${amount} ${sev} of ${injuryType} wounds, but there are no current wounds of this type.`;
        default:
            throw new Error(`Unknown event type: ${eventType}`);
    }

    
}

function recalcTotals() {
    totallightwounds = woundhistory
        .reduce((sum, e) => sum + e.applied, 0);
}

function showwoundmodal() {
    // 1) take last 3 entries with text
    const entries = woundhistory.slice(-3);
  
    // 2) find or create the modal
    let modal = document.getElementById('text-modal');
    let content;
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'text-modal';
      modal.classList.remove('minimized');
  
      const toggle = document.createElement('button');
      toggle.className = 'text-toggle';
      toggle.textContent = '–';
      toggle.addEventListener('click', () => {
        modal.classList.toggle('minimized');
        toggle.textContent = modal.classList.contains('minimized') ? '+' : '–';
        content.style.display = modal.classList.contains('minimized') ? 'none' : '';
      });
      modal.appendChild(toggle);
  
      content = document.createElement('div');
      content.className = 'text-content';
      modal.appendChild(content);
      document.body.appendChild(modal);
    } else {
      modal.classList.remove('minimized');
      content = modal.querySelector('.text-content');
      content.style.display = '';
      content.textContent = '';
      const toggle = modal.querySelector('.text-toggle');
      if (toggle) toggle.textContent = '–';
    }
  
    // 3) rebuild list
    const oldUl = modal.querySelector('ul');
    if (oldUl) oldUl.remove();
    const ul = document.createElement('ul');
    entries.forEach(entry => {
      const li = document.createElement('li');
      li.textContent = entry.text;
      li.className = entry.heal ? 'text-heal' : 'text-damage';
      ul.appendChild(li);
    });
    modal.appendChild(ul);
  }
  
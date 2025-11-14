(function () {
  function wait_for_element(selector, timeout_ms = 15000) {
    return new Promise((resolve, reject) => {
      const found = document.querySelector(selector);
      if (found) return resolve(found);
      const obs = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) { obs.disconnect(); resolve(el); }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(() => { obs.disconnect(); reject(new Error('timeout waiting for ' + selector)); }, timeout_ms);
    });
  }

  function parse_entries(root) {
    const lis = root.querySelectorAll('li');
    const entries = [];
    lis.forEach(li => {
      const text = li.textContent.trim().replace(/\u2013|\u2014/g, '–');
      const m = text.match(/^(.+?)\s*–\s*\((\d{4})\)/);
      if (!m) return;
      const name = m[1].trim();
      const year = parseInt(m[2], 10);
      if (name && Number.isInteger(year)) entries.push({ name, year });
    });
    return entries;
  }

  function group_by_year(entries) {
    const map = new Map();
    entries.forEach(({ name, year }) => {
      if (!map.has(year)) map.set(year, new Set());
      map.get(year).add(name);
    });
    return map; // Map<year, Set<name>>
  }

  function make_report_container() {
    const div = document.createElement('div');
    div.setAttribute('data-training-report', '1');
    return div;
  }

function render_report(target, year_map, roster, target_year) {
  const years = Array.from(year_map.keys()).sort((a, b) => b - a);
  const frag = document.createDocumentFragment();

  if (typeof target_year !== 'number') {
    const now = new Date();
    target_year = now.getFullYear();
  }

  // compute roster
  const all_found = new Set();
  years.forEach(y => year_map.get(y).forEach(n => all_found.add(n)));
  const final_roster = Array.isArray(roster) && roster.length ? roster.slice() : Array.from(all_found);

  const completed_this_year = year_map.get(target_year) ? new Set(year_map.get(target_year)) : new Set();
  const not_completed = final_roster.filter(n => !completed_this_year.has(n)).sort((a, b) => a.localeCompare(b));

  // target year header (reduced gap below)
  const h4_target = document.createElement('h4');
  h4_target.style.margin = '0 0 4px 0'; // less gap after header
  const b_target = document.createElement('b');
  b_target.textContent = String(target_year);
  h4_target.appendChild(b_target);
  frag.appendChild(h4_target);

  // names for target year
  if (completed_this_year.size > 0) {
    Array.from(completed_this_year).sort((a, b) => a.localeCompare(b)).forEach(n => {
      const p = document.createElement('div');
      p.textContent = n + ' ' + target_year;
      frag.appendChild(p);
    });
  } else {
    const p = document.createElement('div');
    p.textContent = '(none listed)';
    frag.appendChild(p);
  }

  // "Not completed" block (more surrounding gap)
  const notwrap = document.createElement('div');
  notwrap.style.margin = '16px 0 20px 0';  // more vertical gap
  notwrap.style.padding = '4px 0';         // subtle breathing room

  const b = document.createElement('b');
  b.textContent = 'Not completed';
  b.style.display = 'block';
  b.style.margin = '0 0 6px 0';
  notwrap.appendChild(b);

  const notlist = document.createElement('div');
  if (not_completed.length) {
    not_completed.forEach(n => {
      const p = document.createElement('div');
      p.textContent = n;
      notlist.appendChild(p);
    });
  } else {
    const p = document.createElement('div');
    p.textContent = '(none)';
    notlist.appendChild(p);
  }
  notwrap.appendChild(notlist);
  frag.appendChild(notwrap);

  // other years (headers with reduced gap)
  years.filter(y => y !== target_year).forEach(y => {
    const h4 = document.createElement('h4');
    h4.style.margin = '12px 0 4px 0'; // less gap after header
    const bold = document.createElement('b');
    bold.textContent = String(y);
    h4.appendChild(bold);
    frag.appendChild(h4);
    Array.from(year_map.get(y)).sort((a, b) => a.localeCompare(b)).forEach(n => {
      const p = document.createElement('div');
      p.textContent = n + ' ' + y;
      frag.appendChild(p);
    });
  });

  target.innerHTML = '';
  target.appendChild(frag);
}

async function init_training_grouping(opts = {}) {
  const {
    container_selector = '.frm_grid_container.with_frm_style.frm-grid-view',
    target_year,
    roster,
    hide_original = true
  } = opts;

  const root = await wait_for_element(container_selector);
  const entries = parse_entries(root);
  const year_map = group_by_year(entries);

  let report = root.querySelector('[data-training-report="1"]');
  if (!report) {
    report = make_report_container();
    root.parentNode.insertBefore(report, root.nextSibling);
  }
  render_report(report, year_map, roster, target_year);

  if (hide_original && root) {
    root.setAttribute('aria-hidden', 'true');
    root.style.display = 'none';
  }
}


  // auto-run with default options; change target_year if needed
  init_training_grouping({ target_year: 2025 });
})();
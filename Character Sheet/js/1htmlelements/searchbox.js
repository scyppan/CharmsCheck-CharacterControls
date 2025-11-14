// Create Fuse instance once, referencing your "characters" array
function createfuse() {
  // keep your function name and purpose; just normalize to an array
  const list = Array.isArray(characters)
    ? characters
    : (characters && typeof characters === 'object')
      ? Object.values(characters)
      : [];

  fuse = new Fuse(list, { keys: ['name'], threshold: 0.3 });
}

function getsuggestions(query, e) {
  // your original substring filter (unchanged behavior)
  const base = Array.isArray(characters) ? characters : Object.values(characters || {});
  const results = base.filter(c =>
    c && c.name && c.name.toLowerCase().includes(query.toLowerCase())
  );

  showresults(results, e);
}

function createsuggestionbox(e) {
  // Summon a fresh suggestions container
  const suggestions = document.createElement('div');
  suggestions.id = 'suggestions';

  // Prefer your container if present; otherwise fall back to body
  const host = document.getElementById('suggestionscontainer') || document.body;
  host.appendChild(suggestions);

  // Position it directly beneath the searchbox
  const rect = e.target.getBoundingClientRect();
  suggestions.style.position = 'absolute';
  suggestions.style.top = `${rect.bottom + window.scrollY}px`;
  suggestions.style.left = `${rect.left + window.scrollX}px`;
}

function showresults(results, e) {
  createsuggestionbox(e);
  const suggestionbox = document.getElementById('suggestions');
  if (!suggestionbox) return;

  const resultarray = [];
  for (let i = 0; i < results.length; i++) {
    const li = createresultlisting(results[i]);
    resultarray.push(li);
    suggestionbox.append(li);
  }
}

function createresultlisting(result) {
  const li = document.createElement('li');
  li.id = result.id;
  li.classList.add('suggestion');
  li.innerHTML = result.name;
  createclickeventhandler(li);
  return li;
}

function createclickeventhandler(li) {
  li.addEventListener('click', () => {
    const box = document.getElementById('suggestions');
    if (box) box.classList.add('hidden');
    loadchar(li.id);
  });
}

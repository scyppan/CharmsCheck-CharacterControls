function fetchcharacter(id) {
  id = String(id);
  for (const key in characters) {
    if (characters[key].id === id) return characters[key];
  }
  return undefined;
}

function downloadJson(obj, filename = 'data.json') {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}
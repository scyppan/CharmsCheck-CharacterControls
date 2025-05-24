async function fetchjson(url, skipHttpCache = false) {
  const bust = skipHttpCache
    ? (url.includes('?') ? `&_cb=${Date.now()}` : `?_cb=${Date.now()}`)
    : '';
  const res = await fetch(url + bust, {
    method: 'GET',
    redirect: 'follow',
    cache: skipHttpCache ? 'no-store' : 'default'
  });
  if (res.status === 200) return res.json();
  throw new Error(`HTTP ${res.status}`);
}
const fetchdata = (url, skipHttpCache = false) => fetchjson(url, skipHttpCache);

// returns the most recent entry’s updated_at (or created_at)
async function getLastUpdate(formId) {
  const u = `${location.origin}/wp-json/frm/v2/forms/${formId}/entries?per_page=1&order=desc`;
  const raw = await fetchdata(u);
  const entries = Array.isArray(raw) ? raw : Object.values(raw);
  return entries[0]?.updated_at || entries[0]?.created_at;
}

// example
getLastUpdate(972)
  .then(ts => console.log('last update:', ts))
  .catch(console.error);
// // cachemanager.js
// // — requires global LZString

// // ui: status modal
// function injectcachemodalstyles() {
//     if (document.getElementById('cm-styles')) return
//     const s = document.createElement('style')
//     s.id = 'cm-styles'
//     s.textContent = `
//       #cache-status-modal {
//         position: fixed; bottom:1rem; left:1rem;
//         background: rgba(0,0,0,0.75); color:#fff;
//         padding:.5rem 1rem; border-radius:4px;
//         font-size:.85rem; max-width:200px;
//         max-height:120px; overflow-y:auto;
//         z-index:10000;
//       }
//       #cache-status-modal ul {margin:0; padding:0; list-style:none}
//       #cache-status-modal li {margin-bottom:.25rem}
//     `
//     document.head.appendChild(s)
//   }
//   function createcachemodal() {
//     if (document.getElementById('cache-status-modal')) return
//     const m = document.createElement('div')
//     m.id = 'cache-status-modal'
//     m.innerHTML = '<ul></ul>'
//     document.body.appendChild(m)
//   }
//   function updatecachemodal(msg) {
//     const ul = document.querySelector('#cache-status-modal ul')
//     if (!ul) return
//     const li = document.createElement('li')
//     li.textContent = msg
//     ul.appendChild(li)
//     ul.scrollTop = ul.scrollHeight
//   }
  
//   // persistence via localStorage
//   function getpersisted(key) {
//     try {
//       const c = localStorage.getItem('cache_' + key)
//       if (!c) return null
//       return JSON.parse(LZString.decompress(c))
//     } catch {
//       return null
//     }
//   }
//   function setpersisted(key, data) {
//     const c = LZString.compress(JSON.stringify(data))
//     localStorage.setItem('cache_' + key, c)
//   }
  
//   // download helper (saves to default downloads folder)
//   function downloadfile(name, content) {
//     const blob = new Blob([content], { type: 'text/plain' })
//     const url  = URL.createObjectURL(blob)
//     const a    = document.createElement('a')
//     a.href     = url
//     a.download = name
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)
//   }
  
//   // flush one dataset: persist + download
//   async function flushcache(key, data) {
//     updatecachemodal(`💾 flushing ${key}…`)
//     setpersisted(key, data)
//     downloadfile(`${key}.txt`, LZString.compress(JSON.stringify(data)))
//     updatecachemodal(`✅ saved ${key}`)
//   }
  
//   // schedule flush on idle
//   function markdirty(key, data) {
//     requestIdleCallback(() => flushcache(key, data), { timeout: 10000 })
//   }
  
//   // init_cache(key, initialData)
//   // — loads from localStorage or uses initialData,
//   //    then schedules a background save.
//   // — does NOT show any file picker.
//   async function init_cache(key, initialData = {}) {
//     injectcachemodalstyles()
//     createcachemodal()
//     updatecachemodal(`🚀 init_cache ${key}`)
//     const saved = getpersisted(key)
//     const dataset = saved !== null ? saved : initialData
//     updatecachemodal(`ℹ️ loaded ${key} (${Object.keys(dataset).length} entries)`)
//     markdirty(key, dataset)
//     return dataset
//   }
  
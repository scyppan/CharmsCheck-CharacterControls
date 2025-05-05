// const isdataloaded = key => {
//   const getter = window.getCacheData?.[key]
//   if (typeof getter !== 'function') return false
//   const data = getter()
//   if (Array.isArray(data))      return data.length > 0
//   if (data && typeof data === 'object') return Object.keys(data).length > 0
//   return false
// }

// const iscachefresh = (key, ttl = 24 * 60 * 60 * 1000) => {
//   const raw = localStorage.getItem(`cache_${key}`)
//   if (!raw) return false
//   try {
//     const { ts } = JSON.parse(raw)
//     return (Date.now() - ts) < ttl
//   } catch {
//     localStorage.removeItem(`cache_${key}`)
//     return false
//   }
// }

// function startidlefetchsequence(cacheconfigs, {
//   cachettl = 24*60*60*1000,
//   inactivitydelay = 5000,
//   quickthreshold  = 1000
// } = {}) {
//   let index = 0, cumulative = 0, timerid

//   const reset = () => {
//     index = 0; cumulative = 0
//     startidlefetchsequence(cacheconfigs, { cachettl, inactivitydelay, quickthreshold })
//   }

//   const onactivity = () => {
//     clearTimeout(timerid)
//     timerid = setTimeout(onidle, inactivitydelay)
//   }

//   async function onidle() {
//     while (index < cacheconfigs.length) {
//       const { key } = cacheconfigs[index]
//       if (isdataloaded(key) && iscachefresh(key, cachettl)) index++
//       else break
//     }

//     if (index >= cacheconfigs.length) {
//       cleanup()
//       return setTimeout(reset, cachettl)
//     }

//     let lasttime = Infinity
//     do {
//       const { key, fn } = cacheconfigs[index++]
//       const bypass = !iscachefresh(key, cachettl)
//       const start  = performance.now()
//       try {
//         await window[fn](bypass)
//       } catch (e) {
//         console.error(`error loading ${key}:`, e)
//       }
//       lasttime = performance.now() - start
//       cumulative += lasttime

//       while (index < cacheconfigs.length) {
//         const nextKey = cacheconfigs[index].key
//         if (isdataloaded(nextKey) && iscachefresh(nextKey, cachettl)) index++
//         else break
//       }
//     } while (
//       index < cacheconfigs.length &&
//       lasttime < quickthreshold &&
//       cumulative < inactivitydelay
//     )

//     if (index >= cacheconfigs.length || cumulative >= inactivitydelay) {
//       cleanup()
//       setTimeout(reset, cachettl)
//     } else {
//       timerid = setTimeout(onidle, inactivitydelay)
//     }
//   }

//   function cleanup() {
//     clearTimeout(timerid)
//     ['mousemove','mousedown','keydown','scroll','touchstart']
//       .forEach(evt => document.removeEventListener(evt, onactivity))
//   }

//   ['mousemove','mousedown','keydown','scroll','touchstart']
//     .forEach(evt => document.addEventListener(evt, onactivity, { passive: true }))

//   timerid = setTimeout(onidle, inactivitydelay)
// }
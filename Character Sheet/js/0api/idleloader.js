﻿//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

let showidlefetchlogs = true;          // master toggle

let idleactive = false;
let hasloggedstart = false;

const activityevents = ['mousemove','mousedown','keydown','scroll','touchstart'];

let timer = 0;                         // idle arm timer
let cooldowntimer = 0;                 // cooldown timer

const thresh = 5000;                   // ms until we consider the user idle

const stoplisteners = new Map();

// Finite-state machine (single source of truth for logging)
//   'off'       → not running
//   'armed'     → waiting for idle timeout (listeners attached)
//   'cooldown'  → user activity detected; rearm after short delay
//   'running'   → executing idleloader()
let idlestate = 'off';

// ensure we don’t attach listeners multiple times
let listenersattached = false;


//---------
//ENTRY FUNCTION
//---------

function startidlefetchsequence(){
  if (idleactive) return;
  idleactive = true;

  if (!hasloggedstart) {
    logidle('starting idle fetch (background).');
    hasloggedstart = true;
  }

  armidle();
}


//---------
//MAJOR FUNCTIONS
//---------

function armidle(){
  // enter ARMED only if not cooling/running
  if (!idleactive || idlestate === 'cooldown' || idlestate === 'running') return;

  clearTimeout(timer);
  idlestate = 'armed';

  if (!listenersattached) attachstoplisteners();
  timer = setTimeout(() => {
    // timer fired: we became idle
    detachstoplisteners();
    idlestate = 'running';
    idleloader().finally(() => {
      if (!idleactive) return;
      // go back to armed after the work completes
      armidle();
    });
  }, thresh);
}

function attachstoplisteners(){
  if (listenersattached) return;
  listenersattached = true;

  activityevents.forEach(evt => {
    const handler = () => {
      // only react the FIRST time during a given armed window
      if (idlestate !== 'armed') return;

      // transition to cooldown (log once)
      logidle('paused due to user activity — rearming shortly.');
      clearTimeout(timer);
      detachstoplisteners();
      startcooldown();
    };
    stoplisteners.set(evt, handler);
    document.addEventListener(evt, handler, { passive: true });
  });
}

function detachstoplisteners(){
  if (!listenersattached) return;
  stoplisteners.forEach((fn, evt) => document.removeEventListener(evt, fn));
  stoplisteners.clear();
  listenersattached = false;
}

function startcooldown(){
  // go to COOLDOWN, ignore further activity until we rearm
  idlestate = 'cooldown';
  clearTimeout(cooldowntimer);
  cooldowntimer = setTimeout(() => {
    if (!idleactive) return;
    logidle('resumed after inactivity.');
    armidle();                // this sets state back to 'armed'
  }, 5000);
}

async function idleloader(){
  // choose the next dataset
  const key = choosedbtocheck();
  if (!key) return;

  const info = datasetinfo[key];

  // snapshot before
  const beforecache = info.lastcache || 0;

  // check DB freshness (one lightweight call)
  const dblast = await checkdblastupdated(info.formId); // 'YYYY-MM-DD hh:mm:ss'
  info.lastidleloadercheck = Date.now();
  const dbms = parsewpts(dblast);

  // only fetch if needed
  if (info.lastassigned == null || info.lastassigned < dbms) {
    const fnname = 'get' + key;
    const fn = globalThis[fnname];

    if (typeof fn === 'function') {
      const result = await fn();               // data or null (baked)
      info.lastassigned = Date.now();

      const aftercache  = datasetinfo[key].lastcache || 0;
      const aftersource = datasetinfo[key].assignedfrom || 'unknown';
      const fresh       = (aftersource === 'db') && (aftercache > beforecache);
      const dataset     = (result != null ? result : globalThis[key]);
      const size        = countrecords(dataset);

      if (fresh)          logidle(key + ' → fresh DB download (' + size + ' records)');
      else if (aftersource === 'cache')   logidle(key + ' → cache (' + size + ' records)');
      else if (aftersource === 'hardcode')logidle(key + ' → baked snapshot (' + size + ' records)');
      else                                 logidle(key + ' → no change (' + size + ' records)');
    } else {
      logidle('getter not found: ' + fnname);
    }
  }
}

function choosedbtocheck(){
  const entries = Object.entries(datasetinfo);
  if (!entries.length) return null;

  // 1) any never checked, follow priority (characters last)
  for (let i=0;i<idle_priority.length;i++){
    const k = idle_priority[i];
    if (datasetinfo[k] && datasetinfo[k].lastidleloadercheck == null) return k;
  }

  // 2) otherwise the stalest, bias characters to last
  const sorted = entries.slice().sort(function(a,b){
    const at = a[1].lastidleloadercheck;
    const bt = b[1].lastidleloadercheck;
    const abias = a[0] === 'characters' ? 1e15 : 0;
    const bbias = b[0] === 'characters' ? 1e15 : 0;
    return (at + abias) - (bt + bbias);
  });

  return sorted[0][0] || null;
}


//---------
//HELPER FUNCTIONS
//---------

function logidle(msg){
  if (showidlefetchlogs) console.log('[idle]', msg);
}

function parsewpts(ts){
  return Date.parse(String(ts).replace(' ', 'T') + 'Z');
}

function countrecords(val){
  if (val == null) return 0;
  if (Array.isArray(val)) return val.length;
  if (typeof val === 'object') return Object.keys(val).length;
  return 1;
}


//---------
//IMMEDIATE FUNCTIONS
//---------

// none

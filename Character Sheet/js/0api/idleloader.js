﻿//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

let showidlefetchlogs = true;
let idleactive = false;
let hasloggedstart = false;
const activityevents = ['mousemove','mousedown','keydown','scroll','touchstart'];
let timer = 0;
const thresh = 5000;
const stoplisteners = new Map();

// strict priority; characters is intentionally last
const idle_priority = [
  'spells', 'traits','wands','accessories','wandwoods','wandcores','wandqualities',
  'itemsinhand','items','generalitems','creatures','creatureparts',
  'plants','plantparts','preparations','fooddrink','potions','books',
  'schools','proficiencies','namedcreatures',
  'characters'
];

//---------
//ENTRY FUNCTION
//---------

function startidlefetchsequence(){
  if (idleactive) return;
  idleactive = true;
  if (!hasloggedstart) {
    console.log('starting idle fetch. this will run quietly in the background without cessation.');
    hasloggedstart = true;
  }
  starttimer();
}

//---------
//MAJOR FUNCTIONS
//---------

function cooldown(){
  setTimeout(function(){
    starttimer();
  }, 5000);
}

function addstoplisteners(){
  activityevents.forEach(function(evt){
    const fn = function(){
      clearTimeout(timer);
      stripstoplisteners();
    };
    stoplisteners.set(evt, fn);
    document.addEventListener(evt, fn);
  });
}

function stripstoplisteners(){
  stoplisteners.forEach(function(fn, evt){
    document.removeEventListener(evt, fn);
  });
  stoplisteners.clear();
  cooldown();
}

function starttimer(){
  clearTimeout(timer);
  timer = 0;
  addstoplisteners();
  timer = setTimeout(function(){
    stripstoplisteners();
    idleloader();
  }, thresh);
}

async function idleloader(){
  const key = choosedbtocheck();
  if (!key) { if (idleactive) starttimer(); return; }

  const info = datasetinfo[key];

  // capture state before the getter runs
  const beforecache = info.lastcache || 0;
  const beforesource = info.assignedfrom || 'unassigned';

  const dblast = await checkdblastupdated(info.formId); // 'YYYY-MM-DD hh:mm:ss'
  info.lastidleloadercheck = Date.now();
  const dbms = parsewpts(dblast);

  if (info.lastassigned == null || info.lastassigned < dbms) {
    const fnname = 'get' + key;           // e.g., getcharacters
    const fn = globalThis[fnname];        // function declarations are globals
    if (typeof fn === 'function') {
      idlelog('calling getter for ' + key);
      const result = await fn();          // data or null (baked)
      info.lastassigned = Date.now();

      // state after the getter runs
      const aftercache = datasetinfo[key].lastcache || 0;
      const aftersource = datasetinfo[key].assignedfrom || 'unknown';

      const downloadedfresh = (aftersource === 'db') && (aftercache > beforecache);
      const dataset = (result != null ? result : globalThis[key]);
      const size = countrecords(dataset);

      if (downloadedfresh) {
        console.log('[idle]', key, 'downloaded fresh from DB — records:', size);
      } else if (aftersource === 'cache') {
        console.log('[idle]', key, 'served from cache — records:', size);
      } else if (aftersource === 'hardcode') {
        console.log('[idle]', key, 'using baked snapshot — records:', size);
      } else {
        console.log('[idle]', key, 'no change — source:', aftersource, 'records:', size);
      }
    } else {
      idlelog('getter not found: ' + fnname);
    }
  } else {
    idlelog('up-to-date: ' + key);
  }

  if (idleactive) starttimer();
}

function choosedbtocheck(){
  const entries = Object.entries(datasetinfo);
  if (!entries.length) return null;

  // build a lookup for convenience
  const info = datasetinfo;

  // 1) any never checked, follow priority order and skip characters until last
  for (let i=0;i<idle_priority.length;i++){
    const k = idle_priority[i];
    if (info[k] && info[k].lastidleloadercheck == null) return k;
  }

  // 2) otherwise pick the stalest by lastidleloadercheck, but bias characters to the end
  const sorted = entries.slice().sort(function(a,b){
    const ak = a[0], bk = b[0];
    const at = a[1].lastidleloadercheck;
    const bt = b[1].lastidleloadercheck;
    // push characters down by adding a large offset to its timestamp
    const abias = ak === 'characters' ? 1e15 : 0;
    const bbias = bk === 'characters' ? 1e15 : 0;
    return (at + abias) - (bt + bbias);
  });

  return sorted[0][0] || null;
}

//---------
//HELPER FUNCTIONS
//---------

function idlelog(msg){
  if (showidlefetchlogs) console.log('[idle]', msg);
}

function parsewpts(ts){
  // expects 'YYYY-MM-DD hh:mm:ss' from wordpress ajax
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

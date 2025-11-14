﻿//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

let showidlefetchlogs = true;     // master toggle
let idleactive = false;
let hasloggedstart = false;

const activityevents = ['mousemove','mousedown','keydown','scroll','touchstart'];

let timer = 0;                    // idle arm timer
let cooldowntimer = 0;            // single cooldown timer
const thresh = 5000;

const stoplisteners = new Map();

// state machine guards to kill spam
let armed = false;                // true while the idle timer is armed
let ispaused = false;             // true once we’ve logged a pause for this burst
let iscooling = false;            // true while cooldown is counting down

// strict priority; characters is intentionally last
const idle_priority = [
  'spells','traits','wands','accessories','wandwoods','wandcores','wandqualities',
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
    logidle('starting idle fetch (background).');
    hasloggedstart = true;
  }
  starttimer();
}

//---------
//MAJOR FUNCTIONS
//---------

function cooldown(){
  // only one cooldown window at a time
  if (iscooling) return;
  iscooling = true;

  clearTimeout(cooldowntimer);
  cooldowntimer = setTimeout(function(){
    iscooling = false;
    ispaused = false;            // allow the next pause to log once
    if (!idleactive) return;
    logidle('resumed after inactivity.');
    starttimer();
  }, 5000);
}

function addstoplisteners(){
  activityevents.forEach(function(evt){
    const fn = function(){
      // ignore activity if we’re not armed or already cooling/paused
      if (!armed) return;

      // first activity in this burst → log once, disarm, and start cooldown
      if (!ispaused) {
        ispaused = true;
        logidle('paused due to user activity — rearming shortly.');
      }

      // disarm exactly once
      armed = false;
      clearTimeout(timer);
      timer = 0;

      // remove listeners and enter single cooldown window
      stripstoplisteners();
    };
    stoplisteners.set(evt, fn);
    document.addEventListener(evt, fn, { passive: true });
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
  // arm a fresh idle timer
  clearTimeout(timer);
  timer = 0;

  // if we’re cooling, don’t arm another timer yet
  if (iscooling) return;

  armed = true;
  addstoplisteners();
  timer = setTimeout(function(){
    // timer fired → not paused, drop listeners and run loader
    armed = false;
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

  const dblast = await checkdblastupdated(info.formId); // 'YYYY-MM-DD hh:mm:ss'
  info.lastidleloadercheck = Date.now();
  const dbms = parsewpts(dblast);

  if (info.lastassigned == null || info.lastassigned < dbms) {
    const fnname = 'get' + key;            // e.g., getcharacters
    const fn = globalThis[fnname];
    if (typeof fn === 'function') {
      const result = await fn();           // data or null (baked)
      info.lastassigned = Date.now();

      // state after the getter runs
      const aftercache  = datasetinfo[key].lastcache || 0;
      const aftersource = datasetinfo[key].assignedfrom || 'unknown';
      const downloadedfresh = (aftersource === 'db') && (aftercache > beforecache);
      const dataset = (result != null ? result : globalThis[key]);
      const size = countrecords(dataset);

      // single, concise outcome line per cycle
      if (downloadedfresh) {
        logidle(key + ' → fresh DB download (' + size + ' records)');
      } else if (aftersource === 'cache') {
        logidle(key + ' → cache (' + size + ' records)');
      } else if (aftersource === 'hardcode') {
        logidle(key + ' → baked snapshot (' + size + ' records)');
      } else {
        logidle(key + ' → no change (' + size + ' records)');
      }
    } else {
      logidle('getter not found: ' + fnname);
    }
  }

  if (idleactive) starttimer();
}

function choosedbtocheck(){
  const entries = Object.entries(datasetinfo);
  if (!entries.length) return null;

  // 1) any never checked, follow priority order and skip characters until last
  for (let i=0;i<idle_priority.length;i++){
    const k = idle_priority[i];
    if (datasetinfo[k] && datasetinfo[k].lastidleloadercheck == null) return k;
  }

  // 2) otherwise the stalest, with characters biased to last
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

//---------
//GLOBAL VARIABLES (MODULE STATE)
//---------

let showidlefetchlogs = true;
let idleactive = false;
let hasbeentidle = false;
const activityevents = ['mousemove','mousedown','keydown','scroll','touchstart'];
let timer = 0;
const thresh = 5000;
const stoplisteners = new Map();

//---------
//ENTRY FUNCTION
//---------

function startidlefetchsequence(){
  if (idleactive) return;
  idleactive = true;
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
  console.log('starting idle fetch. this will run quietly in the background without cessation.');
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
  if (!key) return;

  const info = datasetinfo[key];
  const dblast = await checkdblastupdated(info.formId); // 'YYYY-MM-DD hh:mm:ss'
  info.lastidleloadercheck = Date.now();
  const dbms = parsewpts(dblast);

  // compare numeric ms; lastassigned is ms
  if (info.lastassigned == null || info.lastassigned < dbms) {
    const fnname = 'get' + key;           // e.g., getcharacters
    const fn = globalThis[fnname];        // function declarations are globals
    if (typeof fn === 'function') {
      idlelog('calling getter for ' + key);
      await fn();
      info.lastassigned = Date.now();
    } else {
      idlelog('getter not found: ' + fnname);
    }
  }

  // schedule next cycle
  if (idleactive) starttimer();
}

function choosedbtocheck(){
  const entries = Object.entries(datasetinfo);
  if (!entries.length) return null;

  // any never checked?
  const never = entries.filter(function(pair){ return pair[1].lastidleloadercheck == null; });
  if (never.length) return never[0][0];

  // otherwise the oldest lastidleloadercheck
  entries.sort(function(a,b){ return a[1].lastidleloadercheck - b[1].lastidleloadercheck; });
  return entries[0][0];
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

//---------
//IMMEDIATE FUNCTIONS
//---------

// none

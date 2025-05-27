let showidlefetchlogs = true
let idleactive = false
let hasbeentidle = false
const activityevents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
let timer = 0;
const thresh = 5000;

const stopListeners = new Map();

function cooldown() {
  //console.log("cooling down");
  setTimeout(() => {
    //console.log("cooldown complete");
    starttimer();
  }, 5000);
}

function addstoplisteners() {
  //console.log("adding stop listeners");
  activityevents.forEach(evt => {
    const fn = () => {
      clearTimeout(timer);
      stripstoplisteners();
      //console.log("timer stopped");
    };
    stopListeners.set(evt, fn);
    document.addEventListener(evt, fn);
  });
}

function stripstoplisteners() {
  stopListeners.forEach((fn, evt) =>
    document.removeEventListener(evt, fn)
  );
  stopListeners.clear();
  cooldown();
}

function starttimer() {
  console.log("starting idle fetch. This will run quietly in the background without cessation.");
  clearTimeout(timer);
  timer=0;
  addstoplisteners(); 
  timer = setTimeout(() => {
  stripstoplisteners();
  idleloader();
}, thresh);
}

async function idleloader() {
  const key = choosedbtocheck();
  //console.log("starting idleloader for " + key);
  const info = datasetinfo[key];
  const dblast = await checkdblastupdated(info.formId);
  info.lastidleloadercheck = Date.now();
  if (info.lastassigned == null || info.lastassigned < dblast) {
    const fn = window['get' + key];
    if (typeof fn === 'function') {
      idlelog(`calling getter for ${key}`);
      await fn();
      info.lastassigned = Date.now();
    }
  }
}

function choosedbtocheck() {
  const arr = Object.entries(datasetinfo);
  // 1) any with null lastidleloadercheck?
  const nulls = arr.filter(([,info]) => info.lastidleloadercheck == null);
  if (nulls.length) return nulls[0][0];
  // 2) else pick the one with the oldest timestamp
  arr.sort(([,a],[,b]) => a.lastidleloadercheck - b.lastidleloadercheck);
  return arr[0][0];
}
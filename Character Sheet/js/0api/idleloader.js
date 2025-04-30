// global tracker for total time spent loading in ms
let cumulativeloadtime = 0;

let modalon = false;


function showstatus(msg) {
  if (modalon) {



    if (!document.body) {
      return document.addEventListener('DOMContentLoaded', () => showstatus(msg));
    }
    let modal = document.getElementById('statusmodal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'statusmodal';
      Object.assign(modal.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '260px',
        maxHeight: '200px',
        padding: '10px',
        background: 'rgba(0,0,0,0.75)',
        color: '#fff',
        fontSize: '12px',
        fontFamily: 'Arial,sans-serif',
        overflowY: 'auto',
        zIndex: 9999,
        borderRadius: '4px'
      });
      document.body.appendChild(modal);
    }
    const line = document.createElement('div');
    line.textContent = msg;
    modal.appendChild(line);
    modal.scrollTop = modal.scrollHeight;
  }

}

/**
 * starts monitoring for 5s of inactivity,
 * loads the next fetch fn whose var is still null/undefined,
 * if any load takes <1s, immediately loads the next,
 * resets on user activity rather than stopping,
 * reports progress to modal and console.
 */
function startidlefetchsequence() {
  const tasks = [
    { fn: gettraits, varname: 'traits', isloaded: () => traits != null },
    { fn: getspells, varname: 'spells', isloaded: () => spells != null },
    { fn: getaccessories, varname: 'accessories', isloaded: () => accessories != null },
    { fn: getbooks, varname: 'books', isloaded: () => books != null },
    { fn: getwands, varname: 'wands', isloaded: () => wands != null },
    { fn: getwandwoods, varname: 'wandwoods', isloaded: () => wandwoods != null },
    { fn: getwandcores, varname: 'wandcores', isloaded: () => wandcores != null },
    { fn: getwandqualities, varname: 'wandqualities', isloaded: () => wandqualities != null },
    { fn: getschools, varname: 'schools', isloaded: () => schools != null }
  ];

  let index = 0;
  let timerid;
  const inactivitydelay = 5000; // ms before next idle check
  const quickthreshold = 1000; // ms to auto-continue

  function onactivity() {
    clearTimeout(timerid);
    showstatus('...activity detected, resetting idle timer');
    timerid = setTimeout(onidle, inactivitydelay);
  }

  async function onidle() {
    showstatus('...checking next source');
    // skip already-loaded
    while (index < tasks.length && tasks[index].isloaded()) {
      showstatus(`...${tasks[index].varname} already loaded, skipping`);
      index++;
    }
    if (index >= tasks.length) {
      showstatus('...all sources processed, stopping idle loader');
      cleanup();
      return;
    }

    // load as many as possible: stop when load ≥1s or cum load ≥5s
    let took = Infinity;
    do {
      const task = tasks[index++];
      showstatus(`...attempting to load ${task.varname}`);
      const start = performance.now();
      try {
        await task.fn();
        took = performance.now() - start;
        cumulativeloadtime += took;
        showstatus(`...${task.varname} loaded in ${Math.round(took)}ms (cumulative ${Math.round(cumulativeloadtime)}ms)`);
        const loadedcount = tasks.filter(t => t.isloaded()).length;
        console.log(`${loadedcount} of ${tasks.length} loaded`);
      } catch (err) {
        took = quickthreshold; // force stop on error
        showstatus(`...${task.varname} error: ${err.message || err}`);
      }
      // skip newly-loaded
      while (index < tasks.length && tasks[index].isloaded()) {
        showstatus(`...${tasks[index].varname} already loaded, skipping`);
        index++;
      }
    } while (
      index < tasks.length &&
      took < quickthreshold &&
      cumulativeloadtime < inactivitydelay
    );

    // decide next step
    if (cumulativeloadtime >= inactivitydelay) {
      showstatus('...cumulative load time ≥5000ms, stopping idle loads');
      cleanup();
    } else if (index >= tasks.length) {
      showstatus('...all sources processed, stopping idle loader');
      cleanup();
    } else {
      showstatus(`...waiting ${inactivitydelay}ms of inactivity for next load`);
      timerid = setTimeout(onidle, inactivitydelay);
    }
  }

  function cleanup() {
    clearTimeout(timerid);
    ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
      .forEach(evt => document.removeEventListener(evt, onactivity));
  }

  // listen for user activity and start timer
  ['mousedown', 'keydown', 'touchstart']
    .forEach(evt => document.addEventListener(evt, onactivity, { passive: true }));
  showstatus('...idle loader started, waiting for inactivity');
  timerid = setTimeout(onidle, inactivitydelay);
}


function rolltext(rollobj){

    const charname=currentchar.meta['5syv4'];
    const critresult=checkcritfail(rollobj.dice);

    switch(rollobj.type.toLowerCase()){
        case "power":
        case "panache":
        case "erudition":
        case "naturalism":
            if(critresult=='success'){
                rollobj.text= `${charname} CRITICALLY SUCCEEDS a straight ${rollobj.type} roll with a total roll value of ${rollobj.total}.`
            }else if(critresult=='fail'){
                rollobj.text= `${charname} CRITICALLY FAILS a straight ${rollobj.type} roll.`
            }else{
                rollobj.text= `${charname} rolls a straight ${rollobj.type} roll with a total roll value of ${rollobj.total}.`
            }
        break;
        
        case "charms":
        case "darkarts":
        case "defense":
        case "transfiguration":
            if(critresult=='success'){
                rollobj.text= `${charname} attempts to cast a straight ${getname(rollobj.type,'display')} spell and CRITICALLY SUCCEEDS with a total roll value of ${rollobj.total}.`
            }else if(critresult=='fail'){
                rollobj.text= `${charname} attempts to cast a straight ${getname(rollobj.type,'display')} spell and CRITICALLY FAILS.`
            }else{
                rollobj.text= `${charname} attempts to cast a straight ${getname(rollobj.type,'display')} spell with a total roll value of ${rollobj.total}.`
            }

    }
    return rollobj;
}

function showrollmodal(rollobj) {
    // 1) Record the new roll
    if (rollobj && typeof rollobj.text === 'string') {
      if (!Array.isArray(rollhistory)) rollhistory = [];
      rollhistory.push(rollobj);
    }
  
    // 2) Grab last three
    const entries = Array.isArray(rollhistory)
      ? rollhistory.slice(-3)
      : [];
  
    // 3) Find or create the modal
    let modal = document.getElementById('roll-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'roll-modal';
      modal.classList.remove('minimized');
  
      const toggle = document.createElement('button');
      toggle.className = 'roll-toggle';
      toggle.textContent = '–';
      toggle.addEventListener('click', () => {
        modal.classList.toggle('minimized');
        toggle.textContent = modal.classList.contains('minimized') ? '+' : '–';
      });
  
      modal.appendChild(toggle);
      document.body.appendChild(modal);
    } else {
      // always expand on new roll
      modal.classList.remove('minimized');
      const toggle = modal.querySelector('.roll-toggle');
      if (toggle) toggle.textContent = '–';
    }
  
    // 4) Remove old list (preserve toggle)
    const oldUl = modal.querySelector('ul');
    if (oldUl) oldUl.remove();
  
    // 5) Build and append new list
    const ul = document.createElement('ul');
    entries.forEach(({ text }) => {
      const li = document.createElement('li');
      li.textContent = text;
      ul.appendChild(li);
    });
    modal.appendChild(ul);
  }

function addtorollhistory(rollobj) {
    rollhistory.push({
        ...rollobj,
        timestamp: Date.now()
    });
}
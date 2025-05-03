function attachbasicroll(btn) {
    btn.addEventListener('click', function () {

        showrollmodal(`basic roll: 
        
            ${constructrollobj('basic')}
        
        `);

    });
}

function attachabilityroll(btn) {
    btn.addEventListener('click', function () {
        
        let ability=btn.id
        let abilityval =getabilityvalue(ability); 

        let rollobj = constructrollobj(ability);
        rollobj.dice = randbetween(1,10);
        rollobj.ability=abilityval.base;
        rollobj.type=ability;
        rollobj.wand=abilityval.wand,
        rollobj.iteminhand=abilityval.iteminhand,
        rollobj.accessories=abilityval.accessories,
        
        rollobj=getrollresult(rollobj);
        console.log(rollobj);
        showrollmodal(rollobj.text);
    });
}

function attachskillroll(btn) {
    btn.addEventListener('click', function () {
        showrollmodal('skill roll');
    });
}

function attachcharacteristicroll(btn) {
    btn.addEventListener('click', function () {
        showrollmodal('characteristic roll');
    });
}

function attachparentalroll(btn) {
    btn.addEventListener('click', function () {
        showrollmodal('parental roll');
    });
}

function attachspellroll(btn) {
    btn.addEventListener('click', function (e) {
        if (e.altKey) {
            showrollmodal(btn.title);
        } else {
            showrollmodal('spell roll');
        }
    });
}

function attachproficiencyroll(btn) {
    btn.addEventListener('click', function (e) {
        if (e.altKey) {
            showrollmodal(btn.title);
        } else {
            showrollmodal('proficiency roll');
        }
    });
}

function attachpotionroll(btn) {
    btn.addEventListener('click', function (e) {
        if (e.altKey) {
            showrollmodal(btn.title);
        } else {
            showrollmodal('potion roll');
        }
    });
}

function attachpetroll(btn) {
    btn.addEventListener('click', function (e) {
        if (e.altKey) {
            showrollmodal(btn.title);
        } else {
            showrollmodal('petroll');
        }
    });
}
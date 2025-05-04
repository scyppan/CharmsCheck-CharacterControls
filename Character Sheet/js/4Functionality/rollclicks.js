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
        rollobj.wand=abilityval.wandbonus+abilityval.wandquality;
        rollobj.iteminhand=abilityval.iteminhand;
        rollobj.accessories=abilityval.accessories;
        
        rollobj=getrollresult(rollobj);
        showrollmodal(rollobj.text);
    });
}

function attachskillroll(btn) {
    btn.addEventListener('click', function () {

        let skill=getname(btn.id,'standard');
        let skillval =getskillvalue(skill); 
        let abilityname=getabilityfromskill(skill);
        let abilityval =getabilityvalue(abilityname);
        let abilitytotal=abilityval.base

        let rollobj = constructrollobj(skill);
        rollobj.dice = randbetween(1,10);

        rollobj.ability=abilitytotal;
        rollobj.skill=
            skillval.buys + skillval.eminence +
            skillval.corecourses + skillval.electivecourses;
        rollobj.type=skill;
        rollobj.wand=skillval.wandbonus+skillval.wandquality+abilityval.wandbonus;
        rollobj.iteminhand=skillval.iteminhand+abilityval.iteminhand;
        rollobj.accessories=skillval.accessories+abilityval.accessories;
        rollobj.trait=skillval.trait;

        rollobj

        rollobj=getrollresult(rollobj);
        showrollmodal(rollobj.text);
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
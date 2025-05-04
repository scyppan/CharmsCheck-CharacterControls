function attachbasicroll(btn) {
    btn.addEventListener('click', function () {

        showrollmodal(`basic roll: 
        
            ${constructrollobj('basic')}
        
        `);

    });
}

function attachabilityroll(btn) {
    btn.addEventListener('click', function () {

        let ability = btn.id
        let abilityval = getabilityvalue(ability);

        let rollobj = constructrollobj(ability);

        rollobj.dice = randbetween(1, 10);
        rollobj.ability = abilityval.base;
        rollobj.type = ability;
        rollobj.wand = abilityval.wandbonus + abilityval.wandquality;
        rollobj.iteminhand = abilityval.iteminhand;
        rollobj.accessories = abilityval.accessories;

        rollobj = getrollresult(rollobj);
        showrollmodal(rollobj.text);
    });
}

function attachskillroll(btn) {
    btn.addEventListener('click', function () {

        let skill = getname(btn.id, 'standard');
        let skillval = getskillvalue(skill);
        let abilityname = getabilityfromskill(skill);
        let abilityval = getabilityvalue(abilityname);
        let abilitytotal = abilityval.base

        let rollobj = constructrollobj(skill);
        rollobj.dice = randbetween(1, 10);

        rollobj.ability = abilitytotal;
        rollobj.skill =
            skillval.buys + skillval.eminence +
            skillval.corecourses + skillval.electivecourses;
        rollobj.wand = skillval.wandbonus + skillval.wandquality + abilityval.wandbonus;
        rollobj.iteminhand = skillval.iteminhand + abilityval.iteminhand;
        rollobj.accessories = skillval.accessories + abilityval.accessories;
        rollobj.trait = skillval.trait;

        rollobj = getrollresult(rollobj);
        showrollmodal(rollobj.text);
    });
}

function attachcharacteristicroll(btn) {
    btn.addEventListener('click', function () {

        let rollobj = constructrollobj(btn.id);

        //dice are added later on getrollresult
        rollobj.iteminhand=getcharacteristicvalfromiteminhand(btn.id)
        rollobj.accessories=getattrbvalfromaccessories(btn.id);
        
        //inventory bonuses need to be added.

        rollobj = getrollresult(rollobj);
        showrollmodal(rollobj.text);

    });
}

function attachparentalroll(btn) {
    btn.addEventListener('click', function () {
        
        let parentalvals=getparental();
        let rollobj = constructrollobj(btn.id);
        rollobj.dice = randbetween(1, 10);
        rollobj.parental = parentalvals[btn.id.toLowerCase()];
        console.log(rollobj);
        rollobj = getrollresult(rollobj);
        showrollmodal(rollobj.text);
    });
}

function attachspellroll(btn) {
    btn.addEventListener('click', function (e) {
        // Alt-click shows the tooltip
        if (e.altKey) {
            showrollmodal(btn.title);
            return;
        }

        // 1) Pull metadata straight from the button’s dataset
        const spellname = btn.dataset.spellname;
        const skill     = btn.dataset.spellskill;
        const subtype   = btn.dataset.spellsubtype;
        const threshold = Number(btn.dataset.spellthreshold);

        // 2) Construct your roll object using the skill as the type
        let rollobj = constructrollobj("spell");
        let skillval = getskillvalue(skill);
        let abilityname = getabilityfromskill(skill);
        let abilityval = getabilityvalue(abilityname);
        let abilitytotal = abilityval.base

        rollobj.dice = randbetween(1, 10);

        rollobj.ability = abilitytotal;
        rollobj.skill =
            skillval.buys + skillval.eminence +
            skillval.corecourses + skillval.electivecourses;
        rollobj.wand = skillval.wandbonus + skillval.wandquality + abilityval.wandbonus;
        
        let iteminhandsubtypebonus = getsubtypevalfromiteminhand(subtype);
        let accessoriessubtypebonus = getattrbvalfromaccessories(subtype);
        rollobj.iteminhand = skillval.iteminhand + 
            abilityval.iteminhand +
            iteminhandsubtypebonus;
        rollobj.accessories = skillval.accessories +
            abilityval.accessories +
            accessoriessubtypebonus;

        rollobj.trait = gettotalsubtypebonus(rollobj);

        // 3) Store the rest of your metadata on the roll object
        rollobj.spell     = spellname;
        rollobj.subtype   = subtype;
        rollobj.threshold = threshold;

        // 4) Execute the roll and display the result
        rollobj = getrollresult(rollobj);
        showrollmodal(rollobj.text);
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
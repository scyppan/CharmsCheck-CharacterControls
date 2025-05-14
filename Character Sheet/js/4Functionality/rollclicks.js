function attachbasicroll(btn) {
    btn.addEventListener('click', function () {

        showrollmodal(`basic roll: 
        
            ${constructrollobj('basic')}
        
        `);

    });

    window.parent.postMessage(rollobj.text,"*");
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
        rollobj.inventory=getpassivebonusesbyattribute(abilityname);
        rollobj = getrollresult(rollobj);
        showrollmodal(rollobj.text);
        window.parent.postMessage(rollobj.text,"*");
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
        rollobj.inventory=getpassivebonusesbyattribute(abilityname)+
            getpassivebonusesbyattribute(skill);


        rollobj = getrollresult(rollobj);
        showrollmodal(rollobj.text);
        window.parent.postMessage(rollobj.text,"*");
    });
}

function attachcharacteristicroll(btn) {
    btn.addEventListener('click', function () {

        let rollobj = constructrollobj(btn.id);

        //dice are added later on getrollresult
        rollobj.iteminhand = getcharacteristicvalfromiteminhand(btn.id)
        rollobj.accessories = getattrbvalfromaccessories(btn.id);
        rollobj.inventory=getpassivebonusesbyattribute(btn.id);

        rollobj = getrollresult(rollobj);
        showrollmodal(rollobj.text);
        window.parent.postMessage(rollobj.text,"*");

    });
}

function attachparentalroll(btn) {
    btn.addEventListener('click', function () {

        let parentalvals = getparental();
        let rollobj = constructrollobj(btn.id);
        rollobj.dice = randbetween(1, 10);
        rollobj.parental = parentalvals[btn.id.toLowerCase()];
        console.log(rollobj);
        rollobj = getrollresult(rollobj);
        showrollmodal(rollobj.text);
        window.parent.postMessage(rollobj.text,"*");
    });
}

function attachspellroll(btn) {
    btn.addEventListener('click', function (e) {
        // Alt-click shows the tooltip
        if (e.altKey) {
            console.log(btn.title);
            return;
        }

        // 1) Pull metadata straight from the button’s dataset
        const spellname = btn.dataset.spellname;
        const skill = btn.dataset.spellskill;
        const subtype = btn.dataset.spellsubtype;
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

        rollobj.inventory=getpassivebonusesbyattribute(abilityname)+
            getpassivebonusesbyattribute(skill);

        // 3) Store the rest of your metadata on the roll object
        rollobj.spell = spellname;
        rollobj.subtype = subtype;
        rollobj.threshold = threshold;

        rollobj.trait = gettotalsubtypebonus(rollobj);

        // 4) Execute the roll and display the result
        rollobj = getrollresult(rollobj);
        showrollmodal(rollobj.text);
        window.parent.postMessage(rollobj.text,"*");
    });
}

function attachproficiencyroll(btn) {
    btn.addEventListener('click', function (e) {
        // Alt-click shows the tooltip
        if (e.altKey) {
            console.log(btn.title);
            return;
        }

        // 1) Pull metadata from the button's dataset
        const proficiencyName = btn.dataset.proficiencyname;
        const skill = btn.dataset.proficiencyskill;
        const threshold = Number(btn.dataset.proficiencythreshold);

        // 2) Construct the roll object
        let rollobj = constructrollobj('proficiency');
        let skillval = getskillvalue(skill);
        let abilityName = getabilityfromskill(skill);
        let abilityval = getabilityvalue(abilityName);
        let abilitytotal = abilityval.base;

        rollobj.dice = randbetween(1, 10);

        rollobj.ability = abilitytotal;
        rollobj.skill = skillval.buys + skillval.eminence +
            skillval.corecourses + skillval.electivecourses;

        // Proficiencies don't use wand bonus or subtypes
        rollobj.iteminhand = skillval.iteminhand + abilityval.iteminhand;
        rollobj.accessories = skillval.accessories + abilityval.accessories;

        rollobj.inventory=getpassivebonusesbyattribute(abilityname)+
            getpassivebonusesbyattribute(skill);

        // Trait bonuses linked to skill
        rollobj.trait = getskillbonusesfromtraits()
            .reduce((sum, bonus) =>
                bonus.skill === skill ? sum + bonus.amt : sum
                , 0);

        // 3) Store metadata on the roll object
        rollobj.proficiency = proficiencyName;
        rollobj.threshold = threshold;

        // 4) Execute the roll and display the result
        rollobj = getrollresult(rollobj);
        showrollmodal(rollobj.text);
        window.parent.postMessage(rollobj.text,"*");
    });
}

function attachpotionroll(btn) {
    btn.addEventListener('click', function (e) {
        if (e.altKey) {
            console.log(btn.title);
        } else {

            const potionname = btn.dataset.potionname;
            const skill = btn.dataset.skill;
            const threshold = Number(btn.dataset.threshold);
            let abilityname = getabilityfromskill(skill);

            let rollobj = constructrollobj('potion');
            let skillval = getskillvalue(skill);
            let abilityval = getabilityvalue('Panache');
            let abilitytotal = abilityval.base;

            rollobj.dice = randbetween(1, 10);

            rollobj.ability = abilitytotal;
            rollobj.skill = skillval.buys + skillval.eminence +
                skillval.corecourses + skillval.electivecourses;

            rollobj.iteminhand = skillval.iteminhand + abilityval.iteminhand;
            rollobj.accessories = skillval.accessories + abilityval.accessories;
            rollobj.potion = potionname;
            rollobj.threshold = threshold;

            rollobj.inventory=getpassivebonusesbyattribute(abilityname)+
                getpassivebonusesbyattribute(skill);

            rollobj = getrollresult(rollobj);
            showrollmodal(rollobj.text);
            window.parent.postMessage(rollobj.text,"*");
        }
    });
}

function posttitle(btn) {
    btn.addEventListener('click', function (e) {
        
        window.parent.postMessage(btn.title,"*");
        console.log(btn.title);
    });
}


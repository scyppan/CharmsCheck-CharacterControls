function rolltext(rollobj) {

    const charname = currentchar.meta['5syv4'];
    const critresult = checkcritfail(rollobj.dice);

    switch (rollobj.type.toLowerCase()) {
        case "power":
        case "panache":
        case "erudition":
        case "naturalism":
            if (critresult == 'success') {
                rollobj.text = `${charname} CRITICALLY SUCCEEDS a straight ${rollobj.type} roll with a total roll value of ${rollobj.total}.`
            } else if (critresult == 'fail') {
                rollobj.text = `${charname} CRITICALLY FAILS a straight ${rollobj.type} roll.`
            } else {
                rollobj.text = `${charname} rolls a straight ${rollobj.type} roll with a total roll value of ${rollobj.total}.`
            }
            break;

        case "charms":
        case "darkarts":
        case "defense":
        case "transfiguration":
            if (critresult == 'success') {
                rollobj.text = `${charname} attempts to cast a straight ${getname(rollobj.type, 'display')} spell and CRITICALLY SUCCEEDS with a total roll value of ${rollobj.total}.`
            } else if (critresult == 'fail') {
                rollobj.text = `${charname} attempts to cast a straight ${getname(rollobj.type, 'display')} spell and CRITICALLY FAILS.`
            } else {
                rollobj.text = `${charname} attempts to cast a straight ${getname(rollobj.type, 'display')} spell with a total roll value of ${rollobj.total}.`
            }
            break;
        case 'alchemy':
        case 'flying':
        case 'muggles':
        case 'runes':
        case 'divination':
        case 'arithmancy':
        case 'astronomy':
        case 'history':
        case 'potions':
        case 'artificing':
        case 'herbology':
        case 'creatures':
        case 'perception':
        case 'social':
            {
                const skillName = getname(rollobj.type, 'display');
                const article = /^[aeiou]/i.test(skillName) ? 'an' : 'a';

                if (critresult === 'success') {
                    rollobj.text = `${charname} attempts ${article} ${skillName} check and CRITICALLY SUCCEEDS with a total roll value of ${rollobj.total}.`;
                } else if (critresult === 'fail') {
                    rollobj.text = `${charname} attempts ${article} ${skillName} check and CRITICALLY FAILS.`;
                } else {
                    rollobj.text = `${charname} attempts ${article} ${skillName} check with a total roll value of ${rollobj.total}.`;
                }
            } break;
        case 'fortitude':
        case 'willpower':
        case 'intellect':
        case 'creativity':
        case 'equanimity':
        case 'charisma':
        case 'attractiveness':
        case 'strength':
        case 'agility':
            // rollobj.total should already be computed elsewhere
            rollobj.text = `${charname} rolls a ${getname(rollobj.type, 'display')} roll with a total roll value of ${rollobj.total}.`;
            break;
        case 'generosity':
        case 'wealth':
        case 'permissiveness':
            if (critresult === 'success') {
                rollobj.text = `${charname}’s parents roll a ${getname(rollobj.type, 'display')} roll and CRITICALLY SUCCEED. \nThey deny ${charname}’s request.`;
            } else if (critresult === 'fail') {
                rollobj.text = `${charname}’s parents roll a ${getname(rollobj.type, 'display')} roll and CRITICALLY FAIL. \nThey agree to ${charname}’s request.`;
            } else {
                rollobj.text = `${charname}’s parents roll a ${getname(rollobj.type, 'display')} roll with a total roll value of ${rollobj.total}.`;
            }
            break;
        case "spell":
            if (rollobj.spell === 'Common Shielding Spell' && rollobj.dice == 10) {
                rollobj.text = `${charname} CRITICALLY SUCCEEDS in casting Protego! The incoming attack is automatically rebuffed!`;
            } else if (rollobj.dice === 1) {
                rollobj.text = `${charname} CRITICALLY FAILS to cast ${rollobj.spell}.`;
            } else if (rollobj.dice === 10 && rollobj.total > rollobj.threshold) {
                rollobj.text = `${charname} CRITICALLY SUCCEED in casting ${rollobj.spell} with a total roll value of ${rollobj.total}.`;
            } else if (rollobj.total >= rollobj.threshold) {
                rollobj.text = `${charname} successfully casts ${rollobj.spell} with a total roll value of ${rollobj.total}.`;
            } else {
                rollobj.text = `${charname} Fails to cast ${rollobj.spell}.`;
            }
        break;
        case "proficiency":
            if (rollobj.dice === 1) {
                rollobj.text = `${charname} CRITICALLY FAILS to perform the proficiency ${rollobj.proficiency}.`;
            } else if (rollobj.dice === 10 && rollobj.total > rollobj.threshold) {
                rollobj.text = `${charname} CRITICALLY SUCCEED in performing the proficiency ${rollobj.proficiency} with a total roll value of ${rollobj.total}.`;
            } else if (rollobj.total >= rollobj.threshold) {
                rollobj.text = `${charname} successfully performed the proficiency ${rollobj.proficiency} with a total roll value of ${rollobj.total}.`;
            } else {
                rollobj.text = `${charname} Fails to perform the ${rollobj.proficiency} proficiency.`;
            }
        break;
        case "potion":
            if (rollobj.dice === 1) {
                rollobj.text = `${charname} CRITICALLY FAILS to brew ${rollobj.potion}. What a mess!`;
            } else if (rollobj.dice === 10 && rollobj.total > rollobj.threshold) {
                rollobj.text = `${charname} CRITICALLY SUCCEED in brewing ${rollobj.potion} with a total roll value of ${rollobj.total}. \nRecord this value as the set value of the potions.`;
            } else if (rollobj.total >= rollobj.threshold) {
                rollobj.text = `${charname} successfully brewed ${rollobj.potion} with a total roll value of ${rollobj.total}. Record this value as the set value of the potions.`;
            } else {
                rollobj.text = `${charname} Fails to brew ${rollobj.potion}.`;
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
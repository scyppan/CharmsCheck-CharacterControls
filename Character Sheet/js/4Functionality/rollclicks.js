function attachbasicroll(btn) {
    btn.addEventListener('click', function() {

        showrollmodal(`basic roll: ${randbetween(1,10)}` );

    });
}

function attachabilityroll(btn) {
    btn.addEventListener('click', function() {
        showrollmodal('ability roll');
    });
}

function attachskillroll(btn) {
    btn.addEventListener('click', function() {
        showrollmodal('skill roll');
    });
}

function attachcharacteristicroll(btn) {
    btn.addEventListener('click', function() {
        showrollmodal('characteristic roll');
    });
}

function attachparentalroll(btn) {
    btn.addEventListener('click', function() {
        showrollmodal('parental roll');
    });
}

function attachspellroll(btn) {
    btn.addEventListener('click', function(e) {
        if (e.altKey) {
            showrollmodal(btn.title);
        } else {
            showrollmodal('spell roll');
        }
    });
}

function attachproficiencyroll(btn) {
    btn.addEventListener('click', function(e) {
        if (e.altKey) {
            showrollmodal(btn.title);
        } else {
            showrollmodal('proficiency roll');
        }
    });
}

function attachpotionroll(btn) {
    btn.addEventListener('click', function(e) {
        if (e.altKey) {
            showrollmodal(btn.title);
        } else {
            showrollmodal('potion roll');
        }
    });
}

function attachpetroll(btn) {
    btn.addEventListener('click', function(e) {
        if (e.altKey) {
            showrollmodal(btn.title);
        } else {
            showrollmodal('petroll');
        }
    });
}
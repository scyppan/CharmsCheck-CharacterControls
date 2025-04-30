function getknownspells() {

    let myspellsarray = [];

    for (let i = 0; i < Object.keys(currentchar.meta.po8up).length; i++) {
        myspellsarray.push({
            favorite: currentchar.meta['7amse'][i],
            spellname: currentchar.meta.po8up[i],
            skill: currentchar.meta.rgp6l[i],
            difficulty: Number(currentchar.meta.f6t78[i]),
            source: currentchar.meta.spelllearnedfrom[i]

        });
    }

    return myspellsarray;
}


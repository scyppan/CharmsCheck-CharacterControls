function getwandeffects() {

    let wand = matchwand(currentchar.meta['bru22']);

    if (wand) {
        let wood = matchwandwood(wand.meta.wandwood);
        let core = matchwandcore(wand.meta.wandcore);

        return [
            ...getwoodbonusprofile(wood),
            ...getcorebonusprofile(core),
        ];
    } else {
        return [];
    }
}

// =============================

function matchwand(wandname) {

    const target = wandname.toLowerCase().trim();
    // If wands is not an array, convert its values into one.
    let wandlist = Array.isArray(wands) ? wands : Object.values(wands);
    return wandlist.find(wand => wand.meta.wandname.toLowerCase().trim() === target);
}

function matchwandwood(wood) {
    const target = wood.toLowerCase().trim();
    let woodlist = Array.isArray(wandwoods) ? wandwoods : Object.values(wandwoods);
    return woodlist.find(entry => entry.meta.woodname.toLowerCase().trim() === target);
}

function matchwandcore(core) {
    const target = core.toLowerCase().trim();
    const corelist = Array.isArray(wandcores) ? wandcores : Object.values(wandcores);
    return corelist.find(entry => entry.meta.corename.toLowerCase().trim() === target);
}

function matchwandquality(quality) {
    const target = quality.toLowerCase().trim();
    const qualitylist = Array.isArray(wandqualities) ? wandqualities : Object.values(wandqualities);
    return qualitylist.find(entry => entry.meta.qualityname.toLowerCase().trim() === target);
}

function getwoodbonusprofile(wood) {
    let bonuslist = [];

    if (wood.meta.woodbonustype) {
        let len = wood.meta.woodbonustype.length;


        for (let i = 0; i < len; i++) {
            bonuslist.push({
                source: "wandwood",
                type: wood.meta.woodbonustype[i],
                attribute: getname(wood.meta.woodbonusability[i] || wood.meta.woodbonusskill[i] || wood.meta.woodbonussubtype[i] || wood.meta.woodbonuscharacteristic[i], 'standard'),
                amt: wood.meta.woodbonusamt[i]
            })
        }
    }

    return bonuslist;
}

function getcorebonusprofile(core) {
    let len = core.meta.corebonustype.length;
    let bonuslist = [];

    for (let i = 0; i < len; i++) {
        bonuslist.push({
            source: "wandcore",
            type: core.meta.corebonustype[i],
            attribute: getname(core.meta.corebonusability[i] || core.meta.corebonusskill[i] || core.meta.corebonussubtype[i] || core.meta.corebonuscharacteristic[i], 'standard'),
            amt: core.meta.corebonusamt[i]
        })
    }

    return bonuslist;
}

function getwandqualityadjustment() {
    let wandname = currentchar.meta['bru22'];

    if (wandname) {
        let matchedwand = matchwand(wandname);
        let quality = matchwandquality(matchedwand.meta.wandquality);

        return Number(quality.meta.qualitycastingeffect);
    } else {
        return Number(0);
    }
}

function getwandqualityadjustmentforability(ability) {
    if (ability.toLowerCase() == 'power') {
        return Number(getwandqualityadjustment());
    } else {
        return Number(0);
    }
}
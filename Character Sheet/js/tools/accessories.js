function getallaccessorybonusprofile() {
    let accessory1 = findaccessoryentry(currentchar.meta['qb029']);
    let accessory2 = findaccessoryentry(currentchar.meta['vykq1']);

    let bonusarray = [
        ...getaccessorybonusprofile(accessory1),
        ...getaccessorybonusprofile(accessory2),
    ]

    return bonusarray;
}

// =============================

function findaccessoryentry(acc) {
    if (acc) {
        const target = acc.toLowerCase().trim();
        const accessorylist = Array.isArray(accessories) ? accessories : Object.values(accessories);
        return accessorylist.find(entry => entry.meta.accessoryname && entry.meta.accessoryname.toLowerCase().trim() === target);
    }
}

function getaccessorybonusprofile(acc) {
    if (acc) {
        let bonuslist = [];

        if (acc.meta.accessorybonustype) {
            let len = acc.meta.accessorybonustype.length;


            for (let i = 0; i < len; i++) {
                bonuslist.push({
                    type: acc.meta.accessorybonustype[i],
                    attribute: getname(acc.meta.accessoryabilitybonus[i] || acc.meta.accessoryskillbonus[i] || acc.meta.accessorysubtypebonus[i] || acc.meta.accessorycharacteristicbonus[i], 'standard'),
                    amt: acc.meta.accessorybonusamt[i]
                })
            }
        }
        return bonuslist;
    }else{
        return [];
    }
}
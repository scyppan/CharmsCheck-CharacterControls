function getiteminhandbonusprofile() {
    let bonuslist = [];

    if (!Array.isArray(itemsinhand)) return bonuslist;

    const equippedItem = itemsinhand.find(item =>
        item.meta?.iteminhanditemname === currentchar?.meta?.iteminhand
    );

    if (!equippedItem || !equippedItem.meta) return bonuslist;

    const meta = equippedItem.meta;

    const types = meta.iteminhandbonustype || [];
    const ability = meta.iteminhandabilitybonus || [];
    const skill = meta.iteminhandskillbonus || [];
    const characteristic = meta.iteminhandcharacteristicbonus || [];
    const subtype = meta.iteminhandsubtypebonus || [];
    const amt = meta.iteminhandbonusamt || [];

    const bonuslen = types.length;

    for (let i = 0; i < bonuslen; i++) {
        bonuslist.push({
            source: meta.iteminhanditemname,
            bonustype: ability[i] || skill[i] || characteristic[i] || subtype[i] || "none",
            amt: amt[i]
        });
    }

    return bonuslist;
}

function getiteminhandbonusbyattribute(attribute) {
    const bonuses = getiteminhandbonusprofile();

    return bonuses.reduce((sum, bonus) => {
        if (
            getname(bonus.bonustype, 'standard').toLowerCase() ===
            getname(attribute, 'standard').toLowerCase()
        ) {
            if (Array.isArray(bonus.amt)) {
                return sum + bonus.amt.reduce((subsum, val) => subsum + parseFloat(val), 0);
            } else {
                return sum + parseFloat(bonus.amt);
            }
        }
        return sum;
    }, 0);
}
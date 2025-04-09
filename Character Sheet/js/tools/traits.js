function gettraitdescription(traitname) {
    const matchingTrait = Object.values(traits).find(trait =>
        trait.meta.traitname === traitname
      );
      
    if (!matchingTrait) return '';
    const type = matchingTrait.meta.b78xl[0];
    const amt = matchingTrait.meta.traitbonusamt[0];
    let traittext = '';
    if (type === "Skill") {
      traittext = `+${amt} to ${matchingTrait.meta.traitbonusskill[0]}`;
    } else if (type === "Subtype") {
      traittext = `+${amt} when casting spells of the ${matchingTrait.meta.traitbonussubtype[0]} subtype`;
    } else {
      traittext = matchingTrait.meta.traitancillarybonus[0];
    }
    return traittext;
  }
  
  function gettraitattribute(traitname) {
    switch(traitname) {
        case 'Star gazer': return {attribute: "Astronomy", source: 'Trait', amt: 3}
        case 'Bookworm': return {attribute: "History", source: 'Trait', amt: 3}
        case 'Animal lover': return {attribute: "Creatures", source: 'Trait', amt: 1}
        case 'People person': return {attribute: "Social", source: 'Trait', amt: 1}
        case 'Clairvoyant': return {attribute: "Divination", source: 'Trait', amt: 3}
        case 'Navigator': return {attribute: "Flying", source: 'Trait', amt: 2}
        case 'Observant': return {attribute: "Perception", source: 'Trait', amt: 1}
        case 'Green thumb': return {attribute: "Herbology", source: 'Trait', amt: 3}
        case 'Frugal': return {}
        case 'Curious': return {attribute: "Arithmancy", source: 'Trait', amt: 1}
        case 'Inventive': return {attribute: "Artificing", source: 'Trait', amt: 1}
        case 'Runologist': return {attribute: "Runes", source: 'Trait', amt: 2}
        case 'Protective': return {attribute: "Shielding", source: 'Trait', amt: 3}
        case 'Caring': return {attribute: "Healing", source: 'Trait', amt: 2}
        case 'Environmentalist': return {attribute: "Environmental", source: 'Trait', amt: 3}
        case 'Needler': return {attribute: "Mental", source: 'Trait', amt: 3}
        case 'Contrarian': return {attribute: "Counterspell", source: 'Trait', amt: 2}
        case 'Resistant': return {attribute: "Resistant", source: 'Trait', amt: 3}
        case 'Controlling': return {attribute: "Controlling", source: 'Trait', amt: 2}
        case 'Supportive': return {attribute: "Enhancing", source: 'Trait', amt: 3}
        case 'Ouster': return {attribute: "Banishing", source: 'Trait', amt: 3}
        case 'Secretive': return {attribute: "Concealing", source: 'Trait', amt: 3}
        case 'Crafty': return {attribute: "Enchanting", source: 'Trait', amt: 3}
        default: break;
    }
}

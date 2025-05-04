function gettraitdescription(traitname) {
    const matchingTrait = Object.values(traits).find(trait =>
        trait.meta.traitname === traitname
      );
      
      if (!matchingTrait) return '';
      const type = matchingTrait.meta.b78xl[0];
      const amt = matchingTrait.meta.traitbonusamt[0];
      let traittext = '';
      if (type === "Skill") {
        traittext = `+${amt} to ${matchingTrait.meta.traitbonusskill[0]}\n\nNote: This value is already added to the sum shown for this skill above.`;
      } else if (type === "Subtype") {
        traittext = `+${amt} when casting spells of the ${matchingTrait.meta.traitbonussubtype[0]} subtype\n\nNote: you must click a spell to cast (from your spellbook) to utilize these bonuses. \nIf you cast a straight skill roll, your subtype bonus will not be included.`;
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

function getchartraits(){

  if (Array.isArray(currentchar.meta.traits)) {
    let traitarray=[];
    currentchar.meta.traits.forEach(trait => {
      const matchingTrait = Object.values(traits).find(t =>
        t.meta && t.meta.traitname && t.meta.traitname.toLowerCase().trim() === trait.toLowerCase().trim()
      );
      traitarray.push(matchingTrait);
    });
    return traitarray;
  } else if (currentchar.meta.traits) {
    const matchingTrait = Object.values(traits).find(t =>
      t.meta && t.meta.traitname && t.meta.traitname.toLowerCase().trim() === currentchar.meta.traits.toLowerCase().trim()
    );
    return [matchingTrait];
  }
}

function getskillbonusesfromtraits(){
  let mytraits = getchartraits();
  let traitswithskillbonuses=[];
  mytraits.forEach(trait=>{
    
    for(let i=0;i<trait.meta.traitbonusskill.length;i++){
      if(trait.meta.b78xl[i]=="Skill"){
        traitswithskillbonuses.push({
          traitname: trait.meta.traitname,
          skill: getname(trait.meta.traitbonusskill[i],'standard'),
          amt: trait.meta.traitbonusamt[i]
        });
      }
    }
  });

  return traitswithskillbonuses;
}

function getsubtypebonusesfromtraits() {
  const mytraits = getchartraits();
  const traitswithsubtypebonuses = [];

  mytraits.forEach(trait => {
      const bonusTypes    = trait.meta.b78xl;               // parallel array indicating “Skill” vs “Subtype”
      const subtypeKeys   = trait.meta.traitbonussubtype;   // array of subtype keys
      const bonusAmounts  = trait.meta.traitbonusamt;       // array of bonus amounts

      if (Array.isArray(subtypeKeys) && Array.isArray(bonusTypes) && Array.isArray(bonusAmounts)) {
          for (let i = 0; i < subtypeKeys.length; i++) {
              if (bonusTypes[i] === "Subtype") {
                  traitswithsubtypebonuses.push({
                      traitname: trait.meta.traitname,
                      subtype:   getname(subtypeKeys[i], 'standard'),
                      amt:       Number(bonusAmounts[i])
                  });
              }
          }
      }
  });

  return traitswithsubtypebonuses;
}

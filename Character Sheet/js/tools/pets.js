function getpetlist() {
    const petnames = currentchar.meta['8mco3'] || [];
    const petarray = [];

    petnames.forEach(name => {
        const pet = Object.values(namedcreatures).find(creature => creature.name === name);
        if (!pet) return;

        petarray.push({
            name: pet.meta.namedcreaturesname,
            species: pet.meta.namedcreaturesspecies,
            size: Number(pet.meta.namedcreaturessize),
            heavywoundcap: Number(pet.meta.namedcreaturesheavywoundcap),
            resistance: Number(pet.meta.namedcreaturesresistance),
            beastialintel: Number(pet.meta.namedcreaturesbeastintel),
            humanintel: Number(pet.meta.namedcreatureshumanintel),
            humansocial: Number(pet.meta.namedcreatureshumansocial),
            groundspeed: Number(pet.meta.namedcreaturesground),
            waterspeed: Number(pet.meta.water),
            airspeed: Number(pet.meta.air),
            dead: pet.meta.ilxl3 === 'Yes'
        });
    });

    return petarray;
}

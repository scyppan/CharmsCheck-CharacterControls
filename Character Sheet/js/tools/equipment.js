function getwandeffects(){
    
    let wand = matchwand(currentchar.meta['bru22']);
    let wood = matchwandwood(wand.meta.wandwood);
    let core = matchwandcore(wand.meta.wandcore);
    let quality = matchwandquality(wand.meta.wandquality);

    return [
        ...getwoodbonusprofile(wood),
        ...getcorebonusprofile(core),
        ...getqualityadjustment(quality)
    ];
}

//to get accessory effects, just call 
// getallaccessorybonusprofile();
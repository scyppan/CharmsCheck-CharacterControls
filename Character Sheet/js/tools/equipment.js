function getaccessoryattributes(accessory){
    //find the accessory
    //remember it can have multiple lines
}

function getwandeffects(){
    
    let wand = matchwand(currentchar.meta['bru22']);
    let wood = matchwandwood(wand.meta.wandwood);
    let core = matchwandcore(wand.meta.wandcore);
    let quality = matchwandquality(wand.meta.wandquality);

    console.log(
        "wand", wand,
        "wood", wood,
        "core", core,
        "quality", quality
    )

    console.log(getwoodbonusprofile(wood));
    console.log(getcorebonusprofile(core));
    console.log(getqualityadjustment(quality));

    
//get a list of all effects
//assign each a type

}

function rolltext(rollobj){

    const charname=currentchar.meta['5syv4'];
    const critresult=checkcritfail(rollobj.dice);

    switch(rollobj.type.toLowerCase()){
        case "power":
        case "panache":
        case "erudition":
        case "naturalism":
            if(critresult=='success'){
                rollobj.text= `${charname} CRITICALLY SUCCEEDS a straight ${rollobj.type} roll with a total roll value of ${rollobj.total}.`
            }else if(critresult=='fail'){
                rollobj.text= `${charname} CRITICALL FAILS a straight ${rollobj.type} roll.`
            }else{
                rollobj.text= `${charname} rolls a straight ${rollobj.type} roll with a total roll value of ${rollobj.total}.`
            }
        break;
        
        case "charms":
        case "darkarts":
        case "defense":
        case "transfiguration":
            if(critresult=='success'){
                rollobj.text= `${charname} attempts to cast a straight ${getname(rollobj.type,'display')} spell and CRITICALLY SUCCEEDS with a total roll value of ${rollobj.total}.`
            }else if(critresult=='fail'){
                rollobj.text= `${charname} attempts to cast a straight ${getname(rollobj.type,'display')} spell and CRITICALLY FAILS.`
            }else{
                rollobj.text= `${charname} attempts to cast a straight ${getname(rollobj.type,'display')} spell with a total roll value of ${rollobj.total}.`
            }

    }
    return rollobj;
}

function addtorollhistory(rollobj) {
    rollhistory.push({
        ...rollobj,
        timestamp: Date.now()
    });
}
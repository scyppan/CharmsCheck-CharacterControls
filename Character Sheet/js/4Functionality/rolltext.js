function rolltext(rollobj){

    const charname=currentchar.meta['5syv4'];
    const critresult=checkcritfail(rollobj.dice);

    console.log(rollobj, critresult);

    switch(rollobj.type){
        case "Power":
        case "Panache":
        case "Erudition":
        case "Naturalism":
            if(critresult=='success'){
                rollobj.text= `${charname} CRITICALLY SUCCEEDS a straight ${rollobj.type} roll with a total roll value of ${rollobj.total}.`
            }else if(critresult=='fail'){
                rollobj.text= `${charname} CRITICALL FAILS a straight ${rollobj.type} roll.`
            }else{
                rollobj.text= `${charname} rolls a straight ${rollobj.type} roll with a total roll value of ${rollobj.total}.`
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
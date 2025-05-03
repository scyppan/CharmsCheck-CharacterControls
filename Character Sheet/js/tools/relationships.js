function getcompleterelationshiplist(){
    let length = currentchar.meta.fwqtg.length;
    let relationships=[];

    for(let i=0;i<length;i++){
        relationships.push({
            person: currentchar.meta.fwqtg[i],
            type: currentchar.meta.relationshiptype[i],
            note: currentchar.meta.m4ao0[i],
        });
    }

    return relationships;
    
}


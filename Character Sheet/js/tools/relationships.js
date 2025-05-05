function getcompleterelationshiplist() {
    let relationships = [];
    if (currentchar.meta.fwqtg) {
        let length = currentchar.meta.fwqtg.length;
        

        for (let i = 0; i < length; i++) {
            relationships.push({
                person: currentchar.meta.fwqtg[i],
                type: currentchar.meta.relationshiptype[i],
                note: currentchar.meta.m4ao0[i],
            });
        }
    }
    return relationships;
}
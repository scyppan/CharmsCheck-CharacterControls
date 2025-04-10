function getsources() {

    

    let sources = [];

    //initial ability buy
    sources.push(
        { attribute: currentchar.meta["d2nab"], source: "Initial Ability Buy 1", amt: 1 },
        { attribute: currentchar.meta["4rgqv"], source: "Initial Ability Buy 2", amt: 1 }
    );

    //initial skill buy
    sources.push(
        { attribute: currentchar.meta["tu70t"], source: "Initial Skill Buy 1", amt: 1 },
        { attribute: currentchar.meta["295yh"], source: "Initial Skill Buy 2", amt: 1 },
        { attribute: currentchar.meta["yy3sy"], source: "Initial Skill Buy 3", amt: 1 }
    );

    //annual Skill buy
    sources.push(
        { attribute: currentchar.meta["zfyou"], source: "Annual Skill Buy 1", amt: 1 },
        { attribute: currentchar.meta["b466d"], source: "Annual Skill Buy 2", amt: 1 },
        { attribute: currentchar.meta["7xk5s"], source: "Annual Skill Buy 3", amt: 1 },
        { attribute: currentchar.meta["4p7kz"], source: "Annual Skill Buy 4", amt: 1 },
        { attribute: currentchar.meta["od098"], source: "Annual Skill Buy 5", amt: 1 },
        { attribute: currentchar.meta["g00g3"], source: "Annual Skill Buy 6", amt: 1 },
        { attribute: currentchar.meta["p0o5p"], source: "Annual Skill Buy 7", amt: 1 }
    );

    //annual skill buy
    sources.push(
        { attribute: currentchar.meta["fe1et"], source: "Annual Skill Buy 1", amt: 1 },
        { attribute: currentchar.meta["olvkl"], source: "Annual Skill Buy 1", amt: 1 },
        { attribute: currentchar.meta["pxh6z"], source: "Annual Skill Buy 2", amt: 1 },
        { attribute: currentchar.meta["o4rd8"], source: "Annual Skill Buy 2", amt: 1 },
        { attribute: currentchar.meta["mp181"], source: "Annual Skill Buy 3", amt: 1 },
        { attribute: currentchar.meta["y6x1n"], source: "Annual Skill Buy 3", amt: 1 },
        { attribute: currentchar.meta["lbg6a"], source: "Annual Skill Buy 4", amt: 1 },
        { attribute: currentchar.meta["by0y"], source: "Annual Skill Buy 4", amt: 1 },
        { attribute: currentchar.meta["ws3kt"], source: "Annual Skill Buy 5", amt: 1 },
        { attribute: currentchar.meta["38wnu"], source: "Annual Skill Buy 5", amt: 1 },
        { attribute: currentchar.meta["fxzo"], source: "Annual Skill Buy 6", amt: 1 },
        { attribute: currentchar.meta["kfo7o"], source: "Annual Skill Buy 6", amt: 1 },
        { attribute: currentchar.meta["dbc3s"], source: "Annual Skill Buy 7", amt: 1 },
        { attribute: currentchar.meta["f3ef7"], source: "Annual Skill Buy 7", amt: 1 }
    );

    //trait contributions
    currentchar.meta.traits.forEach(entry=>{
        sources.push(gettraitattribute(entry));
    })

    //core classes
    currentchar.meta["8f03b"].split(', ').forEach(cls=>{
        sources.push({attribute: cls, source: `Year 1 Core Class at ${currentchar.meta.school}` , amt: 1});
    });

    currentchar.meta["njcra"].split(', ').forEach(cls=>{
        sources.push({attribute: cls, source: `Year 2 Core Class at ${currentchar.meta.school}` , amt: 1});
    });

    currentchar.meta["mrbb3"].split(', ').forEach(cls=>{
        sources.push({attribute: cls, source: `Year 3 Core Class at ${currentchar.meta.school}` , amt: 1});
    });

    currentchar.meta["vd8s6"].split(', ').forEach(cls=>{
        sources.push({attribute: cls, source: `Year 4 Core Class at ${currentchar.meta.school}` , amt: 1});
    });

    currentchar.meta["sv4hr"].split(', ').forEach(cls=>{
        sources.push({attribute: cls, source: `Year 5 Core Class at ${currentchar.meta.school}` , amt: 1});
    });

    currentchar.meta["dz83x"].split(', ').forEach(cls=>{
        sources.push({attribute: cls, source: `Year 6 Core Class at ${currentchar.meta.school}` , amt: 1});
    });

    currentchar.meta["n8pqz"].split(', ').forEach(cls=>{
        sources.push({attribute: cls, source: `Year 7 Core Class at ${currentchar.meta.school}` , amt: 1});
    });

    //electives
    currentchar.meta.electives1.forEach(elective=>{
        sources.push({attribute: elective, source: `Year 1 Core Class at ${currentchar.meta.school}`, amt: 1})
    });

    currentchar.meta.electives2.forEach(elective=>{
        sources.push({attribute: elective, source: `Year 2 Core Class at ${currentchar.meta.school}`, amt: 1})
    });

    currentchar.meta.electives3.forEach(elective=>{
        sources.push({attribute: elective, source: `Year 3 Core Class at ${currentchar.meta.school}`, amt: 1})
    });

    currentchar.meta.electives4.forEach(elective=>{
        sources.push({attribute: elective, source: `Year 4 Core Class at ${currentchar.meta.school}`, amt: 1})
    });

    currentchar.meta.electives5.forEach(elective=>{
        sources.push({attribute: elective, source: `Year 5 Core Class at ${currentchar.meta.school}`, amt: 1})
    });

    currentchar.meta.electives6.forEach(elective=>{
        sources.push({attribute: elective, source: `Year 6 Core Class at ${currentchar.meta.school}`, amt: 1})
    });

    currentchar.meta.electives7.forEach(elective=>{
        sources.push({attribute: elective, source: `Year 7 Core Class at ${currentchar.meta.school}`, amt: 1})
    });

    currentchar.meta["ixbnr"].forEach(pt=>{
        sources.push({attribute: pt, source:"Eminience", amt: 1});
    })

    //equipment
    //characteristics
    //parental
}


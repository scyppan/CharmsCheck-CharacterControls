function getcompleteproficiencieslist() {
    const known = getknownproficiencies();           // meta-based list
    const booked = getallproficienciesfrombooks();   // book-derived list

    const profMap = new Map();
    // 1) seed with all book proficiencies
    for (const p of booked) {
        profMap.set(p.proficiencyname, p);
    }
    // 2) overlay known proficiencies (always win)
    for (const p of known) {
        profMap.set(p.proficiencyname, p);
    }
    // 3) return merged
    return Array.from(profMap.values());
}

function getknownproficiencies() {
    const arr = [];
    const names = currentchar.meta.proficiencyname || [];
    for (let i = 0; i < names.length; i++) {
        arr.push({
            proficiencyname: names[i],
            skill: getname(currentchar.meta.s71z0[i], 'standard'),
            difficulty: Number(currentchar.meta.ipjf3[i]),
            prereqs: currentchar.meta.nt3s3[i],
            itemreqs: currentchar.meta.aiwl3[i],
            yields: currentchar.meta['53wtd'][i],
            description: currentchar.meta.e3usn[i],
            source: currentchar.meta.proficiencylearnedfrom[i] || ''
        });
    }
    return arr;
}

function getallproficienciesfrombooks() {
    const booklist = getallbooksforchar(); // [{ bookname, source }, …]
    const arr = [];

    booklist.forEach(({ bookname }) => {
        const bookRec = Object.values(books)
            .find(b => b.meta.bookname === bookname);
        if (!bookRec) {
            console.warn(`Book not found in cache: "${bookname}"`);
            return;
        }
        const profNames = bookRec.meta.bookproficiency || [];
        const raw = [];
        profNames.forEach(name => {
            const rec = Object.values(proficiencies)
                .find(p => p.meta.proficiencyname === name);
            if (rec) raw.push(rec);
            else console.warn(`Proficiency not found in cache: "${name}"`);
        });
        raw.forEach(rec => {
            arr.push({
                proficiencyname: rec.meta.proficiencyname,
                skill: getname(rec.meta.s71z0, 'standard'),
                difficulty: Number(rec.meta.ipjf3),
                prereqs: rec.meta.nt3s3,
                itemreqs: rec.meta.aiwl3,
                yields: rec.meta['53wtd'],
                description: rec.meta.e3usn,
                source: bookname
            });
        });
    });

    return arr;
}  
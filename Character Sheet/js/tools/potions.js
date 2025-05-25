function getcompletepotionslist() {
    const known = getknownpotions();         // meta-based list
    const booked = getallpotionsfrombooks(); // book-derived list

    const potionMap = new Map();
    // 1) seed with all book potions
    for (const p of booked) {
        potionMap.set(p.potionname, p);
    }
    // 2) overlay known potions (always win)
    for (const p of known) {
        potionMap.set(p.potionname, p);
    }
    // 3) return merged
    return Array.from(potionMap.values());
}

function getknownpotions() {
    const potionarray=[];
    const potionnamearray = currentchar.meta['89nyg'];
    
    for (let i = 0; i < potionnamearray.length; i++) {

        const record = Object.values(potions)
        .find(p => p.meta.potionname === potionnamearray[i]);

        if(record){
            potionarray.push({
                potionname: record.meta.potionname,
                skill: record.meta.potionskill,
                difficulty: Number(record.meta.potionthreshold),
                ingredients: record.meta.potioningredient,
                effects: record.meta.ag82a,
                description: record.meta.qs2u8,
                source: currentchar.meta.potionlearnedfrom[i] || ''
            });
        }
        
    }
    return potionarray;
}

function getallpotionsfrombooks() {
    const booklist = getallbooksforchar(); // [{ bookname, source }, …]
    const arr = [];

    booklist.forEach(({ bookname }) => {
        const bookRec = Object.values(books)
            .find(b => b.meta.bookname === bookname);
        if (!bookRec) {
            console.warn(`Book not found in cache: "${bookname}"`);
            return;
        }
        const potionNames = bookRec.meta.bookpotion || [];
        const raw = [];
        potionNames.forEach(name => {
            const rec = Object.values(potions)
                .find(p => p.meta.potionname === name);
            if (rec) raw.push(rec);
            else console.warn(`Potion not found in cache: "${name}"`);
        });
        raw.forEach(rec => {
            arr.push({
                potionname: rec.meta.potionname,
                skill: rec.meta.potionskill,
                difficulty: Number(rec.meta.potionthreshold),
                ingredients: rec.meta.potioningredients,
                effects: rec.meta.potioneffects,
                description: rec.meta.potiondesc,
                source: bookname
            });
        });
    });

    return arr;
}

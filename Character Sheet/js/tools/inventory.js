function getcompleteinventorylist() {
    const known = getknownitems();         // meta-based
    const fromBooks = getallitemsfrombooks(); // book-derived
  
    const itemMap = new Map();
  
    // 1) Seed with all book items
    for (const it of fromBooks) {
      itemMap.set(it.itemname, it);
    }
  
    // 2) Overlay known items (known wins)
    for (const it of known) {
      itemMap.set(it.itemname, it);
    }
  
    return Array.from(itemMap.values());
  }
  
  function getknownitems() {
    const arr = [];
    const meta = currentchar.meta;
  
    const names = meta.itemname || [];
    const types = meta.itemtype || [];
    const slots = meta.itemslot || [];
    const sources = meta.itemsource || [];
  
    for (let i = 0; i < names.length; i++) {
      arr.push({
        itemname: names[i],
        itemtype: getname(types[i], 'standard'),
        itemslot: getname(slots[i], 'standard'),
        source: sources[i] || '',
        origin: 'char'
      });
    }
  
    return arr;
  }
  
  function getallitemsfrombooks() {
    const booklist = getallbooksforchar(); // [{ bookname, source }, …]
    const arr = [];
  
    booklist.forEach(({ bookname }) => {
      const bookRec = Object.values(books)
        .find(b => b.meta.bookname === bookname);
  
      if (!bookRec) {
        console.warn(`Book not found in cache: "${bookname}"`);
        return;
      }
  
      const itemNames = bookRec.meta.bookitems || [];
      const raw = [];
  
      itemNames.forEach(name => {
        const rec = Object.values(items)
          .find(i => i.meta.itemname === name);
  
        if (rec) {
          raw.push(rec);
        } else {
          console.warn(`Item not found in cache: "${name}"`);
        }
      });
  
      raw.forEach(rec => {
        arr.push({
          itemname: rec.meta.itemname,
          itemtype: getname(rec.meta.itemtype, 'standard'),
          itemslot: getname(rec.meta.itemslot, 'standard'),
          source: bookname,
          origin: 'book'
        });
      });
    });
  
    return arr;
  }
  
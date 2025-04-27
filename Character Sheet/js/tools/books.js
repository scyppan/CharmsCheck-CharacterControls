function getallbooksforchar(){
    return [...getallschoolbooksforchar(), ...getfreebooksforchar()];
}

function getallschoolbooksforchar(){
    const schoolentry = getschool();
    if (!schoolentry) return [];
  
    const allBooks = getallbooksforschoolinayear();
    const courses = getcurrcharcourses();
    const seen = new Set();
    const result = [];
  
    courses.forEach(entry => {
        const book = (allBooks[entry.year] || {})[entry.course];
        if(!book || seen.has(book)) return;
        seen.add(book);
        const display = getname(entry.course, 'display');
        result.push({
          bookname: book,
          source: `Year ${entry.year} ${display} course at ${schoolentry.name}`
        });
      });
  
    return result;
  }
  
function getallbooksforschoolinayear(){
    schoolentry = getschool();
    if (!schoolentry) return {};
    const fieldmap = {
      1:['yp0gq','y85wt'],
      2:['oolf1','d6zsb'],
      3:['b82le','v0rbs'],
      4:['e9lkn','ga04l'],
      5:['m7a1k','sc1om'],
      6:['60a7d','in1va'],
      7:['8pmfh','vk1h4']
    };
    return Object.entries(fieldmap).reduce((acc,[year,[kf,vf]])=>{
      const raw = getinitbooks(schoolentry.meta[kf], schoolentry.meta[vf]);
      const mapped = Object.entries(raw).reduce((m,[course,book])=>{
        m[getname(course,'standard')] = book;
        return m;
      }, {});
      acc[year] = mapped;
      return acc;
    }, {});
}
  
function getinitbooks(keys, values) {
    return keys.reduce((m, k, i) => (m[k] = values[i], m), {});
}

function getfreebooksforchar(){
    const schoolentry = getschool();
    if (!schoolentry) return [];
    const result = [];
    for (let y = 1; y <= 7; y++) {
      for (let s = 1; s <= 2; s++) {
        const key = `y${y}book${s}`;
        const book = currentchar.meta[key];
        if (book) {
          result.push({
            bookname: book,
            source: `Year ${y} free reading slot ${s} at ${schoolentry.name}`
          });
        }
      }
    }
    return result;
  }
  
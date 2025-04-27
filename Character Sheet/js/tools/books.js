function getallbooksforchar() {
    const schoolentry = getschool();
    if (!schoolentry) return [];

    const allBooks = getallbooksforschool();
    const courses = getcurrcharcourses();
    const seen = new Set();
    const result = [];

    courses.forEach(({ type, year, course }) => {
        const book = (allBooks[year] || {})[course];
        if (book && !seen.has(book)) {
            seen.add(book);
            const display = getname(course, 'display');
            result.push({
                bookname: book,
                source: `Year ${year} ${display} course at ${schoolentry.name}`
            });
        }
    });

    return result;
}


function getallbooksforschool() {
    schoolentry = getschool();
    if (!schoolentry) return {};
    const fieldmap = {
        1: ['yp0gq', 'y85wt'],
        2: ['oolf1', 'd6zsb'],
        3: ['b82le', 'v0rbs'],
        4: ['e9lkn', 'ga04l'],
        5: ['m7a1k', 'sc1om'],
        6: ['60a7d', 'in1va'],
        7: ['8pmfh', 'vk1h4']
    };
    return Object.entries(fieldmap).reduce((acc, [year, [kf, vf]]) => {
        const raw = getinitbooks(schoolentry.meta[kf], schoolentry.meta[vf]);
        const mapped = Object.entries(raw).reduce((m, [course, book]) => {
            m[getname(course, 'standard')] = book;
            return m;
        }, {});
        acc[year] = mapped;
        return acc;
    }, {});
}

function getschool() {
    const schoolname = currentchar.meta.school;
    // peruse the schools object and return the entry whose name matches
    return Object.values(schools).find(s => s.name === schoolname) || null;
}

function getinitbooks(keys, values) {
    return keys.reduce((m, k, i) => (m[k] = values[i], m), {});
}
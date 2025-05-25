function getcurrcharcourses(){
    let courses=[...getcorecoursesdetails(), ...getelectivesdetails()];
    return courses;
}

function getcorecoursesdetails(){
    const yearmap = {
      'Not yet started':0,'First year':1,'Second year':2,
      'Third year':3,'Fourth year':4,'Fifth year':5,
      'Sixth year':6,'Seventh year':7,'Graduated':7
    };
    const maxyear = yearmap[currentchar.meta.currentyear]||0;
    const keymap = {1:'8f03b',2:'njcra',3:'mrbb3',4:'vd8s6',5:'sv4hr',6:'dz83x',7:'n8pqz'};
    const result = [];
    for(let y=1;y<=maxyear;y++){
      (currentchar.meta[keymap[y]]||'')
        .split(',')
        .map(s=>s.trim())
        .filter(Boolean)
        .forEach(c=> result.push({
          type:'core',
          year:y,
          course:getname(c,'standard')
        }));
    }
    return result;
  }  

  function getcurrentyearnum(){
    const m={
      'Not yet started':0,'First year':1,'Second year':2,
      'Third year':3,'Fourth year':4,'Fifth year':5,
      'Sixth year':6,'Seventh year':7,'Graduated':7
    };
    return m[currentchar.meta.currentyear]||0;
  }
  
  function getrawelectives(year){
    const key = 'electives'+year;
    return Array.isArray(currentchar.meta[key]) ? currentchar.meta[key] : [];
  }
  
  function getmappedelectives(year){
    return getrawelectives(year).map(c=>getname(c,'standard'));
  }
  
  function getelectivesdetails(){
    const maxyear = getcurrentyearnum();
    const result = [];
    for(let y = 1; y <= maxyear; y++){
      const raw = getrawelectives(y);
      raw.forEach(c => result.push({
        type: 'elective',
        year: y,
        course: getname(c, 'standard')
      }));
    }
    return result;
  }

function getschool() {
    const schoolname = currentchar.meta.school;
    // peruse the schools object and return the entry whose name matches
    return Object.values(schools).find(s => s.name === schoolname) || null;
}

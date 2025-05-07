function loadchar(id){
    let char = fetchcharacter(id);
    currentchar=char;
    document.getElementById('charsheet-container').classList.remove('hidden');
    document.getElementById('searchbox').value=char.name;
    overviewtab();
    rollhistory=[];
    totallightwounds=0;
    window.parent.postMessage('charassigned','*');
}
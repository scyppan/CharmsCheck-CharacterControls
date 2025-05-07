function loadchar(id) {
    let char = fetchcharacter(id);
    currentchar = char;
    document.getElementById('charsheet-container').classList.remove('hidden');
    document.getElementById('searchbox').value = char.name;
    overviewtab();
    rollhistory = [];
    totallightwounds = 0;

    //tell the parent window that a character has been assigned
    var name = currentchar.meta['5syv4'];
    window.parent.postMessage(
        { type: 'charassigned', name: name },
        '*'
    );
}
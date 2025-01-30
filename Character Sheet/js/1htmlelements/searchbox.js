// Create Fuse instance once, referencing your "characters" array
function createfuse(){
    fuse = new Fuse(characters, {
        keys: ['name'],
        threshold: 0.3 // adjust for more or less fuzziness
      });
}
  
document.getElementById('searchbox').addEventListener('input', (e) => {
    const query = e.target.value.trim();
  
    // Destroy any existing suggestions
    const oldEl = document.getElementById('suggestions');
    if (oldEl) oldEl.remove();
  
    if (!query) return;
  
    getsuggestions(query, e);

  });
  

function getsuggestions(query, e){
    const results = Object.values(characters).filter(c =>
      c.name && c.name.toLowerCase().includes(query.toLowerCase())
    );

    showresults(results, e);
 }

 function createsuggestionbox(e){
    // Summon a fresh suggestions container
    const suggestions = document.createElement('div');
    suggestions.id = 'suggestions';
    document.getElementById('suggestionscontainer').appendChild(suggestions);    

    // Position it directly beneath the searchbox
    const rect = e.target.getBoundingClientRect();
    suggestions.style.top = `${rect.bottom + window.scrollY}px`;
    suggestions.style.left = `${rect.left + window.scrollX}px`;
    
    // Affix it to the page
    document.body.appendChild(suggestions);
 }

 function showresults(results, e){
    console.log(results);

    createsuggestionbox(e);
    let suggestionbox=document.getElementById('suggestions');

    let resultarray=[];

    for (let i = 0; i < results.length; i++) {
        const li = createresultlisting(results[i]);
        resultarray.push(li);
        suggestionbox.append(li);
      }
      
 } 

 function createresultlisting(result){
    let li=document.createElement('li');
    li.id=result.name;
    li.classList.add("suggestion");
    li.innerHTML=result.name;
    createclickeventhandler(li);
    return li;
 }

 function createclickeventhandler(li) {
    li.addEventListener('click', () => {
      alert(`Behold, you selected: ${li.textContent}!`);
      // Perform additional logic if necessary
    });
  }
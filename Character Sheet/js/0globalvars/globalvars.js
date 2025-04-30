const cache_ttl = 24 * 3600 * 1000; // 1 day in ms
const cache_meta = [];

//api data
let characters=[];
let traits;
let accessories;

let wands;
let wandwoods;
let wandcores;
let wandqualities;
let wandmakers;

let spells;
let books;
let schools;

let fuse=null; //for fuzzy searching

let searchbox=document.getElementById('searchbox');
let main=document.getElementById('main');
let chardisplay=document.getElementById('chardisplay');
let currentchar;
let castatage=8;
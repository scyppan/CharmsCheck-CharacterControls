const cache_ttl = 24 * 3600 * 1000; // 1 day in ms
const cache_meta = [];
const SKILL_ORDER = ['charms','defense','darkarts','transfiguration',
                    'creatures', 'herbology', 'history', 'arithmancy', 
                    'potions', 'alchemy', 'artificing', 'runes',
                    'muggles', 'astronomy', 'divination'
                ];

//datasets
let characters=[];
let traits;
let accessories;

let wands;
let wandwoods;
let wandcores;
let wandqualities;
let wandmakers;

let spells;
let proficiencies;
let potions;

let namedcreatures;
let items;

let books;
let schools;

let fuse=null; //for fuzzy searching

let searchbox=document.getElementById('searchbox');
let main=document.getElementById('main');
let chardisplay=document.getElementById('chardisplay');
let currentchar;
let castatage=8;
const cache_ttl = 24 * 3600 * 1000; // 1 day in ms
const cache_meta = [];
const SKILL_ORDER = ['charms','defense','darkarts','transfiguration',
                    'creatures', 'herbology', 'history', 'arithmancy', 
                    'potions', 'alchemy', 'artificing', 'runes',
                    'muggles', 'astronomy', 'divination', 'itemsinhand'
                ];

//datasets
let characters=[];
let traits;

let wands;
let wandwoods;
let wandcores;
let wandqualities;
let wandmakers;
let accessories;
let itemsinhand;

let items;

let spells;
let proficiencies;
let potions;

let namedcreatures;

let books;
let schools;

let generalitems;
let creatures;
let creatureparts;
let plants;
let plantparts;
let preparations;
let fooddrink;

let fuse=null; //for fuzzy searching

let searchbox=document.getElementById('searchbox');
let main=document.getElementById('main');
let chardisplay=document.getElementById('chardisplay');
let currentchar;
let castatage=8;

let rollhistory=[];
let woundhistory=[];
let totallightwounds=0;

let forceloadfromnetwork=[];


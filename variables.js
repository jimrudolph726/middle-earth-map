import {
  forests,
  mountain_ranges,
  mountains,
  rivers,
  hills,
  lakes_seas,
  wetlands,
} from './geographic_data.js';

import {
  elves,
  men,
  hobbits,
  battles,
  one_on_one,
  swords,
  rings,
  books,
} from './settlement_item_data.js';

import {
  createSettlementPopup,
  createIcon,
 } from './functions.js';

 import {
  samfrodocampsites,
  aragorncampsites,
  pippincampsites,
  merrycampsites,
  gandalfthegreycampsites,
 } from './campsite_data.js';

// Icon URLs
const iconUrls = {
  hobbits: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/hobbits.png',
  men_gondor: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/tree_of_gondor.png',
  men_rohan: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/men_rohan.png',
  rivendell: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/rivendell.png',
  lothlorien: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/galadriel.png',
  tent: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/tent.png',
  battle: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/battles.png',
  glamdring: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/glamdring.png',
  sting: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/sting.png',
  narsil: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/narsil.png',
  ring: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/ring.png',
  narya: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/narya.png',
  nenya: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/nenya.png',
  vilya: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/vilya.png',
  barahir: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/barahir.png',
  book: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/book.png',
};

// Campsites and Settlements
export const settlementsData = [
  ...['samfrodocampsites', 'aragorncampsites', 'pippincampsites', 'merrycampsites', 'gandalfthegreycampsites'].map(name => ({
    data: eval(`${name}`),
    checkboxId: `${name}Checkbox`,
    campsite: 'campsite'
  })),

  ...['elves', 'men', 'hobbits', 'battles', 'one_on_one', 'swords', 'rings', 'books'].map(name => ({
    data: eval(name),
    checkboxId: `${name}Checkbox`,
    campsite: 'no'
  }))
];

// Paths
export const pathdata = { 
  samfrodopath: { 
    pathName: 'samfrodopath', color: 'red', name: 'Sam and Frodo', PopupContent: createSettlementPopup('Sam and Frodo', '1766 miles', 'https://tolkiengateway.net/wiki/Quest_of_the_Ring'), tolerance: 10, weight: 5
  }, 
  aragornpath: { 
    pathName: 'aragornpath', color: 'blue', name: 'Aragorn, Gimli and Legolas', PopupContent: createSettlementPopup('Aragorn, Gimli, and Legolas', '1575 miles', 'https://tolkiengateway.net/wiki/Quest_of_the_Ring'), tolerance: 10, weight: 5 
  },
  pippinpath: { 
    pathName: 'pippinpath', color: 'green', name: 'Pippin', PopupContent: createSettlementPopup('Pippin', '855 miles', 'https://tolkiengateway.net/wiki/Quest_of_the_Ring'), tolerance: 10, weight: 5 
  },
  merrypath: { 
    pathName: 'merrypath', color: 'orange', name: 'Merry', PopupContent: createSettlementPopup('Merry', '907 miles', 'https://tolkiengateway.net/wiki/Quest_of_the_Ring'), tolerance: 10, weight: 5 
  },
  gandalfthegrey_merged: { 
    pathName: 'gandalfthegrey_merged', color: 'grey', name: 'Gandalf the Grey', PopupContent: createSettlementPopup('Gandalf the Grey', 'many thounsands of miles', 'https://tolkiengateway.net/wiki/Quest_of_the_Ring'), tolerance: 10, weight: 5 
  },
}

// Geographic Features
export const geographicData = [
  ...['mountain_ranges', 'mountains', 'hills', 'forests', 'rivers', 'lakes_seas', 'wetlands'].map(name => ({
    data: eval(name),
    checkboxId: `${name}Checkbox`
  }))
]

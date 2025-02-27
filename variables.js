//variables.js

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
 } from './functions.js';

 import {
  samfrodocampsites,
  aragorncampsites,
  pippincampsites,
  merrycampsites,
  gandalfthegreycampsites,
 } from './campsite_data.js';

// Map
export const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/middle-earth.png';
export const map = L.map('map', {
crs: L.CRS.EPSG3857,
minZoom: 15,
maxZoom: 20,
zoom: 15.5, // Fractional zoom level
center: [0, 0],
zoomSnap: 1, // Allows fractional zoom levels
zoomDelta: 5, // Controls the increment of zoom changes
preferCanvas: true
});
export const imageBounds = [[44.95133395351252, -93.31776393673807],[44.93460911676505, -93.29255872642499],];
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

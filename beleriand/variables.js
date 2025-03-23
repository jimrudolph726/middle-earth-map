//variables.js

import {
  forests,
  mountain_ranges,
  mountains,
  rivers,
  lakes_seas,
} from './geographic_data.js';

import {
  elves,
  men,
  dwarves,
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
export const imageUrl = 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/beleriand/assets/beleriand.png';
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
export const imageBounds = [[44.94393060,-93.30248833],[44.937485956,-93.290119813],];

// Campsites and Settlements
export const settlementsData = [
  ...['samfrodocampsites', 'aragorncampsites', 'pippincampsites', 'merrycampsites', 'gandalfthegreycampsites'].map(name => ({
    data: eval(`${name}`),
    checkboxId: `${name}Checkbox`,
    campsite: 'campsite'
  })),

  ...['elves', 'men', 'dwarves', 'battles', 'one_on_one', 'swords', 'rings', 'books'].map(name => ({
    data: eval(name),
    checkboxId: `${name}Checkbox`,
    campsite: 'no'
  }))
];

// Paths
export const pathdata = { 
  beren_path: { 
    pathName: 'beren_path', color: 'red', name: 'Beren', PopupContent: createSettlementPopup('Beren', ' ', 'https://tolkiengateway.net/wiki/Beren'), tolerance: 10, weight: 5
  }, 
}

// Geographic Features
export const geographicData = [
  ...['mountain_ranges', 'mountains', 'forests', 'rivers', 'lakes_seas'].map(name => ({
    data: eval(name),
    checkboxId: `${name}Checkbox`
  }))
]

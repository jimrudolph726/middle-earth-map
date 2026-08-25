//variables.js

import {
  forests,
  mountain_ranges,
  mountains,
  rivers,
  lakes_seas,
  hills
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
  berencampsites,
 } from './campsite_data.js';

// Map
export const imageUrl = new URL('./assets/minas_tirith.png', import.meta.url).href;
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
export const imageBounds = [[44.94657673,-93.29701144],[44.94141457,-93.29130864],];

// Campsites and Settlements
const campsiteGroups = {
  berencampsites,
};

const settlementGroups = {
  elves,
  men,
  dwarves,
  battles,
  one_on_one,
  swords,
  rings,
  books,
};

export const settlementsData = [
  ...Object.entries(campsiteGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`,
    campsite: 'campsite'
  })),

  ...Object.entries(settlementGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`,
    campsite: 'no'
  }))
];

// Paths
export const pathdata = { 
  beren_path: { 
    pathName: 'beren_path', color: '#71352e', name: 'Beren', PopupContent: createSettlementPopup('Beren', ' ', 'https://tolkiengateway.net/wiki/Beren'), tolerance: 10, weight: 5
  }, 
}

// Geographic Features
const geographicGroups = {
  mountain_ranges,
  mountains,
  forests,
  rivers,
  lakes_seas,
  hills,
};

export const geographicData = [
  ...Object.entries(geographicGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`
  }))
]

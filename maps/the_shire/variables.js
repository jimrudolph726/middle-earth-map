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
 } from '../shared/functions.js';

 import {
  berencampsites,
 } from './campsite_data.js';

// Map definition
export const imageUrl = new URL('./assets/the_shire.jpg', import.meta.url).href;
export const imageBounds = [[44.942894017,-93.288129001],[44.938806559,-93.278576287],];

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

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
export const imageUrl = new URL('./assets/beleriand.png', import.meta.url).href;
export const imageBounds = [[44.94393060,-93.30248833],[44.937485956,-93.290119813],];

export const markerClusterOptions = {
  checkboxIds: ['menCheckbox', 'elvesCheckbox', 'dwarvesCheckbox'],
  maxClusterRadius: 44,
};

const beleriandRoutePalette = Object.freeze({
  journey: '#825b68',
  forests: '#4f675f',
  mountain_ranges: '#8a8479',
  mountains: '#625f66',
  rivers: '#537b91',
  lakes_seas: '#496f85',
  hills: '#756877',
});

const applyRouteColor = (group, color) => Object.fromEntries(
  Object.entries(group).map(([key, item]) => [key, { ...item, color }])
);

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
    pathName: 'beren_path', color: beleriandRoutePalette.journey, name: 'Beren', PopupContent: createSettlementPopup('Beren', ' ', 'https://tolkiengateway.net/wiki/Beren'), tolerance: 10, weight: 5
  }, 
}

// Geographic Features
const geographicGroups = {
  mountain_ranges: applyRouteColor(mountain_ranges, beleriandRoutePalette.mountain_ranges),
  mountains: applyRouteColor(mountains, beleriandRoutePalette.mountains),
  forests: applyRouteColor(forests, beleriandRoutePalette.forests),
  rivers: applyRouteColor(rivers, beleriandRoutePalette.rivers),
  lakes_seas: applyRouteColor(lakes_seas, beleriandRoutePalette.lakes_seas),
  hills: applyRouteColor(hills, beleriandRoutePalette.hills),
};

export const geographicData = [
  ...Object.entries(geographicGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`
  }))
]

//variables.js

import {
  forests,
  mountain_ranges,
  mountains,
  rivers,
  hills,
  lakes_seas,
  wetlands,
  large_regions,
  sub_regions,
} from './geographic_data.js';

import {
  elves,
  dwarves,
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
  gandalfthewhitecampsites,
 } from './campsite_data.js';

// Map
export const imageUrl = new URL('./assets/middle-earth.png', import.meta.url).href;
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
const campsiteGroups = {
  samfrodocampsites,
  aragorncampsites,
  pippincampsites,
  merrycampsites,
  gandalfthegreycampsites,
  gandalfthewhitecampsites,
};

const settlementGroups = {
  elves,
  dwarves,
  men,
  hobbits,
};

const itemGroups = {
  swords,
  rings,
  books,
};

const battleGroups = {
  battles,
  one_on_one,
};

const miscMarkerGroups = {
};

export const settlementsData = [
  ...Object.entries(campsiteGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`,
    campsite: 'campsite',
    clusterScope: 'sharedCampsiteCluster',
  })),

  ...Object.entries(settlementGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`,
    campsite: 'no',
    clusterScope: 'sharedSettlementCluster',
  })),

  ...Object.entries(itemGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`,
    campsite: 'no',
    clusterScope: 'sharedItemCluster',
  })),

  ...Object.entries(battleGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`,
    campsite: 'no',
    clusterScope: 'sharedBattleCluster',
  })),

  ...Object.entries(miscMarkerGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`,
    campsite: 'no',
    clusterScope: 'categoryCluster',
  })),
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
  gandalfthegreypath: { 
    pathName: 'gandalfthegreypath', color: 'grey', name: 'Gandalf the Grey', PopupContent: createSettlementPopup('Gandalf the Grey', 'many thounsands of miles', 'https://tolkiengateway.net/wiki/Quest_of_the_Ring'), tolerance: 10, weight: 5, arrows: true 
  },
  gandalfthewhitepath: { 
    pathName: 'gandalfthewhitepath', color: 'aquamarine', name: 'Gandalf the White', PopupContent: createSettlementPopup('Gandalf the White', 'many thounsands of miles', 'https://tolkiengateway.net/wiki/Quest_of_the_Ring'), tolerance: 10, weight: 5, arrows: false 
  },
}

// Geographic Features
const geographicGroups = {
  mountain_ranges,
  mountains,
  hills,
  forests,
  rivers,
  lakes_seas,
  wetlands,
  large_regions,
  sub_regions,
};

export const geographicData = [
  ...Object.entries(geographicGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`
  }))
]

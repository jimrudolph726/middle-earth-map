//variables.js

import {
  forests,
  mountain_ranges,
  mountains,
  rivers,
  hills,
  lakes_seas,
  islands,
  wetlands,
  large_regions,
  sub_regions,
  bays_and_gulfs,
} from './geographic_data.js';

import {
  elves,
  dwarves,
  men,
  hobbits,
  enemies,
  battles,
  one_on_one,
  swords,
  rings,
  books,
  palantíri,
  food,
  drink,
  spiders,
  ents,
  beornings,
} from './settlement_item_data.js';

import {
  createSettlementPopup,
 } from './functions.js';

 import {
  samfrodocampsites,
  pippincampsites,
  merrycampsites,
  aragorncampsites,
  boromircampsites,
  gandalfthegreycampsites,
  gandalfthewhitecampsites,
 } from './campsite_data.js';

// Map
export const map = L.map('map', {
crs: L.CRS.EPSG3857,
minZoom: 15,
maxZoom: 20,
zoom: 14, // Fractional zoom level
center: [0, 0],
zoomSnap: 1, // Allows fractional zoom levels
zoomDelta: 4, // Controls the increment of zoom changes
preferCanvas: true
});
export const imageBounds = [[44.95133395351252, -93.31776393673807],[44.93460911676505, -93.29255872642499],];
export const baseTileUrl = './tiles/base/{z}/{x}/{y}.webp';
export const baseTileOptions = {
  bounds: imageBounds,
  minZoom: 15,
  maxZoom: 20,
  maxNativeZoom: 19,
  noWrap: true,
  updateWhenZooming: false,
  keepBuffer: 2,
};

export const physicalFrame = {
  theme: 'middle-earth',
  motif: 'leaf-road',
  ornamentMaxZoom: 16,
  frameTextureUrl: new URL('./assets/materials/middle-earth-frame-brass-v1.webp', import.meta.url).href,
  frameTextureSize: 210,
  mat: {
    theme: 'forest-green-leather',
    paneZIndex: 190,
    width: 52,
    minWidth: 28,
    responsiveScale: 0.045,
    textureUrl: new URL('./assets/materials/middle-earth-green-leather-v1.webp', import.meta.url).href,
    textureSize: 280,
    baseColor: '#314128',
    tintColor: '#131e12',
    tintOpacity: 0.24,
    edgeColor: '#b38a46',
    edgeWeight: 2,
    shadowColor: '#100704',
    shadowWeight: 16,
    shadowOpacity: 0.66,
  },
};

// Campsites, Settlements, Items, Provisions, Creatures & Beings
const sharedAtlasMarkerCluster = 'sharedAtlasMarkerCluster';

const campsiteGroups = {
  samfrodocampsites,
  pippincampsites,
  merrycampsites,
  aragorncampsites,
  boromircampsites,
  gandalfthegreycampsites,
  gandalfthewhitecampsites,
};

const settlementGroups = {
  elves,
  dwarves,
  men,
  hobbits,
  enemies,
};

const itemGroups = {
  swords,
  rings,
  books,
  palantíri,
};

const battleGroups = {
  battles,
  one_on_one,
};

const provisionGroups = {
  food,
  drink
};

const creatures_and_beingsGroups = {
  spiders,
  ents,
  beornings,
};

const miscMarkerGroups = {
};

export const settlementsData = [
  ...Object.entries(campsiteGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`,
    groupName: name,
    campsite: 'campsite',
    clusterScope: sharedAtlasMarkerCluster,
  })),

  ...Object.entries(settlementGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`,
    groupName: name,
    campsite: 'no',
    clusterScope: sharedAtlasMarkerCluster,
  })),

  ...Object.entries(itemGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`,
    groupName: name,
    campsite: 'no',
    clusterScope: sharedAtlasMarkerCluster,
  })),

  ...Object.entries(battleGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`,
    groupName: name,
    campsite: 'no',
    clusterScope: sharedAtlasMarkerCluster,
  })),

    ...Object.entries(provisionGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`,
    groupName: name,
    campsite: 'no',
    clusterScope: sharedAtlasMarkerCluster,
  })),

    ...Object.entries(creatures_and_beingsGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`,
    groupName: name,
    campsite: 'no',
    clusterScope: sharedAtlasMarkerCluster,
  })),

  ...Object.entries(miscMarkerGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`,
    groupName: name,
    campsite: 'no',
    clusterScope: 'categoryCluster',
  })),
];

// Paths and Roads
export const pathData = { 
  samfrodopath: { 
    pathName: 'samfrodopath', color: '#71352e', outlineColor: '#2f241b', outlineWeight: 10, name: 'Sam and Frodo', PopupContent: createSettlementPopup('Sam and Frodo', '1766 miles', 'https://tolkiengateway.net/wiki/Quest_of_the_Ring'), tolerance: 10, weight: 5
  }, 
  aragornpath: { 
    pathName: 'aragornpath', color: '#557887', outlineColor: '#2f241b', name: 'Aragorn, Gimli and Legolas', PopupContent: createSettlementPopup('Aragorn, Gimli, and Legolas', '1575 miles', 'https://tolkiengateway.net/wiki/Quest_of_the_Ring'), tolerance: 10, weight: 5
  },
  boromirpath: { 
    pathName: 'boromirpath', color: '#ad8138', outlineColor: '#2f241b', name: 'Boromir', PopupContent: createSettlementPopup('Boromir', '2400 miles', 'https://tolkiengateway.net/wiki/Quest_of_the_Ring'), tolerance: 10, weight: 5
  },
  pippinpath: { 
    pathName: 'pippinpath', color: '#49643f', outlineColor: '#2f241b', name: 'Pippin', PopupContent: createSettlementPopup('Pippin', '855 miles', 'https://tolkiengateway.net/wiki/Quest_of_the_Ring'), tolerance: 10, weight: 5
  },
  merrypath: { 
    pathName: 'merrypath', color: '#a35f32', outlineColor: '#2f241b', name: 'Merry', PopupContent: createSettlementPopup('Merry', '907 miles', 'https://tolkiengateway.net/wiki/Quest_of_the_Ring'), tolerance: 10, weight: 5
  },
  gandalfthegreypath: { 
    pathName: 'gandalfthegreypath', color: '#69635d', outlineColor: '#2f241b', name: 'Gandalf the Grey', PopupContent: createSettlementPopup('Gandalf the Grey', 'many thounsands of miles', 'https://tolkiengateway.net/wiki/Quest_of_the_Ring'), tolerance: 10, weight: 5, arrows: true
  },
  gandalfthewhitepath: { 
    pathName: 'gandalfthewhitepath', color: '#fcfbf9', outlineColor: '#2f241b', outlineWeight: 10, name: 'Gandalf the White', PopupContent: createSettlementPopup('Gandalf the White', 'many thounsands of miles', 'https://tolkiengateway.net/wiki/Quest_of_the_Ring'), tolerance: 10, weight: 6, arrows: true
  },
}

export const roadData = { 
  great_east_road: { 
    pathName: 'great_east_road', color: '#765331', outlineColor: '#35261b', outlineWeight: 8, name: 'Great East Road', PopupContent: createSettlementPopup('Great East Road', 'Major road through Eriador. The Great East Road ran between the Grey Havens and Rivendell. The Road was approximately 575 miles long. The Road was not paved and sometimes developed ruts and potholes during wet weather.', 'https://thainsbook.minastirith.cz/roads.html#Great-East-Road'), tolerance: 10, weight: 4, arrows: false
  },
  great_west_road: { 
    pathName: 'great_west_road', color: '#8b6138', outlineColor: '#35261b', outlineWeight: 8, name: 'Great West Road', PopupContent: createSettlementPopup('Great West Road', 'Road connecting Gondor and Rohan. The Great West Road was originally part of the Royal Road linking Gondor to the North-kingdom of Arnor. It ran between Minas Tirith and the Fords of Isen in the Gap of Rohan, where it joined the North-South Road to Arnor. The Great West Road was approximately 425 miles long.', 'https://thainsbook.minastirith.cz/roads.html#Great-West-Road'), tolerance: 10, weight: 4, arrows: false
  },
  old_forest_road: { 
    pathName: 'old_forest_road', color: '#536145', outlineColor: '#35261b', outlineWeight: 8, name: 'Old Forest Road', PopupContent: createSettlementPopup('Old Forest Road', 'Road through Mirkwood. The Old Forest Road began on the eastern side of the Misty Mountains. It came down from the High Pass, also called the Pass of Imladris. The Old Forest Road ran eastward and crossed the Anduin at the Old Ford. In the late Second Age there was a bridge over the Anduin at this point, but by the late Third Age it was gone.', 'https://thainsbook.minastirith.cz/roads.html#Old-Forest-Rd'), tolerance: 10, weight: 4, arrows: false
  },
  north_way: { 
    pathName: 'north_way', color: '#6c6252', outlineColor: '#35261b', outlineWeight: 8, name: 'North-way', PopupContent: createSettlementPopup('North-way', 'The North-way began at the Great Gate of Minas Tirith and ran northward across the Pelennor Fields. At the Rammas Echor, the North-way passed through Forannest, the North-gate. The North-way then joined the Great West Road which ran through Anorien and Rohan.', 'https://thainsbook.minastirith.cz/roads.html#Old-Forest-Rd'), tolerance: 10, weight: 4, arrows: false
  },
  harad_road: { 
    pathName: 'harad_road', color: '#87513b', outlineColor: '#35261b', outlineWeight: 8, name: 'Harad Road', PopupContent: createSettlementPopup('Harad Road', 'Road from Harad through Ithilien to the Black Gate of Mordor. The Harad Road began in the far south of Middle-earth. It passed over the River Harnen into South Gondor and then over the Crossing of Poros into Ithilien. The road ran alongside the Mountains of Shadow on the border of Mordor.', 'https://thainsbook.minastirith.cz/roads.html#Harad-Rd'), tolerance: 10, weight: 4, arrows: false
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
  islands,
  wetlands,
  large_regions,
  sub_regions,
  bays_and_gulfs
};

export const geographicData = [
  ...Object.entries(geographicGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`
  })),
]

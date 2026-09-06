//variables.js

import {
  forests,
  rivers,
  wetlands,
  hills,
  large_regions
} from './geographic_data.js';

import {
  towns_and_villages,
  homes_and_farms,
  inns_and_gathering_places
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

// A harvest almanac on the same desk as the other atlas volumes.
export const physicalFrame = {
  theme: 'shire',
  motif: 'barley-acorn',
  ornamentMaxZoom: 18,
  frameTextureUrl: new URL('../middle_earth/assets/materials/middle-earth-frame-brass-v1.webp', import.meta.url).href,
  frameTextureSize: 210,
  mat: {
    theme: 'wheat-linen',
    paneZIndex: 390,
    width: 52,
    minWidth: 28,
    responsiveScale: 0.045,
    textureUrl: new URL('../beleriand/assets/materials/beleriand-cloth-v1.webp', import.meta.url).href,
    textureSize: 300,
    baseColor: '#d6c291',
    tintColor: '#e6c96b',
    tintOpacity: 0.2,
    edgeColor: '#a47a49',
    edgeWeight: 2,
    shadowColor: '#21140e',
    shadowWeight: 16,
    shadowOpacity: 0.68,
  },
};

// Campsites and Settlements
const campsiteGroups = {
  berencampsites,
};

const settlementGroups = {
  towns_and_villages,
  homes_and_farms,
  inns_and_gathering_places
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
  forests,
  rivers,
  wetlands,
  hills,
  large_regions
};

export const geographicData = [
  ...Object.entries(geographicGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`
  }))
]

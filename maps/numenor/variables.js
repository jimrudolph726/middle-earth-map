// Map definition
import {
  cities,
  sacredPlaces,
} from './settlement_item_data.js';
// Map definition
import {
  mountains,
  rivers,
  large_regions,
  sub_regions
} from './geographic_data.js';

export const imageUrl = new URL('./assets/numenor.png', import.meta.url).href;
export const imageBounds = [[44.9509454,-93.3340925],[44.929893420,-93.295343975],];
export const mapOptions = {
  minZoom: 14,
  maxZoom: 20,
  zoomSnap: 1,
  zoomDelta: 4,
};
export const initialZoom = 14;

export const physicalFrame = {
  theme: 'numenor',
  motif: 'star-compass',
  ornamentMaxZoom: 15,
  frameTextureUrl: new URL('../middle_earth/assets/materials/middle-earth-frame-brass-v1.webp', import.meta.url).href,
  frameTextureSize: 210,
  mat: {
    theme: 'royal-indigo-leather',
    paneZIndex: 390,
    width: 52,
    minWidth: 28,
    responsiveScale: 0.045,
    textureUrl: new URL('../middle_earth/assets/materials/middle-earth-green-leather-v1.webp', import.meta.url).href,
    textureSize: 280,
    baseColor: '#173d5d',
    tintColor: '#071d30',
    tintOpacity: 0.58,
    edgeColor: '#c49a57',
    edgeWeight: 2,
    shadowColor: '#080704',
    shadowWeight: 16,
    shadowOpacity: 0.68,
  },
};

const settlementGroups = {
  cities,
  sacredPlaces,
};

export const settlementsData = [
  ...Object.entries(settlementGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`,
    campsite: 'no',
  })),
];

// Geographic Features
const geographicGroups = {
  mountains,
  rivers,
  large_regions,
  sub_regions
};

export const geographicData = [
  ...Object.entries(geographicGroups).map(([name, data]) => ({
    data,
    checkboxId: `${name}Checkbox`
  })),
]

export const pathdata = {};

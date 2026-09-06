import { createGeographicPopup } from "../shared/functions.js";

// Ready for Shire-specific features; no inherited geography from other volumes.
export const forests = {};
export const rivers = {};
export const wetlands = {};
export const hills = {};

export const large_regions = {
  eastfarthing: {
    pathName: 'eastfarthing',
    color: "brown", 
    name: "Eastfarthing",
    PopupContent: createGeographicPopup(
      "Eastfarthing",
      `None`,
      `Eastfarthing is an English name meaning “Eastern Quarter”, consisting of east (“eastern”) + farthing (“fourth part, quarter”). Tolkien used farthing in its older geographic sense of “one fourth”, referring to one of the four traditional divisions of the Shire.`,
      `The Eastfarthing was one of the four Farthings of the Shire. Its westernmost point was the Three-Farthing Stone, its eastern border was the Brandywine River, and its southern border was the River Shirebourn. `,
      "https://tolkiengateway.net/wiki/Eastfarthing"
    ),
    tolerance: 1,
    weight: 2
  },
  northfarthing: {
    pathName: 'northfarthing',
    color: "brown", 
    name: "Northfarthing",
    PopupContent: createGeographicPopup(
      "Northfarthing",
      `None`,
      `Northfarthing is an English name meaning “Northern Quarter”, consisting of north (“northern”) + farthing (“fourth part, quarter”), referring to one of the four traditional divisions of the Shire.`,
      `The Northfarthing is the only one of the four farthings that does not end in the Three-Farthing Stone; its southernmost point lay about eleven miles north of it and along its northern border were the high North Moors.`,
      "https://tolkiengateway.net/wiki/Northfarthing"
    ),
    tolerance: 1,
    weight: 2
  },
  southfarthing: {
    pathName: 'southfarthing',
    color: "brown", 
    name: "Southfarthing",
    PopupContent: createGeographicPopup(
      "Southfarthing",
      `None`,
      `Southfarthing is an English name meaning “Southern Quarter”, consisting of south (“southern”) + farthing (“fourth part, quarter”), referring to one of the four traditional divisions of the Shire.`,
      `The Southfarthing was the southmost and warmest farthing of the Shire.`,
      "https://tolkiengateway.net/wiki/Southfarthing"
    ),
    tolerance: 1,
    weight: 2
  },
  westfarthing: {
    pathName: 'westfarthing',
    color: "brown", 
    name: "Westfarthing",
    PopupContent: createGeographicPopup(
      "Westfarthing",
      `None`,
      `Westfarthing is an English name meaning “Western Quarter”, consisting of west (“western”) + farthing (“fourth part, quarter”), referring to one of the four traditional divisions of the Shire.`,
      `The Westfarthing was one of the four Farthings of the Shire. Its easternmost point was the Three-Farthing Stone and on its western border were the Far Downs (and later, from Fo.A. 31 on, the region of Westmarch).`,
      "https://tolkiengateway.net/wiki/Westfarthing"
    ),
    tolerance: 1,
    weight: 2
  },
}
export const sub_regions = {};

import { createGeographicPopup } from "../shared/functions.js";

// Ready for Shire-specific features; no inherited geography from other volumes.
export const forests = {
  the_old_forest: {
    pathName: "the_old_forest",
    color: "green",
    name: "The Old Forest",
    PopupContent: createGeographicPopup(
      "The Old Forest",
      "(speculative) Iaur Taur",
      `The name Iaur Taur means "old forest" or "ancient forest" from the word iaur meaning old or ancient, and taur meaning forest. This is purely speculative and noncanonical.`,
      "Forest on the east side of the Brandywine River bordering Buckland.",
      "https://thainsbook.minastirith.cz/forests.html#Old%20Forest"
    ),
    tolerance: 1,
    weight: 2,
  },
  woody_end: {
    pathName: "woody_end",
    color: "green",
    name: "Woody End",
    PopupContent: createGeographicPopup(
      "Woody End",
      "None",
      `Woody End means "place at one end of a wood", representing a possible Old Hobbitish Wudig Ende.`,
      "Woods in the Eastfarthing of the Shire. The Woody End was located at the eastern end of the Green Hill Country. The Stockbrook flowed northeast through the Woody End to the Brandywine River.",
      "https://thainsbook.minastirith.cz/forests.html#Woody%20End"
    ),
    tolerance: 1,
    weight: 2,
  },
  bindbole_wood: {
    pathName: "bindbole_wood",
    color: "green",
    name: "Bindbole Wood",
    PopupContent: createGeographicPopup(
      "Bindbole Wood",
      "None",
      `The name Bindbole Wood has been mistakenly interpreted as Bindbale Wood because of unclear type on some maps of the Shire. The word bole means "tree trunk."`,
      "Woods in the Northfarthing of the Shire, about 15 miles north of Hobbiton.",
      "https://thainsbook.minastirith.cz/forests.html#Bindbole%20Wood"
    ),
    tolerance: 1,
    weight: 2,
  },
};
export const rivers = {
  brandywine: {
    pathName: 'brandywine',
    color: "blue",  // Color is set to blue for every object
    name: "Brandywine",
    PopupContent: createGeographicPopup(
      "Brandywine",
      "Baranduin",
      `so called the Baranduin in Sindarin. The name Baranduin comes from the words baran meaning "golden brown" and duin meaning "river." The old Hobbit name for the river was Branda-nîn meaning "border water," but Hobbits also jokingly referred to the river as Bralda-hîm meaning "heady ale."`,
      `River in Eriador. The Brandywine originated in Lake Evendim in the north and flowed south-southwest to the Sea. The Brandywine was the eastern border of the Shire.`,
      "https://thainsbook.minastirith.cz/rivers.html#Brandywine"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  the_water: {
    pathName: 'the_water',
    color: "blue", 
    name: "The Water",
    PopupContent: createGeographicPopup(
      "The Water",
      "None",
      `None. The Water was a shortening of the river's full name, the Shire-water.`,
      `River in the Shire. The Water began north of Needlehole, possibly in the North Moors. Below Needlehole in Rushock Bog, the Water branched into two streams and then rejoined. `,
      "https://thainsbook.minastirith.cz/rivers.html#The%20Water"
    ),
    tolerance: 10,
    weight: 7
  },
  river_shirebourn: {
    pathName: 'river_shirebourn',
    color: "blue", 
    name: "River Shirebourn",
    PopupContent: createGeographicPopup(
      "River Shirebourn",
      "None",
      `None. A bourn is a small stream or brook. The element shire is apparently not from the Shire but instead from the Old English scir meaning "bright, clear." The river Sherbourne in England was sometimes spelled Shirebourn. Mithe is dervied from "mouth, river-mouth" in Old English.`,
      `River in the Shire. The Shirebourn began in the Green Hill Country. It flowed south and then curved east to join the Brandywine. The outflow of the Shirebourn into the Brandywine was called the Mithe.`,
      "https://thainsbook.minastirith.cz/rivers.html#Shirebourn"
    ),
    tolerance: 10,
    weight: 7
  },
  thistle_brook: {
    pathName: 'thistle_brook',
    color: "blue", 
    name: "Thistle Brook",
    PopupContent: createGeographicPopup(
      "Thistle Brook",
      "None",
      `None`,
      `Brook in the Shire. The Thistle Brook began in the Green Hill Country.`,
      "https://thainsbook.minastirith.cz/rivers.html#Thistle%20Brook"
    ),
    tolerance: 10,
    weight: 7
  },
};
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

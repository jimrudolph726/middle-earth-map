import { 
  createGeographicPopup 
} from "./functions.js";

export const forests = {
  nan_elmoth: {
    pathName: "nan_elmoth",
    color: "green", 
    name: "Nan Elmoth",
    PopupContent: createGeographicPopup(
      "Nan Elmoth",
      "Nan Elmoth",
      `The name Nan Elmoth is composed of the Sindarin words nan meaning "valley" and elmoth comprised of el meaning "star" and moth meaning "dusk."`,
      `Dark woods where Eol dwelled. Nan Elmoth was located in East Beleriand. The woods were bordered on the northwest by the Celon. `,
      "https://thainsbook.minastirith.cz/forests.html#Nan-Elmoth",
    ),
    tolerance: 1,
    weight: 2,
  },
};
export const mountain_ranges = {
  mountains_of_mithrim: {
    pathName: "mountains_of_mithrim",
    color: "orange",
    name: "Mountains of Mithrim",
    PopupContent: createGeographicPopup(
      "Mountains of Mithrim",
      "Mithrim",
      'The name Mithrim means "Grey-elves" in Sindarin from mith meaning "grey" and rim meaning "host, great number."',
      "The Mountains of Mithrim or the Hills of Mithrim were a range of mountains located in Hithlum. They formed the border between Mithrim and Dor-lómin,",
      "https://tolkiengateway.net/wiki/Mountains_of_Mithrim#:~:text=The%20Mountains%20of%20Mithrim%20or,the%20Noldor%20settled%20in%20Hithlum."
    ),
    tolerance: 1,
    weight: 2,
  },
};
export const mountains = {
  mount_dolmed: {
    pathName: "mount_dolmed",
    color: "brown",
    name: "Mount Dolmed",
    PopupContent: createGeographicPopup(
      "Mount Dolmed",
      "Dolmed",
      `Mountain in the Blue Mountains. Mount Dolmed was a tall mountain located near the midpoint of the range as it was during the First Age.`,
      `The name Dolmed means "Wet Head" in Sindarin from dol meaning "head" - often used for hills and mountains - and méd meaning "wet."`,
      "https://thainsbook.minastirith.cz/mountains.html#Mount-Dolmed"
    ),
    tolerance: 1,
    weight: 2,
  },
};
export const rivers = {
  greater_gelion: {
    pathName: 'greater_gelion',
    color: "blue",  // Color is set to blue for every object
    name: "Greater Gelion",
    PopupContent: createGeographicPopup(
      "Greater Gelion",
      "None",
      `In one source (HoME IV, p. 210), Tolkien equated the name Gelion with the Old English word glæden meaning "iris," but this is not a translation from Elvish.`,
      `The Greater Gelion was one of the two rivers that flowed together to form the source of long Gelion, that flowed along the eastern borders of Beleriand.`,
      "https://tolkiengateway.net/wiki/Greater_Gelion"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
};
export const lakes_seas = {
  lake_evendim: {
    pathName: 'lake_evendim',
    color: "blue", 
    name: "Lake Evendim",
    PopupContent: createGeographicPopup(
      "Lake Evendim",
      "Evendim",
      `Evendim means "evening twilight." The Sindarin name was Nenuial meaning "lake of twilight" from nen meaning "lake" and uial meaning "twilight."`,
      `Lake in Eriador. Lake Evendim was in the Hills of Evendim north of the Shire. The lake was the source of the Brandywine River.`,
      "https://thainsbook.minastirith.cz/lakes.html#Evendim"
    ),
    tolerance: 1,
    weight: 2
  },
  nen_hithoel: {
    pathName: 'nen_hithoel',
    color: "blue", 
    name: "Nen Hithoel",
    PopupContent: createGeographicPopup(
      "Nen Hithoel",
      "Nen Hithoel",
      `Nen Hithoel means "mist-cool water" in Sindarin. The word nen means "water" and hîth means "mist." The final element oel apparently means "cool" although this usage is not found elsewhere.`,
      `Lake formed by the Anduin. Nen Hithoel was a long, oval-shaped lake. The rugged land called the Emyn Muil spread out from both shores of Nen Hithoel.`,
      "https://thainsbook.minastirith.cz/lakes.html#Hithoel"
    ),
    tolerance: 1,
    weight: 2
  },
  sea_of_nurnen: {
    pathName: 'sea_of_nurnen',
    color: "blue", 
    name: "Sea of Nurnen",
    PopupContent: createGeographicPopup(
      "Sea of Nurnen",
      "Nurnen",
      `On Tolkien's map of Middle-earth, this body of water is called the Sea of Nurnen. In the text, it is referred to as an inland sea but it is called Lake Nurnen. Nurnen means "sad water" in Sindarin. The word nurn means "lament" and the word nen means "water."`,
      `Body of water in Mordor. Nurnen was a large, dark lake or inland sea in the southeastern part of Mordor.`,
      "https://thainsbook.minastirith.cz/lakes.html#Lake%20Nurnen"
    ),
    tolerance: 1,
    weight: 2
  },
  sea_of_rhun: {
    pathName: 'sea_of_rhun',
    color: "blue", 
    name: "Sea of Rhun",
    PopupContent: createGeographicPopup(
      "Sea of Rhun",
      "Rhun",
      `Also called the Inland Sea. Rhûn means "east" in Sindarin.`,
      `Sea in eastern Middle-earth. The Sea of Rhun was a large inland sea located in Rhun, a land in far eastern Middle-earth.`,
      "https://thainsbook.minastirith.cz/lakes.html#Rhun"
    ),
    tolerance: 1,
    weight: 2
  },
  lake_helevorn: {
    pathName: 'lake_helevorn',
    color: "blue", 
    name: "Lake Helevorn",
    PopupContent: createGeographicPopup(
      "Lake Helevorn",
      "Helevorn",
      `The name Helevorn means "black glass" in Sindarin. The Sindarin word hele or heledh meaning "glass" is derived from the Dwarvish word kheled. The element vorn is from morn meaning "black."`,
      `Lake in Beleriand. Lake Helevorn was located in the region of Thargelion on the western side of the Blue Mountains. It was a deep, dark lake at the southern foot of Mount Rerir, which stood out from the main range. `,
      "https://thainsbook.minastirith.cz/lakes.html#Lake-Helevorn"
    ),
    tolerance: 1,
    weight: 2
  },
  long_lake: {
    pathName: 'long_lake',
    color: "blue", 
    name: "Long Lake",
    PopupContent: createGeographicPopup(
      "Long Lake",
      "None",
      `The name Helevorn means "black glass" in Sindarin. The Sindarin word hele or heledh meaning "glass" is derived from the Dwarvish word kheled. The element vorn is from morn meaning "black."`,
      `Lake in Wilderland. Long Lake was formed by the River Running south of its source in the Lonely Mountain. It was a very large, oval-shaped lake that had once been a deep rocky valley.`,
      "https://thainsbook.minastirith.cz/lakes.html#Lake-Helevorn"
    ),
    tolerance: 1,
    weight: 2
  },
};
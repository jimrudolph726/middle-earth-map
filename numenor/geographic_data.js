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
  lake_mithrim: {
    pathName: 'lake_mithrim',
    color: "blue", 
    name: "Lake Mithrim",
    PopupContent: createGeographicPopup(
      "Lake Mithrim",
      "Mithrim",
      `The name Mithrim means "Grey-elves" in Sindarin from mith meaning "grey" and rim meaning "host, great number."`,
      `Lake in the region of Mithrim in southeastern Hithlum. Lake Mithrim was a long lake fed by four streams that came down from the mountains bordering Mithrim - three from the Ered Wethrin and one from the Mountains of Mithrim. `,
      "https://thainsbook.minastirith.cz/lakes.html#Lake-Mithrim"
    ),
    tolerance: 1,
    weight: 2
  },
};
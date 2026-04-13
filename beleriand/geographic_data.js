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
    forest_of_brethil: {
    pathName: "forest_of_brethil",
    color: "green", 
    name: "Forest of Brethil",
    PopupContent: createGeographicPopup(
      "Forest of Brethil",
      "Forest of Brethil",
      `The word brethil in the name Forest of Brethil is defined as "beech-tree" in Sindarin in The Etymologies. (However it should be noted that the Appendix to The Silmarillion gives the definition of brethil as "silver birch" as in the Birchwoods of Nimbrethil.) Also called Brethiliand.`,
      `Woods in Beleriand where the Men of the House of Haleth lived. The Forest of Brethil was located west of the great woodland realm of Doriath.`,
      "https://thainsbook.minastirith.cz/forests.html#Brethil",
    ),
    tolerance: 1,
    weight: 2,
  },
    forest_of_region: {
    pathName: "forest_of_region",
    color: "green", 
    name: "Forest of Region",
    PopupContent: createGeographicPopup(
      "Forest of Region",
      "Forest of Region",
      `Region is given as Doriathrin.[3] The base is the word reg ("holly tree"), with perhaps the toponymical ending -ion (*"holly-land") or a plural genitive ending -ion (as in Quenya), having the meaning *"(Land) of Hollies".`,
      `The Forest of Region was a forest, primarily made up of holly. Early in the First Age, the Tatyar rested in its woods.`,
      "https://tolkiengateway.net/wiki/Forest_of_Region#:~:text=The%20Forest%20of%20Region%20was,and%20the%20Girdle%20of%20Melian.",
    ),
    tolerance: 1,
    weight: 2,
  },
    forest_of_neldoreth: {
    pathName: "forest_of_neldoreth",
    color: "green", 
    name: "Forest of Neldoreth",
    PopupContent: createGeographicPopup(
      "Forest of Neldoreth",
      "Forest of Neldoreth",
      `The name Neldoreth is unclear, but seems to be a compound of neldor ("beech") and the abstract noun ending -eth.`,
      `The Forest of Neldoreth was the beech-forest that lay between the banks of the Esgalduin River and the Mindeb River that formed the northern and lesser part of the Kingdom of Doriath.`,
      "https://tolkiengateway.net/wiki/Forest_of_Neldoreth",
    ),
    tolerance: 1,
    weight: 2,
  },
    taur_im_duinath: {
    pathName: "taur_im_duinath",
    color: "green", 
    name: "Taur-im-Duinath",
    PopupContent: createGeographicPopup(
      "Taur-im-Duinath",
      "Taur-im-Duinath",
      `The name Taur-im-Duinath means "Forest between Rivers" in Sindarin from taur meaning "forest," im meaning "between," duin meaning "river" and the collective plural ending -ath.`,
      `Forest in Beleriand. Taur-im-Duinath was located in southern Beleriand between the Gelion and the Sirion.`,
      "https://tolkiengateway.net/wiki/Forest_of_Neldoreth",
    ),
    tolerance: 1,
    weight: 2,
  },
    birchwoods_of_nimbrethil: {
    pathName: "birchwoods_of_nimbrethil",
    color: "green", 
    name: "Birchwoods of Nimbrethil",
    PopupContent: createGeographicPopup(
      "Birchwoods of Nimbrethil",
      "Birchwoods of Nimbrethil",
      `The name Nimbrethil means "white birches." The Sindarin word nim means "white." The word brethil is defined as "silver birch" (though other sources define brethil as "beech tree"). Also called the Birchwoods of Nimbrethil.`,
      `Birchwoods of Beleriand. Nimbrethil was located on the northern shore of the Bay of Balar which opened onto the Sea on the west coast of Middle-earth.`,
      "https://tolkiengateway.net/wiki/Forest_of_Neldoreth",
    ),
    tolerance: 1,
    weight: 2,
  },
    nan_tathren: {
    pathName: "nan_tathren",
    color: "green", 
    name: "Nan-Tathren",
    PopupContent: createGeographicPopup(
      "Nan-Tathren",
      "Nan-Tathren",
      `The name Nan-tathren means "Willow-vale" in Sindarin from nan meaning "valley" and tathren, the adjective form of tathar meaning "willow." The Quenya forms of the name were Tasarinan and Nan-tasarion from tasarë meaning "willow." Also called the Land of Willows.`,
      `Land of Willows in Beleriand. Nan-tathren was a wooded area at the confluence of the Narog and the Sirion.`,
      "https://tolkiengateway.net/wiki/Forest_of_Neldoreth",
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
    little_gelion: {
    pathName: 'little_gelion',
    color: "blue",  // Color is set to blue for every object
    name: "Little Gelion",
    PopupContent: createGeographicPopup(
      "Little Gelion",
      "None",
      `In one source (HoME IV, p. 210), Tolkien equated the name Gelion with the Old English word glæden meaning "iris," but this is not a translation from Elvish.`,
      `Little Gelion was a lesser river that rose beneath Himring in the north marches of Beleriand, whose spring was close by that of the Celon.`,
      "https://tolkiengateway.net/wiki/Little_Gelion"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
      river_gelion: {
    pathName: 'river_gelion',
    color: "blue",  // Color is set to blue for every object
    name: "River Gelion",
    PopupContent: createGeographicPopup(
      "River Gelion",
      "None",
      `In one source (HoME IV, p. 210), Tolkien equated the name Gelion with the Old English word glæden meaning "iris," but this is not a translation from Elvish.`,
      `River on the western border of Ossiriand. The Gelion was the longest river in Beleriand. It was twice the length of the Sirion, which would make the Gelion approximately 780 miles long.`,
      "https://tolkiengateway.net/wiki/Little_Gelion"
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
import { 
  createGeographicPopup 
} from "../shared/functions.js";

export const mountains = {
  mount_dolmed: {
    pathName: "meneltarma",
    color: "brown",
    name: "Meneltarma",
    PopupContent: createGeographicPopup(
      "Meneltarma",
      "Meneltarma",
      `The name Meneltarma means "Pillar of Heaven" in Quenya from menel meaning "heaven" and tarma meaning "pillar."`,
      `Mountain in Numenor sacred to the worship of Eru. Meneltarma was a solitary peak near the center of the island of Numenor.`,
      "https://thainsbook.minastirith.cz/mountains.html#Meneltarma"
    ),
    tolerance: 1,
    weight: 2,
  },
  sorontil: {
    pathName: "sorontil",
    color: "brown",
    name: "Sorontil",
    PopupContent: createGeographicPopup(
      "Sorontil",
      "Sorontil",
      `The name Sorontil means "eagle horn" from the Quenya word soron meaning "eagle" and til meaning "point, horn."`,
      `Sorontil is a mountain of Númenor (actually the only known mountain besides the Meneltarma) standing near the island's North Cape of Forostar, with its eastern flanks forming sheer sea-cliffs.`,
      "https://thainsbook.minastirith.cz/mountains.html#Sorontil"
    ),
    tolerance: 1,
    weight: 2,
  },
};
export const rivers = {
  nunduine: {
    pathName: 'nunduine',
    color: "blue",  // Color is set to blue for every object
    name: "Nunduinë",
    PopupContent: createGeographicPopup(
      "Nunduinë",
      "Nunduinë",
      `Nunduinë is a Quenya name meaning "Western River", consisting of nún- ("western") + -duinë ("river").`,
      `Nunduinë was a river of Númenor, the second longest after the Siril. It flowed westward out of the central regions of the island, and as it approached the sea, its waters spread to form the fragrant lake of Nísinen.`,
      "https://thainsbook.minastirith.cz/rivers.html#Nunduin%C3%AB"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
};
export const large_regions = {
  orrostar: {
    pathName: 'orrostar',
    color: "brown", 
    name: "Orrostar",
    PopupContent: createGeographicPopup(
      "Orrostar",
      `Orrostar`,
      `Orrostar is a Quenya name meaning “Eastlands”, consisting of orró- (“east”, associated with “rising” or “sunrise”) + -sta (“land, region, division”) + plural -r.`,
      `Orrostar was the eastern promontory of Númenor, a roughly rectangular block of land some two hundred miles west to east that was surrounded by sea on all but its western side.`,
      "https://tolkiengateway.net/wiki/Orrostar"
    ),
    tolerance: 1,
    weight: 2
  },
  forostar: {
    pathName: 'forostar',
    color: "brown", 
    name: "Forostar",
    PopupContent: createGeographicPopup(
      "Forostar",
      `Forostar`,
      `Forostar is a Quenya name meaning “Northlands”, consisting of foro- (“north”) + -sta (“land, region, division”) + plural -r.`,
      `Forostar was the northern promontory of Númenor, a land of rocks, cliffs and high moors with woods of fir and larch.`,
      "https://tolkiengateway.net/wiki/Forostar"
    ),
    tolerance: 1,
    weight: 2
  },
  andustar: {
    pathName: 'andustar',
    color: "brown", 
    name: "Andustar",
    PopupContent: createGeographicPopup(
      "Andustar",
      `Andustar`,
      `Andustar is a Quenya name meaning “Westlands”, consisting of andu- (“west”, associated with sunset) + -sta (“land, region, division”) + plural -r.`,
      `Andustar was the western promontory of Númenor, separated from the Hyarnustar to the south by the wide Bay of Eldanna.`,
      "https://tolkiengateway.net/wiki/Forostar"
    ),
    tolerance: 1,
    weight: 2
  },
  hyarnustar: {
    pathName: 'hyarnustar',
    color: "brown", 
    name: "Hyarnustar",
    PopupContent: createGeographicPopup(
      "Hyarnustar",
      `Hyarnustar`,
      `Hyarnustar is a Quenya name meaning “Southwestlands”, consisting of hyar- (“south”) + nú- (“west”, associated with the setting of the sun) + -sta (“land, region, division”) + plural -r.`,
      `Andustar was the western promontory of Númenor, separated from the Hyarnustar to the south by the wide Bay of Eldanna.`,
      "https://tolkiengateway.net/wiki/Hyarnustar"
    ),
    tolerance: 1,
    weight: 2
  },
  hyarrostar: {
    pathName: 'hyarrostar',
    color: "brown", 
    name: "Hyarrostar",
    PopupContent: createGeographicPopup(
      "Hyarrostar",
      `Hyarrostar`,
      `Hyarrostar is a Quenya name meaning “Southeastlands”, consisting of hyar- (“south”) + ró- / orro- (“east”, associated with rising or sunrise) + -sta (“land, region, division”) + plural -r.`,
      `Hyarrostar was the wide promontory that spread out to the south and east of Númenor, and in fact contained its easternmost point.`,
      "https://tolkiengateway.net/wiki/Hyarrostar"
    ),
    tolerance: 1,
    weight: 2
  },
  mittalmar: {
    pathName: 'mittalmar',
    color: "brown", 
    name: "Mittalmar",
    PopupContent: createGeographicPopup(
      "Mittalmar",
      `Mittalmar`,
      `Mittalmar is a Quenya name meaning “Inlands”, probably consisting of mitta (“between, in, within”) + már (“home, dwelling, habitation”), with the -l- likely inserted for euphony.`,
      `Mittalmar was a pastoral region of grassland and pasture that lay in the central parts of the island of Númenor.`,
      "https://tolkiengateway.net/wiki/Mittalmar"
    ),
    tolerance: 1,
    weight: 2
  },
}
export const sub_regions = {
  arandor: {
    pathName: 'arandor',
    color: "brown", 
    name: "Arandor",
    PopupContent: createGeographicPopup(
      "Arandor",
      `Arandor`,
      `Arandor is a Quenya name meaning “Kingsland” or “King’s Land”, consisting of aran (“king”) + -ndor (“land, country”).`,
      `Arandor, also known as Kingsland, was the important central region of Númenor, around the island's capital at Armenelos between the Meneltarma near the centre of the island and the port of Rómenna on its eastern coast.`,
      "https://tolkiengateway.net/wiki/Arandor"
    ),
    tolerance: 1,
    weight: 2
  },
  emerie: {
    pathName: 'emerie',
    color: "brown", 
    name: "Emerië",
    PopupContent: createGeographicPopup(
      "Emerië",
      `Emerië`,
      `Emerië is a Quenya name probably meaning “The Herding”, consisting of emer- (“to herd, especially sheep”) + -ië (a suffix forming gerunds or abstract nouns, roughly “-ing”). The exact meaning is not explicitly given by Tolkien, but this interpretation fits Emerië’s association with shepherds and sheep.`,
      `Emerië composed a part of the Mittalmar region in central Númenor and was the location of the White House of Erendis, queen to Tar-Aldarion.`,
      "https://tolkiengateway.net/wiki/Arandor"
    ),
    tolerance: 1,
    weight: 2
  },
  nisimaldar: {
    pathName: 'nisimaldar',
    color: "brown", 
    name: "Nisimaldar",
    PopupContent: createGeographicPopup(
      "Nisimaldar",
      `Nisimaldar`,
      `Nísimaldar is a Quenya name meaning “Fragrant Trees”, consisting of nísima (“fragrant”) + aldar (“trees”, the plural of alda, “tree”).`,
      `Nísimaldar was the country around the haven of Eldalondë on Númenor's western coast.`,
      "https://tolkiengateway.net/wiki/N%C3%ADsimaldar"
    ),
    tolerance: 1,
    weight: 2
  },
}



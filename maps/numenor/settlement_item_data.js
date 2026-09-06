import {
  createSettlementPopup,
  createIcon,
} from '../shared/functions.js';

 // Icons
const iconUrls = {
  diamondOfErendis: new URL('./assets/diamond-of-erendis-medallion.svg', import.meta.url).href,
  gilGaladsLetter: new URL('./assets/gil-galads-letter-medallion.svg', import.meta.url).href,
  sceptreOfNumenor: new URL('./assets/sceptre-of-numenor-medallion.svg', import.meta.url).href,
  numenorCity: new URL('./assets/numenor-city-medallion.svg', import.meta.url).href,
  tent: new URL('./assets/tent.png', import.meta.url).href,
};
export const icons = {
DiamondOfErendisIcon: createIcon(iconUrls.diamondOfErendis),
GilGaladsLetterIcon: createIcon(iconUrls.gilGaladsLetter),
sceptreOfNumenor: createIcon(iconUrls.sceptreOfNumenor),
ArmenelosIcon: createIcon(iconUrls.sceptreOfNumenor),
NumenorCityIcon: createIcon(iconUrls.numenorCity),
TentIcon: createIcon(iconUrls.tent, [30, 30])
};

// Settlements
export const cities = {
  armenelos: {
    popup: createSettlementPopup(
      "Armenelos",
      `Royal city of Numenor. Armenelos was located in the eastern part of the Inlands in the region called Arandor.`,
      "https://thainsbook.minastirith.cz/towns.html#Armenelos"
    ),
    coords: [44.9396778,-93.3115786],
    icon: icons.ArmenelosIcon,
  },
  andunie: {
    popup: createSettlementPopup(
      "Andúnië",
      `City and haven on the west coast of Numenor. Andunie was located on the Bay of Andunie in the Westlands of Andustar - the northwestern promontory of the island of Numenor.`,
      "https://thainsbook.minastirith.cz/towns.html#And%C3%BAni%C3%AB"
    ),
    coords: [44.9431799,-93.3222017],
    icon: icons.NumenorCityIcon,
  },
  eldalonde: {
    popup: createSettlementPopup(
      "Eldalondë",
      `Eldalondë was a haven on the western shores of Númenor, at the mouth of the River Nunduinë.`,
      "https://tolkiengateway.net/wiki/Eldalond%C3%AB"
    ),
    coords: [44.9393576,-93.3194094],
    icon: icons.NumenorCityIcon,
  },
  nindamos: {
    popup: createSettlementPopup(
      "Nindamos",
      `Nindamos was a large fishing village located on the southern shores of Númenor among the marshlands at the mouth of the River Siril.`,
      "https://tolkiengateway.net/wiki/Eldalond%C3%AB"
    ),
    coords: [44.9355246,-93.3126594],
    icon: icons.NumenorCityIcon,
  },
  romenna: {
    popup: createSettlementPopup(
      "Rómenna",
      `The haven of Rómenna was the main seaport of Númenor situated on its east coast, through which much of the traffic with the old lands of Middle-earth passed.`,
      "https://tolkiengateway.net/wiki/R%C3%B3menna"
    ),
    coords: [44.9396727,-93.3089083],
    icon: icons.NumenorCityIcon,
  },
  white_house_of_erendis: {
    popup: createSettlementPopup(
      "White House of Erendis",
      `A house that stood in the Emerië region of the Mittalmar of Númenor. It was built for Erendis as a gift by Tar-Meneldur, to mark her betrothal to his son Aldarion.`,
      "https://tolkiengateway.net/wiki/White_House_of_Erendis"
    ),
    coords: [44.938052,-93.315324],
    icon: icons.NumenorCityIcon,
  },
};

// Items
export const royalheirlooms = {
  sceptre_of_numenor: {
    popup: createSettlementPopup(
      "Sceptre of Númenor",
      `In Númenor, the power of the Kings and Queens was symbolised not by a crown, but by a Sceptre, held by Elros Tar-Minyatur and all his ruling descendants to the time of Ar-Pharazôn.`,
      "https://tolkiengateway.net/wiki/Sceptre_of_N%C3%BAmenor"
    ),
    coords: [44.940425,-93.311935],
    icon: icons.sceptreOfNumenor,
  },
  sceptre_of_annuminas: {
    popup: createSettlementPopup(
      "Sceptre of Annúminas",
      `The Sceptre of Annúminas was a silver rod, originally the symbol of office of the Lords of Andúnië in Númenor. `,
      "https://tolkiengateway.net/wiki/Sceptre_of_Ann%C3%BAminas"
    ),
    coords: [44.943825,-93.322176],
    icon: icons.sceptreOfNumenor,
  },
}
export const jewels_and_keepsakes = {
  diamond_of_erendis: {
    popup: createSettlementPopup(
      "Jewel of Erendis",
      `The Jewel of Erendis is a diamond gifted by Aldarion to Erendis in the Second Age, which she wore on her forehead and earned her the title of Tar-Elestirnë, initiating the custom of monarchs wearing white jewels instead of crowns.`,
      "https://tolkiengateway.net/wiki/Erendis"
    ),
    coords: [44.939070,-93.315881],
    icon: icons.DiamondOfErendisIcon,
  },
  gil_galads_letter: {
    popup: createSettlementPopup(
      "Gil-galad's Letter",
      `Gil-galad's letter refers to a letter that Gil-galad wrote in Lindon and gave to Aldarion at Mithlond, to be delivered to Tar-Meneldur in Númenor.`,
      "https://tolkiengateway.net/wiki/Gil-galad%27s_letter"
    ),
    coords: [44.940653,-93.311518],
    icon: icons.GilGaladsLetterIcon,
  },
}

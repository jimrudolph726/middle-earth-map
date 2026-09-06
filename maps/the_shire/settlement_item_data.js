import {
  createSettlementPopup,
  createIcon,
} from '../shared/functions.js';

 // Icons
const iconUrls = {
  innsAndGatheringPlaces: new URL('./assets/shire-inn-medallion.svg', import.meta.url).href,
  homesAndFarms: new URL('./assets/shire-homestead-medallion.svg', import.meta.url).href,
  townsAndVillages: new URL('./assets/shire-village-medallion.svg', import.meta.url).href,
  finrod: new URL('../assets/finrod.png', import.meta.url).href,
  beor: new URL('../assets/beor.png', import.meta.url).href,
  dwarves: new URL('../assets/dwarves.png', import.meta.url).href,
  tent: new URL('../assets/tent.png', import.meta.url).href,
};
export const icons = {
InnsAndGatheringPlacesIcon: createIcon(iconUrls.innsAndGatheringPlaces),
HomesAndFarmsIcon: createIcon(iconUrls.homesAndFarms),
TownsAndVillagesIcon: createIcon(iconUrls.townsAndVillages),
NargothrondIcon: createIcon(iconUrls.finrod),
LadrosIcon: createIcon(iconUrls.beor),
DwarvesIcon: createIcon(iconUrls.dwarves),
TentIcon: createIcon(iconUrls.tent, [30, 30])
};

// Settlements
export const towns_and_villages = {
  hobbiton: {
    popup: createSettlementPopup(
      "Hobbiton",
      `Village in the Westfarthing of the Shire; home of Bilbo and Frodo Baggins. Hobbiton was located on the Water, about a mile northwest of its neighboring village Bywater.`,
      "https://thainsbook.minastirith.cz/towns.html#Hobbiton"
    ),
    coords: [44.9415030,-93.2846241],
    icon: icons.TownsAndVillagesIcon,
  },
};
export const homes_and_farms = {
  bamfurlong: {
    popup: createSettlementPopup(
      "Bamfurlong",
      `Farmer Maggot's farm. Bamfurlong was located in the Marish on the west side of the Brandywine River.`,
      "https://tolkiengateway.net/wiki/Bamfurlong"
    ),
    coords: [44.9403689,-93.2804545],
    icon: icons.HomesAndFarmsIcon,
  },
};
export const inns_and_gathering_places = {
  the_green_dragon: {
    popup: createSettlementPopup(
      "The Green Dragon",
      `The Green Dragon was one of the many inns of the Shire. It was located in Bywater on the Bywater Road and was the building nearest to Hobbiton, being one mile south-east from the bridge over the Water that led to Bag End.`,
      "https://tolkiengateway.net/wiki/The_Green_Dragon"
    ),
    coords: [44.9413021,-93.2844148],
    icon: icons.InnsAndGatheringPlacesIcon,
  },
};

// Items
export const swords = {
  glamdring: {
    popup: createSettlementPopup(
      "Glamdring",
      `Sword of Gandalf. Glamdring was forged in Gondolin, a great realm of the Elves in the First Age. It once belonged to Turgon, the King of Gondolin. It is not known how Glamdring survived the Fall of Gondolin.`,
      "https://thainsbook.minastirith.cz/swords.html#Glamdring"
    ),
    coords: [44.9468787,-93.3063229],
    icon: icons.GlamdringIcon,
  },
  sting: {
    popup: createSettlementPopup(
      "Sting",
      `Sword of Bilbo Baggins. Sting was actually a long knife that made the perfect Hobbit-sized sword. Bilbo found it in 2941 of the Third Age in the Troll-hoard of Bert, Tom and William, where the swords Glamdring and Orcrist were also found.`,
      "https://thainsbook.minastirith.cz/swords.html#Sting"
    ),
    coords: [44.9467978,-93.3058998],
    icon: icons.StingIcon,
  },
  anduril_narsil: {
    popup: createSettlementPopup(
      "Andúril / Narsil",
      `Anduril was the sword of Aragorn. It was forged from the shards of Elendil's sword, Narsil.`,
      "https://thainsbook.minastirith.cz/swords.html#Anduril"
    ),
    coords: [44.94091256,-93.30126127],
    icon: icons.NarsilIcon,
  },
}
export const rings = {
  the_one_ring: {
    popup: createSettlementPopup(
      "The One Ring (forged around SA 1600)",
      `The One Ring was the greatest of the Rings of Power. Sauron created it to rule the others, and in order to do so he invested the One Ring with much of his strength and will.`,
      "https://thainsbook.minastirith.cz/onering.html"
    ),
    coords: [44.9414214,-93.2990178],
    icon: icons.RingIcon,
  },
  narya: {
    popup: createSettlementPopup(
      "Narya (forged around SA 1590)",
      `The Ring of Fire. Narya was set with a red stone. At the time of the War of the Ring, Gandalf was the bearer of Narya.`,
      "https://thainsbook.minastirith.cz/objects.html#Narya"
    ),
    coords: [44.9455179,-93.3068293],
    icon: icons.NaryaIcon,
  },
  nenya: {
    popup: createSettlementPopup(
      "Nenya (forged around SA 1590)",
      `The Ring of Water. Nenya was set with a white diamond and its band was made of mithril. Galadriel was the bearer of Nenya.`,
      "https://thainsbook.minastirith.cz/objects.html#Nenya"
    ),
    coords: [44.9451063,-93.3071364],
    icon: icons.NenyaIcon,
  },
  vilya: {
    popup: createSettlementPopup(
      "Vilya (forged around SA 1590)",
      `The Ring of Air. Vilya was said to be the mightiest of the Three. It had a gold band set with a blue stone. At the time of the War of the Ring, Vilya was borne by Elrond.`,
      "https://thainsbook.minastirith.cz/objects.html#Vilya"
    ),
    coords: [44.9450277,-93.3063262],
    icon: icons.VilyaIcon,
  },
  barahir: {
    popup: createSettlementPopup(
      "Ring of Barahir (forged around FA 400)",
      `Heirloom of the House of Isildur and a symbol of friendship between Elves and Men. The Ring of Barahir had no special powers but it was valued for its heritage. It was made by the Noldor in the Undying Lands.`,
      "https://thainsbook.minastirith.cz/objects.html#Ring%20of%20Barahir"
    ),
    coords: [44.9408248,-93.3012181],
    icon: icons.BarahirIcon,
  },
}
export const books = {
  red_book_of_westmarch: {
    popup: createSettlementPopup(
      "The Red Book of Westmarch",
      `The Red Book was written by Bilbo and Frodo Baggins and completed by Sam Gamgee. It tells of their adventures in the Third Age of Middle-earth and is the primary source of information on Hobbits and their role in the War of the Ring.`,
      "https://thainsbook.minastirith.cz/books.html#Red%20Book%20of%20Westmarch"
    ),
    coords: [44.9466424,-93.3109916],
    icon: icons.BookIcon,
  },
  akallabeth: {
    popup: createSettlementPopup(
      "Akallabêth",
      `Story of the Downfall of Numenor. The Akallabeth was written by Elendil, the leader of the survivors of Numenor.`,
      "https://thainsbook.minastirith.cz/books.html#Akallab%C3%AAth"
    ),
    coords: [44.94092381,-93.30125186],
    icon: icons.BookIcon,
  },
  book_of_mazarbul: {
    popup: createSettlementPopup(
      "Book of Mazarbul",
      `Record of Balin's expedition to Moria. The Book of Mazarbul covered five years, beginning with the arrival of the Dwarves in Moria in 2989 of the Third Age and abruptly ending in the year 2994. Mazarbul means "records" in Dwarvish.`,
      "https://thainsbook.minastirith.cz/books.html#Book%20of%20Mazarbul"
    ),
    coords: [44.9449721,-93.3056964],
    icon: icons.BookIcon,
  },
}

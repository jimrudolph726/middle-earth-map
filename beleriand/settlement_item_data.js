import {
  createSettlementPopup,
  createIcon,
} from './functions.js';

 // Icons
const iconUrls = {
  finrod: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/finrod.png',
  beor: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/beor.png',
  belegost: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/belegost.png',
  nogrod: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/nogrod.png',
  lothlorien: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/galadriel.png',
  mithlond: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/cirdan.png',
  tent: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/tent.png',
  battle: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/battles.png',
  glamdring: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/glamdring.png',
  sting: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/sting.png',
  narsil: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/narsil.png',
  ring: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/ring.png',
  narya: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/narya.png',
  nenya: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/nenya.png',
  vilya: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/vilya.png',
  barahir: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/barahir.png',
  book: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/book.png',
};
export const icons = {
NargothrondIcon: createIcon(iconUrls.finrod),
LadrosIcon: createIcon(iconUrls.beor),
BelegostIcon: createIcon(iconUrls.belegost),
NogrodIcon: createIcon(iconUrls.nogrod),
LothlorienIcon: createIcon(iconUrls.lothlorien),
MithlondIcon: createIcon(iconUrls.mithlond),
BattleIcon: createIcon(iconUrls.battle),
GlamdringIcon: createIcon(iconUrls.glamdring),
StingIcon: createIcon(iconUrls.sting),
NarsilIcon: createIcon(iconUrls.narsil),
RingIcon: createIcon(iconUrls.ring),
NaryaIcon: createIcon(iconUrls.narya),
NenyaIcon: createIcon(iconUrls.nenya),
VilyaIcon: createIcon(iconUrls.vilya),
BarahirIcon: createIcon(iconUrls.barahir),
BookIcon: createIcon(iconUrls.book),
TentIcon: createIcon(iconUrls.tent, [30, 30])
};

// Settlements
export const elves = {
  nargothrond: {
    coords: [44.9407283,-93.2984007],
    icon: icons.NargothrondIcon,
    popup: createSettlementPopup("Nargothrond",
    "Nargothrond was the underground fortress of Finrod Felagund and the surrounding realm in West Beleriand. It was one of the great strongholds of the Elves in Middle-earth during the First Age.",
    "https://thainsbook.minastirith.cz/nargothrond.html")
  },
};
export const men = {
  ladros: {
    popup: createSettlementPopup(
      "Ladros",
      `Village at the crossroads of the Great East Road and the Greenway in Eriador. Bree was unique in that the Big Folk (Men) and Little Folk (Hobbits) both dwelled there on friendly terms.`,
      "https://tolkiengateway.net/wiki/Ladros"
    ),
    coords: [44.9430762,-93.2946712],
    icon: icons.LadrosIcon,
  },
};
export const dwarves = {
  belegost: {
    popup: createSettlementPopup(
      "Belegost",
      `Belegost was one of two great underground Dwarven cities in the Blue Mountains, the other being Nogrod, that prospered during the First Age.`,
      "https://tolkiengateway.net/wiki/Belegost"
    ),
    coords: [44.9411277,-93.2907660],
    icon: icons.BelegostIcon,
  },
  nogrod: {
    popup: createSettlementPopup(
      "Nogrod",
      `Nogrod was one of two great underground Dwarven cities in the Ered Luin, the other being Belegost, that prospered during the First Age. `,
      "https://tolkiengateway.net/wiki/Nogrod"
    ),
    coords: [44.9409122,-93.2906264],
    icon: icons.NogrodIcon,
  },
};
export const battles = {
  battle_of_dagorlad: {
    popup: createSettlementPopup("The Battle of Dagorlad (SA 3434 - 3441)",
      `In 3434, the armies of the Last Alliance and Sauron met in battle outside the Black Gate of Mordor on the great plain that became known as Dagorlad, the Battle Plain. The army of the Last Alliance consisted of the forces that had marched from the north and the Men of Gondor who had been defending their borders.`,
      "https://thainsbook.minastirith.cz/battles.html#Last-Alliance"
    ),
    coords: [44.9424929,-93.3001234],
    icon: icons.BattleIcon,
  },
  battle_of_bywater: {
    popup: createSettlementPopup("The Battle of Bywater (TA November 3rd 3019)",
      `Battle between Hobbits and Men in the Shire. The Battle of Bywater was the last battle of the War of the Ring. The battle was fought on November 3, 3019 of the Third Age, on the Bywater Road near the village of Bywater.`,
      "https://thainsbook.minastirith.cz/battles.html#Battle%20of%20Bywater"
    ),
    coords: [44.9465615,-93.3111173],
    icon: icons.BattleIcon,
  },
  battle_of_dale: {
    popup: createSettlementPopup("The Battle of Dale (TA March 15th 3019)",
      `Battle in the north during the War of the Ring. The Battle of Dale began on March 15, 3019 of the Third Age. An army of Easterlings allied to Sauron crossed the Redwater and King Brand of Dale was forced to retreat to the foot of the Lonely Mountain.`,
      "https://thainsbook.minastirith.cz/battles.html#Dale"
    ),
    coords: [44.9479213,-93.3005827],
    icon: icons.BattleIcon,
  },
  battle_of_fornost: {
    popup: createSettlementPopup("The Battle of Fornost (TA 1975)",
      `Battle between the forces of the Witch-king of Angmar and the combined forces of the Dunedain of the North, Elves of Lindon and Rivendell, and Men of Gondor.`,
      "https://thainsbook.minastirith.cz/battles.html#Fornost"
    ),
    coords: [44.9475027,-93.3100271],
    icon: icons.BattleIcon,
  },
  battle_of_greenfields: {
    popup: createSettlementPopup("Battle of Greenfields (TA 2747)",
      `Battle between Orcs and Hobbits in the Shire. In the year 2747 of the Third Age, an army of Orcs from Mount Gram led by Golfimbul invaded Greenfields in the Northfarthing.`,
      "https://thainsbook.minastirith.cz/battles.html#Battle%20of%20Greenfields"
    ),
    coords: [44.9470883,-93.3108774],
    icon: icons.BattleIcon,
  },
  battle_of_helms_deep: {
    popup: createSettlementPopup("Battle of Helm's Deep (TA March 3rd and 4th 3019)",
      `Battle between the Men of Rohan and the forces of Saruman during the War of the Ring. The Battle of Helm's Deep was fought during the rainy night of March 3-4, 3019 of the Third Age.`,
      "https://thainsbook.minastirith.cz/battles.html#Helm%27s"
    ),
    coords: [44.9422362,-93.3058114],
    icon: icons.BattleIcon,
  },
  battle_of_the_morannon: {
    popup: createSettlementPopup("Battle of the Morannon (TA March 25th 3019)",
      `Battle between the Host of the West and the forces of Sauron during the War of the Ring. The Battle of the Morannon took place on March 25, 3019 of the Third Age, in front of the Black Gate of Mordor.`,
      "https://thainsbook.minastirith.cz/battles.html#Morannon"
    ),
    coords: [44.9422380,-93.3001737],
    icon: icons.BattleIcon,
  },
  battle_of_the_camp: {
    popup: createSettlementPopup("Battle of the Camp (TA July 13th 1944)",
      `Battle resulting in the final defeat of the Wainriders. The Battle of the Camp was fought in Ithilien on the night of July 13, 1944 of the Third Age, between the Wainriders and the Southern Army of Gondor led by Earnil.`,
      "https://thainsbook.minastirith.cz/battles.html#Battle-Camp"
    ),
    coords: [44.9411760,-93.3006287],
    icon: icons.BattleIcon,
  },
};
export const one_on_one = {
  battle_of_the_peak: {
    popup: createSettlementPopup(
      "Battle of the Peak (TA January 23rd to January 25th 3019)",
      `Battle between Gandalf and the Balrog on the Silvertine during the War of the Ring. After Gandalf and the Balrog fell into the abyss in Moria on January 15, 3019 of the Third Age, they fought long underground and then climbed the Endless Stair to the peak of the Silvertine where Durin's Tower stood.`,
      "https://thainsbook.minastirith.cz/battles.html#Peak"
    ),
    coords: [44.94491777, -93.30559552],
    icon: icons.BattleIcon,
  },
  eowyn_witch_king: {
    popup: createSettlementPopup(
      "Éowyn vs the Witch-king of Angmar (TA March 15th 3019)",
      `Battle between Éowyn and the Witch-king of Angmar during the Battle of the Pelennor Fields. On March 15, 3019 of the Third Age, Éowyn, disguised as a soldier, defended Théoden against the Witch-king. After slaying his fell beast, she faced him in combat. With Merry’s aid, she defied prophecy and struck the final blow, destroying him.`,
      "https://thainsbook.minastirith.cz/eowyn.html"
    ),
    coords: [44.94095898, -93.30106586],
    icon: icons.BattleIcon,
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

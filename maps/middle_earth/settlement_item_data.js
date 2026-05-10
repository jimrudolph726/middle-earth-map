import {
  createSettlementPopup,
  createIcon,
} from './functions.js';

 // Icons
const iconUrls = {
  hobbits: new URL('./assets/hobbits.png', import.meta.url).href,
  men_gondor: new URL('./assets/tree_of_gondor.png', import.meta.url).href,
  men_rohan: new URL('./assets/men_rohan.png', import.meta.url).href,
  rivendell: new URL('./assets/rivendell.png', import.meta.url).href,
  lothlorien: new URL('./assets/galadriel.png', import.meta.url).href,
  mithlond: new URL('./assets/cirdan.png', import.meta.url).href,
  tent: new URL('./assets/tent.png', import.meta.url).href,
  battle: new URL('./assets/battles.png', import.meta.url).href,
  glamdring: new URL('./assets/glamdring.png', import.meta.url).href,
  sting: new URL('./assets/sting.png', import.meta.url).href,
  narsil: new URL('./assets/narsil.png', import.meta.url).href,
  ring: new URL('./assets/ring.png', import.meta.url).href,
  narya: new URL('./assets/narya.png', import.meta.url).href,
  nenya: new URL('./assets/nenya.png', import.meta.url).href,
  vilya: new URL('./assets/vilya.png', import.meta.url).href,
  barahir: new URL('./assets/barahir.png', import.meta.url).href,
  book: new URL('./assets/book.png', import.meta.url).href,
  palantíri: new URL('./assets/palantir.png', import.meta.url).href,
  dwarves_durin: new URL('./assets/dwarves_durin.png', import.meta.url).href,
};
export const icons = {
HobbitsIcon: createIcon(iconUrls.hobbits),
MenGondorIcon: createIcon(iconUrls.men_gondor),
MenRohanIcon: createIcon(iconUrls.men_rohan),
RivendellIcon: createIcon(iconUrls.rivendell),
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
PalantirIcon: createIcon(iconUrls.palantíri),
TentIcon: createIcon(iconUrls.tent, [30, 30]),
DwarvesIcon: createIcon(iconUrls.dwarves_durin),
};

// Settlements
export const elves = {
  rivendell: {
    coords: [44.94677219,-93.30552175],
    icon: icons.RivendellIcon,
    popup: createSettlementPopup("Rivendell",
    "Rivendell was the realm of Elrond. During the Third Age it was one of the few remaining realms of the Elves in Middle-earth. Much of the history and lore of the Elves was preserved in Rivendell and it was a place of peace and beauty.",
    "https://thainsbook.minastirith.cz/rivendell.html")
  },
  lothlorien: {
    coords: [44.9448403,-93.3045497],
    icon: icons.LothlorienIcon,
    popup: createSettlementPopup("Lothlorien",
    "Lothlorien was the home of Galadriel and Celeborn and their people, the Galadhrim. It was the only forest of mallorn-trees in Middle-earth, and thus it was known as the Golden Wood.",
    "https://thainsbook.minastirith.cz/lothlorien.html")
  },
  mithlond: {
    coords: [44.94660051,-93.31353613],
    icon: icons.MithlondIcon,
    popup: createSettlementPopup("Mithlond",
    "Port on the northwestern coast of Middle-earth. The Grey Havens were the place from which the ships of the Elves sailed westward across the Sea to the Undying Lands, where the spirits called the Valar dwelled. At the end of the Third Age, many Elves left Middle-earth from the Grey Havens, and the Ringbearers Frodo and Bilbo Baggins also embarked from there so they could find peace and healing in the Undying Lands.",
    "https://thainsbook.minastirith.cz/towns.html#Grey-Havens")
  },
};
export const dwarves = {
  khazad_dûm: {
    coords: [44.9449491,-93.3057188],
    icon: icons.DwarvesIcon,
    popup: createSettlementPopup("Khazad-dûm",
    "Khazad-dum was the greatest of the Dwarf realms in Middle-earth. Its vast and beautiful halls lay under the Misty Mountains. From its mines came great riches and it was the only source of the precious metal called mithril.",
    "https://thainsbook.minastirith.cz/moria.html")
  },
  erebor: {
    coords: [44.9479827,-93.3006965],
    icon: icons.DwarvesIcon,
    popup: createSettlementPopup("Erebor",
    "Mountain realm of the Dwarves captured by Smaug the Dragon. The Lonely Mountain was a tall, isolated mountain in the far northeast of Wilderland. It stood near the edge of Mirkwood, about 50 miles south of the Grey Mountains and about 125 miles west of the Iron Hills.",
    "https://thainsbook.minastirith.cz/mountains.html#Lonely")
  }
};
export const men = {
  bree: {
    popup: createSettlementPopup(
      "Bree",
      `Village at the crossroads of the Great East Road and the Greenway in Eriador. Bree was unique in that the Big Folk (Men) and Little Folk (Hobbits) both dwelled there on friendly terms.`,
      "https://thainsbook.minastirith.cz/towns.html#Bree"
    ),
    coords: [44.94678231, -93.30970574],
    icon: icons.MenGondorIcon,
  },
  minastirith: {
    popup: createSettlementPopup(
      "Minas Tirith",
      `Minas Anor - the Tower of the Sun - was established as a stronghold by Anarion, son of Elendil, and over time it became the greatest city in Gondor. As the threat from Mordor increased, the city was renamed Minas Tirith - the Tower of Guard.`,
      "https://thainsbook.minastirith.cz/minastirith.html"
    ),
    coords: [44.94097061, -93.30122983],
    icon: icons.MenGondorIcon,
  },
  tower_of_amon_sul: {
    popup: createSettlementPopup(
      "Tower of Amon Sul",
      `Watch-tower on Weathertop. Weathertop - which was also called Amon Sul - was the southernmost of the Weather Hills. It was located north of the Great East Road in Eriador. The Tower of Amon Sul was once tall and fair, but by the end of the Third Age only ruins remained.`,
      "https://thainsbook.minastirith.cz/fortress.html#Amon%20Sul"
    ),
    coords: [44.9466629, -93.3083686],
    icon: icons.MenGondorIcon,
  },
  fornost: {
    popup: createSettlementPopup(
      "Fornost",
      `Capital of Arthedain in the North-kingdom. Fornost was located in the North Downs of Eriador, about 100 miles north of Bree and about 100 miles east of Annuminas.`,
      "https://thainsbook.minastirith.cz/towns.html#Fornost"
    ),
    coords: [44.94748318, -93.30969438],
    icon: icons.MenGondorIcon,
  },
  lake_town: {
    popup: createSettlementPopup(
      "Lake-town",
      `Town of Men on Long Lake in Wilderland. Lake-town was built on the surface of the lake supported by great wooden piles in the water. It was located on the west side of the lake near the mouth of the Forest River in a calm bay that was formed by the shelter of a rock promontory. The town was connected to the land by a long bridge.`,
      "https://thainsbook.minastirith.cz/towns.html#Lake-town"
    ),
    coords: [44.9476928, -93.3007613],
    icon: icons.MenGondorIcon,
  },
  annuminas: {
    popup: createSettlementPopup(
      "Annúminas",
      `Capital of the North-kingdom of Arnor. Annuminas was located in Eriador. The city was on the southeastern shore of Lake Evendim among the Hills of Evendim north of the Shire.`,
      "https://thainsbook.minastirith.cz/towns.html#Ann%C3%BAminas"
    ),
    coords: [44.94739293,-93.31120919],
    icon: icons.MenGondorIcon,
  },
  vinyalonde: {
    popup: createSettlementPopup(
      "Vinyalonde (Lond Daer)",
      `Numenorean port on the west coast of Middle-earth. Lond Daer was located at the mouth of the Gwathlo, or Greyflood. It was in the region of Enedwaith south of Eriador. The city of Tharbad was about 200 miles upriver from Lond Daer.`,
      "https://thainsbook.minastirith.cz/towns.html#Lond-Daer"
    ),
    coords: [44.9431934,-93.3102993],
    icon: icons.MenGondorIcon,
  },
  rohan: {
    popup: createSettlementPopup(
      "Rohan",
      `Rohan was the home of the Rohirrim - a hardy race of Men known for their love of horses. The land was once part of Gondor, but it was given to the Rohirrim when Eorl the Young led them from the North to help Gondor fight an enemy invasion. Rohan remained Gondor's staunchest ally, and during the War of the Ring, the Rohirrim rode to the aid of Gondor once more at the Battle of the Pelennor Fields.`,
      "https://thainsbook.minastirith.cz/rohan.html"
    ),
    coords: [44.942641, -93.3043699],
    icon: icons.MenRohanIcon,
  },
  edoras: {
    popup: createSettlementPopup(
      "Edoras",
      `Main town in Rohan and site of the royal court. Edoras was located at the foot of the White Mountains, which formed the southern border of Rohan. The town stood on a green hill at the mouth of the valley of Harrowdale.`,
      "https://thainsbook.minastirith.cz/towns.html#Edoras"
    ),
    coords: [44.94202323, -93.30482241],
    icon: icons.MenRohanIcon,
  },
};
export const hobbits = {
  hobbiton: {
    popup: createSettlementPopup(
      "Hobbiton",
      `Village in the Westfarthing of the Shire; home of Bilbo and Frodo Baggins. 
      Hobbiton was located on the Water, about a mile northwest of its neighboring village Bywater. 
      The Bywater Road passed through both villages and connected with the Great East Road to the south.`,
      "https://thainsbook.minastirith.cz/towns.html#Hobbiton"
    ),
    coords: [44.9466054, -93.3112966],
    icon: icons.HobbitsIcon,
  },
  michel_delving: {
    popup: createSettlementPopup(
      "Michel Delving",
      `Chief township of the Shire. Michel Delving was located in the Westfarthing of the Shire on the White Downs. 
      The Mayor of Michel Delving was the Shire's only real government official. 
      His office was in the Town Hole in Michel Delving. 
      The museum known as the Mathom-house was also located in Michel Delving.`,
      "https://thainsbook.minastirith.cz/towns.html#Michel%20Delving"
    ),
    coords: [44.9464735, -93.3116819],
    icon: icons.HobbitsIcon,
  },
  crick_hollow: {
    popup: createSettlementPopup(
      "Crick Hollow",
      `Village in Buckland. Crickhollow was a few miles northeast of Bucklebury. It was a quiet, secluded village.`,
      "https://tolkiengateway.net/wiki/Crickhollow"
    ),
    coords: [44.94648941, -93.31055274],
    icon: icons.HobbitsIcon,
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
    coords: [44.9450208,-93.3055802],
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
export const palantíri = {
  osgiliath_stone: {
    popup: createSettlementPopup(
      "The Stone of Osgiliath",
      `The Stone of Osgiliath was the chief and master of the seven palantiri in Middle-earth. It was one of the largest stones. The Stone of Osgiliath could survey all of the other palantiri and could "eavesdrop" on a communication between two other stones. It was kept in the Dome of Stars in Osgiliath. The Stone of Osgiliath was lost in the waters of the Anduin when the Dome of Stars was destroyed during the civil war of the Kin-strife in 1437 of the Third Age.`,
      "https://thainsbook.minastirith.cz/palantir.html"
    ),
        coords: [44.9408698,-93.3008605],
        icon: icons.PalantirIcon,
  },
  amon_sul_stone: {
    popup: createSettlementPopup(
      "The Stone of Amon Sûl",
      `The Stone of Amon Sul was the primary palantir in the North-kingdom of Arnor and the one that was used most in communication with Gondor. It was also one of the largest stones. The palantir was kept in the Tower on the hill called Amon Sul, or Weathertop. After the North-kingdom was divided into Arthedain, Cardolan, and Rhudaur, the Stone of Amon Sul became a source of contention among the three kingdoms. Arthedain retained possession of the Tower and Stone of Amon Sul, but Cardolan and Rhudaur contested this claim because Arthedain also had both of the other palantiri of the North-kingdom. In 1409 of the Third Age, the Tower of Amon Sul was destroyed by the forces of the Witch-king of Angmar. The Stone of Amon Sul was saved and taken to Fornost. It remained there until 1974 when the Witch-king captured Fornost. Again, the Stone of Amon Sul was rescued and taken north by King Arvedui along with the Stone of Annuminas. But in 1975, Arvedui boarded a ship in the Icebay of Forochel and was lost at sea in a storm along with the two palantiri.`,
      "https://thainsbook.minastirith.cz/palantir.html"
    ),
        coords: [44.94665854,-93.30836735],
        icon: icons.PalantirIcon,
  },
  annuminas_stone: {
    popup: createSettlementPopup(
      "The Stone of Annúminas",
      `The Stone of Annuminas was kept in the capital of the North-kingdom and it was the palantir used by the King. At first, the capital was Annuminas, but the Kings later relocated to Fornost and the Stone of Annuminas was moved there. After the breakup of the North-kingdom, the Stone of Annuminas was in the possession of Arthedain. When the Witch-king captured Fornost in 1974 of the Third Age, the Stone of Annuminas and the Stone of Amon Sul were saved by King Arvedui, but both palantiri were lost at sea when Arvedui's ship sank in a storm on the Icebay of Forochel in 1975.`,
      "https://thainsbook.minastirith.cz/palantir.html"
    ),
        coords: [44.94739100,-93.31121421],
        icon: icons.PalantirIcon,
  },
  elendil_stone: {
    popup: createSettlementPopup(
      "The Elendil Stone",
      `The Elendil Stone was kept in the tower of Elostirion in the Tower Hills. This palantir could not be used to communicate with the others but instead looked only west across the Sea. Elendil used the palantir from time to time to see Tol Eressea in the Undying Lands where the Master-stone was kept in the Tower of Avallone. After the fall of the North-kingdom, the Elendil Stone was guarded by Cirdan and the Elves of Lindon. High-elves sometimes made pilgrimages to the Tower Hills to see the Undying Lands in the Elendil Stone. The Chieftains of the Dunedain were by right the lawful masters of the Elendil Stone, but apparently it was not used again by Men. On September 29, 3021 of the Third Age, Cirdan put the Elendil Stone on the ship carrying the Ring-bearers away from Middle-earth, and the palantir was returned to the Undying Lands from whence it came. Note: Christopher Tolkien in Unfinished Tales states: "it is not known whether any of [the Dunedain], including Aragorn, ever looked into [the Elendil-stone]." But J.R.R. Tolkien wrote in The Road Goes Ever On: "After the fall of Elendil the High-Elves took back this Stone into their own care, and it was not destroyed, nor again used by Men." Tolkien also notes that the Elves who sing a hymn to Elbereth at Rivendell (FotR, p. 250) use the term palan-díriel - meaning "gazing afar" - indicating that these Elves had just returned from looking in the Elendil-stone.`,
      "https://thainsbook.minastirith.cz/palantir.html"
    ),
        coords: [44.9466123,-93.3130522],
        icon: icons.PalantirIcon,
  },
  ithil_stone: {
    popup: createSettlementPopup(
      "The Ithil-stone",
      `The Ithil-stone was the palantir used by Isildur in his stronghold of Minas Ithil on the borders of Mordor. It was most closely in accord with the Anor-stone kept by Isildur's brother Anarion in Minas Anor across the river.

In the year 2002 of the Third Age, Minas Ithil was captured by the Lord of the Nazgul and was renamed Minas Morgul. It is believed that the Nazgul found the Ithil-stone and that it was moved to the Dark Tower for the use of Sauron, who returned to Mordor in 2942. At the time, however, the people of Gondor did not know what had become of the Ithil-stone. Some may have thought that the defenders of Minas Ithil destroyed the palantir so it could not be captured, though given the indestructible nature of the palantiri this was unlikely. Others no doubt realized that the Ithil-stone might be in the hands of the Enemy, but it was thought that there was no danger so long as Sauron could not contact the other two remaining usable palantiri - the Anor-stone and the Orthanc-stone. Thus these palantiri were not used for many years and were largely forgotten.

But in the years leading up to the War of the Ring, Sauron used the Ithil-stone against the holders of the other two palantiri. To Denethor - the Steward of Gondor in possession of the Anor-stone - Sauron showed images of the vast forces of Mordor that were poised to strike Gondor, causing Denethor to despair that Sauron could never be defeated. Saruman, who had the Orthanc-stone, was dominated by the superior will of Sauron and became a traitor.

On the night of March 5, 3019, Sauron looked into the Ithil-stone and saw the Hobbit Pippin Took, who was using the Orthanc-stone. Sauron mistakenly believed that Pippin was the Ring-bearer being held captive by Saruman. The next morning Sauron again used the Ithil-stone and was confronted by Aragorn, who revealed that he was Isildur's heir and that Narsil - the sword that had cut the Ring from Sauron's hand - had been reforged. Sauron felt fear and doubt, causing him to strike prematurely against Gondor and distracting him from the progress of the Ring-bearer toward Mount Doom.

After the Ring was destroyed on March 25, Sauron's realm fell into ruin. It is not known what became of the Ithil-stone, but it is thought that it may have been destroyed in the intense heat following the eruption of Mount Doom.`,
      "https://thainsbook.minastirith.cz/palantir.html"
    ),
        coords: [44.9410039,-93.3002447],
        icon: icons.PalantirIcon,
  },
}
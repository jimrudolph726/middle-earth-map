// Icons
const iconUrls = {
    hobbits: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/hobbits.png',
    men_gondor: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/tree_of_gondor.png',
    men_rohan: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/men_rohan.png',
    rivendell: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/rivendell.png',
    lothlorien: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/galadriel.png',
    tent: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/tent.png',
    battle: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/battles.png',
    glamdring: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/glamdring.png',
    ring: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/ring.png',
};
function createIcon(url, size = [48, 48]) {
  return L.icon({
    iconUrl: url,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1] / 2],
    popupAnchor: [0, -size[1] / 2],
  });
}
export const icons = {
  HobbitsIcon: createIcon(iconUrls.hobbits),
  MenGondorIcon: createIcon(iconUrls.men_gondor),
  MenRohanIcon: createIcon(iconUrls.men_rohan),
  RivendellIcon: createIcon(iconUrls.rivendell),
  LothlorienIcon: createIcon(iconUrls.lothlorien),
  BattleIcon: createIcon(iconUrls.battle),
  GlamdringIcon: createIcon(iconUrls.glamdring),
  RingIcon: createIcon(iconUrls.ring),
  TentIcon: createIcon(iconUrls.tent, [30, 30])
};

export const elves = {
  rivendell: {
    name: "Rivendell",
    description: "Rivendell was the realm of Elrond. During the Third Age it was one of the few remaining realms of the Elves in Middle-earth. Much of the history and lore of the Elves was preserved in Rivendell and it was a place of peace and beauty.",
    url: "https://thainsbook.minastirith.cz/rivendell.html",
    coords: [44.94677219,-93.30552175],
    icon: icons.RivendellIcon,
  },
  lothlorien: {
    name: "Lothlorien",
    description: "Lothlorien was the home of Galadriel and Celeborn and their people, the Galadhrim. It was the only forest of mallorn-trees in Middle-earth, and thus it was known as the Golden Wood.",
    url: "https://thainsbook.minastirith.cz/lothlorien.html",
    coords: [44.9448403,-93.3045497],
    icon: icons.LothlorienIcon,
  },

};

export const men = {
  bree: {
    name: "Bree",
    description: `Village at the crossroads of the Great East Road and the Greenway in Eriador. Bree was unique in that the Big Folk (Men) and Little Folk (Hobbits) both dwelled there on friendly terms`,
    url: "https://thainsbook.minastirith.cz/towns.html#Bree",
    coords: [44.94678231,-93.30970574],
    icon: icons.MenGondorIcon,
  },
  minastirith: {
    name: "Minas Tirith",
    description: `Minas Anor - the Tower of the Sun - was established as a stronghold by Anarion, son of Elendil, and over time it became the greatest city in Gondor. As the threat from Mordor increased, the City was renamed Minas Tirith - the Tower of Guard.`,
    url: "https://thainsbook.minastirith.cz/minastirith.html",
    coords: [44.94097061,-93.30122983],
    icon: icons.MenGondorIcon,
  },
  tower_of_amon_sul: {
    name: "Tower of Amon Sul",
    description: `Watch-tower on Weathertop. Weathertop - which was also called Amon Sul - was the southernmost of the Weather Hills. It was located north of the Great East Road in Eriador. The Tower of Amon Sul was once tall and fair, but by the end of the Third Age only ruins remained.`,
    url: "https://thainsbook.minastirith.cz/fortress.html#Amon%20Sul",
    coords: [44.9466629,-93.3083686],
    icon: icons.MenGondorIcon,
  },
  fornost: {
    name: `Fornost`,
    description: `Capital of Arthedain in the North-kingdom. Fornost was located in the North Downs of Eriador, about 100 miles north of Bree and about 100 miles east of Annuminas.`,
    url: `https://thainsbook.minastirith.cz/towns.html#Fornost`,
    coords: [44.94748318,-93.30969438],
    icon: icons.MenGondorIcon,
  },
  lake_town: {
    name: "Lake-town",
    description: `Town of Men on Long Lake in Wilderland. Lake-town was built on the surface of the lake supported by great wooden piles in the water. It was located on the west side of the lake near the mouth of the Forest River in a calm bay that was formed by the shelter of a rock promontory. The town was connected to the land by a long bridge.`,
    url: "https://thainsbook.minastirith.cz/towns.html#Lake-town",
    coords: [44.9476928,-93.3007613],
    icon: icons.MenGondorIcon,
  },
  rohan: {
    name: "Rohan",
    description: `Rohan was the home of the Rohirrim - a hardy race of Men known for their love of horses. The land was once part of Gondor, but it was given to the Rohirrim when Eorl the Young led them from the North to help Gondor fight an enemy invasion. Rohan remained Gondor's staunchest ally, and during the War of the Ring the Rohirrim rode to the aid of Gondor once more at the Battle of the Pelennor Fields.`,
    url: "https://thainsbook.minastirith.cz/rohan.html",
    coords: [44.9426410,-93.3043699],
    icon: icons.MenRohanIcon,
  },
  edoras: {
    name: "edoras",
    description: `Main town in Rohan and site of the royal court. Edoras was located at the foot of the White Mountains, which formed the southern border of Rohan. The town stood on a green hill at the mouth of the valley of Harrowdale.`,
    url: "https://thainsbook.minastirith.cz/towns.html#Edoras",
    coords: [44.94202323,-93.30482241],
    icon: icons.MenRohanIcon,
  },
};

export const hobbits = {
  hobbiton: {
    name: "Hobbiton",
    description: `Village in the Westfarthing of the Shire; home of Bilbo and Frodo Baggins. Hobbiton was located on the Water, about a mile northwest of its neighboring village Bywater. The Bywater Road passed through both villages and connected with the Great East Road to the south.`,
    url: "https://thainsbook.minastirith.cz/towns.html#Hobbiton",
    coords: [44.9466054,-93.3112966],
    icon: icons.HobbitsIcon,
  },
  michel_delving: {
    name: "Michel Delving",
    description: `Chief township of the Shire. Michel Delving was located in the Westfarthing of the Shire on the White Downs. The Mayor of Michel Delving was the Shire's only real government official. His office was in the Town Hole in Michel Delving. The museum known as the Mathom-house was also located in Michel Delving.`,
    url: "https://thainsbook.minastirith.cz/towns.html#Michel%20Delving",
    coords: [44.9464735,-93.3116819],
    icon: icons.HobbitsIcon,
    
  },
  crick_hollow: {
    name: "Crick Hollow",
    description: `Village in Buckland. Crickhollow was a few miles northeast of Bucklebury. It was a quiet, secluded village. `,
    url: "https://tolkiengateway.net/wiki/Crickhollow",
    coords: [44.94648941,-93.31055274],
    icon: icons.HobbitsIcon,
  },
};

export const battles = {
  battle_of_dagorlad: {
    name: "The Battle of Dagorlad (SA 3434 - 3441)",
    description: `In 3434, the armies of the Last Alliance and Sauron met in battle outside the Black Gate of Mordor on the great plain that became known as Dagorlad, the Battle Plain. The army of the Last Alliance consisted of the forces that had marched from the north and the Men of Gondor who had been defending their borders.`,
    url: "https://thainsbook.minastirith.cz/battles.html#Last-Alliance",
    coords: [44.9424929,-93.3001234],
    icon: icons.BattleIcon,
  },
  battle_of_bywater: {
    name: "The Battle of Bywater (TA November 3rd 3019)",
    description: `Battle between Hobbits and Men in the Shire. The Battle of Bywater was the last battle of the War of the Ring. The battle was fought on November 3, 3019 of the Third Age, on the Bywater Road near the village of Bywater.`,
    url: "https://thainsbook.minastirith.cz/battles.html#Battle%20of%20Bywater",
    coords: [44.9465615,-93.3111173],
    icon: icons.BattleIcon,
  },
  battle_of_dale: {
    name: "The Battle of Dale (TA March 15th 3019)",
    description: `Battle in the north during the War of the Ring. The Battle of Dale began on March 15, 3019 of the Third Age. An army of Easterlings allied to Sauron crossed the Redwater and King Brand of Dale was forced to retreat to the foot of the Lonely Mountain.`,
    url: "https://thainsbook.minastirith.cz/battles.html#Dale",
    coords: [44.9479213,-93.3005827],
    icon: icons.BattleIcon,
  },
  battle_of_fornost: {
    name: "The Battle of Fornost (TA 1975)",
    description: `Battle between the forces of the Witch-king of Angmar and the combined forces of the Dunedain of the North, Elves of Lindon and Rivendell, and Men of Gondor.`,
    url: "https://thainsbook.minastirith.cz/battles.html#Fornost",
    coords: [44.9475027,-93.3100271],
    icon: icons.BattleIcon,
  },
  battle_of_greenfields: {
    name: "Battle of Greenfields (TA 2747)",
    description: `Battle between Orcs and Hobbits in the Shire. In the year 2747 of the Third Age, an army of Orcs from Mount Gram led by Golfimbul invaded Greenfields in the Northfarthing.`,
    url: "https://thainsbook.minastirith.cz/battles.html#Battle%20of%20Greenfields",
    coords: [44.9470883,-93.3108774],
    icon: icons.BattleIcon,
  },
  battle_of_helms_deep: {
    name: "Battle of Helm's Deep (TA March 3rd and 4th 3019)",
    description: `Battle between the Men of Rohan and the forces of Saruman during the War of the Ring. The Battle of Helm's Deep was fought during the rainy night of March 3-4, 3019 of the Third Age.`,
    url: "https://thainsbook.minastirith.cz/battles.html#Helm's",
    coords: [44.9422362,-93.3058114],
    icon: icons.BattleIcon,
  },
  battle_of_the_morannon: {
    name: "Battle of the Morannon (TA March 25th 3019)",
    description: `Battle between the Host of the West and the forces of Sauron during the War of the Ring. The Battle of the Morannon took place on March 25, 3019 of the Third Age, in front of the Black Gate of Mordor.`,
    url: "https://thainsbook.minastirith.cz/battles.html#Morannon",
    coords: [44.9422380,-93.3001737],
    icon: icons.BattleIcon,
  },
  battle_of_the_camp: {
    name: "Battle of the Camp (TA July 13th 1944)",
    description: `Battle resulting in the final defeat of the Wainriders. The Battle of the Camp was fought in Ithilien on the night of July 13, 1944 of the Third Age, between the Wainriders and the Southern Army of Gondor led by Earnil.`,
    url: "https://thainsbook.minastirith.cz/battles.html#Battle-Camp",
    coords: [44.9411760,-93.3006287],
    icon: icons.BattleIcon,
  },
  kin_strife: {
    name: "Kin-strife - Civil war in Gondor (TA 1432 to 1448)",
    description: `Civil war in Gondor. The Kin-strife began in 1432 of the Third Age and lasted until 1448. On one side were the loyal supporters of King Eldacar, and on the other side were the rebels led by Castamir. The rebels opposed King Eldacar because he was not of pure Numenorean descent.`,
    url: "https://thainsbook.minastirith.cz/battles.html#Kin-strife",
    coords: [44.94087139,-93.30086638],
    icon: icons.BattleIcon,
  },
  celebrant: {
    name: "Battle of the Field of Celebrant (TA April 15th 2510)",
    description: `Battle where the ancestors of the Rohirrim first came to the aid of Gondor. The Battle of the Field of Celebrant was fought on April 15, 2510 of the Third Age, against the Balchoth - a group of Men from Rhun who were under the influence of Sauron.`,
    url: "https://thainsbook.minastirith.cz/battles.html#Celebrant",
    coords: [44.9439771,-93.3035051],
    icon: icons.BattleIcon,
  },
  five_armies: {
    name: "Battle of the Five Armies (TA 2941)",
    description: `Battle involving Dwarves, Elves, and Men against Orcs and Wargs at the Lonely Mountain. The Battle of the Five Armies was fought late in the year of 2941 of the Third Age in the valley between two great spurs on the southern side of the mountain.`,
    url: "https://thainsbook.minastirith.cz/battles.html#Five_Armies",
    coords: [44.94791343,-93.30077055],
    icon: icons.BattleIcon,
  },
  fords_of_isen: {
    name: "Battles of the Fords of Isen (TA February 25th and March 2nd 3019)",
    description: `The Battles of the Fords of Isen occurred on February 25 and March 2, 3019 of the Third Age. In the first battle, Saruman’s forces ambushed the Rohirrim, mortally wounding Théodred before being driven back by reinforcements. In the second, Saruman’s army launched a larger assault, overwhelming the defenders and forcing them to retreat, leaving the Fords unguarded and clearing the way for the attack on Helm’s Deep.`,
    url: "https://thainsbook.minastirith.cz/battles.html#First-Isen",
    coords: [44.9425148,-93.3064139],
    icon: icons.BattleIcon,
  },
  elves_sauron: {
    name: "War of the Elves and Sauron (SA 1693 to 1701)",
    description: `Battle over the Rings of Power in the Second Age. The War of the Elves and Sauron was fought in Eriador. It lasted from 1693 to 1701 of the Second Age. Sauron suffered a temporary defeat but gained possession of the Nine Rings and six of the Seven Rings.`,
    url: "https://thainsbook.minastirith.cz/battles.html#Elves-Sauron",
    coords: [44.9452681,-93.3069094],
    icon: icons.BattleIcon,
  },
};

export const one_on_one = {
  battle_of_the_peak: {
    name: "Battle of the Peak (TA January 23rd to January 25th 3019)",
    description: `Battle between Gandalf and the Balrog on the Silvertine during the War of the Ring. After Gandalf and the Balrog fell into the abyss in Moria on January 15, 3019 of the Third Age, they fought long underground and then climbed the Endless Stair to the peak of the Silvertine where Durin's Tower stood.`,
    url: "https://thainsbook.minastirith.cz/battles.html#Peak",
    coords: [44.94491777,-93.30559552],
    icon: icons.BattleIcon,
  },
  eowyn_witch_king: {
    name: "Eowyn vs the With King of Angmar (TA March 15th 3019)",
    description: `Battle between Éowyn and the Witch-king of Angmar during the Battle of the Pelennor Fields. On March 15, 3019 of the Third Age, Éowyn, disguised as a soldier, defended Théoden against the Witch-king. After slaying his fell beast, she faced him in combat. With Merry’s aid, she defied prophecy and struck the final blow, destroying him.`,
    url: "https://thainsbook.minastirith.cz/eowyn.html",
    coords: [44.94095898,-93.30106586],
    icon: icons.BattleIcon,
  },
}

export const swords = {
  glamdring: {
    name: "Glamdring",
    description: `Sword of Gandalf. Glamdring was forged in Gondolin, a great realm of the Elves in the First Age. It once belonged to Turgon, the King of Gondolin. It is not known how Glamdring survived the Fall of Gondolin.`,
    url: "https://thainsbook.minastirith.cz/swords.html#Glamdring",
    coords: [44.9468787,-93.3063229],
    icon: icons.GlamdringIcon,
  },
}

export const rings = {
  the_one_ring: {
    name: "The One Ring (SA 1600)",
    description: `The One Ring was the greatest of the Rings of Power. Sauron created it to rule the others, and in order to do so he invested the One Ring with much of his strength and will. `,
    url: "https://thainsbook.minastirith.cz/onering.html",
    coords: [44.9414214,-93.2990178],
    icon: icons.RingIcon,
  },
}
// Icons
const iconUrls = {
    hobbits: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/hobbits.png',
    men_gondor: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/tree_of_gondor.png',
    men_rohan: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/men_rohan.png',
    rivendell: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/rivendell.png',
    lothlorien: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/galadriel.png',
    tent: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/tent.png'
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

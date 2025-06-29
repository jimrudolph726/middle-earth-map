import { 
  createGeographicPopup 
} from "./functions.js";

export const forests = {
  mirkwood: {
    pathName: "mirkwood",
    color: "green",
    name: "Mirkwood",
    PopupContent: createGeographicPopup(
      "Mirkwood",
      "Taur-nu-Fuin",
      `Taur-nu-Fuin means "forest under night." The word taur means "wood, forest"; nu means "down below, underneath"; and fuin means "gloom, darkness."`,
      "Largest continuous forest in Middle-earth during the War of the Ring. King Thranduil's kingdom is located here.",
      "https://tolkiengateway.net/wiki/Mirkwood"
    ),
    tolerance: 1,
    weight: 2,
  },
  old_forest: {
    pathName: "old_forest",
    color: "green",
    name: "The Old Forest",
    PopupContent: createGeographicPopup(
      "The Old Forest",
      "(speculative) Iaur Taur",
      `The name Iaur Taur means "old forest" or "ancient forest" from the word iaur meaning old or ancient, and taur meaning forest. This is purely speculative and noncanonical.`,
      "Forest on the east side of the Brandywine River bordering Buckland.",
      "https://tolkiengateway.net/wiki/Old_Forest"
    ),
    tolerance: 1,
    weight: 2,
  },
  blackwood: {
    pathName: "blackwood",
    color: "green",
    name: "The Blackwood",
    PopupContent: createGeographicPopup(
      "The Blackwood",
      "Eryn Vorn",
      `The name Eryn Vorn means "Dark Wood" from the word eryn meaning "wood" and vorn from morn meaning "dark."`,
      "The Blackwood was a vast ancient treescape that covered most of north-western Middle-earth. It was named 'The Black Wood' by the Númenóreans during the Second Age.",
      "https://tolkiengateway.net/wiki/Eryn_Vorn"
    ),
    tolerance: 1,
    weight: 2,
  },
  fangorn_forest: {
    pathName: "fangorn_forest",
    color: "green",
    name: "Fangorn Forest",
    PopupContent: createGeographicPopup(
      "Fangorn Forest",
      "Fangorn",
      `Fangorn Forest was named for Treebeard, the eldest of the Ents, whose name translates as Fangorn in Sindarin from fanga meaning "beard" and orne meaning "tree." Fangorn Forest was called the Entwood by the Rohirrim.`,
      "Home of the Ents. Fangorn Forest was located at the southeastern end of the Misty Mountains near the Gap of Rohan. The mountains formed the western border of Fangorn. At the end of the mountain range stood the stronghold of Isengard near the southwestern corner of the forest.",
      "https://thainsbook.minastirith.cz/forests.html#Fangorn"
    ),
    tolerance: 1,
    weight: 2,
  },
  lothlorien: {
    pathName: "lothlorien",
    color: "green",
    name: "Lothlorien",
    PopupContent: createGeographicPopup(
      "Lothlorien",
      "Lothlorien",
      `Lothlórien is the name that was used in the later part of the Third Age. It means "dreamflower." The word loth means "blossom, flower." The element lor means "dream."`,
      "Lothlorien was the home of Galadriel and Celeborn and their people, the Galadhrim. It was the only forest of mallorn-trees in Middle-earth, and thus it was known as the Golden Wood. Lothlorien was a place where time seemed to stand still, a waking dream of the ancient days of the Elves that would soon fade forever from Middle-earth.",
      "https://thainsbook.minastirith.cz/lothlorien.html"
    ),
    tolerance: 1,
    weight: 2,
  },
  firien_wood: {
    pathName: "firien_wood",
    color: "green",
    name: "Firien Wood",
    PopupContent: createGeographicPopup(
      "Firien Wood",
      "Eryn Fuir",
      `The older Sindarin name was Eryn Fuir, meaning "North Wood." The word eryn means "wood" and fuir is derived from forn meaning "north." The name Firien Wood comes from the Anglo-Saxon firgen-wudu, meaning "mountain wood."`,
      "Woods on the border between Rohan and Gondor. The Firien Wood was located at the foot of the White Mountains about 100 miles southeast of Edoras.",
      "https://thainsbook.minastirith.cz/forests.html#Firien"
    ),
    tolerance: 1,
    weight: 2,
  },
  druadan_forest: {
    pathName: "druadan_forest",
    color: "green",
    name: "Druadan Forest",
    PopupContent: createGeographicPopup(
      "Druadan Forest",
      "Tawar-in-Druedain",
      `The element Drû in Sindarin was derived from Drughu, the Drúedain's own name for themselves. The word adan means Man; the plural is edain. The word tawar means "wood, forest."`,
      "Forest in Gondor. The Druadan Forest was located in Anorien at the northeastern end of the White Mountains near Minas Tirith.",
      "https://thainsbook.minastirith.cz/forests.html#Dr%C3%BAadan"
    ),
    tolerance: 1,
    weight: 2,
  },
  bindbole_wood: {
    pathName: "bindbole_wood",
    color: "green",
    name: "Bindbole Wood",
    PopupContent: createGeographicPopup(
      "Bindbole Wood",
      "None",
      `None. The name Bindbole Wood has been mistakenly interpreted as Bindbale Wood because of unclear type on some maps of the Shire. The word bole means "tree trunk."`,
      "Woods in the Northfarthing of the Shire, about 15 miles north of Hobbiton.",
      "https://thainsbook.minastirith.cz/forests.html#Bindbole%20Wood"
    ),
    tolerance: 1,
    weight: 2,
  },
  chetwood: {
    pathName: "chetwood",
    color: "green",
    name: "Chetwood",
    PopupContent: createGeographicPopup(
      "Chetwood",
      "None",
      `None. The word Chetwood is a compound of Celtic and English, both words meaning "wood."`,
      "Woods in Eriador outside Bree. The Great East Road ran through the southern edge of the Chetwood, while the Greenway ran along the western edge.",
      "https://thainsbook.minastirith.cz/forests.html#Chetwood"
    ),
    tolerance: 1,
    weight: 2,
  },
};
export const mountain_ranges = {
  misty_mountains: {
    pathName: "misty_mountains",
    color: "orange",
    name: "Misty Mountains",
    PopupContent: createGeographicPopup(
      "Misty Mountains",
      "Hithaeglir",
      'The name Hithaeglir means "Line of Misty Peaks" from hîth meaning "mist" and oeglir meaning "range of mountain peaks."',
      "Largest continuous forest in Middle-earth during the War of the Ring. King Thranduil's kingdom is located here.",
      "https://tolkiengateway.net/wiki/Misty_Mountains"
    ),
    tolerance: 1,
    weight: 2,
  },
  white_mountains: {
    pathName: "white_mountains",
    color: "orange",
    name: "White Mountains",
    PopupContent: createGeographicPopup(
      "White Mountains",
      "Ered Nimrais",
      'The White Mountains were called Ered Nimrais in Sindarin meaning "White-horn Mountains." The word ered means "mountains" from the singular orod. The word nimrais means "white horns" from nim meaning "white" and rais, the plural of ras meaning "horn." The mountains were named for their snow-capped peaks.',
      "Mountain range of Gondor and Rohan. The White Mountains were high and their peaks were covered with snow year-round.",
      "https://tolkiengateway.net/wiki/White_Mountains"
    ),
    tolerance: 1,
    weight: 2,
  },
  ash_mountains: {
    pathName: "ash_mountains",
    color: "orange",
    name: "Ash Mountains",
    PopupContent: createGeographicPopup(
      "Ash Mountains",
      "Ered Lithui",
      'Also called the Ashen Mountains. The Ash Mountains were called Ered Lithui in Sindarin. The word ered means "mountains" and lithui means "ashen." They were so called because of their ash-grey color.',
      "Mountain range on the northern border of Mordor. The Ash Mountains stretched 500 miles from east to west.",
      "https://tolkiengateway.net/wiki/Ered_Lithui"
    ),
    tolerance: 1,
    weight: 2,
  },
  mountains_of_angmar: {
    pathName: "mountains_of_angmar",
    color: "orange",
    name: "Mountains of Angmar",
    PopupContent: createGeographicPopup(
      "Mountains of Angmar",
      "Emyn Angmar",
      'Emyn means "hills", and Angmar is composed of ang meaning "iron" and mar, a lenited form of bar meaning "dwelling."',
      "The Mountains of Angmar were an extension of the Misty Mountains that lay to the west of Mount Gundabad, home to the Witch-king of Angmar who ruled from his capital Carn Dûm on the western tip of the mountain range.",
      "https://tolkiengateway.net/wiki/Mountains_of_Angmar"
    ),
    tolerance: 1,
    weight: 2,
  },
  grey_mountains: {
    pathName: "grey_mountains",
    color: "orange",
    name: "Grey Mountains",
    PopupContent: createGeographicPopup(
      "Grey Mountains",
      "Ered Mithrin",
      `Also called Ered Mithrin in Sindarin from ered, the plural of orod meaning "mountain," and mithrin from mith meaning "grey."`,
      `Mountain range on the northern boundary of Wilderland. At their western end, the Grey Mountains drew near to Mount Gundabad in the Misty Mountains. At their eastern end, the Grey Mountains branched into two forks, between which lay the Withered Heath.`,
      "https://thainsbook.minastirith.cz/mountains.html#Grey%20Mountains"
    ),
    tolerance: 1,
    weight: 2,
  },
  blue_mountains: {
    pathName: "blue_mountains",
    color: "orange",
    name: "Blue Mountains",
    PopupContent: createGeographicPopup(
      "Blue Mountains",
      "Ered Luin",
      `The Blue Mountains were so named because they appeared blue from a distance. The Sindarin name for the Blue Mountains was Ered Luin from ered meaning "mountains" and luin meaning "blue."`,
      `Mountain range in northwestern Middle-earth. The Blue Mountains were on the western border of Eriador.`,
      "https://thainsbook.minastirith.cz/mountains.html#Blue"
    ),
    tolerance: 1,
    weight: 2,
  },
  mountains_of_shadow: {
    pathName: "mountains_of_shadow",
    color: "orange",
    name: "Mountains of Shadow",
    PopupContent: createGeographicPopup(
      "Mountains of Shadow",
      "Ephel Duath",
      `The Mountains of Shadow were so called because of the gloom that hung over them. Also called the Shadowy Mountains. The Sindarin name was Ephel Dúath. The word ephel means "outer fence" and the word dúath means "dark shadow" from dú meaning "night, dimness" and gwath meaning "shadow."`,
      `Great range forming the western and southern borders of Mordor. The Mountains of Shadow were dark and gloomy.`,
      "https://thainsbook.minastirith.cz/mountains.html#Mts-Shadow"
    ),
    tolerance: 1,
    weight: 2,
  },
};
export const mountains = {
  lonely_mountain: {
    pathName: "lonely_mountain",
    color: "brown",
    name: "Lonely Mountain",
    PopupContent: createGeographicPopup(
      "Lonely Mountain",
      "Erebor",
      'The Lonely Mountain was so called because it stood alone and was not part of a mountain range. The name Erebor means "Lonely Mountain." The word ere means "be alone" and ereb means "isolated."',
      "Mountain realm of the Dwarves captured by Smaug the Dragon. The Lonely Mountain was a tall, isolated mountain in the far northeast of Wilderland.",
      "https://tolkiengateway.net/wiki/Lonely_Mountain"
    ),
    tolerance: 1,
    weight: 2,
  },
  mount_gundabad: {
    pathName: "mount_gundabad",
    color: "brown",
    name: "Mount Gundabad",
    PopupContent: createGeographicPopup(
      "Mount Gundabad",
      "None",
      'The name Gundabad is Dwarvish in origin. It is most likely derived from gunud meaning "delve underground, excavate, tunnel" and gundu meaning "underground hall." Also called Gundabad of the North.',
      "Mountain in the Misty Mountains. Mount Gundabad was located in the far northern Misty Mountains, near the western end of the Grey Mountains. ",
      "https://thainsbook.minastirith.cz/mountains.html#Gundabad"
    ),
    tolerance: 1,
    weight: 2,
  },
  mount_gram: {
    pathName: "mount_gram",
    color: "brown",
    name: "Mount Gram",
    PopupContent: createGeographicPopup(
      "Mount Gram",
      "None",
      'Gram in Old English means "fierce, grim" but it is not certain that the name was intended as Old English.',
      "Mountain in the Misty Mountains. In 2747 of the Third Age, a band of Orcs led by Golfimbul came from Mount Gram and invaded the Northfarthing of the Shire. ",
      "https://thainsbook.minastirith.cz/mountains.html#Mount%20Gram"
    ),
    tolerance: 1,
    weight: 2,
  },
  cloudyhead: {
    pathName: "cloudyhead",
    color: "brown",
    name: "Cloudyhead",
    PopupContent: createGeographicPopup(
      "Cloudyhead",
      "Fanuidhol",
      'The Elvish name Fanuidhol translates as "Cloudyhead" in the Common Speech, from fána meaning "cloud" and dôl meaning "head." It is likely that the Dwarvish name Bundushathûr also means "Cloudyhead." The element bund probably means "head"; u may mean "of" or "in"; and shathûr probably means "clouds."',
      "Mountain in the Misty Mountains. Cloudyhead was one of the three Mountains of Moria under which lay the ancient Dwarf realm of Khazad-dum.",
      "https://thainsbook.minastirith.cz/mountains.html#Cloudyhead"
    ),
    tolerance: 1,
    weight: 2,
  },
  redhorn: {
    pathName: "redhorn",
    color: "brown",
    name: "Redhorn",
    PopupContent: createGeographicPopup(
      "Redhorn",
      "Caradhras",
      `The Redhorn was so named because the mountain's peak appeared red in the light of the rising or setting sun. The Sindarin name Caradhras also means "red horn." The word caran means "red." The element ras means "stick up" or "horn".`,
      "Mountain in the Misty Mountains. The Redhorn was one of the three Mountains of Moria under which lay the ancient Dwarf realm of Khazad-dum.",
      "https://thainsbook.minastirith.cz/mountains.html#Redhorn"
    ),
    tolerance: 1,
    weight: 2,
  },
  silvertine: {
    pathName: "silvertine",
    color: "brown",
    name: "Silvertine",
    PopupContent: createGeographicPopup(
      "Silvertine",
      "Celebdil",
      `A tine is a point or prong. Celebdil means "silver point" from celeb meaning "silver" and til or dil meaning "point, horn."`,
      "Mountain in the Misty Mountains. The Silvertine was one of the three Mountains of Moria under which lay the ancient Dwarf realm of Khazad-dum.",
      "https://thainsbook.minastirith.cz/mountains.html#Silvertine"
    ),
    tolerance: 1,
    weight: 2,
  },
  mount_doom: {
    pathName: "mount_doom",
    color: "brown",
    name: "Mount Doom",
    PopupContent: createGeographicPopup(
      "Mount Doom",
      "Orodruin",
      `Orodruin means "Mountain of Blazing Fire" from orod meaning "mountain" and ruin meaning "red flame." Amon Amarth means "Mount Doom" from amon meaning "hill" and amarth meaning "doom."`,
      "Volcanic mountain in Mordor where the One Ring was created and destroyed. Mount Doom stood alone on the plateau of Gorgoroth in northwestern Mordor about 90 miles from the Black Gate. ",
      "https://thainsbook.minastirith.cz/mountains.html#Mount%20Doom"
    ),
    tolerance: 1,
    weight: 2,
  },
  mindolluin: {
    pathName: "mindolluin",
    color: "brown",
    name: "Mindolluin",
    PopupContent: createGeographicPopup(
      "Mindolluin",
      "Celebdil",
      `Mindolluin means "towering blue-head." The element mini means "stand alone, stick out" and mindo means "isolated tower." The word luin means "blue."`,
      "Easternmost mountain of the White Mountains; site of Minas Tirith. Mount Mindolluin was a tall mountain with a snow-capped peak and high glens with deep purple shadows on its slopes.",
      "https://thainsbook.minastirith.cz/mountains.html#Mindolluin"
    ),
    tolerance: 1,
    weight: 2,
  },
};
export const hills = {
  weather_top: {
    pathName: "weather_top",
    color: "red",
    name: "Weather Top",
    PopupContent: createGeographicPopup(
    "Weather Top",
    "Amon Sul",
    `Weathertop was called Amon Sûl in Sindarin. Amon Sûl means "Hill of the Wind" from amon meaning "hill" and sûl meaning "wind." It was also called Weathertop Hill.`,
    `Hills in Eriador. The Weather Hills were located just north of the Great East Road about midway between Bree and the Last Bridge. The Midgewater Marshes were west of the Weather Hills.`,
    "https://thainsbook.minastirith.cz/hills.html#Weathertop"),
    tolerance: 1,
    weight: 2,
  },
  iron_hills: {
    pathName: "iron_hills",
    color: "red",
    name: "Iron Hills",
    PopupContent: createGeographicPopup(
    "Iron Hills",
    "Emyn Angren",
    'The Iron Hills were so called because they were rich in iron ore. The Sindarin name was probably Emyn Engrin from emyn meaning "hills" and engrin the plural of angren meaning "iron".',
    "Range of hills in northeastern Middle-earth. The Iron Hills were isolated in the middle of an empty region about 125 miles east of the Lonely Mountain and Mirkwood.",
    "https://tolkiengateway.net/wiki/Iron_Hills"),
    tolerance: 1,
    weight: 2,
  },
  north_downs: {
    pathName: "north_downs",
    color: "red",
    name: "North Downs",
    PopupContent: createGeographicPopup(
    "North Downs",
    "None",
    'None',
    "Downs in Eriador. The North Downs were located about 100 miles north of Bree, at the end of the North-South Road. The town of Fornost was in the southern end of the North Downs.",
    "https://thainsbook.minastirith.cz/hills.html#North_Downs"),
    tolerance: 1,
    weight: 2,
  },
  weather_hills: {
    pathName: "weather_hills",
    color: "red",
    name: "Weather Hills",
    PopupContent: createGeographicPopup(
    "Weather Hills",
    "None",
    'None',
    "Hills in Eriador. The Weather Hills were located just north of the Great East Road about midway between Bree and the Last Bridge.",
    "https://thainsbook.minastirith.cz/hills.html#Weathertop"),
    tolerance: 1,
    weight: 2,
  },
  south_downs: {
    pathName: "south_downs",
    color: "red",
    name: "South Downs",
    PopupContent: createGeographicPopup(
    "South Downs",
    "None",
    'None',
    "Downs in Eriador. The South Downs were located south of Bree and east of the Barrow-downs. The North-South Road ran through a narrow pass called Andrath between the Barrow-downs and the South Downs.",
    "https://thainsbook.minastirith.cz/hills.html#South_Downs"),
    tolerance: 1,
    weight: 2,
  },
  barrow_downs: {
    pathName: "barrow_downs",
    color: "red",
    name: "Barrow Downs",
    PopupContent: createGeographicPopup(
    "Barrow Downs",
    "Tyrn Gorthad",
    'The word tyrn may mean "downs" or "hills." The word gorth may mean "one who is dead." The ending ad is used for "place." ',
    "Downs east of the Old Forest in Eriador. They were known as the Barrow-downs because of the barrows, or burial mounds, that had been made there.",
    "https://thainsbook.minastirith.cz/hills.html#Barrow-downs"),
    tolerance: 1,
    weight: 2,
  },
  white_downs: {
    pathName: "white_downs",
    color: "red",
    name: "White Downs",
    PopupContent: createGeographicPopup(
    "White Downs",
    "None",
    'None',
    "Downs in the Westfarthing of the Shire. The White Downs were west of Hobbiton and east of the Far Downs. The Free Fair was held on the White Downs at Lithe, or Midsummer. ",
    "https://thainsbook.minastirith.cz/hills.html#White%20Downs"),
    tolerance: 1,
    weight: 2,
  },
  far_downs: {
    pathName: "far_downs",
    color: "red",
    name: "Far Downs",
    PopupContent: createGeographicPopup(
    "Far Downs",
    "None",
    'None',
    "Downs in the Westfarthing of the Shire. Originally the Far Downs formed the western border of the Shire.",
    "https://thainsbook.minastirith.cz/hills.html#Far%20Downs"),
    tolerance: 1,
    weight: 2,
  },
  tower_hills: {
    pathName: "tower_hills",
    color: "red",
    name: "Tower Hills",
    PopupContent: createGeographicPopup(
    "Tower Hills",
    "Emyn Beraid",
    'Also called Emyn Beraid in Sindarin. The word emyn means "hills" and beraid means "towers."',
    "Hills in Eriador west of the Shire. The three White Towers were built in the Tower Hills by Gil-galad for Elendil, and the tallest, Elostirion, housed the palantir of Elendil that looked west across the Sea.",
    "https://thainsbook.minastirith.cz/hills.html#Tower%20Hills"),
    tolerance: 1,
    weight: 2,
  },
  hills_of_evendim: {
    pathName: "hills_of_evendim",
    color: "red",
    name: "Hills of Evendim",
    PopupContent: createGeographicPopup(
    "Hills of Evendim",
    "Emyn Uial",
    `The Hills of Evendim were called Emyn Uial in Sindarin. The word emyn means "hills" and uial means 'twilight." Evendim means "evening twilight."`,
    "Hills in Eriador. The Hills of Evendim were located just north of the Shire. The southern slopes of the Hills of Evendim were the North Moors in the Northfarthing of the Shire.",
    "https://thainsbook.minastirith.cz/hills.html#Tower%20Hills"),
    tolerance: 1,
    weight: 2,
  },
  emyn_muil: {
    pathName: "emyn_muil",
    color: "red",
    name: "Emyn Muil",
    PopupContent: createGeographicPopup(
    "Emyn Muil",
    "Emyn Muil",
    `Emyn Muil is translated as "Drear Hills." The word emyn means "hills." The word muil means "twilight, shadow, vagueness."`,
    "Rugged hills along the Anduin. The Emyn Muil were located on both sides of the river around Nen Hithoel north of the Falls of Rauros.",
    "https://thainsbook.minastirith.cz/hills.html#Emyn%20Muil"),
    tolerance: 1,
    weight: 2,
  },
};
export const rivers = {
  greylin: {
    pathName: 'greylin',
    color: "blue",  // Color is set to blue for every object
    name: "Greylin",
    PopupContent: createGeographicPopup(
      "Greylin",
      "None",
      `The Greylin had no elvish meaning and was named by the Eotheod. The first element is a reference to the river's source in the Grey Mountains, while the second element is derived from the Anglo-Saxon hylnnmeaning "torrent" or "the noisy one."`,
      `River at the source of the Anduin. The Greylin began in the Grey Mountains. It was joined by another stream from the Grey Mountains and flowed south to merge with the Langwell - a river from the Misty Mountains which was the source of the Anduin.`,
      "https://thainsbook.minastirith.cz/rivers.html#Greylin"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  langwell: {
    pathName: 'langwell',
    color: "blue",  // Color is set to blue for every object
    name: "Langwell",
    PopupContent: createGeographicPopup(
      "Langwell",
      "None",
      `The Langwell was named by the local inhabitants, referencing the large stones that lined its bed. The name is derived from the Old Elvish for "long stone."`,
      `The Langwell started in the Misty Mountains and flowed into the Anduin, with several tributaries along its course.`,
      "https://thainsbook.minastirith.cz/rivers.html#Langwell"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  anduin: {
    pathName: 'anduin',
    color: "blue",  // Color is set to blue for every object
    name: "Anduin",
    PopupContent: createGeographicPopup(
      "Anduin",
      "None",
      `The Anduin was the longest and mightiest river in Middle-earth, known as the "Great River." Its name is derived from the Elvish languages.`,
      `The Anduin was the main river in the region, flowing from the Misty Mountains to the Bay of Belfalas. It was the lifeblood of many cultures.`,
      "https://thainsbook.minastirith.cz/rivers.html#Anduin"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  silverlode: {
    pathName: 'silverlode',
    color: "blue",  // Color is set to blue for every object
    name: "Silverlode",
    PopupContent: createGeographicPopup(
      "Silverlode",
      "Celebrant",
      `The Sindarin name of the Silverlode was the Celebrant. The word celeb means "silver" and the word rant means "lode, vein; flow, course of river."`,
      `River of Lothlorien, called the Celebrant by the Elves. The Silverlode began in the Dimrill Dale just south of Mirrormere. The river emerged from a spring fed by the lake's waters.`,
      "https://thainsbook.minastirith.cz/rivers.html#Silverlode"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  nimrodel: {
    pathName: 'nimrodel',
    color: "blue",  // Color is set to blue for every object
    name: "Nimrodel",
    PopupContent: createGeographicPopup(
      "Nimrodel",
      "Nimrodel",
      `The Nimrodel was named for the Elf maiden whose name meant "Lady of the White Grotto," probably in reference to her dwelling place near the waterfall. The element nim means "white" and rod means "cave, grotto."`,
      `River of Lothlorien. The source of the Nimrodel was in the eastern Misty Mountains. The Nimrodel flowed down the wooded mountain slopes and over a waterfall and then joined the Silverlode, a river that ran through Lothlorien to the Anduin.`,
      "https://thainsbook.minastirith.cz/rivers.html#Nimrodel"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  hoarwell: {
    pathName: 'hoarwell',
    color: "blue",  // Color is set to blue for every object
    name: "Hoarwell",
    PopupContent: createGeographicPopup(
      "Hoarwell",
      "Mitheithel",
      `The word Mitheithel comes from the words mith meaning "grey" and eithel meaning "spring, well." The word hoar means "grey."`,
      `River in Eriador. The source of the Hoarwell was in the Ettenmoors on the west side of the northern Misty Mountains. The place where the Hoarwell rose may have been called Hoardale.`,
      "https://thainsbook.minastirith.cz/rivers.html#Hoarwell"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  greyflood: {
    pathName: 'greyflood',
    color: "blue",  // Color is set to blue for every object
    name: "Greyflood",
    PopupContent: createGeographicPopup(
      "Greyflood",
      "Gwaithir/Gwathlo",
      `The original Sindarin name given to the river was Gwaithir meaning "River of Shadow" from gwath meaning "shadow" and hir from sir meaning "river." The name referred to the shadows cast on the river by the dense forest on its banks. Later when the Numenoreans discovered the marshy Swanfleet at the source of the river they changed the name to Gwathló - "the shadowy river from the fens." The element lô is from loga meaning "wet, soaked, swampy."`,
      `River on the southern border of Eriador. North of the Greyflood was the region of Eriador called Minhiriath and south of the Greyflood was an area called Enedwaith.`,
      "https://thainsbook.minastirith.cz/rivers.html#Hoarwell"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  sirannon: {
    pathName: 'sirannon',
    color: "blue",  // Color is set to blue for every object
    name: "Sirannon",
    PopupContent: createGeographicPopup(
      "Sirannon",
      "Sirannon",
      `The name Sirannon means "Gate-stream" from sîr meaning "river" and annon meaning "great door or gate." It was called the Gate-stream in the Common Speech.`,
      `The Gate-stream of Moria, or Khazad-dum. The Sirannon began under the Mountains of Moria and emerged from the base of the Walls of Moria near the West-gate. It flowed through the valley in front of the gate and then cascaded over the Stair Falls.`,
      "https://thainsbook.minastirith.cz/rivers.html#Sirannon"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  glanduin: {
    pathName: 'glanduin',
    color: "blue",  // Color is set to blue for every object
    name: "Glanduin",
    PopupContent: createGeographicPopup(
      "Glanduin",
      "Glanduin",
      `The name Glanduin means "border river" from glan meaning "border" and duin meaning "river." The name was usually applied only to the swift upper course of the river, while the marshy lower course was called Swanfleet. It was also called the Swanfleet river because it was the river that fed the marshlands of Swanfleet.`,
      `River on the southern border of Eriador. The Glanduin began in the Misty Mountains south of Moria and flowed westward.`,
      "https://thainsbook.minastirith.cz/rivers.html#Glanduin"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  forest_river: {
    pathName: 'forest_river',
    color: "blue",  // Color is set to blue for every object
    name: "Forest River",
    PopupContent: createGeographicPopup(
      "Forest River",
      "None",
      `None`,
      `River in Mirkwood. The Forest River began in the Grey Mountains and flowed southeast through Mirkwood to Long Lake. The Enchanted Stream was a tributary of the Forest River in the heart of Mirkwood.`,
      "https://thainsbook.minastirith.cz/rivers.html#Forest%20River"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  river_running: {
    pathName: 'river_running',
    color: "blue",  // Color is set to blue for every object
    name: "River Running",
    PopupContent: createGeographicPopup(
      "River Running",
      "None",
      `None`,
      `Also called the Running River. The Sindarin name is Celduin. The name Celduin is formed from the elements cel or kel meaning "run (especially of water)" and duin meaning "river."`,
      "https://thainsbook.minastirith.cz/rivers.html#River%20Running"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  enchanted_stream: {
    pathName: 'enchanted_stream',
    color: "blue",  // Color is set to blue for every object
    name: "Enchanted Stream",
    PopupContent: createGeographicPopup(
      "Enchanted Stream",
      "None",
      `None`,
      `Stream in Mirkwood. The Enchanted Stream was a tributary of the Forest River. Its source was in the Mountains of Mirkwood, and it flowed north and crossed the path that led from the Forest Gate to the Elven-king's Halls.`,
      "https://thainsbook.minastirith.cz/rivers.html#Enchanted%20Stream"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  redwater: {
    pathName: 'redwater',
    color: "blue",  // Color is set to blue for every object
    name: "Redwater",
    PopupContent: createGeographicPopup(
      "Redwater",
      "Carnen",
      `A possible explanation for the name Redwater is that iron deposits from the Iron Hills may have turned sediment in the riverbed a rusty red color. The Redwater was called the Carnen in Sindarin which means "red water" from caran meaning "red" and nen meaning "water."`,
      `River in northeastern Middle-earth. The Redwater began in the Iron Hills. It flowed south to join the River Running, which in turn flowed into the Sea of Rhun.`,
      "https://thainsbook.minastirith.cz/rivers.html#Redwater"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  entwash: {
    pathName: 'entwash',
    color: "blue",  // Color is set to blue for every object
    name: "Entwash",
    PopupContent: createGeographicPopup(
      "Entwash",
      "Onodlo",
      `The Entwash got its name from the Ents who dwelled in Fangorn. The word wash is from the Old English waesc meaning "flood water." The Sindarin name Onodló translates as "Entwash," from the word Onod meaning "Ent" and ló meaning "soaking wet, swampy, flood."`,
      `River in Fangorn and Rohan. The source of the Entwash was high on the slopes of Methedras, the southernmost of the Misty Mountains. The river flowed southeastward through Fangorn Forest.`,
      "https://thainsbook.minastirith.cz/rivers.html#Entwash"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  loudwater: {
    pathName: 'loudwater',
    color: "blue",  // Color is set to blue for every object
    name: "Loudwater",
    PopupContent: createGeographicPopup(
      "Loudwater",
      "Bruinen",
      `Called the Loudwater in the Common Speech. The name Bruinen means "Loudwater," though the origin of the element brui - apparently meaning "loud, noisy" - is not clear. The element nen means "water."`,
      `River of Rivendell. The Bruinen was a loud, rushing river that came down from the snows of the Misty Mountains. About 50 miles from its source, the Bruinen was joined by a mountain stream.`,
      "https://thainsbook.minastirith.cz/rivers.html#Bruinen"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  river_lune: {
    pathName: 'river_lune',
    color: "blue",  // Color is set to blue for every object
    name: "River Lune",
    PopupContent: createGeographicPopup(
      "River Lune",
      "Lhûn",
      `Called the Lhûn in Sindarin. Lune is a Common Speech adaptation of Lhûn. The word lhûn means "blue" and is apparently an earlier version of luin, the more commonly used word for "blue" as in Ered Luin, the Blue Mountains, from which the Lhûn sprang.`,
      `River in Eriador. The River Lune began in the northeastern Blue Mountains and flowed southward for about 300 miles. The Lune had two tributaries: a river from the Blue Mountains called the Little Lune merged with the Lune from the west, and a river from the Hills of Evendim joined the Lune from the east.`,
      "https://thainsbook.minastirith.cz/rivers.html#Lune"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  brandywine: {
    pathName: 'brandywine',
    color: "blue",  // Color is set to blue for every object
    name: "Brandywine",
    PopupContent: createGeographicPopup(
      "Brandywine",
      "Baranduin",
      `so called the Baranduin in Sindarin. The name Baranduin comes from the words baran meaning "golden brown" and duin meaning "river." The old Hobbit name for the river was Branda-nîn meaning "border water," but Hobbits also jokingly referred to the river as Bralda-hîm meaning "heady ale."`,
      `River in Eriador. The Brandywine originated in Lake Evendim in the north and flowed south-southwest to the Sea. The Brandywine was the eastern border of the Shire.`,
      "https://thainsbook.minastirith.cz/rivers.html#Brandywine"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  erui: {
    pathName: 'erui',
    color: "blue",  // Color is set to blue for every object
    name: "Erui",
    PopupContent: createGeographicPopup(
      "Erui",
      "Erui",
      `The name Erui is composed of er meaning "one, single, alone" and ui which is a common adjectival ending in Sindarin. It was apparently so named because it had no tributaries.`,
      `River in Gondor. The Erui began in the White Mountains. It flowed southeastward through Lossarnach and Lebennin to the Anduin. The road from Minas Tirith to Pelargir passed over the river at the Crossings of Erui. The Erui was a short but swift river.`,
      "https://thainsbook.minastirith.cz/rivers.html#Erui"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
  celos: {
    pathName: 'celos',
    color: "blue", 
    name: "Celos",
    PopupContent: createGeographicPopup(
    "Celos",
    "Celos",
    `Also spelled (and pronounced) Kelos. The Sindarin name Celos is dervied from the Quenya Kelussë meaning "freshet, water falling out swiftly from a rocky spring."`,
    `River in Lebennin in Gondor. The Celos was a tributary of the Sirith. The river began in the White Mountains and flowed southward, joining the Sirith from the west. The Sirith in turn flowed into the Anduin.`,
    "https://thainsbook.minastirith.cz/rivers.html#Celos"),
    tolerance: 10,
    weight: 7
  },
  sirith: {
    pathName: 'sirith',
    color: "blue", 
    name: "Sirith",
    PopupContent: createGeographicPopup(
      "Sirith",
      "Sirith",
      `The name Sirith means "a flowing" from sîr meaning "river."`,
      `River in Lebennin in Gondor. The Sirith began in the White Mountains. It was joined from the west by a tributary called the Celos. The Sirith flowed southward to the Anduin.`,
      "https://thainsbook.minastirith.cz/rivers.html#Sirith"
    ),
    tolerance: 10,
    weight: 7
  },
  gilrain: {
    pathName: 'gilrain',
    color: "blue", 
    name: "Gilrain",
    PopupContent: createGeographicPopup(
      "Gilrain",
      "Gilrain",
      `The element gil means "star, shine." The element rain is derived from ran meaning "wander, stray, go on uncertain course" in reference to the meandering portion of the Gilrain where Nimrodel wandered.`,
      `River in southern Gondor. The Gilrain began in the White Mountains and flowed south through Lebennin.`,
      "https://thainsbook.minastirith.cz/rivers.html#Gilrain"
    ),
    tolerance: 10,
    weight: 7
  },
  serni: {
    pathName: 'serni',
    color: "blue", 
    name: "Serni",
    PopupContent: createGeographicPopup(
      "Serni",
      "Serni",
      `The name Serni is derived from the Sindarin sarn meaning "pebble." Serni is an adjectival form or a collective, like the Quenya sarnie meaning "shingle, pebble bank."`,
      `River of Gondor. The Serni began south of the White Mountains and flowed southwestward through Lebennin.`,
      "https://thainsbook.minastirith.cz/rivers.html#Serni"
    ),
    tolerance: 10,
    weight: 7
  },
  ringlo: {
    pathName: 'ringlo',
    color: "blue", 
    name: "Ringlo",
    PopupContent: createGeographicPopup(
      "Ringlo",
      "Ringlo",
      `The name Ringló means "chill flood" from ring meaning "cold" and lô meaning "soaking wet, swampy, flood." The latter element most likely referred to the spreading floodwaters during the spring thaw in the snowfield at the river's source.`,
      `River in southern Gondor. The source of the Ringlo was in the White Mountains. The waters of the river came from a snowfield high in the mountains that formed a glacial lake.`,
      "https://thainsbook.minastirith.cz/rivers.html#Ringlo"
    ),
    tolerance: 10,
    weight: 7
  },
  ciril: {
    pathName: 'ciril',
    color: "blue", 
    name: "Ciril",
    PopupContent: createGeographicPopup(
      "Ciril",
      "Ciril",
      `Also spelled (and pronounced) Kiril. The name Ciril is derived from kir meaning "cut."`,
      `River in Lamedon in Gondor. The Ciril was a tributary of the Ringlo. It began in the White Mountains near Tarlang's Neck and flowed at first through a deep rocky channel.`,
      "https://thainsbook.minastirith.cz/rivers.html#Ciril"
    ),
    tolerance: 10,
    weight: 7
  },
  blackroot: {
    pathName: 'blackroot',
    color: "blue", 
    name: "Blackroot",
    PopupContent: createGeographicPopup(
      "Blackroot",
      "Morthond",
      `The Blackroot was so named because its source was in the dark caverns of the Dead. The river was called Morthond in Sindarin, meaning "Blackroot" from mor meaning "black" and thond meaning "root."`,
      `River in Gondor. The Blackroot was a long, cold river that began beneath the White Mountains. The river emerged from the southern entrance of the Paths of the Dead and cascaded in a series of waterfalls into the Blackroot Vale.`,
      "https://thainsbook.minastirith.cz/rivers.html#Blackroot"
    ),
    tolerance: 10,
    weight: 7
  },
  lefnui: {
    pathName: 'lefnui',
    color: "blue", 
    name: "Lefnui",
    PopupContent: createGeographicPopup(
      "Lefnui",
      "Lefnui",
      `The name Lefnui means "fifth." The river was so named because it was the fifth river or river system in southern Gondor after the Erui, the Sirith-Celos, the Serni-Gilrain, and the Morthond-Ciril-Ringlo.`,
      `River in Gondor. The Lefnui flowed southward from the White Mountains to the Bay of Belfalas.`,
      "https://thainsbook.minastirith.cz/rivers.html#Lefnui"
    ),
    tolerance: 10,
    weight: 7
  },
  adorn: {
    pathName: 'adorn',
    color: "blue", 
    name: "Adorn",
    PopupContent: createGeographicPopup(
      "Adorn",
      "Adorn",
      `None. The name Adorn was of pre-Numenorean origin adapted to Sindarin. The meaning cannot be interpreted.`,
      `River in Rohan. The Adorn flowed northwest from its source in the White Mountains to join the River Isen. Together the Adorn and the Isen formed the far western boundary of Rohan.`,
      "https://thainsbook.minastirith.cz/rivers.html#Adorn"
    ),
    tolerance: 10,
    weight: 7
  },
  isen: {
    pathName: 'isen',
    color: "blue", 
    name: "Isen",
    PopupContent: createGeographicPopup(
      "Isen",
      "Sîr Angren",
      `The name Isen means "iron" in the language of Rohan, from the Old English word ísen. The Sindarin name was Sîr Angren, from sîr meaning "river" and angren meaning "iron."`,
      `River in Gondor. The Lefnui flowed southward from the White Mountains to the Bay of Belfalas.`,
      "https://thainsbook.minastirith.cz/rivers.html#Isen"
    ),
    tolerance: 10,
    weight: 7
  },
  the_water: {
    pathName: 'the_water',
    color: "blue", 
    name: "The Water",
    PopupContent: createGeographicPopup(
      "The Water",
      "None",
      `None. The Water was a shortening of the river's full name, the Shire-water.`,
      `River in the Shire. The Water began north of Needlehole, possibly in the North Moors. Below Needlehole in Rushock Bog, the Water branched into two streams and then rejoined. `,
      "https://thainsbook.minastirith.cz/rivers.html#The%20Water"
    ),
    tolerance: 10,
    weight: 7
  },
  withywindle: {
    pathName: 'withywindle',
    color: "blue", 
    name: "Withywindle",
    PopupContent: createGeographicPopup(
      "Withywindle",
      "None",
      `None. The word withy means "willow" and windle means "spindle" or "reel."`,
      `River in the Old Forest in Eriador. The Withywindle valley was said to be the heart of all the strange happenings in the Old Forest. The Withywindle began in the Barrow-downs and flowed southwest through the Old Forest to join the Brandywine.`,
      "https://thainsbook.minastirith.cz/rivers.html#Withywindle"
    ),
    tolerance: 10,
    weight: 7
  },
  poros: {
    pathName: 'poros',
    color: "blue", 
    name: "Poros",
    PopupContent: createGeographicPopup(
      "Poros",
      "Poros",
      `The meaning of Poros is not known. It may contain the element ros meaning "foam."`,
      `River on the southern border of Ithilien. The Poros flowed westward from the Mountains of Shadow on the border of Mordor to the Anduin.`,
      "https://thainsbook.minastirith.cz/rivers.html#Poros"
    ),
    tolerance: 10,
    weight: 7
  },
  harnen: {
    pathName: 'harnen',
    color: "blue", 
    name: "Harnen",
    PopupContent: createGeographicPopup(
      "Harnen",
      "Harnen",
      `The name Harnen means "south water" from harad meaning "south" and nen meaning "water."`,
      `River on the border between Harad and South Gondor. The Harnen began in the Mountains of Shadow on the southern border of Mordor.`,
      "https://thainsbook.minastirith.cz/rivers.html#Harnen"
    ),
    tolerance: 10,
    weight: 7
  },
  gladden: {
    pathName: 'gladden',
    color: "blue", 
    name: "Gladden",
    PopupContent: createGeographicPopup(
      "Gladden",
      "Sîr Ninglor",
      `The word gladden is from the Anglo-Saxon glædene, meaning "iris," referring to the yellow irises that grew in the Gladden Fields. The word sîr means "river" and ninglor means "golden waters" from nin meaning "waters" and glor or glaur meaning "gold."`,
      `River of Wilderland. The Gladden began on the east side of the Misty Mountains. There was a pass over the mountains near its source. `,
      "https://thainsbook.minastirith.cz/rivers.html#Gladden"
    ),
    tolerance: 10,
    weight: 7
  },
  limlight: {
    pathName: 'limlight',
    color: "blue", 
    name: "Limlight",
    PopupContent: createGeographicPopup(
      "Limlight",
      "Limlight",
      `The Sindarin word lim has the meaning "swift" as in "noro lim" which Tolkien translated in unpublished notes as "run swift." Thus Limlight could mean "swift light" as one source indicates.`,
      `River on the northern border of Rohan. The Limlight began in the Misty Mountains and flowed eastward.`,
      "https://thainsbook.minastirith.cz/rivers.html#Limlight"
    ),
    tolerance: 10,
    weight: 7
  },
  mering_stream: {
    pathName: 'mering_stream',
    color: "blue", 
    name: "Mering Stream",
    PopupContent: createGeographicPopup(
      "Mering Stream",
      "Glanhír",
      `The name Mering Stream means "boundary stream" from the Old English maere or mere meaning "boundary." The Sindarin name for the Mering Stream was Glanhír, also meaning "boundary stream" from glan meaning "boundary, border" and hir from sîr meaning "river, stream."`,
      "Stream on the border between Rohan and Gondor.",
      "https://thainsbook.minastirith.cz/rivers.html#Mering"
    ),
    tolerance: 10,
    weight: 7
  },
  snowbourn: {
    pathName: 'snowbourn',
    color: "blue", 
    name: "Snowbourn",
    PopupContent: createGeographicPopup(
      "Snowbourn",
      "None",
      `None`,
      `River in Rohan. The Snowbourn began under the Starkhorn in the White Mountains and flowed north through the valley of Harrowdale past the villages of Underharrow and Upbourn.`,
      "https://thainsbook.minastirith.cz/rivers.html#Snowbourn"
    ),
    tolerance: 10,
    weight: 7
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
  mirrormere: {
    pathName: 'mirrormere',
    color: "blue", 
    name: "Mirrormere",
    PopupContent: createGeographicPopup(
      "Mirrormere",
      "Nen Cenedril",
      `Mirrormere was so-called because of the lake's reflective surface. Mere is an archaic word for lake. The Dwarves called the lake Kheled-zâram meaning "glass pool." The Dwarvish word kheled means "glass" and the word zâram means "pool." The Elvish name was Nen Cenedril which means "Lake Looking-glass" in Sindarin.`,
      `Lake in the Dimrill Dale east of Khazad-dum.`,
      "https://thainsbook.minastirith.cz/lakes.html#Mirrormere"
    ),
    tolerance: 1,
    weight: 2
  },
};
export const wetlands = {
  dead_marshes: {
    pathName: 'dead_marshes',
    color: "brown", 
    name: "Dead Marshes",
    PopupContent: createGeographicPopup(
      "Dead Marshes",
      `None`,
      `None`,
      `Marshes near Mordor. The Dead Marshes were a vast network of pools, mires, and waterways east of the Emyn Muil. The wetlands were fed by many small rivers that ran down from the hills.`,
      "https://thainsbook.minastirith.cz/marshes.html#Dead"
    ),
    tolerance: 1,
    weight: 2
  },
  wetwang: {
    pathName: 'wetwang',
    color: "brown", 
    name: "Wetwang",
    PopupContent: createGeographicPopup(
      "Wetwang",
      "Nindalf",
      `The word wang means "field, flat area." Nindalf is the Sindarin name from nîn meaning "wet" and talf meaning "flat field."`,
      `Marshland at the mouth of the Entwash. The Wetwang was a wide region of fens located where the Entwash flowed into the Anduin just below the Falls of Rauros.`,
      "https://thainsbook.minastirith.cz/marshes.html#Wetwang"
    ),
    tolerance: 1,
    weight: 2
  },
  midgewater_marshes: {
    pathName: 'midgewater_marshes',
    color: "brown", 
    name: "Midgewater Marshes",
    PopupContent: createGeographicPopup(
      "Midgewater Marshes",
      "None",
      `None. The Midgewater Marshes are named for the small insects called midges that lived there.`,
      `Marshes in Eriador. The Midgewater Marshes were east of Bree. The Chetwood was on the western side of the marshes and the Weather Hills were on the east. The Great East Road curved around the southern edge of the Midgewater Marshes.`,
      "https://thainsbook.minastirith.cz/marshes.html#Midgewater%20Marshes"
    ),
    tolerance: 1,
    weight: 2
  },
  overbourn_marshes: {
    pathName: 'overbourn_marshes',
    color: "brown", 
    name: "Overbourn Marshes",
    PopupContent: createGeographicPopup(
      "Overbourn Marshes",
      "None",
      `None. A bourn is a small stream or brook. The Overbourn Marshes may have been so named because they were across the Shirebourn from the most populous part of the Eastfarthing. Or the first element may come from the Old English ofer meaning "border, riverbank."`,
      `Marshes in the Shire. The Overbourn Marshes were in the Southfarthing south of the River Shirebourn where it flowed into the Brandywine River.`,
      "https://thainsbook.minastirith.cz/marshes.html#Overbourn%20Marshes"
    ),
    tolerance: 1,
    weight: 2
  },
  rushock_bog: {
    pathName: 'rushock_bog',
    color: "brown", 
    name: "Rushock Bog",
    PopupContent: createGeographicPopup(
      "Rushock Bog",
      "None",
      `None. The name Rushock is composed of rush - a plant commonly found in swamplands - and hassock or "coarse grass."`,
      `Bog in the Shire. Rushock Bog was in the Westfarthing south of the village of Needlehole. The bog was located along the Water at a point where the river branched into two streams.`,
      "https://thainsbook.minastirith.cz/marshes.html#Rushock%20Bog"
    ),
    tolerance: 1,
    weight: 2
  },
  swanfleet: {
    pathName: 'swanfleet',
    color: "brown", 
    name: "Swanfleet",
    PopupContent: createGeographicPopup(
      "Swanfleet",
      "Nin-in-Eilph",
      `The word fleet is an archaic term for an estuary - the mouth of a river - from the Old English fleot. The Sindarin name was Nîn-in-Eilph meaning "waterlands of the swans." The word nîn means "waters." The word eilph is the plural of alph meaning "swan."`,
      `Wetlands on the southern border of Eriador. Swanfleet was a region of swamps, pools, and eyots - or small islands. Many water birds lived there among the reeds, particularly swans.`,
      "https://thainsbook.minastirith.cz/marshes.html#Swanfleet"
    ),
    tolerance: 1,
    weight: 2
  },
  long_marshes: {
    pathName: 'long_marshes',
    color: "brown", 
    name: "Long Marshes",
    PopupContent: createGeographicPopup(
      "Long Marshes",
      "None",
      `None`,
      `The Long Marshes were a region of marshes and pools dotted with isles that flanked both sides of the Forest River. They extended from the eastern edge of Mirkwood nearly to the shores of the Long Lake.`,
      "https://tolkiengateway.net/wiki/Long_Marshes"
    ),
    tolerance: 1,
    weight: 2
  },
  gladden_fields: {
    pathName: 'gladden_fields',
    color: "brown", 
    name: "Gladden Fields",
    PopupContent: createGeographicPopup(
      "Gladden Fields",
      "Loeg Ningloron",
      `The word gladden is from the Anglo-Saxon glædene, meaning "iris," referring to the yellow irises that grew in the Gladden Fields. Called Loeg Ningloron in Sindarin, meaning "pools of the golden water-flowers." The word loeg is probably derived from the stem log meaning "wet, soaked, swampy." The word ninglor means "golden waters" from nin meaning "waters" and glor or glaur meaning "gold."`,
      `Marshes on the banks of the Anduin. The Gladden Fields were located around the mouth of the Gladden River where it flowed into the Anduin from the west. `,
      "https://thainsbook.minastirith.cz/marshes.html#Gladden"
    ),
    tolerance: 1,
    weight: 2
  },
};
export const large_regions = {
  eriador: {
    pathName: 'eriador',
    color: "brown", 
    name: "Eriador",
    PopupContent: createGeographicPopup(
      "Eriador",
      `Eriador`,
      `Eriador means "lonely land" or "wilderness." The element er means "one, alone." The element dor means "land."`,
      `Eriador was a large region in northwestern Middle-earth between the Misty Mountains and the Blue Mountains. The Glanduin and Greyflood rivers formed the southern boundary of Eriador.`,
      "https://thainsbook.minastirith.cz/eriador.html"
    ),
    tolerance: 1,
    weight: 2
  },
  wilderland: {
    pathName: 'wilderland',
    color: "brown", 
    name: "Wilderland",
    PopupContent: createGeographicPopup(
      "Wilderland",
      `Rhovanion`,
      `Rhovanion is a Sindarin name meaning "Wilderland." The word rhovan apparently means "wild." The name Rhovanion applied to the entire region of Wilderland.`,
      `Wilderland stretched from the Misty Mountains to the River Running and the Sea of Rhun. East of Wilderland was Rhun.`,
      "https://thainsbook.minastirith.cz/wilderland.html"
    ),
    tolerance: 1,
    weight: 2
  },
  rohan: {
    pathName: 'rohan',
    color: "brown", 
    name: "Rohan",
    PopupContent: createGeographicPopup(
      "Rohan",
      `Rohan`,
      `Rohan means "horse land" from the Sindarin roch meaning "horse" and the ending -and denoting a country or region.`,
      `Rohan was the home of the Rohirrim - a hardy race of Men known for their love of horses. The land was once part of Gondor, but it was given to the Rohirrim when Eorl the Young led them from the North to help Gondor fight an enemy invasion.`,
      "https://thainsbook.minastirith.cz/rohan.html"
    ),
    tolerance: 1,
    weight: 2
  },
  gondor: {
    pathName: 'gondor',
    color: "brown", 
    name: "Gondor",
    PopupContent: createGeographicPopup(
      "Gondor",
      `Gondor`,
      `The name Gondor means "stone land" from gond meaning "stone" and dor, ndor meaning "land." The land was so named because of the great cities and works of stone built there by the survivors of Numenor.`,
      `Gondor was the greatest kingdom of Men in Middle-earth. It was founded by the survivors of Numenor - Elendil and his sons Isildur and Anarion.`,
      "https://thainsbook.minastirith.cz/gondor.html"
    ),
    tolerance: 1,
    weight: 2
  },
  mordor: {
    pathName: 'mordor',
    color: "brown", 
    name: "Mordor",
    PopupContent: createGeographicPopup(
      "Mordor",
      `Mordor`,
      `Mordor means "Black Land" from mor meaning "dark, black" and dor meaning "land." Mordor was often referred to as the Black Land in the Common Speech, as well as the Dark Country and the Land of Shadow.`,
      `Mordor was the realm of the Dark Lord Sauron. It was a terrible land of darkness and fear, inhabited by Orcs and other evil creatures`,
      "https://thainsbook.minastirith.cz/mordor.html"
    ),
    tolerance: 1,
    weight: 2
  },
  rhun: {
    pathName: 'rhun',
    color: "brown", 
    name: "Rhun",
    PopupContent: createGeographicPopup(
      "Rhun",
      `Rhun`,
      `The name Rhûn means "east" in Sindarin.`,
      `Rhun was the name of the uncharted lands in far eastern Middle-earth. A race of Men called the Easterlings lived in Rhun.`,
      "https://thainsbook.minastirith.cz/rhun.html"
    ),
    tolerance: 1,
    weight: 2
  },
  forodwaith: {
    pathName: 'forodwaith',
    color: "brown", 
    name: "Forodwaith",
    PopupContent: createGeographicPopup(
      "Forodwaith",
      `Forodwaith`,
      `The name Forodwaith means both "north region" and "north people" in Sindarin. The word forod means "north." The element waith is from gwaith which means "people" but is also used for regions.`,
      `The Northern Waste. Forodwaith was located in the far north of Middle-earth. The region was bordered on the south by the Grey Mountains and the northern end of the Misty Mountains, and it extended north as far as the Sea.`,
      "https://thainsbook.minastirith.cz/lands.html#Forodwaith"
    ),
    tolerance: 1,
    weight: 2
  },
};
export const sub_regions = {
  enedwaith: {
    pathName: 'enedwaith',
    color: "brown", 
    name: "Enedwaith",
    PopupContent: createGeographicPopup(
      "Enedwaith",
      `Enedwaith`,
      `Also spelled Enedhwaith. The name Enedwaith means "middle folk" or "middle region" in Sindarin from enedh meaning "middle" and waith from gwaith which means "people" but is also used for regions. `,
      `Region south of Eriador. Enedwaith was located between the Misty Mountains and the Sea.`,
      "https://thainsbook.minastirith.cz/lands.html#Enedwaith"
    ),
    tolerance: 1,
    weight: 2
  },
  eregion: {
    pathName: 'eregion',
    color: "brown", 
    name: "Eregion",
    PopupContent: createGeographicPopup(
      "Eregion",
      `Eregion`,
      `The name Eregion means "Land of Holly" from ereg meaning "holly tree" and the ending -ion which appears to denote "land of." The Common Speech name was Hollin.`,
      `Realm of the Elven-smiths who forged the Rings of Power. Eregion was located in Eriador along the western side of the Misty Mountains. `,
      "https://thainsbook.minastirith.cz/lands.html#Eregion"
    ),
    tolerance: 1,
    weight: 2
  },
  harlindon: {
    pathName: 'harlindon',
    color: "brown", 
    name: "Harlindon",
    PopupContent: createGeographicPopup(
      "Harlindon",
      `Harlindon`,
      `Harlindon means South Lindon in Sindarin, from har(ad), meaning south, and lindon as a noun.`,
      `Harlindon was a green and fair elvish land on the north-western shores of Middle-earth. It was located west of the Blue Mountains and south of the Gulf of Lune, which divided Lindon into the northern Forlindon and the southern Harlindon.`,
      "https://tolkiengateway.net/wiki/Harlindon"
    ),
    tolerance: 1,
    weight: 2
  },
  minhiriath: {
    pathName: 'minhiriath',
    color: "brown", 
    name: "minhiriath",
    PopupContent: createGeographicPopup(
      "Minhiriath",
      `Minhiriath`,
      `The name Minhiriath means "between the rivers" in Sindarin in reference to the Brandywine and Greyflood. The word min means "between" and hiriath is from siriath meaning "rivers."`,
      `Region of southern Eriador. Minhiriath was located between the Brandywine River on its northern border and the Greyflood on its southern border.`,
      "https://thainsbook.minastirith.cz/lands.html#Minhiriath"
    ),
    tolerance: 1,
    weight: 2
  },
  forlindon: {
    pathName: 'forlindon',
    color: "brown", 
    name: "forlindon",
    PopupContent: createGeographicPopup(
      "Forlindon",
      `Forlindon`,
      `The name Forlindon likely means "North Lindon", apparently derived from forn (Sindarin; "right, north") + lindon.`,
      `Forlindon was a name for the northern part of Lindon, north of the Gulf of Lune and west of the Blue Mountains. The land was traversed by a river which ended on the northern shore of the Gulf; the haven of Forlond was built there, on its mouths.`,
      "https://tolkiengateway.net/wiki/Forlindon"
    ),
    tolerance: 1,
    weight: 2
  },
  cardolan: {
    pathName: 'cardolan',
    color: "brown", 
    name: "cardolan",
    PopupContent: createGeographicPopup(
      "Cardolan",
      `Cardolan`,
      `Several authors suggest Cardolan means "red hill country", "land of red hills" or "Red Hill Land" and is a compound of caran ("red"), dol ("hill") and -(i)an(d) ("land").`,
      `Cardolan was a breakaway realm of the Dúnedain kingdom of Arnor. After the death of Arnor's King Eärendur, his sons divided the realm into the kingdoms of Arthedain, Rhudaur and Cardolan.`,
      "https://tolkiengateway.net/wiki/Cardolan"
    ),
    tolerance: 1,
    weight: 2
  },
};
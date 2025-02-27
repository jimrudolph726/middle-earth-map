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
};
export const wetlands = {
  dead_marshes: {
    pathName: 'dead_marshes',
    color: "brown", 
    name: "Dead Marshes",
    PopupContent: createGeographicPopup(
      "Dead Marshes",
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
      "None"
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
      "Nin-in-Eilph"
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
      "https://thainsbook.minastirith.cz/marshes.html#Swanfleet"
    ),
    tolerance: 1,
    weight: 2
  },
};
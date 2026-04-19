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
      "The Mountains of Mithrim or the Hills of Mithrim were a range of mountains located in Hithlum. They formed the border between Mithrim and Dor-lómin.",
      "https://tolkiengateway.net/wiki/Mountains_of_Mithrim#:~:text=The%20Mountains%20of%20Mithrim%20or,the%20Noldor%20settled%20in%20Hithlum."
    ),
    tolerance: 1,
    weight: 2,
  },
    ered_wethrin: {
    pathName: "ered_wethrin",
    color: "orange",
    name: "Ered Wethrin",
    PopupContent: createGeographicPopup(
      "Ered Wethrin",
      "Ered Wethrin",
      'Ered Wethrin is Sindarin for "Shadowy Mountains". It consists of ered ("mountains") and gwethrin ("shadowy").',
      "The Ered Wethrin, or the Mountains of Shadow, was a mountain range in the north of Beleriand in the First Age.",
      "https://tolkiengateway.net/wiki/Mountains_of_Mithrim#:~:text=The%20Mountains%20of%20Mithrim%20or,the%20Noldor%20settled%20in%20Hithlum."
    ),
    tolerance: 1,
    weight: 2,
  },
    ered_luin: {
    pathName: "ered_luin",
    color: "orange",
    name: "Ered Luin",
    PopupContent: createGeographicPopup(
      "Ered Luin",
      "Ered Luin",
      'The Blue Mountains were so named because they appeared blue from a distance. The Sindarin name for the Blue Mountains was Ered Luin from ered meaning "mountains" and luin meaning "blue."',
      "Mountain range in northwestern Middle-earth. The Blue Mountains were on the western border of Eriador. The geography of the Blue Mountains changed during the War of Wrath at the end of the First Age.",
      "https://thainsbook.minastirith.cz/mountains.html#Blue"
    ),
    tolerance: 1,
    weight: 2,
  },
    ered_lomin: {
    pathName: "ered_lomin",
    color: "orange",
    name: "Ered Lomin",
    PopupContent: createGeographicPopup(
      "Ered Lomin",
      "Ered Lomin",
      'The name Ered Lómin means "Echoing Mountains." The word ered means "mountains" in Sindarin and the word lómen means "echoing" in the Doriathrin dialect. Also called the Echoing Hills. The mountains were so named because they resonated and magnified noises, particularly around the region of Lammoth.',
      "Mountain range on the western border of Hithlum. The Ered Lomin were located on the western shore of Middle-earth. At their southern end, the Ered Lomin joined the Ered Wethrin, which formed the southern and eastern borders of Hithlum.",
      "https://thainsbook.minastirith.cz/mountains.html#Ered-Lomin"
    ),
    tolerance: 1,
    weight: 2,
  },
    ered_gorgoroth: {
    pathName: "ered_gorgoroth",
    color: "orange",
    name: "Ered Gorgoroth",
    PopupContent: createGeographicPopup(
      "Ered Gorgoroth",
      "Ered Gorgoroth",
      'The name Ered Gorgoroth means "Mountains of Terror." The word ered means "mountains" in Sindarin and the word gorgoroth means "terror".',
      `The Ered Gorgoroth or Mountains of Terror were a mountain chain in the north of Beleriand. The Ered Gorgoroth was the southern edge of the highlands of Dorthonion, and separated Dorthonion from Beleriand proper.`,
      "https://thainsbook.minastirith.cz/mountains.html#Ered-Lomin"
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
      "Gelion",
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
      "Gelion",
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
      "Gelion",
      `In one source (HoME IV, p. 210), Tolkien equated the name Gelion with the Old English word glæden meaning "iris," but this is not a translation from Elvish.`,
      `River on the western border of Ossiriand. The Gelion was the longest river in Beleriand. It was twice the length of the Sirion, which would make the Gelion approximately 780 miles long.`,
      "https://tolkiengateway.net/wiki/Little_Gelion"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_ascar: {
    pathName: 'river_ascar',
    color: "blue",  // Color is set to blue for every object
    name: "River Ascar",
    PopupContent: createGeographicPopup(
      "River Ascar",
      "Ascar",
      `The name Ascar means "rushing, impetuous" in Sindarin, derived from the root A-SKAR. It was later named Rathlóriel meaning "golden riverbed" from rath meaning "course, riverbed" and gloriel meaning "golden."`,
      `One of the Seven Rivers of Ossiriand. The Ascar formed the northern border of Ossiriand, a region in East Beleriand.`,
      "https://tolkiengateway.net/wiki/Little_Gelion"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_adurant: {
    pathName: 'river_adurant',
    color: "blue",  // Color is set to blue for every object
    name: "River Adurant",
    PopupContent: createGeographicPopup(
      "River Adurant",
      "Adurant",
      `The name Adurant means "double stream" in reference to the way it branched around Tol Galen. The word adu means "double" in Ilkorin, an early form of Elvish, and rant means "course, riverbed" in Sindarin.`,
      `One of the Seven Rivers of Ossiriand. The Adurant was the southernmost tributary of the Gelion.`,
      "https://thainsbook.minastirith.cz/rivers.html#Adurant"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_duilwen: {
    pathName: 'river_duilwen',
    color: "blue",  // Color is set to blue for every object
    name: "River Duilwen",
    PopupContent: createGeographicPopup(
      "River Duilwen",
      "Duilwen",
      `Duilwen can probably be considered as a Sindarin name,[2] but was originally conceived as Ilkorin by Tolkien, consisting of the Ilkorin elements duil ("river") and gwene ("green").`,
      `The Duilwen was one of the six rivers that flowed west through Ossiriand to meet Gelion. The Duilwen was the last-but-one of these to flow into the great south-flowing river; only the Adurant was further south.`,
      "https://tolkiengateway.net/wiki/Duilwen"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_brilthor: {
    pathName: 'river_brilthor',
    color: "blue",  // Color is set to blue for every object
    name: "River Brilthor",
    PopupContent: createGeographicPopup(
      "River Brilthor",
      "Brilthor",
      `The name Brilthor means "glittering torrent" from the root ril meaning "glitter" and thor meaning "come swooping down" and thorod meaning "torrent." The name may be in the dialect of the Green-elves of Ossiriand.`,
      `One of the Seven Rivers of Ossiriand. The Brilthor was the fourth of the six tributaries of the Gelion.`,
      "https://thainsbook.minastirith.cz/rivers.html#Brilthor"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_legolin: {
    pathName: 'river_legolin',
    color: "blue",  // Color is set to blue for every object
    name: "River Legolin",
    PopupContent: createGeographicPopup(
      "River Legolin",
      "Legolin",
      `The name Legolin contains the word legol meaning "nimble, active, running free" in the early Elvish language Ilkorin.`,
      `One of the Seven Rivers of Ossiriand. The Legolin was the third of the six tributaries of the Gelion. `,
      "https://thainsbook.minastirith.cz/rivers.html#Legolin"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_thalos: {
    pathName: 'river_thalos',
    color: "blue",  // Color is set to blue for every object
    name: "River Thalos",
    PopupContent: createGeographicPopup(
      "River Thalos",
      "Thalos",
      `The name comes from the Ilkorin word thalos ("torrent") used as a name.`,
      `Thalos was the second of the six rivers that rushed down from the Blue Mountains through Ossiriand to meet the great River Gelion, between the rivers Ascar and the Legolin.`,
      "https://tolkiengateway.net/wiki/Thalos#:~:text=Thalos%20was%20the%20second%20of,rivers%20Ascar%20and%20the%20Legolin."
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_celon: {
    pathName: 'river_celon',
    color: "blue",  // Color is set to blue for every object
    name: "River Celon",
    PopupContent: createGeographicPopup(
      "River Celon",
      "Celon",
      `The name Celon means "stream flowing down from heights" from the root kel meaning "go, run (especially water)."`,
      `River in East Beleriand. The Celon was a tributary of the Aros. It was a narrow river with clear waters.`,
      "https://tolkiengateway.net/wiki/Thalos#:~:text=Thalos%20was%20the%20second%20of,rivers%20Ascar%20and%20the%20Legolin."
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_celon: {
    pathName: 'river_celon',
    color: "blue",  // Color is set to blue for every object
    name: "River Celon",
    PopupContent: createGeographicPopup(
      "River Celon",
      "Celon",
      `The name Celon means "stream flowing down from heights" from the root kel meaning "go, run (especially water)."`,
      `River in East Beleriand. The Celon was a tributary of the Aros. It was a narrow river with clear waters.`,
      "https://tolkiengateway.net/wiki/Thalos#:~:text=Thalos%20was%20the%20second%20of,rivers%20Ascar%20and%20the%20Legolin."
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_aros: {
    pathName: 'river_aros',
    color: "blue",  // Color is set to blue for every object
    name: "River Aros",
    PopupContent: createGeographicPopup(
      "River Aros",
      "Aros",
      `The word Aros, derived from the Elvish root YAR- ("blood"), is said to be a "name of river with reddish water". The Noldorin form of the word was iaros.`,
      `Aros was a river of East Beleriand that formed much of the border of the Kingdom of Doriath.`,
      "https://tolkiengateway.net/wiki/Thalos#:~:text=Thalos%20was%20the%20second%20of,rivers%20Ascar%20and%20the%20Legolin."
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_esgalduin: {
    pathName: 'river_esgalduin',
    color: "blue",  // Color is set to blue for every object
    name: "River Esgalduin",
    PopupContent: createGeographicPopup(
      "River Esgalduin",
      "Esgalduin",
      `The name Esgalduin means "River under Veil" from esgal meaning "screen, hiding, roof of leaves" and duin meaning "river."`,
      `River of Doriath. The Esgalduin divided the Forest of Neldoreth from the Forest of Region. It was a dark, enchanted river.`,
      "https://thainsbook.minastirith.cz/rivers.html#Esgalduin"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_mindeb: {
    pathName: 'river_mindeb',
    color: "blue",  // Color is set to blue for every object
    name: "River Mindeb",
    PopupContent: createGeographicPopup(
      "River Mindeb",
      "Mindeb",
      `The name Mindeb is Sindarin and has no clear etymology; it is speculated to translate as “Shadowed Isolated”.`,
      `River of Doriath. The Esgalduin divided the Forest of Neldoreth from the Forest of Region. It was a dark, enchanted river.`,
      "https://tolkiengateway.net/wiki/Mindeb"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_sirion: {
    pathName: 'river_sirion',
    color: "blue",  // Color is set to blue for every object
    name: "River Sirion",
    PopupContent: createGeographicPopup(
      "River Sirion",
      "Sirion",
      `Sirion is Sindarin for "Great River" or "Great Stream", from sîr ("river") with the suffix iaun ("roomy, wide, extensive") simplified.`,
      `Sirion was a river of Middle-earth in the First Age, the principal river of Beleriand. During most of its course it was the border between East Beleriand and West Beleriand.`,
      "https://tolkiengateway.net/wiki/Sirion"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    dry_river: {
    pathName: 'dry_river',
    color: "blue",  // Color is set to blue for every object
    name: "Dry River",
    PopupContent: createGeographicPopup(
      "Dry River",
      "None",
      `None`,
      `Dry River was the name given to the dry bed of what had once been a tributary of the River Sirion rising in the Encircling Mountains. It had joined the Sirion just north of the Ford of Brithiach.`,
      "https://tolkiengateway.net/wiki/Dry_River"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_teiglin: {
    pathName: 'river_teiglin',
    color: "blue",  // Color is set to blue for every object
    name: "River Teiglin",
    PopupContent: createGeographicPopup(
      "River Teiglin",
      "Teiglin",
      `The element taeg means "boundary". In the Etymologies the name appears in its earlier form "Taiglin" and its second element appears to be lin "pool".`,
      `The Taeglin was a river in Beleriand, a tributary of Sirion. It rose in the Ered Wethrin and flowed southeast through Brethil to join Sirion on the borders of Doriath. It had three minor tributaries: Glithui, Malduin[1] and Celebros.`,
      "https://tolkiengateway.net/wiki/Taeglin"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_malduin: {
    pathName: 'river_malduin',
    color: "blue",  // Color is set to blue for every object
    name: "River Malduin",
    PopupContent: createGeographicPopup(
      "River Malduin",
      "Malduin",
      `Malduin means "Golden River" in Sindarin, from MAL ("gold") + duin ("river").`,
      `Malduin was a minor river of northern Beleriand. It flowed southwards from the Ered Wethrin to meet the Teiglin before that river passed under the eaves of the Forest of Brethil.`,
      "https://tolkiengateway.net/wiki/Malduin"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_celebros: {
    pathName: 'river_celebros',
    color: "blue",  // Color is set to blue for every object
    name: "River Celebros",
    PopupContent: createGeographicPopup(
      "River Celebros",
      "Celebros",
      `Celebros is Sindarin, from celeb ("silver") and ros ("foam").`,
      `Celebros was a stream of Beleriand, a tributary to Taeglin that flowed through Brethil forest.`,
      "https://tolkiengateway.net/wiki/Celebros"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_glithui: {
    pathName: 'river_glithui',
    color: "blue",  // Color is set to blue for every object
    name: "River Glithui",
    PopupContent: createGeographicPopup(
      "River Glithui",
      "Glithui",
      `The name Glithui is Sindarin but does not have a clear etymology; the construction "of deep ash colour" is suggested. Glithui may also come from the very old word giltha, meaning a white metal, and especially silver. In form, Glithui appears to be an adjective, so we might very tentatively interpret the name as something like 'silvery'.`,
      `Glithui was a small river that rose beneath Amon Darthir in the Mountains of Shadow, beneath a steep and treacherous pass out of Dor-lómin into West Beleriand.`,
      "https://tolkiengateway.net/wiki/Glithui"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_narog: {
    pathName: 'river_narog',
    color: "blue",  // Color is set to blue for every object
    name: "River Narog",
    PopupContent: createGeographicPopup(
      "River Narog",
      "Narog",
      `Tthe name Narog is derived from the root narak meaning "tear, rend" and naraka meaning "rushing, rapid, violent" apparently in reference to the torrential rapids of the river as it passed Nargothrond.`,
      `River of Nargothrond in West Beleriand. The Narog was a tributary of the Sirion. It was a swift-moving river that flowed from north to south for about 240 miles. Its river valley was called the Vale of Narog.`,
      "https://thainsbook.minastirith.cz/rivers.html#Narog"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_ginglith: {
    pathName: 'river_ginglith',
    color: "blue",  // Color is set to blue for every object
    name: "River Ginglith",
    PopupContent: createGeographicPopup(
      "River Ginglith",
      "Ginglith",
      `The meaning of Ginglith is unclear. The name Ginglith first appeared in The Lays of Beleriand from the 1920s, and then reappeared in Silmarillion maps and drafts from the 1930s`,
      `River of Nargothrond in West Beleriand. The Narog was a tributary of the Sirion. It was a swift-moving river that flowed from north to south for about 240 miles. Its river valley was called the Vale of Narog.`,
      "https://tolkiengateway.net/wiki/Ginglith"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_nenning: {
    pathName: 'river_nenning',
    color: "blue",  // Color is set to blue for every object
    name: "River Nenning",
    PopupContent: createGeographicPopup(
      "River Nenning",
      "Nenning",
      `The name Nenning contains the Sindarin word nen meaning "water."`,
      `River in West Beleriand. The Nenning formed the western border of the Realm of Nargothrond. West of the Nenning was the coastal region of the Falas. The Nenning began in a small range of hills south of the Ered Wethrin and flowed southward to the Sea.`,
      "https://thainsbook.minastirith.cz/rivers.html#Nenning"
    ),
    tolerance: 10,  // Tolerance is set to 10 for every object
    weight: 7  // Weight is set to 7 for every object
  },
    river_brithon: {
    pathName: 'river_brithon',
    color: "blue",  // Color is set to blue for every object
    name: "River Brithon",
    PopupContent: createGeographicPopup(
      "River Brithon",
      "Brithon",
      `The name Brithon means "pebbly" from brith meaning "gravel."`,
      `River in Beleriand. The Brithon was located in the coastal region of the Falas. It began in a small range of hills south of the Ered Wethrin and flowed southwestward to the Sea. `,
      "https://thainsbook.minastirith.cz/rivers.html#Brithon"
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

export const hills = {
  andram: {
    pathName: "andram",
    color: "red",
    name: "Andram",
    PopupContent: createGeographicPopup(
    "Andram",
    "Andram",
    `The name Andram means "Long Wall" in Sindarin from and meaning "long" and ram meaning "wall."`,
    `Range of hills in Beleriand. Andram stretched from east to west across Beleriand, dividing the higher northern region from the southern lowlands.`,
    "https://thainsbook.minastirith.cz/hills.html#Andram"),
    tolerance: 1,
    weight: 2,
  },
  taur_en_faroth: {
    pathName: "taur_en_faroth",
    color: "red",
    name: "Taur-en-Faroth",
    PopupContent: createGeographicPopup(
    "Taur-en-Faroth",
    "Taur-en-Faroth",
    `The name is translated in full as "Forest of the Hunters", from Sindarin taur ("forest"), en ("of") and faroth (a word related to hunting).`,
    `Taur-en-Faroth was the range of wooded hills in West Beleriand that rose up above the western side of the River Narog. They were part of the Realm of Nargothrond.`,
    "https://tolkiengateway.net/wiki/Taur-en-Faroth"),
    tolerance: 1,
    weight: 2,
  },
  amon_rudh: {
    pathName: "amon_rudh",
    color: "red",
    name: "Amon Rudh",
    PopupContent: createGeographicPopup(
    "Amon Rudh",
    "Amon Rudh",
    `Amon Rûdh means "Bald Hill" in Sindarin, from amon ("hill") and rûdh ("bald").`,
    `Amon Rûdh stood upon the eastern edge of the high moorlands,[1]:note 16 south of the Forest of Brethil and the Teiglin in West Beleriand during the First Age.`,
    "https://thainsbook.minastirith.cz/hills.html#Andram"),
    tolerance: 1,
    weight: 2,
  },
  amon_ereb: {
    pathName: "amon_ereb",
    color: "red",
    name: "amon_ereb",
    PopupContent: createGeographicPopup(
    "Amon Ereb",
    "Amon Ereb",
    `Amon Ereb is Sindarin "Lonely Hill", from amon "hill" + ereb "isolated, lonely".`,
    `Amon Ereb, sometimes just Ereb, was the broad, shallow-sided hill that dominated the southern plains of East Beleriand.`,
    "https://tolkiengateway.net/wiki/Amon_Ereb"),
    tolerance: 1,
    weight: 2,
  },
  andram: {
    pathName: "himring",
    color: "red",
    name: "himring",
    PopupContent: createGeographicPopup(
    "Himring",
    "Himring",
    `The name Himring means "Ever-cold" in Sindarin from him meaning "continually" and ring meaning "cold."`,
    `Hill in East Beleriand where Maedhros had his stronghold. Himring was part of a small range of hills between Dorthonion and the Blue Mountains.`,
    "https://thainsbook.minastirith.cz/hills.html#Himring"),
    tolerance: 1,
    weight: 2,
  },
}
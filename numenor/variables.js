// variables.js

import { 
  createCampsitePopup,
  createGeographicPopup,
 } from './functions.js';

import {
  forest,
  mountain,
} from './geographic_popup_content.js'
 
// Icons
const iconUrls = {
    hobbits: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/hobbits.png',
    men: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/men.png',
    rivendell: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/rivendell.png',
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
const icons = {
  HobbitsIcon: createIcon(iconUrls.hobbits),
  MenIcon: createIcon(iconUrls.men),
  RivendellIcon: createIcon(iconUrls.rivendell),
  TentIcon: createIcon(iconUrls.tent, [30, 30])
};

// Campsites (markers)
export const samfrodocampsites = {
  September23: { coords: [44.94642366,-93.31109147], icon: icons.TentIcon, popup: createCampsitePopup('September 23',5,18,3.6,'Evening march.','Green Hill Country'),
  },
  September24: { coords: [44.94646111,-93.31071990], icon: icons.TentIcon, popup: createCampsitePopup('September 24',8,28,3.5,'Black Riders, Elves.','West of Woodhall'),
  },
  September25: { coords: [44.94652028,-93.31055827], icon: icons.TentIcon, popup: createCampsitePopup('September 25',7.5,27,10.4,'Marish, Farmer Maggot wagon, Buckland.','Crickhollow'),
  },
  September26: { coords: [44.94650900,-93.31026524], icon: icons.TentIcon, popup: createCampsitePopup('September 26',10.5,25,2.4,'On ponies. Knoll, Old Man Willow.','The House of Tom Bombadil'),
  },
  September27: { coords: [44.94651566,-93.31021725], icon: icons.TentIcon, popup: createCampsitePopup('September 27'," "," "," d",'Rain.','The House of Tom Bombadil'),
  },
  September28: { coords: [44.94661806,-93.30984957], icon: icons.TentIcon, popup: createCampsitePopup('September 28',5,17,3.4,'Ponies. Sleep afternoon, captured in evening.','Barrow'),
  },
  September29: { coords: [44.94674608,-93.30971762], icon: icons.TentIcon, popup: createCampsitePopup('September 29',6,20,3.3,'Ponies. Start after lunch.','Bree'),
  },
  September30: { coords: [44.94686728,-93.30961788], icon: icons.TentIcon, popup: createCampsitePopup('September 30',7.5,11,1.5,'Joined by Strider. Depart 10A.M. Wandering course.','Western Chetwood'),
  },
  October1: { coords: [44.94685197,-93.30947109], icon: icons.TentIcon, popup: createCampsitePopup('October 1',11,16,1.5,'Turn due east.','Eastern Chetwood'),
  },
  October2: { coords: [44.94679403,-93.30931020], icon: icons.TentIcon, popup: createCampsitePopup('October 2',11,16,1.5,'','Midgewater Marshes'),
  },
  October3: { coords: [44.94676606,-93.30914836], icon: icons.TentIcon, popup: createCampsitePopup('October 3',11,15,1.4,'See flashes from Weathertop.','East edge of Marshes'),
  },
  October4: { coords: [44.94677005,-93.30889430], icon: icons.TentIcon, popup: createCampsitePopup('October 4',11,17,1.5,'','Stream from Hills'),
  },
  October5: { coords: [44.94681001,-93.30856216], icon: icons.TentIcon, popup: createCampsitePopup('October 5',11.5,18,1.6,'','Weather Hills'),
  },
  October6: { coords: [44.94663686,-93.30857909], icon: icons.TentIcon, popup: createCampsitePopup('October 6',4,12,3,'Climb hill at noon. Attacked at moonrise.','Dell by Weathertop'),
  },
  October7: { coords: [44.9463832,-93.3083244], icon: icons.TentIcon, popup: createCampsitePopup('October 7',11,19,1.7,'Frodo on pony.','Thickets south of Road'),
  },
  October8: { coords: [44.9463922,-93.3081953], icon: icons.TentIcon, popup: createCampsitePopup('October 8',11,19,1.7,'Frodo on pony.','Thickets south of Road'),
  },
  October9: { coords: [44.9464162,-93.3079624], icon: icons.TentIcon, popup: createCampsitePopup('October 9',11,19,1.7,'Frodo on pony.','Thickets south of Road'),
  },
  October10: { coords: [44.9464446,-93.3077338], icon: icons.TentIcon, popup: createCampsitePopup('October 10',11,19,1.7,'Frodo on pony.','Thickets south of Road'),
  },
  October11: { coords: [44.94651057,-93.30733893], icon: icons.TentIcon, popup: createCampsitePopup('October 11',11,19,1.7,'Frodo on pony.','Thickets south of Road'),
  },
  October12: { coords: [44.9466935,-93.3070887], icon: icons.TentIcon, popup: createCampsitePopup('October 12',11,19,1.7,'Frodo on pony.','SW of Last Bridge'),
  },
  October13: { coords: [44.9467947,-93.3069024], icon: icons.TentIcon, popup: createCampsitePopup('October 13',11,8,0.7,'Cross Bridge, leave Road.','Western Trollshaws'),
  },
  October14: { coords: [44.9468360,-93.3068704], icon: icons.TentIcon, popup: createCampsitePopup('October 14',11,8,0.7,'','Western Trollshaws'),
  },
  October15: { coords: [44.9468973,-93.3068591], icon: icons.TentIcon, popup: createCampsitePopup('October 15',11,8,0.7,'','Western Trollshaws'),
  },
  October16: { coords: [44.9469865,-93.3067894], icon: icons.TentIcon, popup: createCampsitePopup('October 16',11,8,0.7,'Turn more north.','Shallow Cave'),
  },
  October17: { coords: [44.94685670,-93.30670698], icon: icons.TentIcon, popup: createCampsitePopup('October 17',6,5,0.8,'Turn southeast.','Top of Ridge'),
  },
  October18: { coords: [44.9467214,-93.3063566], icon: icons.TentIcon, popup: createCampsitePopup('October 18',21,34,1.6,'Find Trolls. Meet Glorfindel, march until dawn.','No campsite'),
  },
  October19: { coords: [44.9466948,-93.3059595], icon: icons.TentIcon, popup: createCampsitePopup('October 19',9,20,2.2,'Frodo on horse.','Central Trollshaws'),
  },
  October20throughDecember24: { coords: [44.94675556,-93.30550447], icon: icons.TentIcon, popup: createCampsitePopup('October 20 through December 24',9,18,2,'March to Ford. Attack by Black Riders.','Rivendell'),
  },
  December25: { coords: [44.946634676422683, -93.305743445383897], icon: icons.TentIcon, popup: createCampsitePopup('December 25',14,22,1.6,'Dusk to dawn march. Turn south at Ford',''),
  },
  December26: { coords: [44.946555782786213, -93.305736014143861], icon: icons.TentIcon, popup: createCampsitePopup('December 26',14,15,1.1,'Rugged terrain.','West of mountains'),
    },
  December27: { coords: [44.946515459330129, -93.305835097344271], icon: icons.TentIcon, popup: createCampsitePopup('December 27',14,15,1.1,'Rugged terrain.','West of mountains'),
    },
  December28: { coords: [44.946448837905862, -93.305825189024233], icon: icons.TentIcon, popup: createCampsitePopup('December 28',14,15,1.1,'Rugged terrain.','West of mountains'),
    },
  December29: { coords: [44.946390982395748, -93.30590693266457], icon: icons.TentIcon, popup: createCampsitePopup('December 29',14,15,1.1,'Rugged terrain.','West of mountains'),
    },
  December30: { coords: [44.946340139626592, -93.306015924185019], icon: icons.TentIcon, popup: createCampsitePopup('December 30',14,15,1.1,'Rugged terrain.','West of mountains'),
    },
  December31: { coords: [44.946254232776397, -93.305988676304906], icon: icons.TentIcon, popup: createCampsitePopup('December 31',14,15,1.1,'Rugged terrain.','West of mountains'),
    },
  January1: { coords: [44.946199883478243, -93.306105099065405], icon: icons.TentIcon, popup: createCampsitePopup('January 1',14,15,1.1,'Rugged terrain.','West of mountains'),
    },
  January2: { coords: [44.946113976418147, -93.306147209425575], icon: icons.TentIcon, popup: createCampsitePopup('January 2',14,15,1.1,'Rugged terrain.','West of mountains'),
    },
  January3: { coords: [44.946033328856963, -93.306228953065897], icon: icons.TentIcon, popup: createCampsitePopup('January 3',14,15,1.1,'Rugged terrain.','West of mountains'),
    },
  January4: { coords: [44.945956187605482, -93.306318127946284], icon: icons.TentIcon, popup: createCampsitePopup('January 4',14,15,1.1,'Rugged terrain.','West of mountains'),
    },
  January5: { coords: [44.945879046250319, -93.306283448826136], icon: icons.TentIcon, popup: createCampsitePopup('January 5',14,15,1.1,'Rugged terrain.','West of mountains'),
    },
  January6: { coords: [44.945817683734688, -93.306352807066418], icon: icons.TentIcon, popup: createCampsitePopup('January 6',14,15,1.1,'Rugged terrain.','West of mountains'),
    },
  January7: { coords: [44.945731776102619, -93.306377577866527], icon: icons.TentIcon, popup: createCampsitePopup('January 7',14,15,1.1,'','Hollin Ridge'),
    },
  January8: { coords: [44.945651128004478, -93.306342898746365], icon: icons.TentIcon, popup: createCampsitePopup('January 8',14,16,1.1,'Turn SE toward Pass, strike road.','NW of Redhorn'),
    },
  January9: { coords: [44.945545934662725, -93.306226475985909], icon: icons.TentIcon, popup: createCampsitePopup('January 9',14,17,1.2,'','NW of Redhorn'),
    },
  January10: { coords: [44.94534782001238, -93.306134824025506], icon: icons.TentIcon, popup: createCampsitePopup('January 10',14,17,1.2,'','Foot of Redhorn'),
  },
  January11: { coords: [44.945126912604856, -93.305911886824575], icon: icons.TentIcon, popup: createCampsitePopup('January 11',6,8,1.3,'Climb until midnight. Snow.','Redhorn Pass'),
    },
  January12: { coords: [44.945041003939018, -93.306360238306439], icon: icons.TentIcon, popup: createCampsitePopup('January 12',8,28,3.5,'March late morning to dusk. Wolf attack at night.','Knoll'),
    },
  January13: { coords: [44.944942822449207, -93.306117484465432], icon: icons.TentIcon, popup: createCampsitePopup('January 13',17.5,40,2.3,'Dawn to dusk outside; dusk to after midnight inside Moria.','Guardroom'),
    },
  January14: { coords: [44.944960354870418, -93.305275277261956], icon: icons.TentIcon, popup: createCampsitePopup('January 14',8,20,2.5,'Mid-morning to evening march.','Hall Twenty-one'),
    },
  January15: { coords: [44.944697367990038, -93.305022615100896], icon: icons.TentIcon, popup: createCampsitePopup('January 15',8,17.5,1.7,'Attack in Moria. Escape.','Flets by Nimrodel'),
    },
  January16: { coords: [44.944713147236826, -93.304750136299774], icon: icons.TentIcon, popup: createCampsitePopup('January 16',8,32,4,'Smooth paths.','Central Lorien'),
    },
  January17throughFebruary15: { coords: [44.944655289977362, -93.304467749178613], icon: icons.TentIcon, popup: createCampsitePopup('January 17 through February 15',8,32,4,'Cerin Amroth at noon; City after dusk','Caras Galadon'),
    },
  February16: { coords: [44.944379590568801, -93.303939511866389], icon: icons.TentIcon, popup: createCampsitePopup('February 16',11.5,35,2.9,'Walk to river; boat afternoon into night.','Woods on west bank'),
    },
  February17: { coords: [44.9441919914861, -93.303652170585195], icon: icons.TentIcon, popup: createCampsitePopup('February 17',13,40,3.1,'','West bank'),
    },
  February18: { coords: [44.944093808544231, -93.303270700263596], icon: icons.TentIcon, popup: createCampsitePopup('February 18',13,40,3.1,'','Flats north of Celebrant'),
    },
  February19: { coords: [44.943641463535961, -93.303000698542519], icon: icons.TentIcon, popup: createCampsitePopup('February 19',13,40,3.1,'','Opposite Brown Lands'),
    },
  February20: { coords: [44.943532759940794, -93.302520145020523], icon: icons.TentIcon, popup: createCampsitePopup('February 20',13,55,4.1,'Paddle all day.','Near gravel shoals'),
    },
  February21: { coords: [44.943261000052331, -93.302423538900115], icon: icons.TentIcon, popup: createCampsitePopup('February 21',13,55,4.1,'Paddle long spells.','Eyot'),
    },
  February22: { coords: [44.942847221169259, -93.302546154360613], icon: icons.TentIcon, popup: createCampsitePopup('February 22',18,70,3.7,'Change to night journey.','Rugged country'),
    },
  February23: { coords: [44.9426732, -93.3025452], icon: icons.TentIcon, popup: createCampsitePopup('February 23',4,12,3,'Escape rapids and Orcs.','Bay 0.5 miles N of rapids'),
    },
  February24: { coords: [44.942598251141405, -93.302500328380418], icon: icons.TentIcon, popup: createCampsitePopup('February 24'," ",5.4," ",'Portage.','Foot of Rrapids'),
    },
  February25: { coords: [44.942198494206167, -93.302421061820098], icon: icons.TentIcon, popup: createCampsitePopup('February 25',11,40,3.6,'Argonath at midafternoon.','Parth Galen'),
    },
  February26: { coords: [44.942226109087123, -93.302224753229297], icon: icons.TentIcon, popup: createCampsitePopup('February 26',5,10,2,'1PM to dusk.','Central Eastern Emyn Muil'),
    },
  February27: { coords: [44.942249778974578, -93.301946081728119], icon: icons.TentIcon, popup: createCampsitePopup('February 27',12,20,1.7,'Dawk to dusk.','Cliff'),
    },
  February28: { coords: [44.942391798094405, -93.301777021017386], icon: icons.TentIcon, popup: createCampsitePopup('February 28',12,20,1.7,'Dawk to dusk.','Hollow'),
    },
  February29: { coords: [44.942590361274824, -93.301580093156531], icon: icons.TentIcon, popup: createCampsitePopup('February 29',18,34,1.9,'Dawn to evening.','Feet of Emyn Muil, gully'),
    },
  February30: { coords: [44.942552226677563, -93.301550368196416], icon: icons.TentIcon, popup: createCampsitePopup('February 30',16,25,1.6,'Capture Gollum. Brief rest, then walk moonset to dawn.','Northern Dead Marshes'),
    },
  March1: { coords: [44.942498312203725, -93.300872267543525], icon: icons.TentIcon, popup: createCampsitePopup('March 1',10,15,1.5,'Dusk to 10 A.M.','SE Dead Marshes'),
    },
  March2: { coords: [44.942364183293073, -93.300731073982917], icon: icons.TentIcon, popup: createCampsitePopup('March 2',12,15,1.3,'Dusk to dawn. Stopped for Nazgul.','Noman-lands'),
    },
  March3: { coords: [44.942310268642643, -93.300558297652174], icon: icons.TentIcon, popup: createCampsitePopup('March 3',12,15,1.3,'Dusk to dawn.','Edge of Desolation'),
    },
  March4: { coords: [44.942226109087123, -93.300407815041538], icon: icons.TentIcon, popup: createCampsitePopup('March 4',8,12,1.5,'Dusk to pre-dawn.','One mile from Morannon'),
    },
  March5: { coords: [44.942222164104933, -93.30027033710094], icon: icons.TentIcon, popup: createCampsitePopup('March 5',12,24,2,'Dusk to dawn.','North of Ithilien'),
    },
  March6: { coords: [44.941967054694999, -93.300805386383217], icon: icons.TentIcon, popup: createCampsitePopup('March 6',12,24,2,'Dusk to dawn.','Near pool'),
    },
  March7: { coords: [44.941581758364975, -93.300814675433259], icon: icons.TentIcon, popup: createCampsitePopup('March 7',2.5,10,4,'Late afternoon to dusk.','Henneth Annun'),
    },
  March7part2: { coords: [44.941456832432252, -93.300650259247547], icon: icons.TentIcon, popup: createCampsitePopup('March 7',2.5,10,4,'Late afternoon to dusk.','Henneth Annun'),
    },
  March8: { coords: [44.941383191733244, -93.300698562307716], icon: icons.TentIcon, popup: createCampsitePopup('March 8',12,22,1.8,'Dawn to dusk.','Halfway to Morgul-road'),
    },
  March9: { coords: [44.941159639032676, -93.300577804657195], icon: icons.TentIcon, popup: createCampsitePopup('March 9',12,22,1.8,'Dawn to dusk.','Morgul-road'),
    },
  March10: { coords: [44.940967646018571, -93.300497918826863], icon: icons.TentIcon, popup: createCampsitePopup('March 10',20,22,1.3,'Midnight to dawn in rough terrain. The Dawnless Day. 4 P.M. to dusk. Cross-roads; and all night. Saw Morgul-host.','Just west of Cross-roads'),
    },
  March11: { coords: [44.940955810811758, -93.300332573736156], icon: icons.TentIcon, popup: createCampsitePopup('March 11'," "," "," ",'Slept all day and night.','Top of Winding Stair'),
    },
  March12: { coords: [44.940961070903981, -93.300219247325686], icon: icons.TentIcon, popup: createCampsitePopup('March 12',27," "," ",'Day and night of March 12, and day of March 13.',"Shelob's Lair"),
    },
  March13throughMarch14: { coords: [44.940967646018571, -93.300039039754893], icon: icons.TentIcon, popup: createCampsitePopup('March 13 through March 14'," "," "," ",'Capture by Orcs at dusk.','Frodo - Tower of Cirith Ungol, Sam - Under-way'),
    },
  March15: { coords: [44.941146488846719, -93.299819818173958], icon: icons.TentIcon, popup: createCampsitePopup('March 15',13,15,1.2,'Escape from Tower. Walk 5 A.M. to dusk, several halts.','Foot of ravine in Morgai'),
    },
  March16: { coords: [44.941512062894517, -93.30005204442493], icon: icons.TentIcon, popup: createCampsitePopup('March 16',24,27,1.1,'Climb Morgai in day; walk in valley all night. Brief rest.','Central valley'),
    },
  March17: { coords: [44.941780324384034, -93.300252687905768], icon: icons.TentIcon, popup: createCampsitePopup('March 17',12,25,2.1,'Dusk to dawn.','North end of valley'),
    },
  March18: { coords: [44.94177637937122, -93.299801240073833], icon: icons.TentIcon, popup: createCampsitePopup('March 18',9,20,2.3,'Overtaken by Orcs on road.','Near Isenmouthe'),
    },
  March19: { coords: [44.941789529412908, -93.299626605933099], icon: icons.TentIcon, popup: createCampsitePopup('March 19',11,10,0.9,'Return to road. Walk early morning to past dusk.','Near road'),
    },
  March20: { coords: [44.941769804349242, -93.299357223481934], icon: icons.TentIcon, popup: createCampsitePopup('March 20',12,15,1.3,'Dawn to dusk.','Near road'),
    },
  March21: { coords: [44.941727724190777, -93.299139859711005], icon: icons.TentIcon, popup: createCampsitePopup('March 21',12,15,1.3,'Last cistern.','Near road'),
    },
  March22: { coords: [44.941650138817721, -93.299046969210622], icon: icons.TentIcon, popup: createCampsitePopup('March 22',12,15,1.3,'Turn south from road. The Dreadful Nightfall','South of road'),
    },
  March23: { coords: [44.941543623134812, -93.299013528630468], icon: icons.TentIcon, popup: createCampsitePopup('March 23',12,10,0.8,'Frodo and Sam cast away their gear. They leave the road and travel south across Gorgoroth toward Mount Doom. They travel by day and rest at night.','Gorgoroth'),
    },
  March24: { coords: [44.9414759, -93.29900145], icon: icons.TentIcon, popup: createCampsitePopup('March 24',12,10,0.8,'Frodo and Sam reach the foot of Mount Doom near dusk and stop to rest',''),
    },
  March25: { coords: [44.941417382069524, -93.298987519290364], icon: icons.TentIcon, popup: createCampsitePopup('March 25',2,4,2,"Sam starts to carry Frodo up the slopes of Mount Doom. Around noon, Frodo reaches the Chambers of Fire and claims the One Ring for himself. Sauron becomes aware of him. The Winged Nazgul head to Mount Doom. Gollum bites off Frodo's Ring-finger and falls into the Cracks of Doom and dies. The One Ring is destroyed.",""),
    },

    

};
export const aragorncampsites = {
  February26: { coords: [44.942590690006462, -93.30323493742091], icon: icons.TentIcon, popup: createCampsitePopup('February 26',14,27,1.9,'Late afternoon to dusk of next day.','Halfway to Entwash'), },
  February27: { coords: [44.94223958777421, -93.302579362714354], icon: icons.TentIcon, popup: createCampsitePopup('February 27',12,36,3,'Hills, then plain.'," "), },
  February28: { coords: [44.9426764927588, -93.303749783019342], icon: icons.TentIcon, popup: createCampsitePopup('February 28',12,36,3," ",'South of Downs'), },
  February29: { coords: [44.943161719707774, -93.303961573360311], icon: icons.TentIcon, popup: createCampsitePopup('February 29',12,36,3,'Reach Downs about 11 A.M.','North end of Downs, meeting with Eomer'), },
  February30: { coords: [44.943331350921085, -93.304542603440282], icon: icons.TentIcon, popup: createCampsitePopup('February 30',5.5,30,5.5,'Afternoon on horseback','Edge of Fangorn'), },
  March01: { coords: [44.942361142376576, -93.305027491852343], icon: icons.TentIcon, popup: createCampsitePopup('March 01',15,105,7,'Meet Gandalf. Ride afternoon and most of night.','Part way to Edoras'), },
  March02: { coords: [44.942112608553622, -93.305256002483333], icon: icons.TentIcon, popup: createCampsitePopup('March 02',8.3,62,7.5,'Reach Edoras at dawn; leave at 1 P.M.',"Part way to Helm's Deep"), },
  March03: { coords: [44.942267449196656, -93.305835639205839], icon: icons.TentIcon, popup: createCampsitePopup('March 03',13,96,7.4,"Battle of Helm's Deep.","Helm's Deep"), },
  March04: { coords: [44.942841440803193, -93.306437569648423], icon: icons.TentIcon, popup: createCampsitePopup('March 04',8,40,5,'4 P.M. to midnight, ride swiftly.','15 miles N of Fords of Isen'), },
  March05: { coords: [44.94283749586328, -93.3064751903011], icon: icons.TentIcon, popup: createCampsitePopup('March 05',19,73,3.8,'Ride slowly to Isengard and back. Break camp after Nazgul comes. Late night to dawn. Dunedain join at Fords.',"Dol Baran. Helm's Deep"), },
  March06: { coords: [44.942261531727517, -93.305416238596536], icon: icons.TentIcon, popup: createCampsitePopup('March 06',10,75,7.5,'2 P.M. to midnight. Main road.','Halfway to Edoras'), },
  March07: { coords: [44.941866046158196, -93.30495364390454], icon: icons.TentIcon, popup: createCampsitePopup('March 07',12,85,7.1,'Dawn to dusk ride.','Dunharrow'), },
  March08: { coords: [44.941263443207347, -93.304897909604293], icon: icons.TentIcon, popup: createCampsitePopup('March 08',18,60,3.3,'Dawn to 4:30 P.M., Paths of the Dead; reach Erech at midnight.','Erech'), },
  March09: { coords: [44.940712120073641, -93.304174757058689], icon: icons.TentIcon, popup: createCampsitePopup('March 09',16,110,7," ",'Calembal'), },
  March10: { coords: [44.940289994310469, -93.303455784585594], icon: icons.TentIcon, popup: createCampsitePopup('March 10',13,90,7,'The Dawnless Day.','Ringlo'), },
  March11: { coords: [44.939765291605568, -93.303310875404961], icon: icons.TentIcon, popup: createCampsitePopup('March 11',10,70,7,'Battle at Linhir.','Lebennin'), },
  March12: { coords: [44.939763319029964, -93.302368965730906], icon: icons.TentIcon, popup: createCampsitePopup('March 12',10,70,7,'Drove enemy.','SW of Pelargir'), },
  March13: { coords: [44.939700196574755, -93.301764248573292], icon: icons.TentIcon, popup: createCampsitePopup('March 13',5,35,7,'Battle. Readied ships.','Pelargir'), },
  March14: { coords: [44.940352129839553, -93.301007655447478], icon: icons.TentIcon, popup: createCampsitePopup('March 14',18,85,4.7,'Rowed.','On Anduin'), },
March15to17: { coords: [44.940872882106646, -93.301046669457662], icon: icons.TentIcon, popup: createCampsitePopup('March 15-17',9,65,7.2,'Sailed Midnight to 9 A.M. Battle of the Pelennor Fields. Host musters.','Minas Tirith'), },
March18: { coords: [44.940888662404646, -93.300740130806332], icon: icons.TentIcon, popup: createCampsitePopup('March 18',8,33,4,'Cavalry.','Cross-roads'), },
March19: { coords: [44.940906415234707, -93.300486539740248], icon: icons.TentIcon, popup: createCampsitePopup('March 19',6,15,2.5,'Infantry joins cavalry.','Cross-roads'), },
March20: { coords: [44.941231882813007, -93.300533913895421], icon: icons.TentIcon, popup: createCampsitePopup('March 20',10,25,2.5," ",'Ithilien'), },
March21: { coords: [44.941464640313235, -93.300567354475561], icon: icons.TentIcon, popup: createCampsitePopup('March 21',8,20,2.5,'Battle in afternoon.','East of Henneth Annun'), },
March22: { coords: [44.941811802289074, -93.300689969936101], icon: icons.TentIcon, popup: createCampsitePopup('March 22',10,22,2.2," ",'Northern Ithilien'), },
March23: { coords: [44.942164879645382, -93.3006425957809], icon: icons.TentIcon, popup: createCampsitePopup('March 23',10,18,1.8,'Faint-hearted dismissed. Army leaves road.','South edge of Desolation'), },
March24: { coords: [44.942231944372701, -93.300202294808997], icon: icons.TentIcon, popup: createCampsitePopup('March 24',10,15,1.5,'Go slowly.','Northwest of Morannon'), },
March25: { coords: [44.942205315740352, -93.300150740581273], icon: icons.TentIcon, popup: createCampsitePopup('March 25'," "," "," ",'Battle of the Morannon.',''), },
};
export const pippincampsites = {
  February26: { coords: [44.942185971374819, -93.30251495819013], icon: icons.TentIcon, popup: createCampsitePopup('February 26',11,27,2.5,'Captured at noon. Skirmish in valley at dusk. No camp.','" "'), },
  February27: { coords: [44.942761796736576, -93.30379927099294], icon: icons.TentIcon, popup: createCampsitePopup('February 27',28,84,3,'Midnight to dusk.','South edge of Downs'), },
  February28: { coords: [44.943305626497363, -93.30452993575463], icon: icons.TentIcon, popup: createCampsitePopup('February 28',18,54,3,'Rohirrim surround.','Edge of Fangorn'), },
  February29: { coords: [44.943364940951376, -93.305973375290364], icon: icons.TentIcon, popup: createCampsitePopup('February 29',12,105,8.75,'Escape before dawn; meet Treebeard.','Wellinghall'), },
  February30toMarch1: { coords: [44.94318099929886, -93.305640056571747], icon: icons.TentIcon, popup: createCampsitePopup('February 30 to March 1',2.5,25,10,'Entmoot','Near Derndingle'), },
  March2toMarch4: { coords: [44.942967066418227, -93.306478061259767], icon: icons.TentIcon, popup: createCampsitePopup('March 2 to March 4',6,60,10,'Entmoot ends in late afternoon; reach gates at midnight.','Isengard'), },
  March05: { coords: [44.942825110515365, -93.306624005896452], icon: icons.TentIcon, popup: createCampsitePopup('March 05',7,140,20,'Late night to dawn, "terrible speed" on Shadowfax.','Edoras'), },
  March06: { coords: [44.942046012949142, -93.304839715015703], icon: icons.TentIcon, popup: createCampsitePopup('March 06',12,120,10,'Travel dusk to dawn on Shadowfax.','Firien Wood'), },
  March07: { coords: [44.941592811896278, -93.303756899969343], icon: icons.TentIcon, popup: createCampsitePopup('March 07',12,120,10,'Travel dusk to dawn on Shadowfax.','Erlas Beacon'), },
  March08: { coords: [44.941267571288705, -93.302127969508291], icon: icons.TentIcon, popup: createCampsitePopup('March 08',12,120,10,'Travel dusk to dawn on Shadowfax. Reach Rammas Echor at dawn of March 9','Minas Tirith'), },
  March9toMarch17: { coords: [44.940899673954469, -93.301184508050511], icon: icons.TentIcon, popup: createCampsitePopup('March 9 to March 17'," "," "," ",'Minas Tirith. Battle of Pelennor Fields on March 15','Minas Tirith'), },
  March18: { coords: [44.940888662404646, -93.300740130806332], icon: icons.TentIcon, popup: createCampsitePopup('March 18',8,33,4,'Infantry.','Cross-roads'), },
  March19: { coords: [44.940906415234707, -93.300486539740248], icon: icons.TentIcon, popup: createCampsitePopup('March 19',6,15,2.5,'Infantry joins cavalry.','Cross-roads'), },
  March20: { coords: [44.941231882813007, -93.300533913895421], icon: icons.TentIcon, popup: createCampsitePopup('March 20',10,25,2.5," ",'Ithilien'), },
  March21: { coords: [44.941464640313235, -93.300567354475561], icon: icons.TentIcon, popup: createCampsitePopup('March 21',8,20,2.5,'Battle in afternoon.','East of Henneth Annun'), },
  March22: { coords: [44.941811802289074, -93.300689969936101], icon: icons.TentIcon, popup: createCampsitePopup('March 22',10,22,2.2," ",'Northern Ithilien'), },
  March23: { coords: [44.942164879645382, -93.3006425957809], icon: icons.TentIcon, popup: createCampsitePopup('March 23',10,18,1.8,'Faint-hearted dismissed. Army leaves road.','South edge of Desolation'), },
  March24: { coords: [44.942231944372701, -93.300202294808997], icon: icons.TentIcon, popup: createCampsitePopup('March 24',10,15,1.5,'Go slowly.','Northwest of Morannon'), },
  March25: { coords: [44.942205315740352, -93.300150740581273], icon: icons.TentIcon, popup: createCampsitePopup('March 25'," "," "," ",'Battle of the Morannon.',''), },
};
export const merrycampsites = {
  February26: { coords: [44.942185971374819, -93.30251495819013], icon: icons.TentIcon, popup: createCampsitePopup('February 26',11,27,2.5,'Captured at noon. Skirmish in valley at dusk. No camp.','" "'), },
  February27: { coords: [44.942761796736576, -93.30379927099294], icon: icons.TentIcon, popup: createCampsitePopup('February 27',28,84,3,'Midnight to dusk.','South edge of Downs'), },
  February28: { coords: [44.943305626497363, -93.30452993575463], icon: icons.TentIcon, popup: createCampsitePopup('February 28',18,54,3,'Rohirrim surround.','Edge of Fangorn'), },
  February29: { coords: [44.943364940951376, -93.305973375290364], icon: icons.TentIcon, popup: createCampsitePopup('February 29',12,105,8.75,'Escape before dawn; meet Treebeard.','Wellinghall'), },
  February30toMarch1: { coords: [44.94318099929886, -93.305640056571747], icon: icons.TentIcon, popup: createCampsitePopup('February 30 to March 1',2.5,25,10,'Entmoot','Near Derndingle'), },
  March2toMarch4: { coords: [44.942967066418227, -93.306478061259767], icon: icons.TentIcon, popup: createCampsitePopup('March 2 to March 4',6,60,10,'Entmoot ends in late afternoon; reach gates at midnight.','Isengard'), },
  March05: { coords: [44.942825110515365, -93.306624005896452], icon: icons.TentIcon, popup: createCampsitePopup('March 05',6.5,41,6.3,'Ride slowly to Isengard and back. Break camp after Nazgul comes. Late night to dawn ride.',"Dol Baran, Helm's Deep"), },
  March06: { coords: [44.941999122267454, -93.305666288234832], icon: icons.TentIcon, popup: createCampsitePopup('March 06',5,20,4,'Set out at 1 P.M.','White Mountains'), },
  March07: { coords: [44.941847930652827, -93.304941720712094], icon: icons.TentIcon, popup: createCampsitePopup('March 07',12,40,3.3,'Mountain Paths','White Mountains'), },
  March08: { coords: [44.941904256987172, -93.305360545869746], icon: icons.TentIcon, popup: createCampsitePopup('March 08',12,40,3.3,'" "','Pass in White Mountains'), },
  March09: { coords: [44.942138548005268, -93.305795600502336], icon: icons.TentIcon, popup: createCampsitePopup('March 09',12,40,3.3,'" "','Dunharrow'), },
  March10: { coords: [44.941927973321931, -93.304336518359335], icon: icons.TentIcon, popup: createCampsitePopup('March 10',9,56,6.2,'The Dawnless Day. Leave Dunharrow at 9 A.M.; muster in Edoras at noon.','Willow Wood'), },
  March11: { coords: [44.941286146557317, -93.302550229062021], icon: icons.TentIcon, popup: createCampsitePopup('March 11',12,80,6.7,'Ride dawn to dusk.','Firien Wood'), },
  March12: { coords: [44.941217961306215, -93.30168535511153], icon: icons.TentIcon, popup: createCampsitePopup('March 12',12,80,6.7,'Dawn to dusk.','Minrimmon'), },
  March13: { coords: [44.941148293683398, -93.301279094708633], icon: icons.TentIcon, popup: createCampsitePopup('March 13',12,80,6.7,'Dawn to dusk.','Druadan Forest'), },
  March14: { coords: [44.940908162080305, -93.301197423802904], icon: icons.TentIcon, popup: createCampsitePopup('March 14',10,50,5,'Stonewain Valley.','Grey Wood'), },
  March15: { coords: [44.941592811896278, -93.303756899969343], icon: icons.TentIcon, popup: createCampsitePopup('March 15',3.5,24.5,7,'Reach Rammas at dawn.  Battle of the Pelennor Fields','Minas Tirith'), },
}

// Settlements (markers)
export const elvessettlements = {
  rivendell: { CheckboxId: 'elves', coords: [44.94677219,-93.30552175], icon: icons.RivendellIcon, popup: `<div>
              <h3>Rivendell</h3>
              <button onclick="window.open('https://thainsbook.minastirith.cz/rivendell.html', '_blank');" 
                      style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">
                Learn more on Thain's Book
              </button>
            </div>` }
};
export const mensettlements = {
  bree: { CheckboxId: 'men', coords: [44.94678231,-93.30970574], icon: icons.MenIcon, popup: 'Bree' },
  minastirith: { CheckboxId: 'men', coords: [44.94097061,-93.30122983], icon: icons.MenIcon, popup: 'Minas Tirith' }
};
export const hobbitsettlements = {
  hobbiton: { CheckboxId: 'hobbits', coords: [44.9466054,-93.3112966], icon: icons.HobbitsIcon, popup: 'Hobbiton' },
  micheldelving: { CheckboxId: 'hobbits', coords: [44.9464735,-93.3116819], icon: icons.HobbitsIcon, popup: 
  `<div>
    <h3 style="font-size: 24px;">Michel Delving</h3>
  <p style="font-size: 18px;">Chief township of the Shire. Michel Delving was located in the Westfarthing of the Shire on the White Downs. The Mayor of Michel Delving was the Shire's only real government official. His office was in the Town Hole in Michel Delving. The museum known as the Mathom-house was also located in Michel Delving.</p>
    <button onclick="window.open('https://thainsbook.minastirith.cz/towns.html#Michel%20Delving', '_blank');" 
            style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">
      Learn more on Thain's Book
    </button>
  </div>`},
  crickhollow: { CheckboxId: 'hobbits', coords: [44.94648941,-93.31055274], icon: icons.HobbitsIcon, popup: 
  `<div>
    <h3 style="font-size: 24px;">Crickhollow</h3>
    <p style="font-size: 18px;">Village in Buckland. Crickhollow was a few miles northeast of Bucklebury. It was a quiet, secluded village. </p>
    <button onclick="window.open('https://thainsbook.minastirith.cz/towns.html#Crickhollow', '_blank');" 
            style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">
      Learn more on Thain's Book
    </button>
  </div>`},

};
export const markersData = [
  { data: samfrodocampsites, checkboxId: 'samfrodocampsitesCheckbox', campsite: 'campsite' },
  { data: aragorncampsites, checkboxId: 'aragorncampsitesCheckbox', campsite: 'campsite' },
  { data: pippincampsites, checkboxId: 'pippincampsitesCheckbox', campsite: 'campsite' },
  { data: merrycampsites, checkboxId: 'merrycampsitesCheckbox', campsite: 'campsite' },
  { data: elvessettlements, checkboxId: 'elvesCheckbox', campsite: 'no' },
  { data: mensettlements, checkboxId: 'menCheckbox', campsite: 'no' },
  { data: hobbitsettlements, checkboxId: 'hobbitsCheckbox', campsite: 'no' }
];

// Paths (polylines)
export const pathdata = { 
  samfrodopath: { pathName: 'samfrodopath', color: 'red' }, 
  aragornpath: { pathName: 'aragornpath', color: 'blue' },
  pippinpath: { pathName: 'pippinpath', color: 'green' },
  merrypath: { pathName: 'merrypath', color: 'orange' },
  gandalfthegrey_merged: { pathName: 'gandalfthegrey_merged', color: 'grey' },
};

// Geographic Features (polygons)
const mountain_ranges = {
  misty_mountains: {
    pathName:'misty_mountains', color: 'orange', name: 'Misty Mountains', PopupContent: createGeographicPopup(mountain.misty_mountains.name, mountain.misty_mountains.elvish_name, mountain.misty_mountains.elvish_meaning, mountain.misty_mountains.description, mountain.misty_mountains.url ) 
  },
  white_mountains: {
    pathName:'white_mountains', color: 'orange', name: 'White Mountains' , PopupContent: createGeographicPopup(mountain.white_mountains.name, mountain.white_mountains.elvish_name, mountain.white_mountains.elvish_meaning, mountain.white_mountains.description, mountain.white_mountains.url ) 
  },
  ash_mountains:{
    pathName:'ash_mountains', color: 'orange', name: 'Ash Mountains' , PopupContent: createGeographicPopup(mountain.ash_mountains.name, mountain.ash_mountains.elvish_name, mountain.ash_mountains.elvish_meaning, mountain.ash_mountains.description, mountain.ash_mountains.url ) 
  },
};
const forests = {
  mirkwood: {pathName:'mirkwood', color: 'green', name: 'Mirkwood', PopupContent: createGeographicPopup(forest.mirkwood.name, forest.mirkwood.elvish_name, forest.mirkwood.elvish_meaning, forest.mirkwood.description, forest.mirkwood.url )
  },
  blackwood: {pathName:'blackwood_test', color: 'green', name: 'Remnants of the Blackwood', PopupContent: createGeographicPopup(forest.blackwood.name, forest.blackwood.elvish_name, forest.blackwood.elvish_meaning, forest.blackwood.description, forest.blackwood.url )
  },
  old_forest: {pathName:'old_forest_test', color: 'green', name: 'Old Forest (a remnant of the Blackwood', PopupContent: createGeographicPopup(forest.old_forest.name, forest.old_forest.elvish_name, forest.old_forest.elvish_meaning, forest.old_forest.description, forest.old_forest.url )
  },

};
export const geographicData = [
  {data: mountain_ranges, checkboxId: 'mountain_rangesCheckbox'},
  {data: forests, checkboxId: 'forestsCheckbox'},
]
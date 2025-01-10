// variables.js

import { generatePopupContent } from './functions.js';

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

// Paths and Campsite
export const pathdata = { samfrodopath: { CheckboxId: 'samfrodopath', pathName: 'samfrodopath', color: 'red', map: map }, 
aragorn: { CheckboxId: 'aragorn', pathName: 'aragorn', color: 'blue', map: map }
};
export const samfrodocampsites = {
September23: { coords: [44.94642366,-93.31109147], icon: icons.TentIcon, popup: generatePopupContent('September 23',5,18,3.6,'Evening march.','Green Hill Country'),
},
September24: { coords: [44.94646111,-93.31071990], icon: icons.TentIcon, popup: generatePopupContent('September 24',8,28,3.5,'Black Riders, Elves.','West of Woodhall'),
},
September25: { coords: [44.94652028,-93.31055827], icon: icons.TentIcon, popup: generatePopupContent('September 25',7.5,27,10.4,'Marish, Farmer Maggot wagon, Buckland.','Crickhollow'),
},
September26: { coords: [44.94650900,-93.31026524], icon: icons.TentIcon, popup: generatePopupContent('September 26',10.5,25,2.4,'On ponies. Knoll, Old Man Willow.','The House of Tom Bombadil'),
},
September27: { coords: [44.94651566,-93.31021725], icon: icons.TentIcon, popup: generatePopupContent('September 27'," "," "," ",'Rain.','The House of Tom Bombadil'),
},
September28: { coords: [44.94661806,-93.30984957], icon: icons.TentIcon, popup: generatePopupContent('September 28',5,17,3.4,'Ponies. Sleep afternoon, captured in evening.','Barrow'),
},
September29: { coords: [44.94674608,-93.30971762], icon: icons.TentIcon, popup: generatePopupContent('September 29',6,20,3.3,'Ponies. Start after lunch.','Bree'),
},
September30: { coords: [44.94686728,-93.30961788], icon: icons.TentIcon, popup: generatePopupContent('September 30',7.5,11,1.5,'Joined by Strider. Depart 10A.M. Wandering course.','Western Chetwood'),
},
October1: { coords: [44.94685197,-93.30947109], icon: icons.TentIcon, popup: generatePopupContent('October 1',11,16,1.5,'Turn due east.','Eastern Chetwood'),
},
October2: { coords: [44.94679403,-93.30931020], icon: icons.TentIcon, popup: generatePopupContent('October 2',11,16,1.5,'','Midgewater Marshes'),
},
October3: { coords: [44.94676606,-93.30914836], icon: icons.TentIcon, popup: generatePopupContent('October 3',11,15,1.4,'See flashes from Weathertop.','East edge of Marshes'),
},
October4: { coords: [44.94677005,-93.30889430], icon: icons.TentIcon, popup: generatePopupContent('October 4',11,17,1.5,'','Stream from Hills'),
},
October5: { coords: [44.94681001,-93.30856216], icon: icons.TentIcon, popup: generatePopupContent('October 5',11.5,18,1.6,'','Weather Hills'),
},
October6: { coords: [44.94663686,-93.30857909], icon: icons.TentIcon, popup: generatePopupContent('October 6',4,12,3,'Climb hill at noon. Attacked at moonrise.','Dell by Weathertop'),
},
October7: { coords: [44.9463832,-93.3083244], icon: icons.TentIcon, popup: generatePopupContent('October 7',11,19,1.7,'Frodo on pony.','Thickets south of Road'),
},
October8: { coords: [44.9463922,-93.3081953], icon: icons.TentIcon, popup: generatePopupContent('October 8',11,19,1.7,'Frodo on pony.','Thickets south of Road'),
},
October9: { coords: [44.9464162,-93.3079624], icon: icons.TentIcon, popup: generatePopupContent('October 9',11,19,1.7,'Frodo on pony.','Thickets south of Road'),
},
October10: { coords: [44.9464446,-93.3077338], icon: icons.TentIcon, popup: generatePopupContent('October 10',11,19,1.7,'Frodo on pony.','Thickets south of Road'),
},
October11: { coords: [44.94651057,-93.30733893], icon: icons.TentIcon, popup: generatePopupContent('October 11',11,19,1.7,'Frodo on pony.','Thickets south of Road'),
},
October12: { coords: [44.9466935,-93.3070887], icon: icons.TentIcon, popup: generatePopupContent('October 12',11,19,1.7,'Frodo on pony.','SW of Last Bridge'),
},
October13: { coords: [44.9467947,-93.3069024], icon: icons.TentIcon, popup: generatePopupContent('October 13',11,8,0.7,'Cross Bridge, leave Road.','Western Trollshaws'),
},
October14: { coords: [44.9468360,-93.3068704], icon: icons.TentIcon, popup: generatePopupContent('October 14',11,8,0.7,'','Western Trollshaws'),
},
October15: { coords: [44.9468973,-93.3068591], icon: icons.TentIcon, popup: generatePopupContent('October 15',11,8,0.7,'','Western Trollshaws'),
},
October16: { coords: [44.9469865,-93.3067894], icon: icons.TentIcon, popup: generatePopupContent('October 16',11,8,0.7,'Turn more north.','Shallow Cave'),
},
October17: { coords: [44.94685670,-93.30670698], icon: icons.TentIcon, popup: generatePopupContent('October 17',6,5,0.8,'Turn southeast.','Top of Ridge'),
},
October18: { coords: [44.9467214,-93.3063566], icon: icons.TentIcon, popup: generatePopupContent('October 18',21,34,1.6,'Find Trolls. Meet Glorfindel, march until dawn.','No campsite'),
},
October19: { coords: [44.9466948,-93.3059595], icon: icons.TentIcon, popup: generatePopupContent('October 19',9,20,2.2,'Frodo on horse.','Central Trollshaws'),
},
October20throughDecember24: { coords: [44.94675556,-93.30550447], icon: icons.TentIcon, popup: generatePopupContent('October 20 through December 24',9,18,2,'March to Ford. Attack by Black Riders.','Rivendell'),
},
};

// Locations
export const elveslocations = {
  elves: { CheckboxId: 'elves', coords: [44.94677219,-93.30552175], icon: icons.RivendellIcon, popup: `<div><h3>Rivendell</h3><button onclick="window.open('https://thainsbook.minastirith.cz/rivendell.html', '_blank')" style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Learn more on Thain's Book</button></div>` }
};
export const menlocations = {
  bree: { CheckboxId: 'men', coords: [44.94678231,-93.30970574], icon: icons.MenIcon, popup: 'Bree' },
  minastirith: { CheckboxId: 'men', coords: [44.94097061,-93.30122983], icon: icons.MenIcon, popup: 'Minas Tirith' }
};
export const hobbitlocations = {
  hobbiton: { CheckboxId: 'hobbits', coords: [44.9466054,-93.3112966], icon: icons.HobbitsIcon, popup: 'Hobbiton' },
  micheldelving: { CheckboxId: 'hobbits', coords: [44.9464735,-93.3116819], icon: icons.HobbitsIcon, popup: `<div><h3>Michel Delving</h3><button onclick="window.open('https://thainsbook.minastirith.cz/towns.html#Michel%20Delving', '_blank')" style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Learn more on Thain's Book</button></div>` },
};

// Geographic Features
export const mountain_ranges = {mountain_ranges: {CheckboxId: 'mountain_ranges', mountain_range_name:'misty_mountains', color: 'orange', name: 'Misty Mountains' },
mountain_ranges: {mountain_range_name:'white_mountains', color: 'orange', name: 'White Mountains' }
};
import { createIcon, generatePopupContent } from './functions.js';

// Image dimensions and bounds
const imageWidth = 8740;
const imageHeight = 8208;
// export const imageBounds = [[0, 0], [imageHeight, imageWidth]];

// Map of icon URLs
const iconUrls = {
    hobbits: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/hobbits.png',
    men: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/men.png',
    rivendell: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/rivendell.png'
  };

// Initialize icons
const icons = {
    HobbitsIcon: createIcon(iconUrls.hobbits),
    MenIcon: createIcon(iconUrls.men),
    RivendellIcon: createIcon(iconUrls.rivendell)
  };

export const locations = {
  bree: { coords: [38.15669,-94.65824], icon: icons.MenIcon, popup: 'Bree' },
  rivendell: { coords: [38.16090,-93.43283], icon: icons.RivendellIcon, popup: `<div><h3>Rivendell</h3><button onclick="window.open('https://thainsbook.minastirith.cz/rivendell.html', '_blank')" style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Learn more on Thain's Book</button></div>` },
  minastirith: { coords: [36.22034,-92.17869], icon: icons.MenIcon, popup: 'Minas Tirith' }
};

export const hobbitlocations = {
    hobbiton: { coords: [38.11071,-95.12346], icon: icons.HobbitsIcon, popup: 'Hobbiton' },
    micheldelving: { coords: [38.06427,-95.23447], icon: icons.HobbitsIcon, popup: `<div><h3>Michel Delving</h3><button onclick="window.open('https://thainsbook.minastirith.cz/towns.html#Michel%20Delving', '_blank')" style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Learn more on Thain's Book</button></div>` },
  };

export const samfrodosteps = {
  September23: { coords: [38.03422, -95.09541], icon: icons.HobbitsIcon, popup: generatePopupContent('September 23',5,18,3.6,'Evening march.','Green Hill Country'),
  },
  September24: { coords: [38.05616, -94.94954], icon: icons.HobbitsIcon, popup: generatePopupContent('September 24',8,28,3.5,'Black Riders, Elves.','West of Woodhall'),
  },
  September25: { coords: [38.06173, -94.90666], icon: icons.HobbitsIcon, popup: generatePopupContent('September 25',7.5,27,10.4,'Marish, Farmer Maggot wagon, Buckland.','Crickhollow'),
  },
  September26: { coords: [38.06173, -94.80477], icon: icons.HobbitsIcon, popup: generatePopupContent('September 26',10.5,25,2.4,'On ponies. Knoll, Old Man Willow.','The House of Tom Bombadil'),
  },
  September27: { coords: [38.05781, -94.80477], icon: icons.HobbitsIcon, popup: generatePopupContent('September 27',,,,'Rain.','The House of Tom Bombadil'),
  },
  September28: { coords: [38.05781, -94.69551], icon: icons.HobbitsIcon, popup: generatePopupContent('September 28',5,17,3.4,'Ponies. Sleep afternoon, captured in evening.','Barrow'),
  },
  September29: { coords: [38.11127, -94.65923], icon: icons.HobbitsIcon, popup: generatePopupContent('September 29',6,20,3.3,'Ponies. Start after lunch.','Bree'),
  },
  September30: { coords: [38.15308, -94.63055], icon: icons.HobbitsIcon, popup: generatePopupContent('September 30',7.5,11,1.5,'Joined by Strider. Depart 10A.M. Wandering course.','Western Chetwood'),
  },
  October1: { coords: [38.19685, -94.58963], icon: icons.HobbitsIcon, popup: generatePopupContent('October 1',11,16,1.5,'Turn due east.','Eastern Chetwood'),
  },
  October2: { coords: [38.18624, -94.53943], icon: icons.HobbitsIcon, popup: generatePopupContent('October 2',11,16,1.5,'','Midgewater Marshes'),
  },
  October3: { coords: [38.16701, -94.49387], icon: icons.HobbitsIcon, popup: generatePopupContent('October 3',11,15,1.4,'See flashes from Weathertop.','East edge of Marshes'),
  },
  October4: { coords: [38.15607, -94.42173], icon: icons.HobbitsIcon, popup: generatePopupContent('October 4',11,17,1.5,'','Stream from Hills'),
  },
  October5: { coords: [38.16170, -94.33947], icon: icons.HobbitsIcon, popup: generatePopupContent('October 5',11.5,18,1.6,'','Weather Hills'),
  },
  October6: { coords: [38.17132, -94.33652], icon: icons.HobbitsIcon, popup: generatePopupContent('October 6',4,12,3,'Climb hill at noon. Attacked at moonrise.','Dell by Weathertop'),
  },
  October7: { coords: [38.11193, -94.19857], icon: icons.HobbitsIcon, popup: generatePopupContent('October 7',11,19,1.7,'Frodo on pony.','Thickets south of Road'),
  },
  October8: { coords: [38.04751, -94.1952], icon: icons.HobbitsIcon, popup: generatePopupContent('October 8',11,19,1.7,'Frodo on pony.','Thickets south of Road'),
  },
  October9: { coords: [38.0552, -94.1024], icon: icons.HobbitsIcon, popup: generatePopupContent('October 9',11,19,1.7,'Frodo on pony.','Thickets south of Road'),
  },
  October10: { coords: [38.0671, -94.0079], icon: icons.HobbitsIcon, popup: generatePopupContent('October 10',11,19,1.7,'Frodo on pony.','Thickets south of Road'),
  },
  October11: { coords: [38.0884, -93.964], icon: icons.HobbitsIcon, popup: generatePopupContent('October 11',11,19,1.7,'Frodo on pony.','Thickets south of Road'),
  },
  October12: { coords: [38.1016, -93.89484], icon: icons.HobbitsIcon, popup: generatePopupContent('October 12',11,19,1.7,'Frodo on pony.','SW of Last Bridge'),
  },
  October13: { coords: [38.13085, -93.83494], icon: icons.HobbitsIcon, popup: generatePopupContent('October 13',11,8,0.7,'Cross Bridge, leave Road.','Western Trollshaws'),
  },
  October14: { coords: [38.15706, -93.82777], icon: icons.HobbitsIcon, popup: generatePopupContent('October 14',11,8,0.7,'','Western Trollshaws'),
  },
  October15: { coords: [38.17961, -93.81469], icon: icons.HobbitsIcon, popup: generatePopupContent('October 15',11,8,0.7,'','Western Trollshaws'),
  },
  October16: { coords: [38.20680, -93.79444], icon: icons.HobbitsIcon, popup: generatePopupContent('October 16',11,8,0.7,'Turn more north.','Shallow Cave'),
  },
  October17: { coords: [38.22768, -93.77293], icon: icons.HobbitsIcon, popup: generatePopupContent('October 17',6,5,0.8,'Turn southeast.','Top of Ridge'),
  },
  October18: { coords: [38.17994, -93.70881], icon: icons.HobbitsIcon, popup: generatePopupContent('October 18',21,34,1.6,'Find Trolls. Meet Glorfindel, march until dawn.','No campsite'),
  },
  October19: { coords: [38.14180, -93.59913], icon: icons.HobbitsIcon, popup: generatePopupContent('October 19',9,20,2.2,'Frodo on horse.','Central Trollshaws'),
  },
  October20throughDecember24: { coords: [38.13981, -93.43123], icon: icons.HobbitsIcon, popup: generatePopupContent('October 20 through December 24',9,18,2,'March to Ford. Attack by Black Riders.','Rivendell'),
  },
  };
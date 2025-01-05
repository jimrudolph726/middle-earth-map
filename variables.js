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

  September25: { coords: [38.06173, -94.90666], icon: icons.HobbitsIcon, popup: generatePopupContent('September 25',7.5,27,10.4,'Marish, Farmer Maggot wagon', 'Buckland.','Crickhollow'),
  },
  September26: { coords: [38.06173, -94.80477], icon: icons.HobbitsIcon, popup: generatePopupContent('September 26',10.5,25,2.4,'On ponies. Knoll, Old Man Willow.','The House of Tom Bombadil'),
  },
  September27: { coords: [38.05781, -94.80477], icon: icons.HobbitsIcon, popup: generatePopupContent('September 27','','','','Rain.','The House of Tom Bombadil'),
  },
  };
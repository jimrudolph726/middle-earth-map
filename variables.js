import { convertYCoordinate, createIcon } from './functions.js';

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
  hobbiton: { coords: [convertYCoordinate(2329), 2247], icon: icons.HobbitsIcon, popup: 'Hobbiton' },
  micheldelving: { coords: [convertYCoordinate(2388), 2110], icon: icons.HobbitsIcon, popup: `<div><h3>Michel Delving</h3><button onclick="window.open('https://thainsbook.minastirith.cz/towns.html#Michel%20Delving', '_blank')" style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Learn more on Thain's Book</button></div>` },
  bree: { coords: [convertYCoordinate(2251), 2794], icon: icons.MenIcon, popup: 'Bree' },
  rivendell: { coords: [convertYCoordinate(2244), 4240], icon: icons.RivendellIcon, popup: `<div><h3>Rivendell</h3><button onclick="window.open('https://thainsbook.minastirith.cz/rivendell.html', '_blank')" style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Learn more on Thain's Book</button></div>` },
  minastirith: { coords: [convertYCoordinate(5113), 5726], icon: icons.MenIcon, popup: 'Minas Tirith' }
};
  

  
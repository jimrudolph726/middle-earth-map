import { convertYCoordinate, createIcon } from './functions.js';

// Image dimensions and bounds
const imageWidth = 8740;
const imageHeight = 8208;
export const imageBounds = [[0, 0], [imageHeight, imageWidth]];

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
bree: { coords: [convertYCoordinate(imageHeight, 2251), 2794], icon: icons.MenIcon, popup: 'Bree' },
  rivendell: { coords: [convertYCoordinate(imageHeight, 2244), 4240], icon: icons.RivendellIcon, popup: `<div><h3>Rivendell</h3><button onclick="window.open('https://thainsbook.minastirith.cz/rivendell.html', '_blank')" style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Learn more on Thain's Book</button></div>` },
  minastirith: { coords: [46.01048827327284, -93.5300604810327], icon: icons.MenIcon, popup: 'Minas Tirith' }
};

export const hobbitlocations = {
    hobbiton: { coords: [convertYCoordinate(imageHeight, 2329), 2247], icon: icons.HobbitsIcon, popup: 'Hobbiton' },
    micheldelving: { coords: [convertYCoordinate(imageHeight, 2388), 2110], icon: icons.HobbitsIcon, popup: `<div><h3>Michel Delving</h3><button onclick="window.open('https://thainsbook.minastirith.cz/towns.html#Michel%20Delving', '_blank')" style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Learn more on Thain's Book</button></div>` },
  };

// Create path variables
export const pathsData = [
    { name: 'SamFrodoPathOverlay', url: 'https://raw.githubusercontent.com/jimrudolph726/middle-earth-map/main/assets/samfrodopath.png' }
  ];

export const samfrodosteps = {
  september23rd: { 
    coords: [convertYCoordinate(imageHeight, 2411), 2355], 
    icon: icons.HobbitsIcon, 
    popup: `<div onmouseover="this.querySelector('.popup-content').style.display = 'block';" 
                onmouseout="this.querySelector('.popup-content').style.display = 'none';">
                <h3>September 23rd</h3>
                <p>Campsite: Green Hill Country</p>
                <div class="popup-content" style="display: none;">
                    <button style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">
                    Learn more on Thain's Book</button>
                </div>
            </div>`
  },
  september24th: { 
    coords: [convertYCoordinate(imageHeight, 2395), 2463], 
    icon: icons.HobbitsIcon, 
    popup: `<div onmouseover="this.querySelector('.popup-content').style.display = 'block';" 
                onmouseout="this.querySelector('.popup-content').style.display = 'none';">
                <h3>September 24th</h3>
                <p>Campsite: West of Woodhall</p>
                <div class="popup-content" style="display: none;">
                    <button style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">
                    Learn more on Thain's Book</button>
                </div>
            </div>`
  }
}
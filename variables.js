import { convertYCoordinate, createIcon } from './functions.js';

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
  bree: { coords: [convertYCoordinate(imageHeight, 2251), 2794], icon: icons.MenIcon, popup: 'Bree' },
  rivendell: { coords: [37.57315,-93.64694], icon: icons.RivendellIcon, popup: `<div><h3>Rivendell</h3><button onclick="window.open('https://thainsbook.minastirith.cz/rivendell.html', '_blank')" style="cursor: pointer; padding: 5px 10px; background-color: #007bff; color: white; border: none; border-radius: 5px;">Learn more on Thain's Book</button></div>` },
  minastirith: { coords: [39.10641773621683, -94.59419575247209], icon: icons.MenIcon, popup: 'Minas Tirith' }
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
    coords: [38.03422, -95.09541], 
    icon: icons.HobbitsIcon, 
    popup: `
        <div onmouseover="this.querySelector('.popup-content').style.display = 'block';" 
             onmouseout="this.querySelector('.popup-content').style.display = 'none';">
            <h3>September 23rd</h3>
            <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>
                    <td style="border: 1px solid #ddd; padding: 8px;">September 23rd</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Hours Travelled</th>
                    <td style="border: 1px solid #ddd; padding: 8px;">5</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Mileage</th>
                    <td style="border: 1px solid #ddd; padding: 8px;">18</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Miles per Hour</th>
                    <td style="border: 1px solid #ddd; padding: 8px;">3.6</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Comments</th>
                    <td style="border: 1px solid #ddd; padding: 8px;">Evening march.</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Campsite</th>
                    <td style="border: 1px solid #ddd; padding: 8px;">Green Hill Country</td>
                </tr>
            </table>
            <div class="popup-content" style="display: none; margin-top: 10px;">
            </div>
        </div>
    `
},

  september24th: { 
    coords: [38.05616,-94.94954], 
    icon: icons.HobbitsIcon, 
    popup: `
        <div onmouseover="this.querySelector('.popup-content').style.display = 'block';" 
             onmouseout="this.querySelector('.popup-content').style.display = 'none';">
            <h3>September 23rd</h3>
            <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>
                    <td style="border: 1px solid #ddd; padding: 8px;">September 24th</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Hours Travelled</th>
                    <td style="border: 1px solid #ddd; padding: 8px;">8</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Mileage</th>
                    <td style="border: 1px solid #ddd; padding: 8px;">28</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Miles per Hour</th>
                    <td style="border: 1px solid #ddd; padding: 8px;">3.5</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Comments</th>
                    <td style="border: 1px solid #ddd; padding: 8px;">Black Riders, Elves.</td>
                </tr>
                <tr>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Campsite</th>
                    <td style="border: 1px solid #ddd; padding: 8px;">West of Woodhall</td>
                </tr>
            </table>
            <div class="popup-content" style="display: none; margin-top: 10px;">
            </div>
        </div>
    `
  }
}
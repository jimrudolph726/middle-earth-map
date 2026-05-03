import {
  samfrodocampsites,
} from './campsite_data.js';

const buildSamFrodoImage = (fileName) => new URL(`./assets/stories/sam_frodo/${fileName}`, import.meta.url).href;

const samFrodoFirstSevenScenes = [
  {
    markerKey: 'September23',
    title: 'Leaving the Shire',
    date: 'September 23',
    location: 'Green Hill Country',
    narrative: 'Frodo, Sam, and Pippin begin their first deliberate march away from the comforts of the Shire. The road still feels familiar, but the mood has shifted: every hedgerow now seems to carry the shadow of pursuit.',
    imageFileName: 'scene-01-leaving-the-shire.png',
  },
  {
    markerKey: 'September24',
    title: 'Black Riders on the Road',
    date: 'September 24',
    location: 'West of Woodhall',
    narrative: 'The company presses on and the menace grows sharper. Black Riders haunt the road while an Elvish encounter briefly reminds the hobbits that the wider world still holds beauty, music, and allies.',
    imageFileName: 'scene-02-black-riders-west-of-woodhall.png',
  },
  {
    markerKey: 'September25',
    title: 'Farmer Maggot and the Ferry East',
    date: 'September 25',
    location: 'Crickhollow',
    narrative: 'Crossing the Marish draws the travellers deeper into danger and farther from home. Farmer Maggot’s help and the passage into Buckland mark one of the last warm acts of ordinary Hobbit-kindness before the journey darkens.',
    imageFileName: 'scene-03-crickhollow.png',
  },
  {
    markerKey: 'September26',
    title: 'Into the Old Forest',
    date: 'September 26',
    location: 'The House of Tom Bombadil',
    narrative: 'Ponies carry them into the strange green silence beyond Buckland. The Forest seems to watch them, Old Man Willow nearly claims them, and Tom Bombadil’s house becomes a sudden pocket of song and safety.',
    imageFileName: 'scene-04-tom-bombadil-house.png',
  },
  {
    markerKey: 'September27',
    title: 'A Rainy Respite with Tom',
    date: 'September 27',
    location: 'The House of Tom Bombadil',
    narrative: 'Rain keeps the company at Bombadil’s house for another day. It is a pause in the narrative, but an important one: the hobbits are allowed to breathe, listen, and gather a little courage before the Old Forest gives way to older terrors.',
    imageFileName: 'scene-05-rain-at-bombadil-house.png',
  },
  {
    markerKey: 'September28',
    title: 'Taken by the Barrow',
    date: 'September 28',
    location: 'Barrow',
    narrative: 'The road east becomes truly haunted. After a weary day and afternoon sleep, the company is captured in the Barrow-downs, and their Shire adventure begins to resemble an ancient tale of graves, cold stones, and forgotten kings.',
    imageFileName: 'scene-06-barrow-downs.png',
  },
  {
    markerKey: 'September29',
    title: 'Bree at Last',
    date: 'September 29',
    location: 'Bree',
    narrative: 'Freed from the Barrow and riding once more, Frodo and his companions finally reach Bree. The Prancing Pony offers shelter and news, but this crossing point between Hobbit-land and the wider world also brings new risks and fateful meetings.',
    imageFileName: 'scene-07-bree.png',
  },
].map((scene, index) => ({
  ...scene,
  coords: samfrodocampsites[scene.markerKey].coords,
  image: buildSamFrodoImage(scene.imageFileName),
  imageRelativePath: `maps/middle_earth/assets/stories/sam_frodo/${scene.imageFileName}`,
  zoom: 19,
  order: index + 1,
}));

export const curatedStories = [
  {
    id: 'sam-frodo-first-seven',
    title: 'Sam and Frodo: From the Shire to Bree',
    markerGroupName: 'samfrodocampsites',
    campCheckboxId: 'samfrodocampsitesCheckbox',
    pathCheckboxId: 'samfrodopathCheckbox',
    scenes: samFrodoFirstSevenScenes,
  },
];

export const getCuratedStoryById = (storyId) => {
  return curatedStories.find((story) => story.id === storyId) || null;
};

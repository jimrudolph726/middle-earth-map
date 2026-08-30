import {
  samfrodocampsites,
  gandalfthewhitecampsites,
} from './campsite_data.js';

const buildSamFrodoImage = (fileName) => new URL(`./assets/stories/sam_frodo/${fileName}`, import.meta.url).href;
const buildGandalfTheWhiteImage = (fileName) => new URL(`./assets/stories/gandalf_the_white/${fileName}`, import.meta.url).href;
const frodoTimelineUrl = 'https://tolkiengateway.net/wiki/Timeline_of_Frodo_Baggins';

const asNumber = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const normalized = String(value ?? '').trim();

  if (!normalized || !/^\d+(?:\.\d+)?$/.test(normalized)) {
    return null;
  }

  return Number(normalized);
};

const formatNumber = (value) => Number.isInteger(value)
  ? String(value)
  : value.toFixed(1).replace(/\.0$/, '');

const displayValue = (value, suffix = '') => {
  const numericValue = asNumber(value);

  if (numericValue !== null) {
    return `${formatNumber(numericValue)}${suffix}`;
  }

  const normalized = String(value ?? '').trim();
  return normalized && normalized.toLowerCase() !== 'd' ? normalized : 'Not recorded';
};

const getCampsiteRange = (campsites, startKey, endKey = startKey) => {
  const keys = Object.keys(campsites);
  const startIndex = keys.indexOf(startKey);
  const endIndex = keys.indexOf(endKey);

  if (startIndex < 0 || endIndex < startIndex) {
    throw new Error(`Invalid curated-story campsite range: ${startKey} through ${endKey}.`);
  }

  return keys.slice(startIndex, endIndex + 1).map((key) => ({
    key,
    ...campsites[key],
  }));
};

const sumRecordedValue = (records, propertyName) => records.reduce((total, record) => {
  const value = asNumber(record.details?.[propertyName]);
  return value === null ? total : total + value;
}, 0);

const buildSceneStats = (definition, records, anchor) => {
  if (definition.type !== 'passage') {
    const details = anchor.details;

    return [
      { label: 'Camp', value: displayValue(details.camp) },
      { label: 'Hours on the Road', value: displayValue(details.hoursOnRoad) },
      { label: 'Miles Traveled', value: displayValue(details.milesTraveled) },
      { label: 'Pace', value: displayValue(details.pace, ' mph') },
      { label: 'Road Notes', value: displayValue(definition.roadNotes ?? details.roadNotes) },
    ];
  }

  const recordedHours = sumRecordedValue(records, 'hoursOnRoad');
  const recordedMiles = sumRecordedValue(records, 'milesTraveled');
  const averagePace = recordedHours > 0 ? recordedMiles / recordedHours : null;

  return [
    { label: 'Journey Span', value: definition.date },
    { label: 'Atlas Stops', value: `${records.length} dated ${records.length === 1 ? 'stop' : 'stops'}` },
    { label: 'Recorded Distance', value: recordedMiles > 0 ? `${formatNumber(recordedMiles)} miles` : 'Not recorded' },
    { label: 'Recorded Travel Time', value: recordedHours > 0 ? `${formatNumber(recordedHours)} hours` : 'Not recorded' },
    { label: 'Average Pace', value: averagePace === null ? 'Not recorded' : `${formatNumber(averagePace)} mph` },
    { label: 'Road Notes', value: displayValue(definition.roadNotes) },
  ];
};

export const buildCuratedStory = ({
  id,
  title,
  status = 'complete',
  chapters,
  campsites,
  markerGroupName,
  campCheckboxId,
  pathCheckboxId,
  pathKey,
  buildImage,
  imageBasePath,
}) => {
  const flattenedScenes = [];
  const chapterSummaries = chapters.map((chapter, chapterIndex) => {
    const startSceneIndex = flattenedScenes.length;

    chapter.scenes.forEach((definition) => {
      const startKey = definition.startKey ?? definition.markerKey;
      const endKey = definition.endKey ?? startKey;
      const markerKey = definition.markerKey ?? definition.anchorKey ?? endKey;
      const records = getCampsiteRange(campsites, startKey, endKey);
      const anchor = campsites[markerKey];

      if (!anchor) {
        throw new Error(`Curated story "${title}" references missing campsite "${markerKey}".`);
      }

      const imageFileName = definition.imageFileName;
      const scene = {
        ...definition,
        markerKey,
        rangeStartKey: startKey,
        rangeEndKey: endKey,
        rangeMarkerKeys: records.map((record) => record.key),
        coords: anchor.coords,
        date: definition.date ?? anchor.details.date,
        location: definition.location ?? anchor.details.camp,
        camp: anchor.details.camp,
        hoursOnRoad: displayValue(anchor.details.hoursOnRoad),
        milesTraveled: displayValue(anchor.details.milesTraveled),
        pace: displayValue(anchor.details.pace, ' mph'),
        roadNotes: displayValue(definition.roadNotes ?? anchor.details.roadNotes),
        stats: buildSceneStats(definition, records, anchor),
        imageFileName,
        image: buildImage(imageFileName),
        imageRelativePath: `${imageBasePath}/${imageFileName}`,
        sourceLabel: definition.sourceLabel ?? 'Timeline of Frodo Baggins',
        sourceUrl: definition.sourceUrl ?? frodoTimelineUrl,
        zoom: definition.zoom ?? 19,
        order: flattenedScenes.length + 1,
        chapter: {
          id: chapter.id,
          title: chapter.title,
          number: chapterIndex + 1,
          total: chapters.length,
        },
      };

      flattenedScenes.push(scene);
    });

    return {
      id: chapter.id,
      title: chapter.title,
      number: chapterIndex + 1,
      startSceneIndex,
      sceneCount: flattenedScenes.length - startSceneIndex,
    };
  });

  return {
    id,
    title,
    status,
    markerGroupName,
    campCheckboxId,
    pathCheckboxId,
    pathKey,
    chapters: chapterSummaries,
    scenes: flattenedScenes,
  };
};

const samFrodoStory = buildCuratedStory({
  id: 'sam-frodo-road-to-mount-doom',
  title: 'Sam and Frodo: The Road to Mount Doom',
  markerGroupName: 'samfrodocampsites',
  campCheckboxId: 'samfrodocampsitesCheckbox',
  pathCheckboxId: 'samfrodopathCheckbox',
  pathKey: 'samfrodopath',
  campsites: samfrodocampsites,
  buildImage: buildSamFrodoImage,
  imageBasePath: 'maps/middle_earth/assets/stories/sam_frodo',
  chapters: [
    {
      id: 'shadow-leaves-the-shire',
      title: 'The Shadow Leaves the Shire',
      scenes: [
        {
          type: 'moment',
          markerKey: 'September23',
          title: 'The First Steps East',
          location: 'Green Hill Country',
          narrative: 'Frodo leaves Bag End with Sam and Pippin beneath the cover of an ordinary move to Buckland. The hills are still the green country of home, yet the familiar lanes already feel altered by secrecy. What begins as an evening walk is the first stage of a burden that will carry the Ring-bearer far beyond every place he knows.',
          imageFileName: 'journey-01.webp',
        },
        {
          type: 'moment',
          markerKey: 'September24',
          title: 'Riders Beneath the Trees',
          location: 'Woody End',
          narrative: 'A Black Rider searches the road, and the hobbits learn that pursuit has entered the Shire itself. After hiding twice from that dreadful presence, they meet Gildor and his wandering Elves beneath the stars. Terror and beauty arrive on the same night, revealing how much larger—and more perilous—the world has become.',
          imageFileName: 'journey-02.webp',
        },
        {
          type: 'passage',
          startKey: 'September25',
          endKey: 'September27',
          anchorKey: 'September26',
          title: 'Beyond Buckland',
          date: 'September 25–27',
          location: 'Buckland and the Old Forest',
          narrative: 'Farmer Maggot carries the travelers toward the Brandywine, and at Crickhollow Frodo discovers that his friends have already guessed his purpose and refuse to let him go alone. Their escape through the Old Forest nearly ends beneath Old Man Willow. Tom Bombadil’s house then offers two precious nights of safety before the road turns colder.',
          roadNotes: 'Farmer Maggot, the Bucklebury Ferry, Old Man Willow, and shelter with Tom Bombadil.',
          imageFileName: 'journey-03.webp',
        },
        {
          type: 'passage',
          startKey: 'September28',
          endKey: 'September30',
          anchorKey: 'September29',
          title: 'From the Barrow to Bree',
          date: 'September 28–30',
          location: 'The Barrow-downs and Bree',
          narrative: 'A Barrow-wight traps the four hobbits among the ancient downs, but Frodo resists the temptation to vanish with the Ring and calls for help. Freed by Bombadil, they reach Bree and the Prancing Pony, where one reckless moment exposes Frodo to unfriendly eyes. The mysterious Strider becomes their guide, and the road leaves Hobbit-country behind.',
          roadNotes: 'Captured in the Barrow-downs; rescued by Bombadil; arrival at Bree; Strider joins the company.',
          imageFileName: 'journey-04.webp',
        },
      ],
    },
    {
      id: 'a-fellowship-forged',
      title: 'A Fellowship Forged',
      scenes: [
        {
          type: 'passage',
          startKey: 'October1',
          endKey: 'October6',
          anchorKey: 'October6',
          title: 'A Knife on Weathertop',
          date: 'October 1–6',
          location: 'The Weather Hills',
          narrative: 'Strider leads the hobbits through marsh and broken country while distant flashes warn that danger has passed before them. At Weathertop the Nazgûl close in. Frodo is wounded by the Witch-king, and although his companions drive the attackers away, a fragment of the Morgul-blade begins drawing him toward the wraith-world.',
          roadNotes: 'Across the Midgewater Marshes to Weathertop; attacked by the Nazgûl at moonrise.',
          imageFileName: 'journey-05.webp',
        },
        {
          type: 'passage',
          startKey: 'October7',
          endKey: 'October20throughDecember24',
          anchorKey: 'October20throughDecember24',
          title: 'The Ford and the Choice',
          date: 'October 7–December 24',
          location: 'The Ford of Bruinen and Rivendell',
          narrative: 'Frodo weakens as Strider presses toward Rivendell. Glorfindel finds the company in the Trollshaws and lends Frodo his horse for the final flight. Beyond the Ford, Elrond heals the wound that would have enslaved him. At the Council, Frodo freely accepts the task that fear and pursuit have prepared him to understand: he will carry the Ring toward Mordor.',
          roadNotes: 'The Trollshaws, Glorfindel, the flight across the Ford, recovery, and the Council of Elrond.',
          imageFileName: 'journey-06.webp',
        },
      ],
    },
    {
      id: 'the-fellowship',
      title: 'The Fellowship',
      scenes: [
        {
          type: 'passage',
          startKey: 'December25',
          endKey: 'January12',
          anchorKey: 'January11',
          title: 'Winter Under the Mountains',
          date: 'December 25–January 12',
          location: 'Hollin and the Redhorn Pass',
          narrative: 'Nine walkers leave Rivendell under winter stars. Their southern road grows harsher through Hollin until snow and bitter wind defeat the attempt to cross Caradhras. Forced down from the pass and attacked by wolves, the Fellowship turns toward the one road nearly all of them wished to avoid: the dark gate of Moria.',
          roadNotes: 'The Fellowship travels south through Hollin; snow closes the Redhorn Pass; wolves attack after the retreat.',
          imageFileName: 'journey-07.webp',
        },
        {
          type: 'passage',
          startKey: 'January13',
          endKey: 'January15',
          anchorKey: 'January15',
          title: 'Through the Black Pit',
          date: 'January 13–15',
          location: 'Moria and the Dimrill Dale',
          narrative: 'The West-gate shuts behind the Fellowship, and the long dark of Khazad-dûm closes around them. In Balin’s ruined chamber they learn the fate of the colony and are driven toward the Bridge by drums and fire. Gandalf holds the narrow crossing against the Balrog and falls. The survivors escape into daylight carrying a grief too large for words.',
          roadNotes: 'The West-gate, Balin’s tomb, the Bridge of Khazad-dûm, and flight to the woods beside Nimrodel.',
          imageFileName: 'journey-08.webp',
        },
        {
          type: 'passage',
          startKey: 'January16',
          endKey: 'February25',
          anchorKey: 'February25',
          title: 'The Golden Wood and the Great River',
          date: 'January 16–February 25',
          location: 'Lothlórien, the Anduin, and Parth Galen',
          narrative: 'Lothlórien gives the Company time to mourn, and Galadriel tests the hopes and fears each traveler carries. After Frodo looks into her Mirror, the Fellowship departs with gifts and boats. The Anduin bears them past danger, the rapids, and the towering Argonath until they reach Parth Galen, where the choice of roads can no longer be delayed.',
          roadNotes: 'Rest in Lothlórien; the Mirror of Galadriel; departure by boat; Sarn Gebir, the Argonath, and Parth Galen.',
          imageFileName: 'journey-09.webp',
        },
        {
          type: 'moment',
          markerKey: 'February26',
          title: 'The Choice at Amon Hen',
          location: 'Eastern Emyn Muil',
          narrative: 'Boromir, desperate to defend his people, tries to take the Ring, and Frodo finally understands that its pressure will divide the Company wherever he leads them. He resolves to cross the river alone. Sam reads his purpose, follows him into the water, and refuses to be left behind. From this moment the Quest belongs to the two of them.',
          roadNotes: 'The Fellowship breaks; Frodo crosses the Anduin and Sam follows.',
          imageFileName: 'journey-10.webp',
        },
      ],
    },
    {
      id: 'a-secret-way',
      title: 'A Secret Way into Mordor',
      scenes: [
        {
          type: 'passage',
          startKey: 'February27',
          endKey: 'February30',
          anchorKey: 'February30',
          title: 'A Guide in the Emyn Muil',
          date: 'February 27–30',
          location: 'The Emyn Muil',
          narrative: 'Lost among cliffs and gullies, Frodo and Sam discover that Gollum has followed them from Moria. They capture him, and Frodo chooses restraint where suspicion would be easier. Bound by a promise to the Ring-bearer, Gollum becomes their guide. The road now depends upon the divided creature who both hates and longs for the burden Frodo carries.',
          roadNotes: 'Descent through the Emyn Muil; Gollum is captured and agrees to guide the hobbits.',
          imageFileName: 'journey-11.webp',
        },
        {
          type: 'passage',
          startKey: 'March1',
          endKey: 'March5',
          anchorKey: 'March5',
          title: 'The Marshes and the Black Gate',
          date: 'March 1–5',
          location: 'The Dead Marshes and the Morannon',
          narrative: 'Gollum leads the hobbits across drowned ground where pale lights hover over the memory of an ancient battlefield. Beyond the marshes, the Black Gate reveals itself as no secret entrance but an armed impossibility. Frodo turns away only when Gollum offers another path, a hidden road south through Ithilien toward the mountains of shadow.',
          roadNotes: 'Night travel through the Dead Marshes; arrival before the Black Gate; Gollum proposes a secret way.',
          imageFileName: 'journey-12.webp',
        },
        {
          type: 'passage',
          startKey: 'March6',
          endKey: 'March8',
          anchorKey: 'March7part2',
          title: 'The Window on the West',
          date: 'March 6–8',
          location: 'Ithilien and Henneth Annûn',
          narrative: 'In the green refuge of Ithilien, Frodo and Sam are discovered by Faramir’s rangers. Faramir learns enough to understand both their danger and Boromir’s fall, yet he refuses the temptation his brother could not withstand. At Henneth Annûn, Frodo saves Gollum from the Forbidden Pool before the travelers are released to continue toward Cirith Ungol.',
          roadNotes: 'Encounter with Faramir’s company; Henneth Annûn; Gollum at the Forbidden Pool.',
          imageFileName: 'journey-13.webp',
        },
        {
          type: 'passage',
          startKey: 'March9',
          endKey: 'March11',
          anchorKey: 'March10',
          title: 'The Road to Minas Morgul',
          date: 'March 9–11',
          location: 'The Cross-roads and Morgul Vale',
          narrative: 'Under the first darkness of the Dawnless Day, the travelers reach the Cross-roads and glimpse a fallen king’s stone head crowned with small flowers. Hope lasts only a moment. In the Morgul Vale, Frodo watches the Witch-king lead a vast host from the dead city and fights the Ring’s command to reveal himself before beginning the climb above the valley.',
          roadNotes: 'The Cross-roads, the Dawnless Day, the Morgul-host, and the ascent of the Winding Stair.',
          imageFileName: 'journey-14.webp',
        },
      ],
    },
    {
      id: 'the-land-of-shadow',
      title: 'The Land of Shadow',
      scenes: [
        {
          type: 'passage',
          startKey: 'March12',
          endKey: 'March13throughMarch14',
          anchorKey: 'March12',
          title: 'Shelob’s Lair',
          date: 'March 12–13',
          location: 'Cirith Ungol',
          narrative: 'Gollum’s promised passage is a tunnel belonging to Shelob. Sam drives the great spider away, but not before Frodo is stung and lies still. Believing his master dead, Sam takes the Ring so the Quest may continue. Only after Orcs carry Frodo away does he learn the terrible truth: Frodo is alive, imprisoned beyond the pass.',
          roadNotes: 'Gollum’s betrayal; Shelob attacks; Sam takes the Ring; Orcs carry Frodo to the Tower.',
          imageFileName: 'journey-15.webp',
        },
        {
          type: 'passage',
          startKey: 'March13throughMarch14',
          endKey: 'March15',
          anchorKey: 'March13throughMarch14',
          title: 'The Tower of Cirith Ungol',
          date: 'March 13–15',
          location: 'The Tower of Cirith Ungol',
          narrative: 'Sam crosses the pass alone and enters the Tower, where rivalry among the Orcs has nearly emptied the fortress for him. He finds Frodo, returns the Ring despite its growing hold, and clothes them both in enemy gear. Reunited, the two hobbits escape into Mordor—not restored, but resolved to spend what strength remains.',
          roadNotes: 'Sam enters the Tower, rescues Frodo, returns the Ring, and escapes with him into Mordor.',
          imageFileName: 'journey-16.webp',
        },
        {
          type: 'passage',
          startKey: 'March16',
          endKey: 'March24',
          anchorKey: 'March24',
          title: 'Across the Land of Shadow',
          date: 'March 16–24',
          location: 'The Morgai and Gorgoroth',
          narrative: 'The hobbits first travel north along the Morgai, then cross the desolation toward Mount Doom while Mordor’s armies stream elsewhere. They are swept into an Orc march, escape in confusion, ration the last water, and abandon every piece of gear that can be spared. By the mountain’s foot, Frodo can scarcely crawl, and Sam carries both friend and hope forward.',
          roadNotes: 'The Morgai, an enforced Orc march, the last water, the casting-away of gear, and the final approach to Mount Doom.',
          imageFileName: 'journey-17.webp',
        },
        {
          type: 'moment',
          markerKey: 'March25',
          title: 'The Fire and the End',
          location: 'The Chambers of Fire',
          narrative: 'At the Cracks of Doom, the long burden finally overmasters Frodo and he claims the Ring. Gollum attacks, seizes it, and falls with it into the fire. The Quest succeeds through a chain of pity and mercy that no plan could command. As the foundations of Sauron’s power collapse, Frodo and Sam emerge together onto the ruin of the mountain.',
          imageFileName: 'journey-18.webp',
        },
      ],
    },
  ],
});

const gandalfTheWhiteScenes = [
  {
    markerKey: 'February14',
    title: 'Awakening on Zirakzigil',
    date: 'February 14',
    location: 'Peak of the Silvertine (Celebdil)',
    narrative: 'After his struggle with the Balrog is ended, Gandalf returns to life high upon Zirakzigil. Alone on the wind-scoured peak, he lies in a trance while Middle-earth moves on below him, and the Grey Pilgrim begins to pass into a new and greater charge.',
    camp: 'Peak of the Silvertine (Celebdil) Mountain',
    hoursOnRoad: 'Unknown',
    milesTraveled: 'Unknown',
    pace: 'Unknown',
    roadNotes: 'Gandalf returns to life and lies upon the peak in a trance.',
    imageFileName: 'scene-01.png',
  },
  {
    markerKey: 'February17',
    title: 'Gwaihir Bears Him to Lothlorien',
    date: 'February 17',
    location: 'Lothlorien',
    narrative: 'Three days later, Gwaihir the Windlord finds Gandalf on the heights and carries him away from the mountains. The journey is swift and strange: from the white crown of Celebdil to the golden refuge of Lothlorien, where rest, counsel, and renewal await the newly returned wizard.',
    camp: 'Lothlorien',
    hoursOnRoad: 'Unknown',
    milesTraveled: 'Unknown',
    pace: 'Unknown',
    roadNotes: 'Gwaihir carries Gandalf south from the mountains into Lothlorien.',
    imageFileName: 'scene-02.png',
  },
  {
    markerKey: 'February18',
    title: 'Galadriel Clothes Him in White',
    date: 'February 18',
    location: 'Lothlorien',
    narrative: 'Gandalf arrives in Lothlorien for much-needed rest and respite. Galadriel recognizes the sacrifice he made defending the Fellowship and clothes him in white. Steadfast in his mission to help the free peoples resist Sauron, the Grey Pilgrim takes up his new charge as Gandalf the White.',
    camp: 'Lothlorien',
    hoursOnRoad: 'Unknown',
    milesTraveled: 'Unknown',
    pace: 'Unknown',
    roadNotes: 'Galadriel clothes Gandalf in white for the work still before him.',
    imageFileName: 'scene-03.png',
  },
].map((scene, index) => ({
  ...scene,
  coords: gandalfthewhitecampsites[scene.markerKey].coords,
  image: buildGandalfTheWhiteImage(scene.imageFileName),
  imageRelativePath: `maps/middle_earth/assets/stories/gandalf_the_white/${scene.imageFileName}`,
  stats: [
    { label: 'Camp', value: scene.camp },
    { label: 'Hours on the Road', value: scene.hoursOnRoad },
    { label: 'Miles Traveled', value: scene.milesTraveled },
    { label: 'Pace', value: scene.pace },
    { label: 'Road Notes', value: scene.roadNotes },
  ],
  chapter: {
    id: 'the-white-rider',
    title: 'The White Rider',
    number: 1,
    total: 1,
  },
  zoom: 19,
  order: index + 1,
}));

export const curatedStories = [
  samFrodoStory,
  {
    id: 'gandalf-the-white-first-two',
    title: 'Gandalf the White: From Zirakzigil to Lothlorien',
    status: 'prototype',
    markerGroupName: 'gandalfthewhitecampsites',
    campCheckboxId: 'gandalfthewhitecampsitesCheckbox',
    pathCheckboxId: 'gandalfthewhitepathCheckbox',
    pathKey: 'gandalfthewhitepath',
    chapters: [
      {
        id: 'the-white-rider',
        title: 'The White Rider',
        number: 1,
        startSceneIndex: 0,
        sceneCount: gandalfTheWhiteScenes.length,
      },
    ],
    scenes: gandalfTheWhiteScenes,
  },
];

export const getCuratedStoryById = (storyId) => {
  return curatedStories.find((story) => story.id === storyId) || null;
};

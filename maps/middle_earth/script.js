// script.js

import {
  PathListeners,
  MarkerListeners,
  createGeographicShape,
  createMarkers,
  createMarkerClusterGroup,
  buildMarkers,
  setCampsiteHoverPopupsEnabled,
} from './functions.js';

import {
  settlementsData,
  pathData,
  roadData,
  geographicData,
  imageUrl,
  map,
  imageBounds,
} from './variables.js';

import { getCuratedStoryById } from './stories.js';

// Add Map
map.options.wheelPxPerZoomLevel = 40; 
L.imageOverlay(imageUrl, imageBounds).addTo(map);
map.fitBounds(imageBounds);
var sidebar = L.control.sidebar('sidebar').addTo(map);
const sharedClusterGroups = {};
const STORY_PANE_NAME = 'storyPane';

const ensureStoryPane = () => {
  if (!map.getPane(STORY_PANE_NAME)) {
    map.createPane(STORY_PANE_NAME);
  }
};

ensureStoryPane();

// Add Campsites, Settlements, Items
Promise.all(
  settlementsData.map(({ data, checkboxId, groupName, campsite, clusterScope }) => ({
    checkboxId,
    groupName,
    campsite,
    clusterScope,
    data,
  }))
).then((markerEntries) => {
  const sharedClusterEntries = markerEntries.filter(
    ({ clusterScope }) =>
      clusterScope === 'sharedSettlementCluster' ||
      clusterScope === 'sharedCampsiteCluster' ||
      clusterScope === 'sharedItemCluster' ||
      clusterScope === 'sharedBattleCluster'
  );

  const categoryClusterEntries = markerEntries.filter(
    ({ clusterScope }) =>
      clusterScope !== 'sharedSettlementCluster' &&
      clusterScope !== 'sharedCampsiteCluster' &&
      clusterScope !== 'sharedItemCluster' &&
      clusterScope !== 'sharedBattleCluster'
  );

  const sharedClusterConfig = {
    sharedSettlementCluster: {
      maxClusterRadius: 50,
    },
    sharedCampsiteCluster: {
      maxClusterRadius: 50,
    },
    sharedItemCluster: {
      maxClusterRadius: 25,
    },
    sharedBattleCluster: {
      maxClusterRadius: 25,
    },
  };

  const syncSharedCluster = (clusterScope) => {
    const activeMarkers = [];
    const entries = sharedClusterEntries.filter((entry) => entry.clusterScope === clusterScope);

    entries.forEach(({ checkboxId, groupName, data, campsite }) => {
      const checkbox = document.getElementById(checkboxId);

      if (!checkbox?.checked) {
        return;
      }

      const markers = buildMarkers(data, campsite, groupName);

      Object.values(markers).forEach((marker) => {
        activeMarkers.push(marker);
      });
    });

    if (sharedClusterGroups[clusterScope]) {
      if (map.hasLayer(sharedClusterGroups[clusterScope])) {
        map.removeLayer(sharedClusterGroups[clusterScope]);
      }

      sharedClusterGroups[clusterScope].clearLayers();
    }

    if (activeMarkers.length === 0) {
      sharedClusterGroups[clusterScope] = null;
      return;
    }

    sharedClusterGroups[clusterScope] = createMarkerClusterGroup(sharedClusterConfig[clusterScope]);

    sharedClusterGroups[clusterScope].addLayers(activeMarkers);
    map.addLayer(sharedClusterGroups[clusterScope]);
  };

  sharedClusterEntries.forEach(({ checkboxId, clusterScope }) => {
    const checkbox = document.getElementById(checkboxId);
    checkbox?.addEventListener('change', () => syncSharedCluster(clusterScope));
  });

  Object.keys(sharedClusterConfig).forEach((clusterScope) => {
    syncSharedCluster(clusterScope);
  });

  categoryClusterEntries.forEach(({ checkboxId, groupName, data, campsite }) => {
    const clusterGroup = createMarkerClusterGroup();

    createMarkers(data, campsite, clusterGroup, groupName).then(({ markers, clusterGroup }) => {
      MarkerListeners(checkboxId, { markers, clusterGroup }, map);
    });
  });
});
 
// Add Paths and Roads
[pathData, roadData].forEach((data) => {
  createGeographicShape(data).then((polygons) => {
    PathListeners(polygons, map);
  });
});

// Add Geographic Features
geographicData.forEach(({ data, checkboxId }) => {
  createGeographicShape(data).then((polygons) => {
  MarkerListeners(checkboxId, polygons, map);
  });
});

// Add "All" Checkboxes
const checkboxMappings = {
  allItemCheckbox: "#itemsSection input.itemCheckbox",
  allBattleCheckbox: "#battlesSection input.battleCheckbox",
  allGeographyCheckbox: "#geographySection input.geographyCheckbox",
  allSettlementCheckbox: "#settlementsSection input.settlementCheckbox",
  allPathCheckbox: "#pathsSection input.pathCheckbox",
  allCampCheckbox: "#campsSection input.campCheckbox",
  allRegionCheckbox: "#regionsSection input.regionCheckbox",
  allRoadCheckbox: "#roadsSection input.roadCheckbox"
};
Object.keys(checkboxMappings).forEach(masterCheckboxId => {
  document.getElementById(masterCheckboxId).addEventListener("change", function () {
    document.querySelectorAll(checkboxMappings[masterCheckboxId]).forEach(checkbox => {
      checkbox.checked = this.checked;
      checkbox.dispatchEvent(new Event("change")); // Ensures MarkerListeners function runs
    });
  });
});

const storyPanel = document.getElementById('storyPanel');
const storyControls = document.getElementById('storyControls');
const storyKicker = document.getElementById('storyKicker');
const storySceneTitle = document.getElementById('storySceneTitle');
const storySceneMeta = document.getElementById('storySceneMeta');
const storySceneNarrative = document.getElementById('storySceneNarrative');
const storySceneCamp = document.getElementById('storySceneCamp');
const storySceneHours = document.getElementById('storySceneHours');
const storySceneMiles = document.getElementById('storySceneMiles');
const storyScenePace = document.getElementById('storyScenePace');
const storySceneNotes = document.getElementById('storySceneNotes');
const storySceneCounter = document.getElementById('storySceneCounter');
const storySceneImage = document.getElementById('storySceneImage');
const storySceneImagePlaceholder = document.getElementById('storySceneImagePlaceholder');
const storySceneImagePath = document.getElementById('storySceneImagePath');
const storyPlayPauseButton = document.getElementById('storyPlayPauseButton');
const storyPrevButton = document.getElementById('storyPrevButton');
const storyNextButton = document.getElementById('storyNextButton');
const storyStopButton = document.getElementById('storyStopButton');

const storyState = {
  activeStory: null,
  currentSceneIndex: 0,
  isPlaying: false,
  timerId: null,
  previousView: null,
  highlightLayer: null,
  routeLayer: null,
  sceneMarkersLayer: null,
};

const STORY_AUTOPLAY_MS = 4500;

const restoreMapInteractions = () => {
  map.dragging?.enable();
  map.doubleClickZoom?.enable();
  map.scrollWheelZoom?.enable();
  map.boxZoom?.enable();
  map.keyboard?.enable();
  map.touchZoom?.enable();
  map.tap?.enable?.();
  map.getContainer().style.pointerEvents = 'auto';

  window.requestAnimationFrame(() => {
    map.invalidateSize(false);
  });
};

const syncStoryPlayPauseButton = () => {
  const icon = storyPlayPauseButton.querySelector('.material-icons');
  const label = storyPlayPauseButton.querySelector('span');

  icon.textContent = storyState.isPlaying ? 'pause' : 'play_arrow';
  label.textContent = storyState.isPlaying ? 'Pause' : 'Play';
};

const clearStoryTimer = () => {
  if (storyState.timerId) {
    window.clearInterval(storyState.timerId);
    storyState.timerId = null;
  }
};

const removeStoryLayer = (layer) => {
  if (layer && map.hasLayer(layer)) {
    map.removeLayer(layer);
  }
};

const ensureStoryLayersVisible = (story) => {
  const routeLatLngs = story.scenes.map((scene) => scene.coords);

  if (!storyState.routeLayer) {
    storyState.routeLayer = L.polyline(routeLatLngs, {
      color: '#d9b161',
      weight: 6,
      opacity: 0.92,
      interactive: false,
      pane: STORY_PANE_NAME,
    }).addTo(map);
  }

  if (!storyState.sceneMarkersLayer) {
    const sceneMarkers = story.scenes.map((scene, index) => L.circleMarker(scene.coords, {
      radius: index === storyState.currentSceneIndex ? 9 : 6,
      color: '#f7e5b5',
      weight: 2,
      fillColor: '#6f4820',
      fillOpacity: index === storyState.currentSceneIndex ? 0.92 : 0.72,
      interactive: false,
      pane: STORY_PANE_NAME,
    }));

    storyState.sceneMarkersLayer = L.layerGroup(sceneMarkers).addTo(map);
  }
};

const restoreStoryLayers = () => {
  removeStoryLayer(storyState.routeLayer);
  removeStoryLayer(storyState.sceneMarkersLayer);
  removeStoryLayer(storyState.highlightLayer);

  storyState.routeLayer = null;
  storyState.sceneMarkersLayer = null;
  storyState.highlightLayer = null;
};

const showStoryImagePlaceholder = (scene) => {
  storySceneImage.classList.add('story-panel__image--hidden');
  storySceneImagePlaceholder?.classList.remove('story-panel__placeholder--hidden');

  if (storySceneImagePath) {
    storySceneImagePath.textContent = scene.imageRelativePath;
  }
};

const hideStoryImagePlaceholder = () => {
  storySceneImage.classList.remove('story-panel__image--hidden');
  storySceneImagePlaceholder?.classList.add('story-panel__placeholder--hidden');
};

const setStoryImage = (scene) => {
  storySceneImage.alt = `${scene.title} illustration`;
  storySceneImage.dataset.expectedPath = scene.imageRelativePath;
  hideStoryImagePlaceholder();

  storySceneImage.onerror = () => {
    showStoryImagePlaceholder(scene);
  };

  storySceneImage.onload = () => {
    hideStoryImagePlaceholder();
  };

  storySceneImage.src = scene.image;
};

const updateStoryHighlight = (coords) => {
  if (!storyState.highlightLayer) {
    storyState.highlightLayer = L.circleMarker(coords, {
      radius: 18,
      color: '#f4dba8',
      weight: 3,
      fillColor: '#6f4820',
      fillOpacity: 0.28,
      interactive: false,
      pane: STORY_PANE_NAME,
    }).addTo(map);
    return;
  }

  storyState.highlightLayer.setLatLng(coords);
};

const updateStorySceneMarkers = () => {
  if (!storyState.sceneMarkersLayer) {
    return;
  }

  storyState.sceneMarkersLayer.getLayers().forEach((layer, index) => {
    const isActive = index === storyState.currentSceneIndex;

    layer.setRadius(isActive ? 9 : 6);
    layer.setStyle({
      fillOpacity: isActive ? 0.92 : 0.72,
    });
  });
};

const goToStoryScene = (sceneIndex) => {
  const story = storyState.activeStory;

  if (!story) {
    return;
  }

  const boundedIndex = Math.max(0, Math.min(sceneIndex, story.scenes.length - 1));
  const scene = story.scenes[boundedIndex];
  storyState.currentSceneIndex = boundedIndex;

  storyKicker.textContent = story.title;
  storySceneTitle.textContent = scene.title;
  storySceneMeta.textContent = `${scene.date} • ${scene.location}`;
  storySceneNarrative.textContent = scene.narrative;
  storySceneCamp.textContent = scene.camp;
  storySceneHours.textContent = scene.hoursOnRoad;
  storySceneMiles.textContent = scene.milesTraveled;
  storyScenePace.textContent = scene.pace;
  storySceneNotes.textContent = scene.roadNotes;
  storySceneCounter.textContent = `Scene ${boundedIndex + 1} of ${story.scenes.length}`;
  setStoryImage(scene);
  updateStoryHighlight(scene.coords);
  updateStorySceneMarkers();

  map.stop();
  map.flyTo(scene.coords, scene.zoom ?? 19, {
    animate: true,
    duration: 1.1,
  });
};

const stopStoryMode = () => {
  clearStoryTimer();
  storyState.isPlaying = false;
  syncStoryPlayPauseButton();
  setCampsiteHoverPopupsEnabled(true);
  map.stop();
  restoreStoryLayers();

  if (storyState.previousView) {
    map.setView(storyState.previousView.center, storyState.previousView.zoom, {
      animate: false,
    });
    storyState.previousView = null;
  }

  map.closePopup();
  storyState.activeStory = null;
  storyPanel.classList.add('story-panel--hidden');
  storyPanel.setAttribute('hidden', '');
  storyPanel.setAttribute('aria-hidden', 'true');
  storyPanel.style.display = 'none';
  storyPanel.style.pointerEvents = 'none';
  storyControls.classList.add('story-controls--hidden');
  storyControls.setAttribute('hidden', '');
  storyControls.setAttribute('aria-hidden', 'true');
  storyControls.style.display = 'none';
  storyControls.style.pointerEvents = 'none';
  restoreMapInteractions();
};

const nextStoryScene = () => {
  if (!storyState.activeStory) {
    return;
  }

  if (storyState.currentSceneIndex >= storyState.activeStory.scenes.length - 1) {
    stopStoryMode();
    return;
  }

  goToStoryScene(storyState.currentSceneIndex + 1);
};

const previousStoryScene = () => {
  if (!storyState.activeStory) {
    return;
  }

  goToStoryScene(storyState.currentSceneIndex - 1);
};

const startStoryPlayback = () => {
  clearStoryTimer();
  storyState.isPlaying = true;
  syncStoryPlayPauseButton();
  storyState.timerId = window.setInterval(nextStoryScene, STORY_AUTOPLAY_MS);
};

const pauseStoryPlayback = () => {
  clearStoryTimer();
  storyState.isPlaying = false;
  syncStoryPlayPauseButton();
};

const beginStoryMode = (storyId) => {
  const story = getCuratedStoryById(storyId);

  if (!story) {
    return;
  }

  stopStoryMode();
  storyState.activeStory = story;
  storyState.currentSceneIndex = 0;
  storyState.previousView = {
    center: map.getCenter(),
    zoom: map.getZoom(),
  };
  ensureStoryLayersVisible(story);
  setCampsiteHoverPopupsEnabled(false);
  map.closePopup();
  sidebar.close();
  storyPanel.removeAttribute('hidden');
  storyPanel.setAttribute('aria-hidden', 'false');
  storyPanel.style.display = '';
  storyPanel.style.pointerEvents = '';
  storyPanel.classList.remove('story-panel--hidden');
  storyControls.removeAttribute('hidden');
  storyControls.setAttribute('aria-hidden', 'false');
  storyControls.style.display = '';
  storyControls.style.pointerEvents = '';
  storyControls.classList.remove('story-controls--hidden');
  pauseStoryPlayback();
  goToStoryScene(0);
};

document.querySelectorAll('[data-story-id]').forEach((button) => {
  button.addEventListener('click', () => {
    beginStoryMode(button.dataset.storyId);
  });
});

storyPlayPauseButton.addEventListener('click', () => {
  if (!storyState.activeStory) {
    return;
  }

  if (storyState.isPlaying) {
    pauseStoryPlayback();
  } else {
    startStoryPlayback();
  }
});

storyPrevButton.addEventListener('click', () => {
  pauseStoryPlayback();
  previousStoryScene();
});

storyNextButton.addEventListener('click', () => {
  pauseStoryPlayback();
  nextStoryScene();
});

storyStopButton.addEventListener('click', () => {
  stopStoryMode();
});

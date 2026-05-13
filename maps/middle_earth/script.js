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
  baseTileUrl,
  baseTileOptions,
  map,
  imageBounds,
} from './variables.js';

import { getCuratedStoryById } from './stories.js';

// Add Map
map.options.wheelPxPerZoomLevel = 40; 
L.tileLayer(baseTileUrl, baseTileOptions).addTo(map);
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

// Add Campsites, Settlements, Items and Clustering
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
      clusterScope === 'sharedBattleCluster' ||
      clusterScope === 'sharedProvisionCluster'
  );

  const categoryClusterEntries = markerEntries.filter(
    ({ clusterScope }) =>
      clusterScope !== 'sharedSettlementCluster' &&
      clusterScope !== 'sharedCampsiteCluster' &&
      clusterScope !== 'sharedItemCluster' &&
      clusterScope !== 'sharedBattleCluster' &&
      clusterScope !== 'sharedProvisionCluster'
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
    sharedProvisionCluster: {
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
  allRoadCheckbox: "#roadsSection input.roadCheckbox",
  allProvisionCheckbox: "#provisionsSection input.provisionCheckbox",
};
Object.keys(checkboxMappings).forEach(masterCheckboxId => {
  const masterCheckbox = document.getElementById(masterCheckboxId);

  if (!masterCheckbox) {
    return;
  }

  masterCheckbox.addEventListener("change", function () {
    document.querySelectorAll(checkboxMappings[masterCheckboxId]).forEach(checkbox => {
      checkbox.checked = this.checked;
      checkbox.dispatchEvent(new Event("change")); // Ensures MarkerListeners function runs
    });
  });
});

const storyPanel = document.getElementById('storyPanel');
const storyPanelSummaryButton = document.getElementById('storyPanelSummaryButton');
const storyPanelBody = document.getElementById('storyPanelBody');
const storyControls = document.getElementById('storyControls');
const storyKicker = document.getElementById('storyKicker');
const storySceneTitle = document.getElementById('storySceneTitle');
const storySceneMeta = document.getElementById('storySceneMeta');
const storySceneSummaryTitle = document.getElementById('storySceneSummaryTitle');
const storySceneSummaryMeta = document.getElementById('storySceneSummaryMeta');
const storySceneSummaryCounter = document.getElementById('storySceneSummaryCounter');
const storySceneNarrative = document.getElementById('storySceneNarrative');
const storySceneCamp = document.getElementById('storySceneCamp');
const storySceneHours = document.getElementById('storySceneHours');
const storySceneMiles = document.getElementById('storySceneMiles');
const storyScenePace = document.getElementById('storyScenePace');
const storySceneNotes = document.getElementById('storySceneNotes');
const storySceneCounter = document.getElementById('storySceneCounter');
const storySceneImage = document.getElementById('storySceneImage');
const storyScenePreviewImage = document.getElementById('storyScenePreviewImage');
const storyScenePreviewPlaceholder = document.getElementById('storyScenePreviewPlaceholder');
const storySceneImagePlaceholder = document.getElementById('storySceneImagePlaceholder');
const storySceneImagePath = document.getElementById('storySceneImagePath');
const storyPlayPauseButton = document.getElementById('storyPlayPauseButton');
const storyPrevButton = document.getElementById('storyPrevButton');
const storyNextButton = document.getElementById('storyNextButton');
const storyStopButton = document.getElementById('storyStopButton');
const mobileStoryModeQuery = window.matchMedia('(max-width: 860px)');
const landscapeStoryModeQuery = window.matchMedia('(max-width: 860px) and (orientation: landscape)');
const MOBILE_STORY_PANEL_STATES = ['peek', 'expanded', 'full'];
const STORY_TOUCH_SWIPE_THRESHOLD = 44;

const storyState = {
  activeStory: null,
  currentSceneIndex: 0,
  isPlaying: false,
  timerId: null,
  previousView: null,
  highlightLayer: null,
  routeLayer: null,
  sceneMarkersLayer: null,
  imageLoadToken: 0,
  imageCache: new Map(),
  mobilePanelState: 'peek',
  landscapeDetailsOpen: false,
  touchStartY: null,
  touchGestureHandled: false,
};

const STORY_AUTOPLAY_MS = 4500;

const isMobileStoryMode = () => mobileStoryModeQuery.matches;
const isLandscapeStoryMode = () => landscapeStoryModeQuery.matches;
const usesBottomSheetStoryMode = () => isMobileStoryMode() && !isLandscapeStoryMode();
const usesLandscapeStoryHudMode = () => isLandscapeStoryMode();

const invalidateStoryLayout = () => {
  window.requestAnimationFrame(() => {
    map.invalidateSize(false);
  });
};

const restoreMapInteractions = () => {
  map.dragging?.enable();
  map.doubleClickZoom?.enable();
  map.scrollWheelZoom?.enable();
  map.boxZoom?.enable();
  map.keyboard?.enable();
  map.touchZoom?.enable();
  map.tap?.enable?.();
  map.getContainer().style.pointerEvents = 'auto';
  invalidateStoryLayout();
};

const syncStorySummaryToggle = () => {
  if (!storyPanelSummaryButton) {
    return;
  }

  const isExpanded = usesBottomSheetStoryMode()
    ? storyState.mobilePanelState !== 'peek'
    : usesLandscapeStoryHudMode()
      ? storyState.landscapeDetailsOpen
      : true;
  const buttonLabel = usesLandscapeStoryHudMode()
    ? (storyState.landscapeDetailsOpen ? 'Hide story details' : 'Show story details')
    : storyState.mobilePanelState === 'peek'
      ? 'Expand story details'
      : 'Collapse story details';

  storyPanelSummaryButton.setAttribute('aria-expanded', String(isExpanded));
  storyPanelSummaryButton.setAttribute('aria-label', buttonLabel);
};

const getStoryMobileOffsetPixels = () => {
  if (usesLandscapeStoryHudMode()) {
    const viewportHeight = map.getSize().y;
    return storyState.landscapeDetailsOpen
      ? Math.min(Math.round(viewportHeight * 0.26), 88)
      : Math.min(Math.round(viewportHeight * 0.16), 52);
  }

  if (!usesBottomSheetStoryMode()) {
    return 0;
  }

  const viewportHeight = map.getSize().y;

  switch (storyState.mobilePanelState) {
    case 'full':
      return Math.min(Math.round(viewportHeight * 0.34), 230);
    case 'expanded':
      return Math.min(Math.round(viewportHeight * 0.24), 170);
    case 'peek':
    default:
      return Math.min(Math.round(viewportHeight * 0.16), 110);
  }
};

const getStoryViewTarget = (coords, zoomLevel) => {
  if (!isMobileStoryMode() || !storyState.activeStory) {
    return coords;
  }

  const anchorPoint = map.project(coords, zoomLevel);
  const targetPoint = L.point(
    anchorPoint.x,
    anchorPoint.y + getStoryMobileOffsetPixels()
  );

  return map.unproject(targetPoint, zoomLevel);
};

const focusStoryScene = (scene, { animate = true, duration = 1.1 } = {}) => {
  const zoomLevel = scene.zoom ?? 19;
  const targetCoords = getStoryViewTarget(scene.coords, zoomLevel);

  map.stop();
  map.flyTo(targetCoords, zoomLevel, {
    animate,
    duration,
  });
};

const setStoryPanelState = (requestedState, { refocus = false } = {}) => {
  if (!storyPanel) {
    return;
  }

  if (!usesBottomSheetStoryMode()) {
    storyState.mobilePanelState = isLandscapeStoryMode() ? 'landscape' : 'desktop';
    storyPanel.classList.remove(
      'story-panel--mobile-peek',
      'story-panel--mobile-expanded',
      'story-panel--mobile-full'
    );
    storyPanel.classList.toggle('story-panel--landscape-expanded', storyState.landscapeDetailsOpen && usesLandscapeStoryHudMode());
    syncStorySummaryToggle();
    invalidateStoryLayout();
    return;
  }

  const nextState = MOBILE_STORY_PANEL_STATES.includes(requestedState)
    ? requestedState
    : 'peek';

  storyState.mobilePanelState = nextState;
  storyPanel.classList.toggle('story-panel--mobile-peek', nextState === 'peek');
  storyPanel.classList.toggle('story-panel--mobile-expanded', nextState === 'expanded');
  storyPanel.classList.toggle('story-panel--mobile-full', nextState === 'full');
  storyPanel.classList.remove('story-panel--landscape-expanded');
  syncStorySummaryToggle();
  invalidateStoryLayout();

  if (!refocus || !storyState.activeStory) {
    return;
  }

  const activeScene = storyState.activeStory.scenes[storyState.currentSceneIndex];

  if (!activeScene) {
    return;
  }

  window.requestAnimationFrame(() => {
    focusStoryScene(activeScene, { animate: true, duration: 0.75 });
  });
};

const syncStoryPanelToViewport = ({ refocus = false } = {}) => {
  if (!storyState.activeStory) {
    return;
  }

  if (usesBottomSheetStoryMode()) {
    const nextState = MOBILE_STORY_PANEL_STATES.includes(storyState.mobilePanelState)
      ? storyState.mobilePanelState
      : 'peek';
    setStoryPanelState(nextState, { refocus });
    return;
  }

  setStoryPanelState('desktop');

  if (!refocus) {
    return;
  }

  const activeScene = storyState.activeStory.scenes[storyState.currentSceneIndex];

  if (activeScene) {
    window.requestAnimationFrame(() => {
      focusStoryScene(activeScene, { animate: true, duration: 0.75 });
    });
  }
};

const syncStoryPlayPauseButton = () => {
  const icon = storyPlayPauseButton.querySelector('.material-icons');
  const label = storyPlayPauseButton.querySelector('span');

  icon.textContent = storyState.isPlaying ? 'pause' : 'play_arrow';
  label.textContent = storyState.isPlaying ? 'Pause' : 'Play';
  storyPlayPauseButton.setAttribute('aria-label', `${label.textContent} story`);
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

const showStoryPreviewPlaceholder = () => {
  storyScenePreviewImage?.classList.add('story-panel__preview-image--hidden');
  storyScenePreviewPlaceholder?.classList.remove('story-panel__preview-placeholder--hidden');
};

const hideStoryPreviewPlaceholder = () => {
  storyScenePreviewImage?.classList.remove('story-panel__preview-image--hidden');
  storyScenePreviewPlaceholder?.classList.add('story-panel__preview-placeholder--hidden');
};

const showStoryImagePlaceholder = (scene) => {
  storySceneImage.classList.add('story-panel__image--hidden');
  storySceneImagePlaceholder?.classList.remove('story-panel__placeholder--hidden');
  showStoryPreviewPlaceholder();

  if (storySceneImagePath) {
    storySceneImagePath.textContent = scene.imageRelativePath;
  }
};

const hideStoryImagePlaceholder = () => {
  storySceneImage.classList.remove('story-panel__image--hidden');
  storySceneImagePlaceholder?.classList.add('story-panel__placeholder--hidden');
  hideStoryPreviewPlaceholder();
};

const preloadStoryImage = (scene) => {
  if (!scene?.image) {
    return Promise.reject(new Error('Scene image is missing.'));
  }

  const existing = storyState.imageCache.get(scene.image);
  if (existing) {
    return existing;
  }

  const imagePromise = new Promise((resolve, reject) => {
    const preloadedImage = new Image();

    preloadedImage.onload = () => resolve(scene.image);
    preloadedImage.onerror = () => reject(new Error(`Could not load ${scene.image}`));
    preloadedImage.src = scene.image;
  });

  storyState.imageCache.set(scene.image, imagePromise);
  return imagePromise;
};

const primeStoryImages = (story) => {
  if (!story?.scenes?.length) {
    return;
  }

  story.scenes.forEach((scene) => {
    preloadStoryImage(scene).catch(() => {
      // Missing story art is allowed; the placeholder will handle it if needed.
    });
  });
};

const setStoryImage = (scene) => {
  const imageLoadToken = storyState.imageLoadToken + 1;
  storyState.imageLoadToken = imageLoadToken;

  storySceneImage.alt = `${scene.title} illustration`;
  storySceneImage.dataset.expectedPath = scene.imageRelativePath;
  storySceneImage.onload = null;
  storySceneImage.onerror = null;
  storyScenePreviewImage.alt = `${scene.title} preview illustration`;
  storyScenePreviewImage.dataset.expectedPath = scene.imageRelativePath;

  preloadStoryImage(scene)
    .then(() => {
      if (storyState.imageLoadToken !== imageLoadToken) {
        return;
      }

      if (storySceneImage.src !== scene.image) {
        storySceneImage.src = scene.image;
      }
      if (storyScenePreviewImage.src !== scene.image) {
        storyScenePreviewImage.src = scene.image;
      }
      hideStoryImagePlaceholder();
    })
    .catch(() => {
      if (storyState.imageLoadToken !== imageLoadToken) {
        return;
      }

      showStoryImagePlaceholder(scene);
    });
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
  storySceneSummaryTitle.textContent = scene.title;
  storySceneSummaryMeta.textContent = `${scene.date} • ${scene.location}`;
  storySceneNarrative.textContent = scene.narrative;
  storySceneCamp.textContent = scene.camp;
  storySceneHours.textContent = scene.hoursOnRoad;
  storySceneMiles.textContent = scene.milesTraveled;
  storyScenePace.textContent = scene.pace;
  storySceneNotes.textContent = scene.roadNotes;
  const counterText = `Scene ${boundedIndex + 1} of ${story.scenes.length}`;
  storySceneCounter.textContent = counterText;
  storySceneSummaryCounter.textContent = counterText;
  storyPanelBody?.scrollTo({ top: 0 });
  storyPanel.querySelector('.story-panel__text')?.scrollTo({ top: 0 });
  setStoryImage(scene);
  updateStoryHighlight(scene.coords);
  updateStorySceneMarkers();
  syncStorySummaryToggle();
  focusStoryScene(scene);
};

const stopStoryMode = () => {
  clearStoryTimer();
  storyState.isPlaying = false;
  storyState.landscapeDetailsOpen = false;
  storyState.touchStartY = null;
  storyState.touchGestureHandled = false;
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
  storyState.mobilePanelState = 'peek';
  setStoryPanelState('peek');
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
  storyState.landscapeDetailsOpen = false;
  storyState.previousView = {
    center: map.getCenter(),
    zoom: map.getZoom(),
  };
  primeStoryImages(story);
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
  setStoryPanelState(usesBottomSheetStoryMode() ? 'peek' : 'desktop');
  pauseStoryPlayback();
  goToStoryScene(0);
};

document.querySelectorAll('[data-story-id]').forEach((button) => {
  button.addEventListener('click', () => {
    beginStoryMode(button.dataset.storyId);
  });
});

storyPanelSummaryButton?.addEventListener('click', () => {
  if (!storyState.activeStory) {
    return;
  }

  if (storyState.touchGestureHandled) {
    storyState.touchGestureHandled = false;
    return;
  }

  if (usesLandscapeStoryHudMode()) {
    storyState.landscapeDetailsOpen = !storyState.landscapeDetailsOpen;
    setStoryPanelState('desktop', { refocus: true });
    return;
  }

  if (!usesBottomSheetStoryMode()) {
    return;
  }

  if (storyState.mobilePanelState === 'peek') {
    setStoryPanelState('expanded', { refocus: true });
    return;
  }

  setStoryPanelState('peek', { refocus: true });
});

storyPanelSummaryButton?.addEventListener('touchstart', (event) => {
  if (!storyState.activeStory || !usesBottomSheetStoryMode()) {
    return;
  }

  storyState.touchGestureHandled = false;
  storyState.touchStartY = event.changedTouches[0]?.clientY ?? null;
}, { passive: true });

storyPanelSummaryButton?.addEventListener('touchend', (event) => {
  if (!storyState.activeStory || !usesBottomSheetStoryMode() || storyState.touchStartY === null) {
    return;
  }

  const touchEndY = event.changedTouches[0]?.clientY ?? storyState.touchStartY;
  const deltaY = storyState.touchStartY - touchEndY;
  storyState.touchStartY = null;

  if (Math.abs(deltaY) < STORY_TOUCH_SWIPE_THRESHOLD) {
    return;
  }

  storyState.touchGestureHandled = true;

  if (deltaY > 0) {
    if (storyState.mobilePanelState === 'peek') {
      setStoryPanelState('expanded', { refocus: true });
      return;
    }

    if (storyState.mobilePanelState === 'expanded') {
      setStoryPanelState('full', { refocus: true });
    }
    return;
  }

  if (storyState.mobilePanelState === 'full') {
    setStoryPanelState('expanded', { refocus: true });
    return;
  }

  setStoryPanelState('peek', { refocus: true });
}, { passive: true });

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

const handleStoryViewportChange = () => {
  syncStoryPanelToViewport({ refocus: true });
};

if (typeof mobileStoryModeQuery.addEventListener === 'function') {
  mobileStoryModeQuery.addEventListener('change', handleStoryViewportChange);
} else if (typeof mobileStoryModeQuery.addListener === 'function') {
  mobileStoryModeQuery.addListener(handleStoryViewportChange);
}

if (typeof landscapeStoryModeQuery.addEventListener === 'function') {
  landscapeStoryModeQuery.addEventListener('change', handleStoryViewportChange);
} else if (typeof landscapeStoryModeQuery.addListener === 'function') {
  landscapeStoryModeQuery.addListener(handleStoryViewportChange);
}

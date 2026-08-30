import { 
  getCuratedStoryById 
} from './stories_data.js';
import {
  setCampsiteHoverPopupsEnabled,
} from './functions.js';
import {
  map,
} from './variables.js';

const STORY_PANE_NAME = 'storyPane';
let storySidebar = null;

export const initializeStoryMode = ({ sidebar } = {}) => {
  storySidebar = sidebar ?? null;
};

const ensureStoryPane = () => {
  if (!map.getPane(STORY_PANE_NAME)) {
    map.createPane(STORY_PANE_NAME);
  }
};

ensureStoryPane();

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
const storySceneDetails = document.getElementById('storySceneDetails');
const storySceneSource = document.getElementById('storySceneSource');
const storySceneCounter = document.getElementById('storySceneCounter');
const storyChapterNav = document.getElementById('storyChapterNav');
const storyProgressBar = document.getElementById('storyProgressBar');
const storySceneImage = document.getElementById('storySceneImage');
const storyScenePreviewImage = document.getElementById('storyScenePreviewImage');
const storyScenePreviewPlaceholder = document.getElementById('storyScenePreviewPlaceholder');
const storySceneImagePlaceholder = document.getElementById('storySceneImagePlaceholder');
const storySceneImagePath = document.getElementById('storySceneImagePath');
const storyPlayPauseButton = document.getElementById('storyPlayPauseButton');
const storyPrevButton = document.getElementById('storyPrevButton');
const storyNextButton = document.getElementById('storyNextButton');
const storyStopButton = document.getElementById('storyStopButton');
const mobileStoryModeQuery = window.matchMedia('(max-width: 860px), ((max-height: 500px) and (orientation: landscape))');
const landscapeStoryModeQuery = window.matchMedia('(max-height: 500px) and (orientation: landscape)');
const MOBILE_STORY_PANEL_STATES = ['peek', 'expanded', 'full'];
const STORY_TOUCH_SWIPE_THRESHOLD = 44;

const storyState = {
  activeStory: null,
  currentSceneIndex: 0,
  isPlaying: false,
  timerId: null,
  previousView: null,
  highlightLayer: null,
  sceneMarkersLayer: null,
  routeCheckbox: null,
  routeWasChecked: false,
  imageLoadToken: 0,
  imageCache: new Map(),
  mobilePanelState: 'peek',
  landscapeDetailsOpen: false,
  touchStartY: null,
  touchGestureHandled: false,
};

const STORY_AUTOPLAY_MS = 8000;

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

const showStoryRoute = (story) => {
  const routeCheckbox = document.getElementById(story.pathCheckboxId);

  storyState.routeCheckbox = routeCheckbox;
  storyState.routeWasChecked = Boolean(routeCheckbox?.checked);

  if (routeCheckbox && !routeCheckbox.checked) {
    routeCheckbox.checked = true;
    routeCheckbox.dispatchEvent(new Event('change'));
  }
};

const restoreStoryRoute = () => {
  if (storyState.routeCheckbox && !storyState.routeWasChecked) {
    storyState.routeCheckbox.checked = false;
    storyState.routeCheckbox.dispatchEvent(new Event('change'));
  }

  storyState.routeCheckbox = null;
  storyState.routeWasChecked = false;
};

const restoreStoryLayers = () => {
  removeStoryLayer(storyState.sceneMarkersLayer);
  removeStoryLayer(storyState.highlightLayer);

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

const preloadNextStoryImage = (story, sceneIndex) => {
  if (!story?.scenes?.length || sceneIndex >= story.scenes.length - 1) {
    return;
  }

  preloadStoryImage(story.scenes[sceneIndex + 1]).catch(() => {
    // Missing story art is allowed; the placeholder will handle it if needed.
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

const renderStoryDetails = (scene) => {
  if (!storySceneDetails) {
    return;
  }

  storySceneDetails.replaceChildren();

  (scene.stats ?? []).forEach(({ label, value }) => {
    const row = document.createElement('div');
    const labelElement = document.createElement('span');
    const valueElement = document.createElement('span');

    row.className = 'story-panel__detail-row';
    labelElement.className = 'story-panel__detail-label';
    valueElement.className = 'story-panel__detail-value';
    labelElement.textContent = label;
    valueElement.textContent = value;

    if (label === 'Road Notes') {
      valueElement.classList.add('story-panel__detail-value--notes');
    }

    row.append(labelElement, valueElement);
    storySceneDetails.append(row);
  });
};

const updateStoryChapterNav = (scene) => {
  storyChapterNav?.querySelectorAll('[data-story-scene-index]').forEach((button) => {
    const isActive = button.dataset.chapterId === scene.chapter?.id;
    button.classList.toggle('story-panel__chapter-button--active', isActive);
    button.setAttribute('aria-current', isActive ? 'step' : 'false');
  });
};

const renderStoryChapterNav = (story) => {
  if (!storyChapterNav) {
    return;
  }

  storyChapterNav.replaceChildren();

  story.chapters?.forEach((chapter) => {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'story-panel__chapter-button';
    button.dataset.chapterId = chapter.id;
    button.dataset.storySceneIndex = String(chapter.startSceneIndex);
    button.textContent = `${chapter.number}. ${chapter.title}`;
    button.setAttribute('aria-label', `Go to chapter ${chapter.number}: ${chapter.title}`);
    button.addEventListener('click', () => {
      pauseStoryPlayback();
      goToStoryScene(chapter.startSceneIndex);
    });

    storyChapterNav.append(button);
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

  const chapterText = scene.chapter
    ? `Chapter ${scene.chapter.number} of ${scene.chapter.total} · ${scene.chapter.title}`
    : story.title;

  storyKicker.textContent = chapterText;
  storySceneTitle.textContent = scene.title;
  storySceneMeta.textContent = `${scene.date} • ${scene.location}`;
  storySceneSummaryTitle.textContent = scene.title;
  storySceneSummaryMeta.textContent = `${scene.date} • ${scene.location}`;
  storySceneNarrative.textContent = scene.narrative;
  renderStoryDetails(scene);
  if (storySceneSource) {
    storySceneSource.textContent = scene.sourceLabel ?? 'Lore reference';
    storySceneSource.href = scene.sourceUrl ?? '#';
    storySceneSource.parentElement.hidden = !scene.sourceUrl;
  }
  const counterText = `Scene ${boundedIndex + 1} of ${story.scenes.length}`;
  storySceneCounter.textContent = counterText;
  storySceneSummaryCounter.textContent = scene.chapter
    ? `Chapter ${scene.chapter.number} · ${counterText}`
    : counterText;
  if (storyProgressBar) {
    storyProgressBar.style.width = `${((boundedIndex + 1) / story.scenes.length) * 100}%`;
  }
  storyPanelBody?.scrollTo({ top: 0 });
  storyPanel.querySelector('.story-panel__text')?.scrollTo({ top: 0 });
  setStoryImage(scene);
  preloadNextStoryImage(story, boundedIndex);
  updateStoryHighlight(scene.coords);
  updateStorySceneMarkers();
  updateStoryChapterNav(scene);
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
  restoreStoryRoute();

  if (storyState.previousView) {
    map.setView(storyState.previousView.center, storyState.previousView.zoom, {
      animate: false,
    });
    storyState.previousView = null;
  }

  map.closePopup();
  storyState.activeStory = null;
  document.body.classList.remove('story-mode-active');
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
  storyChapterNav?.replaceChildren();
  if (storyProgressBar) {
    storyProgressBar.style.width = '0%';
  }
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
  document.body.classList.add('story-mode-active');
  storyState.currentSceneIndex = 0;
  storyState.landscapeDetailsOpen = false;
  storyState.previousView = {
    center: map.getCenter(),
    zoom: map.getZoom(),
  };
  ensureStoryLayersVisible(story);
  showStoryRoute(story);
  renderStoryChapterNav(story);
  setCampsiteHoverPopupsEnabled(false);
  map.closePopup();
  storySidebar?.close?.();
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
    setStoryPanelState('full', { refocus: true });
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

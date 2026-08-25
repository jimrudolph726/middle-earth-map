(function initializeAtlasMapSounds() {
  "use strict";

  var scriptUrl = document.currentScript && document.currentScript.src;

  if (!scriptUrl) {
    return;
  }

  var AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  var audioRoot = new URL("../assets/audio/atlas/", scriptUrl);
  var storageKey = "middle-earth-atlas:sounds-enabled:v1";
  var soundDefinitions = {
    woodClick: {
      file: "wood-click.mp3",
      volume: 0.24,
      cooldown: 70,
      pitchJitter: 0.018,
      maxDuration: 0.22
    },
    parchmentFlick: {
      file: "parchment-flick.mp3",
      volume: 0.17,
      cooldown: 260,
      pitchJitter: 0.012,
      maxDuration: 0.45
    },
    quillStroke: {
      file: "quill-stroke.mp3",
      volume: 0.12,
      cooldown: 320,
      pitchJitter: 0.014,
      maxDuration: 0.92
    },
    bookThump: {
      file: "book-thump.mp3",
      volume: 0.2,
      cooldown: 500,
      pitchJitter: 0.008,
      maxDuration: 0.42
    }
  };

  var audioContext = null;
  var masterGain = null;
  var enabled = Boolean(AudioContextConstructor && readStoredPreference());
  var encodedAudioPromises = new Map();
  var decodedAudioPromises = new Map();
  var decodedSoundNames = new Set();
  var activeSources = new Map();
  var lastPlayedAt = new Map();
  var playCounts = new Map();

  function readStoredPreference() {
    try {
      return window.localStorage.getItem(storageKey) === "true";
    } catch (error) {
      return false;
    }
  }

  function storePreference(nextEnabled) {
    try {
      window.localStorage.setItem(storageKey, String(nextEnabled));
    } catch (error) {
      // Sound remains usable for this visit when storage is unavailable.
    }
  }

  function ensureAudioContext() {
    if (!AudioContextConstructor) {
      return null;
    }

    if (!audioContext) {
      audioContext = new AudioContextConstructor();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.72;
      masterGain.connect(audioContext.destination);
    }

    return audioContext;
  }

  function resumeAudioContext() {
    var context = ensureAudioContext();

    if (context && context.state === "suspended") {
      context.resume().catch(function ignoreResumeFailure() {});
    }

    return context;
  }

  function fetchEncodedAudio(name) {
    if (encodedAudioPromises.has(name)) {
      return encodedAudioPromises.get(name);
    }

    var definition = soundDefinitions[name];
    var request = fetch(new URL(definition.file, audioRoot))
      .then(function readAudioResponse(response) {
        if (!response.ok) {
          throw new Error("Unable to load atlas sound " + name + " (" + response.status + ")");
        }

        return response.arrayBuffer();
      })
      .catch(function allowAudioFetchRetry(error) {
        encodedAudioPromises.delete(name);
        throw error;
      });

    encodedAudioPromises.set(name, request);
    return request;
  }

  function decodeAudio(name, context) {
    if (decodedAudioPromises.has(name)) {
      return decodedAudioPromises.get(name);
    }

    var decoding = fetchEncodedAudio(name)
      .then(function decodeAudioBuffer(encodedAudio) {
        return context.decodeAudioData(encodedAudio.slice(0));
      })
      .then(function rememberDecodedSound(buffer) {
        decodedSoundNames.add(name);
        return buffer;
      })
      .catch(function allowAudioDecodeRetry(error) {
        decodedAudioPromises.delete(name);
        throw error;
      });

    decodedAudioPromises.set(name, decoding);
    return decoding;
  }

  function prepare() {
    return Promise.allSettled(Object.keys(soundDefinitions).map(fetchEncodedAudio));
  }

  async function play(name, options) {
    var playOptions = options || {};
    var definition = soundDefinitions[name];

    if (!definition || (!enabled && !playOptions.force)) {
      return false;
    }

    var now = window.performance.now();
    var previousPlay = lastPlayedAt.get(name) || 0;

    if (!playOptions.force && now - previousPlay < definition.cooldown) {
      return false;
    }

    lastPlayedAt.set(name, now);

    var context = resumeAudioContext();

    if (!context || !masterGain) {
      return false;
    }

    try {
      var buffer = await decodeAudio(name, context);

      if (!enabled && !playOptions.force) {
        return false;
      }

      if (context.state === "suspended") {
        await context.resume();
      }

      var existingSource = activeSources.get(name);

      if (existingSource) {
        try {
          existingSource.stop();
        } catch (error) {
          // A source that has already ended needs no further cleanup.
        }
      }

      var source = context.createBufferSource();
      var effectGain = context.createGain();
      var jitter = definition.pitchJitter || 0;
      var requestedRate = playOptions.playbackRate || 1;
      var randomizedRate = requestedRate * (1 + ((Math.random() * 2 - 1) * jitter));
      var volume = definition.volume * (playOptions.volumeMultiplier || 1);
      var duration = Math.min(
        buffer.duration / randomizedRate,
        definition.maxDuration || Number.POSITIVE_INFINITY
      );
      var startTime = context.currentTime;
      var fadeDuration = Math.min(0.065, duration * 0.4);
      var fadeStart = startTime + Math.max(0, duration - fadeDuration);

      source.buffer = buffer;
      source.playbackRate.value = randomizedRate;
      effectGain.gain.setValueAtTime(volume, startTime);
      effectGain.gain.setValueAtTime(volume, fadeStart);
      effectGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      source.connect(effectGain);
      effectGain.connect(masterGain);
      activeSources.set(name, source);

      source.addEventListener("ended", function clearCompletedSource() {
        if (activeSources.get(name) === source) {
          activeSources.delete(name);
        }
      }, { once: true });

      source.start(startTime);
      source.stop(startTime + duration + 0.02);
      playCounts.set(name, (playCounts.get(name) || 0) + 1);
      document.dispatchEvent(new CustomEvent("atlas:soundplayed", {
        detail: { name: name }
      }));
      return true;
    } catch (error) {
      console.warn("Atlas sound could not be played:", name, error);
      return false;
    }
  }

  function setEnabled(nextEnabled) {
    enabled = Boolean(nextEnabled && AudioContextConstructor);
    storePreference(enabled);
    syncSettingsUi();

    if (enabled) {
      prepare();
      return;
    }

    if (audioContext && audioContext.state === "running") {
      window.setTimeout(function suspendMutedAudio() {
        if (!enabled && audioContext && audioContext.state === "running") {
          audioContext.suspend().catch(function ignoreSuspendFailure() {});
        }
      }, 260);
    }
  }

  function syncSettingsUi() {
    var toggle = document.getElementById("atlasSoundsToggle");
    var status = document.getElementById("atlasSoundsStatus");

    document.documentElement.classList.toggle("atlas-sounds-enabled", enabled);

    if (toggle) {
      toggle.checked = enabled;
      toggle.setAttribute("aria-checked", String(enabled));
      toggle.disabled = !AudioContextConstructor;
    }

    if (status) {
      if (!AudioContextConstructor) {
        status.textContent = "Atlas sounds are unavailable in this browser.";
      } else if (enabled) {
        status.textContent = "On. Quiet atlas sounds will respond to your actions.";
      } else {
        status.textContent = "Muted. Your choice will be remembered.";
      }
    }
  }

  function renderSettingsControl() {
    var settingsPane = document.getElementById("settings");

    if (!settingsPane || document.getElementById("atlasSoundsToggle")) {
      return;
    }

    var card = document.createElement("section");
    card.className = "atlas-sounds-card";
    card.setAttribute("aria-labelledby", "atlasSoundsTitle");
    card.innerHTML = [
      '<label class="atlas-sounds-toggle" for="atlasSoundsToggle">',
      '  <span class="atlas-sounds-toggle__copy">',
      '    <strong id="atlasSoundsTitle" class="atlas-sounds-toggle__title">Atlas sounds</strong>',
      '  </span>',
      '  <input class="atlas-sounds-toggle__input" id="atlasSoundsToggle" type="checkbox" role="switch" aria-describedby="atlasSoundsStatus" />',
      '  <span class="atlas-sounds-toggle__track" aria-hidden="true"></span>',
      '</label>',
      '<p class="atlas-sounds-card__status" id="atlasSoundsStatus" aria-live="polite"></p>'
    ].join("");
    settingsPane.appendChild(card);

    var toggle = document.getElementById("atlasSoundsToggle");
    toggle.addEventListener("change", function handleSoundPreferenceChange() {
      if (toggle.checked) {
        setEnabled(true);
        play("woodClick", { force: true });
      } else {
        play("woodClick", { force: true });
        setEnabled(false);
      }
    });

    syncSettingsUi();
  }

  function unlockFromUserGesture() {
    if (!enabled) {
      return;
    }

    resumeAudioContext();
    prepare();
  }

  function handleAtlasClick(event) {
    var target = event.target instanceof Element ? event.target : null;

    if (!target) {
      return;
    }

    if (target.closest('.sidebar-tabs a[href="#settings"]')) {
      prepare();
    }

    if (target.closest("#atlasSoundsToggle")) {
      return;
    }

    if (target.closest("[data-frontispiece-action], [data-atlas-pane]")) {
      play("parchmentFlick");
      return;
    }

    if (target.closest("[data-story-id]")) {
      play("bookThump");
      return;
    }

    if (target.closest('.sidebar-tabs a[role="tab"], .sidebar-close')) {
      play("parchmentFlick");
      return;
    }

    if (target.closest([
      ".leaflet-control-zoom a",
      ".leaflet-popup-close-button",
      ".atlas-map-nav__toggle",
      ".lore-popup__link",
      ".story-panel button",
      "button"
    ].join(", "))) {
      play("woodClick");
    }
  }

  function bindLayerSounds() {
    document.addEventListener("atlas:layerchange", function handleLayerChange(event) {
      var layerEnabled = event.detail && event.detail.enabled;
      play("quillStroke", {
        playbackRate: layerEnabled ? 1.015 : 0.965,
        volumeMultiplier: layerEnabled ? 1 : 0.82
      });
    });
  }

  function bindPopupSounds() {
    var mapElement = document.getElementById("map");

    if (!mapElement) {
      return;
    }

    new MutationObserver(function announceLorePopup(records) {
      var lorePopupAdded = records.some(function recordIncludesLorePopup(record) {
        return Array.from(record.addedNodes).some(function nodeIncludesLorePopup(node) {
          return node instanceof Element && (
            node.matches(".leaflet-popup.lore-popup-shell")
            || Boolean(node.querySelector(".leaflet-popup.lore-popup-shell"))
          );
        });
      });

      if (lorePopupAdded) {
        play("parchmentFlick");
      }
    }).observe(mapElement, { childList: true, subtree: true });
  }

  function getState() {
    return {
      enabled: enabled,
      supported: Boolean(AudioContextConstructor),
      contextState: audioContext ? audioContext.state : "not-created",
      decodedSounds: Array.from(decodedSoundNames),
      playCounts: Object.fromEntries(playCounts)
    };
  }

  window.AtlasSounds = Object.freeze({
    getState: getState,
    isEnabled: function isEnabled() { return enabled; },
    play: play,
    prepare: prepare,
    setEnabled: setEnabled
  });

  function initialize() {
    renderSettingsControl();
    bindLayerSounds();
    bindPopupSounds();
    document.addEventListener("click", handleAtlasClick, true);
    document.addEventListener("pointerdown", unlockFromUserGesture, true);
    document.addEventListener("keydown", unlockFromUserGesture, true);

    if (enabled) {
      prepare();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();

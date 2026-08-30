const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { fileURLToPath, pathToFileURL } = require("node:url");

const repoRoot = path.resolve(__dirname, "..");
const middleEarthDir = path.join(repoRoot, "maps", "middle_earth");
const middleEarthHtmlPath = path.join(middleEarthDir, "middle-earth.html");
const middleEarthHtml = fs.readFileSync(middleEarthHtmlPath, "utf8");
const middleEarthHtmlIds = new Set(
  Array.from(middleEarthHtml.matchAll(/\bid=["']([^"']+)["']/g), ([, id]) => id)
);
const middleEarthHtmlStoryIds = new Set(
  Array.from(middleEarthHtml.matchAll(/\bdata-story-id=["']([^"']+)["']/g), ([, storyId]) => storyId)
);

function expectNoErrors(errors) {
  assert.equal(errors.length, 0, errors.join("\n"));
}

function stripImports(source) {
  return source.replace(/^\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];\s*$/gm, "");
}

function transformExports(source) {
  return source
    .replace(/\bexport\s+const\s+([\w$\u00A0-\uFFFF]+)\s*=/gu, "const $1 = exports.$1 =")
    .replace(/\bexport\s+let\s+([\w$\u00A0-\uFFFF]+)\s*=/gu, "let $1 = exports.$1 =")
    .replace(/\bexport\s+function\s+([\w$\u00A0-\uFFFF]+)\s*\(/gu, "exports.$1 = function $1(");
}

function evaluateModule(filePath, bindings = {}) {
  let source = fs.readFileSync(filePath, "utf8");
  source = stripImports(source);
  source = source.replace(/import\.meta\.url/g, "importMetaUrl");
  source = transformExports(source);

  const context = {
    console,
    URL,
    exports: {},
    module: { exports: {} },
    importMetaUrl: pathToFileURL(filePath).href,
    ...bindings,
  };

  vm.runInNewContext(source, context, { filename: filePath });
  return context.exports;
}

const popupStub = () => "";
const createIconStub = (url, size = null) => ({ url, size });
const leafletStub = {
  CRS: {
    EPSG3857: {},
  },
  map: () => ({}),
};

const settlementItemData = evaluateModule(
  path.join(middleEarthDir, "settlement_item_data.js"),
  {
    createSettlementPopup: popupStub,
    createIcon: createIconStub,
  }
);

const campsiteData = evaluateModule(
  path.join(middleEarthDir, "campsite_data.js"),
  {
    createCampsitePopup: popupStub,
    icons: settlementItemData.icons,
  }
);

const geographicDataModule = evaluateModule(
  path.join(middleEarthDir, "geographic_data.js"),
  {
    createGeographicPopup: popupStub,
  }
);

const variablesModule = evaluateModule(
  path.join(middleEarthDir, "variables.js"),
  {
    ...settlementItemData,
    ...campsiteData,
    ...geographicDataModule,
    createSettlementPopup: popupStub,
    L: leafletStub,
  }
);

const storiesDataModule = evaluateModule(
  path.join(middleEarthDir, "stories_data.js"),
  {
    ...campsiteData,
  }
);

const allMarkerEntries = variablesModule.settlementsData.flatMap(({ groupName, data }) => {
  return Object.entries(data).map(([markerKey, marker]) => ({
    groupName,
    markerKey,
    marker,
  }));
});

const allGeographicEntries = [
  ...Object.entries(variablesModule.pathData).map(([key, item]) => ({ key, item })),
  ...Object.entries(variablesModule.roadData).map(([key, item]) => ({ key, item })),
  ...variablesModule.geographicData.flatMap(({ data }) => {
    return Object.entries(data).map(([key, item]) => ({ key, item }));
  }),
];

test("middle-earth map data points at existing checkbox ids in the sidebar html", () => {
  const errors = [];
  const expectedCheckboxIds = new Set([
    ...variablesModule.settlementsData.map(({ checkboxId }) => checkboxId),
    ...Object.keys(variablesModule.pathData).map((key) => `${key}Checkbox`),
    ...Object.keys(variablesModule.roadData).map((key) => `${key}Checkbox`),
    ...variablesModule.geographicData.map(({ checkboxId }) => checkboxId),
    ...storiesDataModule.curatedStories.flatMap((story) => [story.campCheckboxId, story.pathCheckboxId]),
  ]);

  expectedCheckboxIds.forEach((checkboxId) => {
    if (!middleEarthHtmlIds.has(checkboxId)) {
      errors.push(`middle-earth.html is missing checkbox/input id "${checkboxId}".`);
    }
  });

  expectNoErrors(errors);
});

test("middle-earth path and geography entries point at existing GeoJSON files", () => {
  const errors = [];

  allGeographicEntries.forEach(({ key, item }) => {
    const geojsonPath = path.join(middleEarthDir, "geojson_files", `${item.pathName}.geojson`);

    if (!item.pathName) {
      errors.push(`${key} is missing a pathName.`);
      return;
    }

    if (!fs.existsSync(geojsonPath)) {
      errors.push(`${key} points at missing GeoJSON file maps/middle_earth/geojson_files/${item.pathName}.geojson.`);
    }
  });

  expectNoErrors(errors);
});

test("middle-earth marker entries reference exported icons and existing icon assets", () => {
  const errors = [];
  const iconValues = new Set(Object.values(settlementItemData.icons));

  Object.entries(settlementItemData.icons).forEach(([iconName, icon]) => {
    if (!icon || typeof icon.url !== "string") {
      errors.push(`icons.${iconName} is missing a resolved asset URL.`);
      return;
    }

    const iconAssetPath = fileURLToPath(icon.url);
    if (!fs.existsSync(iconAssetPath)) {
      errors.push(`icons.${iconName} points at missing asset ${path.relative(repoRoot, iconAssetPath)}.`);
    }
  });

  allMarkerEntries.forEach(({ groupName, markerKey, marker }) => {
    const label = `${groupName}.${markerKey}`;

    if (!marker || typeof marker !== "object") {
      errors.push(`${label} must be an object.`);
      return;
    }

    if (!Array.isArray(marker.coords) || marker.coords.length !== 2) {
      errors.push(`${label}.coords must be a [lat, lng] array.`);
    }

    if (!iconValues.has(marker.icon)) {
      errors.push(`${label}.icon does not reference one of the exported icons.`);
    }
  });

  expectNoErrors(errors);
});

test("Sam and Frodo campsites expose structured travel details for story building", () => {
  const errors = [];
  const requiredProperties = [
    "date",
    "hoursOnRoad",
    "milesTraveled",
    "pace",
    "roadNotes",
    "camp",
  ];

  Object.entries(campsiteData.samfrodocampsites).forEach(([markerKey, campsite]) => {
    requiredProperties.forEach((propertyName) => {
      if (!Object.hasOwn(campsite.details ?? {}, propertyName)) {
        errors.push(`samfrodocampsites.${markerKey}.details is missing "${propertyName}".`);
      }
    });
  });

  expectNoErrors(errors);
});

test("middle-earth curated stories reference existing campsites, images, and html launch ids", () => {
  const errors = [];
  const storyIds = new Set();

  storiesDataModule.curatedStories.forEach((story) => {
    storyIds.add(story.id);

    if (!middleEarthHtmlStoryIds.has(story.id)) {
      errors.push(`middle-earth.html is missing a Start Story button for story id "${story.id}".`);
    }

    if (!middleEarthHtmlIds.has(story.campCheckboxId)) {
      errors.push(`Story "${story.id}" references missing camp checkbox id "${story.campCheckboxId}".`);
    }

    if (!middleEarthHtmlIds.has(story.pathCheckboxId)) {
      errors.push(`Story "${story.id}" references missing path checkbox id "${story.pathCheckboxId}".`);
    }

    const campsiteGroup = campsiteData[story.markerGroupName];
    if (!campsiteGroup) {
      errors.push(`Story "${story.id}" references missing campsite group "${story.markerGroupName}".`);
      return;
    }

    const chapterIds = new Set();
    let expectedChapterStart = 0;

    story.chapters.forEach((chapter) => {
      if (chapterIds.has(chapter.id)) {
        errors.push(`Story "${story.id}" repeats chapter id "${chapter.id}".`);
      }

      chapterIds.add(chapter.id);

      if (chapter.startSceneIndex !== expectedChapterStart) {
        errors.push(`Story "${story.id}" chapter "${chapter.id}" starts at ${chapter.startSceneIndex}, expected ${expectedChapterStart}.`);
      }

      expectedChapterStart += chapter.sceneCount;
    });

    if (expectedChapterStart !== story.scenes.length) {
      errors.push(`Story "${story.id}" chapter counts cover ${expectedChapterStart} scenes, expected ${story.scenes.length}.`);
    }

    story.scenes.forEach((scene, index) => {
      const label = `Story "${story.id}" scene ${index + 1}`;
      const campsite = campsiteGroup[scene.markerKey];

      if (!campsite) {
        errors.push(`${label} references missing campsite key "${scene.markerKey}".`);
        return;
      }

      if (scene.order !== index + 1) {
        errors.push(`${label} has order ${scene.order}, expected ${index + 1}.`);
      }

      if (JSON.stringify(scene.coords) !== JSON.stringify(campsite.coords)) {
        errors.push(`${label} coords do not match campsite ${story.markerGroupName}.${scene.markerKey}.`);
      }

      if (!chapterIds.has(scene.chapter?.id)) {
        errors.push(`${label} references missing chapter "${scene.chapter?.id}".`);
      }

      if (!Array.isArray(scene.stats) || scene.stats.length === 0) {
        errors.push(`${label} has no generated story statistics.`);
      }

      const startKey = scene.rangeStartKey ?? scene.markerKey;
      const endKey = scene.rangeEndKey ?? startKey;
      const campsiteKeys = Object.keys(campsiteGroup);
      const startIndex = campsiteKeys.indexOf(startKey);
      const endIndex = campsiteKeys.indexOf(endKey);
      const expectedRangeKeys = campsiteKeys.slice(startIndex, endIndex + 1);

      if (JSON.stringify(scene.rangeMarkerKeys ?? [scene.markerKey]) !== JSON.stringify(expectedRangeKeys)) {
        errors.push(`${label} has an invalid campsite range from "${startKey}" through "${endKey}".`);
      }

      if (!scene.imageRelativePath) {
        errors.push(`${label} is missing imageRelativePath.`);
      } else {
        const imagePath = path.resolve(repoRoot, scene.imageRelativePath);
        const imageDirectory = path.dirname(imagePath);
        const imageFileName = path.basename(imagePath);

        if (!fs.existsSync(imageDirectory)) {
          errors.push(`${label} points at missing story image directory ${path.relative(repoRoot, imageDirectory)}.`);
        }

        if (imageFileName !== scene.imageFileName) {
          errors.push(`${label} imageRelativePath does not end with imageFileName "${scene.imageFileName}".`);
        }

        if (story.status === "complete" && !fs.existsSync(imagePath)) {
          errors.push(`${label} is complete but its image is missing: ${path.relative(repoRoot, imagePath)}.`);
        }
      }
    });
  });

  const completedSamFrodoStory = storiesDataModule.curatedStories.find(
    (story) => story.id === "sam-frodo-road-to-mount-doom"
  );

  if (!completedSamFrodoStory) {
    errors.push("The completed Sam and Frodo story is missing.");
  } else {
    if (completedSamFrodoStory.scenes.length !== 18) {
      errors.push(`The completed Sam and Frodo story has ${completedSamFrodoStory.scenes.length} scenes, expected 18.`);
    }

    if (completedSamFrodoStory.chapters.length !== 5) {
      errors.push(`The completed Sam and Frodo story has ${completedSamFrodoStory.chapters.length} chapters, expected 5.`);
    }
  }

  middleEarthHtmlStoryIds.forEach((storyId) => {
    if (!storyIds.has(storyId)) {
      errors.push(`middle-earth.html contains data-story-id "${storyId}" without a matching curatedStories entry.`);
    }
  });

  expectNoErrors(errors);
});

(function () {
  let data = window.FAMILY_TREE_DATA || null;
  const treeHost = document.getElementById("family-tree-host");
  const treeWrapper = document.getElementById("tree");
  const atlasNavigation = document.querySelector(".atlas-map-nav");
  const viewSelect = document.getElementById("tree-view");
  const viewTitle = document.getElementById("tree-view-title");
  const viewDescription = document.getElementById("tree-view-description");
  const viewStats = document.getElementById("tree-view-stats");
  const searchInput = document.getElementById("tree-search");
  const searchResults = document.getElementById("tree-search-results");
  const emptyState = document.getElementById("tree-empty-state");
  const emptyTitle = document.getElementById("tree-empty-title");
  const emptyBody = document.getElementById("tree-empty-body");
  const resetViewButton = document.getElementById("reset-view");
  const treeViewPanel = document.getElementById("tree-view-panel");
  const treeControlsToggle = document.getElementById("tree-controls-toggle");
  const treeControlsClose = document.getElementById("tree-controls-close");
  const treeReopenWelcome = document.getElementById("tree-reopen-welcome");
  const treeWelcome = document.getElementById("tree-welcome");
  const treeWelcomeChoices = document.getElementById("tree-welcome-choices");
  const treeWelcomeLineages = document.getElementById("tree-welcome-lineages");
  const treeWelcomeLineageList = document.getElementById("tree-welcome-lineage-list");
  const treeWelcomeSearchView = document.getElementById("tree-welcome-search-view");
  const treeWelcomeSearch = document.getElementById("tree-welcome-search");
  const treeWelcomeSearchResults = document.getElementById("tree-welcome-search-results");
  const treeHint = document.getElementById("tree-hint");
  const lineageHoverPill = document.getElementById("lineage-hover-pill");
  const characterSheet = document.getElementById("character-sheet");
  const backToTreeButton = document.getElementById("back-to-tree");
  const characterSheetContent = document.getElementById("character-sheet-content");
  const portraitLightbox = document.getElementById("portrait-lightbox");
  const portraitLightboxImage = document.getElementById("portrait-lightbox-image");
  const portraitLightboxCaption = document.getElementById("portrait-lightbox-caption");
  const portraitLightboxClose = document.getElementById("portrait-lightbox-close");
  const familyTreeGroupLinks = Array.from(document.querySelectorAll("[data-family-tree-group-link]"));

  const cardWidth = 210;
  const cardHeight = 126;
  const portraitRadius = 32;
  const unionNodeSize = 18;
  const coupleGap = 46;
  const lineagePartnerGap = 54;
  const siblingBarMinGapToChild = 10;
  const siblingBarMinDropFromParents = 18;
  const siblingBarDropFactor = 0.7;
  const rowClusterTolerance = 18;
  const minimumRowGap = 18;
  const annotationLabelWidth = 128;
  const annotationLabelGap = 72;
  const annotationVerticalPadding = 42;
  const annotationMinHeight = 220;
  const interactiveAnnotationIds = new Set([
    "kings-of-arnor",
    "kings-of-arthedain",
    "chieftains-of-the-dunedain"
  ]);
  const lineageZonePaddingX = 36;
  const lineageZonePaddingY = 28;
  const zoomMinScale = 0.08;
  const zoomMaxScale = 3;
  const zoomWheelSensitivity = 0.01;
  const treeManifestUrl = "family_tree_manifest.json";
  const legacyTreeDataUrl = "family_tree_data.json";
  const legacyTreeLayoutsUrl = "family_tree_layouts.json";
  const defaultFamilyGroupId = "elves-men";
  let familyTreeManifest = window.FAMILY_TREE_MANIFEST || null;
  let fileLayouts = window.FAMILY_TREE_LAYOUTS || { version: 1, views: {} };

  const elk = window.ELK ? new window.ELK() : null;

  const state = {
    indexes: null,
    currentFamilyGroupId: null,
    currentDataBaseUrl: "",
    currentViewId: null,
    currentRawProjection: null,
    currentProjection: null,
    currentLayout: null,
    currentAutoLayout: null,
    currentUnionInfos: [],
    currentTransform: { x: 0, y: 0, k: 1 },
    collapsedIds: new Set(),
    pendingFocus: null,
    renderRevision: 0,
    scene: null,
    activePersonId: null,
    activeLineageZoneId: null
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function average(values) {
    if (!values || values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function truncateText(value, maxLength) {
    const text = String(value || "");
    if (text.length <= maxLength) return text;
    return `${text.slice(0, Math.max(0, maxLength - 1))}…`;
  }

  function cloneJson(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getLayoutViewId(viewId) {
    if (!viewId) {
      return viewId;
    }

    const layoutViewId = data?.views?.[viewId]?.layoutView;
    return layoutViewId && data?.views?.[layoutViewId] ? layoutViewId : viewId;
  }

  function getFileViewLayout(viewId) {
    const layoutViewId = getLayoutViewId(viewId);
    const sharedLayout = layoutViewId ? fileLayouts?.views?.[layoutViewId] || null : null;
    const viewLayout = layoutViewId && layoutViewId !== viewId
      ? fileLayouts?.views?.[viewId] || null
      : null;

    return mergeViewLayouts(sharedLayout, viewLayout);
  }

  function mergeViewLayouts(baseLayout, overrideLayout) {
    if (!baseLayout && !overrideLayout) {
      return null;
    }

    const merged = {
      ...(baseLayout ? cloneJson(baseLayout) : {}),
      ...(overrideLayout ? cloneJson(overrideLayout) : {})
    };

    merged.positions = {
      ...((baseLayout && baseLayout.positions) || {}),
      ...((overrideLayout && overrideLayout.positions) || {})
    };

    return merged;
  }

  function getEffectiveViewLayout(viewId) {
    return getFileViewLayout(viewId);
  }

  function syncLayoutBox(box) {
    box.left = box.x;
    box.top = box.y;
    box.right = box.x + box.width;
    box.bottom = box.y + box.height;
    box.centerX = box.x + box.width / 2;
    box.centerY = box.y + box.height / 2;
    return box;
  }

  async function loadJsonFile(url, fallbackValue) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`${url} returned ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (fallbackValue) {
        return fallbackValue;
      }

      if (window.location.protocol === "file:") {
        throw new Error(`Could not load ${url}. JSON-backed family trees need to be served from a local web server or static site host, not opened directly with file://.`);
      }

      throw error;
    }
  }

  function getUrlDirectory(url) {
    const cleanUrl = String(url || "").split("#")[0].split("?")[0];
    const lastSlashIndex = cleanUrl.lastIndexOf("/");
    return lastSlashIndex >= 0 ? cleanUrl.slice(0, lastSlashIndex + 1) : "";
  }

  async function loadTreeFiles() {
    familyTreeManifest = await loadJsonFile(treeManifestUrl, window.FAMILY_TREE_MANIFEST || null);
    state.currentFamilyGroupId = getInitialFamilyGroupId();

    const familyGroup = getFamilyGroups()[state.currentFamilyGroupId] || {};
    const dataUrl = familyGroup.dataUrl || legacyTreeDataUrl;
    const layoutsUrl = familyGroup.layoutsUrl || legacyTreeLayoutsUrl;
    state.currentDataBaseUrl = getUrlDirectory(dataUrl);

    const [loadedData, loadedLayouts] = await Promise.all([
      loadJsonFile(dataUrl, window.FAMILY_TREE_DATA || null),
      loadJsonFile(layoutsUrl, window.FAMILY_TREE_LAYOUTS || { version: 1, views: {} })
    ]);

    data = loadedData;
    fileLayouts = loadedLayouts && typeof loadedLayouts === "object"
      ? loadedLayouts
      : { version: 1, views: {} };
  }

  function renderError(message) {
    const existing = treeWrapper.querySelector(".tree-error-box");
    if (existing) existing.remove();

    const errorBox = document.createElement("pre");
    errorBox.className = "tree-error-box";
    errorBox.textContent = message;
    treeWrapper.appendChild(errorBox);
  }

  function clearError() {
    const existing = treeWrapper.querySelector(".tree-error-box");
    if (existing) existing.remove();
  }

  function uniqueOrdered(ids) {
    const seen = new Set();
    return ids.filter((id) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  function getRecordType(person) {
    return person.recordType || "person";
  }

  function comparePeopleIds(leftId, rightId) {
    const left = getPersonById(leftId);
    const right = getPersonById(rightId);
    const leftOrder = left?.order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right?.order ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return String(leftId).localeCompare(String(rightId));
  }

  function applyPreferredOrder(ids, preferredOrder) {
    if (!Array.isArray(preferredOrder) || preferredOrder.length === 0) {
      return [...ids];
    }

    const rank = new Map(preferredOrder.map((id, index) => [id, index]));
    return [...ids].sort((leftId, rightId) => {
      const leftRank = rank.has(leftId) ? rank.get(leftId) : Number.MAX_SAFE_INTEGER;
      const rightRank = rank.has(rightId) ? rank.get(rightId) : Number.MAX_SAFE_INTEGER;

      if (leftRank !== rightRank) {
        return leftRank - rightRank;
      }

      return comparePeopleIds(leftId, rightId);
    });
  }

  function personMatchesViewFilters(person, filters) {
    if (!filters) return true;

    const personGroups = new Set(person.groups || []);

    if (Array.isArray(filters.includePersonIds) && filters.includePersonIds.length > 0 && !filters.includePersonIds.includes(person.id)) {
      return false;
    }

    if (Array.isArray(filters.excludePersonIds) && filters.excludePersonIds.includes(person.id)) {
      return false;
    }

    if (Array.isArray(filters.recordTypes) && filters.recordTypes.length > 0 && !filters.recordTypes.includes(getRecordType(person))) {
      return false;
    }

    if (Array.isArray(filters.includeGroupsAll) && filters.includeGroupsAll.length > 0) {
      const includesAll = filters.includeGroupsAll.every((group) => personGroups.has(group));
      if (!includesAll) return false;
    }

    if (Array.isArray(filters.includeGroupsAny) && filters.includeGroupsAny.length > 0) {
      const includesAny = filters.includeGroupsAny.some((group) => personGroups.has(group));
      if (!includesAny) return false;
    }

    if (Array.isArray(filters.excludeGroupsAny) && filters.excludeGroupsAny.length > 0) {
      const excludesAny = filters.excludeGroupsAny.some((group) => personGroups.has(group));
      if (excludesAny) return false;
    }

    return true;
  }

  function getInitials(name) {
    const words = String(name || "")
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 0) return "?";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

    return words
      .slice(0, 2)
      .map((word) => word[0].toUpperCase())
      .join("");
  }

  function getAccentColor(person) {
    const groups = person.groups || [];

    if (groups.includes("elves") && groups.includes("half-elven")) return "#617c72";
    if (groups.includes("elves")) return "#4a7067";
    if (groups.includes("dwarves")) return "#735d43";
    if (groups.includes("hobbits")) return "#607246";
    if (person.recordType === "aggregate") return "#8a6841";

    return "#8a5f35";
  }

  function makePortraitPlaceholder(person) {
    const accent = getAccentColor(person);
    const initials = getInitials(person.name);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
        <defs>
          <radialGradient id="parchment" cx="42%" cy="32%" r="72%">
            <stop offset="0" stop-color="#fff6dc" />
            <stop offset="1" stop-color="#d8bb83" />
          </radialGradient>
          <radialGradient id="seal" cx="38%" cy="30%" r="76%">
            <stop offset="0" stop-color="${accent}" stop-opacity="0.84" />
            <stop offset="1" stop-color="${accent}" />
          </radialGradient>
        </defs>
        <circle cx="110" cy="110" r="106" fill="url(#parchment)" />
        <circle cx="110" cy="110" r="94" fill="url(#seal)" stroke="#7e5829" stroke-width="5" />
        <circle cx="110" cy="110" r="82" fill="none" stroke="#e3c47f" stroke-width="2" opacity="0.8" />
        <circle cx="110" cy="22" r="3" fill="#ead08f" />
        <circle cx="198" cy="110" r="3" fill="#ead08f" />
        <circle cx="110" cy="198" r="3" fill="#ead08f" />
        <circle cx="22" cy="110" r="3" fill="#ead08f" />
        <text x="110" y="129" text-anchor="middle" font-family="Georgia, serif" font-size="68" font-weight="bold" fill="#fff5dd">${initials}</text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function isAbsoluteOrSpecialUrl(url) {
    return /^(?:data:|[a-z][a-z0-9+.-]*:|\/|#)/i.test(String(url || ""));
  }

  function resolveTreeAssetUrl(url) {
    const source = String(url || "").trim();
    if (!source || isAbsoluteOrSpecialUrl(source)) {
      return source;
    }

    if (!state.currentDataBaseUrl || source.startsWith(state.currentDataBaseUrl)) {
      return source;
    }

    return `${state.currentDataBaseUrl}${source}`;
  }

  function getPortrait(person) {
    return person.image ? resolveTreeAssetUrl(person.image) : makePortraitPlaceholder(person);
  }

  function getPortraitThumbnail(person, size = 128) {
    const source = String(person?.image || "").trim();
    if (!source) {
      return makePortraitPlaceholder(person);
    }

    if (isAbsoluteOrSpecialUrl(source)) {
      return resolveTreeAssetUrl(source);
    }

    const slashIndex = source.lastIndexOf("/");
    const directory = slashIndex >= 0 ? source.slice(0, slashIndex + 1) : "";
    const filename = slashIndex >= 0 ? source.slice(slashIndex + 1) : source;
    const extensionIndex = filename.lastIndexOf(".");
    const basename = extensionIndex > 0 ? filename.slice(0, extensionIndex) : filename;
    return resolveTreeAssetUrl(`${directory}thumbs/${basename}-${size}.webp`);
  }

  function applyHtmlPortraitFallback(image) {
    if (!(image instanceof HTMLImageElement) || image.dataset.portraitFallbackApplied === "true") {
      return;
    }

    const personId = image.dataset.portraitPersonId;
    const person = personId ? getPersonById(personId) : null;
    if (!person) {
      return;
    }

    const placeholder = makePortraitPlaceholder(person);
    image.dataset.portraitFallbackApplied = "true";
    image.src = placeholder;

    const portraitButton = image.closest(".character-header__portrait-button");
    if (portraitButton) {
      portraitButton.setAttribute("data-portrait-src", placeholder);
    }
  }

  function getLifeLine(person) {
    if (person.born && person.died) return `${person.born} - ${person.died}`;
    if (person.born) return `Born ${person.born}`;
    if (person.died) return `Died ${person.died}`;
    return "Dates unknown";
  }

  function getDisplayTitle(person) {
    if (person.title) return person.title;
    if (person.kindred) return person.kindred;
    return "Lineage record";
  }

  function getPersonById(personId, dataset = data) {
    return dataset?.people?.[personId] || null;
  }

  function getUnionById(unionId) {
    return state.indexes.unionById.get(unionId) || null;
  }

  function buildIndexes(dataset = data) {
    const personIds = new Set(Object.keys(dataset.people || {}));
    const unionById = new Map();
    const unionsByPartner = new Map();
    const parentUnionByChild = new Map();
    const errors = [];

    Object.entries(dataset.people || {}).forEach(([personId, person]) => {
      if (person.id !== personId) {
        errors.push(`people.${personId}.id must match its key.`);
      }

      if (!person.name) {
        errors.push(`people.${personId}.name is required.`);
      }
    });

    (dataset.unions || []).forEach((union, index) => {
      if (!union.id) {
        errors.push(`unions[${index}] is missing an id.`);
        return;
      }

      if (unionById.has(union.id)) {
        errors.push(`union id "${union.id}" is duplicated.`);
      }

      unionById.set(union.id, union);

      if (!Array.isArray(union.partners) || union.partners.length === 0) {
        errors.push(`union "${union.id}" must have at least one partner.`);
      }

      if (!Array.isArray(union.children)) {
        errors.push(`union "${union.id}" must define children as an array.`);
      }

      if (union.partners.length !== new Set(union.partners).size) {
        errors.push(`union "${union.id}" has duplicate partner ids.`);
      }

      if (Array.isArray(union.children) && union.children.length !== new Set(union.children).size) {
        errors.push(`union "${union.id}" has duplicate child ids.`);
      }

      if (union.order !== undefined && !Number.isFinite(union.order)) {
        errors.push(`union "${union.id}".order must be a number when provided.`);
      }

      if (union.partnerGap !== undefined && !Number.isFinite(union.partnerGap)) {
        errors.push(`union "${union.id}".partnerGap must be a number when provided.`);
      }

      if (union.partnerNudges !== undefined && (typeof union.partnerNudges !== "object" || union.partnerNudges === null || Array.isArray(union.partnerNudges))) {
        errors.push(`union "${union.id}".partnerNudges must be an object when provided.`);
      }

      if (union.partnerOrder !== undefined && !Array.isArray(union.partnerOrder)) {
        errors.push(`union "${union.id}".partnerOrder must be an array when provided.`);
      }

      if (union.childOrder !== undefined && !Array.isArray(union.childOrder)) {
        errors.push(`union "${union.id}".childOrder must be an array when provided.`);
      }

      if (union.lineagePartner !== undefined && !union.partners.includes(union.lineagePartner)) {
        errors.push(`union "${union.id}".lineagePartner must reference one of its partners when provided.`);
      }

      if (union.lineageChild !== undefined && !union.children.includes(union.lineageChild)) {
        errors.push(`union "${union.id}".lineageChild must reference one of its children when provided.`);
      }

      if (union.partnerNudges) {
        Object.entries(union.partnerNudges).forEach(([partnerId, deltaX]) => {
          if (!union.partners.includes(partnerId)) {
            errors.push(`union "${union.id}".partnerNudges references non-partner "${partnerId}".`);
          }

          if (!Number.isFinite(deltaX)) {
            errors.push(`union "${union.id}".partnerNudges["${partnerId}"] must be a finite number.`);
          }
        });
      }

      union.partners.forEach((partnerId) => {
        if (!personIds.has(partnerId)) {
          errors.push(`union "${union.id}" references missing partner "${partnerId}".`);
          return;
        }

        if (!unionsByPartner.has(partnerId)) {
          unionsByPartner.set(partnerId, []);
        }

        unionsByPartner.get(partnerId).push(union.id);
      });

      union.children.forEach((childId) => {
        if (!personIds.has(childId)) {
          errors.push(`union "${union.id}" references missing child "${childId}".`);
          return;
        }

        if (parentUnionByChild.has(childId)) {
          errors.push(`child "${childId}" appears in more than one union, which this renderer does not support cleanly.`);
          return;
        }

        parentUnionByChild.set(childId, union.id);
      });
    });

    Object.entries(dataset.views || {}).forEach(([viewId, view]) => {
      (view.seeds || []).forEach((seedId) => {
        if (!personIds.has(seedId)) {
          errors.push(`view "${viewId}" references missing seed "${seedId}".`);
        }
      });

      (view.roots || []).forEach((rootId) => {
        if (!personIds.has(rootId)) {
          errors.push(`view "${viewId}" references missing root "${rootId}".`);
        }
      });

      (view.filters?.includePersonIds || []).forEach((personId) => {
        if (!personIds.has(personId)) {
          errors.push(`view "${viewId}" filter references missing included person "${personId}".`);
        }
      });

      (view.filters?.excludePersonIds || []).forEach((personId) => {
        if (!personIds.has(personId)) {
          errors.push(`view "${viewId}" filter references missing excluded person "${personId}".`);
        }
      });

      if (view.includeSiblingBranches !== undefined && typeof view.includeSiblingBranches !== "boolean") {
        errors.push(`view "${viewId}".includeSiblingBranches must be true or false when provided.`);
      }
    });

    if (errors.length > 0) {
      throw new Error(`Family tree data validation failed:\n${errors.join("\n")}`);
    }

    return {
      unionById,
      unionsByPartner,
      parentUnionByChild
    };
  }

  function getPartnerUnions(personId) {
    return (state.indexes.unionsByPartner.get(personId) || [])
      .map((unionId) => getUnionById(unionId))
      .filter(Boolean)
      .sort((left, right) => {
        const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;

        if (leftOrder !== rightOrder) {
          return leftOrder - rightOrder;
        }

        return String(left.id).localeCompare(String(right.id));
      });
  }

  function projectView(viewId) {
    const view = data.views[viewId];
    if (!view) {
      throw new Error(`Unknown family tree view "${viewId}".`);
    }

    if (view.emptyState || !Array.isArray(view.seeds) || view.seeds.length === 0) {
      return {
        empty: true,
        view,
        viewId,
        peopleIds: [],
        peopleSet: new Set(),
        unionIds: [],
        unionIdSet: new Set(),
        roots: []
      };
    }

    const stateByPerson = new Map();
    const queue = [];
    let queueIndex = 0;

    function enqueue(personId, nextState, reason) {
      if (!getPersonById(personId)) return;

      let record = stateByPerson.get(personId);
      let changed = false;

      if (!record) {
        record = {
          up: -1,
          down: -1,
          traverseSpouses: false,
          expandSpouseLineage: false,
          reasons: new Set()
        };
        stateByPerson.set(personId, record);
        changed = true;
      }

      if ((nextState.up ?? -1) > record.up) {
        record.up = nextState.up;
        changed = true;
      }

      if ((nextState.down ?? -1) > record.down) {
        record.down = nextState.down;
        changed = true;
      }

      if (nextState.traverseSpouses && !record.traverseSpouses) {
        record.traverseSpouses = true;
        changed = true;
      }

      if (nextState.expandSpouseLineage && !record.expandSpouseLineage) {
        record.expandSpouseLineage = true;
        changed = true;
      }

      record.reasons.add(reason);

      if (changed) {
        queue.push({
          personId,
          up: record.up,
          down: record.down,
          traverseSpouses: record.traverseSpouses,
          expandSpouseLineage: record.expandSpouseLineage
        });
      }
    }

    view.seeds.forEach((seedId) => {
      enqueue(
        seedId,
        {
          up: view.generationsUp ?? 0,
          down: view.generationsDown ?? 0,
          traverseSpouses: Boolean(view.includeSpouses),
          expandSpouseLineage: Boolean(view.includeSpouseLineage)
        },
        "seed"
      );
    });

    while (queueIndex < queue.length) {
      const current = queue[queueIndex++];
      const partnerUnions = getPartnerUnions(current.personId);

      if (current.traverseSpouses) {
        partnerUnions.forEach((union) => {
          union.partners.forEach((partnerId) => {
            if (partnerId === current.personId) return;

            enqueue(
              partnerId,
              {
                up: current.expandSpouseLineage ? current.up : 0,
                down: current.expandSpouseLineage ? current.down : 0,
                traverseSpouses: false,
                expandSpouseLineage: false
              },
              "spouse"
            );
          });
        });
      }

      if (current.down > 0) {
        partnerUnions.forEach((union) => {
          union.children.forEach((childId) => {
            enqueue(
              childId,
              {
                up: 0,
                down: current.down - 1,
                traverseSpouses: Boolean(view.includeSpouses),
                expandSpouseLineage: false
              },
              "descendant"
            );
          });
        });
      }

      if (current.up > 0) {
        const parentUnionId = state.indexes.parentUnionByChild.get(current.personId);
        const parentUnion = parentUnionId ? getUnionById(parentUnionId) : null;

        if (parentUnion) {
          parentUnion.partners.forEach((parentId) => {
            enqueue(
              parentId,
              {
                up: current.up - 1,
                down: 0,
                traverseSpouses: Boolean(view.includeSpouses),
                expandSpouseLineage: false
              },
              "ancestor"
            );
          });

          if (view.includeSiblingBranches) {
            parentUnion.children.forEach((siblingId) => {
              if (siblingId === current.personId) return;

              enqueue(
                siblingId,
                {
                  up: 0,
                  down: view.generationsDown ?? 0,
                  traverseSpouses: Boolean(view.includeSpouses),
                  expandSpouseLineage: false
                },
                "sibling-branch"
              );
            });
          }
        }
      }
    }

    const peopleIds = Array.from(stateByPerson.keys()).sort(comparePeopleIds);

    const peopleSet = new Set(peopleIds);
    const unionIds = data.unions
      .filter((union) =>
        union.partners.some((partnerId) => peopleSet.has(partnerId)) ||
        union.children.some((childId) => peopleSet.has(childId))
      )
      .map((union) => union.id);
    const unionIdSet = new Set(unionIds);

    const roots = uniqueOrdered([...(view.roots || []), ...(view.seeds || [])].filter((personId) => peopleSet.has(personId)));

    return {
      empty: peopleIds.length === 0,
      view,
      viewId,
      peopleIds,
      peopleSet,
      unionIds,
      unionIdSet,
      roots: roots.length > 0 ? roots : peopleIds.slice(0, 1)
    };
  }

  function collectDescendants(personId, projection) {
    const descendants = new Set();
    const queue = [personId];
    let queueIndex = 0;

    while (queueIndex < queue.length) {
      const currentId = queue[queueIndex++];
      getPartnerUnions(currentId).forEach((union) => {
        if (!projection.unionIdSet.has(union.id)) return;

        union.children.forEach((childId) => {
          if (!projection.peopleSet.has(childId) || descendants.has(childId)) return;
          descendants.add(childId);
          queue.push(childId);
        });
      });
    }

    descendants.delete(personId);
    return descendants;
  }

  function collectAncestors(personId, projection) {
    const ancestors = new Set();
    const queue = [personId];
    let queueIndex = 0;

    while (queueIndex < queue.length) {
      const currentId = queue[queueIndex++];
      const parentUnionId = state.indexes.parentUnionByChild.get(currentId);
      if (!parentUnionId || !projection.unionIdSet.has(parentUnionId)) continue;

      const parentUnion = getUnionById(parentUnionId);
      if (!parentUnion) continue;

      parentUnion.partners.forEach((parentId) => {
        if (!projection.peopleSet.has(parentId) || ancestors.has(parentId)) return;
        ancestors.add(parentId);
        queue.push(parentId);
      });
    }

    ancestors.delete(personId);
    return ancestors;
  }

  function deriveRoots(rawProjection, peopleIds, peopleSet) {
    const explicitRoots = uniqueOrdered((rawProjection.view.roots || []).filter((personId) => peopleSet.has(personId)));
    if (explicitRoots.length > 0) return explicitRoots;

    const inferredRoots = peopleIds.filter((personId) => {
      const parentUnionId = state.indexes.parentUnionByChild.get(personId);
      if (!parentUnionId) return true;

      const parentUnion = getUnionById(parentUnionId);
      if (!parentUnion) return true;

      return !parentUnion.partners.some((partnerId) => peopleSet.has(partnerId));
    });

    return inferredRoots.length > 0 ? inferredRoots : peopleIds.slice(0, 1);
  }

  function findAncestorPathIds(descendantId, ancestorId, projection = state.currentProjection) {
    if (!descendantId || !ancestorId) return null;
    if (!projection?.peopleSet?.has(descendantId) || !projection.peopleSet.has(ancestorId)) {
      return null;
    }

    const pathIds = [descendantId];
    let currentId = descendantId;

    while (currentId && currentId !== ancestorId) {
      const parentUnionId = state.indexes.parentUnionByChild.get(currentId);
      if (!parentUnionId || !projection.unionIdSet.has(parentUnionId)) {
        return null;
      }

      const parentUnion = getUnionById(parentUnionId);
      if (!parentUnion) {
        return null;
      }

      const nextAncestorId = parentUnion.partners.find((partnerId) => projection.peopleSet.has(partnerId));
      if (!nextAncestorId) {
        return null;
      }

      pathIds.push(nextAncestorId);
      currentId = nextAncestorId;
    }

    return currentId === ancestorId ? pathIds : null;
  }

  function rebuildProjection(rawProjection, visibleIds, extra = {}) {
    const visibleSet = visibleIds instanceof Set ? new Set(visibleIds) : new Set(visibleIds);
    const peopleIds = rawProjection.peopleIds.filter((personId) => visibleSet.has(personId));
    const peopleSet = new Set(peopleIds);
    const unionIds = rawProjection.unionIds.filter((unionId) => {
      const union = getUnionById(unionId);
      if (!union) return false;

      const visiblePartners = union.partners.filter((partnerId) => peopleSet.has(partnerId));
      const visibleChildren = union.children.filter((childId) => peopleSet.has(childId));
      return visiblePartners.length > 0 && (visiblePartners.length > 1 || visibleChildren.length > 0);
    });
    const unionIdSet = new Set(unionIds);
    const roots = deriveRoots(rawProjection, peopleIds, peopleSet);

    return {
      ...rawProjection,
      empty: peopleIds.length === 0,
      peopleIds,
      peopleSet,
      unionIds,
      unionIdSet,
      roots,
      ...extra
    };
  }

  function applyViewFilters(rawProjection) {
    if (rawProjection.empty || !rawProjection.view.filters) {
      return rawProjection;
    }

    const { filters } = rawProjection.view;
    const coreIds = new Set(
      rawProjection.peopleIds.filter((personId) => personMatchesViewFilters(getPersonById(personId), filters))
    );

    if (filters.preserveSeeds !== false) {
      (rawProjection.view.seeds || []).forEach((personId) => {
        if (rawProjection.peopleSet.has(personId)) {
          coreIds.add(personId);
        }
      });

      rawProjection.roots.forEach((personId) => {
        if (rawProjection.peopleSet.has(personId)) {
          coreIds.add(personId);
        }
      });
    }

    (filters.alwaysInclude || []).forEach((personId) => {
      if (rawProjection.peopleSet.has(personId)) {
        coreIds.add(personId);
      }
    });

    const visibleIds = new Set(coreIds);

    if (filters.preserveAncestors) {
      Array.from(coreIds).forEach((personId) => {
        collectAncestors(personId, rawProjection).forEach((ancestorId) => {
          visibleIds.add(ancestorId);
        });
      });
    }

    if (filters.preserveDescendants) {
      Array.from(coreIds).forEach((personId) => {
        collectDescendants(personId, rawProjection).forEach((descendantId) => {
          visibleIds.add(descendantId);
        });
      });
    }

    if (filters.preserveSpouses) {
      Array.from(visibleIds).forEach((personId) => {
        getPartnerUnions(personId).forEach((union) => {
          if (!rawProjection.unionIdSet.has(union.id)) return;

          union.partners.forEach((partnerId) => {
            if (rawProjection.peopleSet.has(partnerId)) {
              visibleIds.add(partnerId);
            }
          });
        });
      });
    }

    return rebuildProjection(rawProjection, visibleIds, {
      coreIds
    });
  }

  function applyCollapsedProjection(rawProjection) {
    if (rawProjection.empty) return rawProjection;

    const hiddenIds = new Set();

    state.collapsedIds.forEach((personId) => {
      collectDescendants(personId, rawProjection).forEach((descendantId) => {
        hiddenIds.add(descendantId);
      });
    });

    const visibleIds = rawProjection.peopleIds.filter((personId) => !hiddenIds.has(personId));
    return rebuildProjection(rawProjection, visibleIds, {
      hiddenIds
    });
  }

  function getVisibleUnions(projection) {
    return projection.unionIds
      .map((unionId) => {
        const union = getUnionById(unionId);
        if (!union) return null;

        const visiblePartners = applyPreferredOrder(
          union.partners.filter((partnerId) => projection.peopleSet.has(partnerId)),
          union.partnerOrder
        );
        const visibleChildren = applyPreferredOrder(
          union.children.filter((childId) => projection.peopleSet.has(childId)),
          union.childOrder
        );

        return {
          ...union,
          visiblePartners,
          visibleChildren
        };
      })
      .filter(Boolean)
      .sort((left, right) => {
        const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;

        if (leftOrder !== rightOrder) {
          return leftOrder - rightOrder;
        }

        return String(left.id).localeCompare(String(right.id));
      })
      .filter((union) => union.visiblePartners.length > 0 && (union.visiblePartners.length > 1 || union.visibleChildren.length > 0));
  }

  function getDirectChildrenInProjection(personId, projection) {
    return getPartnerUnions(personId)
      .filter((union) => projection.unionIdSet.has(union.id))
      .flatMap((union) => union.children.filter((childId) => projection.peopleSet.has(childId)));
  }

  function buildElkGraph(projection) {
    const unionInfos = getVisibleUnions(projection);

    return {
      graph: {
        id: "root",
        layoutOptions: {
          "elk.algorithm": "layered",
          "elk.direction": "DOWN",
          "elk.edgeRouting": "ORTHOGONAL",
          "elk.padding": "[top=80,left=80,bottom=80,right=80]",
          "elk.spacing.nodeNode": "46",
          "elk.layered.spacing.nodeNodeBetweenLayers": "32",
          "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
          "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
          "elk.layered.considerModelOrder.strategy": "NODES_AND_EDGES"
        },
        children: [
          ...projection.peopleIds.map((personId) => ({
            id: personId,
            width: cardWidth,
            height: cardHeight
          })),
          ...unionInfos.map((union) => ({
            id: union.id,
            width: unionNodeSize,
            height: unionNodeSize
          }))
        ],
        edges: [
          ...unionInfos.flatMap((union) =>
            union.visiblePartners.map((partnerId, index) => ({
              id: `${union.id}-partner-${index}`,
              sources: [partnerId],
              targets: [union.id]
            }))
          ),
          ...unionInfos.flatMap((union) =>
            union.visibleChildren.map((childId, index) => ({
              id: `${union.id}-child-${index}`,
              sources: [union.id],
              targets: [childId]
            }))
          )
        ]
      },
      unionInfos
    };
  }

  function calculateLayoutBoundsFromPeople(people) {
    return calculateBoundsFromBoxes(Array.from(people.values()));
  }

  function calculateBoundsFromBoxes(boxes) {
    if (boxes.length === 0) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
    }

    const bounds = {
      minX: Math.min(...boxes.map((box) => box.left)) - 40,
      minY: Math.min(...boxes.map((box) => box.top)) - 40,
      maxX: Math.max(...boxes.map((box) => box.right)) + 40,
      maxY: Math.max(...boxes.map((box) => box.bottom)) + 40
    };

    bounds.width = bounds.maxX - bounds.minX;
    bounds.height = bounds.maxY - bounds.minY;
    return bounds;
  }

  function getViewLayoutAnnotations(projection) {
    const viewLayout = getEffectiveViewLayout(projection.viewId);
    return Array.isArray(viewLayout?.annotations) ? viewLayout.annotations : [];
  }

  function buildLayoutAnnotations(layout, projection) {
    return getViewLayoutAnnotations(projection)
      .map((annotation, index) => {
        if (!annotation || typeof annotation !== "object") {
          return null;
        }

        const startBox = layout.people.get(annotation.startPersonId);
        const endBox = layout.people.get(annotation.endPersonId);
        if (!startBox || !endBox) {
          return null;
        }

        const side = annotation.side === "right" ? "right" : "left";
        const paddingY = Number.isFinite(annotation.paddingY) ? annotation.paddingY : annotationVerticalPadding;
        const width = Number.isFinite(annotation.width) ? annotation.width : annotationLabelWidth;
        const gap = Number.isFinite(annotation.gap) ? annotation.gap : annotationLabelGap;
        const top = Math.min(startBox.top, endBox.top) - paddingY;
        const bottom = Math.max(startBox.bottom, endBox.bottom) + paddingY;
        const centerTop = Math.min(startBox.centerY, endBox.centerY);
        const centerBottom = Math.max(startBox.centerY, endBox.centerY);
        const spannedBoxes = Array.from(layout.people.values())
          .filter((box) => box.centerY >= centerTop && box.centerY <= centerBottom);
        const anchorBoxes = spannedBoxes.length > 0 ? spannedBoxes : [startBox, endBox];
        const minX = Math.min(...anchorBoxes.map((box) => box.left));
        const maxX = Math.max(...anchorBoxes.map((box) => box.right));
        const height = Math.max(annotationMinHeight, bottom - top);
        const left = side === "right" ? maxX + gap : minX - gap - width;
        const interactive = interactiveAnnotationIds.has(annotation.id);
        let memberPersonIds = [];
        let memberUnionIds = [];
        let interactionLeft = left;
        let interactionRight = left + width;
        let interactionTop = top;
        let interactionBottom = top + height;

        if (interactive) {
          const lineagePathIds = findAncestorPathIds(annotation.endPersonId, annotation.startPersonId, projection)
            || findAncestorPathIds(annotation.startPersonId, annotation.endPersonId, projection);

          if (lineagePathIds) {
            memberPersonIds = uniqueOrdered(lineagePathIds);
            memberUnionIds = memberPersonIds
              .slice(0, -1)
              .map((personId) => state.indexes.parentUnionByChild.get(personId))
              .filter((unionId, memberIndex, unionIds) =>
                unionId
                && projection.unionIdSet.has(unionId)
                && unionIds.indexOf(unionId) === memberIndex
              );

            const memberBoxes = memberPersonIds
              .map((personId) => layout.people.get(personId))
              .filter(Boolean);

            if (memberBoxes.length > 0) {
              const zoneMinX = Math.min(...memberBoxes.map((box) => box.left)) - lineageZonePaddingX;
              const zoneMaxX = Math.max(...memberBoxes.map((box) => box.right)) + lineageZonePaddingX;
              const zoneTop = Math.min(...memberBoxes.map((box) => box.top)) - lineageZonePaddingY;
              const zoneBottom = Math.max(...memberBoxes.map((box) => box.bottom)) + lineageZonePaddingY;

              interactionLeft = Math.min(left, zoneMinX);
              interactionRight = Math.max(left + width, zoneMaxX);
              interactionTop = Math.min(top, zoneTop);
              interactionBottom = Math.max(top + height, zoneBottom);
            }
          }
        }

        return {
          id: annotation.id || `annotation-${index}`,
          label: String(annotation.label || ""),
          side,
          left,
          top,
          right: left + width,
          bottom: top + height,
          width,
          height,
          bracketGap: Math.max(28, gap - 22),
          interactive,
          memberPersonIds,
          memberUnionIds,
          interactionLeft,
          interactionRight,
          interactionTop,
          interactionBottom
        };
      })
      .filter(Boolean);
  }

  function addAnnotationsToLayout(layout, projection) {
    const annotations = buildLayoutAnnotations(layout, projection);

    return {
      ...layout,
      annotations,
      bounds: calculateBoundsFromBoxes([
        ...Array.from(layout.people.values()),
        ...annotations
      ])
    };
  }

  function buildManualLayoutFromPeople(projection, unionInfos, people) {
    const unions = unionInfos.map((union) => {
      const partners = union.visiblePartners
        .map((partnerId) => people.get(partnerId))
        .filter(Boolean)
        .sort((left, right) => left.centerX - right.centerX);
      const children = union.visibleChildren
        .map((childId) => people.get(childId))
        .filter(Boolean)
        .sort((left, right) => left.centerX - right.centerX);
      const lineagePartnerId = union.lineagePartner && union.visiblePartners.includes(union.lineagePartner)
        ? union.lineagePartner
        : union.visiblePartners[0] || null;
      const lineageChildId = union.lineageChild && union.visibleChildren.includes(union.lineageChild)
        ? union.lineageChild
        : union.visibleChildren[0] || null;

      const spouseLineY = partners.length > 0
        ? average(partners.map((partner) => partner.centerY))
        : 0;
      const anchorX = partners.length > 1
        ? average(partners.map((partner) => partner.centerX))
        : partners.length === 1
          ? partners[0].centerX
          : 0;
      const descentOriginX = anchorX;
      const descentOriginY = partners.length === 1
        ? partners[0].bottom
        : spouseLineY;
      const firstChildTop = children.length > 0 ? Math.min(...children.map((child) => child.top)) : null;
      const branchY = firstChildTop === null
        ? null
        : Math.min(
            firstChildTop - siblingBarMinGapToChild,
            descentOriginY + Math.max(siblingBarMinDropFromParents, (firstChildTop - descentOriginY) * siblingBarDropFactor)
          );

      return {
        id: union.id,
        label: union.label,
        visiblePartners: union.visiblePartners,
        visibleChildren: union.visibleChildren,
        lineagePartnerId,
        lineageChildId,
        partners,
        children,
        spouseLineY,
        anchorX,
        descentOriginX,
        descentOriginY,
        branchY,
        symbolX: anchorX,
        symbolY: spouseLineY
      };
    });

    const layout = {
      people,
      unions,
      bounds: calculateLayoutBoundsFromPeople(people),
      mode: "manual",
      unionInfos
    };

    return addAnnotationsToLayout(layout, projection);
  }

  function applyManualLayoutToBase(baseLayout, projection, unionInfos, manualLayout) {
    const manualPositions = manualLayout?.positions || {};
    const people = new Map();

    projection.peopleIds.forEach((personId) => {
      const baseBox = baseLayout.people.get(personId);
      if (!baseBox) {
        return;
      }

      const override = manualPositions[personId];
      people.set(personId, syncLayoutBox({
        id: personId,
        x: Number.isFinite(override?.x) ? override.x : baseBox.left,
        y: Number.isFinite(override?.y) ? override.y : baseBox.top,
        width: cardWidth,
        height: cardHeight
      }));
    });

    return buildManualLayoutFromPeople(projection, unionInfos, people);
  }

  function normalizeLayout(layoutResult, projection, unionInfos) {
    const people = new Map();
    const unionNodes = new Map();

    layoutResult.children.forEach((node) => {
      if (projection.peopleSet.has(node.id)) {
        people.set(node.id, {
          id: node.id,
          x: node.x,
          y: node.y,
          width: cardWidth,
          height: cardHeight
        });
      } else {
        unionNodes.set(node.id, {
          id: node.id,
          x: node.x,
          y: node.y,
          width: unionNodeSize,
          height: unionNodeSize
        });
      }
    });

    function syncBox(box) {
      return syncLayoutBox(box);
    }

    people.forEach(syncBox);
    unionNodes.forEach(syncBox);

    function assignOrderedX(boxesInPreferredOrder) {
      if (boxesInPreferredOrder.length < 2) return boxesInPreferredOrder;

      const slotXs = boxesInPreferredOrder
        .slice()
        .sort((left, right) => left.x - right.x)
        .map((box) => box.x);

      boxesInPreferredOrder.forEach((box, index) => {
        box.x = slotXs[index];
        syncBox(box);
      });

      return boxesInPreferredOrder;
    }

    function shiftBox(box, deltaX) {
      if (!box || deltaX === 0) return box;
      box.x += deltaX;
      syncBox(box);
      return box;
    }

    function shiftBoxY(box, deltaY) {
      if (!box || deltaY === 0) return box;
      box.y += deltaY;
      syncBox(box);
      return box;
    }

    function getVisibleParentUnionId(personId) {
      const parentUnionId = state.indexes.parentUnionByChild.get(personId);
      if (!parentUnionId || !projection.unionIdSet.has(parentUnionId)) {
        return null;
      }

      return parentUnionId;
    }

    function getVisibleLineagePartnerId(union) {
      if (union.lineagePartner && union.visiblePartners.includes(union.lineagePartner)) {
        return union.lineagePartner;
      }

      return union.visiblePartners[0] || null;
    }

    function getVisibleLineageChildId(union) {
      if (union.lineageChild && union.visibleChildren.includes(union.lineageChild)) {
        return union.lineageChild;
      }

      return union.visibleChildren[0] || null;
    }

    function getAnchoredPartnerIds(union) {
      return union.visiblePartners.filter((partnerId) => Boolean(getVisibleParentUnionId(partnerId)));
    }

    function getOrderedPartnerBoxes(union, partnerById) {
      return union.visiblePartners
        .map((partnerId) => partnerById.get(partnerId))
        .filter(Boolean);
    }

    function hasVisibleFamilyElsewhere(personId, excludingUnionId) {
      return getPartnerUnions(personId).some((union) => (
        union.id !== excludingUnionId
        && projection.unionIdSet.has(union.id)
        && (
          union.partners.filter((partnerId) => projection.peopleSet.has(partnerId)).length > 1
          || union.children.filter((childId) => projection.peopleSet.has(childId)).length > 0
        )
      ));
    }

    function positionPartnersCentered(union, partnerById, targetCenterX, gap = coupleGap) {
      const orderedPartnerIds = union.visiblePartners.filter((partnerId) => partnerById.has(partnerId));
      const orderedPartners = orderedPartnerIds
        .map((partnerId) => partnerById.get(partnerId))
        .filter(Boolean);

      if (orderedPartners.length === 0) {
        return [];
      }

      const totalWidth = orderedPartners.reduce((sum, partner) => sum + partner.width, 0) + gap * Math.max(0, orderedPartners.length - 1);
      let cursorX = targetCenterX - totalWidth / 2;

      orderedPartners.forEach((partner) => {
        partner.x = cursorX;
        syncBox(partner);
        cursorX += partner.width + gap;
      });

      return orderedPartners;
    }

    function applyPartnerNudges(union, partnerById) {
      if (!union.partnerNudges) {
        return partnerById;
      }

      Object.entries(union.partnerNudges).forEach(([partnerId, deltaX]) => {
        const partnerBox = partnerById.get(partnerId);
        if (!partnerBox || !Number.isFinite(deltaX) || deltaX === 0) {
          return;
        }

        shiftBox(partnerBox, deltaX);
      });

      return partnerById;
    }

    function enforceMinimumPartnerGap(union, partnerById, anchoredPartnerIds) {
      const anchoredSet = new Set(anchoredPartnerIds);
      const orderedPartners = getOrderedPartnerBoxes(union, partnerById);

      for (let index = 1; index < orderedPartners.length; index += 1) {
        const leftPartner = orderedPartners[index - 1];
        const rightPartner = orderedPartners[index];
        const overlap = leftPartner.right + coupleGap - rightPartner.left;

        if (overlap <= 0) {
          continue;
        }

        const leftAnchored = anchoredSet.has(leftPartner.id);
        const rightAnchored = anchoredSet.has(rightPartner.id);

        if (leftAnchored && !rightAnchored) {
          shiftBox(rightPartner, overlap);
          continue;
        }

        if (!leftAnchored && rightAnchored) {
          shiftBox(leftPartner, -overlap);
          continue;
        }

        if (leftAnchored && rightAnchored) {
          shiftBox(leftPartner, -overlap);
          continue;
        }

        shiftBox(leftPartner, -overlap / 2);
        shiftBox(rightPartner, overlap / 2);
      }

      return orderedPartners;
    }

    function positionPartnersForUnion(union, partners) {
      if (partners.length < 2) {
        return partners;
      }

      const partnerById = new Map(partners.map((partner) => [partner.id, partner]));
      const anchoredPartnerIds = getAnchoredPartnerIds(union);
      const explicitLineagePartnerId = union.lineagePartner && partnerById.has(union.lineagePartner)
        ? union.lineagePartner
        : null;
      const preferredGap = union.partnerGap ?? coupleGap;

      if (explicitLineagePartnerId) {
        positionPartnersCentered(union, partnerById, average(partners.map((partner) => partner.centerX)), union.partnerGap ?? lineagePartnerGap);
        applyPartnerNudges(union, partnerById);
        return partners;
      }

      if (partners.length === 2 && anchoredPartnerIds.length === 1) {
        const anchorId = anchoredPartnerIds[0];
        const anchorBox = partnerById.get(anchorId);
        const spouseBox = partners.find((partner) => partner.id !== anchorId);

        if (anchorBox && spouseBox) {
          const orderedPartnerIds = union.visiblePartners;
          const anchorIndex = orderedPartnerIds.indexOf(anchorId);
          const spouseIndex = orderedPartnerIds.indexOf(spouseBox.id);
          const direction = spouseIndex < anchorIndex ? -1 : 1;

          spouseBox.y = anchorBox.y;
          spouseBox.x = direction < 0
            ? anchorBox.left - spouseBox.width - preferredGap
            : anchorBox.right + preferredGap;
          syncBox(spouseBox);
          syncBox(anchorBox);
          applyPartnerNudges(union, partnerById);
          return partners;
        }
      }

      assignOrderedX(partners);
      enforceMinimumPartnerGap(union, partnerById, anchoredPartnerIds);
      applyPartnerNudges(union, partnerById);
      return partners;
    }

    function positionPartnersForLockedChild(union, partners, child) {
      if (partners.length === 0) {
        return partners;
      }

      const partnerById = new Map(partners.map((partner) => [partner.id, partner]));

      if (partners.length === 1) {
        const parent = partners[0];
        parent.x = child.centerX - parent.width / 2;
        syncBox(parent);
        applyPartnerNudges(union, partnerById);
        return partners;
      }

      positionPartnersCentered(union, partnerById, child.centerX, union.partnerGap ?? lineagePartnerGap);
      applyPartnerNudges(union, partnerById);
      return partners;
    }

    function refreshUnionGeometry(union) {
      union.partners.sort((left, right) => left.centerX - right.centerX);
      union.children.sort((left, right) => left.centerX - right.centerX);

      union.spouseLineY = union.partners.length > 0
        ? average(union.partners.map((partner) => partner.centerY))
        : 0;
      union.anchorX = union.partners.length > 1
        ? average(union.partners.map((partner) => partner.centerX))
        : union.partners.length === 1
          ? union.partners[0].centerX
          : 0;
      union.descentOriginX = union.anchorX;
      union.descentOriginY = union.partners.length === 1
          ? union.partners[0].bottom
          : union.spouseLineY;

      const firstChildTop = union.children.length > 0 ? Math.min(...union.children.map((child) => child.top)) : null;
      union.branchY = firstChildTop === null
        ? null
        : Math.min(
            firstChildTop - siblingBarMinGapToChild,
            union.descentOriginY + Math.max(siblingBarMinDropFromParents, (firstChildTop - union.descentOriginY) * siblingBarDropFactor)
          );
      union.symbolX = union.anchorX;
      union.symbolY = union.spouseLineY;
      return union;
    }

    function recenterUnionChildren(union) {
      if (union.children.length === 0) {
        return union;
      }

      if (union.children.length === 1) {
        const onlyChild = union.children[0];
        onlyChild.x = union.anchorX - onlyChild.width / 2;
        syncBox(onlyChild);
        return union;
      }

      const leftChild = union.children[0];
      const rightChild = union.children[union.children.length - 1];
      const currentMidpoint = (leftChild.centerX + rightChild.centerX) / 2;
      const shiftX = union.anchorX - currentMidpoint;

      union.children.forEach((child) => {
        child.x += shiftX;
        syncBox(child);
      });

      return union;
    }

    function enforceGenerationRowSpacing() {
      const boxes = Array.from(people.values())
        .sort((left, right) => {
          if (left.top !== right.top) {
            return left.top - right.top;
          }

          if (left.centerY !== right.centerY) {
            return left.centerY - right.centerY;
          }

          return left.left - right.left;
        });

      const rows = [];

      boxes.forEach((box) => {
        const currentRow = rows[rows.length - 1];

        if (!currentRow || Math.abs(box.top - currentRow.referenceTop) > rowClusterTolerance) {
          rows.push({
            referenceTop: box.top,
            boxes: [box]
          });
          return;
        }

        currentRow.boxes.push(box);
      });

      rows.forEach((row) => {
        row.top = Math.min(...row.boxes.map((box) => box.top));
        row.bottom = Math.max(...row.boxes.map((box) => box.bottom));
      });

      for (let index = 1; index < rows.length; index += 1) {
        const previousRow = rows[index - 1];
        const currentRow = rows[index];
        const minimumTop = previousRow.bottom + minimumRowGap;

        if (currentRow.top >= minimumTop) {
          continue;
        }

        const deltaY = minimumTop - currentRow.top;
        currentRow.boxes.forEach((box) => {
          shiftBoxY(box, deltaY);
        });
        currentRow.referenceTop += deltaY;
        currentRow.top += deltaY;
        currentRow.bottom += deltaY;
      }
    }

    function getLineagePartnerBox(union) {
      if (union.lineagePartnerId) {
        return union.partners.find((partner) => partner.id === union.lineagePartnerId) || null;
      }

      if (union.partners.length === 1) {
        return union.partners[0];
      }

      return null;
    }

    function alignPreferredLineageColumns() {
      const targetXByPerson = new Map();
      const sortedUnions = unions
        .slice()
        .sort((left, right) => left.symbolY - right.symbolY);

      sortedUnions.forEach((union) => {
        const lineagePartnerBox = getLineagePartnerBox(union);
        if (!lineagePartnerBox) {
          return;
        }

        const targetX = targetXByPerson.get(lineagePartnerBox.id);
        if (Number.isFinite(targetX)) {
          const deltaX = targetX - lineagePartnerBox.centerX;

          if (deltaX !== 0) {
            if (union.partners.length === 1) {
              shiftBox(lineagePartnerBox, deltaX);
            } else if (union.children.length === 1 && union.lineagePartnerId) {
              union.partners.forEach((partner) => shiftBox(partner, deltaX));
            } else if (union.lineagePartnerId) {
              shiftBox(lineagePartnerBox, deltaX);
            }
          }
        }

        refreshUnionGeometry(union);

        if (union.children.length === 1) {
          const onlyChild = union.children[0];
          targetXByPerson.set(onlyChild.id, lineagePartnerBox.centerX);
        }
      });
    }

    const unions = unionInfos.map((union) => {
      const partners = union.visiblePartners
        .map((partnerId) => people.get(partnerId))
        .filter(Boolean);

      const children = union.visibleChildren
        .map((childId) => people.get(childId))
        .filter(Boolean);
      const childById = new Map(children.map((child) => [child.id, child]));
      const lineagePartnerId = getVisibleLineagePartnerId(union);
      const lineageChildId = getVisibleLineageChildId(union);

      positionPartnersForUnion(union, partners);
      assignOrderedX(children);

      if (partners.length > 1) {
        const alignedTop = average(partners.map((partner) => partner.top));
        partners.forEach((partner) => {
          partner.y = alignedTop;
          syncBox(partner);
        });
      }

      if (children.length > 1) {
        const alignedTop = average(children.map((child) => child.top));
        children.forEach((child) => {
          child.y = alignedTop;
          syncBox(child);
        });
      }

      partners.sort((left, right) => left.centerX - right.centerX);
      children.sort((left, right) => left.centerX - right.centerX);

      const unionNode = unionNodes.get(union.id);
      const spouseLineY = partners.length > 0
        ? average(partners.map((partner) => partner.centerY))
        : unionNode
          ? unionNode.centerY
          : 0;
      const anchorX = partners.length > 1
        ? average(partners.map((partner) => partner.centerX))
        : partners.length === 1
          ? partners[0].centerX
          : unionNode
            ? unionNode.centerX
            : 0;
      const descentOriginX = anchorX;
      const descentOriginY = partners.length === 1
          ? partners[0].bottom
          : spouseLineY;

      const firstChildTop = children.length > 0 ? Math.min(...children.map((child) => child.top)) : null;
      const branchY = firstChildTop === null
        ? null
        : Math.min(
            firstChildTop - siblingBarMinGapToChild,
            descentOriginY + Math.max(siblingBarMinDropFromParents, (firstChildTop - descentOriginY) * siblingBarDropFactor)
          );

      return {
        id: union.id,
        label: union.label,
        visiblePartners: union.visiblePartners,
        visibleChildren: union.visibleChildren,
        lineagePartnerId,
        lineageChildId,
        partners,
        children,
        spouseLineY,
        anchorX,
        descentOriginX,
        descentOriginY,
        branchY,
        symbolX: anchorX,
        symbolY: spouseLineY
      };
    });

    unions.forEach((union) => {
      recenterUnionChildren(union);
      refreshUnionGeometry(union);
    });

    for (let index = unions.length - 1; index >= 0; index -= 1) {
      const union = unions[index];
      const lockedChild = union.children.length === 1 && hasVisibleFamilyElsewhere(union.children[0].id, union.id)
        ? union.children[0]
        : null;

      if (lockedChild) {
        positionPartnersForLockedChild(union, union.partners, lockedChild);
      } else {
        positionPartnersForUnion(union, union.partners);
      }

      if (union.partners.length > 1) {
        const alignedTop = average(union.partners.map((partner) => partner.top));
        union.partners.forEach((partner) => {
          partner.y = alignedTop;
          syncBox(partner);
        });
      }

      refreshUnionGeometry(union);
    }

    enforceGenerationRowSpacing();
    alignPreferredLineageColumns();
    unions
      .slice()
      .sort((left, right) => left.symbolY - right.symbolY)
      .forEach((union) => {
        refreshUnionGeometry(union);
        recenterUnionChildren(union);
        refreshUnionGeometry(union);
      });

    const layout = {
      people,
      unions,
      bounds: calculateLayoutBoundsFromPeople(people)
    };

    return addAnnotationsToLayout(layout, projection);
  }

  async function layoutProjection(projection) {
    const { graph, unionInfos } = buildElkGraph(projection);
    const layoutResult = await elk.layout(graph);
    const autoLayout = normalizeLayout(layoutResult, projection, unionInfos);
    const manualViewLayout = getEffectiveViewLayout(projection.viewId);
    const layout = manualViewLayout
      ? applyManualLayoutToBase(autoLayout, projection, unionInfos, manualViewLayout)
      : autoLayout;

    layout.autoLayout = autoLayout;
    layout.unionInfos = unionInfos;
    return layout;
  }

  function getFamilyGroups() {
    const familyGroups = familyTreeManifest?.familyGroups || data?.familyGroups;
    if (familyGroups && typeof familyGroups === "object" && Object.keys(familyGroups).length > 0) {
      return familyGroups;
    }

    return {
      [defaultFamilyGroupId]: {
        label: "Elves and Men",
        defaultView: data?.defaults?.initialView || null,
        order: 1
      }
    };
  }

  function getDefaultFamilyGroupId() {
    const familyGroups = getFamilyGroups();
    const defaultGroupId = familyTreeManifest?.defaults?.initialFamilyGroup || data?.defaults?.initialFamilyGroup;

    if (defaultGroupId && familyGroups[defaultGroupId]) {
      return defaultGroupId;
    }

    const initialView = data?.views?.[data?.defaults?.initialView];
    if (initialView?.familyGroup && familyGroups[initialView.familyGroup]) {
      return initialView.familyGroup;
    }

    return Object.keys(familyGroups)[0] || defaultFamilyGroupId;
  }

  function getViewFamilyGroupId(view) {
    const familyGroups = getFamilyGroups();
    if (view?.familyGroup && familyGroups[view.familyGroup]) {
      return view.familyGroup;
    }

    return state.currentFamilyGroupId || getDefaultFamilyGroupId();
  }

  function viewBelongsToFamilyGroup(view, familyGroupId) {
    if (!view) {
      return false;
    }

    return getViewFamilyGroupId(view) === familyGroupId;
  }

  function compareViewEntries(leftEntry, rightEntry) {
    const [, leftView] = leftEntry;
    const [, rightView] = rightEntry;
    const leftOrder = leftView.order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = rightView.order ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return String(leftView.label || leftEntry[0]).localeCompare(String(rightView.label || rightEntry[0]));
  }

  function getViewsForFamilyGroup(familyGroupId = state.currentFamilyGroupId || getDefaultFamilyGroupId()) {
    return Object.entries(data?.views || {})
      .filter(([, view]) => viewBelongsToFamilyGroup(view, familyGroupId))
      .sort(compareViewEntries);
  }

  function getDefaultViewIdForFamilyGroup(familyGroupId = state.currentFamilyGroupId || getDefaultFamilyGroupId()) {
    const familyGroup = getFamilyGroups()[familyGroupId] || null;
    const defaultViewId = familyGroup?.defaultView;

    if (defaultViewId && data?.views?.[defaultViewId] && viewBelongsToFamilyGroup(data.views[defaultViewId], familyGroupId)) {
      return defaultViewId;
    }

    if (data?.defaults?.initialView && data?.views?.[data.defaults.initialView] && viewBelongsToFamilyGroup(data.views[data.defaults.initialView], familyGroupId)) {
      return data.defaults.initialView;
    }

    return getViewsForFamilyGroup(familyGroupId)[0]?.[0] || null;
  }

  function getInitialFamilyGroupId() {
    const params = new URLSearchParams(window.location.search);
    const requestedFamilyGroup = params.get("family");
    const familyGroups = getFamilyGroups();

    if (requestedFamilyGroup && familyGroups[requestedFamilyGroup]) {
      return requestedFamilyGroup;
    }

    const requestedView = params.get("view");
    if (requestedView && data?.views?.[requestedView]) {
      return getViewFamilyGroupId(data.views[requestedView]);
    }

    return getDefaultFamilyGroupId();
  }

  function buildFamilyTreeHref({ familyGroupId = null, viewId = null } = {}) {
    const params = new URLSearchParams();

    if (familyGroupId) {
      params.set("family", familyGroupId);
    }

    if (viewId) {
      params.set("view", viewId);
    }


    const query = params.toString();
    return query ? `family_tree.html?${query}` : "family_tree.html";
  }

  function syncFamilyGroupLinks() {
    familyTreeGroupLinks.forEach((link) => {
      const familyGroupId = link.getAttribute("data-family-tree-group-link");
      const isCurrent = familyGroupId === state.currentFamilyGroupId;

      link.classList.toggle("atlas-map-nav__link--current", isCurrent);
      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }

      link.setAttribute("href", buildFamilyTreeHref({ familyGroupId }));
    });
  }

  function syncViewQueryParam(viewId) {
    const url = new URL(window.location.href);
    const view = data?.views?.[viewId];
    const familyGroupId = view ? getViewFamilyGroupId(view) : state.currentFamilyGroupId;

    if (familyGroupId) {
      url.searchParams.set("family", familyGroupId);
    }

    url.searchParams.set("view", viewId);
    window.history.replaceState({}, "", url);
  }

  function getInitialViewId() {
    const params = new URLSearchParams(window.location.search);
    const requestedView = params.get("view");
    const familyGroupId = state.currentFamilyGroupId || getInitialFamilyGroupId();

    if (requestedView && data?.views?.[requestedView] && viewBelongsToFamilyGroup(data.views[requestedView], familyGroupId)) {
      return requestedView;
    }

    return getDefaultViewIdForFamilyGroup(familyGroupId) || data?.defaults?.initialView;
  }

  function populateViewSelect() {
    viewSelect.innerHTML = "";

    getViewsForFamilyGroup().forEach(([viewId, view]) => {
      const option = document.createElement("option");
      option.value = viewId;
      option.textContent = view.label;
      viewSelect.appendChild(option);
    });
  }

  function hasExplicitViewRequest() {
    const params = new URLSearchParams(window.location.search);
    return params.has("view") && Boolean(params.get("view"));
  }

  function isCompactControlsViewport() {
    return window.matchMedia("(max-width: 760px)").matches;
  }

  function setTreeControlsOpen(isOpen) {
    treeViewPanel?.classList.toggle("is-open", isOpen);
    treeControlsToggle?.setAttribute("aria-expanded", String(isOpen));

    if (isOpen && isCompactControlsViewport()) {
      window.setTimeout(() => viewSelect?.focus(), 180);
    }
  }

  function showWelcomeChoices() {
    treeWelcomeChoices?.classList.remove("hidden");
    treeWelcomeLineages?.classList.add("hidden");
    treeWelcomeSearchView?.classList.add("hidden");
    if (treeWelcomeSearch) {
      treeWelcomeSearch.value = "";
    }
    if (treeWelcomeSearchResults) {
      treeWelcomeSearchResults.innerHTML = "";
    }
  }

  function getCompleteViewId() {
    return getDefaultViewIdForFamilyGroup(state.currentFamilyGroupId) || getInitialViewId();
  }

  function populateWelcomeLineages() {
    if (!treeWelcomeLineageList) {
      return;
    }

    const completeViewId = getCompleteViewId();
    const lineageViews = getViewsForFamilyGroup()
      .filter(([viewId]) => viewId !== completeViewId)
      .filter(([viewId]) => {
        try {
          return !projectView(viewId).empty;
        } catch (_error) {
          return false;
        }
      });

    if (lineageViews.length === 0) {
      treeWelcomeLineageList.innerHTML = `
        <p class="tree-welcome__lineage-empty">No separate lineage chapters have been entered for this volume yet. The complete genealogy remains available.</p>
      `;
      return;
    }

    treeWelcomeLineageList.innerHTML = lineageViews.map(([viewId, view]) => `
      <button class="tree-welcome__lineage-button" type="button" data-welcome-view-id="${escapeHtml(viewId)}">
        <strong>${escapeHtml(view.label || viewId)}</strong>
        <span>${escapeHtml(view.description || "Open this family branch at a readable scale.")}</span>
      </button>
    `).join("");
  }

  function showTreeWelcome() {
    hideCharacterSheet();
    setTreeControlsOpen(false);
    showWelcomeChoices();
    populateWelcomeLineages();
    [atlasNavigation, treeViewPanel, treeHost, treeControlsToggle].forEach((element) => {
      element?.setAttribute("inert", "");
      element?.setAttribute("aria-hidden", "true");
    });
    treeWelcome?.classList.remove("hidden");
    treeWelcome?.setAttribute("aria-hidden", "false");

    window.setTimeout(() => {
      treeWelcome?.querySelector("[data-welcome-action]")?.focus();
    }, 20);
  }

  function hideTreeWelcome() {
    treeWelcome?.classList.add("hidden");
    treeWelcome?.setAttribute("aria-hidden", "true");
    [atlasNavigation, treeViewPanel, treeHost, treeControlsToggle].forEach((element) => {
      element?.removeAttribute("inert");
      element?.removeAttribute("aria-hidden");
    });
  }

  function trapWelcomeFocus(event) {
    if (event.key !== "Tab" || !treeWelcome || treeWelcome.classList.contains("hidden")) {
      return false;
    }

    const focusable = Array.from(treeWelcome.querySelectorAll("button, input"))
      .filter((element) => !element.disabled && element.offsetParent !== null);
    if (focusable.length === 0) {
      return false;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return true;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
      return true;
    }

    return false;
  }

  function openTreeFromWelcome(viewId, options = {}) {
    hideTreeWelcome();
    setTreeControlsOpen(false);

    const focusPersonId = options.personId || (options.focusRoot ? data?.views?.[viewId]?.roots?.[0] : null);
    if (focusPersonId) {
      state.pendingFocus = {
        personId: focusPersonId,
        openDetails: Boolean(options.personId)
      };
    }

    requestRender({
      viewId,
      fit: !focusPersonId
    });
  }

  function buildWelcomeSearchMatches(query) {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return [];
    }

    return Object.values(data?.people || {})
      .map((person) => ({
        person,
        score: scoreSearchMatch(person, normalizedQuery)
      }))
      .filter((match) => match.score > 0)
      .sort((left, right) => {
        if (right.score !== left.score) return right.score - left.score;
        return (left.person.order ?? Number.MAX_SAFE_INTEGER) - (right.person.order ?? Number.MAX_SAFE_INTEGER);
      })
      .slice(0, 10);
  }

  function renderWelcomeSearchResults() {
    if (!treeWelcomeSearchResults || !treeWelcomeSearch) {
      return;
    }

    const query = treeWelcomeSearch.value.trim();
    if (!query) {
      treeWelcomeSearchResults.innerHTML = `<div class="tree-search-results__empty">Begin typing to search every person in this family volume.</div>`;
      return;
    }

    const matches = buildWelcomeSearchMatches(query);
    if (matches.length === 0) {
      treeWelcomeSearchResults.innerHTML = `<div class="tree-search-results__empty">No names, houses, titles, or realms matched “${escapeHtml(query)}”.</div>`;
      return;
    }

    treeWelcomeSearchResults.innerHTML = matches.map(({ person }) => `
      <button class="tree-search-result" type="button" data-welcome-person-id="${escapeHtml(person.id)}">
        <img src="${escapeHtml(getPortraitThumbnail(person, 64))}" alt="" data-portrait-person-id="${escapeHtml(person.id)}" />
        <span class="tree-search-result__body">
          <strong>${escapeHtml(person.name)}</strong>
          <span>${escapeHtml(getDisplayTitle(person))}</span>
        </span>
      </button>
    `).join("");
  }

  function handleWelcomeAction(action) {
    if (action === "lineages") {
      treeWelcomeChoices?.classList.add("hidden");
      treeWelcomeSearchView?.classList.add("hidden");
      treeWelcomeLineages?.classList.remove("hidden");
      treeWelcomeLineageList?.querySelector("button")?.focus();
      return;
    }

    if (action === "search") {
      treeWelcomeChoices?.classList.add("hidden");
      treeWelcomeLineages?.classList.add("hidden");
      treeWelcomeSearchView?.classList.remove("hidden");
      renderWelcomeSearchResults();
      treeWelcomeSearch?.focus();
      return;
    }

    if (action === "complete") {
      openTreeFromWelcome(getCompleteViewId());
      return;
    }

    if (action === "back") {
      showWelcomeChoices();
      treeWelcomeChoices?.querySelector("button")?.focus();
    }
  }

  function updateViewChrome(rawProjection, projection) {
    const { view } = rawProjection;
    const visibleCount = projection.peopleIds.length;
    const totalCount = rawProjection.peopleIds.length;

    viewTitle.textContent = view.label;
    viewDescription.textContent = view.description;
    viewStats.textContent = rawProjection.empty
      ? "No lineage records loaded in this view yet."
      : visibleCount === totalCount
        ? `${visibleCount} profiles | ${projection.unionIds.length} visible unions`
        : `${visibleCount} visible of ${totalCount} profiles | ${projection.unionIds.length} visible unions`;
  }

  function hideEmptyState() {
    emptyState.classList.add("hidden");
    treeHost.classList.remove("hidden");
  }

  function showEmptyState(view) {
    const fallback = view.emptyState || {
      title: `${view.label} is ready`,
      body: "This view does not have any lineage records yet. Add people and unions to the canonical dataset to populate it."
    };

    emptyTitle.textContent = fallback.title;
    emptyBody.textContent = fallback.body;
    emptyState.classList.remove("hidden");
    treeHost.classList.add("hidden");
  }

  function hideCharacterSheet() {
    state.activePersonId = null;
    hidePortraitLightbox();
    characterSheet.classList.add("hidden");
    updateActiveNodeSelection();
  }

  function showPortraitLightbox(src, alt, caption) {
    if (!src || !portraitLightbox || !portraitLightboxImage || !portraitLightboxCaption) {
      return;
    }

    portraitLightboxImage.setAttribute("src", src);
    portraitLightboxImage.setAttribute("alt", alt || "");
    portraitLightboxCaption.textContent = caption || alt || "";
    portraitLightbox.classList.remove("hidden");
    portraitLightbox.setAttribute("aria-hidden", "false");
  }

  function hidePortraitLightbox() {
    if (!portraitLightbox || !portraitLightboxImage || !portraitLightboxCaption) {
      return;
    }

    portraitLightbox.classList.add("hidden");
    portraitLightbox.setAttribute("aria-hidden", "true");
    portraitLightboxImage.removeAttribute("src");
    portraitLightboxImage.setAttribute("alt", "");
    portraitLightboxCaption.textContent = "";
  }

  function hideLineageHoverPill() {
    if (!lineageHoverPill) return;
    lineageHoverPill.classList.add("hidden");
    lineageHoverPill.textContent = "";
  }

  function updateLineageHoverPill(label, pointerX, pointerY) {
    if (!lineageHoverPill || !treeWrapper) return;

    lineageHoverPill.textContent = label;
    lineageHoverPill.classList.remove("hidden");

    const offsetX = 18;
    const offsetY = -18;
    const pillRect = lineageHoverPill.getBoundingClientRect();
    const maxX = Math.max(12, treeWrapper.clientWidth - pillRect.width - 12);
    const maxY = Math.max(12, treeWrapper.clientHeight - pillRect.height - 12);
    const nextX = Math.min(Math.max(12, pointerX + offsetX), maxX);
    const nextY = Math.min(Math.max(12, pointerY + offsetY - pillRect.height), maxY);

    lineageHoverPill.style.transform = `translate(${nextX}px, ${nextY}px)`;
  }

  function updateActiveNodeSelection() {
    if (!state.scene) return;

    state.scene.nodeLayer.selectAll(".family-tree-node")
      .classed("is-active", (d) => d.id === state.activePersonId);
  }

  function updateLineageZoneSelection() {
    if (!state.scene || !state.currentLayout) return;

    const activeAnnotation = (state.currentLayout.annotations || []).find(
      (annotation) => annotation.id === state.activeLineageZoneId
    ) || null;
    const hasActiveZone = Boolean(activeAnnotation);
    const activePersonIds = new Set(activeAnnotation?.memberPersonIds || []);
    const activeUnionIds = new Set(activeAnnotation?.memberUnionIds || []);

    state.scene.annotationLayer.selectAll(".family-tree-annotation")
      .classed("is-active", (d) => d.id === state.activeLineageZoneId);

    state.scene.linkLayer.selectAll(".family-tree-spouse-line")
      .classed("is-lineage-highlighted", (d) => hasActiveZone && activeUnionIds.has(d.unionId))
      .classed("is-dimmed", (d) => hasActiveZone && !activeUnionIds.has(d.unionId));

    state.scene.linkLayer.selectAll(".family-tree-descent-line")
      .classed("is-lineage-highlighted", (d) => hasActiveZone && activeUnionIds.has(d.unionId))
      .classed("is-dimmed", (d) => hasActiveZone && !activeUnionIds.has(d.unionId));

    state.scene.unionLayer.selectAll(".family-tree-union")
      .classed("is-lineage-highlighted", (d) => hasActiveZone && activeUnionIds.has(d.id))
      .classed("is-dimmed", (d) => hasActiveZone && !activeUnionIds.has(d.id));

    state.scene.nodeLayer.selectAll(".family-tree-node")
      .classed("is-lineage-highlighted", (d) => hasActiveZone && activePersonIds.has(d.id))
      .classed("is-dimmed", (d) => hasActiveZone && !activePersonIds.has(d.id));
  }

  function getSortedPeopleNames(personIds) {
    return uniqueOrdered(personIds)
      .map((personId) => getPersonById(personId))
      .filter(Boolean)
      .sort((left, right) => (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER))
      .map((person) => person.name);
  }

  function getRelationshipSummary(personId) {
    const partnerNames = getSortedPeopleNames(
      getPartnerUnions(personId).flatMap((union) => union.partners.filter((partnerId) => partnerId !== personId))
    );

    const childNames = getSortedPeopleNames(
      getPartnerUnions(personId).flatMap((union) => union.children)
    );

    const parentUnionId = state.indexes.parentUnionByChild.get(personId);
    const parentNames = parentUnionId
      ? getSortedPeopleNames(getUnionById(parentUnionId).partners)
      : [];

    return {
      parents: parentNames,
      partners: partnerNames,
      children: childNames
    };
  }

  function renderNameList(label, values) {
    const body = values.length > 0 ? values.map(escapeHtml).join(", ") : "None recorded in this dataset yet.";
    return `
      <div class="relation-card">
        <strong>${escapeHtml(label)}</strong>
        <span>${body}</span>
      </div>
    `;
  }

  function showCharacterSheet(personId) {
    const person = getPersonById(personId);
    if (!person) return;

    state.activePersonId = personId;
    updateActiveNodeSelection();

    const summary = getRelationshipSummary(personId);
    const groupsLabel = (person.groups || []).join(", ") || "Unclassified";
    const portraitSrc = getPortrait(person);
    const portraitCaption = getDisplayTitle(person) && getDisplayTitle(person) !== person.name
      ? `${person.name} - ${getDisplayTitle(person)}`
      : person.name;
    const note = person.isPlaceholder
      ? "<p class=\"character-note\">This record is a placeholder or aggregate node used to keep the larger family graph readable.</p>"
      : "";

    characterSheetContent.innerHTML = `
      <div class="character-header">
        <button
          class="character-header__portrait-button"
          type="button"
          data-portrait-src="${escapeHtml(portraitSrc)}"
          data-portrait-alt="${escapeHtml(person.name)}"
          data-portrait-caption="${escapeHtml(portraitCaption)}"
          aria-label="View full-size portrait of ${escapeHtml(person.name)}"
        >
          <img src="${escapeHtml(portraitSrc)}" alt="${escapeHtml(person.name)}" data-portrait-person-id="${escapeHtml(person.id)}" />
        </button>
        <div>
          <h1>${escapeHtml(person.name)}</h1>
          <h2>${escapeHtml(getDisplayTitle(person))}</h2>
          ${note}
        </div>
      </div>

      <div class="character-meta">
        <div class="meta-card">
          <strong>Kindred</strong>
          ${escapeHtml(person.kindred || "Unknown")}
        </div>
        <div class="meta-card">
          <strong>House</strong>
          ${escapeHtml(person.house || "Unknown")}
        </div>
        <div class="meta-card">
          <strong>Realm / Affiliation</strong>
          ${escapeHtml(person.realm || "Unknown")}
        </div>
        <div class="meta-card">
          <strong>Born</strong>
          ${escapeHtml(person.born || "Unknown")}
        </div>
        <div class="meta-card">
          <strong>Died</strong>
          ${escapeHtml(person.died || "Unknown")}
        </div>
        <div class="meta-card">
          <strong>Tree Groups</strong>
          ${escapeHtml(groupsLabel)}
        </div>
      </div>

      <div class="character-section">
        <h3>Biography</h3>
        <p>${escapeHtml(person.bio || "No biography has been written for this record yet.")}</p>
      </div>

      <div class="character-section">
        <h3>Recorded Relationships</h3>
        <div class="relation-grid">
          ${renderNameList("Parents", summary.parents)}
          ${renderNameList("Partners", summary.partners)}
          ${renderNameList("Children", summary.children)}
        </div>
      </div>
    `;

    characterSheet.classList.remove("hidden");
  }

  function initializeScene() {
    const svg = d3.select(treeHost)
      .append("svg")
      .attr("class", "family-tree-canvas")
      .attr("width", "100%")
      .attr("height", "100%");

    const defs = svg.append("defs");
    const zoomLayer = svg.append("g").attr("class", "family-tree-zoom-layer");
    const annotationLayer = zoomLayer.append("g").attr("class", "family-tree-annotation-layer");
    const linkLayer = zoomLayer.append("g").attr("class", "family-tree-link-layer");
    const unionLayer = zoomLayer.append("g").attr("class", "family-tree-union-layer");
    const nodeLayer = zoomLayer.append("g").attr("class", "family-tree-node-layer");

    const zoom = d3.zoom()
      .scaleExtent([zoomMinScale, zoomMaxScale])
      .wheelDelta((event) => {
        const modeMultiplier = event.deltaMode === 1
          ? 25
          : event.deltaMode
            ? 500
            : 1;

        return -event.deltaY * zoomWheelSensitivity * modeMultiplier * (event.ctrlKey ? 10 : 1);
      })
      .on("zoom", (event) => {
        state.currentTransform = event.transform;
        zoomLayer.attr("transform", event.transform);
      });

    svg.call(zoom);
    svg.on("pointermove", (event) => {
      if (!state.currentLayout) return;

      if (event.buttons) {
        if (state.activeLineageZoneId !== null) {
          state.activeLineageZoneId = null;
          updateLineageZoneSelection();
        }
        hideLineageHoverPill();
        return;
      }

      const [pointerX, pointerY] = d3.pointer(event, svg.node());
      const transform = state.currentTransform || { x: 0, y: 0, k: 1 };
      const scale = Number.isFinite(transform.k) && transform.k !== 0 ? transform.k : 1;
      const worldX = (pointerX - (transform.x || 0)) / scale;
      const worldY = (pointerY - (transform.y || 0)) / scale;
      const hoveredZone = (state.currentLayout.annotations || []).find((annotation) =>
        annotation.interactive
        && worldX >= annotation.interactionLeft
        && worldX <= annotation.interactionRight
        && worldY >= annotation.interactionTop
        && worldY <= annotation.interactionBottom
      );

      const nextZoneId = hoveredZone ? hoveredZone.id : null;
      if (state.activeLineageZoneId !== nextZoneId) {
        state.activeLineageZoneId = nextZoneId;
        updateLineageZoneSelection();
      }

      if (hoveredZone) {
        updateLineageHoverPill(hoveredZone.label, pointerX, pointerY);
      } else {
        hideLineageHoverPill();
      }
    });
    svg.on("pointerleave", () => {
      if (state.activeLineageZoneId !== null) {
        state.activeLineageZoneId = null;
        updateLineageZoneSelection();
      }
      hideLineageHoverPill();
    });

    return {
      svg,
      defs,
      zoom,
      zoomLayer,
      annotationLayer,
      linkLayer,
      unionLayer,
      nodeLayer
    };
  }

  function clearScene() {
    state.scene.defs.selectAll("*").remove();
    state.scene.annotationLayer.selectAll("*").remove();
    state.scene.linkLayer.selectAll("*").remove();
    state.scene.unionLayer.selectAll("*").remove();
    state.scene.nodeLayer.selectAll("*").remove();
  }

  function buildConnectorPaths(layout) {
    const spouseLines = [];
    const descentLines = [];

    layout.unions.forEach((union) => {
      const {
        partners,
        children,
        spouseLineY,
        anchorX,
        branchY,
        descentOriginX = anchorX,
        descentOriginY = spouseLineY
      } = union;

      if (partners.length > 1) {
        const leftPartner = partners[0];
        const rightPartner = partners[partners.length - 1];

        spouseLines.push({
          id: `${union.id}-spouse`,
          unionId: union.id,
          x1: leftPartner.right,
          y1: spouseLineY,
          x2: rightPartner.left,
          y2: spouseLineY
        });
      }

      if (children.length === 0 || branchY === null) return;

      if (children.length === 1) {
        const child = children[0];

        descentLines.push({
          id: `${union.id}-stem`,
          unionId: union.id,
          x1: descentOriginX,
          y1: descentOriginY,
          x2: descentOriginX,
          y2: branchY
        });

        if (child.centerX !== descentOriginX) {
          descentLines.push({
            id: `${union.id}-branch`,
            unionId: union.id,
            x1: descentOriginX,
            y1: branchY,
            x2: child.centerX,
            y2: branchY
          });
        }

        descentLines.push({
          id: `${union.id}-child`,
          unionId: union.id,
          x1: child.centerX,
          y1: branchY,
          x2: child.centerX,
          y2: child.top
        });

        return;
      }

      const leftChild = children[0];
      const rightChild = children[children.length - 1];

      descentLines.push({
        id: `${union.id}-stem`,
        unionId: union.id,
        x1: descentOriginX,
        y1: descentOriginY,
        x2: descentOriginX,
        y2: branchY
      });

      if (leftChild.centerX < descentOriginX) {
        descentLines.push({
          id: `${union.id}-branch-left`,
          unionId: union.id,
          x1: leftChild.centerX,
          y1: branchY,
          x2: descentOriginX,
          y2: branchY
        });
      }

      if (rightChild.centerX > descentOriginX) {
        descentLines.push({
          id: `${union.id}-branch-right`,
          unionId: union.id,
          x1: descentOriginX,
          y1: branchY,
          x2: rightChild.centerX,
          y2: branchY
        });
      }

      children.forEach((child, index) => {
        descentLines.push({
          id: `${union.id}-child-${index}`,
          unionId: union.id,
          x1: child.centerX,
          y1: branchY,
          x2: child.centerX,
          y2: child.top
        });
      });
    });

    return {
      spouseLines,
      descentLines
    };
  }

  function getNodeRenderData(layout, projection, rawProjection) {
    return projection.peopleIds
      .map((personId) => {
        const box = layout.people.get(personId);
        const person = getPersonById(personId);
        if (!box || !person) return null;

        const directChildren = getDirectChildrenInProjection(personId, rawProjection);
        return {
          ...box,
          person,
          accentColor: getAccentColor(person),
          displayName: truncateText(person.name, 24),
          displayTitle: truncateText(getDisplayTitle(person), 30),
          displayLife: truncateText(getLifeLine(person), 28),
          hasChildren: directChildren.length > 0,
          isCollapsed: state.collapsedIds.has(personId)
        };
      })
      .filter(Boolean);
  }

  function renderAnnotations(layout) {
    const annotationGroups = state.scene.annotationLayer.selectAll(".family-tree-annotation")
      .data(layout.annotations || [], (d) => d.id)
      .join((enter) => {
        const group = enter.append("g")
          .attr("class", "family-tree-annotation")
          .attr("aria-hidden", "true");

        group.append("rect")
          .attr("class", "family-tree-annotation__banner")
          .attr("rx", 26)
          .attr("ry", 26);

        group.append("path")
          .attr("class", "family-tree-annotation__bracket");

        group.append("text")
          .attr("class", "family-tree-annotation__label");

        return group;
      });

    annotationGroups
      .attr("class", (d) => `family-tree-annotation family-tree-annotation--${d.side}`)
      .attr("transform", (d) => `translate(${d.left}, ${d.top})`);

    annotationGroups.select(".family-tree-annotation__banner")
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height);

    annotationGroups.select(".family-tree-annotation__bracket")
      .attr("d", (d) => {
        if (d.side === "right") {
          return `M 0 0 H ${-d.bracketGap} V ${d.height} H 0`;
        }

        return `M ${d.width} 0 H ${d.width + d.bracketGap} V ${d.height} H ${d.width}`;
      });

    annotationGroups.select(".family-tree-annotation__label")
      .attr("x", (d) => d.width / 2)
      .attr("y", (d) => d.height / 2)
      .attr("transform", (d) => `rotate(-90 ${d.width / 2} ${d.height / 2})`)
      .text((d) => d.label);
  }

  function updateScenePositions(layout, projection, rawProjection) {
    const { spouseLines, descentLines } = buildConnectorPaths(layout);
    const nodeData = getNodeRenderData(layout, projection, rawProjection);

    renderAnnotations(layout);

    state.scene.linkLayer.selectAll(".family-tree-spouse-line")
      .data(spouseLines, (d) => d.id)
      .join("line")
      .attr("class", "family-tree-spouse-line")
      .attr("x1", (d) => d.x1)
      .attr("y1", (d) => d.y1)
      .attr("x2", (d) => d.x2)
      .attr("y2", (d) => d.y2);

    state.scene.linkLayer.selectAll(".family-tree-descent-line")
      .data(descentLines, (d) => d.id)
      .join("line")
      .attr("class", "family-tree-descent-line")
      .attr("x1", (d) => d.x1)
      .attr("y1", (d) => d.y1)
      .attr("x2", (d) => d.x2)
      .attr("y2", (d) => d.y2);

    state.scene.unionLayer.selectAll(".family-tree-union")
      .data(layout.unions, (d) => d.id)
      .attr("transform", (d) => `translate(${d.symbolX}, ${d.symbolY})`);

    state.scene.nodeLayer.selectAll(".family-tree-node")
      .data(nodeData, (d) => d.id)
      .attr("class", (d) => {
        const classes = ["family-tree-node"];
        const recordType = getRecordType(d.person);

        if (recordType === "placeholder") classes.push("family-tree-node--placeholder");
        if (recordType === "aggregate") classes.push("family-tree-node--aggregate");
        if (state.activePersonId === d.id) classes.push("is-active");

        return classes.join(" ");
      })
      .attr("transform", (d) => `translate(${d.left}, ${d.top})`);

    updateActiveNodeSelection();
    updateLineageZoneSelection();
  }

  function renderScene(layout, projection, rawProjection) {
    clearScene();

    const { spouseLines, descentLines } = buildConnectorPaths(layout);
    const nodeData = getNodeRenderData(layout, projection, rawProjection);

    renderAnnotations(layout);

    const portraitClips = state.scene.defs.selectAll(".family-tree-portrait-clip")
      .data(nodeData, (d) => d.id)
      .join((enter) => {
        const clipPath = enter.append("clipPath")
          .attr("class", "family-tree-portrait-clip");

        clipPath.append("circle");
        return clipPath;
      });

    portraitClips
      .attr("id", (d) => `tree-portrait-clip-${d.id}`)
      .select("circle")
      .attr("cx", cardWidth / 2)
      .attr("cy", 34)
      .attr("r", portraitRadius);

    state.scene.linkLayer.selectAll(".family-tree-spouse-line")
      .data(spouseLines, (d) => d.id)
      .join("line")
      .attr("class", "family-tree-spouse-line")
      .attr("x1", (d) => d.x1)
      .attr("y1", (d) => d.y1)
      .attr("x2", (d) => d.x2)
      .attr("y2", (d) => d.y2);

    state.scene.linkLayer.selectAll(".family-tree-descent-line")
      .data(descentLines, (d) => d.id)
      .join("line")
      .attr("class", "family-tree-descent-line")
      .attr("x1", (d) => d.x1)
      .attr("y1", (d) => d.y1)
      .attr("x2", (d) => d.x2)
      .attr("y2", (d) => d.y2);

    const unionGroups = state.scene.unionLayer.selectAll(".family-tree-union")
      .data(layout.unions, (d) => d.id)
      .join("g")
      .attr("class", "family-tree-union")
      .attr("transform", (d) => `translate(${d.symbolX}, ${d.symbolY})`);

    unionGroups.append("circle")
      .attr("class", "family-tree-union__dot")
      .attr("r", 9);

    unionGroups.append("text")
      .attr("class", "family-tree-union__label")
      .attr("y", 1)
      .text("♥");

    const nodeGroups = state.scene.nodeLayer.selectAll(".family-tree-node")
      .data(nodeData, (d) => d.id)
      .join("g")
      .attr("class", (d) => {
        const classes = ["family-tree-node"];
        const recordType = getRecordType(d.person);

        if (recordType === "placeholder") classes.push("family-tree-node--placeholder");
        if (recordType === "aggregate") classes.push("family-tree-node--aggregate");
        if (state.activePersonId === d.id) classes.push("is-active");

        return classes.join(" ");
      })
      .attr("transform", (d) => `translate(${d.left}, ${d.top})`)
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-label", (d) => `${d.person.name}: open character details`)
      .on("click", (event, d) => {
        event.stopPropagation();
        showCharacterSheet(d.id);
      })
      .on("keydown", (event, d) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        event.stopPropagation();
        showCharacterSheet(d.id);
      })
      .on("dblclick", (event, d) => {
        event.stopPropagation();
        centerOnPerson(d.id, { openDetails: true });
      });

    nodeGroups.append("rect")
      .attr("class", "family-tree-node__card")
      .attr("width", cardWidth)
      .attr("height", cardHeight)
      .attr("rx", 18)
      .attr("ry", 18);

    nodeGroups.append("rect")
      .attr("class", "family-tree-node__accent")
      .attr("width", cardWidth)
      .attr("height", 10)
      .attr("rx", 18)
      .attr("ry", 18)
      .attr("fill", (d) => d.accentColor);

    nodeGroups.append("circle")
      .attr("class", "family-tree-node__portrait-ring")
      .attr("cx", cardWidth / 2)
      .attr("cy", 34)
      .attr("r", portraitRadius + 4);

    nodeGroups.append("image")
      .attr("class", "family-tree-node__portrait")
      .attr("href", (d) => getPortraitThumbnail(d.person, 128))
      .attr("x", cardWidth / 2 - portraitRadius)
      .attr("y", 34 - portraitRadius)
      .attr("width", portraitRadius * 2)
      .attr("height", portraitRadius * 2)
      .attr("clip-path", (d) => `url(#tree-portrait-clip-${d.id})`)
      .attr("preserveAspectRatio", "xMidYMid slice")
      .on("error", (event, d) => {
        d3.select(event.currentTarget).attr("href", makePortraitPlaceholder(d.person));
      });

    nodeGroups.append("text")
      .attr("class", "family-tree-node__name")
      .attr("x", cardWidth / 2)
      .attr("y", 80)
      .text((d) => d.displayName);

    nodeGroups.append("text")
      .attr("class", "family-tree-node__title")
      .attr("x", cardWidth / 2)
      .attr("y", 99)
      .text((d) => d.displayTitle);

    nodeGroups.append("text")
      .attr("class", "family-tree-node__life")
      .attr("x", cardWidth / 2)
      .attr("y", 115)
      .text((d) => d.displayLife);

    const toggleGroups = nodeGroups.filter((d) => d.hasChildren)
      .append("g")
      .attr("class", "family-tree-node__toggle")
      .attr("transform", `translate(${cardWidth - 20}, ${cardHeight - 20})`)
      .on("click", (event, d) => {
        event.stopPropagation();
        toggleCollapse(d.id);
      });

    toggleGroups.append("circle")
      .attr("r", 11);

    toggleGroups.append("text")
      .attr("y", 1)
      .text((d) => (d.isCollapsed ? "+" : "−"));

    updateActiveNodeSelection();
    updateLineageZoneSelection();
  }

  function getMinimumReadableScale(viewId = state.currentViewId) {
    if (!viewId || viewId === getCompleteViewId()) {
      return zoomMinScale;
    }

    return isCompactControlsViewport() ? 0.48 : 0.62;
  }

  function fitToBounds(bounds, useTransition = true, minimumScale = zoomMinScale) {
    const hostRect = treeHost.getBoundingClientRect();
    if (hostRect.width === 0 || hostRect.height === 0 || bounds.width === 0 || bounds.height === 0) return;

    const padding = 48;
    const scale = Math.max(
      minimumScale,
      Math.min(
        1.5,
        Math.min(
          (hostRect.width - padding * 2) / bounds.width,
          (hostRect.height - padding * 2) / bounds.height
        )
      )
    );

    const translateX = hostRect.width / 2 - (bounds.minX + bounds.width / 2) * scale;
    const translateY = hostRect.height / 2 - (bounds.minY + bounds.height / 2) * scale;
    const transform = d3.zoomIdentity.translate(translateX, translateY).scale(scale);

    if (useTransition) {
      state.scene.svg.transition().duration(450).call(state.scene.zoom.transform, transform);
    } else {
      state.scene.svg.call(state.scene.zoom.transform, transform);
    }
  }

  function centerOnPerson(personId, options = {}) {
    if (!state.currentLayout) return;

    const box = state.currentLayout.people.get(personId);
    if (!box) return;

    const hostRect = treeHost.getBoundingClientRect();
    if (hostRect.width === 0 || hostRect.height === 0) return;

    const scale = Math.max(state.currentTransform.k || 1, 1);
    const translateX = hostRect.width / 2 - box.centerX * scale;
    const translateY = hostRect.height / 2 - box.centerY * scale;
    const transform = d3.zoomIdentity.translate(translateX, translateY).scale(scale);

    state.scene.svg.transition().duration(400).call(state.scene.zoom.transform, transform);

    if (options.openDetails) {
      showCharacterSheet(personId);
    }
  }

  function toggleCollapse(personId) {
    if (state.collapsedIds.has(personId)) {
      state.collapsedIds.delete(personId);
    } else {
      state.collapsedIds.add(personId);
    }

    requestRender({
      fit: false,
      preserveCollapsed: true
    });
  }

  function revealAncestors(personId) {
    const visited = new Set();
    const queue = [personId];
    let queueIndex = 0;

    while (queueIndex < queue.length) {
      const currentId = queue[queueIndex++];
      const parentUnionId = state.indexes.parentUnionByChild.get(currentId);
      if (!parentUnionId) continue;

      const parentUnion = getUnionById(parentUnionId);
      if (!parentUnion) continue;

      parentUnion.partners.forEach((parentId) => {
        state.collapsedIds.delete(parentId);

        if (!visited.has(parentId)) {
          visited.add(parentId);
          queue.push(parentId);
        }
      });
    }
  }

  function scoreSearchMatch(person, query) {
    const normalizedQuery = query.toLowerCase();
    const name = person.name.toLowerCase();
    const title = getDisplayTitle(person).toLowerCase();
    const house = (person.house || "").toLowerCase();
    const realm = (person.realm || "").toLowerCase();

    let score = 0;
    if (name.startsWith(normalizedQuery)) score += 120;
    if (name.includes(normalizedQuery)) score += 60;
    if (title.includes(normalizedQuery)) score += 32;
    if (house.includes(normalizedQuery)) score += 20;
    if (realm.includes(normalizedQuery)) score += 14;
    return score;
  }

  function buildSearchMatches(query) {
    if (!state.currentRawProjection || !query.trim()) return [];

    const normalizedQuery = query.trim().toLowerCase();

    return state.currentRawProjection.peopleIds
      .map((personId) => getPersonById(personId))
      .filter(Boolean)
      .map((person) => ({
        person,
        score: scoreSearchMatch(person, normalizedQuery)
      }))
      .filter((match) => match.score > 0)
      .sort((left, right) => {
        if (right.score !== left.score) return right.score - left.score;
        return (left.person.order ?? Number.MAX_SAFE_INTEGER) - (right.person.order ?? Number.MAX_SAFE_INTEGER);
      })
      .slice(0, 8);
  }

  function refreshSearchResults() {
    const query = searchInput.value;
    if (!query.trim()) {
      hideSearchResults();
      return;
    }

    renderSearchResults(buildSearchMatches(query));
  }

  function hideSearchResults() {
    searchResults.innerHTML = "";
    searchResults.classList.add("hidden");
  }

  function renderSearchResults(matches) {
    if (matches.length === 0) {
      searchResults.innerHTML = `<div class="tree-search-results__empty">No matches in the current view.</div>`;
      searchResults.classList.remove("hidden");
      return;
    }

    searchResults.innerHTML = matches.map(({ person }) => `
      <button class="tree-search-result" type="button" data-person-id="${escapeHtml(person.id)}">
        <img src="${escapeHtml(getPortraitThumbnail(person, 64))}" alt="${escapeHtml(person.name)}" data-portrait-person-id="${escapeHtml(person.id)}" />
        <span class="tree-search-result__body">
          <strong>${escapeHtml(person.name)}</strong>
          <span>${escapeHtml(getDisplayTitle(person))}</span>
        </span>
      </button>
    `).join("");

    searchResults.classList.remove("hidden");
  }

  function focusSearchMatch(personId) {
    if (!state.currentRawProjection || !state.currentRawProjection.peopleSet.has(personId)) return;

    revealAncestors(personId);
    state.pendingFocus = {
      personId,
      openDetails: true
    };

    requestRender({
      fit: false,
      preserveCollapsed: true
    });

    hideSearchResults();
    searchInput.blur();
    setTreeControlsOpen(false);
  }

  function requestRender(options = {}) {
    renderCurrentView(options).catch((error) => {
      renderError(error instanceof Error ? error.message : String(error));
    });
  }

  async function renderCurrentView(options = {}) {
    clearError();

    const viewId = options.viewId || state.currentViewId || getInitialViewId();
    const view = data.views[viewId];
    if (!view) {
      throw new Error(`Unknown family tree view "${viewId}".`);
    }

    const switchingView = state.currentViewId !== viewId;
    const nextFamilyGroupId = getViewFamilyGroupId(view);
    const switchingFamilyGroup = state.currentFamilyGroupId !== nextFamilyGroupId;

    state.currentFamilyGroupId = nextFamilyGroupId;
    state.currentViewId = viewId;

    if (switchingView && !options.preserveCollapsed) {
      state.collapsedIds.clear();
    }

    if (switchingFamilyGroup) {
      populateViewSelect();
    }

    syncFamilyGroupLinks();

    const seededProjection = projectView(viewId);
    const rawProjection = applyViewFilters(seededProjection);
    state.currentRawProjection = rawProjection;

    updateViewChrome(rawProjection, rawProjection);
    viewSelect.value = viewId;
    syncViewQueryParam(viewId);

    if (rawProjection.empty) {
      clearScene();
      showEmptyState(rawProjection.view);
      state.currentProjection = rawProjection;
      state.currentLayout = null;
      state.currentAutoLayout = null;
      state.currentUnionInfos = [];
      hideSearchResults();
      return;
    }

    const projection = applyCollapsedProjection(rawProjection);
    state.currentProjection = projection;
    updateViewChrome(rawProjection, projection);
    hideEmptyState();
    refreshSearchResults();

    const currentRevision = ++state.renderRevision;
    const layout = await layoutProjection(projection);

    if (currentRevision !== state.renderRevision) return;

    state.currentAutoLayout = layout.autoLayout || layout;
    state.currentUnionInfos = layout.unionInfos || [];
    state.currentLayout = layout;
    renderScene(layout, projection, rawProjection);

    if (state.pendingFocus && layout.people.has(state.pendingFocus.personId)) {
      const { personId, openDetails } = state.pendingFocus;
      state.pendingFocus = null;
      centerOnPerson(personId, { openDetails });
      return;
    }

    if (options.fit === false && !switchingView) {
      return;
    }

    fitToBounds(layout.bounds, !switchingView, getMinimumReadableScale(viewId));
  }

  function handleSearchInput() {
    refreshSearchResults();
  }

  function handleSearchKeydown(event) {
    if (event.key === "Escape") {
      hideSearchResults();
      return;
    }

    if (event.key === "Enter") {
      const firstResult = searchResults.querySelector("[data-person-id]");
      if (!firstResult) return;

      event.preventDefault();
      focusSearchMatch(firstResult.getAttribute("data-person-id"));
    }
  }

  async function init() {
    if (!window.d3) {
      renderError("D3 did not load, so the custom family tree renderer cannot start.");
      return;
    }

    if (!elk) {
      renderError("ELK did not load, so the custom family tree layout engine cannot start.");
      return;
    }

    try {
      await loadTreeFiles();
      state.indexes = buildIndexes();
      state.currentFamilyGroupId = getInitialFamilyGroupId();
      state.scene = initializeScene();
      populateViewSelect();
      syncFamilyGroupLinks();

      viewSelect.addEventListener("change", (event) => {
        setTreeControlsOpen(false);
        requestRender({
          viewId: event.target.value,
          fit: true
        });
      });

      searchInput.addEventListener("input", handleSearchInput);
      searchInput.addEventListener("keydown", handleSearchKeydown);

      searchResults.addEventListener("click", (event) => {
        const button = event.target.closest("[data-person-id]");
        if (!button) return;
        focusSearchMatch(button.getAttribute("data-person-id"));
      });

      resetViewButton.addEventListener("click", () => {
        if (state.currentLayout) {
          fitToBounds(state.currentLayout.bounds, true, getMinimumReadableScale());
        }
        setTreeControlsOpen(false);
      });

      treeControlsToggle?.addEventListener("click", () => {
        setTreeControlsOpen(!treeViewPanel?.classList.contains("is-open"));
      });

      treeControlsClose?.addEventListener("click", () => {
        setTreeControlsOpen(false);
        treeControlsToggle?.focus();
      });

      treeReopenWelcome?.addEventListener("click", showTreeWelcome);

      treeWelcome?.addEventListener("click", (event) => {
        const actionButton = event.target.closest("[data-welcome-action]");
        if (actionButton) {
          handleWelcomeAction(actionButton.getAttribute("data-welcome-action"));
          return;
        }

        const lineageButton = event.target.closest("[data-welcome-view-id]");
        if (lineageButton) {
          openTreeFromWelcome(lineageButton.getAttribute("data-welcome-view-id"), { focusRoot: true });
          return;
        }

        const personButton = event.target.closest("[data-welcome-person-id]");
        if (personButton) {
          openTreeFromWelcome(getCompleteViewId(), {
            personId: personButton.getAttribute("data-welcome-person-id")
          });
        }
      });

      treeWelcomeSearch?.addEventListener("input", renderWelcomeSearchResults);
      treeWelcomeSearch?.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") {
          return;
        }

        const firstResult = treeWelcomeSearchResults?.querySelector("[data-welcome-person-id]");
        if (!firstResult) {
          return;
        }

        event.preventDefault();
        openTreeFromWelcome(getCompleteViewId(), {
          personId: firstResult.getAttribute("data-welcome-person-id")
        });
      });

      backToTreeButton.addEventListener("click", hideCharacterSheet);

      characterSheetContent.addEventListener("click", (event) => {
        const portraitButton = event.target.closest(".character-header__portrait-button");
        if (!portraitButton) {
          return;
        }

        showPortraitLightbox(
          portraitButton.getAttribute("data-portrait-src"),
          portraitButton.getAttribute("data-portrait-alt"),
          portraitButton.getAttribute("data-portrait-caption")
        );
      });

      characterSheet.addEventListener("click", (event) => {
        if (event.target === characterSheet) {
          hideCharacterSheet();
        }
      });

      portraitLightboxClose?.addEventListener("click", hidePortraitLightbox);

      portraitLightbox?.addEventListener("click", (event) => {
        if (event.target === portraitLightbox) {
          hidePortraitLightbox();
        }
      });

      document.addEventListener("click", (event) => {
        if (!searchResults.contains(event.target) && event.target !== searchInput) {
          hideSearchResults();
        }
      });

      document.addEventListener("error", (event) => {
        applyHtmlPortraitFallback(event.target);
      }, true);

      document.addEventListener("keydown", (event) => {
        if (trapWelcomeFocus(event)) {
          return;
        }

        if (event.key === "Escape") {
          if (portraitLightbox && !portraitLightbox.classList.contains("hidden")) {
            hidePortraitLightbox();
            return;
          }

          if (treeWelcome && !treeWelcome.classList.contains("hidden")) {
            if (treeWelcomeChoices?.classList.contains("hidden")) {
              showWelcomeChoices();
              treeWelcomeChoices?.querySelector("button")?.focus();
            }
            return;
          }

          hideCharacterSheet();
        }
      });

      if (hasExplicitViewRequest()) {
        requestRender({
          viewId: getInitialViewId(),
          fit: true
        });
      } else {
        showTreeWelcome();
      }
    } catch (error) {
      renderError(error instanceof Error ? error.message : String(error));
    }
  }

  init();
})();

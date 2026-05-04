(function () {
  let data = window.FAMILY_TREE_DATA || null;
  const treeHost = document.getElementById("family-tree-host");
  const treeWrapper = document.getElementById("tree");
  const viewSelect = document.getElementById("tree-view");
  const viewTitle = document.getElementById("tree-view-title");
  const viewDescription = document.getElementById("tree-view-description");
  const viewStats = document.getElementById("tree-view-stats");
  const searchInput = document.getElementById("tree-search");
  const searchResults = document.getElementById("tree-search-results");
  const minimapElement = document.getElementById("tree-minimap");
  const minimapSvg = document.getElementById("tree-minimap-svg");
  const emptyState = document.getElementById("tree-empty-state");
  const emptyTitle = document.getElementById("tree-empty-title");
  const emptyBody = document.getElementById("tree-empty-body");
  const resetViewButton = document.getElementById("reset-view");
  const layoutEditorLink = document.getElementById("layout-editor-link");
  const layoutEditorPanel = document.getElementById("layout-editor-panel");
  const layoutEditorStatus = document.getElementById("layout-editor-status");
  const layoutEditorToggle = document.getElementById("layout-editor-toggle");
  const layoutEditorSave = document.getElementById("layout-editor-save");
  const layoutEditorDownload = document.getElementById("layout-editor-download");
  const layoutEditorReset = document.getElementById("layout-editor-reset");
  const layoutEditorClearDrafts = document.getElementById("layout-editor-clear-drafts");
  const personEditorSelect = document.getElementById("person-editor-select");
  const personEditorNew = document.getElementById("person-editor-new");
  const personEditorSave = document.getElementById("person-editor-save");
  const personEditorId = document.getElementById("person-editor-id");
  const personEditorName = document.getElementById("person-editor-name");
  const personEditorOrder = document.getElementById("person-editor-order");
  const personEditorSex = document.getElementById("person-editor-sex");
  const personEditorTitle = document.getElementById("person-editor-title");
  const personEditorKindred = document.getElementById("person-editor-kindred");
  const personEditorHouse = document.getElementById("person-editor-house");
  const personEditorRealm = document.getElementById("person-editor-realm");
  const personEditorBorn = document.getElementById("person-editor-born");
  const personEditorDied = document.getElementById("person-editor-died");
  const personEditorImage = document.getElementById("person-editor-image");
  const personEditorGroups = document.getElementById("person-editor-groups");
  const personEditorRecordType = document.getElementById("person-editor-record-type");
  const personEditorPlaceholder = document.getElementById("person-editor-placeholder");
  const personEditorBio = document.getElementById("person-editor-bio");
  const unionEditorSelect = document.getElementById("union-editor-select");
  const unionEditorNew = document.getElementById("union-editor-new");
  const unionEditorSave = document.getElementById("union-editor-save");
  const unionEditorAttachChild = document.getElementById("union-editor-attach-child");
  const unionEditorDetachChild = document.getElementById("union-editor-detach-child");
  const unionEditorId = document.getElementById("union-editor-id");
  const unionEditorOrder = document.getElementById("union-editor-order");
  const unionEditorLabel = document.getElementById("union-editor-label");
  const unionEditorPartners = document.getElementById("union-editor-partners");
  const unionEditorChildren = document.getElementById("union-editor-children");
  const unionEditorLineagePartner = document.getElementById("union-editor-lineage-partner");
  const unionEditorLineageChild = document.getElementById("union-editor-lineage-child");
  const unionEditorPartnerGap = document.getElementById("union-editor-partner-gap");
  const unionEditorPartnerOrder = document.getElementById("union-editor-partner-order");
  const unionEditorChildOrder = document.getElementById("union-editor-child-order");
  const unionAttachChildSelect = document.getElementById("union-attach-child-select");
  const treeHint = document.getElementById("tree-hint");
  const characterSheet = document.getElementById("character-sheet");
  const backToTreeButton = document.getElementById("back-to-tree");
  const characterSheetContent = document.getElementById("character-sheet-content");

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
  const minimapWidth = 220;
  const minimapHeight = 140;
  const minimapPadding = 10;
  const treeDataDraftStorageKey = "middle-earth-family-tree-data-drafts-v1";
  const layoutDraftStorageKey = "middle-earth-family-tree-layout-drafts-v1";
  const treeDataUrl = "family_tree_data.json";
  const treeLayoutsUrl = "family_tree_layouts.json";
  let fileLayouts = window.FAMILY_TREE_LAYOUTS || { version: 1, views: {} };

  const elk = window.ELK ? new window.ELK() : null;

  const state = {
    indexes: null,
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
    minimapMetrics: null,
    scene: null,
    activePersonId: null,
    layoutEditor: {
      available: false,
      draggingEnabled: false,
      didDrag: false,
      dragStarted: false,
      drafts: { version: 1, views: {} },
      activePersonId: null,
      activeUnionId: null
    }
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

  function isLayoutEditorRequested() {
    const params = new URLSearchParams(window.location.search);
    return params.get("editor") === "1";
  }

  function cloneJson(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadDataDraft() {
    try {
      const raw = window.localStorage.getItem(treeDataDraftStorageKey);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || typeof parsed.people !== "object" || parsed.people === null) {
        return null;
      }

      return parsed;
    } catch (_error) {
      return null;
    }
  }

  function saveDataDraft() {
    try {
      window.localStorage.setItem(treeDataDraftStorageKey, JSON.stringify(normalizeDataForExport(data)));
      return true;
    } catch (_error) {
      return false;
    }
  }

  function clearDataDraft() {
    try {
      window.localStorage.removeItem(treeDataDraftStorageKey);
      return true;
    } catch (_error) {
      return false;
    }
  }

  function loadLayoutDrafts() {
    try {
      const raw = window.localStorage.getItem(layoutDraftStorageKey);
      if (!raw) {
        return { version: 1, views: {} };
      }

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || typeof parsed.views !== "object" || parsed.views === null) {
        return { version: 1, views: {} };
      }

      return {
        version: 1,
        views: parsed.views
      };
    } catch (_error) {
      return { version: 1, views: {} };
    }
  }

  function saveLayoutDrafts() {
    try {
      window.localStorage.setItem(layoutDraftStorageKey, JSON.stringify(state.layoutEditor.drafts));
      return true;
    } catch (_error) {
      return false;
    }
  }

  function clearLayoutDrafts() {
    try {
      window.localStorage.removeItem(layoutDraftStorageKey);
      state.layoutEditor.drafts = { version: 1, views: {} };
      return true;
    } catch (_error) {
      return false;
    }
  }

  function getDraftViewLayout(viewId) {
    if (!state.layoutEditor.available) {
      return null;
    }

    return state.layoutEditor.drafts.views[viewId] || null;
  }

  function getFileViewLayout(viewId) {
    return fileLayouts?.views?.[viewId] || null;
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
    return mergeViewLayouts(getFileViewLayout(viewId), getDraftViewLayout(viewId));
  }

  function ensureDraftViewLayout(viewId) {
    if (!state.layoutEditor.drafts.views[viewId]) {
      state.layoutEditor.drafts.views[viewId] = {
        positions: {}
      };
    }

    if (!state.layoutEditor.drafts.views[viewId].positions) {
      state.layoutEditor.drafts.views[viewId].positions = {};
    }

    return state.layoutEditor.drafts.views[viewId];
  }

  function setDraftPosition(viewId, personId, x, y) {
    const draft = ensureDraftViewLayout(viewId);
    draft.positions[personId] = {
      x: Math.round(x),
      y: Math.round(y)
    };
  }

  function clearDraftViewLayout(viewId) {
    delete state.layoutEditor.drafts.views[viewId];
  }

  function hasAnyDraftLayouts() {
    return Object.keys(state.layoutEditor.drafts.views || {}).length > 0;
  }

  function getMergedLayoutsForExport() {
    const merged = cloneJson(fileLayouts && typeof fileLayouts === "object" ? fileLayouts : { version: 1, views: {} });
    if (!merged.views || typeof merged.views !== "object") {
      merged.views = {};
    }

    Object.entries(state.layoutEditor.drafts.views || {}).forEach(([viewId, viewLayout]) => {
      merged.views[viewId] = cloneJson(viewLayout);
    });

    merged.version = 1;
    return merged;
  }

  function downloadTextFile(filename, content, mimeType = "text/plain;charset=utf-8") {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function setLayoutEditorStatus(message) {
    if (layoutEditorStatus) {
      layoutEditorStatus.textContent = message;
    }
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

  async function loadTreeFiles() {
    const [loadedData, loadedLayouts] = await Promise.all([
      loadJsonFile(treeDataUrl, window.FAMILY_TREE_DATA || null),
      loadJsonFile(treeLayoutsUrl, window.FAMILY_TREE_LAYOUTS || { version: 1, views: {} })
    ]);

    data = loadDataDraft() || loadedData;
    fileLayouts = loadedLayouts && typeof loadedLayouts === "object"
      ? loadedLayouts
      : { version: 1, views: {} };
  }

  function parseCsvIds(value) {
    return String(value || "")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function parseOptionalNumber(value) {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  function toSortedPersonEntries(dataset) {
    return Object.entries(dataset.people || {})
      .sort(([leftId, leftPerson], [rightId, rightPerson]) => {
        const leftOrder = leftPerson?.order ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = rightPerson?.order ?? Number.MAX_SAFE_INTEGER;

        if (leftOrder !== rightOrder) {
          return leftOrder - rightOrder;
        }

        return String(leftId).localeCompare(String(rightId));
      });
  }

  function getSortedUnionEntries(dataset) {
    return (dataset.unions || [])
      .slice()
      .sort((left, right) => {
        const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
        const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;
        if (leftOrder !== rightOrder) {
          return leftOrder - rightOrder;
        }

        return String(left.id).localeCompare(String(right.id));
      });
  }

  function normalizeDataForExport(dataset) {
    const normalizedPeople = {};
    toSortedPersonEntries(dataset).forEach(([personId, person]) => {
      normalizedPeople[personId] = cloneJson(person);
    });

    return {
      defaults: cloneJson(dataset.defaults || {}),
      people: normalizedPeople,
      unions: getSortedUnionEntries(dataset).map((union) => cloneJson(union)),
      views: cloneJson(dataset.views || {})
    };
  }

  function normalizeLayoutsForExport(layouts) {
    const normalized = { version: 1, views: {} };
    Object.keys(layouts.views || {})
      .sort((left, right) => left.localeCompare(right))
      .forEach((viewId) => {
        const positions = layouts.views[viewId]?.positions || {};
        const sortedPositions = {};
        Object.keys(positions)
          .sort((left, right) => comparePeopleIds(left, right))
          .forEach((personId) => {
            sortedPositions[personId] = {
              x: Math.round(positions[personId].x),
              y: Math.round(positions[personId].y)
            };
          });

        normalized.views[viewId] = { positions: sortedPositions };
      });

    return normalized;
  }

  function downloadJsonFile(filename, value) {
    downloadTextFile(filename, `${JSON.stringify(value, null, 2)}\n`, "application/json;charset=utf-8");
  }

  function refreshLayoutEditorData() {
    if (!state.layoutEditor.available) {
      return;
    }

    const peopleEntries = toSortedPersonEntries(data);
    const unionEntries = getSortedUnionEntries(data);

    if (personEditorSelect) {
      personEditorSelect.innerHTML = `
        <option value="">Select a person…</option>
        ${peopleEntries.map(([personId, person]) => `<option value="${escapeHtml(personId)}">${escapeHtml(person.name)} (${escapeHtml(personId)})</option>`).join("")}
      `;
      if (state.layoutEditor.activePersonId && data.people[state.layoutEditor.activePersonId]) {
        personEditorSelect.value = state.layoutEditor.activePersonId;
      }
    }

    if (unionEditorSelect) {
      unionEditorSelect.innerHTML = `
        <option value="">Select a union…</option>
        ${unionEntries.map((union) => `<option value="${escapeHtml(union.id)}">${escapeHtml(union.id)} (${escapeHtml((union.partners || []).join(" + "))})</option>`).join("")}
      `;
      if (state.layoutEditor.activeUnionId && (data.unions || []).some((union) => union.id === state.layoutEditor.activeUnionId)) {
        unionEditorSelect.value = state.layoutEditor.activeUnionId;
      }
    }

    if (unionAttachChildSelect) {
      unionAttachChildSelect.innerHTML = `
        <option value="">Select a child…</option>
        ${peopleEntries.map(([personId, person]) => `<option value="${escapeHtml(personId)}">${escapeHtml(person.name)} (${escapeHtml(personId)})</option>`).join("")}
      `;
    }
  }

  function clearPersonEditor() {
    state.layoutEditor.activePersonId = null;
    if (personEditorSelect) personEditorSelect.value = "";
    if (personEditorId) personEditorId.value = "";
    if (personEditorName) personEditorName.value = "";
    if (personEditorOrder) personEditorOrder.value = "";
    if (personEditorSex) personEditorSex.value = "";
    if (personEditorTitle) personEditorTitle.value = "";
    if (personEditorKindred) personEditorKindred.value = "";
    if (personEditorHouse) personEditorHouse.value = "";
    if (personEditorRealm) personEditorRealm.value = "";
    if (personEditorBorn) personEditorBorn.value = "";
    if (personEditorDied) personEditorDied.value = "";
    if (personEditorImage) personEditorImage.value = "";
    if (personEditorGroups) personEditorGroups.value = "";
    if (personEditorRecordType) personEditorRecordType.value = "";
    if (personEditorPlaceholder) personEditorPlaceholder.checked = false;
    if (personEditorBio) personEditorBio.value = "";
  }

  function loadPersonIntoEditor(personId) {
    const person = getPersonById(personId);
    if (!person) {
      clearPersonEditor();
      return;
    }

    state.layoutEditor.activePersonId = personId;
    if (personEditorSelect) personEditorSelect.value = personId;
    personEditorId.value = person.id || "";
    personEditorName.value = person.name || "";
    personEditorOrder.value = person.order ?? "";
    personEditorSex.value = person.sex || "";
    personEditorTitle.value = person.title || "";
    personEditorKindred.value = person.kindred || "";
    personEditorHouse.value = person.house || "";
    personEditorRealm.value = person.realm || "";
    personEditorBorn.value = person.born || "";
    personEditorDied.value = person.died || "";
    personEditorImage.value = person.image || "";
    personEditorGroups.value = (person.groups || []).join(", ");
    personEditorRecordType.value = person.recordType || "";
    personEditorPlaceholder.checked = Boolean(person.isPlaceholder);
    personEditorBio.value = person.bio || "";
  }

  function clearUnionEditor() {
    state.layoutEditor.activeUnionId = null;
    if (unionEditorSelect) unionEditorSelect.value = "";
    if (unionEditorId) unionEditorId.value = "";
    if (unionEditorOrder) unionEditorOrder.value = "";
    if (unionEditorLabel) unionEditorLabel.value = "";
    if (unionEditorPartners) unionEditorPartners.value = "";
    if (unionEditorChildren) unionEditorChildren.value = "";
    if (unionEditorLineagePartner) unionEditorLineagePartner.value = "";
    if (unionEditorLineageChild) unionEditorLineageChild.value = "";
    if (unionEditorPartnerGap) unionEditorPartnerGap.value = "";
    if (unionEditorPartnerOrder) unionEditorPartnerOrder.value = "";
    if (unionEditorChildOrder) unionEditorChildOrder.value = "";
    if (unionAttachChildSelect) unionAttachChildSelect.value = "";
  }

  function loadUnionIntoEditor(unionId) {
    const union = (data.unions || []).find((entry) => entry.id === unionId);
    if (!union) {
      clearUnionEditor();
      return;
    }

    state.layoutEditor.activeUnionId = unionId;
    if (unionEditorSelect) unionEditorSelect.value = unionId;
    unionEditorId.value = union.id || "";
    unionEditorOrder.value = union.order ?? "";
    unionEditorLabel.value = union.label || "";
    unionEditorPartners.value = (union.partners || []).join(", ");
    unionEditorChildren.value = (union.children || []).join(", ");
    unionEditorLineagePartner.value = union.lineagePartner || "";
    unionEditorLineageChild.value = union.lineageChild || "";
    unionEditorPartnerGap.value = union.partnerGap ?? "";
    unionEditorPartnerOrder.value = (union.partnerOrder || []).join(", ");
    unionEditorChildOrder.value = (union.childOrder || []).join(", ");
    if (unionAttachChildSelect) unionAttachChildSelect.value = "";
  }

  function applyCandidateData(candidateData, successMessage) {
    const normalizedData = normalizeDataForExport(candidateData);
    buildIndexes(normalizedData);
    data = normalizedData;
    state.indexes = buildIndexes();
    refreshLayoutEditorData();
    saveDataDraft();
    saveLayoutDrafts();
    setLayoutEditorStatus(successMessage);
    requestRender({
      viewId: state.currentViewId || getInitialViewId(),
      fit: false,
      preserveCollapsed: true
    });
  }

  function savePersonFromEditor() {
    const nextId = String(personEditorId?.value || "").trim();
    const name = String(personEditorName?.value || "").trim();

    if (!nextId) {
      setLayoutEditorStatus("A person needs an ID before it can be saved.");
      return;
    }

    if (!name) {
      setLayoutEditorStatus("A person needs a name before it can be saved.");
      return;
    }

    const previousId = state.layoutEditor.activePersonId;
    const isRename = previousId && previousId !== nextId;
    const candidate = cloneJson(data);

    if (isRename && candidate.people[nextId]) {
      setLayoutEditorStatus(`The person ID "${nextId}" already exists, so that rename cannot be saved.`);
      return;
    }

    const personRecord = {
      id: nextId,
      name,
      order: parseOptionalNumber(personEditorOrder?.value),
      sex: String(personEditorSex?.value || "").trim() || undefined,
      title: String(personEditorTitle?.value || "").trim() || undefined,
      kindred: String(personEditorKindred?.value || "").trim() || undefined,
      house: String(personEditorHouse?.value || "").trim() || undefined,
      realm: String(personEditorRealm?.value || "").trim() || undefined,
      born: String(personEditorBorn?.value || "").trim() || undefined,
      died: String(personEditorDied?.value || "").trim() || undefined,
      image: String(personEditorImage?.value || "").trim() || undefined,
      groups: parseCsvIds(personEditorGroups?.value),
      recordType: String(personEditorRecordType?.value || "").trim() || undefined,
      isPlaceholder: Boolean(personEditorPlaceholder?.checked),
      bio: String(personEditorBio?.value || "").trim() || undefined
    };

    Object.keys(personRecord).forEach((key) => {
      const value = personRecord[key];
      if (value === undefined || (Array.isArray(value) && value.length === 0) || (key === "isPlaceholder" && value === false)) {
        delete personRecord[key];
      }
    });

    if (isRename) {
      delete candidate.people[previousId];
      (candidate.unions || []).forEach((union) => {
        union.partners = (union.partners || []).map((partnerId) => partnerId === previousId ? nextId : partnerId);
        union.children = (union.children || []).map((childId) => childId === previousId ? nextId : childId);
        if (union.lineagePartner === previousId) union.lineagePartner = nextId;
        if (union.lineageChild === previousId) union.lineageChild = nextId;
        if (Array.isArray(union.partnerOrder)) {
          union.partnerOrder = union.partnerOrder.map((partnerId) => partnerId === previousId ? nextId : partnerId);
        }
        if (Array.isArray(union.childOrder)) {
          union.childOrder = union.childOrder.map((childId) => childId === previousId ? nextId : childId);
        }
      });

      Object.values(candidate.views || {}).forEach((view) => {
        ["seeds", "roots"].forEach((key) => {
          if (Array.isArray(view[key])) {
            view[key] = view[key].map((personId) => personId === previousId ? nextId : personId);
          }
        });

        if (view.filters) {
          ["includePersonIds", "excludePersonIds", "alwaysInclude"].forEach((key) => {
            if (Array.isArray(view.filters[key])) {
              view.filters[key] = view.filters[key].map((personId) => personId === previousId ? nextId : personId);
            }
          });
        }
      });

      Object.values(state.layoutEditor.drafts.views || {}).forEach((viewLayout) => {
        if (viewLayout.positions && viewLayout.positions[previousId]) {
          viewLayout.positions[nextId] = viewLayout.positions[previousId];
          delete viewLayout.positions[previousId];
        }
      });

      Object.values(fileLayouts.views || {}).forEach((viewLayout) => {
        if (viewLayout.positions && viewLayout.positions[previousId]) {
          viewLayout.positions[nextId] = viewLayout.positions[previousId];
          delete viewLayout.positions[previousId];
        }
      });
    }

    candidate.people[nextId] = personRecord;

    try {
      applyCandidateData(candidate, isRename
        ? `Saved ${name} and renamed ${previousId} to ${nextId}.`
        : `Saved ${name}.`);
      state.layoutEditor.activePersonId = nextId;
      refreshLayoutEditorData();
      loadPersonIntoEditor(nextId);
    } catch (error) {
      setLayoutEditorStatus(error instanceof Error ? error.message : String(error));
    }
  }

  function buildUnionRecordFromEditor() {
    const unionId = String(unionEditorId?.value || "").trim();
    if (!unionId) {
      throw new Error("A union needs an ID before it can be saved.");
    }

    const partners = parseCsvIds(unionEditorPartners?.value);
    const children = parseCsvIds(unionEditorChildren?.value);

    if (partners.length === 0) {
      throw new Error("A union needs at least one partner.");
    }

    return {
      id: unionId,
      partners,
      children,
      label: String(unionEditorLabel?.value || "").trim() || "Family",
      order: parseOptionalNumber(unionEditorOrder?.value),
      lineagePartner: String(unionEditorLineagePartner?.value || "").trim() || undefined,
      lineageChild: String(unionEditorLineageChild?.value || "").trim() || undefined,
      partnerGap: parseOptionalNumber(unionEditorPartnerGap?.value),
      partnerOrder: parseCsvIds(unionEditorPartnerOrder?.value),
      childOrder: parseCsvIds(unionEditorChildOrder?.value)
    };
  }

  function saveUnionFromEditor() {
    let unionRecord;
    try {
      unionRecord = buildUnionRecordFromEditor();
    } catch (error) {
      setLayoutEditorStatus(error instanceof Error ? error.message : String(error));
      return;
    }

    Object.keys(unionRecord).forEach((key) => {
      const value = unionRecord[key];
      if (value === undefined || (Array.isArray(value) && value.length === 0)) {
        delete unionRecord[key];
      }
    });

    const candidate = cloneJson(data);
    const previousId = state.layoutEditor.activeUnionId;
    const existingIndex = (candidate.unions || []).findIndex((union) => union.id === previousId || union.id === unionRecord.id);

    if (previousId && previousId !== unionRecord.id) {
      const duplicateIndex = (candidate.unions || []).findIndex((union) => union.id === unionRecord.id);
      if (duplicateIndex !== -1 && candidate.unions[duplicateIndex].id !== previousId) {
        setLayoutEditorStatus(`The union ID "${unionRecord.id}" already exists, so that rename cannot be saved.`);
        return;
      }
    }

    if (existingIndex === -1) {
      candidate.unions.push(unionRecord);
    } else {
      candidate.unions[existingIndex] = unionRecord;
    }

    try {
      applyCandidateData(candidate, `Saved union ${unionRecord.id}.`);
      state.layoutEditor.activeUnionId = unionRecord.id;
      refreshLayoutEditorData();
      loadUnionIntoEditor(unionRecord.id);
    } catch (error) {
      setLayoutEditorStatus(error instanceof Error ? error.message : String(error));
    }
  }

  function attachChildToLoadedUnion() {
    const unionId = state.layoutEditor.activeUnionId || unionEditorSelect?.value;
    const childId = unionAttachChildSelect?.value;

    if (!unionId) {
      setLayoutEditorStatus("Load or create a union first, then attach a child to it.");
      return;
    }

    if (!childId) {
      setLayoutEditorStatus("Choose a child to attach to the loaded union.");
      return;
    }

    const candidate = cloneJson(data);
    const union = (candidate.unions || []).find((entry) => entry.id === unionId);
    if (!union) {
      setLayoutEditorStatus(`Could not find union ${unionId}.`);
      return;
    }

    if (!Array.isArray(union.children)) {
      union.children = [];
    }

    if (!union.children.includes(childId)) {
      union.children.push(childId);
    }

    try {
      applyCandidateData(candidate, `Attached ${getPersonById(childId)?.name || childId} to ${unionId}.`);
      state.layoutEditor.activeUnionId = unionId;
      loadUnionIntoEditor(unionId);
    } catch (error) {
      setLayoutEditorStatus(error instanceof Error ? error.message : String(error));
    }
  }

  function detachChildFromLoadedUnion() {
    const unionId = state.layoutEditor.activeUnionId || unionEditorSelect?.value;
    const childId = unionAttachChildSelect?.value;

    if (!unionId) {
      setLayoutEditorStatus("Load or create a union first, then detach a child from it.");
      return;
    }

    if (!childId) {
      setLayoutEditorStatus("Choose a child to detach from the loaded union.");
      return;
    }

    const candidate = cloneJson(data);
    const union = (candidate.unions || []).find((entry) => entry.id === unionId);
    if (!union) {
      setLayoutEditorStatus(`Could not find union ${unionId}.`);
      return;
    }

    if (!Array.isArray(union.children) || !union.children.includes(childId)) {
      setLayoutEditorStatus(`${getPersonById(childId)?.name || childId} is not currently attached to ${unionId}.`);
      return;
    }

    union.children = union.children.filter((existingChildId) => existingChildId !== childId);

    if (union.lineageChild === childId) {
      delete union.lineageChild;
    }

    if (Array.isArray(union.childOrder)) {
      union.childOrder = union.childOrder.filter((existingChildId) => existingChildId !== childId);
      if (union.childOrder.length === 0) {
        delete union.childOrder;
      }
    }

    try {
      applyCandidateData(candidate, `Detached ${getPersonById(childId)?.name || childId} from ${unionId}.`);
      state.layoutEditor.activeUnionId = unionId;
      loadUnionIntoEditor(unionId);
      if (unionAttachChildSelect) {
        unionAttachChildSelect.value = childId;
      }
    } catch (error) {
      setLayoutEditorStatus(error instanceof Error ? error.message : String(error));
    }
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
        <rect width="220" height="220" rx="28" fill="#efe3cb" />
        <circle cx="110" cy="110" r="84" fill="${accent}" opacity="0.94" />
        <text x="110" y="125" text-anchor="middle" font-family="Georgia, serif" font-size="72" fill="#f7f0e2">${initials}</text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function getPortrait(person) {
    return person.image || makePortraitPlaceholder(person);
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
    const boxes = Array.from(people.values());
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

    return {
      people,
      unions,
      bounds: calculateLayoutBoundsFromPeople(people),
      mode: "manual",
      unionInfos
    };
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

    const boxes = Array.from(people.values());
    const bounds = boxes.length === 0
      ? { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 }
      : {
          minX: Math.min(...boxes.map((box) => box.left)) - 40,
          minY: Math.min(...boxes.map((box) => box.top)) - 40,
          maxX: Math.max(...boxes.map((box) => box.right)) + 40,
          maxY: Math.max(...boxes.map((box) => box.bottom)) + 40
        };

    bounds.width = bounds.maxX - bounds.minX;
    bounds.height = bounds.maxY - bounds.minY;

    return {
      people,
      unions,
      bounds
    };
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

  function syncViewQueryParam(viewId) {
    const url = new URL(window.location.href);
    url.searchParams.set("view", viewId);
    window.history.replaceState({}, "", url);
  }

  function getInitialViewId() {
    const params = new URLSearchParams(window.location.search);
    const requestedView = params.get("view");
    return data.views[requestedView] ? requestedView : data.defaults.initialView;
  }

  function populateViewSelect() {
    Object.entries(data.views).forEach(([viewId, view]) => {
      const option = document.createElement("option");
      option.value = viewId;
      option.textContent = view.label;
      viewSelect.appendChild(option);
    });
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
    minimapElement.classList.remove("hidden");
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
    minimapElement.classList.add("hidden");
    minimapSvg.innerHTML = "";
    state.minimapMetrics = null;
  }

  function hideCharacterSheet() {
    state.activePersonId = null;
    characterSheet.classList.add("hidden");
    updateActiveNodeSelection();
  }

  function updateActiveNodeSelection() {
    if (!state.scene) return;

    state.scene.nodeLayer.selectAll(".family-tree-node")
      .classed("is-active", (d) => d.id === state.activePersonId);
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
    const note = person.isPlaceholder
      ? "<p class=\"character-note\">This record is a placeholder or aggregate node used to keep the larger family graph readable.</p>"
      : "";

    characterSheetContent.innerHTML = `
      <div class="character-header">
        <img src="${escapeHtml(getPortrait(person))}" alt="${escapeHtml(person.name)}" />
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
    const linkLayer = zoomLayer.append("g").attr("class", "family-tree-link-layer");
    const unionLayer = zoomLayer.append("g").attr("class", "family-tree-union-layer");
    const nodeLayer = zoomLayer.append("g").attr("class", "family-tree-node-layer");

    const zoom = d3.zoom()
      .scaleExtent([0.2, 3])
      .on("zoom", (event) => {
        state.currentTransform = event.transform;
        zoomLayer.attr("transform", event.transform);
        updateMinimapViewport();
      });

    svg.call(zoom);

    return {
      svg,
      defs,
      zoom,
      zoomLayer,
      linkLayer,
      unionLayer,
      nodeLayer
    };
  }

  function clearScene() {
    state.scene.defs.selectAll("*").remove();
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
          id: `${union.id}-child`,
          x1: descentOriginX,
          y1: descentOriginY,
          x2: child.centerX,
          y2: child.top
        });

        return;
      }

      const leftChild = children[0];
      const rightChild = children[children.length - 1];

      descentLines.push({
        id: `${union.id}-stem`,
        x1: descentOriginX,
        y1: descentOriginY,
        x2: descentOriginX,
        y2: branchY
      });

      if (leftChild.centerX < descentOriginX) {
        descentLines.push({
          id: `${union.id}-branch-left`,
          x1: leftChild.centerX,
          y1: branchY,
          x2: descentOriginX,
          y2: branchY
        });
      }

      if (rightChild.centerX > descentOriginX) {
        descentLines.push({
          id: `${union.id}-branch-right`,
          x1: descentOriginX,
          y1: branchY,
          x2: rightChild.centerX,
          y2: branchY
        });
      }

      children.forEach((child, index) => {
        descentLines.push({
          id: `${union.id}-child-${index}`,
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

  function updateScenePositions(layout, projection, rawProjection) {
    const { spouseLines, descentLines } = buildConnectorPaths(layout);
    const nodeData = getNodeRenderData(layout, projection, rawProjection);

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
    updateMinimap(layout, projection);
  }

  function renderScene(layout, projection, rawProjection) {
    clearScene();

    const { spouseLines, descentLines } = buildConnectorPaths(layout);
    const nodeData = getNodeRenderData(layout, projection, rawProjection);

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
        if (state.layoutEditor.didDrag) {
          state.layoutEditor.didDrag = false;
          return;
        }
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
        if (state.layoutEditor.didDrag) {
          state.layoutEditor.didDrag = false;
          return;
        }
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
      .attr("href", (d) => getPortrait(d.person))
      .attr("x", cardWidth / 2 - portraitRadius)
      .attr("y", 34 - portraitRadius)
      .attr("width", portraitRadius * 2)
      .attr("height", portraitRadius * 2)
      .attr("clip-path", (d) => `url(#tree-portrait-clip-${d.id})`)
      .attr("preserveAspectRatio", "xMidYMid slice");

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

    applyLayoutEditorNodeBehavior(nodeGroups);
    updateActiveNodeSelection();
    updateMinimap(layout, projection);
  }

  function rebuildCurrentLayoutFromDrafts() {
    if (!state.currentAutoLayout || !state.currentProjection) {
      return;
    }

    const manualViewLayout = getEffectiveViewLayout(state.currentViewId);
    state.currentLayout = manualViewLayout
      ? applyManualLayoutToBase(state.currentAutoLayout, state.currentProjection, state.currentUnionInfos, manualViewLayout)
      : state.currentAutoLayout;

    updateScenePositions(state.currentLayout, state.currentProjection, state.currentRawProjection);
  }

  function applyLayoutEditorNodeBehavior(nodeGroups) {
    if (!state.layoutEditor.available || !window.d3) {
      nodeGroups.on(".drag", null);
      return;
    }

    const dragBehavior = d3.drag()
      .on("start", (event, d) => {
        if (!state.layoutEditor.draggingEnabled) {
          return;
        }

        event.sourceEvent.stopPropagation();
        state.layoutEditor.didDrag = false;
        d3.select(event.currentTarget).classed("is-dragging", true);
      })
      .on("drag", (event, d) => {
        if (!state.layoutEditor.draggingEnabled || !state.currentLayout) {
          return;
        }

        const scale = state.currentTransform.k || 1;
        const currentBox = state.currentLayout.people.get(d.id);
        if (!currentBox) {
          return;
        }

        const nextLeft = currentBox.left + event.dx / scale;
        const nextTop = currentBox.top + event.dy / scale;
        setDraftPosition(state.currentViewId, d.id, nextLeft, nextTop);
        state.layoutEditor.didDrag = true;
        rebuildCurrentLayoutFromDrafts();
      })
      .on("end", (event) => {
        d3.select(event.currentTarget).classed("is-dragging", false);

        if (!state.layoutEditor.draggingEnabled) {
          return;
        }

        if (state.layoutEditor.didDrag) {
          const saved = saveLayoutDrafts();
          setLayoutEditorStatus(saved
            ? `Moved cards in ${data.views[state.currentViewId].label}. The browser draft is already saved, and you can download a publish file whenever you're happy with the layout.`
            : `Moved cards in ${data.views[state.currentViewId].label}. The layout changed in memory, but this browser would not save the draft automatically.`);
        }
      });

    nodeGroups.call(dragBehavior);
  }

  function updateLayoutEditorChrome() {
    if (!state.layoutEditor.available) {
      document.body.classList.remove("is-layout-editor");
      layoutEditorPanel?.classList.add("hidden");
      if (treeHint) {
        treeHint.textContent = "Drag to pan | Scroll to zoom | Click a person for details";
      }
      return;
    }

    document.body.classList.add("is-layout-editor");
    layoutEditorPanel?.classList.remove("hidden");

    if (treeHint) {
      treeHint.textContent = state.layoutEditor.draggingEnabled
        ? "Drag cards to place them | Scroll to zoom | Save to browser when the layout feels right"
        : "Pan the tree normally | Enable dragging in Layout Studio when you're ready to place cards";
    }

    if (layoutEditorToggle) {
      layoutEditorToggle.textContent = state.layoutEditor.draggingEnabled ? "Disable Dragging" : "Enable Dragging";
    }
  }

  function getTreeViewport() {
    if (!state.currentLayout) return null;

    const hostRect = treeHost.getBoundingClientRect();
    if (hostRect.width === 0 || hostRect.height === 0) return null;

    return {
      left: -state.currentTransform.x / state.currentTransform.k,
      top: -state.currentTransform.y / state.currentTransform.k,
      width: hostRect.width / state.currentTransform.k,
      height: hostRect.height / state.currentTransform.k
    };
  }

  function updateMinimap(layout, projection) {
    const boxes = projection.peopleIds
      .map((personId) => layout.people.get(personId))
      .filter(Boolean);

    if (boxes.length === 0) {
      minimapSvg.innerHTML = "";
      state.minimapMetrics = null;
      return;
    }

    const bounds = layout.bounds;
    const usableWidth = minimapWidth - minimapPadding * 2;
    const usableHeight = minimapHeight - minimapPadding * 2;
    const scale = Math.min(usableWidth / Math.max(bounds.width, 1), usableHeight / Math.max(bounds.height, 1));
    const offsetX = minimapPadding + (usableWidth - bounds.width * scale) / 2;
    const offsetY = minimapPadding + (usableHeight - bounds.height * scale) / 2;

    state.minimapMetrics = {
      bounds,
      scale,
      offsetX,
      offsetY
    };

    const rects = boxes.map((box) => {
      const person = getPersonById(box.id);
      return {
        id: box.id,
        x: offsetX + (box.left - bounds.minX) * scale,
        y: offsetY + (box.top - bounds.minY) * scale,
        width: Math.max(4, box.width * scale),
        height: Math.max(4, box.height * scale),
        fill: getAccentColor(person)
      };
    });

    const backdrop = `
      <rect class="tree-minimap__background" x="0" y="0" width="${minimapWidth}" height="${minimapHeight}" rx="12" ry="12"></rect>
      <rect class="tree-minimap__world" x="${offsetX}" y="${offsetY}" width="${bounds.width * scale}" height="${bounds.height * scale}" rx="10" ry="10"></rect>
    `;

    const nodesMarkup = rects.map((rect) => `
      <rect class="tree-minimap__node"
        data-node-id="${rect.id}"
        x="${rect.x}"
        y="${rect.y}"
        width="${rect.width}"
        height="${rect.height}"
        rx="3"
        ry="3"
        fill="${rect.fill}"></rect>
    `).join("");

    minimapSvg.innerHTML = `${backdrop}${nodesMarkup}<rect id="tree-minimap-viewport" class="tree-minimap__viewport" x="0" y="0" width="0" height="0" rx="4" ry="4"></rect>`;
    updateMinimapViewport();
  }

  function updateMinimapViewport() {
    if (!state.minimapMetrics || !state.currentLayout) return;

    const viewportRect = minimapSvg.querySelector("#tree-minimap-viewport");
    if (!viewportRect) return;

    const viewport = getTreeViewport();
    if (!viewport) return;

    const { bounds, scale, offsetX, offsetY } = state.minimapMetrics;
    const x = offsetX + (viewport.left - bounds.minX) * scale;
    const y = offsetY + (viewport.top - bounds.minY) * scale;
    const width = viewport.width * scale;
    const height = viewport.height * scale;

    viewportRect.setAttribute("x", String(x));
    viewportRect.setAttribute("y", String(y));
    viewportRect.setAttribute("width", String(width));
    viewportRect.setAttribute("height", String(height));
  }

  function fitToBounds(bounds, useTransition = true) {
    const hostRect = treeHost.getBoundingClientRect();
    if (hostRect.width === 0 || hostRect.height === 0 || bounds.width === 0 || bounds.height === 0) return;

    const padding = 48;
    const scale = Math.max(
      0.2,
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
        <img src="${escapeHtml(getPortrait(person))}" alt="${escapeHtml(person.name)}" />
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
  }

  function requestRender(options = {}) {
    renderCurrentView(options).catch((error) => {
      renderError(error instanceof Error ? error.message : String(error));
    });
  }

  async function renderCurrentView(options = {}) {
    clearError();

    const viewId = options.viewId || state.currentViewId || getInitialViewId();
    const switchingView = state.currentViewId !== viewId;
    state.currentViewId = viewId;

    if (switchingView && !options.preserveCollapsed) {
      state.collapsedIds.clear();
    }

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
      updateMinimapViewport();
      return;
    }

    fitToBounds(layout.bounds, !switchingView);
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

  function initMinimapInteractions() {
    minimapSvg.addEventListener("click", (event) => {
      if (!state.currentLayout || !state.minimapMetrics) return;

      const svgRect = minimapSvg.getBoundingClientRect();
      if (svgRect.width === 0 || svgRect.height === 0) return;

      const scaleX = minimapWidth / svgRect.width;
      const scaleY = minimapHeight / svgRect.height;
      const clickX = (event.clientX - svgRect.left) * scaleX;
      const clickY = (event.clientY - svgRect.top) * scaleY;
      const { bounds, scale, offsetX, offsetY } = state.minimapMetrics;
      const worldX = bounds.minX + (clickX - offsetX) / scale;
      const worldY = bounds.minY + (clickY - offsetY) / scale;

      const hostRect = treeHost.getBoundingClientRect();
      const currentScale = state.currentTransform.k || 1;
      const transform = d3.zoomIdentity
        .translate(hostRect.width / 2 - worldX * currentScale, hostRect.height / 2 - worldY * currentScale)
        .scale(currentScale);

      state.scene.svg.transition().duration(250).call(state.scene.zoom.transform, transform);
    });
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
      state.layoutEditor.available = isLayoutEditorRequested();
      state.layoutEditor.draggingEnabled = state.layoutEditor.available;
      state.layoutEditor.drafts = loadLayoutDrafts();
      state.indexes = buildIndexes();
      state.scene = initializeScene();
      populateViewSelect();
      refreshLayoutEditorData();
      clearPersonEditor();
      clearUnionEditor();
      initMinimapInteractions();
      updateLayoutEditorChrome();

      if (layoutEditorLink && state.layoutEditor.available) {
        layoutEditorLink.setAttribute("href", "family_tree.html");
        const label = layoutEditorLink.querySelector("span");
        if (label) {
          label.textContent = "Tree Mode";
        }
      }

      if (state.layoutEditor.available) {
        setLayoutEditorStatus(hasAnyDraftLayouts()
          ? "Layout Studio is active. Drag cards to place them, save to browser for everyday use, or download a publish file for the repo."
          : "Layout Studio is active. Drag cards to place them, then save to browser or download a publish file.");
      }

      viewSelect.addEventListener("change", (event) => {
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
          fitToBounds(state.currentLayout.bounds, true);
        }
      });

      if (layoutEditorToggle) {
        layoutEditorToggle.addEventListener("click", () => {
          state.layoutEditor.draggingEnabled = !state.layoutEditor.draggingEnabled;
          updateLayoutEditorChrome();
          setLayoutEditorStatus(state.layoutEditor.draggingEnabled
            ? "Dragging enabled. Move cards directly in the tree, then save or download when you're happy."
            : "Dragging disabled. The tree is back in browse mode until you enable dragging again.");
        });
      }

      if (layoutEditorSave) {
        layoutEditorSave.addEventListener("click", () => {
          const layoutSaved = saveLayoutDrafts();
          const dataSaved = saveDataDraft();
          setLayoutEditorStatus(layoutSaved && dataSaved
            ? `Saved the current tree data and manual layouts to this browser. ${data.views[state.currentViewId].label} will reopen with these draft edits here.`
            : "This browser blocked local saving, so the draft could not be fully saved here.");
        });
      }

      if (layoutEditorDownload) {
        layoutEditorDownload.addEventListener("click", () => {
          const exportedData = normalizeDataForExport(data);
          const exportedLayouts = normalizeLayoutsForExport(getMergedLayoutsForExport());
          downloadJsonFile("family_tree_data.json", exportedData);
          downloadJsonFile("family_tree_layouts.json", exportedLayouts);
          setLayoutEditorStatus("Downloaded family_tree_data.json and family_tree_layouts.json. Replace those repo files and deploy/commit when you want the public site to use this tree.");
        });
      }

      if (layoutEditorReset) {
        layoutEditorReset.addEventListener("click", () => {
          if (!state.currentViewId) {
            return;
          }

          clearDraftViewLayout(state.currentViewId);
          saveLayoutDrafts();
          setLayoutEditorStatus(`Cleared the browser draft for ${data.views[state.currentViewId].label}. The view is back on its automatic layout unless a published layout file exists for it.`);
          requestRender({
            viewId: state.currentViewId,
            fit: false,
            preserveCollapsed: true
          });
        });
      }

      if (layoutEditorClearDrafts) {
        layoutEditorClearDrafts.addEventListener("click", async () => {
          try {
            clearDataDraft();
            clearLayoutDrafts();
            await loadTreeFiles();
            state.indexes = buildIndexes();
            refreshLayoutEditorData();
            clearPersonEditor();
            clearUnionEditor();
            setLayoutEditorStatus("Cleared the browser data/layout drafts. The editor is back on the repo's published JSON files.");
            requestRender({
              viewId: state.currentViewId || getInitialViewId(),
              fit: true
            });
          } catch (error) {
            setLayoutEditorStatus(error instanceof Error ? error.message : String(error));
          }
        });
      }

      if (personEditorSelect) {
        personEditorSelect.addEventListener("change", (event) => {
          const personId = event.target.value;
          if (!personId) {
            clearPersonEditor();
            return;
          }

          loadPersonIntoEditor(personId);
        });
      }

      if (personEditorNew) {
        personEditorNew.addEventListener("click", () => {
          clearPersonEditor();
          setLayoutEditorStatus("Enter a new person record, save it, then connect it through a union so it appears in the tree.");
        });
      }

      if (personEditorSave) {
        personEditorSave.addEventListener("click", savePersonFromEditor);
      }

      if (unionEditorSelect) {
        unionEditorSelect.addEventListener("change", (event) => {
          const unionId = event.target.value;
          if (!unionId) {
            clearUnionEditor();
            return;
          }

          loadUnionIntoEditor(unionId);
        });
      }

      if (unionEditorNew) {
        unionEditorNew.addEventListener("click", () => {
          clearUnionEditor();
          setLayoutEditorStatus("Create a new union, save it, then attach children or drag the cards into place.");
        });
      }

      if (unionEditorSave) {
        unionEditorSave.addEventListener("click", saveUnionFromEditor);
      }

      if (unionEditorAttachChild) {
        unionEditorAttachChild.addEventListener("click", attachChildToLoadedUnion);
      }

      if (unionEditorDetachChild) {
        unionEditorDetachChild.addEventListener("click", detachChildFromLoadedUnion);
      }

      backToTreeButton.addEventListener("click", hideCharacterSheet);

      characterSheet.addEventListener("click", (event) => {
        if (event.target === characterSheet) {
          hideCharacterSheet();
        }
      });

      document.addEventListener("click", (event) => {
        if (!searchResults.contains(event.target) && event.target !== searchInput) {
          hideSearchResults();
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          hideCharacterSheet();
        }
      });

      window.addEventListener("resize", () => {
        updateMinimapViewport();
      });

      requestRender({
        viewId: getInitialViewId(),
        fit: true
      });
    } catch (error) {
      renderError(error instanceof Error ? error.message : String(error));
    }
  }

  init();
})();

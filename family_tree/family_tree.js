(function () {
  const data = window.FAMILY_TREE_DATA;
  const treeHost = document.getElementById("family-tree-host");
  const treeWrapper = document.getElementById("tree");
  const viewSelect = document.getElementById("tree-view");
  const viewTitle = document.getElementById("tree-view-title");
  const viewDescription = document.getElementById("tree-view-description");
  const viewStats = document.getElementById("tree-view-stats");
  const emptyState = document.getElementById("tree-empty-state");
  const emptyTitle = document.getElementById("tree-empty-title");
  const emptyBody = document.getElementById("tree-empty-body");
  const resetViewButton = document.getElementById("reset-view");
  const characterSheet = document.getElementById("character-sheet");
  const backToTreeButton = document.getElementById("back-to-tree");
  const characterSheetContent = document.getElementById("character-sheet-content");

  let family = null;
  let indexes = null;

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
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

    if (groups.includes("elves") && groups.includes("half-elven")) return "#5f746f";
    if (groups.includes("elves")) return "#466a62";
    if (groups.includes("dwarves")) return "#6b5841";
    if (groups.includes("hobbits")) return "#5d6d46";
    if (person.recordType === "aggregate") return "#785c37";

    return "#7a5430";
  }

  function makePortraitPlaceholder(person) {
    const accent = getAccentColor(person);
    const initials = getInitials(person.name);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 220">
        <rect width="220" height="220" rx="28" fill="#efe3cb" />
        <circle cx="110" cy="110" r="84" fill="${accent}" opacity="0.92" />
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

  function getPersonById(personId) {
    return data.people[personId] || null;
  }

  function getUnionById(unionId) {
    return indexes.unionById.get(unionId) || null;
  }

  function buildIndexes() {
    const personIds = new Set(Object.keys(data.people));
    const unionById = new Map();
    const unionsByPartner = new Map();
    const parentUnionByChild = new Map();
    const errors = [];

    Object.entries(data.people).forEach(([personId, person]) => {
      if (person.id !== personId) {
        errors.push(`people.${personId}.id must match its key.`);
      }

      if (!person.name) {
        errors.push(`people.${personId}.name is required.`);
      }
    });

    data.unions.forEach((union, index) => {
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
          errors.push(`child "${childId}" appears in more than one union, which Balkan mode cannot resolve cleanly.`);
          return;
        }

        parentUnionByChild.set(childId, union.id);
      });
    });

    Object.entries(data.views).forEach(([viewId, view]) => {
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
    return (indexes.unionsByPartner.get(personId) || [])
      .map((unionId) => getUnionById(unionId))
      .filter(Boolean);
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
        unionIds: [],
        roots: []
      };
    }

    const stateByPerson = new Map();
    const queue = [];

    function enqueue(personId, nextState, reason) {
      if (!getPersonById(personId)) return;

      let state = stateByPerson.get(personId);
      let changed = false;

      if (!state) {
        state = {
          up: -1,
          down: -1,
          traverseSpouses: false,
          expandSpouseLineage: false,
          reasons: new Set()
        };
        stateByPerson.set(personId, state);
        changed = true;
      }

      if ((nextState.up ?? -1) > state.up) {
        state.up = nextState.up;
        changed = true;
      }

      if ((nextState.down ?? -1) > state.down) {
        state.down = nextState.down;
        changed = true;
      }

      if (nextState.traverseSpouses && !state.traverseSpouses) {
        state.traverseSpouses = true;
        changed = true;
      }

      if (nextState.expandSpouseLineage && !state.expandSpouseLineage) {
        state.expandSpouseLineage = true;
        changed = true;
      }

      state.reasons.add(reason);

      if (changed) {
        queue.push({
          personId,
          up: state.up,
          down: state.down,
          traverseSpouses: state.traverseSpouses,
          expandSpouseLineage: state.expandSpouseLineage
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

    while (queue.length > 0) {
      const current = queue.shift();
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
        const parentUnionId = indexes.parentUnionByChild.get(current.personId);
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
        }
      }
    }

    const peopleIds = Array.from(stateByPerson.keys()).sort((leftId, rightId) => {
      const leftOrder = getPersonById(leftId).order ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = getPersonById(rightId).order ?? Number.MAX_SAFE_INTEGER;
      return leftOrder - rightOrder;
    });

    const peopleSet = new Set(peopleIds);
    const unionIds = data.unions
      .filter((union) =>
        union.partners.some((partnerId) => peopleSet.has(partnerId)) ||
        union.children.some((childId) => peopleSet.has(childId))
      )
      .map((union) => union.id);

    const roots = uniqueOrdered([...(view.roots || []), ...(view.seeds || [])].filter((personId) => peopleSet.has(personId)));

    return {
      empty: peopleIds.length === 0,
      view,
      viewId,
      peopleIds,
      peopleSet,
      unionIds,
      roots: roots.length > 0 ? roots : peopleIds.slice(0, 1)
    };
  }

  function pickParentSlots(personId, includedPeople) {
    const parentUnionId = indexes.parentUnionByChild.get(personId);
    if (!parentUnionId) return {};

    const parentUnion = getUnionById(parentUnionId);
    const visibleParents = parentUnion.partners.filter((partnerId) => includedPeople.has(partnerId));
    if (visibleParents.length === 0) return {};

    let fid = null;
    let mid = null;

    visibleParents.forEach((parentId) => {
      const parent = getPersonById(parentId);
      if (!parent) return;

      if (parent.sex === "male" && !fid) fid = parentId;
      if (parent.sex === "female" && !mid) mid = parentId;
    });

    const fallbackParents = visibleParents.filter((parentId) => parentId !== fid && parentId !== mid);

    if (!fid && fallbackParents.length > 0) {
      fid = fallbackParents.shift();
    }

    if (!mid && fallbackParents.length > 0) {
      mid = fallbackParents.shift();
    }

    return { fid, mid };
  }

  function buildBalkanNodes(projection) {
    return projection.peopleIds.map((personId) => {
      const person = getPersonById(personId);
      const partnerIds = uniqueOrdered(
        getPartnerUnions(personId)
          .filter((union) => projection.unionIds.includes(union.id))
          .flatMap((union) => union.partners.filter((partnerId) => partnerId !== personId && projection.peopleSet.has(partnerId)))
      );

      const parentSlots = pickParentSlots(personId, projection.peopleSet);
      const node = {
        id: person.id,
        name: person.name,
        titleLine: getDisplayTitle(person),
        lifeLine: getLifeLine(person),
        house: person.house || "Unknown",
        realm: person.realm || "Unknown",
        born: person.born || "Unknown",
        died: person.died || "Unknown",
        kindred: person.kindred || "Unknown",
        groupsText: (person.groups || []).join(", "),
        bio: person.bio || "",
        photo: getPortrait(person),
        sortOrder: person.order ?? Number.MAX_SAFE_INTEGER,
        recordType: person.recordType || "person",
        placeholder: person.isPlaceholder ? "Yes" : "No",
        tags: person.groups || []
      };

      if (partnerIds.length > 0) node.pids = partnerIds;
      if (parentSlots.fid) node.fid = parentSlots.fid;
      if (parentSlots.mid) node.mid = parentSlots.mid;
      if (person.sex === "male" || person.sex === "female") node.gender = person.sex;

      return node;
    });
  }

  function getInitialViewId() {
    const params = new URLSearchParams(window.location.search);
    const requestedView = params.get("view");
    return data.views[requestedView] ? requestedView : data.defaults.initialView;
  }

  function syncViewQueryParam(viewId) {
    const url = new URL(window.location.href);
    url.searchParams.set("view", viewId);
    window.history.replaceState({}, "", url);
  }

  function populateViewSelect() {
    Object.entries(data.views).forEach(([viewId, view]) => {
      const option = document.createElement("option");
      option.value = viewId;
      option.textContent = view.label;
      viewSelect.appendChild(option);
    });
  }

  function destroyTreeDom() {
    treeHost.innerHTML = "";
    family = null;
  }

  function hideEmptyState() {
    emptyState.classList.add("hidden");
  }

  function showEmptyState(view) {
    const fallback = view.emptyState || {
      title: `${view.label} is ready`,
      body: "This view does not have any lineage records yet. Add people and unions to the canonical dataset to populate it."
    };

    emptyTitle.textContent = fallback.title;
    emptyBody.textContent = fallback.body;
    emptyState.classList.remove("hidden");
  }

  function createFamilyTree(roots) {
    const tree = new FamilyTree(treeHost, {
      mode: "dark",
      sticky: false,
      enableSearch: true,
      miniMap: true,
      mouseScrool: FamilyTree.action.zoom,
      nodeMouseClick: FamilyTree.action.none,
      nodeMouseDbClick: FamilyTree.action.none,
      scaleInitial: FamilyTree.match ? FamilyTree.match.boundary : 1,
      template: "ana",
      toolbar: {
        zoom: true,
        fit: true,
        expandAll: true,
        fullScreen: true,
        layout: false
      },
      roots: roots.length > 0 ? roots : null,
      orderBy: "sortOrder",
      searchFields: ["name", "titleLine", "kindred", "house", "realm", "groupsText"],
      searchDisplayField: "name",
      searchFieldsWeight: {
        name: 100,
        titleLine: 60,
        house: 50,
        realm: 40,
        kindred: 35,
        groupsText: 20
      },
      searchFieldsAbbreviation: {
        titleLine: "Title",
        groupsText: "Groups"
      },
      nodeBinding: {
        field_0: "name",
        field_1: "titleLine",
        field_2: "lifeLine",
        img_0: "photo"
      },
      nodes: []
    });

    tree.on("click", (sender, args) => {
      if (!args || !args.node) return false;
      showCharacterSheet(args.node.id);
      return false;
    });

    tree.on("dbclick", (sender, args) => {
      if (!args || !args.node) return false;
      sender.center(args.node.id);
      return false;
    });

    return tree;
  }

  function updateViewChrome(projection) {
    const { view } = projection;
    viewTitle.textContent = view.label;
    viewDescription.textContent = view.description;
    viewStats.textContent = projection.empty
      ? "No lineage records loaded in this view yet."
      : `${projection.peopleIds.length} profiles | ${projection.unionIds.length} unions`;
  }

  function renderView(viewId) {
    clearError();
    hideCharacterSheet();

    const projection = projectView(viewId);
    const view = projection.view;

    viewSelect.value = viewId;
    updateViewChrome(projection);
    syncViewQueryParam(viewId);

    if (projection.empty) {
      destroyTreeDom();
      showEmptyState(view);
      return;
    }

    hideEmptyState();

    const nodes = buildBalkanNodes(projection);

    if (!family) {
      family = createFamilyTree(projection.roots);
    }

    family.config.roots = projection.roots.length > 0 ? projection.roots : null;
    family.load(nodes, () => {
      family.fit();
    });
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

    const parentUnionId = indexes.parentUnionByChild.get(personId);
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

  function hideCharacterSheet() {
    characterSheet.classList.add("hidden");
  }

  function init() {
    if (!window.FamilyTree) {
      renderError("The Balkan FamilyTree library did not load.");
      return;
    }

    try {
      indexes = buildIndexes();
      populateViewSelect();

      viewSelect.addEventListener("change", (event) => {
        renderView(event.target.value);
      });

      resetViewButton.addEventListener("click", () => {
        if (family) {
          family.fit();
        }
      });

      backToTreeButton.addEventListener("click", hideCharacterSheet);

      characterSheet.addEventListener("click", (event) => {
        if (event.target === characterSheet) {
          hideCharacterSheet();
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          hideCharacterSheet();
        }
      });

      renderView(getInitialViewId());
    } catch (error) {
      renderError(error instanceof Error ? error.message : String(error));
    }
  }

  init();
})();

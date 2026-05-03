(function () {
  const data = window.FAMILY_TREE_DATA;
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
  const characterSheet = document.getElementById("character-sheet");
  const backToTreeButton = document.getElementById("back-to-tree");
  const characterSheetContent = document.getElementById("character-sheet-content");

  const cardWidth = 210;
  const cardHeight = 126;
  const portraitRadius = 32;
  const unionNodeSize = 18;
  const coupleGap = 46;
  const siblingBarMinGapToChild = 10;
  const siblingBarMinDropFromParents = 18;
  const siblingBarDropFactor = 0.7;
  const minimapWidth = 220;
  const minimapHeight = 140;
  const minimapPadding = 10;

  const elk = window.ELK ? new window.ELK() : null;

  const state = {
    indexes: null,
    currentViewId: null,
    currentRawProjection: null,
    currentProjection: null,
    currentLayout: null,
    currentTransform: { x: 0, y: 0, k: 1 },
    collapsedIds: new Set(),
    pendingFocus: null,
    renderRevision: 0,
    minimapMetrics: null,
    scene: null,
    activePersonId: null
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

  function getPersonById(personId) {
    return data.people[personId] || null;
  }

  function getUnionById(unionId) {
    return state.indexes.unionById.get(unionId) || null;
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

      if (union.partnerOrder !== undefined && !Array.isArray(union.partnerOrder)) {
        errors.push(`union "${union.id}".partnerOrder must be an array when provided.`);
      }

      if (union.childOrder !== undefined && !Array.isArray(union.childOrder)) {
        errors.push(`union "${union.id}".childOrder must be an array when provided.`);
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
          "elk.layered.spacing.nodeNodeBetweenLayers": "15",
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
      box.left = box.x;
      box.top = box.y;
      box.right = box.x + box.width;
      box.bottom = box.y + box.height;
      box.centerX = box.x + box.width / 2;
      box.centerY = box.y + box.height / 2;
      return box;
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

    function getVisibleParentUnionId(personId) {
      const parentUnionId = state.indexes.parentUnionByChild.get(personId);
      if (!parentUnionId || !projection.unionIdSet.has(parentUnionId)) {
        return null;
      }

      return parentUnionId;
    }

    function getAnchoredPartnerIds(union) {
      return union.visiblePartners.filter((partnerId) => Boolean(getVisibleParentUnionId(partnerId)));
    }

    function getOrderedPartnerBoxes(union, partnerById) {
      return union.visiblePartners
        .map((partnerId) => partnerById.get(partnerId))
        .filter(Boolean);
    }

    function hasVisibleCoupleElsewhere(personId, excludingUnionId) {
      return getPartnerUnions(personId).some((union) => (
        union.id !== excludingUnionId
        && projection.unionIdSet.has(union.id)
        && union.partners.filter((partnerId) => projection.peopleSet.has(partnerId)).length > 1
      ));
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
            ? anchorBox.left - spouseBox.width - coupleGap
            : anchorBox.right + coupleGap;
          syncBox(spouseBox);
          syncBox(anchorBox);
          return partners;
        }
      }

      assignOrderedX(partners);
      enforceMinimumPartnerGap(union, partnerById, anchoredPartnerIds);
      return partners;
    }

    function positionPartnersForLockedChild(union, partners, child) {
      if (partners.length === 0) {
        return partners;
      }

      const partnerById = new Map(partners.map((partner) => [partner.id, partner]));
      const orderedPartners = getOrderedPartnerBoxes(union, partnerById);
      const anchoredPartnerIds = getAnchoredPartnerIds(union);

      if (partners.length === 1) {
        const parent = partners[0];
        parent.x = child.centerX - parent.width / 2;
        syncBox(parent);
        return partners;
      }

      if (partners.length === 2 && anchoredPartnerIds.length === 1) {
        const anchorId = anchoredPartnerIds[0];
        const anchorBox = partnerById.get(anchorId);
        const spouseBox = orderedPartners.find((partner) => partner.id !== anchorId);

        if (anchorBox && spouseBox) {
          const anchorIndex = orderedPartners.indexOf(anchorBox);
          const spouseIndex = orderedPartners.indexOf(spouseBox);
          const direction = spouseIndex < anchorIndex ? -1 : 1;
          const desiredSpouseCenterX = child.centerX * 2 - anchorBox.centerX;

          spouseBox.y = anchorBox.y;
          spouseBox.x = desiredSpouseCenterX - spouseBox.width / 2;
          spouseBox.x = direction < 0
            ? Math.min(spouseBox.x, anchorBox.left - spouseBox.width - coupleGap)
            : Math.max(spouseBox.x, anchorBox.right + coupleGap);
          syncBox(spouseBox);
          enforceMinimumPartnerGap(union, partnerById, anchoredPartnerIds);
          return partners;
        }
      }

      positionPartnersForUnion(union, partners);
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

      const firstChildTop = union.children.length > 0 ? Math.min(...union.children.map((child) => child.top)) : null;
      union.branchY = firstChildTop === null
        ? null
        : Math.min(
            firstChildTop - siblingBarMinGapToChild,
            union.spouseLineY + Math.max(siblingBarMinDropFromParents, (firstChildTop - union.spouseLineY) * siblingBarDropFactor)
          );
      union.symbolX = union.anchorX;
      union.symbolY = union.spouseLineY;
      return union;
    }

    const unions = unionInfos.map((union) => {
      const partners = union.visiblePartners
        .map((partnerId) => people.get(partnerId))
        .filter(Boolean);

      const children = union.visibleChildren
        .map((childId) => people.get(childId))
        .filter(Boolean);

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

      if (children.length === 1) {
        const onlyChild = children[0];
        onlyChild.x = anchorX - onlyChild.width / 2;
        syncBox(onlyChild);
      }

      if (children.length > 1) {
        const leftChild = children[0];
        const rightChild = children[children.length - 1];
        const currentMidpoint = (leftChild.centerX + rightChild.centerX) / 2;
        const shiftX = anchorX - currentMidpoint;

        children.forEach((child) => {
          child.x += shiftX;
          syncBox(child);
        });
      }

      const firstChildTop = children.length > 0 ? Math.min(...children.map((child) => child.top)) : null;
      const branchY = firstChildTop === null
        ? null
        : Math.min(
            firstChildTop - siblingBarMinGapToChild,
            spouseLineY + Math.max(siblingBarMinDropFromParents, (firstChildTop - spouseLineY) * siblingBarDropFactor)
          );

      return {
        id: union.id,
        label: union.label,
        partners,
        children,
        spouseLineY,
        anchorX,
        branchY,
        symbolX: anchorX,
        symbolY: spouseLineY
      };
    });

    for (let index = unions.length - 1; index >= 0; index -= 1) {
      const union = unions[index];
      const lockedChild = union.children.length === 1 && hasVisibleCoupleElsewhere(union.children[0].id, union.id)
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
    return normalizeLayout(layoutResult, projection, unionInfos);
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
      const { partners, children, spouseLineY, anchorX, branchY } = union;

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
          x1: anchorX,
          y1: spouseLineY,
          x2: child.centerX,
          y2: child.top
        });

        return;
      }

      const leftChild = children[0];
      const rightChild = children[children.length - 1];

      descentLines.push({
        id: `${union.id}-stem`,
        x1: anchorX,
        y1: spouseLineY,
        x2: anchorX,
        y2: branchY
      });

      if (leftChild.centerX < anchorX) {
        descentLines.push({
          id: `${union.id}-branch-left`,
          x1: leftChild.centerX,
          y1: branchY,
          x2: anchorX,
          y2: branchY
        });
      }

      if (rightChild.centerX > anchorX) {
        descentLines.push({
          id: `${union.id}-branch-right`,
          x1: anchorX,
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

  function renderScene(layout, projection, rawProjection) {
    clearScene();

    const { spouseLines, descentLines } = buildConnectorPaths(layout);
    const nodeData = projection.peopleIds
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

    updateActiveNodeSelection();
    updateMinimap(layout, projection);
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

  function init() {
    if (!window.d3) {
      renderError("D3 did not load, so the custom family tree renderer cannot start.");
      return;
    }

    if (!elk) {
      renderError("ELK did not load, so the custom family tree layout engine cannot start.");
      return;
    }

    try {
      state.indexes = buildIndexes();
      state.scene = initializeScene();
      populateViewSelect();
      initMinimapInteractions();

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

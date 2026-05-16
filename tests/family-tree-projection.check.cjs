const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const familyTreeDir = path.join(repoRoot, "family_tree");
const dataPath = path.join(familyTreeDir, "elves_men", "family_tree_data.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const people = data.people || {};
const unions = Array.isArray(data.unions) ? data.unions : [];
const views = data.views || {};

const partnerUnionsByPerson = new Map();
const parentUnionByChild = new Map();

unions.forEach((union) => {
  (union.partners || []).forEach((personId) => {
    if (!partnerUnionsByPerson.has(personId)) {
      partnerUnionsByPerson.set(personId, []);
    }

    partnerUnionsByPerson.get(personId).push(union);
  });

  (union.children || []).forEach((personId) => {
    parentUnionByChild.set(personId, union);
  });
});

function getPersonById(personId) {
  return people[personId] || null;
}

function projectView(viewId) {
  const view = views[viewId];
  assert.ok(view, `Missing family tree view "${viewId}".`);

  const stateByPerson = new Map();
  const queue = [];
  let queueIndex = 0;

  function enqueue(personId, nextState) {
    if (!getPersonById(personId)) return;

    let record = stateByPerson.get(personId);
    let changed = false;

    if (!record) {
      record = {
        up: -1,
        down: -1,
        traverseSpouses: false,
        expandSpouseLineage: false
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

  (view.seeds || []).forEach((seedId) => {
    enqueue(seedId, {
      up: view.generationsUp ?? 0,
      down: view.generationsDown ?? 0,
      traverseSpouses: Boolean(view.includeSpouses),
      expandSpouseLineage: Boolean(view.includeSpouseLineage)
    });
  });

  while (queueIndex < queue.length) {
    const current = queue[queueIndex++];
    const partnerUnions = partnerUnionsByPerson.get(current.personId) || [];

    if (current.traverseSpouses) {
      partnerUnions.forEach((union) => {
        union.partners.forEach((partnerId) => {
          if (partnerId === current.personId) return;

          enqueue(partnerId, {
            up: current.expandSpouseLineage ? current.up : 0,
            down: current.expandSpouseLineage ? current.down : 0,
            traverseSpouses: false,
            expandSpouseLineage: false
          });
        });
      });
    }

    if (current.down > 0) {
      partnerUnions.forEach((union) => {
        union.children.forEach((childId) => {
          enqueue(childId, {
            up: 0,
            down: current.down - 1,
            traverseSpouses: Boolean(view.includeSpouses),
            expandSpouseLineage: false
          });
        });
      });
    }

    if (current.up > 0) {
      const parentUnion = parentUnionByChild.get(current.personId);

      if (parentUnion) {
        parentUnion.partners.forEach((parentId) => {
          enqueue(parentId, {
            up: current.up - 1,
            down: 0,
            traverseSpouses: Boolean(view.includeSpouses),
            expandSpouseLineage: false
          });
        });

        if (view.includeSiblingBranches) {
          parentUnion.children.forEach((siblingId) => {
            if (siblingId === current.personId) return;

            enqueue(siblingId, {
              up: 0,
              down: view.generationsDown ?? 0,
              traverseSpouses: Boolean(view.includeSpouses),
              expandSpouseLineage: false
            });
          });
        }
      }
    }
  }

  return new Set(stateByPerson.keys());
}

function findAncestorPath(startId, targetId) {
  const queue = [[startId]];
  const seen = new Set([startId]);

  while (queue.length > 0) {
    const pathIds = queue.shift();
    const currentId = pathIds[pathIds.length - 1];

    if (currentId === targetId) {
      return pathIds;
    }

    const parentUnion = parentUnionByChild.get(currentId);
    if (!parentUnion) continue;

    parentUnion.partners.forEach((parentId) => {
      if (seen.has(parentId)) return;
      if (!getPersonById(parentId)) return;

      seen.add(parentId);
      queue.push([...pathIds, parentId]);
    });
  }

  return null;
}

function assertPathContainsInOrder(pathIds, expectedIds, label) {
  let searchIndex = 0;

  expectedIds.forEach((expectedId) => {
    const nextIndex = pathIds.indexOf(expectedId, searchIndex);
    assert.notEqual(
      nextIndex,
      -1,
      `${label} should include "${expectedId}" after "${pathIds[searchIndex - 1] || pathIds[0]}".`
    );
    searchIndex = nextIndex + 1;
  });
}

test("all_lineages projection retains the key Aragorn lineage anchors", () => {
  const projectedPeople = projectView("all_lineages");

  [
    "eldarion",
    "aragorn_second",
    "arwen",
    "arvedui",
    "firiel",
    "ondoher",
    "anárion",
    "elendil",
    "elros",
    "valandil_lord_of_andúnië"
  ].forEach((personId) => {
    assert.ok(
      projectedPeople.has(personId),
      `all_lineages should include "${personId}" in the projected view.`
    );
  });
});

test("Aragorn's ancestry still crosses the Gondor bridge through Firiel", () => {
  const pathIds = findAncestorPath("aragorn_second", "anárion");

  assert.ok(pathIds, 'Expected to find an ancestry path from "aragorn_second" to "anárion".');
  assertPathContainsInOrder(
    pathIds,
    ["aranarth", "firiel", "ondoher", "anárion"],
    'Aragorn to Anárion ancestry path'
  );
});

test("Aragorn's ancestry can still reach the first Lord of Andunie", () => {
  const pathIds = findAncestorPath("aragorn_second", "valandil_lord_of_andúnië");

  assert.ok(
    pathIds,
    'Expected to find an ancestry path from "aragorn_second" to "valandil_lord_of_andúnië".'
  );
  assertPathContainsInOrder(
    pathIds,
    ["arvedui", "elendil", "amandil", "valandil_lord_of_andúnië"],
    'Aragorn to the first Lord of Andunie ancestry path'
  );
});

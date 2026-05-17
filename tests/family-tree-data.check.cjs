const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { buildElvesMenFamilyTreeData } = require("../tools/build_elves_men_family_tree.cjs");
const { buildHobbitFamilyTreeData } = require("../tools/build_hobbit_family_tree.cjs");

const repoRoot = path.resolve(__dirname, "..");
const familyTreeDir = path.join(repoRoot, "family_tree");
const manifestPath = path.join(familyTreeDir, "family_tree_manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

function loadJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(familyTreeDir, relativePath), "utf8"));
}

const familyTreeGroups = Object.entries(manifest.familyGroups || {}).map(([groupId, group]) => ({
  groupId,
  group,
  data: loadJson(group.dataUrl),
  layouts: loadJson(group.layoutsUrl)
}));

function expectNoErrors(errors) {
  assert.equal(errors.length, 0, errors.join("\n"));
}

function countValues(values) {
  const counts = new Map();

  values.forEach((value) => {
    counts.set(value, (counts.get(value) || 0) + 1);
  });

  return counts;
}

function findDuplicates(values) {
  return Array.from(countValues(values).entries())
    .filter(([, count]) => count > 1)
    .map(([value]) => value);
}

test("family tree manifest points at existing group files", () => {
  const errors = [];
  const defaultGroupId = manifest.defaults?.initialFamilyGroup;

  if (!defaultGroupId || !manifest.familyGroups?.[defaultGroupId]) {
    errors.push(`defaults.initialFamilyGroup references missing family group "${defaultGroupId}".`);
  }

  Object.entries(manifest.familyGroups || {}).forEach(([groupId, group]) => {
    if (!group.label) {
      errors.push(`familyGroups.${groupId}.label is required.`);
    }

    if (!group.defaultView) {
      errors.push(`familyGroups.${groupId}.defaultView is required.`);
    }

    [
      ["dataUrl", group.dataUrl],
      ["layoutsUrl", group.layoutsUrl]
    ].forEach(([fieldName, relativePath]) => {
      if (!relativePath) {
        errors.push(`familyGroups.${groupId}.${fieldName} is required.`);
        return;
      }

      const targetPath = path.resolve(familyTreeDir, relativePath);
      const relativeTarget = path.relative(familyTreeDir, targetPath);
      if (relativeTarget.startsWith("..") || path.isAbsolute(relativeTarget)) {
        errors.push(`familyGroups.${groupId}.${fieldName} points outside family_tree: "${relativePath}".`);
        return;
      }

      if (!fs.existsSync(targetPath)) {
        errors.push(`familyGroups.${groupId}.${fieldName} is missing: "${relativePath}".`);
      }
    });
  });

  expectNoErrors(errors);
});

test("generated Hobbit family tree data matches source files", () => {
  assert.deepEqual(loadJson("hobbits/family_tree_data.json"), buildHobbitFamilyTreeData());
});

test("generated Elves/Men family tree data matches source files", () => {
  assert.deepEqual(loadJson("elves_men/family_tree_data.json"), buildElvesMenFamilyTreeData());
});

familyTreeGroups.forEach(({ groupId, group, data, layouts }) => {
  const people = data.people || {};
  const peopleIds = new Set(Object.keys(people));
  const unions = Array.isArray(data.unions) ? data.unions : [];
  const views = data.views || {};
  const layoutViews = layouts.views || {};

  test(`family tree person records have matching unique IDs (${groupId})`, () => {
    const errors = [];
    const idValues = [];

    Object.entries(people).forEach(([personId, person]) => {
      if (!person || typeof person !== "object") {
        errors.push(`people.${personId} must be an object.`);
        return;
      }

      if (!person.id) {
        errors.push(`people.${personId}.id is required.`);
        return;
      }

      idValues.push(person.id);

      if (person.id !== personId) {
        errors.push(`people.${personId}.id must match its object key, but found "${person.id}".`);
      }

      if (!person.name) {
        errors.push(`people.${personId}.name is required.`);
      }
    });

    findDuplicates(idValues).forEach((personId) => {
      errors.push(`person id "${personId}" is duplicated across people records.`);
    });

    expectNoErrors(errors);
  });

  test(`family tree unions have unique IDs and valid person references (${groupId})`, () => {
    const errors = [];
    const unionIds = [];

    unions.forEach((union, index) => {
      const unionLabel = union?.id || `unions[${index}]`;

      if (!union || typeof union !== "object") {
        errors.push(`unions[${index}] must be an object.`);
        return;
      }

      if (!union.id) {
        errors.push(`unions[${index}].id is required.`);
      } else {
        unionIds.push(union.id);
      }

      const partners = Array.isArray(union.partners) ? union.partners : [];
      const children = Array.isArray(union.children) ? union.children : [];

      if (!Array.isArray(union.partners) || partners.length === 0) {
        errors.push(`${unionLabel}.partners must be a non-empty array.`);
      }

      if (!Array.isArray(union.children)) {
        errors.push(`${unionLabel}.children must be an array.`);
      }

      findDuplicates(partners).forEach((personId) => {
        errors.push(`${unionLabel}.partners contains duplicate person "${personId}".`);
      });

      findDuplicates(children).forEach((personId) => {
        errors.push(`${unionLabel}.children contains duplicate person "${personId}".`);
      });

      partners.forEach((personId) => {
        if (!peopleIds.has(personId)) {
          errors.push(`${unionLabel}.partners references missing person "${personId}".`);
        }
      });

      children.forEach((personId) => {
        if (!peopleIds.has(personId)) {
          errors.push(`${unionLabel}.children references missing person "${personId}".`);
        }
      });

      if (union.lineagePartner && !partners.includes(union.lineagePartner)) {
        errors.push(`${unionLabel}.lineagePartner references non-partner "${union.lineagePartner}".`);
      }

      if (union.lineageChild && !children.includes(union.lineageChild)) {
        errors.push(`${unionLabel}.lineageChild references non-child "${union.lineageChild}".`);
      }

      (union.partnerOrder || []).forEach((personId) => {
        if (!partners.includes(personId)) {
          errors.push(`${unionLabel}.partnerOrder references non-partner "${personId}".`);
        }
      });

      (union.childOrder || []).forEach((personId) => {
        if (!children.includes(personId)) {
          errors.push(`${unionLabel}.childOrder references non-child "${personId}".`);
        }
      });
    });

    findDuplicates(unionIds).forEach((unionId) => {
      errors.push(`union id "${unionId}" is duplicated.`);
    });

    expectNoErrors(errors);
  });

  test(`family tree views reference existing people (${groupId})`, () => {
    const errors = [];
    const initialView = data.defaults?.initialView;

    if (!initialView || !views[initialView]) {
      errors.push(`defaults.initialView references missing view "${initialView}".`);
    }

    if (group.defaultView && !views[group.defaultView]) {
      errors.push(`manifest defaultView references missing view "${group.defaultView}".`);
    }

    Object.entries(views).forEach(([viewId, view]) => {
      if (view.layoutView && !views[view.layoutView]) {
        errors.push(`views.${viewId}.layoutView references missing view "${view.layoutView}".`);
      }

      [
        ["seeds", view.seeds || []],
        ["roots", view.roots || []],
        ["filters.includePersonIds", view.filters?.includePersonIds || []],
        ["filters.excludePersonIds", view.filters?.excludePersonIds || []],
        ["filters.alwaysInclude", view.filters?.alwaysInclude || []]
      ].forEach(([fieldName, personIds]) => {
        if (!Array.isArray(personIds)) {
          errors.push(`views.${viewId}.${fieldName} must be an array when provided.`);
          return;
        }

        personIds.forEach((personId) => {
          if (!peopleIds.has(personId)) {
            errors.push(`views.${viewId}.${fieldName} references missing person "${personId}".`);
          }
        });
      });
    });

    expectNoErrors(errors);
  });

  test(`family tree layout positions reference existing people (${groupId})`, () => {
    const errors = [];

    Object.entries(layoutViews).forEach(([viewId, viewLayout]) => {
      if (!views[viewId]) {
        errors.push(`layouts.views.${viewId} references missing data view "${viewId}".`);
      }

      const positions = viewLayout.positions || {};
      if (!positions || typeof positions !== "object" || Array.isArray(positions)) {
        errors.push(`layouts.views.${viewId}.positions must be an object when provided.`);
        return;
      }

      Object.entries(positions).forEach(([personId, position]) => {
        if (!peopleIds.has(personId)) {
          errors.push(`layouts.views.${viewId}.positions references missing person "${personId}".`);
        }

        if (!position || typeof position !== "object" || Array.isArray(position)) {
          errors.push(`layouts.views.${viewId}.positions.${personId} must be an object.`);
          return;
        }

        ["x", "y"].forEach((axis) => {
          if (!Number.isFinite(position[axis])) {
            errors.push(`layouts.views.${viewId}.positions.${personId}.${axis} must be a finite number.`);
          }
        });
      });
    });

    expectNoErrors(errors);
  });

  test(`family tree layout annotations reference existing people (${groupId})`, () => {
    const errors = [];

    Object.entries(layoutViews).forEach(([viewId, viewLayout]) => {
      if (!views[viewId]) {
        errors.push(`layouts.views.${viewId} references missing data view "${viewId}".`);
      }

      const annotations = viewLayout.annotations || [];
      if (!Array.isArray(annotations)) {
        errors.push(`layouts.views.${viewId}.annotations must be an array when provided.`);
        return;
      }

      const annotationIds = [];

      annotations.forEach((annotation, index) => {
        const annotationLabel = annotation?.id || `layouts.views.${viewId}.annotations[${index}]`;

        if (!annotation || typeof annotation !== "object") {
          errors.push(`layouts.views.${viewId}.annotations[${index}] must be an object.`);
          return;
        }

        if (!annotation.id) {
          errors.push(`layouts.views.${viewId}.annotations[${index}].id is required.`);
        } else {
          annotationIds.push(annotation.id);
        }

        if (!annotation.label) {
          errors.push(`${annotationLabel}.label is required.`);
        }

        ["startPersonId", "endPersonId"].forEach((fieldName) => {
          const personId = annotation[fieldName];
          if (!personId) {
            errors.push(`${annotationLabel}.${fieldName} is required.`);
            return;
          }

          if (!peopleIds.has(personId)) {
            errors.push(`${annotationLabel}.${fieldName} references missing person "${personId}".`);
          }
        });

        if (annotation.side && !["left", "right"].includes(annotation.side)) {
          errors.push(`${annotationLabel}.side must be "left" or "right" when provided.`);
        }
      });

      findDuplicates(annotationIds).forEach((annotationId) => {
        errors.push(`layouts.views.${viewId}.annotations contains duplicate id "${annotationId}".`);
      });
    });

    expectNoErrors(errors);
  });
});

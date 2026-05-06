const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const familyTreeDir = path.join(repoRoot, "family_tree");
const dataPath = path.join(familyTreeDir, "family_tree_data.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const people = data.people || {};
const peopleIds = new Set(Object.keys(people));
const unions = Array.isArray(data.unions) ? data.unions : [];
const views = data.views || {};

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

function isExternalOrDataImage(src) {
  return /^data:/i.test(src) || /^[a-z][a-z0-9+.-]*:\/\//i.test(src);
}

test("family tree person records have matching unique IDs", () => {
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

test("family tree unions have unique IDs and valid person references", () => {
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

test("family tree views reference existing people", () => {
  const errors = [];
  const initialView = data.defaults?.initialView;

  if (!initialView || !views[initialView]) {
    errors.push(`defaults.initialView references missing view "${initialView}".`);
  }

  Object.entries(views).forEach(([viewId, view]) => {
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

// test("family tree local image paths exist", () => {
//   const errors = [];

//   Object.entries(people).forEach(([personId, person]) => {
//     if (!person.image || isExternalOrDataImage(person.image)) {
//       return;
//     }

//     const imagePath = path.resolve(familyTreeDir, person.image);
//     const relativePath = path.relative(familyTreeDir, imagePath);

//     if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
//       errors.push(`people.${personId}.image points outside family_tree: "${person.image}".`);
//       return;
//     }

//     if (!fs.existsSync(imagePath)) {
//       errors.push(`people.${personId}.image is missing: ${person.image}`);
//     }
//   });

//   expectNoErrors(errors);
// });

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const elvesMenDir = path.join(repoRoot, "family_tree", "elves_men");
const sourceDir = path.join(elvesMenDir, "source");
const outputPath = path.join(elvesMenDir, "family_tree_data.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function listJsonFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(directory, entry.name))
    .sort((left, right) => path.basename(left).localeCompare(path.basename(right)));
}

function compareRecordEntries([leftId, leftRecord], [rightId, rightRecord]) {
  const leftOrder = leftRecord?.order ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = rightRecord?.order ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return String(leftId).localeCompare(String(rightId));
}

function mergePeople(files) {
  const people = {};

  files.forEach((filePath) => {
    const source = readJson(filePath);
    const sourcePeople = source.people || {};

    Object.entries(sourcePeople).forEach(([personId, person]) => {
      if (people[personId]) {
        throw new Error(`Duplicate Elves/Men person id "${personId}" in ${path.relative(repoRoot, filePath)}.`);
      }

      if (person?.id && person.id !== personId) {
        throw new Error(`Elves/Men person "${personId}" has mismatched id "${person.id}" in ${path.relative(repoRoot, filePath)}.`);
      }

      people[personId] = {
        ...person,
        id: personId
      };
    });
  });

  return Object.fromEntries(Object.entries(people).sort(compareRecordEntries));
}

function mergeUnions(files) {
  const unions = [];
  const unionIds = new Set();

  files.forEach((filePath) => {
    const source = readJson(filePath);
    const sourceUnions = source.unions || [];

    sourceUnions.forEach((union) => {
      if (!union?.id) {
        throw new Error(`Elves/Men union without an id in ${path.relative(repoRoot, filePath)}.`);
      }

      if (unionIds.has(union.id)) {
        throw new Error(`Duplicate Elves/Men union id "${union.id}" in ${path.relative(repoRoot, filePath)}.`);
      }

      unionIds.add(union.id);
      unions.push(union);
    });
  });

  return unions.sort((left, right) => {
    const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return String(left.id).localeCompare(String(right.id));
  });
}

function buildElvesMenFamilyTreeData() {
  const peopleDir = path.join(sourceDir, "people");
  const unionsDir = path.join(sourceDir, "unions");
  const viewsPath = path.join(sourceDir, "views.json");
  const viewsSource = readJson(viewsPath);

  return {
    defaults: viewsSource.defaults || {},
    people: mergePeople(listJsonFiles(peopleDir)),
    unions: mergeUnions(listJsonFiles(unionsDir)),
    views: viewsSource.views || {}
  };
}

function writeElvesMenFamilyTreeData() {
  const data = buildElvesMenFamilyTreeData();
  fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  return outputPath;
}

if (require.main === module) {
  const writtenPath = writeElvesMenFamilyTreeData();
  console.log(`Built ${path.relative(repoRoot, writtenPath)} from Elves/Men source files.`);
}

module.exports = {
  buildElvesMenFamilyTreeData,
  writeElvesMenFamilyTreeData
};

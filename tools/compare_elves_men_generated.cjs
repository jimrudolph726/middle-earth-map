const fs = require("node:fs");
const path = require("node:path");
const { buildElvesMenFamilyTreeData } = require("./build_elves_men_family_tree.cjs");

const repoRoot = path.resolve(__dirname, "..");
const productionPath = path.join(repoRoot, "family_tree", "elves_men", "family_tree_data.json");

function sortObjectKeys(value) {
  if (Array.isArray(value)) {
    return value.map(sortObjectKeys);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, sortObjectKeys(value[key])])
    );
  }

  return value;
}

function stableStringify(value) {
  return JSON.stringify(sortObjectKeys(value));
}

function mapUnionsById(unions) {
  return Object.fromEntries((unions || []).map((union) => [union.id, union]));
}

function compareObjectRecords(label, productionRecords, generatedRecords, errors) {
  const productionIds = Object.keys(productionRecords || {}).sort();
  const generatedIds = Object.keys(generatedRecords || {}).sort();
  const missingIds = productionIds.filter((id) => !generatedRecords[id]);
  const extraIds = generatedIds.filter((id) => !productionRecords[id]);
  const changedIds = productionIds
    .filter((id) => generatedRecords[id])
    .filter((id) => stableStringify(productionRecords[id]) !== stableStringify(generatedRecords[id]));

  if (missingIds.length > 0) {
    errors.push(`${label} missing from generated data: ${missingIds.join(", ")}`);
  }

  if (extraIds.length > 0) {
    errors.push(`${label} extra in generated data: ${extraIds.join(", ")}`);
  }

  if (changedIds.length > 0) {
    errors.push(`${label} changed in generated data: ${changedIds.slice(0, 20).join(", ")}${changedIds.length > 20 ? `, ...and ${changedIds.length - 20} more` : ""}`);
  }
}

function main() {
  const production = JSON.parse(fs.readFileSync(productionPath, "utf8"));
  const generated = buildElvesMenFamilyTreeData();
  const errors = [];

  if (stableStringify(production.defaults || {}) !== stableStringify(generated.defaults || {})) {
    errors.push("defaults differ.");
  }

  compareObjectRecords("people", production.people || {}, generated.people || {}, errors);
  compareObjectRecords("unions", mapUnionsById(production.unions), mapUnionsById(generated.unions), errors);

  if (stableStringify(production.views || {}) !== stableStringify(generated.views || {})) {
    errors.push("views differ.");
  }

  console.log(`Production: ${Object.keys(production.people || {}).length} people, ${(production.unions || []).length} unions.`);
  console.log(`Generated:  ${Object.keys(generated.people || {}).length} people, ${(generated.unions || []).length} unions.`);

  if (errors.length > 0) {
    console.error(errors.join("\n"));
    process.exit(1);
  }

  console.log("Generated Elves/Men data matches current production data semantically.");
}

main();

const fs = require("node:fs");
const path = require("node:path");
const { google } = require("googleapis");

const repoRoot = path.resolve(__dirname, "..");
const sourceDir = path.join(repoRoot, "family_tree", "elves_men", "source");
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.join(repoRoot, "credentials", "google-service-account.json");
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "1Wxn8uBj2Osvr_9Q8Cs8gFl_2r9cZ4DlXlC2s7JuN0Ts";
const cleanTabPrefix = process.env.CLEAN_SHEETS_PREFIX || "clean_";
const dryRun = process.argv.includes("--dry-run");

const headers = [
  "id",
  "name",
  "sex",
  "kindred",
  "groups",
  "title",
  "house",
  "realm",
  "born",
  "died",
  "image",
  "bio",
  "order",
  "union_id",
  "union_partners",
  "union_children",
  "union_label",
  "union_order",
  "cross_lineage",
  "lineagePartner",
  "lineageChild",
  "partnerGap",
  "partnerOrder",
  "childOrder"
];

const familySources = [
  "chieftains_of_the_dunedain",
  "kings_of_arthedain",
  "kings_of_arnor_line_of_isildur",
  "kings_of_gondor_line_of_anarion",
  "lords_of_andunie",
  "kings_queens_numenor",
  "cross_lineage"
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function quoteSheetName(sheetName) {
  return `'${String(sheetName).replace(/'/g, "''")}'`;
}

function cell(value) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (value === undefined || value === null) {
    return "";
  }

  return value;
}

function comparePeopleEntries([leftId, leftPerson], [rightId, rightPerson]) {
  const leftOrder = leftPerson?.order ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = rightPerson?.order ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return String(leftId).localeCompare(String(rightId));
}

function compareUnions(leftUnion, rightUnion) {
  const leftOrder = leftUnion?.order ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = rightUnion?.order ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return String(leftUnion.id).localeCompare(String(rightUnion.id));
}

function getUnionOwner(union, peopleIds) {
  const partnerOwner = (union.partners || []).find((personId) => peopleIds.has(personId));
  if (partnerOwner) {
    return partnerOwner;
  }

  return (union.children || []).find((personId) => peopleIds.has(personId)) || null;
}

function buildUnionCells(union, isCrossLineage) {
  if (!union) {
    return Array(headers.length - 13).fill("");
  }

  return [
    cell(union.id),
    cell(union.partners),
    cell(union.children),
    cell(union.label),
    cell(union.order),
    isCrossLineage ? "yes" : "",
    cell(union.lineagePartner),
    cell(union.lineageChild),
    cell(union.partnerGap),
    cell(union.partnerOrder),
    cell(union.childOrder)
  ];
}

function buildPersonCells(person) {
  return [
    cell(person.id),
    cell(person.name),
    cell(person.sex),
    cell(person.kindred),
    cell(person.groups),
    cell(person.title),
    cell(person.house),
    cell(person.realm),
    cell(person.born),
    cell(person.died),
    cell(person.image),
    cell(person.bio),
    cell(person.order)
  ];
}

function buildSheetValues(sourceName) {
  const peoplePath = path.join(sourceDir, "people", `${sourceName}.json`);
  const unionsPath = path.join(sourceDir, "unions", `${sourceName}.json`);
  const people = readJson(peoplePath).people || {};
  const unions = (readJson(unionsPath).unions || []).sort(compareUnions);
  const peopleEntries = Object.entries(people).sort(comparePeopleEntries);
  const peopleIds = new Set(peopleEntries.map(([personId]) => personId));
  const usedUnionIds = new Set();
  const unionByOwner = new Map();
  const unionOnlyRows = [];
  const isCrossLineage = sourceName === "cross_lineage";

  unions.forEach((union) => {
    const ownerId = getUnionOwner(union, peopleIds);
    if (ownerId && !unionByOwner.has(ownerId)) {
      unionByOwner.set(ownerId, union);
      usedUnionIds.add(union.id);
      return;
    }

    unionOnlyRows.push(union);
  });

  const values = [headers];

  peopleEntries.forEach(([, person]) => {
    const union = unionByOwner.get(person.id) || null;
    values.push([
      ...buildPersonCells(person),
      ...buildUnionCells(union, isCrossLineage)
    ]);
  });

  unionOnlyRows
    .filter((union) => !usedUnionIds.has(union.id))
    .forEach((union) => {
      values.push([
        ...Array(13).fill(""),
        ...buildUnionCells(union, isCrossLineage)
      ]);
    });

  return values;
}

async function getSheetsClient() {
  if (!fs.existsSync(credentialsPath)) {
    throw new Error(`Missing Google service-account credentials at ${path.relative(repoRoot, credentialsPath)}.`);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  return google.sheets({ version: "v4", auth });
}

async function getExistingSheetTitles(sheets) {
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties.title"
  });

  return new Set((response.data.sheets || []).map((sheet) => sheet.properties?.title).filter(Boolean));
}

async function ensureSheetExists(sheets, existingTitles, title, rowCount) {
  if (existingTitles.has(title)) {
    return;
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title,
              gridProperties: {
                rowCount: Math.max(rowCount + 10, 100),
                columnCount: headers.length
              }
            }
          }
        }
      ]
    }
  });

  existingTitles.add(title);
}

async function writeSheetValues(sheets, title, values) {
  const range = `${quoteSheetName(title)}!A1:X${values.length}`;

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `${quoteSheetName(title)}!A:X`
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values
    }
  });
}

async function main() {
  const tabValues = familySources.map((sourceName) => ({
    sourceName,
    title: `${cleanTabPrefix}${sourceName}`,
    values: buildSheetValues(sourceName)
  }));

  if (dryRun) {
    tabValues.forEach(({ title, values }) => {
      console.log(`${title}: ${values.length - 1} data rows`);
    });
    return;
  }

  const sheets = await getSheetsClient();
  const existingTitles = await getExistingSheetTitles(sheets);

  for (const { title, values } of tabValues) {
    await ensureSheetExists(sheets, existingTitles, title, values.length);
    await writeSheetValues(sheets, title, values);
    console.log(`Wrote ${values.length - 1} data rows to ${title}.`);
  }
}

main().catch((error) => {
  const status = error.response?.status;
  if (status === 403) {
    console.error("Google returned 403. Share the spreadsheet with the service account as an Editor, then rerun this command.");
  } else if (status === 404) {
    console.error("Google returned 404. Check the spreadsheet ID.");
  } else {
    console.error(error.message || String(error));
  }

  process.exit(1);
});

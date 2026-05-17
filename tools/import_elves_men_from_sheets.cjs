const fs = require("node:fs");
const path = require("node:path");
const { google } = require("googleapis");

const repoRoot = path.resolve(__dirname, "..");
const elvesMenDir = path.join(repoRoot, "family_tree", "elves_men");
const sourceDir = path.join(elvesMenDir, "source");
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.join(repoRoot, "credentials", "google-service-account.json");
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "1Wxn8uBj2Osvr_9Q8Cs8gFl_2r9cZ4DlXlC2s7JuN0Ts";
const cleanTabPrefix = process.env.CLEAN_SHEETS_PREFIX || "clean_";

const sourceNames = [
  "chieftains_of_the_dunedain",
  "kings_of_arthedain",
  "kings_of_arnor_line_of_isildur",
  "kings_of_gondor_line_of_anarion",
  "lords_of_andunie",
  "kings_queens_numenor",
  "cross_lineage"
];

const requiredHeaders = [
  "id",
  "name",
  "groups",
  "order",
  "union_id",
  "union_partners",
  "union_children",
  "cross_lineage"
];

const personStringFields = [
  "id",
  "name",
  "sex",
  "kindred",
  "title",
  "house",
  "realm",
  "born",
  "died",
  "image",
  "bio"
];

function quoteSheetName(sheetName) {
  return `'${String(sheetName).replace(/'/g, "''")}'`;
}

function trimCell(value) {
  return String(value ?? "").trim();
}

function normalizeHeader(header) {
  return trimCell(header);
}

function parseList(value) {
  return trimCell(value)
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseNumber(value, fieldName, rowLabel) {
  const text = trimCell(value);
  if (!text) {
    return null;
  }

  const number = Number(text);
  if (!Number.isFinite(number)) {
    throw new Error(`${rowLabel}.${fieldName} must be a number, but found "${text}".`);
  }

  return number;
}

function isYes(value) {
  return ["1", "true", "y", "yes"].includes(trimCell(value).toLowerCase());
}

function makeRowObject(headers, row) {
  return Object.fromEntries(headers.map((header, index) => [header, trimCell(row[index])]));
}

function validateHeaders(headers, sheetName) {
  requiredHeaders.forEach((header) => {
    if (!headers.includes(header)) {
      throw new Error(`${sheetName} is missing required header "${header}".`);
    }
  });
}

function buildPerson(row, rowLabel) {
  const id = trimCell(row.id);
  if (!id) {
    return null;
  }

  if (!row.name) {
    throw new Error(`${rowLabel}.name is required.`);
  }

  const person = {};
  personStringFields.forEach((fieldName) => {
    const value = trimCell(row[fieldName]);
    if (value) {
      person[fieldName] = value;
    }
  });

  const groups = parseList(row.groups);
  if (groups.length > 0) {
    person.groups = groups;
  }

  const order = parseNumber(row.order, "order", rowLabel);
  if (order !== null) {
    person.order = order;
  }

  return person;
}

function buildUnion(row, rowLabel) {
  const id = trimCell(row.union_id);
  if (!id) {
    return null;
  }

  const partners = parseList(row.union_partners);
  if (partners.length === 0) {
    throw new Error(`${rowLabel}.union_partners is required when union_id is set.`);
  }

  const union = {
    id,
    partners,
    children: parseList(row.union_children)
  };

  const label = trimCell(row.union_label);
  if (label) {
    union.label = label;
  }

  const order = parseNumber(row.union_order, "union_order", rowLabel);
  if (order !== null) {
    union.order = order;
  }

  ["lineagePartner", "lineageChild"].forEach((fieldName) => {
    const value = trimCell(row[fieldName]);
    if (value) {
      union[fieldName] = value;
    }
  });

  const partnerGap = parseNumber(row.partnerGap, "partnerGap", rowLabel);
  if (partnerGap !== null) {
    union.partnerGap = partnerGap;
  }

  [
    ["partnerOrder", "partnerOrder"],
    ["childOrder", "childOrder"]
  ].forEach(([sourceField, targetField]) => {
    const values = parseList(row[sourceField]);
    if (values.length > 0) {
      union[targetField] = values;
    }
  });

  return union;
}

function parseLayoutCell(value) {
  const raw = trimCell(value);
  if (!raw) {
    return { version: 1, views: {} };
  }

  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version && parsed?.views) {
      return parsed;
    }

    if (parsed?.positions) {
      return {
        version: 1,
        views: {
          all_lineages: parsed
        }
      };
    }
  } catch (_error) {
    // The spreadsheet currently stores the inner positions object in one cell.
  }

  const withoutTrailingComma = raw.replace(/,\s*$/, "");
  const positions = JSON.parse(`{${withoutTrailingComma}}`);
  const existingLayoutsPath = path.join(elvesMenDir, "family_tree_layouts.json");
  const existingLayouts = fs.existsSync(existingLayoutsPath)
    ? JSON.parse(fs.readFileSync(existingLayoutsPath, "utf8"))
    : { version: 1, views: {} };
  const existingAllLineages = existingLayouts.views?.all_lineages || {};

  return {
    version: 1,
    views: {
      ...existingLayouts.views,
      all_lineages: {
        ...existingAllLineages,
        positions
      }
    }
  };
}

function sortPeopleEntries([leftId, leftRecord], [rightId, rightRecord]) {
  const leftOrder = leftRecord?.order ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = rightRecord?.order ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return leftId.localeCompare(rightId);
}

function sortUnions(leftUnion, rightUnion) {
  const leftOrder = leftUnion.order ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = rightUnion.order ?? Number.MAX_SAFE_INTEGER;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return leftUnion.id.localeCompare(rightUnion.id);
}

function writeJsonFile(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function copyViewsSourceIfMissing() {
  const viewsPath = path.join(sourceDir, "views.json");
  if (fs.existsSync(viewsPath)) {
    return;
  }

  const currentDataPath = path.join(elvesMenDir, "family_tree_data.json");
  const currentData = JSON.parse(fs.readFileSync(currentDataPath, "utf8"));
  writeJsonFile(viewsPath, {
    defaults: currentData.defaults || {},
    views: currentData.views || {}
  });
}

async function getSheetsClient() {
  if (!fs.existsSync(credentialsPath)) {
    throw new Error(`Missing Google service-account credentials at ${path.relative(repoRoot, credentialsPath)}.`);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  });

  return google.sheets({ version: "v4", auth });
}

async function readRange(sheets, range) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
    valueRenderOption: "FORMATTED_VALUE"
  });

  return response.data.values || [];
}

async function importSourceTab(sheets, sourceName, unionBuckets, unionIds) {
  const sheetName = `${cleanTabPrefix}${sourceName}`;
  const rows = await readRange(sheets, `${quoteSheetName(sheetName)}!A1:X`);
  const headers = (rows[0] || []).map(normalizeHeader);
  validateHeaders(headers, sheetName);

  const people = {};
  const peopleIds = new Set();
  let unionCount = 0;

  rows.slice(1).forEach((row, rowIndex) => {
    const rowObject = makeRowObject(headers, row);
    const rowLabel = `${sheetName} row ${rowIndex + 2}`;
    const person = buildPerson(rowObject, rowLabel);

    if (person) {
      if (peopleIds.has(person.id)) {
        throw new Error(`Duplicate person id "${person.id}" in ${rowLabel}.`);
      }

      peopleIds.add(person.id);
      people[person.id] = person;
    }

    const union = buildUnion(rowObject, rowLabel);
    if (union) {
      if (unionIds.has(union.id)) {
        throw new Error(`Duplicate union id "${union.id}" in ${rowLabel}.`);
      }

      unionIds.add(union.id);
      const bucketName = isYes(rowObject.cross_lineage) ? "cross_lineage" : sourceName;
      unionBuckets[bucketName].push(union);
      unionCount += 1;
    }
  });

  writeJsonFile(path.join(sourceDir, "people", `${sourceName}.json`), {
    people: Object.fromEntries(Object.entries(people).sort(sortPeopleEntries))
  });

  return {
    sourceName,
    peopleCount: Object.keys(people).length,
    unionCount
  };
}

async function importLayouts(sheets) {
  const rows = await readRange(sheets, "'family_layouts'!A1:A1");
  const layouts = parseLayoutCell(rows[0]?.[0]);
  const outputPath = path.join(elvesMenDir, "family_tree_layouts.json");

  writeJsonFile(outputPath, layouts);
  return Object.keys(layouts.views?.all_lineages?.positions || {}).length;
}

async function main() {
  const sheets = await getSheetsClient();
  const unionBuckets = Object.fromEntries(sourceNames.map((sourceName) => [sourceName, []]));
  const unionIds = new Set();
  const summaries = [];

  copyViewsSourceIfMissing();

  for (const sourceName of sourceNames) {
    summaries.push(await importSourceTab(sheets, sourceName, unionBuckets, unionIds));
  }

  sourceNames.forEach((sourceName) => {
    writeJsonFile(path.join(sourceDir, "unions", `${sourceName}.json`), {
      unions: unionBuckets[sourceName].sort(sortUnions)
    });
  });
  const layoutPositionCount = await importLayouts(sheets);

  summaries.forEach(({ sourceName, peopleCount, unionCount }) => {
    console.log(`${cleanTabPrefix}${sourceName}: ${peopleCount} people, ${unionCount} unions`);
  });
  console.log(`Imported ${summaries.reduce((sum, summary) => sum + summary.peopleCount, 0)} Elves/Men people and ${unionIds.size} unions from clean Google Sheets tabs.`);
  console.log(`Imported ${layoutPositionCount} Elves/Men layout positions from family_layouts!A1.`);
}

main().catch((error) => {
  const status = error.response?.status;
  if (status === 403) {
    console.error("Google returned 403. Share the spreadsheet with the service account as a Viewer.");
  } else if (status === 404) {
    console.error("Google returned 404. Check the spreadsheet ID and clean tab names.");
  } else {
    console.error(error.message || String(error));
  }

  process.exit(1);
});

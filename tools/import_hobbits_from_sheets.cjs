const fs = require("node:fs");
const path = require("node:path");
const { google } = require("googleapis");

const repoRoot = path.resolve(__dirname, "..");
const hobbitsDir = path.join(repoRoot, "family_tree", "hobbits");
const sourceDir = path.join(hobbitsDir, "source");
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.join(repoRoot, "credentials", "google-service-account.json");
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "1LrzERs-G4fpw7Uuuwv5KZqyvcVXPs_VStuc1RRCzaFM";

const familyTabs = [
  {
    sheetName: "Baggins",
    sourceName: "baggins",
    peopleFile: path.join(sourceDir, "people", "baggins.json"),
    unionBucket: "baggins"
  },
  {
    sheetName: "Took",
    sourceName: "tooks",
    peopleFile: path.join(sourceDir, "people", "tooks.json"),
    unionBucket: "tooks"
  }
];

const unionFiles = {
  baggins: path.join(sourceDir, "unions", "baggins.json"),
  tooks: path.join(sourceDir, "unions", "tooks.json"),
  cross_family: path.join(sourceDir, "unions", "cross_family.json")
};

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

function readJsonCredentialsEmail() {
  try {
    return JSON.parse(fs.readFileSync(credentialsPath, "utf8")).client_email;
  } catch (_error) {
    return "the service account email in credentials/google-service-account.json";
  }
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
  [
    "id",
    "name",
    "groups",
    "order",
    "union_id",
    "union_partners",
    "union_children",
    "cross_family"
  ].forEach((header) => {
    if (!headers.includes(header)) {
      throw new Error(`${sheetName} is missing required header "${header}".`);
    }
  });
}

function buildPerson(row, rowLabel) {
  const id = row.id;
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
          all_hobbit_families: parsed
        }
      };
    }
  } catch (_error) {
    // The spreadsheet can store just the inner positions object, so try that below.
  }

  const withoutTrailingComma = raw.replace(/,\s*$/, "");
  const positions = JSON.parse(`{${withoutTrailingComma}}`);
  return {
    version: 1,
    views: {
      all_hobbit_families: {
        positions
      }
    }
  };
}

function sortPeopleEntries([leftId, leftPerson], [rightId, rightPerson]) {
  const leftOrder = leftPerson.order ?? Number.MAX_SAFE_INTEGER;
  const rightOrder = rightPerson.order ?? Number.MAX_SAFE_INTEGER;

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

async function importFamilyTab(sheets, tabConfig, unionBuckets, unionIds) {
  const rows = await readRange(sheets, `${quoteSheetName(tabConfig.sheetName)}!A1:X`);
  const headers = (rows[0] || []).map(normalizeHeader);
  validateHeaders(headers, tabConfig.sheetName);

  const people = {};
  const peopleIds = new Set();

  rows.slice(1).forEach((row, rowIndex) => {
    const rowObject = makeRowObject(headers, row);
    const rowLabel = `${tabConfig.sheetName} row ${rowIndex + 2}`;
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
      const bucketName = isYes(rowObject.cross_family) ? "cross_family" : tabConfig.unionBucket;
      unionBuckets[bucketName].push(union);
    }
  });

  writeJsonFile(tabConfig.peopleFile, {
    people: Object.fromEntries(Object.entries(people).sort(sortPeopleEntries))
  });

  return Object.keys(people).length;
}

async function importLayouts(sheets) {
  const rows = await readRange(sheets, "'family_layouts'!A1:A1");
  const layout = parseLayoutCell(rows[0]?.[0]);
  const outputPath = path.join(hobbitsDir, "family_tree_layouts.json");

  writeJsonFile(outputPath, layout);
  return Object.keys(layout.views?.all_hobbit_families?.positions || {}).length;
}

async function main() {
  const sheets = await getSheetsClient();
  const unionBuckets = Object.fromEntries(Object.keys(unionFiles).map((bucketName) => [bucketName, []]));
  const unionIds = new Set();
  let personCount = 0;

  try {
    for (const tabConfig of familyTabs) {
      personCount += await importFamilyTab(sheets, tabConfig, unionBuckets, unionIds);
    }

    Object.entries(unionFiles).forEach(([bucketName, filePath]) => {
      writeJsonFile(filePath, {
        unions: unionBuckets[bucketName].sort(sortUnions)
      });
    });

    const layoutPositionCount = await importLayouts(sheets);

    console.log(`Imported ${personCount} Hobbit people, ${unionIds.size} unions, and ${layoutPositionCount} layout positions from Google Sheets.`);
  } catch (error) {
    const status = error.response?.status;
    if (status === 403) {
      console.error(`Google returned 403. Share the spreadsheet with ${readJsonCredentialsEmail()} as a Viewer.`);
    } else if (status === 404) {
      console.error("Google returned 404. Check the spreadsheet ID and tab names.");
    } else {
      console.error(error.message || String(error));
    }

    process.exit(1);
  }
}

main();

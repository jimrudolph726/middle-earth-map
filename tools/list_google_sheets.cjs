const fs = require("node:fs");
const path = require("node:path");
const { google } = require("googleapis");

const repoRoot = path.resolve(__dirname, "..");
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.join(repoRoot, "credentials", "google-service-account.json");
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

async function main() {
  if (!spreadsheetId) {
    console.error("Missing GOOGLE_SHEETS_SPREADSHEET_ID.");
    process.exit(1);
  }

  if (!fs.existsSync(credentialsPath)) {
    console.error(`Missing Google service-account credentials: ${path.relative(repoRoot, credentialsPath)}`);
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: credentialsPath,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  });

  const sheets = google.sheets({ version: "v4", auth });
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties(sheetId,title,gridProperties(rowCount,columnCount))"
  });

  (response.data.sheets || []).forEach((sheet) => {
    const props = sheet.properties || {};
    const grid = props.gridProperties || {};
    console.log(`${props.title}\t${props.sheetId}\t${grid.rowCount || 0} rows\t${grid.columnCount || 0} cols`);
  });
}

main().catch((error) => {
  console.error(error.message || String(error));
  process.exit(1);
});

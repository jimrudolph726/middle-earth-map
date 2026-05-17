const fs = require("node:fs");
const path = require("node:path");
const { google } = require("googleapis");

const repoRoot = path.resolve(__dirname, "..");
const defaultCredentialsPath = path.join(repoRoot, "credentials", "google-service-account.json");
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || process.env.SHEET_ID;
const range = process.env.GOOGLE_SHEETS_RANGE || process.argv[2] || "A1:Z5";
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || defaultCredentialsPath;

function getServiceAccountEmail() {
  try {
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
    return credentials.client_email || "the service account email in your credentials file";
  } catch (_error) {
    return "the service account email in your credentials file";
  }
}

async function main() {
  if (!spreadsheetId) {
    console.error("Missing GOOGLE_SHEETS_SPREADSHEET_ID.");
    console.error("PowerShell example:");
    console.error("$env:GOOGLE_SHEETS_SPREADSHEET_ID='your-sheet-id'; npm run sheets:check -- \"Sheet1!A1:Z5\"");
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

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range
    });

    const values = response.data.values || [];
    console.log(`Read ${values.length} rows from ${range}.`);

    values.forEach((row, index) => {
      console.log(`${index + 1}: ${row.join(" | ")}`);
    });
  } catch (error) {
    const status = error.response?.status;
    const message = error.message || String(error);
    if (message.includes("must not be an Office file")) {
      console.error("Google can see the file, but it is still an Office/Excel file.");
      console.error("Open it in Google Drive, then use File > Save as Google Sheets. Share the new native Sheet with the service account and rerun this command with the new spreadsheet ID.");
    } else if (status === 403) {
      console.error(`Google returned 403. Share the spreadsheet with ${getServiceAccountEmail()} as a Viewer.`);
    } else if (status === 404) {
      console.error("Google returned 404. Check that GOOGLE_SHEETS_SPREADSHEET_ID is the spreadsheet ID, not the full URL.");
    } else {
      console.error(message);
    }

    process.exit(1);
  }
}

main();

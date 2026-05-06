# Testing

This project uses Playwright for lightweight smoke tests. The tests open the
static site in a real Chromium browser and check that the main pages and core
interactions still work.

## Setup

Install Node.js, then run these commands from the project root:

```powershell
npm install
npx playwright install chromium
```

## Run The Smoke Tests

```powershell
npm run test:smoke
```

For a visible browser while debugging:

```powershell
npm run test:smoke:headed
```

The smoke tests currently cover:

- The homepage destination links.
- The Middle-earth map loading and starting story mode.
- The family tree rendering and opening a character sheet.

The app loads some browser libraries from CDNs, so these tests need internet
access unless those dependencies are vendored locally later.

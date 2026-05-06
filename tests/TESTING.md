# Testing

This project uses lightweight automated tests. The smoke tests open the static
site in a real Chromium browser, while the data tests inspect the family tree
JSON directly with Node.

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
- Middle-earth sidebar checkboxes rendering map layers.
- The family tree rendering and opening a character sheet.

## Run The Data Tests

```powershell
npm run test:data
```

The data tests currently cover:

- Duplicate or mismatched family tree person IDs.
- Duplicate union IDs and missing partner/child references.
- View seeds, roots, and filters pointing at missing people.
- Local family tree image paths that do not exist.

To run both suites:

```powershell
npm run test:all
```

The app loads some browser libraries from CDNs, so these tests need internet
access unless those dependencies are vendored locally later.

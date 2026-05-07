# Testing

This project uses lightweight automated tests. The smoke tests open the static
site in a real Chromium browser, while the data tests inspect JSON and static
site files directly with Node.

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
- Every map page rendering a Leaflet map.
- Every map page highlighting exactly one current map nav link.
- The Middle-earth map loading, starting story mode, and moving between scenes.
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
- Family tree layout positions and annotations pointing at missing people.
- Homepage hotspots pointing at expected local destinations.
- Local HTML anchor links pointing at missing files.

To run both suites:

```powershell
npm run test:all
```

The app loads some browser libraries from CDNs, so these tests need internet
access unless those dependencies are vendored locally later.

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const ignoredDirectories = new Set([".git", "node_modules", "test-results"]);

const expectedHomepageHotspots = [
  ["study-hotspot--middle-earth", "maps/middle_earth/middle-earth.html"],
  ["study-hotspot--the-shire", "maps/the_shire/the_shire.html"],
  ["study-hotspot--numenor", "maps/numenor/numenor.html"],
  ["study-hotspot--beleriand", "maps/beleriand/beleriand.html"],
  ["study-hotspot--minas-tirith", "maps/minas_tirith/minas_tirith.html"],
  ["study-hotspot--family-tree", "family_tree/family_tree.html"]
];

const mapPagePaths = [
  ["maps", "middle_earth", "middle-earth.html"],
  ["maps", "numenor", "numenor.html"],
  ["maps", "beleriand", "beleriand.html"],
  ["maps", "the_shire", "the_shire.html"],
  ["maps", "minas_tirith", "minas_tirith.html"]
];

const compactMapDirectories = ["numenor", "beleriand", "the_shire", "minas_tirith"];

function expectNoErrors(errors) {
  assert.equal(errors.length, 0, errors.join("\n"));
}

function listFiles(directory, extension) {
  const files = [];

  fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirectories.has(entry.name)) {
        files.push(...listFiles(entryPath, extension));
      }
      return;
    }

    if (entry.isFile() && entry.name.endsWith(extension)) {
      files.push(entryPath);
    }
  });

  return files;
}

function isExternalOrSpecialHref(href) {
  return (
    href.startsWith("#")
    || href.startsWith("//")
    || /^[a-z][a-z0-9+.-]*:/i.test(href)
  );
}

function getLocalHrefTarget(fromFile, href) {
  const cleanHref = href.split("#")[0].split("?")[0];
  if (!cleanHref || isExternalOrSpecialHref(href)) {
    return null;
  }

  return path.resolve(path.dirname(fromFile), decodeURIComponent(cleanHref));
}

test("homepage hotspots point at expected local destinations", () => {
  const indexPath = path.join(repoRoot, "index.html");
  const html = fs.readFileSync(indexPath, "utf8");
  const errors = [];

  expectedHomepageHotspots.forEach(([hotspotClass, href]) => {
    const expectedPattern = new RegExp(
      `<a\\b[^>]*class=["'][^"']*${hotspotClass}[^"']*["'][^>]*href=["']${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`,
      "i"
    );

    if (!expectedPattern.test(html)) {
      errors.push(`index.html is missing ${hotspotClass} linked to ${href}.`);
      return;
    }

    const targetPath = path.resolve(repoRoot, href);
    if (!fs.existsSync(targetPath)) {
      errors.push(`${hotspotClass} points at missing file: ${href}`);
    }
  });

  expectNoErrors(errors);
});

test("provenance page and persistent atlas links remain available", () => {
  const aboutPath = path.join(repoRoot, "about.html");
  const errors = [];

  if (!fs.existsSync(aboutPath)) {
    errors.push("about.html is missing.");
    expectNoErrors(errors);
    return;
  }

  const aboutHtml = fs.readFileSync(aboutPath, "utf8");
  const requiredSectionIds = [
    "fan-project",
    "lore-sources",
    "artwork",
    "ai-artwork",
    "fonts-audio",
    "software",
    "repository-license",
    "corrections"
  ];

  requiredSectionIds.forEach((sectionId) => {
    if (!aboutHtml.includes(`id="${sectionId}"`)) {
      errors.push(`about.html is missing provenance section: ${sectionId}`);
    }
  });

  if (!aboutHtml.includes("Middle-earth Atlas is an unofficial fan-made project.")) {
    errors.push("about.html is missing the visible fan-project disclaimer.");
  }

  if (!aboutHtml.includes("This is a personal, non-commercial project created for exploration and study.")) {
    errors.push("about.html is missing the non-commercial project statement.");
  }

  const homepageHtml = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
  if (!homepageHtml.includes('href="about.html"')) {
    errors.push("index.html is missing its persistent provenance link.");
  }

  mapPagePaths.forEach((pathParts) => {
    const mapPath = path.join(repoRoot, ...pathParts);
    const mapHtml = fs.readFileSync(mapPath, "utf8");
    if (!mapHtml.includes('id="settings"') || !mapHtml.includes('href="../../about.html"')) {
      errors.push(`${path.relative(repoRoot, mapPath)} is missing the provenance link in Settings.`);
    }
  });

  expectNoErrors(errors);
});

test("local html anchor links point at existing files", () => {
  const errors = [];

  listFiles(repoRoot, ".html").forEach((htmlPath) => {
    const html = fs.readFileSync(htmlPath, "utf8");
    const relativeHtmlPath = path.relative(repoRoot, htmlPath);
    const hrefPattern = /<a\b[^>]*\bhref=["']([^"']+)["']/gi;
    let match;

    while ((match = hrefPattern.exec(html)) !== null) {
      const href = match[1].trim();
      const targetPath = getLocalHrefTarget(htmlPath, href);
      if (!targetPath) {
        continue;
      }

      const relativeTargetPath = path.relative(repoRoot, targetPath);
      if (relativeTargetPath.startsWith("..") || path.isAbsolute(relativeTargetPath)) {
        errors.push(`${relativeHtmlPath} links outside the project: ${href}`);
        continue;
      }

      if (!fs.existsSync(targetPath)) {
        errors.push(`${relativeHtmlPath} links to missing file: ${href}`);
      }
    }
  });

  expectNoErrors(errors);
});

test("static pages have no external runtime asset dependencies", () => {
  const errors = [];

  listFiles(repoRoot, ".html").forEach((htmlPath) => {
    const html = fs.readFileSync(htmlPath, "utf8");
    const relativeHtmlPath = path.relative(repoRoot, htmlPath);
    const assetPattern = /<(?:link|script)\b[^>]*\b(?:href|src)=["']([^"']+)["']/gi;
    let match;

    while ((match = assetPattern.exec(html)) !== null) {
      const assetRef = match[1].trim();

      if (/^(?:https?:)?\/\//i.test(assetRef)) {
        errors.push(`${relativeHtmlPath} depends on external runtime asset: ${assetRef}`);
        continue;
      }

      const targetPath = getLocalHrefTarget(htmlPath, assetRef);
      if (targetPath && !fs.existsSync(targetPath)) {
        errors.push(`${relativeHtmlPath} points at missing runtime asset: ${assetRef}`);
      }
    }
  });

  listFiles(repoRoot, ".css").forEach((cssPath) => {
    const css = fs.readFileSync(cssPath, "utf8");
    const relativeCssPath = path.relative(repoRoot, cssPath);

    if (/@import\s+(?:url\()?\s*["']?(?:https?:)?\/\//i.test(css)) {
      errors.push(`${relativeCssPath} imports an external stylesheet.`);
    }

    if (/url\(\s*["']?(?:https?:)?\/\//i.test(css)) {
      errors.push(`${relativeCssPath} loads an external asset.`);
    }
  });

  expectNoErrors(errors);
});

test("every map page loads the shared atlas visual theme", () => {
  const errors = [];
  const requiredRefs = [
    "../../plugins/atlas-map-theme.css",
    "../../plugins/atlas-map-theme.js"
  ];

  mapPagePaths.forEach((pathParts) => {
    const htmlPath = path.join(repoRoot, ...pathParts);
    const html = fs.readFileSync(htmlPath, "utf8");
    const relativeHtmlPath = path.relative(repoRoot, htmlPath);

    requiredRefs.forEach((ref) => {
      if (!html.includes(ref)) {
        errors.push(`${relativeHtmlPath} is missing shared theme reference: ${ref}`);
      }
    });
  });

  expectNoErrors(errors);
});

test("compact map pages use the shared shell and retain declarative sidebars", () => {
  const errors = [];

  compactMapDirectories.forEach((directory) => {
    const htmlName = directory === "the_shire" ? "the_shire.html" : `${directory}.html`;
    const mapDirectory = path.join(repoRoot, "maps", directory);
    const html = fs.readFileSync(path.join(mapDirectory, htmlName), "utf8");

    if (!html.includes('../shared/map-shell.css')) {
      errors.push(`${directory} does not load the shared map stylesheet.`);
    }

    if (!html.includes('../shared/map-page.js')) {
      errors.push(`${directory} does not load the shared map initializer.`);
    }

    if (!html.includes('data-toggle-all=')) {
      errors.push(`${directory} has no declarative sidebar group controls.`);
    }

    ["functions.js", "script.js", "style.css"].forEach((duplicateFile) => {
      if (fs.existsSync(path.join(mapDirectory, duplicateFile))) {
        errors.push(`${directory} still contains duplicated ${duplicateFile}.`);
      }
    });
  });

  ["functions.js", "map-page.js", "map-shell.js", "map-shell.css"].forEach((sharedFile) => {
    if (!fs.existsSync(path.join(repoRoot, "maps", "shared", sharedFile))) {
      errors.push(`Shared map resource is missing: ${sharedFile}`);
    }
  });

  expectNoErrors(errors);
});

test("core third-party browser dependencies are served from local plugin files", () => {
  const errors = [];
  const dependencyChecks = [
    {
      htmlPath: path.join(repoRoot, "maps", "middle_earth", "middle-earth.html"),
      requiredRefs: [
        "../../assets/vendor/fonts.css",
        "../../plugins/leaflet/leaflet.css",
        "../../plugins/leaflet/leaflet.js",
        "../../plugins/MarkerCluster.css",
        "../../plugins/MarkerCluster.Default.css",
        "../../plugins/click-tolerance.js",
        "../../plugins/leaflet.markercluster.js"
      ],
      forbiddenRefs: [
        "https://fonts.googleapis.com/",
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
        "https://unpkg.com/leaflet-clicktolerance/src/index.js",
        "https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js",
        "https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css",
        "https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css"
      ]
    },
    {
      htmlPath: path.join(repoRoot, "family_tree", "family_tree.html"),
      requiredRefs: [
        "../plugins/d3.v7.min.js",
        "../plugins/elk.bundled.js"
      ],
      forbiddenRefs: [
        "https://d3js.org/d3.v7.min.js",
        "https://cdn.jsdelivr.net/npm/elkjs/lib/elk.bundled.js"
      ]
    }
  ];

  dependencyChecks.forEach(({ htmlPath, requiredRefs, forbiddenRefs }) => {
    const html = fs.readFileSync(htmlPath, "utf8");
    const relativeHtmlPath = path.relative(repoRoot, htmlPath);

    requiredRefs.forEach((ref) => {
      if (!html.includes(ref)) {
        errors.push(`${relativeHtmlPath} is missing local dependency reference: ${ref}`);
      }

      const targetPath = path.resolve(path.dirname(htmlPath), ref);
      if (!fs.existsSync(targetPath)) {
        errors.push(`${relativeHtmlPath} points at missing local dependency file: ${ref}`);
      }
    });

    forbiddenRefs.forEach((ref) => {
      if (html.includes(ref)) {
        errors.push(`${relativeHtmlPath} still references external dependency URL: ${ref}`);
      }
    });
  });

  expectNoErrors(errors);
});

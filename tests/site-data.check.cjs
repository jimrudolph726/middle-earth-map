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

test("core third-party browser dependencies are served from local plugin files", () => {
  const errors = [];
  const dependencyChecks = [
    {
      htmlPath: path.join(repoRoot, "maps", "middle_earth", "middle-earth.html"),
      requiredRefs: [
        "../../plugins/MarkerCluster.css",
        "../../plugins/MarkerCluster.Default.css",
        "../../plugins/click-tolerance.js",
        "../../plugins/leaflet.markercluster.js"
      ],
      forbiddenRefs: [
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

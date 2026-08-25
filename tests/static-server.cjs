const fs = require("fs/promises");
const http = require("http");
const path = require("path");

const host = "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const rootDir = path.resolve(__dirname, "..");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".geojson": "application/geo+json; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".ttf": "font/ttf",
  ".webp": "image/webp"
};

function sendText(response, statusCode, body) {
  response.writeHead(statusCode, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end(body);
}

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://${host}:${port}`);
  let pathname = decodeURIComponent(url.pathname);

  if (pathname.endsWith("/")) {
    pathname += "index.html";
  }

  const filePath = path.resolve(rootDir, `.${pathname}`);
  const relativePath = path.relative(rootDir, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return null;
  }

  return filePath;
}

async function serveFile(request, response) {
  const filePath = resolveRequestPath(request.url);

  if (!filePath) {
    sendText(response, 403, "Forbidden");
    return;
  }

  try {
    const fileStats = await fs.stat(filePath);
    const resolvedFilePath = fileStats.isDirectory()
      ? path.join(filePath, "index.html")
      : filePath;
    const file = await fs.readFile(resolvedFilePath);
    const extension = path.extname(resolvedFilePath).toLowerCase();

    response.writeHead(200, {
      "content-type": mimeTypes[extension] || "application/octet-stream",
      "cache-control": "no-store"
    });
    response.end(file);
  } catch (_error) {
    sendText(response, 404, "Not found");
  }
}

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    sendText(response, 405, "Method not allowed");
    return;
  }

  serveFile(request, response);
});

server.listen(port, host, () => {
  console.log(`Serving ${rootDir} at http://${host}:${port}`);
});

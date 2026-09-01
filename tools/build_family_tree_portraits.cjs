const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const ffmpegPath = process.env.FFMPEG_PATH || "ffmpeg";
const thumbnailSizes = [64, 128];
const groups = ["elves_men", "hobbits"];
const force = process.argv.includes("--force");

function getThumbnailPath(groupDir, imagePath, size) {
  const parsed = path.parse(imagePath);
  return path.join(groupDir, parsed.dir, "thumbs", `${parsed.name}-${size}.webp`);
}

function shouldBuild(sourcePath, outputPath) {
  if (force || !fs.existsSync(outputPath)) {
    return true;
  }

  return fs.statSync(sourcePath).mtimeMs > fs.statSync(outputPath).mtimeMs;
}

function buildThumbnail(sourcePath, outputPath, size) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const result = spawnSync(ffmpegPath, [
    "-hide_banner",
    "-loglevel", "error",
    "-y",
    "-i", sourcePath,
    "-vf", `scale=${size}:${size}:force_original_aspect_ratio=increase,crop=${size}:${size}`,
    "-frames:v", "1",
    "-an",
    "-map_metadata", "-1",
    "-c:v", "libwebp",
    "-quality", "82",
    "-compression_level", "6",
    outputPath
  ], {
    encoding: "utf8",
    windowsHide: true
  });

  if (result.error) {
    throw new Error(`Could not run ffmpeg (${result.error.message}). Install ffmpeg or set FFMPEG_PATH.`);
  }

  if (result.status !== 0) {
    throw new Error(`ffmpeg could not create ${path.relative(repoRoot, outputPath)}:\n${result.stderr}`);
  }
}

let referencedPortraits = 0;
let generatedThumbnails = 0;

groups.forEach((groupId) => {
  const groupDir = path.join(repoRoot, "family_tree", groupId);
  const dataPath = path.join(groupDir, "family_tree_data.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  Object.values(data.people || {}).forEach((person) => {
    if (!person.image) {
      return;
    }

    const sourcePath = path.resolve(groupDir, person.image);
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`${groupId}:${person.id} references missing portrait ${person.image}.`);
    }

    referencedPortraits += 1;
    thumbnailSizes.forEach((size) => {
      const outputPath = getThumbnailPath(groupDir, person.image, size);
      if (shouldBuild(sourcePath, outputPath)) {
        buildThumbnail(sourcePath, outputPath, size);
        generatedThumbnails += 1;
      }
    });
  });
});

console.log(`Verified ${referencedPortraits} family-tree portraits and generated ${generatedThumbnails} WebP thumbnails.`);

import { initializeImageAtlasMap } from './map-shell.js';

const mapPageUrl = window.location.href;
const mapDefinitionUrl = new URL('./variables.js', mapPageUrl);
const geojsonBaseUrl = new URL('./geojson_files/', mapPageUrl);
const mapDefinition = await import(mapDefinitionUrl.href);

initializeImageAtlasMap({
  ...mapDefinition,
  geojsonBaseUrl,
});

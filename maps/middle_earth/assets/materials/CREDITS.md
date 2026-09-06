# Middle-earth physical-volume material register

These files support the Middle-earth map's forest-green leather mount and
antique-brass travelling frame. Their source materials were downloaded from
Poly Haven under the [CC0 license](https://polyhaven.com/license), then
transformed locally for this project. The original high-resolution downloads
are not shipped with the site. The mahogany desk shared by the volumes is
recorded in the [shared study-material register](../../../shared/assets/materials/CREDITS.md).

## `middle-earth-green-leather-v1.webp`

- Source asset: [Brown Leather](https://polyhaven.com/a/brown_leather), 2K diffuse map
- Source author: Rob Tuytel
- Provider: Poly Haven
- License: [CC0 1.0 Universal](https://polyhaven.com/license)
- Atlas processing: resized from 2048 × 2048 to 768 × 768, shifted toward
  forest green, slightly darkened and desaturated, then encoded as lossy WebP
- Purpose: the narrow leather mount between the map and the mahogany desk;
  also reused for the layered opening cover and spine (2026-09-05)
- Output size: 94,466 bytes
- SHA-256: `6332653A0853D44A12988EF2FDF010E88DC4EDCD27DF2B60B8D9EFF45C582C03`
- Processed: 2026-09-01

## `middle-earth-frame-brass-v1.webp`

- Source asset: [Metal Plate 02](https://polyhaven.com/a/metal_plate_02), 2K diffuse map
- Source description: worn, corroded steel plate
- Source author: Rob Tuytel
- License: CC0
- Local treatment: a 300 × 300 wear detail was cropped from the source, enlarged to 512 × 512, warmed toward aged bronze, contrast-adjusted, and encoded as lossy WebP
- Purpose: texture pattern inside the SVG antique-brass map frame
- Output size: 22,792 bytes
- SHA-256: `D2C60406638734672257FEB1807648103FA07C3A146B232816F27406568E9C82`

## Original project work

The multi-rail frame geometry, leather-mount composition,
winding-road-and-leaf corner ornament, color treatment, responsive behavior,
and Leaflet integration are original project work. The botanical motif is
drawn as inline SVG and does not contain a third-party illustration.

The layered CSS binding prototype (2026-09-05) adds original pressed tooling,
spine bands, board thickness, patterned endpaper, page edges, moving lighting,
and a hinged opening. It reuses the above leather without shipping another
image or animation dependency. The Bag End inscription is decorative project
copy, not a quotation or a claim of canonical book provenance.

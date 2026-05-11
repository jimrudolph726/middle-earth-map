from __future__ import annotations

import math
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_IMAGE = ROOT / "maps" / "middle_earth" / "assets" / "middle-earth.png"
OUTPUT_ROOT = ROOT / "maps" / "middle_earth" / "tiles" / "base"

NORTH = 44.95133395351252
SOUTH = 44.93460911676505
WEST = -93.31776393673807
EAST = -93.29255872642499

MIN_ZOOM = 15
MAX_NATIVE_ZOOM = 19
TILE_SIZE = 256
WEBP_QUALITY = 82


def lon_to_world_px(lon: float, zoom: int) -> float:
    scale = TILE_SIZE * (2**zoom)
    return ((lon + 180.0) / 360.0) * scale


def lat_to_world_px(lat: float, zoom: int) -> float:
    lat_rad = math.radians(lat)
    mercator = math.log(math.tan((math.pi / 4.0) + (lat_rad / 2.0)))
    scale = TILE_SIZE * (2**zoom)
    return (1.0 - (mercator / math.pi)) * scale / 2.0


def tile_range_for_bounds(left: float, top: float, right: float, bottom: float) -> tuple[range, range]:
    min_x = math.floor(left / TILE_SIZE)
    max_x = math.ceil(right / TILE_SIZE) - 1
    min_y = math.floor(top / TILE_SIZE)
    max_y = math.ceil(bottom / TILE_SIZE) - 1
    return range(min_x, max_x + 1), range(min_y, max_y + 1)


def scaled_px(value: float, start: float, end: float, size: int) -> int:
    return int(round(((value - start) / (end - start)) * size))


def build_tiles() -> None:
    if not SOURCE_IMAGE.exists():
        raise FileNotFoundError(f"Missing source image: {SOURCE_IMAGE}")

    source = Image.open(SOURCE_IMAGE).convert("RGBA")
    tile_count = 0

    for zoom in range(MIN_ZOOM, MAX_NATIVE_ZOOM + 1):
        image_left = lon_to_world_px(WEST, zoom)
        image_right = lon_to_world_px(EAST, zoom)
        image_top = lat_to_world_px(NORTH, zoom)
        image_bottom = lat_to_world_px(SOUTH, zoom)

        x_range, y_range = tile_range_for_bounds(image_left, image_top, image_right, image_bottom)

        for tile_x in x_range:
            for tile_y in y_range:
                tile_left = tile_x * TILE_SIZE
                tile_right = tile_left + TILE_SIZE
                tile_top = tile_y * TILE_SIZE
                tile_bottom = tile_top + TILE_SIZE

                overlap_left = max(image_left, tile_left)
                overlap_right = min(image_right, tile_right)
                overlap_top = max(image_top, tile_top)
                overlap_bottom = min(image_bottom, tile_bottom)

                if overlap_left >= overlap_right or overlap_top >= overlap_bottom:
                    continue

                src_left = scaled_px(overlap_left, image_left, image_right, source.width)
                src_right = scaled_px(overlap_right, image_left, image_right, source.width)
                src_top = scaled_px(overlap_top, image_top, image_bottom, source.height)
                src_bottom = scaled_px(overlap_bottom, image_top, image_bottom, source.height)

                dest_left = int(round(overlap_left - tile_left))
                dest_right = int(round(overlap_right - tile_left))
                dest_top = int(round(overlap_top - tile_top))
                dest_bottom = int(round(overlap_bottom - tile_top))

                if src_left == src_right:
                    src_right = min(source.width, src_right + 1)
                if src_top == src_bottom:
                    src_bottom = min(source.height, src_bottom + 1)
                if dest_left == dest_right:
                    dest_right = min(TILE_SIZE, dest_right + 1)
                if dest_top == dest_bottom:
                    dest_bottom = min(TILE_SIZE, dest_bottom + 1)

                tile = Image.new("RGBA", (TILE_SIZE, TILE_SIZE), (0, 0, 0, 0))
                crop = source.crop((src_left, src_top, src_right, src_bottom))
                dest_width = dest_right - dest_left
                dest_height = dest_bottom - dest_top
                tile.paste(
                    crop.resize((dest_width, dest_height), Image.Resampling.LANCZOS),
                    (dest_left, dest_top),
                )

                tile_path = OUTPUT_ROOT / str(zoom) / str(tile_x) / f"{tile_y}.webp"
                tile_path.parent.mkdir(parents=True, exist_ok=True)
                tile.save(tile_path, format="WEBP", quality=WEBP_QUALITY, method=6)
                tile_count += 1

    print(f"Generated {tile_count} tiles in {OUTPUT_ROOT}")


if __name__ == "__main__":
    build_tiles()

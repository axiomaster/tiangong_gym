"""Auto-Cropper (arch.md §3.2).

HarmonyOS `pageInfo.json` carries no network URLs for images — only opaque
`resource:///` ids — so virtual apps would render blank squares. The cropper walks
the layout tree for image-bearing nodes, crops their `$rect` region out of the
raw device screenshot, and saves `assets/images/<component_id>.png` for the
Input Spec / renderer to reference.

The sample screenshot is `docs/data` (1320x2848 JPEG with no file extension).
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from PIL import Image

from collector.pageinfo import PageInfo, load_dump, parse_page_info, parse_rect

#: backgroundImage values that point at a real drawable (anything else is NONE/gradient)
_RESOURCE_PREFIXES = ("resource://", "http://", "https://", "file://", "url(")


def _has_background_image(attrs: dict[str, Any]) -> bool:
    bg = attrs.get("backgroundImage")
    return isinstance(bg, str) and bg.startswith(_RESOURCE_PREFIXES)


def asset_relpath(component_id: int) -> str:
    return f"assets/images/{component_id}.png"


def _is_compound_container(
    node_id: int,
    rect: tuple[float, float, float, float],
    page: PageInfo,
) -> bool:
    """True if this image rect strictly encloses 2 or more other Text/Image nodes.

    Cropping compound containers captures screen regions already containing those
    children, causing duplicate text/icon ghosting when children are also rendered.
    """
    count = 0
    for other in page.iter_nodes():
        other_id = other.get("$ID")
        if other_id is not None and int(other_id) == node_id:
            continue
        if other.get("$type") in ("Text", "Image"):
            r = parse_rect(other.get("$rect"))
            if r and rect[0] <= r[0] and rect[1] <= r[1] and rect[2] >= r[2] and rect[3] >= r[3]:
                count += 1
                if count >= 2:
                    return True
    return False


def _encloses_text(node_id: int, rect: tuple[float, float, float, float], page: PageInfo) -> bool:
    for other in page.iter_nodes():
        other_id = other.get("$ID")
        if other_id is not None and int(other_id) == node_id:
            continue
        if other.get("$type") == "Text":
            r = parse_rect(other.get("$rect"))
            if r and rect[0] <= r[0] and rect[1] <= r[1] and rect[2] >= r[2] and rect[3] >= r[3]:
                return True
    return False


def collect_image_nodes(page: PageInfo) -> list[tuple[int, tuple[float, float, float, float]]]:
    """Find (id, rect) for every node that renders an image: `$type == "Image"`,
    `XComponent` video surfaces, custom-drawn C-API leaf nodes, or any node with
    a resource-bearing backgroundImage."""
    found: list[tuple[int, tuple[float, float, float, float]]] = []
    seen: set[int] = set()
    for node in page.iter_nodes():
        node_id = node.get("$ID")
        if node_id is None:
            continue
        node_id = int(node_id)
        if node_id in seen:
            continue
        attrs = node.get("$attrs") or {}
        node_type = node.get("$type")
        is_empty_scroll = node_type == "Scroll" and not node.get("$children")
        is_custom_text = (
            node_type == "Text"
            and not str(attrs.get("content") or "").strip()
            and not node.get("$children")
            and "actualFontSize" in attrs
        )
        is_surface = node_type == "XComponent" or is_empty_scroll or is_custom_text
        if node_type != "Image" and not is_surface and not _has_background_image(attrs):
            continue
        rect = parse_rect(node.get("$rect"))
        if rect is None:
            continue
        if is_surface:
            if _encloses_text(node_id, rect, page):
                continue
        elif _is_compound_container(node_id, rect, page):
            continue
        found.append((node_id, rect))
        seen.add(node_id)
    return found


def crop_assets(
    page: PageInfo,
    screenshot: str | Path,
    out_dir: str | Path,
) -> dict[int, str]:
    """Crop every image node out of the screenshot into `<out_dir>/assets/images/`.

    Returns {component_id: "assets/images/<id>.png"} (paths relative to `out_dir`).
    Zero-area / fully off-screen rects are skipped.
    """
    img = Image.open(screenshot)
    img_w, img_h = img.size
    out_dir = Path(out_dir)
    asset_dir = out_dir / "assets" / "images"
    asset_dir.mkdir(parents=True, exist_ok=True)

    mapping: dict[int, str] = {}
    for node_id, (x1, y1, x2, y2) in collect_image_nodes(page):
        left, top = max(0, round(min(x1, x2))), max(0, round(min(y1, y2)))
        right, bottom = min(img_w, round(max(x1, x2))), min(img_h, round(max(y1, y2)))
        if right - left <= 0 or bottom - top <= 0:
            continue
        crop = img.crop((left, top, right, bottom))
        rel = asset_relpath(node_id)
        crop.save(out_dir / rel, format="PNG")
        mapping[node_id] = rel
    return mapping


def main() -> int:
    parser = argparse.ArgumentParser(description="Crop image nodes out of a device screenshot")
    parser.add_argument("dump", help="path to hidumper pageInfo dump JSON")
    parser.add_argument("screenshot", help="path to the raw device screenshot (e.g. docs/data)")
    parser.add_argument("-o", "--out", default="out", help="output directory (default: out)")
    args = parser.parse_args()

    page = parse_page_info(load_dump(args.dump))
    mapping = crop_assets(page, args.screenshot, args.out)
    map_path = Path(args.out) / "assets_map.json"
    map_path.write_text(json.dumps(mapping, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"cropped {len(mapping)} image nodes -> {args.out}/assets/images/ (map: {map_path})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

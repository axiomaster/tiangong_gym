"""Device cleaner (arch.md §7): real-device hidumper dump -> standard `cue_data.json`.

Output contract (arch.md §4.3): flat component list under `components`, 8-value
clockwise-from-top-left bbox in physical pixels, action vocabulary
click/long_press/scroll/type. The legacy sample in
`reference/data/cue_data.json` (misspelled `conponments`, bottom-left-starting
bbox) is NOT a format reference.

Interactivity: hidumper carries no clickable flags, so pass a `uitest dumpLayout`
JSON via --uitest to populate `actions`; without it components come out with
empty action lists (to be enriched in a later pass).
"""

from __future__ import annotations

import argparse
from itertools import count
from pathlib import Path
from typing import Any

from collector import uitest
from collector.pageinfo import (
    UNSET,
    PageInfo,
    is_visible,
    load_dump,
    parse_number,
    parse_page_info,
    parse_rect,
    style_from_attrs,
)
from schema.cue_data import Component, CueData, Viewport, bbox_from_corners

#: node types emitted as cue components (containers become renderer layout only)
COMPONENT_TYPES = {"Text", "Image"}


def _description(attrs: dict[str, Any]) -> str:
    value = attrs.get("accessibilityText")
    if isinstance(value, str) and value and value != UNSET:
        return value
    return ""


def _keep_node(node: dict[str, Any], regions: list) -> bool:
    node_type = node.get("$type")
    attrs = node.get("$attrs") or {}
    if node_type == "Text":
        content = attrs.get("content")
        return isinstance(content, str) and content.strip() != ""
    if node_type == "Image":
        return True
    # non-Text/Image nodes only matter when they are interactive (e.g. tappable Stack)
    return bool(regions) and bool(uitest.actions_for_rect(parse_rect(node.get("$rect")) or (1, 1, 0, 0), regions))


def _intersects_viewport(rect: tuple[float, float, float, float], page: PageInfo) -> bool:
    """Virtualized List/Scroll containers preload off-screen children with huge
    negative/overflow rects; they are not part of the visible page."""
    x1, y1, x2, y2 = rect
    ix1, iy1 = max(x1, 0.0), max(y1, 0.0)
    ix2, iy2 = min(x2, page.width), min(y2, page.height)
    return ix2 - ix1 > 0 and iy2 - iy1 > 0


def dump_to_cue(
    dump: dict[str, Any],
    *,
    uitest_dump: dict[str, Any] | None = None,
    screenshot: str | None = None,
    window_id: int | str | None = None,
) -> CueData:
    page = parse_page_info(dump)
    regions = uitest.collect_regions(uitest_dump, bundle_name=page.bundle_name) if uitest_dump else []
    anon_ids = count(start=-1, step=-1)  # deterministic fallback ids for $ID-less nodes

    components: list[Component] = []
    for node in page.iter_nodes():
        if not is_visible(node) or not _keep_node(node, regions):
            continue
        # inactive tab panels are occluded on the device and hidden by the renderer
        # (empty TabContent rule) — not part of the visible default state
        if node.get("$type") == "TabContent" and not (node.get("$children") or []):
            continue
        rect = parse_rect(node.get("$rect"))
        if rect is None or not _intersects_viewport(rect, page):
            continue
        node_id = int(node["$ID"]) if node.get("$ID") is not None else next(anon_ids)
        attrs = node.get("$attrs") or {}
        components.append(
            Component(
                id=node_id,
                type=str(node.get("$type")),
                content=str(attrs.get("content")) if node.get("$type") == "Text" else "",
                bbox=bbox_from_corners(*rect),
                description=_description(attrs),
                style=style_from_attrs(attrs),
                actions=uitest.actions_for_rect(rect, regions),
            )
        )

    return CueData(
        bundle_name=page.bundle_name,
        page_url=page.page_url,
        window_id=window_id,
        viewport=Viewport(width=page.width, height=page.height, resolution=page.resolution),
        screenshot=screenshot,
        components=components,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Convert a real-device dump into cue_data.json")
    parser.add_argument("dump", help="path to hidumper pageInfo dump JSON")
    parser.add_argument("-u", "--uitest", help="optional uitest dumpLayout JSON for action flags")
    parser.add_argument("-o", "--out", default="out/cue_data.json", help="output path (default: out/cue_data.json)")
    parser.add_argument("--screenshot", help="screenshot filename to record in the output")
    parser.add_argument("--window-id", type=parse_number, default=None, help="window id, if known")
    args = parser.parse_args()

    uitest_dump = None
    if args.uitest:
        import json

        uitest_dump = json.loads(Path(args.uitest).read_text(encoding="utf-8"))

    cue = dump_to_cue(
        load_dump(args.dump),
        uitest_dump=uitest_dump,
        screenshot=args.screenshot,
        window_id=args.window_id,
    )
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(cue.model_dump_json(exclude_none=True, indent=2), encoding="utf-8")
    texts = sum(1 for c in cue.components if c.type == "Text")
    images = sum(1 for c in cue.components if c.type == "Image")
    print(f"wrote {out}: {len(cue.components)} components ({texts} Text, {images} Image)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

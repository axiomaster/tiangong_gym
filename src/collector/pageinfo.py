"""Parsing utilities for real-device HarmonyOS page dumps.

Raw capture comes from `hdc shell "hidumper -s DeviceStatusService -a '-i'"` (arch.md §3.1)
and has two verified quirks:
1. The top-level dict's `pageInfo` field is a JSON **string** and needs a second
   `json.loads` before use.
2. Tree nodes use `$ID` / `$type` / `$rect` / `$attrs` / `$children` keys; `$rect` is a
   string like `"[x1, y1],[x2, y2]"` (top-left / bottom-right corners, physical pixels);
   almost every attribute value is a string, and unset attributes are the literal "NONE".

hidumper does NOT carry per-node clickability flags — `touchable` is "True" on every
node. Interactivity must come from `uitest dumpLayout` (see `collector.uitest`).
"""

from __future__ import annotations

import json
import re
from collections.abc import Iterator
from pathlib import Path
from typing import Any

from pydantic import BaseModel, Field

UNSET = "NONE"

_RECT_RE = re.compile(r"[-+0-9.eE]+")
_NUM_RE = re.compile(r"^[-+]?[0-9.]+")

#: `$attrs` keys kept for the virtual renderer; everything else is device-internal noise.
STYLE_KEYS = (
    "fontSize",
    "fontColor",
    "fontWeight",
    "backgroundColor",
    "backgroundImage",
    "fontStyle",
    "textAlign",
    "opacity",
    "visibility",
)


def load_dump(path: str | Path) -> dict[str, Any]:
    """Load the top-level hidumper JSON file."""
    data = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"expected a JSON object at top level, got {type(data).__name__}")
    return data


def parse_rect(value: str | None) -> tuple[float, float, float, float] | None:
    """Parse `"[x1, y1],[x2, y2]"` into (x1, y1, x2, y2). Returns None if unparsable."""
    if not value or not isinstance(value, str):
        return None
    nums = _RECT_RE.findall(value)
    if len(nums) < 4:
        return None
    x1, y1, x2, y2 = (float(n) for n in nums[:4])
    return x1, y1, x2, y2


def parse_number(value: Any) -> float | None:
    """Parse leading numeric part of strings like "16.00fp", "1320.000000", "0.5vp"."""
    if value is None or isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return float(value)
    m = _NUM_RE.match(str(value).strip())
    return float(m.group(0)) if m else None


def style_from_attrs(attrs: dict[str, Any], resolution: float = 1.0) -> dict[str, Any]:
    """Extract the renderer-relevant subset of `$attrs`, normalizing units.

    - fontSize "16.00fp" -> 16.0 (fp == vp for fonts)
    - fontSize "46.00px" -> converted to fp via resolution when resolution > 0
    - fontWeight "500" -> 500
    - colors kept verbatim (#AARRGGBB / #RRGGBB, HarmonyOS ARGB order)
    - unset ("NONE") attributes are dropped
    """
    style: dict[str, Any] = {}
    for key in STYLE_KEYS:
        value = attrs.get(key)
        if value is None or value == UNSET:
            continue
        if key == "fontSize":
            num = parse_number(value)
            if num:
                if isinstance(value, str) and value.strip().lower().endswith("px") and resolution > 0:
                    num = round(num / resolution, 2)
                style[key] = num
        elif key == "fontWeight":
            num = parse_number(value)
            if num:
                style[key] = int(num)
        elif isinstance(value, str):
            style[key] = value
    return style


def iter_tree(node: dict[str, Any]) -> Iterator[dict[str, Any]]:
    """Depth-first iteration over a raw tree node and all descendants."""
    if not isinstance(node, dict):
        return
    yield node
    for child in node.get("$children") or []:
        yield from iter_tree(child)


def is_visible(node: dict[str, Any]) -> bool:
    visibility = (node.get("$attrs") or {}).get("visibility")
    return visibility not in ("Visibility.Hidden", "Visibility.None")


class PageInfo(BaseModel):
    """Normalized view of one real-device page snapshot."""

    bundle_name: str
    page_url: str
    ability: str | None = None
    nav_dst_name: str | None = None
    window_id: int | None = None
    width: float
    height: float
    resolution: float
    root: dict[str, Any] = Field(repr=False)

    def iter_nodes(self) -> Iterator[dict[str, Any]]:
        return iter_tree(self.root)


def _normalize_ids(root: dict[str, Any]) -> None:
    """Ensure every node has a unique integer $ID (assigning -1, -2, ... to unset/-1 nodes)."""
    next_neg = -1
    for node in iter_tree(root):
        raw_id = node.get("$ID")
        if raw_id is None or int(raw_id) < 0:
            node["$ID"] = next_neg
            next_neg -= 1


def parse_page_info(dump: dict[str, Any]) -> PageInfo:
    """Parse a top-level hidumper dump: unwrap the double-encoded pageInfo string."""
    raw = dump.get("pageInfo")
    if isinstance(raw, str):
        tree = json.loads(raw)
    elif isinstance(raw, dict):
        tree = raw
    else:
        raise ValueError("dump has no parsable `pageInfo` field (expected JSON string)")

    bundle_name = str(tree.get("bundleName") or dump.get("bundleName") or "")
    width = parse_number(tree.get("width")) or 0.0
    height = parse_number(tree.get("height")) or 0.0
    resolution = parse_number(tree.get("$resolution")) or 1.0
    if width <= 0 or height <= 0:
        raise ValueError(f"dump has invalid viewport {width}x{height}")

    root: dict[str, Any] = dict(tree)
    root["$type"] = "root"
    root.setdefault("$ID", 0)
    root["$rect"] = f"[0.00, 0.00],[{width:.2f},{height:.2f}]"
    _normalize_ids(root)
    return PageInfo(
        bundle_name=bundle_name,
        page_url=str(tree.get("pageUrl") or ""),
        ability=tree.get("ability"),
        nav_dst_name=tree.get("navDstName"),
        width=width,
        height=height,
        resolution=resolution,
        root=root,
    )

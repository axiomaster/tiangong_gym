"""Interactive-flag extraction from `uitest dumpLayout` output (arch.md §3.1 #4).

hidumper pageInfo has no per-node clickability, so actions (click / long_press /
scroll / type) are derived from the uitest layout dump and matched back onto
pageInfo components by geometry (bounds containment).

NOTE: no real uitest sample exists in `reference/data/` yet; the parser below is
written defensively against the documented format
(`{"attributes": {"bounds": "[x1,y1][x2,y2]", "clickable": "true", ...}, "children": [...]}`)
and is covered by synthetic-fixture tests. Re-verify against a real capture before
trusting it in production runs.
"""

from __future__ import annotations

import re
from collections.abc import Iterator
from typing import Any

from schema.cue_data import Action

_BOUNDS_RE = re.compile(r"\[(-?[0-9.]+),\s*(-?[0-9.]+)\]\[(-?[0-9.]+),\s*(-?[0-9.]+)\]")

#: uitest attribute -> cue action vocabulary
_ATTR_ACTIONS: dict[str, Action] = {
    "clickable": "click",
    "longClickable": "long_press",
    "scrollable": "scroll",
}

#: uitest node types that accept free text input -> "type" action
_TEXT_INPUT_TYPES = {"TextInput", "TextArea", "RichEditor", "TextField"}


def _iter_nodes(node: dict[str, Any]) -> Iterator[dict[str, Any]]:
    if not isinstance(node, dict):
        return
    yield node
    for child in node.get("children") or []:
        yield from _iter_nodes(child)


def _attrs_of(node: dict[str, Any]) -> dict[str, Any]:
    attrs = node.get("attributes")
    return attrs if isinstance(attrs, dict) else {}


def parse_bounds(value: Any) -> tuple[float, float, float, float] | None:
    """Parse uitest `"[x1,y1][x2,y2]"` into (x1, y1, x2, y2)."""
    if not value or not isinstance(value, str):
        return None
    m = _BOUNDS_RE.search(value)
    if not m:
        return None
    x1, y1, x2, y2 = (float(g) for g in m.groups())
    return x1, y1, x2, y2


def node_actions(attrs: dict[str, Any]) -> list[Action]:
    """Map one uitest node's attributes onto the cue action vocabulary."""
    actions: list[Action] = []
    for key, action in _ATTR_ACTIONS.items():
        if str(attrs.get(key, "")).lower() == "true":
            actions.append(action)
    if str(attrs.get("type", "")) in _TEXT_INPUT_TYPES or str(attrs.get("editable", "")).lower() == "true":
        actions.append("type")
    return actions


def collect_regions(
    root: dict[str, Any],
    bundle_name: str | None = None,
) -> list[tuple[tuple[float, float, float, float], list[Action]]]:
    """Flatten a uitest dump into [(bounds, actions), ...], dropping empty entries.

    Real dumps contain several windows (status bar, SuperHub float, ...). When
    `bundle_name` is given, only nodes whose `bundleName` attribute matches (or is
    absent) are kept; invisible nodes (`visible: false`) are dropped.
    """
    regions: list[tuple[tuple[float, float, float, float], list[Action]]] = []
    for node in _iter_nodes(root):
        attrs = _attrs_of(node)
        if bundle_name and attrs.get("bundleName") not in (None, "", bundle_name):
            continue
        if str(attrs.get("visible", "true")).lower() == "false":
            continue
        actions = node_actions(attrs)
        if not actions:
            continue
        bounds = parse_bounds(attrs.get("bounds"))
        if bounds is None:
            continue
        regions.append((bounds, actions))
    return regions


def actions_for_rect(
    rect: tuple[float, float, float, float],
    regions: list[tuple[tuple[float, float, float, float], list[Action]]],
) -> list[Action]:
    """Return the union of actions of uitest regions whose center falls inside `rect`."""
    x1, y1, x2, y2 = rect
    found: list[Action] = []
    for (bx1, by1, bx2, by2), actions in regions:
        cx, cy = (bx1 + bx2) / 2, (by1 + by2) / 2
        if x1 <= cx <= x2 and y1 <= cy <= y2:
            for action in actions:
                if action not in found:
                    found.append(action)
    return found

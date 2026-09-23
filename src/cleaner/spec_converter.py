"""Spec converter (arch.md §7): pageInfo dump + cropped assets -> App Generation Spec.

The spec is the Path-B renderer's input (arch.md §3.3): the full layout tree with
geometry in physical pixels, text content, a renderer-relevant style subset, and
`asset_path` bindings for image nodes (produced by `collector.cropper`).
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from collector import uitest
from collector.cropper import crop_assets
from collector.pageinfo import (
    PageInfo,
    load_dump,
    parse_page_info,
    parse_rect,
    style_from_attrs,
)
from schema.input_spec import InputSpec, SpecNode, Viewport


def _convert_node(node: dict[str, Any], assets: dict[int, str], regions: list) -> SpecNode | None:
    node_type = node.get("$type")
    if node_type is None:
        return None
    rect = parse_rect(node.get("$rect"))
    if rect is None:
        return None

    node_id = int(node["$ID"]) if node.get("$ID") is not None else 0
    attrs = node.get("$attrs") or {}
    style = style_from_attrs(attrs)
    if node_id in assets and node_type != "Image":
        # node paints a cropped slice as its background (e.g. Stack with backgroundImage)
        style["backgroundImage"] = f"url({assets[node_id]})"
    children = [
        converted
        for child in node.get("$children") or []
        if (converted := _convert_node(child, assets, regions)) is not None
    ]
    content = attrs.get("content")
    return SpecNode(
        id=node_id,
        type=str(node_type),
        rect=list(rect),
        content=str(content) if isinstance(content, str) and content != "" else None,
        asset_path=assets.get(node_id) if node_type == "Image" else None,
        style=style,
        actions=uitest.actions_for_rect(rect, regions),
        children=children,
    )


def dump_to_spec(
    dump: dict[str, Any],
    *,
    assets: dict[int, str] | None = None,
    uitest_dump: dict[str, Any] | None = None,
) -> InputSpec:
    page: PageInfo = parse_page_info(dump)
    assets = assets or {}
    regions = uitest.collect_regions(uitest_dump, bundle_name=page.bundle_name) if uitest_dump else []
    root = _convert_node(page.root, assets, regions)
    if root is None:
        raise ValueError("failed to convert the dump root node")
    return InputSpec(
        bundle_name=page.bundle_name,
        page_url=page.page_url,
        resolution=page.resolution,
        viewport=Viewport(width=page.width, height=page.height),
        root=root,
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Convert a real-device dump into an App Generation Spec")
    parser.add_argument("dump", help="path to hidumper pageInfo dump JSON")
    parser.add_argument("-s", "--screenshot", help="device screenshot; triggers auto-cropping into <out>/assets")
    parser.add_argument("-a", "--assets-map", help="JSON file {component_id: asset relpath} (from collector.cropper)")
    parser.add_argument("-u", "--uitest", help="optional uitest dumpLayout JSON for action flags")
    parser.add_argument("-o", "--out", default="out/input_spec.json", help="output path (default: out/input_spec.json)")
    args = parser.parse_args()

    assets: dict[int, str] = {}
    if args.assets_map:
        assets = {int(k): v for k, v in json.loads(Path(args.assets_map).read_text(encoding="utf-8")).items()}
    elif args.screenshot:
        out_dir = Path(args.out).parent
        assets = crop_assets(parse_page_info(load_dump(args.dump)), args.screenshot, out_dir)

    uitest_dump = None
    if args.uitest:
        uitest_dump = json.loads(Path(args.uitest).read_text(encoding="utf-8"))

    spec = dump_to_spec(load_dump(args.dump), assets=assets, uitest_dump=uitest_dump)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(spec.model_dump_json(exclude_none=True, indent=2), encoding="utf-8")
    print(f"wrote {out}: root={spec.root.type}, assets={len(assets)},"
          f" uitest_regions={len(uitest.collect_regions(uitest_dump)) if uitest_dump else 0}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

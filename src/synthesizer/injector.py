"""Injection & augmentation engine (arch.md §5.2, M4).

Turns one packaged app bundle into N data variants:

1. **Templatize** — walk the Input Spec and record every Text (content) and
   Image (asset_path) node as a replaceable slot keyed by component id.
2. **Inject** — a `dataset.json` lists variants, each mapping slot ids to new
   text or new image files. Every variant is materialized as a self-contained
   bundle copy (`<app_id>__vNNN`) with a rewritten `spec.json`, so the runtime
   renderer re-renders it unchanged — geometry/style come from the device dump
   and stay stable while content varies.
3. **Collect** (optional) — batch-run `cleaner.gym_cleaner` over the variant
   bundles to mass-produce synthetic `cue_data.json` files.

dataset.json format::

    {
      "variants": [
        {"text": {"141": "新标题"}, "images": {"155": "photos/a.png"}},
        {"text": {"141": "另一标题"}}
      ]
    }

Image paths are resolved relative to the dataset file; PNG/JPEG/WebP only.
List-item replication (增减列表项) is not implemented yet.
"""

from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path
from typing import Any

from schema.input_spec import InputSpec

_IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".webp"}


def _walk(node: dict[str, Any]) -> list[dict[str, Any]]:
    out = [node]
    for child in node.get("children", []):
        out.extend(_walk(child))
    return out


def templatize(spec: InputSpec) -> dict[str, Any]:
    """Record every replaceable content slot of a spec, keyed by component id."""
    slots: dict[str, dict[str, str]] = {}
    for node in _walk(spec.root.model_dump()):
        if node.get("type") == "Text" and node.get("content"):
            slots[str(node["id"])] = {"kind": "text", "value": node["content"]}
        elif node.get("type") == "Image" and node.get("asset_path"):
            slots[str(node["id"])] = {"kind": "image", "value": node["asset_path"]}
    return {"bundle": spec.bundle_name, "page_url": spec.page_url, "slots": slots}


def _rewrite_spec(spec: InputSpec, text_map: dict[str, str], image_map: dict[str, str]) -> InputSpec:
    data = spec.model_dump()
    for node in _walk(data["root"]):
        node_id = str(node.get("id"))
        if node.get("type") == "Text" and node_id in text_map:
            node["content"] = text_map[node_id]
        if node.get("type") == "Image" and node_id in image_map:
            node["asset_path"] = image_map[node_id]
    return InputSpec.model_validate(data)


def generate_variants(bundle_dir: str | Path, dataset_path: str | Path, out_root: str | Path) -> list[Path]:
    """Materialize one bundle copy per dataset variant; returns the variant dirs."""
    bundle_dir = Path(bundle_dir)
    dataset_path = Path(dataset_path)
    out_root = Path(out_root)

    spec = InputSpec.model_validate_json((bundle_dir / "spec.json").read_text(encoding="utf-8"))
    dataset = json.loads(dataset_path.read_text(encoding="utf-8"))
    variants = dataset.get("variants")
    if not isinstance(variants, list) or not variants:
        raise ValueError("dataset.json must contain a non-empty `variants` list")

    app_path = bundle_dir / "app.json"
    app = json.loads(app_path.read_text(encoding="utf-8")) if app_path.exists() else {}

    generated: list[Path] = []
    for index, variant in enumerate(variants, start=1):
        text_map = {str(k): str(v) for k, v in (variant.get("text") or {}).items()}
        image_requests = {str(k): Path(v) for k, v in (variant.get("images") or {}).items()}

        variant_dir = out_root / f"{bundle_dir.name}__v{index:03d}"
        if variant_dir.exists():
            shutil.rmtree(variant_dir)
        shutil.copytree(bundle_dir, variant_dir)

        # copy replacement images into the variant's assets and remap asset paths
        image_map: dict[str, str] = {}
        for slot_id, src in image_requests.items():
            if not src.is_absolute():
                src = dataset_path.parent / src
            if src.suffix.lower() not in _IMAGE_SUFFIXES:
                raise ValueError(f"unsupported image type for slot {slot_id}: {src}")
            if not src.is_file():
                raise FileNotFoundError(f"image for slot {slot_id} not found: {src}")
            dest_rel = f"assets/images/{slot_id}__v{index:03d}{src.suffix.lower()}"
            (variant_dir / dest_rel).parent.mkdir(parents=True, exist_ok=True)
            shutil.copy(src, variant_dir / dest_rel)
            image_map[slot_id] = dest_rel

        new_spec = _rewrite_spec(spec, text_map, image_map)
        (variant_dir / "spec.json").write_text(
            new_spec.model_dump_json(exclude_none=True, indent=2), encoding="utf-8"
        )
        app["variant"] = index
        (variant_dir / "app.json").write_text(json.dumps(app, ensure_ascii=False, indent=2), encoding="utf-8")
        generated.append(variant_dir)
    return generated


def main() -> int:
    parser = argparse.ArgumentParser(description="Inject data variants into a packaged app bundle")
    parser.add_argument("bundle", help="base app bundle directory (harmonyos-apps/<app>)")
    parser.add_argument("--dataset", help="dataset.json with a `variants` list")
    parser.add_argument("--template", help="write a template dataset (slots skeleton) to this path and exit")
    parser.add_argument("-o", "--out", default="harmonyos-apps", help="output root for variant bundles")
    parser.add_argument("--collect", metavar="DIR", help="after generating, gym-clean every variant into DIR")
    args = parser.parse_args()

    if args.template:
        spec = InputSpec.model_validate_json((Path(args.bundle) / "spec.json").read_text(encoding="utf-8"))
        template = templatize(spec)
        Path(args.template).parent.mkdir(parents=True, exist_ok=True)
        Path(args.template).write_text(json.dumps(template, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"slots template -> {args.template} ({len(template['slots'])} slots)")
        return 0

    if not args.dataset:
        parser.error("either --dataset or --template is required")

    variants = generate_variants(args.bundle, args.dataset, args.out)
    print(f"generated {len(variants)} variant bundles under {args.out}")
    for v in variants:
        print(f"  - {v}")

    if args.collect:
        from cleaner.gym_cleaner import collect_many

        cues = collect_many(variants, args.collect)
        total = sum(len(c.components) for c in cues)
        print(f"collected {len(cues)} synthetic cue_data files -> {args.collect} ({total} components)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

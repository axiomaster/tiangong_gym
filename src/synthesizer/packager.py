"""App packager (arch.md §5 / §7 synthesizer layer).

Assembles a self-contained virtual app bundle under `harmonyos-apps/<bundle_name>/`:

    harmonyos-apps/<bundle_name>/
    ├── app.json          # manifest (bundle/page/viewport metadata)
    ├── spec.json         # App Generation Spec (renderer input, schema.input_spec)
    ├── index.html        # no-build renderer entry
    ├── renderer.js/.css  # generic ArkUI->DOM renderer (copied from renderer/)
    └── assets/images/    # screenshot crops (collector.cropper)

Serve the bundle with any static file server (`python -m http.server` from the
bundle dir) and open index.html — the page fetches spec.json and renders.
"""

from __future__ import annotations

import argparse
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from cleaner.spec_converter import dump_to_spec
from collector.cropper import crop_assets
from collector.pageinfo import load_dump, parse_page_info

RENDERER_DIR = Path(__file__).parent / "renderer"
RENDERER_FILES = ("index.html", "renderer.js", "renderer.css")


def package_app(
    dump: dict[str, Any],
    *,
    screenshot: str | Path | None = None,
    uitest_dump: dict[str, Any] | None = None,
    out_root: str | Path = "harmonyos-apps",
    app_id: str | None = None,
    source: str | None = None,
) -> Path:
    """Build one virtual app bundle; returns the bundle directory."""
    page = parse_page_info(dump)
    app_id = app_id or page.bundle_name
    if not app_id:
        raise ValueError("cannot derive app id: dump has no bundleName and no --app-id given")

    bundle = Path(out_root) / app_id
    bundle.mkdir(parents=True, exist_ok=True)

    assets: dict[int, str] = {}
    if screenshot is not None:
        assets = crop_assets(page, screenshot, bundle)

    spec = dump_to_spec(dump, assets=assets, uitest_dump=uitest_dump)
    (bundle / "spec.json").write_text(spec.model_dump_json(exclude_none=True, indent=2), encoding="utf-8")

    for name in RENDERER_FILES:
        shutil.copy(RENDERER_DIR / name, bundle / name)

    manifest = {
        "bundle_name": spec.bundle_name,
        "page_url": spec.page_url,
        "viewport": {"width": spec.viewport.width, "height": spec.viewport.height},
        "resolution": spec.resolution,
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "source": source,
        "assets": len(assets),
    }
    (bundle / "app.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    return bundle


def main() -> int:
    parser = argparse.ArgumentParser(description="Package a real-device dump into a virtual app bundle")
    parser.add_argument("dump", help="path to hidumper pageInfo dump JSON")
    parser.add_argument("-s", "--screenshot", help="device screenshot; triggers auto-cropping into the bundle")
    parser.add_argument("-u", "--uitest", help="optional uitest dumpLayout JSON for action flags")
    parser.add_argument("-o", "--out", default="harmonyos-apps", help="output root (default: harmonyos-apps)")
    parser.add_argument("--app-id", help="bundle directory name (default: bundleName from the dump)")
    args = parser.parse_args()

    uitest_dump = None
    if args.uitest:
        uitest_dump = json.loads(Path(args.uitest).read_text(encoding="utf-8"))

    bundle = package_app(
        load_dump(args.dump),
        screenshot=args.screenshot,
        uitest_dump=uitest_dump,
        out_root=args.out,
        app_id=args.app_id,
        source=args.dump,
    )
    print(f"packaged virtual app -> {bundle}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

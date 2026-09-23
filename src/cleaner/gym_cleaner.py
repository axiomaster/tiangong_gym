"""Gym cleaner (arch.md §7, M3): rendered virtual app DOM -> `cue_data.json`.

The twin of `device_cleaner`: where the device cleaner normalizes hidumper dumps,
this scrapes the Path-B renderer's DOM (served bundle) with Playwright and emits
the same protocol, so `verifier.diff_engine` can compare both sides.

DOM contract (renderer.js): every rendered node carries `[data-component-id]`,
`[data-node-type]`, optional `[data-actions]`, and `window.__SPEC_RENDERED__`
flips true when the tree is mounted.

Filtering mirrors `device_cleaner` so both sides describe the same default
state: visible (non-hidden, non-zero-area) components intersecting the stage
viewport, restricted to Text (non-blank content) / Image plus any node that
carries actions.
"""

from __future__ import annotations

import json
import threading
from collections.abc import Iterator
from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

from schema.cue_data import Component, CueData, Viewport

#: JS executed in the page: scrape all rendered nodes with their stage-relative rects.
_SCRAPE_JS = """
() => {
  const stage = document.querySelector('.ark-stage');
  if (!stage) return null;
  const sr = stage.getBoundingClientRect();
  const comps = [];
  for (const el of stage.querySelectorAll('[data-component-id]')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) continue;
    comps.push({
      id: Number(el.dataset.componentId),
      type: el.dataset.nodeType,
      // container nodes must not leak descendant text (device side has empty content there)
      content: el.dataset.nodeType === 'Text' ? (el.textContent || '') : '',
      rect: [r.left - sr.left, r.top - sr.top, r.right - sr.left, r.bottom - sr.top]
        .map(v => Math.round(v * 100) / 100),
      actions: (el.dataset.actions || '').split(',').filter(Boolean),
    });
  }
  return { left: sr.left, top: sr.top, width: sr.width, height: sr.height, components: comps };
}
"""


@contextmanager
def serve_dir(path: str | Path, port: int = 0) -> Iterator[str]:
    """Serve a directory over loopback HTTP (bundles must be served; file:// fails)."""
    handler = partial(SimpleHTTPRequestHandler, directory=str(path))
    server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{server.server_address[1]}"
    finally:
        server.shutdown()
        server.server_close()


def wait_rendered(page: Any, timeout_ms: int = 15_000) -> None:
    page.wait_for_function("window.__SPEC_RENDERED__ === true", timeout=timeout_ms)


def _intersects_viewport(rect: tuple[float, float, float, float], width: float, height: float) -> bool:
    x1, y1, x2, y2 = rect
    ix1, iy1 = max(x1, 0.0), max(y1, 0.0)
    ix2, iy2 = min(x2, width), min(y2, height)
    return ix2 - ix1 > 0 and iy2 - iy1 > 0


def scrape_page(page: Any, spec: dict[str, Any]) -> list[Component]:
    """Extract cue components from a rendered page, mirroring device_cleaner filters."""
    raw = page.evaluate(_SCRAPE_JS)
    if raw is None:
        raise RuntimeError("rendered page has no .ark-stage — was renderSpec run?")
    vp = spec["viewport"]
    scale = raw["width"] / vp["width"] if vp["width"] else 1.0

    components: list[Component] = []
    for item in raw["components"]:
        if item["type"] == "Text":
            if not str(item["content"]).strip():
                continue
        elif item["type"] != "Image" and not item["actions"]:
            continue
        x1, y1, x2, y2 = (round(v / scale, 2) for v in item["rect"])
        if not _intersects_viewport((x1, y1, x2, y2), vp["width"], vp["height"]):
            continue
        components.append(
            Component(
                id=int(item["id"]),
                type=str(item["type"]),
                content=str(item["content"]),
                bbox=[x1, y1, x2, y1, x2, y2, x1, y2],
                actions=list(item["actions"]),
            )
        )
    return components


def clean_page(
    page: Any,
    spec: dict[str, Any],
    *,
    app: dict[str, Any] | None = None,
    screenshot: str | None = None,
) -> CueData:
    """Scrape an already-loaded page into a CueData. `app` is the bundle app.json."""
    app = app or {}
    return CueData(
        bundle_name=str(app.get("bundle_name") or spec.get("bundle_name") or ""),
        page_url=str(app.get("page_url") or spec.get("page_url") or ""),
        viewport=Viewport(**spec["viewport"]),
        screenshot=screenshot,
        components=scrape_page(page, spec),
    )


def clean_bundle(
    bundle: str | Path,
    browser: Any = None,
    *,
    screenshot_path: str | Path | None = None,
) -> CueData:
    """Serve one packaged app bundle, render it headless, and clean it to CueData.

    Pass an existing Playwright `browser` to reuse it across many bundles (batch).
    """
    bundle = Path(bundle)
    spec = json.loads((bundle / "spec.json").read_text(encoding="utf-8"))
    app_path = bundle / "app.json"
    app = json.loads(app_path.read_text(encoding="utf-8")) if app_path.exists() else None

    if browser is None:
        from playwright.sync_api import sync_playwright

        with sync_playwright() as p:
            b = p.chromium.launch()
            try:
                return _clean_with_browser(b, bundle, spec, app, screenshot_path)
            finally:
                b.close()
    return _clean_with_browser(browser, bundle, spec, app, screenshot_path)


def _clean_with_browser(browser: Any, bundle: Path, spec: dict, app: dict | None, screenshot_path) -> CueData:
    context = browser.new_context(
        viewport={"width": int(spec["viewport"]["width"]), "height": int(spec["viewport"]["height"])},
        device_scale_factor=1,
    )
    try:
        with serve_dir(bundle) as base:
            page = context.new_page()
            try:
                page.goto(base + "/index.html")
                wait_rendered(page)
                shot_name = None
                if screenshot_path is not None:
                    page.screenshot(path=str(screenshot_path), full_page=True)
                    shot_name = Path(screenshot_path).name
                return clean_page(page, spec, app=app, screenshot=shot_name)
            finally:
                page.close()
    finally:
        context.close()


def collect_many(bundles: list[str | Path], out_dir: str | Path, browser: Any = None) -> list[CueData]:
    """Batch-clean many variant bundles into `<out_dir>/gym_cue_<n>.json` (M4 loop)."""
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    results: list[CueData] = []
    own_browser = browser is None
    if own_browser:
        from playwright.sync_api import sync_playwright

        with sync_playwright() as p:
            browser = p.chromium.launch()
            try:
                return collect_many(bundles, out_dir, browser=browser)
            finally:
                browser.close()
    for i, bundle in enumerate(bundles, start=1):
        cue = clean_bundle(bundle, browser)
        (out_dir / f"gym_cue_{i:03d}.json").write_text(
            cue.model_dump_json(exclude_none=True, indent=2), encoding="utf-8"
        )
        results.append(cue)
    return results


def main() -> int:
    import argparse

    parser = argparse.ArgumentParser(description="Clean a rendered virtual app bundle into cue_data.json")
    parser.add_argument("bundle", help="packaged app bundle directory (harmonyos-apps/<app>)")
    parser.add_argument("-o", "--out", default="out/gym_cue_data.json", help="output path")
    parser.add_argument("--screenshot", help="optional full-page screenshot path")
    args = parser.parse_args()

    cue = clean_bundle(args.bundle, screenshot_path=args.screenshot)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(cue.model_dump_json(exclude_none=True, indent=2), encoding="utf-8")
    texts = sum(1 for c in cue.components if c.type == "Text")
    images = sum(1 for c in cue.components if c.type == "Image")
    print(f"wrote {out}: {len(cue.components)} components ({texts} Text, {images} Image)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

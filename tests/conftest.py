"""Shared synthetic fixtures mimicking real hidumper capture quirks
(double-encoded pageInfo, $-prefixed keys, string-typed numbers, "NONE" sentinels)."""

from __future__ import annotations

import json
import threading
from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

import pytest

VIEW_W, VIEW_H, RES = 400.0, 800.0, 3.25


@contextmanager
def serve_dir(path: Path):
    """Serve a bundle directory over loopback HTTP (bundles must not use file://)."""
    handler = partial(SimpleHTTPRequestHandler, directory=str(path))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{server.server_address[1]}"
    finally:
        server.shutdown()
        server.server_close()


def load_app(page, url: str) -> None:
    page.goto(url)
    page.wait_for_function("window.__SPEC_RENDERED__ === true", timeout=15_000)


@pytest.fixture(scope="session")
def browser():
    sync_playwright = pytest.importorskip("playwright.sync_api").sync_playwright
    try:
        with sync_playwright() as p:
            b = p.chromium.launch()
            yield b
            b.close()
    except Exception as exc:  # noqa: BLE001 — any launch failure means "skip", not "fail"
        pytest.skip(f"chromium unavailable: {exc}")


@pytest.fixture
def page(browser):
    context = browser.new_context()
    yield context.new_page()
    context.close()


def make_dump() -> dict[str, Any]:
    tree = {
        "$type": "root",
        "width": f"{VIEW_W:.6f}",
        "height": f"{VIEW_H:.6f}",
        "$resolution": f"{RES:.6f}",
        "bundleName": "com.example.app",
        "pageUrl": "pages/Index",
        "$children": [
            {
                "$ID": 6,
                "$type": "Stack",
                "$rect": "[0.00, 0.00],[400.00,800.00]",
                "$attrs": {"backgroundColor": "#FFFFFFFF", "touchable": "True"},
                "$children": [
                    {
                        "$ID": 141,
                        "$type": "Text",
                        "$rect": "[97.00, 100.00],[168.00,140.00]",
                        "$attrs": {
                            "content": "首页",
                            "fontSize": "14.00fp",
                            "fontColor": "#CC000000",
                            "fontWeight": "500",
                            "accessibilityText": "NONE",
                        },
                    },
                    {
                        "$ID": 155,
                        "$type": "Image",
                        "$rect": "[20.00, 200.00],[300.00,400.00]",
                        "$attrs": {"src": "resource:///939524400.svg", "objectFit": "ImageFit.Cover"},
                    },
                    {
                        "$ID": 300,
                        "$type": "Text",
                        "$rect": "[0.00, 0.00],[50.00,20.00]",
                        "$attrs": {"content": "ghost", "visibility": "Visibility.Hidden"},
                    },
                    {"$ID": 301, "$type": "Text", "$rect": "[0.00, 30.00],[50.00,50.00]", "$attrs": {"content": ""}},
                    # fully off-screen image -> cropper must skip it
                    {
                        "$ID": 400,
                        "$type": "Image",
                        "$rect": "[500.00, 0.00],[600.00,100.00]",
                        "$attrs": {"src": "resource:///1.png"},
                    },
                    # node whose backgroundImage points at a drawable -> cropper picks it up
                    {
                        "$ID": 410,
                        "$type": "Stack",
                        "$rect": "[0.00, 700.00],[400.00,800.00]",
                        "$attrs": {"backgroundImage": "resource:///bg.png"},
                    },
                ],
            }
        ],
    }
    return {
        "bundleName": "com.example.app",
        "pageInfo": json.dumps(tree),
        "retCode": 0,
        "treeType": 1,
        "behaviorInfo": {"eventId": "evt"},
    }


def make_uitest_dump() -> dict[str, Any]:
    """Defensive-format uitest dumpLayout: clickable Text, tappable Stack, scrollable List, TextInput."""
    return {
        "attributes": {"type": "root", "bounds": "[0,0][400,800]"},
        "children": [
            {
                "attributes": {"type": "Text", "bounds": "[97,100][168,140]", "clickable": "true"},
                "children": [],
            },
            {
                "attributes": {"type": "Stack", "bounds": "[10,500][100,600]", "clickable": "true", "longClickable": "true"},
                "children": [],
            },
            {
                "attributes": {"type": "List", "bounds": "[0,0][400,800]", "scrollable": "true"},
                "children": [],
            },
            {
                "attributes": {"type": "TextInput", "bounds": "[20,700][380,760]"},
                "children": [],
            },
        ],
    }


@pytest.fixture
def dump() -> dict[str, Any]:
    return make_dump()


@pytest.fixture
def uitest_dump() -> dict[str, Any]:
    return make_uitest_dump()

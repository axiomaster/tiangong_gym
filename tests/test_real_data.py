"""Smoke tests against the real-device captures in `reference/data/` + `docs/data`.

`reference/` is gitignored, so these skip silently on fresh clones.
"""

from __future__ import annotations

from pathlib import Path

import pytest

from cleaner.device_cleaner import dump_to_cue
from cleaner.spec_converter import dump_to_spec
from collector.cropper import crop_assets
from collector.pageinfo import load_dump, parse_page_info

DUMP = Path("reference/data/pageInfo.json")
SCREENSHOT = Path("docs/data")

pytestmark = pytest.mark.skipif(not DUMP.exists(), reason="reference/data not available (gitignored)")


@pytest.fixture(scope="module")
def page():
    return parse_page_info(load_dump(DUMP))


def test_real_dump_parses(page):
    assert page.bundle_name == "com.xingin.xhs_hos"
    assert page.page_url == "pages/Index"
    assert (page.width, page.height) == (1320.0, 2848.0)
    assert page.resolution == pytest.approx(3.375)


def test_real_tree_size(page):
    nodes = list(page.iter_nodes())
    assert len(nodes) > 200


def test_real_clean_produces_valid_cue(page):
    cue = dump_to_cue(load_dump(DUMP))
    assert cue.bundle_name == "com.xingin.xhs_hos"
    assert cue.viewport.width == 1320
    texts = [c for c in cue.components if c.type == "Text"]
    images = [c for c in cue.components if c.type == "Image"]
    # only default-state (viewport-visible) components are emitted; the dump's
    # virtualized off-screen preload nodes are dropped
    assert len(texts) > 10
    assert len(images) >= 15
    assert all(c.content for c in texts)
    # canonical bbox: every bbox starts at its top-left corner
    for c in cue.components:
        x_tl, y_tl, *_ = c.bbox
        assert x_tl == min(c.bbox[0], c.bbox[6])
        assert y_tl == min(c.bbox[1], c.bbox[7])
    # text content survives the round trip
    assert any("评论" in c.content or "首页" in c.content for c in texts)


def test_real_spec_conversion(page):
    spec = dump_to_spec(load_dump(DUMP), assets={})
    assert spec.root.rect == [0.0, 0.0, 1320.0, 2848.0]
    assert len(list(spec.root.children)) > 0


@pytest.mark.skipif(not SCREENSHOT.exists(), reason="docs/data screenshot not available")
def test_real_cropper(page, tmp_path):
    mapping = crop_assets(page, SCREENSHOT, tmp_path)
    assert len(mapping) > 10
    for rel in mapping.values():
        assert (tmp_path / rel).exists()

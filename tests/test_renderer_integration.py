"""Browser integration tests for the Path-B runtime renderer (M2).

Requires the playwright dev dependency and a chromium install
(`uv run playwright install chromium`); tests skip gracefully otherwise.
"""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from synthesizer.packager import package_app
from tests.conftest import load_app, serve_dir


def walk_spec(node: dict):
    yield node
    for child in node.get("children", []):
        yield from walk_spec(child)


def count_spec_nodes(node: dict) -> int:
    return sum(1 for _ in walk_spec(node))


def test_synthetic_app_renders(dump, uitest_dump, tmp_path, page):
    from PIL import Image

    img = Image.new("RGB", (400, 800), color=(66, 66, 66))
    img.save(tmp_path / "shot.jpeg", format="JPEG")

    bundle = package_app(dump, screenshot=tmp_path / "shot.jpeg", out_root=tmp_path / "apps", uitest_dump=uitest_dump)
    spec = json.loads((bundle / "spec.json").read_text(encoding="utf-8"))

    with serve_dir(bundle) as base:
        load_app(page, base + "/index.html")

        # every spec node becomes a tagged DOM node
        n_dom = page.locator("[data-component-id]").count()
        assert n_dom == count_spec_nodes(spec["root"])

        # actions propagate into the DOM contract
        assert page.locator('[data-component-id="141"]').get_attribute("data-actions") == "click"

        # text content + fp->px font scaling (14fp x 3.25 = 45.5px)
        text = page.locator('[data-component-id="141"]')
        assert text.text_content() == "首页"
        assert text.evaluate("el => getComputedStyle(el).fontSize") == "45.5px"

        # bound image loads its crop (crop rect is 280x200)
        image = page.locator('[data-component-id="155"]')
        assert image.get_attribute("src") == "assets/images/155.png"
        assert image.evaluate("el => el.naturalWidth") == 280

        # visibility Hidden -> display:none; off-screen image has no asset/src
        assert page.locator('[data-component-id="300"]').is_hidden()
        assert page.locator('[data-component-id="400"]').get_attribute("src") is None

        # background-crop rewrite renders as CSS background
        bg = page.locator('[data-component-id="410"]')
        assert "url(" in bg.evaluate("el => getComputedStyle(el).backgroundImage")


@pytest.mark.skipif(
    not Path("reference/data/pageInfo.json").exists() or not Path("docs/data").exists(),
    reason="reference/data or docs/data not available (gitignored)",
)
def test_real_app_renders(tmp_path, page):
    bundle = package_app(
        json.loads(Path("reference/data/pageInfo.json").read_text(encoding="utf-8")),
        screenshot="docs/data",
        out_root=tmp_path / "apps",
        app_id="xhs_detail",
    )
    spec = json.loads((bundle / "spec.json").read_text(encoding="utf-8"))

    with serve_dir(bundle) as base:
        load_app(page, base + "/index.html")

        n_dom = page.locator("[data-component-id]").count()
        assert n_dom == count_spec_nodes(spec["root"])

        # text fidelity: every non-empty spec Text reaches the DOM verbatim
        n_spec_texts = sum(1 for n in walk_spec(spec["root"]) if n["type"] == "Text" and n.get("content"))
        n_dom_texts = page.evaluate(
            "() => [...document.querySelectorAll('[data-node-type=Text]')]"
            ".filter(el => el.textContent.trim() !== '').length"
        )
        assert n_dom_texts == n_spec_texts

        # all bound Image crops load (broken srcs would mean a bad assets map)
        n_img_assets = sum(1 for n in walk_spec(spec["root"]) if n["type"] == "Image" and n.get("asset_path"))
        stats = page.evaluate(
            "() => { const imgs = [...document.querySelectorAll('img.ark-node')];"
            " return { withSrc: imgs.filter(i => i.getAttribute('src')).length,"
            " broken: imgs.filter(i => i.getAttribute('src') && i.naturalWidth === 0).length }; }"
        )
        assert stats["withSrc"] == n_img_assets > 0
        assert stats["broken"] == 0

        shot = tmp_path / "real_render.png"
        page.screenshot(path=str(shot), full_page=True)
        assert shot.stat().st_size > 100_000


@pytest.mark.skipif(
    not Path("harmonyos-apps/com.huawei.hmos.vmall/spec.json").exists(),
    reason="vmall virtual app not packaged yet",
)
def test_vmall_app_renders(page, tmp_path):
    bundle = Path("harmonyos-apps/com.huawei.hmos.vmall")
    spec = json.loads((bundle / "spec.json").read_text(encoding="utf-8"))

    with serve_dir(bundle) as base:
        load_app(page, base + "/index.html")

        n_dom = page.locator("[data-component-id]").count()
        assert n_dom == count_spec_nodes(spec["root"])

        rendered_text = page.evaluate("() => document.body.innerText")
        assert "首页" in rendered_text
        assert "华为手机" in rendered_text or "分类" in rendered_text

        shot = tmp_path / "vmall_render.png"
        page.screenshot(path=str(shot), full_page=True)
        assert shot.stat().st_size > 10_000


@pytest.mark.skipif(
    not Path("harmonyos-apps/com.taobao.taobao4hmos/spec.json").exists(),
    reason="taobao virtual app not packaged yet",
)
def test_taobao_app_renders(page, tmp_path):
    bundle = Path("harmonyos-apps/com.taobao.taobao4hmos")
    spec = json.loads((bundle / "spec.json").read_text(encoding="utf-8"))

    with serve_dir(bundle) as base:
        load_app(page, base + "/index.html")

        n_dom = page.locator("[data-component-id]").count()
        assert n_dom == count_spec_nodes(spec["root"])

        rendered_text = page.evaluate("() => document.body.innerText")
        assert "推荐" in rendered_text
        assert "搜索" in rendered_text or "百亿补贴" in rendered_text

        shot = tmp_path / "taobao_render.png"
        page.screenshot(path=str(shot), full_page=True)
        assert shot.stat().st_size > 10_000


@pytest.mark.skipif(
    not Path("harmonyos-apps/com.ss.hm.ugc.aweme/spec.json").exists(),
    reason="douyin virtual app not packaged yet",
)
def test_douyin_app_renders(page, tmp_path):
    bundle = Path("harmonyos-apps/com.ss.hm.ugc.aweme")
    spec = json.loads((bundle / "spec.json").read_text(encoding="utf-8"))

    with serve_dir(bundle) as base:
        load_app(page, base + "/index.html")

        n_dom = page.locator("[data-component-id]").count()
        assert n_dom == count_spec_nodes(spec["root"])

        rendered_text = page.evaluate("() => document.body.innerText")
        assert "推荐" in rendered_text
        assert "首页" in rendered_text and "朋友" in rendered_text

        shot = tmp_path / "douyin_render.png"
        page.screenshot(path=str(shot), full_page=True)
        assert shot.stat().st_size > 10_000


@pytest.mark.skipif(
    not Path("harmonyos-apps/com.xunmeng.pinduoduo.hos/spec.json").exists(),
    reason="pinduoduo virtual app not packaged yet",
)
def test_pinduoduo_app_renders(page, tmp_path):
    bundle = Path("harmonyos-apps/com.xunmeng.pinduoduo.hos")
    spec = json.loads((bundle / "spec.json").read_text(encoding="utf-8"))

    with serve_dir(bundle) as base:
        load_app(page, base + "/index.html")

        n_dom = page.locator("[data-component-id]").count()
        assert n_dom == count_spec_nodes(spec["root"])

        rendered_text = page.evaluate("() => document.body.innerText")
        assert "推荐" in rendered_text
        assert "百亿补贴" in rendered_text or "首页" in rendered_text

        shot = tmp_path / "pinduoduo_render.png"
        page.screenshot(path=str(shot), full_page=True)
        assert shot.stat().st_size > 10_000


@pytest.mark.skipif(
    not Path("harmonyos-apps/com.sankuai.hmeituan/spec.json").exists(),
    reason="meituan virtual app not packaged yet",
)
def test_meituan_app_renders(page, tmp_path):
    bundle = Path("harmonyos-apps/com.sankuai.hmeituan")
    spec = json.loads((bundle / "spec.json").read_text(encoding="utf-8"))

    with serve_dir(bundle) as base:
        load_app(page, base + "/index.html")

        n_dom = page.locator("[data-component-id]").count()
        assert n_dom == count_spec_nodes(spec["root"])

        rendered_text = page.evaluate("() => document.body.innerText")
        assert "外卖" in rendered_text
        assert "团购" in rendered_text or "推荐" in rendered_text

        shot = tmp_path / "meituan_render.png"
        page.screenshot(path=str(shot), full_page=True)
        assert shot.stat().st_size > 10_000


@pytest.mark.skipif(
    not Path("harmonyos-apps/com.tencent.mtthm/spec.json").exists(),
    reason="qqbrowser virtual app not packaged yet",
)
def test_qqbrowser_app_renders(page, tmp_path):
    bundle = Path("harmonyos-apps/com.tencent.mtthm")
    spec = json.loads((bundle / "spec.json").read_text(encoding="utf-8"))

    with serve_dir(bundle) as base:
        load_app(page, base + "/index.html")

        n_dom = page.locator("[data-component-id]").count()
        assert n_dom == count_spec_nodes(spec["root"])

        shot = tmp_path / "qqbrowser_render.png"
        page.screenshot(path=str(shot), full_page=True)
        assert shot.stat().st_size > 10_000


@pytest.mark.skipif(
    not Path("harmonyos-apps/com.baidu.netdisk.hmos/spec.json").exists(),
    reason="baidunetdisk virtual app not packaged yet",
)
def test_baidunetdisk_app_renders(page, tmp_path):
    bundle = Path("harmonyos-apps/com.baidu.netdisk.hmos")
    spec = json.loads((bundle / "spec.json").read_text(encoding="utf-8"))

    with serve_dir(bundle) as base:
        load_app(page, base + "/index.html")

        n_dom = page.locator("[data-component-id]").count()
        assert n_dom == count_spec_nodes(spec["root"])

        rendered_text = page.evaluate("() => document.body.innerText")
        assert "相册" in rendered_text
        assert "首页" in rendered_text or "文件" in rendered_text

        shot = tmp_path / "baidunetdisk_render.png"
        page.screenshot(path=str(shot), full_page=True)
        assert shot.stat().st_size > 10_000



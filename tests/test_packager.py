from __future__ import annotations

import json

from PIL import Image

from synthesizer.packager import package_app


def make_screenshot(tmp_path):
    img = Image.new("RGB", (400, 800), color=(66, 66, 66))
    path = tmp_path / "shot.jpeg"
    img.save(path, format="JPEG")
    return path


def test_bundle_structure(dump, tmp_path):
    screenshot = make_screenshot(tmp_path)
    bundle = package_app(dump, screenshot=screenshot, out_root=tmp_path / "apps")

    assert bundle == tmp_path / "apps" / "com.example.app"
    for name in ("app.json", "spec.json", "index.html", "renderer.js", "renderer.css"):
        assert (bundle / name).exists(), f"missing {name}"
    assert (bundle / "assets" / "images" / "155.png").exists()


def test_spec_json_binds_assets(dump, tmp_path):
    screenshot = make_screenshot(tmp_path)
    bundle = package_app(dump, screenshot=screenshot, out_root=tmp_path / "apps")
    spec = json.loads((bundle / "spec.json").read_text(encoding="utf-8"))

    assert spec["bundle_name"] == "com.example.app"
    assert spec["viewport"] == {"width": 400.0, "height": 800.0}

    stack = spec["root"]["children"][0]
    image = next(n for n in stack["children"] if n["id"] == 155)
    assert image["asset_path"] == "assets/images/155.png"

    # non-Image node with a cropped background gets a url() rewrite
    bg_stack = next(n for n in stack["children"] if n["id"] == 410)
    assert bg_stack["style"]["backgroundImage"] == "url(assets/images/410.png)"


def test_manifest(dump, tmp_path):
    screenshot = make_screenshot(tmp_path)
    bundle = package_app(dump, screenshot=screenshot, out_root=tmp_path / "apps", source="x/pageInfo.json")
    manifest = json.loads((bundle / "app.json").read_text(encoding="utf-8"))

    assert manifest["bundle_name"] == "com.example.app"
    assert manifest["page_url"] == "pages/Index"
    assert manifest["viewport"] == {"width": 400.0, "height": 800.0}
    assert manifest["resolution"] == 3.25
    assert manifest["source"] == "x/pageInfo.json"
    assert manifest["assets"] == 2  # Image 155 + bg Stack 410; off-screen 400 skipped
    assert "generated_at" in manifest


def test_without_screenshot_still_packages(dump, tmp_path):
    bundle = package_app(dump, out_root=tmp_path / "apps")
    spec = json.loads((bundle / "spec.json").read_text(encoding="utf-8"))
    stack = spec["root"]["children"][0]
    assert not (bundle / "assets").exists()
    assert all(n.get("asset_path") is None for n in stack["children"])


def test_app_id_override_and_empty_bundle_name(dump, tmp_path):
    bundle = package_app(dump, out_root=tmp_path / "apps", app_id="custom-app")
    assert bundle.name == "custom-app"

    import copy

    dump2 = copy.deepcopy(dump)
    tree = json.loads(dump2["pageInfo"])
    del tree["bundleName"]
    del dump2["bundleName"]  # top-level fallback would otherwise fill it in
    dump2["pageInfo"] = json.dumps(tree)
    import pytest

    with pytest.raises(ValueError):
        package_app(dump2, out_root=tmp_path / "apps")

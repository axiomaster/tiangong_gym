from __future__ import annotations

from PIL import Image

from collector.cropper import asset_relpath, collect_image_nodes, crop_assets
from collector.pageinfo import parse_page_info


def test_asset_relpath():
    assert asset_relpath(155) == "assets/images/155.png"


def test_collect_image_nodes(dump):
    page = parse_page_info(dump)
    found = dict(collect_image_nodes(page))
    assert 155 in found  # $type Image
    assert 410 in found  # backgroundImage resource
    assert 141 not in found  # Text
    assert found[155] == (20.0, 200.0, 300.0, 400.0)


def test_crop_assets_writes_files_and_clamps(dump, tmp_path):
    page = parse_page_info(dump)
    # solid 400x800 screenshot
    img = Image.new("RGB", (400, 800), color=(10, 20, 30))
    screenshot = tmp_path / "shot.jpeg"
    img.save(screenshot, format="JPEG")

    mapping = crop_assets(page, screenshot, tmp_path)
    assert set(mapping.values()) == {"assets/images/155.png", "assets/images/410.png"}
    assert 400 not in mapping  # fully off-screen -> skipped

    crop = Image.open(tmp_path / "assets" / "images" / "155.png")
    assert crop.size == (280, 200)
    assert crop.getpixel((0, 0)) == (10, 20, 30)

    bg = Image.open(tmp_path / "assets" / "images" / "410.png")
    assert bg.size == (400, 100)


def test_crop_assets_partial_clamp(dump, tmp_path):
    # Image node 155 partially outside the screenshot -> cropped region clamped
    page = parse_page_info(dump)
    page.root["$children"][0]["$children"][1]["$rect"] = "[300.00, 750.00],[500.00,900.00]"
    img = Image.new("RGB", (400, 800), color=(0, 0, 0))
    screenshot = tmp_path / "shot.jpeg"
    img.save(screenshot, format="JPEG")

    mapping = crop_assets(page, screenshot, tmp_path)
    assert mapping[155] == "assets/images/155.png"
    crop = Image.open(tmp_path / "assets" / "images" / "155.png")
    assert crop.size == (100, 50)  # clamped to screenshot bounds

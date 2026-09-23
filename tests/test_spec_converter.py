from __future__ import annotations

from cleaner.spec_converter import dump_to_spec
from schema.input_spec import InputSpec


def test_tree_preserved(dump):
    spec = dump_to_spec(dump)
    assert spec.bundle_name == "com.example.app"
    assert spec.resolution == 3.25
    assert (spec.viewport.width, spec.viewport.height) == (400.0, 800.0)
    assert spec.root.type == "root"
    assert spec.root.id == 0
    assert spec.root.rect == [0.0, 0.0, 400.0, 800.0]

    stack = spec.root.children[0]
    assert stack.type == "Stack"
    assert [c.type for c in stack.children] == ["Text", "Image", "Text", "Text", "Image", "Stack"]


def test_text_content_and_style(dump):
    spec = dump_to_spec(dump)
    text = spec.root.children[0].children[0]
    assert text.content == "首页"
    assert text.style == {"fontSize": 14.0, "fontColor": "#CC000000", "fontWeight": 500}
    assert text.asset_path is None


def test_asset_path_binding(dump):
    assets = {155: "assets/images/155.png", 410: "assets/images/410.png"}
    spec = dump_to_spec(dump, assets=assets)
    stack = spec.root.children[0]
    image = next(c for c in stack.children if c.id == 155)
    assert image.asset_path == "assets/images/155.png"

    # non-Image node with a cropped slice gets its backgroundImage rewritten to url()
    bg_node = next(c for c in stack.children if c.id == 410)
    assert bg_node.asset_path is None
    assert bg_node.style["backgroundImage"] == "url(assets/images/410.png)"


def test_actions_from_uitest(dump, uitest_dump):
    spec = dump_to_spec(dump, uitest_dump=uitest_dump)
    text = spec.root.children[0].children[0]
    assert text.actions == ["click"]
    assert spec.root.actions  # root covers the whole screen -> multiple regions


def test_hidden_nodes_kept_for_renderer(dump):
    # the spec keeps the full tree; visibility filtering is the renderer's business
    spec = dump_to_spec(dump)
    stack = spec.root.children[0]
    types = [c.type for c in stack.children]
    assert "Text" in types and "Image" in types


def test_roundtrip_json(dump):
    spec = dump_to_spec(dump)
    reparsed = InputSpec.model_validate_json(spec.model_dump_json(exclude_none=True))
    assert reparsed.root.children[0].children[0].content == "首页"

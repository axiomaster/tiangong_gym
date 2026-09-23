from __future__ import annotations

import json
from pathlib import Path

import pytest
from PIL import Image

from synthesizer.injector import generate_variants, templatize
from synthesizer.packager import package_app


@pytest.fixture
def base_bundle(dump, uitest_dump, tmp_path) -> Path:
    Image.new("RGB", (400, 800), color=(66, 66, 66)).save(tmp_path / "shot.jpeg", format="JPEG")
    return package_app(dump, screenshot=tmp_path / "shot.jpeg", uitest_dump=uitest_dump, out_root=tmp_path / "apps")


def test_templatize_lists_text_and_image_slots(base_bundle):
    spec = json.loads((base_bundle / "spec.json").read_text(encoding="utf-8"))
    from schema.input_spec import InputSpec

    template = templatize(InputSpec.model_validate(spec))
    assert template["bundle"] == "com.example.app"
    assert template["slots"]["141"] == {"kind": "text", "value": "首页"}
    assert template["slots"]["155"] == {"kind": "image", "value": "assets/images/155.png"}
    assert "6" not in template["slots"]  # containers without content/assets are not slots


def test_generate_variants_rewrites_spec_and_copies_assets(base_bundle, tmp_path):
    dataset = tmp_path / "dataset.json"
    new_img = tmp_path / "banner.png"
    Image.new("RGB", (280, 200), color=(200, 30, 30)).save(new_img, format="PNG")
    dataset.write_text(
        json.dumps(
            {
                "variants": [
                    {"text": {"141": "秒杀专场"}, "images": {"155": "banner.png"}},
                    {"text": {"141": "第二版"}},
                ]
            },
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )

    variants = generate_variants(base_bundle, dataset, tmp_path / "out")
    assert [v.name for v in variants] == ["com.example.app__v001", "com.example.app__v002"]

    v1_spec = json.loads((variants[0] / "spec.json").read_text(encoding="utf-8"))

    def find(nodes, id_):
        for n in nodes:
            if n["id"] == id_:
                return n
            hit = find(n.get("children", []), id_)
            if hit:
                return hit
        return None

    stack = v1_spec["root"]["children"][0]
    assert find(stack["children"], 141)["content"] == "秒杀专场"
    assert find(stack["children"], 155)["asset_path"] == "assets/images/155__v001.png"
    assert (variants[0] / "assets/images/155__v001.png").exists()

    v2_spec = json.loads((variants[1] / "spec.json").read_text(encoding="utf-8"))
    assert find(v2_spec["root"]["children"][0]["children"], 141)["content"] == "第二版"
    # variant 2 keeps the original image binding
    assert find(v2_spec["root"]["children"][0]["children"], 155)["asset_path"] == "assets/images/155.png"

    # base bundle untouched
    assert "首页" in (base_bundle / "spec.json").read_text(encoding="utf-8")
    # manifest carries the variant index
    assert json.loads((variants[0] / "app.json").read_text(encoding="utf-8"))["variant"] == 1


def test_generate_variants_validation(base_bundle, tmp_path):
    dataset = tmp_path / "dataset.json"
    dataset.write_text(json.dumps({"variants": [{"images": {"155": "missing.png"}}]}), encoding="utf-8")
    with pytest.raises(FileNotFoundError):
        generate_variants(base_bundle, dataset, tmp_path / "out")

    dataset.write_text(json.dumps({"variants": [{"images": {"155": "doc.txt"}}]}), encoding="utf-8")
    with pytest.raises(ValueError):
        generate_variants(base_bundle, dataset, tmp_path / "out")

    dataset.write_text(json.dumps({"variants": []}), encoding="utf-8")
    with pytest.raises(ValueError):
        generate_variants(base_bundle, dataset, tmp_path / "out")


def test_injected_text_lands_in_variant_spec(base_bundle, tmp_path):
    """The variant spec is what the renderer consumes — injected text must be there."""
    dataset = tmp_path / "dataset.json"
    dataset.write_text(json.dumps({"variants": [{"text": {"141": "限时秒杀"}}]}), encoding="utf-8")
    (variant,) = generate_variants(base_bundle, dataset, tmp_path / "out")

    spec_text = (variant / "spec.json").read_text(encoding="utf-8")
    assert "限时秒杀" in spec_text
    assert '"首页"' not in spec_text

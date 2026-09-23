from __future__ import annotations

import pytest
from pydantic import ValidationError

from cleaner.device_cleaner import dump_to_cue
from schema.cue_data import CueData


def test_basic_conversion(dump):
    cue = dump_to_cue(dump)
    assert cue.bundle_name == "com.example.app"
    assert cue.page_url == "pages/Index"
    assert cue.viewport.width == 400 and cue.viewport.height == 800
    assert cue.viewport.resolution == pytest.approx(3.25)


def test_components_content_and_bbox(dump):
    cue = dump_to_cue(dump)
    by_id = {c.id: c for c in cue.components}

    text = by_id[141]
    assert text.type == "Text"
    assert text.content == "首页"
    assert text.bbox == [97.0, 100.0, 168.0, 100.0, 168.0, 140.0, 97.0, 140.0]
    assert text.style == {"fontSize": 14.0, "fontColor": "#CC000000", "fontWeight": 500}
    assert text.actions == []

    image = by_id[155]
    assert image.type == "Image"
    assert image.content == ""
    assert image.bbox == [20.0, 200.0, 300.0, 200.0, 300.0, 400.0, 20.0, 400.0]


def test_hidden_and_empty_text_excluded(dump):
    cue = dump_to_cue(dump)
    ids = {c.id for c in cue.components}
    assert 300 not in ids  # visibility Hidden
    assert 301 not in ids  # empty content
    assert 6 not in ids  # plain container, no uitest regions -> not a component


def test_uitest_enriches_actions_and_adds_tap_targets(dump, uitest_dump):
    cue = dump_to_cue(dump, uitest_dump=uitest_dump)
    by_id = {c.id: c for c in cue.components}

    assert by_id[141].actions == ["click"]
    # Stack 6 now intersects clickable/scrollable/type regions -> becomes a component
    assert 6 in by_id
    assert set(by_id[6].actions) == {"click", "long_press", "scroll", "type"}


def test_metadata_passthrough(dump):
    cue = dump_to_cue(dump, screenshot="_collect_shot.jpeg", window_id=125)
    assert cue.screenshot == "_collect_shot.jpeg"
    assert cue.window_id == 125
    assert cue.functions == []


def test_output_validates_against_schema(dump):
    cue = dump_to_cue(dump)
    # roundtrip through the model to prove the JSON contract holds
    reparsed = CueData.model_validate_json(cue.model_dump_json(exclude_none=True))
    assert reparsed.components == cue.components
    with pytest.raises(ValidationError):
        CueData.model_validate({"components": cue.model_dump()["components"]})  # missing required fields

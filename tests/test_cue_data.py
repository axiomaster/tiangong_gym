from __future__ import annotations

import pytest
from pydantic import ValidationError

from schema.cue_data import Component, CueData, Viewport, bbox_from_corners


def good_bbox() -> list[float]:
    return [97.0, 100.0, 168.0, 100.0, 168.0, 140.0, 97.0, 140.0]


def make_component(**overrides) -> dict:
    base = {"id": 1, "type": "Text", "content": "首页", "bbox": good_bbox()}
    base.update(overrides)
    return base


def test_bbox_from_corners_normalizes_orientation():
    # device sample order starts bottom-left; must come out TL-clockwise
    assert bbox_from_corners(97, 2740, 168, 2699) == [97, 2699, 168, 2699, 168, 2740, 97, 2740]
    assert bbox_from_corners(168, 100, 97, 140) == [97, 100, 168, 100, 168, 140, 97, 140]


def test_component_accepts_canonical_bbox():
    c = Component(**make_component())
    assert c.bbox == good_bbox()
    assert c.actions == []
    assert c.style == {}


def test_component_rejects_wrong_length():
    with pytest.raises(ValidationError):
        Component(**make_component(bbox=[97, 100, 168, 100, 168, 140, 97]))


def test_component_rejects_skewed_corners():
    with pytest.raises(ValidationError):
        Component(**make_component(bbox=[0, 0, 100, 5, 100, 140, 0, 140]))


def test_component_rejects_bottom_left_start():
    # legacy format orientation must NOT validate
    with pytest.raises(ValidationError):
        Component(**make_component(bbox=[97, 140, 168, 140, 168, 100, 97, 100]))


def test_component_rejects_unknown_action():
    with pytest.raises(ValidationError):
        Component(**make_component(actions=["swipe"]))


def test_component_rejects_extra_fields():
    with pytest.raises(ValidationError):
        Component(**make_component(conponments=True))


def test_cue_data_serialization_uses_components_key():
    cue = CueData(
        bundle_name="com.example.app",
        page_url="pages/Index",
        viewport=Viewport(width=400, height=800, resolution=3.25),
        components=[Component(**make_component())],
    )
    data = cue.model_dump(exclude_none=True)
    assert "components" in data and "conponments" not in data
    assert data["viewport"]["resolution"] == 3.25
    assert "screenshot" not in data

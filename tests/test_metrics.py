from __future__ import annotations

import pytest

from schema.cue_data import Component, CueData, Viewport
from verifier.metrics import THRESHOLDS, bbox_iou, diff


def comp(id: int, type: str = "Text", content: str = "首页", bbox=None, actions=None) -> Component:
    return Component(id=id, type=type, content=content, bbox=bbox or [0, 0, 10, 0, 10, 10, 0, 10], actions=actions or [])


def cue(components: list[Component]) -> CueData:
    return CueData(bundle_name="b", page_url="p", viewport=Viewport(width=100, height=100), components=components)


def test_bbox_iou_values():
    full = [0, 0, 10, 0, 10, 10, 0, 10]
    assert bbox_iou(full, full) == 1.0
    assert bbox_iou(full, [5, 0, 10, 0, 10, 10, 5, 10]) == pytest.approx(0.5)
    assert bbox_iou(full, [20, 20, 30, 20, 30, 30, 20, 30]) == 0.0


def test_identical_cues_score_full():
    c = cue([comp(1), comp(2, "Image", ""), comp(3, "Stack", "", actions=["click"])])
    result = diff(c, cue([comp(1), comp(2, "Image", ""), comp(3, "Stack", "", actions=["click"])]))
    assert result.component_match_rate == 1.0
    assert result.mean_iou == pytest.approx(1.0)
    assert result.text_match_rate == 1.0
    assert result.action_coverage == 1.0


def test_missing_and_extra_components():
    device = cue([comp(1), comp(2)])
    gym = cue([comp(1)])
    result = diff(device, gym)
    assert result.component_match_rate == pytest.approx(0.5)
    assert [c.id for c in result.missing] == [2]
    assert not result.extra

    result = diff(cue([comp(1)]), cue([comp(1), comp(9, "Image", "")]))
    assert result.component_match_rate == 1.0
    assert [c.id for c in result.extra] == [9]


def test_duplicates_resolved_by_iou():
    a = comp(1, bbox=[0, 0, 10, 0, 10, 10, 0, 10])
    b = comp(2, bbox=[100, 100, 110, 100, 110, 110, 100, 110])
    g_near_a = comp(1, bbox=[1, 0, 10, 0, 10, 10, 1, 10])
    g_near_b = comp(2, bbox=[100, 100, 110, 100, 110, 110, 100, 110])
    result = diff(cue([a, b]), cue([g_near_a, g_near_b]))
    assert result.component_match_rate == 1.0
    # pair a IoU=0.9, pair b IoU=1.0 -> mean 0.95
    assert result.mean_iou == pytest.approx(0.95)


def test_text_mismatch_detected_via_id_join():
    device = cue([comp(1, content="首页"), comp(2, content="我的")])
    gym = cue([comp(1, content="Home"), comp(2, content="我的")])
    result = diff(device, gym)
    # (type, content) keys differ for comp 1 -> it counts as missing, and the id join flags the text
    assert result.text_match_rate == pytest.approx(0.5)
    assert result.text_mismatches == [(1, "首页", "Home")]


def test_action_coverage_with_gaps():
    device = cue([comp(1, content="a", actions=["click", "long_press"]), comp(2, content="b")])
    gym = cue([comp(1, content="a", actions=["click"])])
    result = diff(device, gym)
    assert result.action_coverage == pytest.approx(0.5)
    assert result.action_gaps == [(1, ["long_press"])]


def test_empty_sides_do_not_crash():
    result = diff(cue([]), cue([]))
    assert result.component_match_rate == 1.0
    assert result.mean_iou == 1.0
    assert result.action_coverage == 1.0


def test_thresholds_match_arch_md():
    assert THRESHOLDS == {
        "component_match_rate": 0.95,
        "mean_iou": 0.85,
        "text_match_rate": 0.98,
        "action_coverage": 1.0,
    }

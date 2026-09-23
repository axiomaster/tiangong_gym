from __future__ import annotations

from collector.uitest import actions_for_rect, collect_regions, node_actions, parse_bounds


def test_parse_bounds():
    assert parse_bounds("[0,0][1320,2848]") == (0.0, 0.0, 1320.0, 2848.0)
    assert parse_bounds("[10, 20][30, 40]") == (10.0, 20.0, 30.0, 40.0)
    assert parse_bounds("NONE") is None
    assert parse_bounds(None) is None


def test_node_actions_mapping():
    assert node_actions({"clickable": "true"}) == ["click"]
    assert node_actions({"longClickable": "true"}) == ["long_press"]
    assert node_actions({"scrollable": "true"}) == ["scroll"]
    assert node_actions({"type": "TextInput"}) == ["type"]
    assert node_actions({"clickable": "true", "scrollable": "true"}) == ["click", "scroll"]
    assert node_actions({"clickable": "false"}) == []


def test_collect_regions_flattens(uitest_dump):
    regions = collect_regions(uitest_dump)
    assert len(regions) == 4
    bounds_set = {b for b, _ in regions}
    assert (97.0, 100.0, 168.0, 140.0) in bounds_set


def test_actions_for_rect_matches_by_center(uitest_dump):
    regions = collect_regions(uitest_dump)
    # synthetic Text node rect contains the clickable uitest bounds center
    assert actions_for_rect((97.0, 100.0, 168.0, 140.0), regions) == ["click"]
    # Stack(6) rect covers the tappable Stack and the TextInput
    actions = actions_for_rect((0.0, 0.0, 400.0, 800.0), regions)
    assert actions == ["click", "long_press", "scroll", "type"]
    assert actions_for_rect((200.0, 0.0, 300.0, 100.0), regions) == []


def test_actions_for_empty_regions():
    assert actions_for_rect((0.0, 0.0, 10.0, 10.0), []) == []


def test_collect_regions_filters_bundle_and_visibility(uitest_dump):
    # real dumps carry several windows; bundleName (when present) filters them
    import copy

    dump2 = copy.deepcopy(uitest_dump)
    dump2["children"][0]["attributes"]["bundleName"] = "com.other.app"
    dump2["children"][1]["attributes"]["visible"] = "false"
    regions = collect_regions(dump2, bundle_name="com.example.app")
    bounds = {b for b, _ in regions}
    assert (97.0, 100.0, 168.0, 140.0) not in bounds  # other bundle -> dropped
    assert (10.0, 500.0, 100.0, 600.0) not in bounds  # invisible -> dropped
    assert (0.0, 0.0, 400.0, 800.0) in bounds  # node without bundleName kept (app tree)


def test_node_actions_accepts_bool_values():
    assert node_actions({"clickable": True}) == ["click"]
    assert node_actions({"scrollable": True, "visible": True}) == ["scroll"]

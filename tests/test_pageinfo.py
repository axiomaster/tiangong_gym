from __future__ import annotations

import pytest

from collector.pageinfo import (
    is_visible,
    parse_number,
    parse_page_info,
    parse_rect,
    style_from_attrs,
)


def test_load_dump_and_second_parse(dump):
    page = parse_page_info(dump)
    assert page.bundle_name == "com.example.app"
    assert page.page_url == "pages/Index"
    assert (page.width, page.height) == (400.0, 800.0)
    assert page.resolution == pytest.approx(3.25)


def test_parse_page_info_accepts_plain_dict_tree(dump):
    inner = __import__("json").loads(dump["pageInfo"])
    page = parse_page_info({"pageInfo": inner, "bundleName": "other"})
    # bundleName inside the tree wins over the top-level one
    assert page.bundle_name == "com.example.app"


def test_parse_page_info_rejects_garbage():
    with pytest.raises(ValueError):
        parse_page_info({"pageInfo": 42})


def test_root_rect_is_synththesized(dump):
    page = parse_page_info(dump)
    assert page.root["$type"] == "root"
    assert page.root["$ID"] == 0
    assert parse_rect(page.root["$rect"]) == (0.0, 0.0, 400.0, 800.0)


def test_parse_rect():
    assert parse_rect("[0.00, 0.00],[1320.00,2848.00]") == (0.0, 0.0, 1320.0, 2848.0)
    assert parse_rect("[309.00, 185.00],[687.00,246.00]") == (309.0, 185.0, 687.0, 246.0)
    assert parse_rect("NONE") is None
    assert parse_rect(None) is None


def test_parse_number_strips_units():
    assert parse_number("16.00fp") == 16.0
    assert parse_number("1320.000000") == 1320.0
    assert parse_number("0.5vp") == 0.5
    assert parse_number("500") == 500.0
    assert parse_number("NONE") is None
    assert parse_number(None) is None


def test_iter_tree_visits_every_node(dump):
    page = parse_page_info(dump)
    nodes = list(page.iter_nodes())
    ids = [n.get("$ID") for n in nodes if n.get("$ID") is not None]
    assert {6, 141, 155, 300, 301, 400, 410}.issubset(set(ids))
    assert len(nodes) >= 8  # root + Stack + 6 children


def test_is_visible():
    assert is_visible({"$attrs": {}})
    assert is_visible({"$attrs": {"visibility": "NONE"}})
    assert not is_visible({"$attrs": {"visibility": "Visibility.Hidden"}})
    assert not is_visible({"$attrs": {"visibility": "Visibility.None"}})


def test_style_from_attrs(dump):
    page = parse_page_info(dump)
    text = next(n for n in page.iter_nodes() if n.get("$ID") == 141)
    style = style_from_attrs(text["$attrs"])
    assert style == {"fontSize": 14.0, "fontColor": "#CC000000", "fontWeight": 500}

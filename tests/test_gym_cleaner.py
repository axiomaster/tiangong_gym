"""M3 closed-loop tests: device_cleaner vs gym_cleaner over the same source tree,
judged by verifier.metrics (arch.md §6 gates)."""

from __future__ import annotations

from pathlib import Path

import pytest

from cleaner.device_cleaner import dump_to_cue
from cleaner.gym_cleaner import clean_bundle
from synthesizer.packager import package_app
from verifier.metrics import THRESHOLDS, diff


def _assert_gates(result) -> None:
    assert result.component_match_rate >= THRESHOLDS["component_match_rate"]
    assert result.mean_iou >= THRESHOLDS["mean_iou"]
    assert result.text_match_rate >= THRESHOLDS["text_match_rate"]
    assert result.action_coverage >= THRESHOLDS["action_coverage"]


def test_synthetic_closed_loop_perfect(dump, uitest_dump, browser, tmp_path):
    from PIL import Image

    Image.new("RGB", (400, 800), color=(66, 66, 66)).save(tmp_path / "shot.jpeg", format="JPEG")
    bundle = package_app(
        dump, screenshot=tmp_path / "shot.jpeg", uitest_dump=uitest_dump, out_root=tmp_path / "apps"
    )

    device_cue = dump_to_cue(dump, uitest_dump=uitest_dump)
    gym_cue = clean_bundle(bundle, browser)
    result = diff(device_cue, gym_cue)

    # same source tree on both sides -> the synthetic loop must be exact
    assert result.component_match_rate == 1.0
    assert result.mean_iou == pytest.approx(1.0)
    assert result.text_match_rate == 1.0
    assert result.action_coverage == 1.0
    assert not result.missing and not result.extra and not result.action_gaps


@pytest.mark.skipif(
    not all(Path.exists(Path(p)) for p in ("reference/data/vmall/pageInfo.json", "reference/data/vmall/screenshot.jpeg", "reference/data/vmall/uitest.json")),
    reason="reference/data/vmall capture not available (gitignored)",
)
def test_real_vmall_closed_loop(browser, tmp_path):
    import json

    dump = json.loads(Path("reference/data/vmall/pageInfo.json").read_text(encoding="utf-8"))
    uitest_dump = json.loads(Path("reference/data/vmall/uitest.json").read_text(encoding="utf-8"))

    bundle = package_app(
        dump,
        screenshot="reference/data/vmall/screenshot.jpeg",
        uitest_dump=uitest_dump,
        out_root=tmp_path / "apps",
    )
    device_cue = dump_to_cue(dump, uitest_dump=uitest_dump, screenshot="screenshot.jpeg")
    gym_cue = clean_bundle(bundle, browser)
    result = diff(device_cue, gym_cue)
    _assert_gates(result)


@pytest.mark.skipif(
    not all(
        Path(p).exists()
        for p in (
            "reference/data/taobao/pageInfo.json",
            "reference/data/taobao/screenshot.jpeg",
            "reference/data/taobao/dump.json",
        )
    ),
    reason="reference/data/taobao capture not available (gitignored)",
)
def test_real_taobao_closed_loop(browser, tmp_path):
    import json

    dump = json.loads(Path("reference/data/taobao/pageInfo.json").read_text(encoding="utf-8"))
    uitest_dump = json.loads(Path("reference/data/taobao/dump.json").read_text(encoding="utf-8"))

    bundle = package_app(
        dump,
        screenshot="reference/data/taobao/screenshot.jpeg",
        uitest_dump=uitest_dump,
        out_root=tmp_path / "apps",
    )
    device_cue = dump_to_cue(dump, uitest_dump=uitest_dump, screenshot="screenshot.jpeg")
    gym_cue = clean_bundle(bundle, browser)
    result = diff(device_cue, gym_cue)
    _assert_gates(result)


@pytest.mark.skipif(
    not all(
        Path(p).exists()
        for p in (
            "reference/data/douyin/pageInfo.json",
            "reference/data/douyin/screenshot.jpeg",
            "reference/data/douyin/dump.json",
        )
    ),
    reason="reference/data/douyin capture not available (gitignored)",
)
def test_real_douyin_closed_loop(browser, tmp_path):
    import json

    dump = json.loads(Path("reference/data/douyin/pageInfo.json").read_text(encoding="utf-8"))
    uitest_dump = json.loads(Path("reference/data/douyin/dump.json").read_text(encoding="utf-8"))

    bundle = package_app(
        dump,
        screenshot="reference/data/douyin/screenshot.jpeg",
        uitest_dump=uitest_dump,
        out_root=tmp_path / "apps",
    )
    device_cue = dump_to_cue(dump, uitest_dump=uitest_dump, screenshot="screenshot.jpeg")
    gym_cue = clean_bundle(bundle, browser)
    result = diff(device_cue, gym_cue)
    _assert_gates(result)

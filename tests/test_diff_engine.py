from __future__ import annotations

import json

from tests.test_metrics import comp, cue
from verifier.diff_engine import build_report, verify_files
from verifier.metrics import diff


def test_report_gates_and_details():
    device = cue([comp(1, content="首页", actions=["click"]), comp(2, "Image", "")])
    gym = cue([comp(1, content="首页", actions=["click"]), comp(2, "Image", ""), comp(9, "Image", "")])
    report = build_report(device, gym, diff(device, gym))

    assert report["passed"] is True
    assert all(g["pass"] for g in report["gates"].values())
    assert report["metrics"]["component_match_rate"] == 1.0
    assert report["details"]["extra"][0]["id"] == 9

    # break the action coverage gate
    gym2 = cue([comp(1, content="首页", actions=[]), comp(2, "Image", "")])
    report2 = build_report(device, gym2, diff(device, gym2))
    assert report2["passed"] is False
    assert report2["gates"]["action_coverage"]["pass"] is False
    assert report2["details"]["action_gaps"] == [{"id": 1, "absent": ["click"]}]


def test_verify_files_roundtrip(tmp_path):
    device = cue([comp(1, content="首页")])
    gym = cue([comp(1, content="首页")])
    d = tmp_path / "device.json"
    g = tmp_path / "gym.json"
    d.write_text(device.model_dump_json(exclude_none=True), encoding="utf-8")
    g.write_text(gym.model_dump_json(exclude_none=True), encoding="utf-8")

    report = verify_files(str(d), str(g))
    assert report["passed"] is True
    json.dumps(report)  # must be JSON-serializable

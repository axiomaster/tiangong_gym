"""Diff engine (arch.md §6, M3): device cue_data vs gym cue_data -> verdict report.

Runs `verifier.metrics.diff`, checks the four acceptance thresholds
(component match >= 95%, geometry IoU >= 0.85, text match >= 98%, action
coverage == 100%) and emits a machine-readable JSON report plus a human
summary. CLI exits non-zero when any gate fails.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

from schema.cue_data import CueData
from verifier.metrics import THRESHOLDS, DiffResult, diff

#: detail lists are capped to keep reports readable on large pages
DETAIL_CAP = 50


def _component_summary(c) -> dict[str, Any]:
    return {"id": c.id, "type": c.type, "content": c.content[:60], "bbox": c.bbox}


def build_report(device: CueData, gym: CueData, result: DiffResult) -> dict[str, Any]:
    metrics = {
        "component_match_rate": result.component_match_rate,
        "mean_iou": result.mean_iou,
        "text_match_rate": result.text_match_rate,
        "action_coverage": result.action_coverage,
    }
    gates = {
        name: {"value": value, "threshold": THRESHOLDS[name], "pass": value >= THRESHOLDS[name]}
        for name, value in metrics.items()
    }
    report: dict[str, Any] = {
        "device": {"bundle_name": device.bundle_name, "page_url": device.page_url, "components": len(device.components)},
        "gym": {"bundle_name": gym.bundle_name, "page_url": gym.page_url, "components": len(gym.components)},
        "metrics": metrics,
        "gates": gates,
        "passed": all(g["pass"] for g in gates.values()),
        "details": {
            "missing": [_component_summary(c) for c in result.missing[:DETAIL_CAP]],
            "extra": [_component_summary(c) for c in result.extra[:DETAIL_CAP]],
            "text_mismatches": [
                {"id": i, "device": d[:80], "gym": g[:80]} for i, d, g in result.text_mismatches[:DETAIL_CAP]
            ],
            "action_gaps": [{"id": i, "absent": a} for i, a in result.action_gaps[:DETAIL_CAP]],
            "iou_outliers": sorted(
                (
                    {"id": m.device.id, "type": m.device.type, "iou": round(m.iou, 4)}
                    for m in result.matched
                    if m.iou < THRESHOLDS["mean_iou"]
                ),
                key=lambda x: x["iou"],
            )[:DETAIL_CAP],
        },
    }
    return report


def verify_files(device_path: str | Path, gym_path: str | Path) -> dict[str, Any]:
    device = CueData.model_validate_json(Path(device_path).read_text(encoding="utf-8"))
    gym = CueData.model_validate_json(Path(gym_path).read_text(encoding="utf-8"))
    return build_report(device, gym, diff(device, gym))


def print_summary(report: dict[str, Any]) -> None:
    status = "PASS" if report["passed"] else "FAIL"
    print(f"verifier: {status}  ({report['device']['components']} device vs {report['gym']['components']} gym components)")
    for name, gate in report["gates"].items():
        mark = "ok " if gate["pass"] else "GAP"
        print(f"  [{mark}] {name:<22} {gate['value']:.4f} (>= {gate['threshold']})")
    details = report["details"]
    if details["missing"]:
        print(f"  missing components: {len(details['missing'])}+ (e.g. ids {[c['id'] for c in details['missing'][:5]]})")
    if details["extra"]:
        print(f"  extra gym components: {len(details['extra'])}+ (e.g. ids {[c['id'] for c in details['extra'][:5]]})")
    if details["text_mismatches"]:
        print(f"  text mismatches: {len(details['text_mismatches'])}+ (ids {[m['id'] for m in details['text_mismatches'][:5]]})")
    if details["action_gaps"]:
        print(f"  action gaps: {len(details['action_gaps'])}+ (ids {[g['id'] for g in details['action_gaps'][:5]]})")
    if details["iou_outliers"]:
        worst = details["iou_outliers"][0]
        print(f"  worst geometry: id {worst['id']} ({worst['type']}) IoU={worst['iou']}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify gym cue_data against device cue_data")
    parser.add_argument("device", help="device-side cue_data.json")
    parser.add_argument("gym", help="gym-side cue_data.json")
    parser.add_argument("--report", help="optional path to write the JSON report")
    args = parser.parse_args()

    report = verify_files(args.device, args.gym)
    print_summary(report)
    if args.report:
        Path(args.report).write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"report written -> {args.report}")
    return 0 if report["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

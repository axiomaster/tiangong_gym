"""Verifier metrics (arch.md §6, M3).

Compare a device-side `cue_data.json` against a gym-side (virtual app) one:

- Component match rate: multiset alignment of `(type, content)` keys,
  `>= 0.95` — every visible element must be carried by the virtual app.
- Geometry IoU: mean bbox IoU over matched pairs, `>= 0.85`.
- Text match rate: exact-content rate over Text components joined by component
  id (ids are stable across the pipeline), `>= 0.98`.
- Action coverage: recall of device-side actions on matched components, `== 1.0`.
"""

from __future__ import annotations

from dataclasses import dataclass, field

from schema.cue_data import Component, CueData

THRESHOLDS: dict[str, float] = {
    "component_match_rate": 0.95,
    "mean_iou": 0.85,
    "text_match_rate": 0.98,
    "action_coverage": 1.0,
}


def bbox_iou(a: list[float], b: list[float]) -> float:
    """IoU of two 8-point clockwise bboxes."""
    ax1, ay1, ax2, ay2 = a[0], a[1], a[4], a[5]
    bx1, by1, bx2, by2 = b[0], b[1], b[4], b[5]
    ix = max(0.0, min(ax2, bx2) - max(ax1, bx1))
    iy = max(0.0, min(ay2, by2) - max(ay1, by1))
    inter = ix * iy
    area_a = max(0.0, (ax2 - ax1)) * max(0.0, (ay2 - ay1))
    area_b = max(0.0, (bx2 - bx1)) * max(0.0, (by2 - by1))
    union = area_a + area_b - inter
    return inter / union if union > 0 else 0.0


@dataclass
class MatchedPair:
    device: Component
    gym: Component
    iou: float


@dataclass
class DiffResult:
    component_match_rate: float
    mean_iou: float
    text_match_rate: float
    action_coverage: float
    matched: list[MatchedPair] = field(default_factory=list)
    missing: list[Component] = field(default_factory=list)  # on device, not in gym
    extra: list[Component] = field(default_factory=list)  # in gym, not on device
    text_mismatches: list[tuple[int, str, str]] = field(default_factory=list)  # (id, device, gym)
    action_gaps: list[tuple[int, list[str]]] = field(default_factory=list)  # (id, absent actions)


def _align_by_key(device: list[Component], gym: list[Component]) -> tuple[list[MatchedPair], list[Component], list[Component]]:
    """Greedy multiset alignment on (type, content); duplicates resolve by best IoU."""
    pool: dict[tuple[str, str], list[Component]] = {}
    for g in gym:
        pool.setdefault((g.type, g.content), []).append(g)
    matched: list[MatchedPair] = []
    missing: list[Component] = []
    for d in device:
        candidates = pool.get((d.type, d.content)) or []
        if not candidates:
            missing.append(d)
            continue
        best = max(candidates, key=lambda g: bbox_iou(d.bbox, g.bbox))
        candidates.remove(best)
        matched.append(MatchedPair(device=d, gym=best, iou=bbox_iou(d.bbox, best.bbox)))
    extra = [g for comps in pool.values() for g in comps]
    return matched, missing, extra


def _text_rate(device: CueData, gym: CueData, matched: list[MatchedPair]) -> tuple[float, list[tuple[int, str, str]]]:
    """Exact text match over Text components joined by id (fallback: matched pairs)."""
    gym_texts = {c.id: c.content for c in gym.components if c.type == "Text"}
    pairs = [(d, gym_texts[d.id]) for d in device.components if d.type == "Text" and d.id in gym_texts]
    source = pairs if pairs else [(m.device, m.gym.content) for m in matched if m.device.type == "Text"]
    if not source:
        return 1.0, []
    mismatches = [(d.id, d.content, g) for d, g in source if d.content != g]
    return (len(source) - len(mismatches)) / len(source), mismatches


def _action_coverage(matched: list[MatchedPair]) -> tuple[float, list[tuple[int, list[str]]]]:
    """Macro-average recall of device actions on matched components."""
    relevant = [m for m in matched if m.device.actions]
    if not relevant:
        return 1.0, []
    total = 0
    found = 0
    gaps: list[tuple[int, list[str]]] = []
    for m in relevant:
        gym_actions = set(m.gym.actions)
        absent = [a for a in m.device.actions if a not in gym_actions]
        total += len(m.device.actions)
        found += len(m.device.actions) - len(absent)
        if absent:
            gaps.append((m.device.id, absent))
    return found / total, gaps


def diff(device: CueData, gym: CueData) -> DiffResult:
    matched, missing, extra = _align_by_key(device.components, gym.components)
    n_device = len(device.components)
    match_rate = (len(matched) / n_device) if n_device else 1.0
    ious = [m.iou for m in matched]
    mean_iou = (sum(ious) / len(ious)) if ious else 1.0
    text_rate, text_mismatches = _text_rate(device, gym, matched)
    action_cov, action_gaps = _action_coverage(matched)
    return DiffResult(
        component_match_rate=match_rate,
        mean_iou=mean_iou,
        text_match_rate=text_rate,
        action_coverage=action_cov,
        matched=matched,
        missing=missing,
        extra=extra,
        text_mismatches=text_mismatches,
        action_gaps=action_gaps,
    )

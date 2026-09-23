"""Unified output protocol `cue_data.json` (arch.md §4).

Downstream consumers: VLM perception models, GUI-agent RL policies, offline trajectory replay.
Key constraints (§4.3):
- Flat component list under the `components` key (NOT the legacy misspelled `conponments`).
- `bbox` is 8 numbers, clockwise starting at top-left:
  [x_tl, y_tl, x_tr, y_tr, x_br, y_br, x_bl, y_bl], in physical pixels.
- Action vocabulary: click / long_press / scroll / type.
"""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

Action = Literal["click", "long_press", "scroll", "type"]
ACTIONS: tuple[str, ...] = ("click", "long_press", "scroll", "type")


class Viewport(BaseModel):
    """Device screen in physical pixels; `resolution` is px-per-vp density scale."""

    width: float = Field(gt=0)
    height: float = Field(gt=0)
    resolution: float | None = Field(default=None, gt=0)


class Function(BaseModel):
    """A semantic function annotated onto components (e.g. by VLM or human)."""

    id: str
    name: str | None = None
    description: str | None = None
    related_components: list[int] = Field(default_factory=list)
    source: str | None = None


class Component(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: int
    type: str
    content: str = ""
    bbox: list[float]
    description: str = ""
    style: dict[str, Any] = Field(default_factory=dict)
    group: str = ""
    actions: list[Action] = Field(default_factory=list)

    @field_validator("bbox")
    @classmethod
    def _check_bbox(cls, v: list[float]) -> list[float]:
        if len(v) != 8:
            raise ValueError(f"bbox must have 8 values [x_tl,y_tl,x_tr,y_tr,x_br,y_br,x_bl,y_bl], got {len(v)}")
        x_tl, y_tl, x_tr, y_tr, x_br, y_br, x_bl, y_bl = v
        tol = 1e-6
        horizontal_top = abs(y_tl - y_tr) < tol
        horizontal_bottom = abs(y_bl - y_br) < tol
        vertical_left = abs(x_tl - x_bl) < tol
        vertical_right = abs(x_tr - x_br) < tol
        if not (horizontal_top and horizontal_bottom and vertical_left and vertical_right):
            raise ValueError(f"bbox corners are not an axis-aligned rectangle: {v}")
        if not (y_tl <= y_br + tol and x_tl <= x_tr + tol):
            raise ValueError(
                f"bbox must be clockwise starting at top-left, got first point {x_tl},{y_tl} vs last {x_bl},{y_bl}"
            )
        return v


class CueData(BaseModel):
    model_config = ConfigDict(extra="forbid")

    bundle_name: str
    page_url: str
    window_id: int | str | None = None
    viewport: Viewport
    screenshot: str | None = None
    functions: list[Function] = Field(default_factory=list)
    components: list[Component] = Field(default_factory=list)


def bbox_from_corners(x1: float, y1: float, x2: float, y2: float) -> list[float]:
    """Convert a [x1, y1, x2, y2] corner pair (any corner order) into the canonical
    clockwise-from-top-left 8-value bbox."""
    left, right = sorted((x1, x2))
    top, bottom = sorted((y1, y2))
    return [left, top, right, top, right, bottom, left, bottom]

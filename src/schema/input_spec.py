"""App Generation Spec (arch.md §3.3).

Input for the Path-B runtime renderer: the real-device layout tree preserved as-is,
with geometry in physical pixels. Image nodes reference locally cropped assets
(produced by `collector.cropper`) instead of unreachable `resource:///` ids.
"""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from schema.cue_data import Action


class SpecNode(BaseModel):
    """One ArkUI node. `rect` is [x1, y1, x2, y2] corners in physical pixels."""

    model_config = ConfigDict(extra="forbid")

    id: int
    type: str
    rect: list[float] = Field(min_length=4, max_length=4)
    content: str | None = None
    asset_path: str | None = None
    style: dict[str, Any] = Field(default_factory=dict)
    actions: list[Action] = Field(default_factory=list)
    children: list[SpecNode] = Field(default_factory=list)


class Viewport(BaseModel):
    width: float = Field(gt=0)
    height: float = Field(gt=0)


class InputSpec(BaseModel):
    model_config = ConfigDict(extra="forbid")

    bundle_name: str
    page_url: str
    resolution: float = Field(gt=0)
    viewport: Viewport
    root: SpecNode

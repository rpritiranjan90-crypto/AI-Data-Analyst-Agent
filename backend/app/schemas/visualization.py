from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class VisualizationRequest(BaseModel):
    """
    Visualization request schema.

    Used by the generic visualization endpoint.
    """

    chart_type: str = Field(
        ...,
        description="Registered chart type.",
        examples=["histogram"],
    )

    parameters: dict[str, Any] = Field(
        default_factory=dict,
        description="Chart-specific parameters.",
    )


class VisualizationResponse(BaseModel):
    """
    Standard visualization response.
    """

    success: bool

    chart_type: str

    chart_path: str

    generated_at: str


class SupportedChartsResponse(BaseModel):
    """
    Response containing all supported chart types.
    """

    supported_charts: list[str]
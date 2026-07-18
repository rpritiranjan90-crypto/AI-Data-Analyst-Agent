from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException

from app.services.visualization_engine import VisualizationEngine

router = APIRouter(
    prefix="/visualization",
    tags=["Visualization"],
)


@router.get("/supported")
def supported():
    """
    Return all supported visualization types.
    """

    return {
        "supported_charts": VisualizationEngine.supported_charts()
    }


@router.post("/generate")
def generate_visualization(
    request: dict[str, Any],
):
    """
    Generate any supported visualization.

    Example Request
    ---------------
    {
        "chart_type": "histogram",
        "column": "age"
    }

    {
        "chart_type": "scatter",
        "x_column": "age",
        "y_column": "salary"
    }

    {
        "chart_type": "gauge",
        "value": 85
    }
    """

    try:

        chart_type = request.pop("chart_type")

    except KeyError:

        raise HTTPException(
            status_code=400,
            detail="chart_type is required.",
        )

    try:

        return VisualizationEngine.create_chart(
            chart_type=chart_type,
            **request,
        )

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )
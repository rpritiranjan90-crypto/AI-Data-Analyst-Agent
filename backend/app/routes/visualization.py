from __future__ import annotations

from typing import Any, Literal, Optional

from fastapi import APIRouter
from pydantic import BaseModel

from app.common.logger import get_logger
from app.common.timing import measure_time

from app.core.exceptions import ResourceNotFoundException

from app.exceptions.base import (
    InternalServerException,
    ValidationException,
)

from app.services.visualization_engine import VisualizationEngine
from app.services.visualization_service import auto_visualize

logger = get_logger(__name__)

router = APIRouter(
    prefix="/visualization",
    tags=["Visualization"],
)


# ---------------------------------------------------------------------------
# Typed response models
# ---------------------------------------------------------------------------

class SupportedChartsResponse(BaseModel):
    supported_charts: list[str]


class ChartGenerationRequest(BaseModel):
    chart_type: str
    x_column: Optional[str] = None
    y_column: Optional[str] = None
    hue_column: Optional[str] = None
    title: Optional[str] = None
    theme: str = "default"


class ChartGenerationResponse(BaseModel):
    success: Literal[True]
    chart_type: str
    image_path: str
    image_url: str
    message: str


class AutoVisualizeResponse(BaseModel):
    success: Literal[True]
    charts_generated: int
    chart_types: list[str]
    charts: list[ChartGenerationResponse]


@router.get(
    "/supported",
    response_model=SupportedChartsResponse,
    summary="Supported Chart Types",
)
@measure_time
def supported() -> SupportedChartsResponse:
    """
    Return all supported visualization types.
    """

    logger.info("Fetching supported visualization types.")

    return SupportedChartsResponse(
        supported_charts=VisualizationEngine.supported_charts()
    )


@router.post(
    "/generate",
    response_model=ChartGenerationResponse,
    summary="Generate Visualization",
)
@measure_time
def generate_visualization(
    request: ChartGenerationRequest,
) -> ChartGenerationResponse:
    """
    Generate a visualization.

    Example Request
    ---------------
    {
        "chart_type": "histogram",
        "x_column": "Age"
    }

    {
        "chart_type": "scatter",
        "x_column": "Age",
        "y_column": "Salary"
    }

    {
        "chart_type": "gauge",
        "value": 85
    }
    """

    logger.info("Visualization request received.")

    if not request.chart_type:
        raise ValidationException("chart_type is required.")

    logger.info("Generating '%s' chart.", request.chart_type)

    try:
        result = VisualizationEngine.create_chart(
            chart_type=request.chart_type,
            **{k: v for k, v in request.model_dump().items() if k != "chart_type" and v is not None},
        )

        logger.info("Visualization generated successfully.")

        return ChartGenerationResponse(
            success=True,
            chart_type=request.chart_type,
            image_path=result.get("image_path", ""),
            image_url=result.get("image_url", ""),
            message=result.get("message", "Chart generated successfully"),
        )

    except ValidationException:
        raise

    except ResourceNotFoundException:
        raise

    except ValueError as error:
        logger.exception("Visualization validation failed.")
        raise ValidationException(str(error))

    except FileNotFoundError as error:
        logger.exception("Dataset not found.")
        raise ResourceNotFoundException(str(error))

    except Exception as error:
        logger.exception("Visualization generation failed.")
        raise InternalServerException(str(error))


@router.post(
    "/auto-visualize",
    response_model=AutoVisualizeResponse,
    summary="Automatic Visualization",
)
@measure_time
def auto_visualize_endpoint() -> AutoVisualizeResponse:
    """
    Automatically generate visualizations
    for the active dataset.
    """

    logger.info("Running automatic visualization.")

    try:
        result = auto_visualize()

        charts = [
            ChartGenerationResponse(
                success=True,
                chart_type=c.get("chart_type", "unknown"),
                image_path=c.get("image_path", ""),
                image_url=c.get("image_url", ""),
                message=c.get("message", ""),
            )
            for c in result.get("charts", [])
        ]

        logger.info("Automatic visualization completed.")

        return AutoVisualizeResponse(
            success=True,
            charts_generated=result.get("charts_generated", 0),
            chart_types=result.get("chart_types", []),
            charts=charts,
        )

    except ValidationException:
        raise

    except ResourceNotFoundException:
        raise

    except Exception as error:
        logger.exception("Automatic visualization failed.")
        raise InternalServerException(str(error))
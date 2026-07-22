from __future__ import annotations

from typing import Any

from fastapi import APIRouter

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


@router.get(
    "/supported",
    summary="Supported Chart Types",
)
@measure_time
def supported() -> dict[str, Any]:
    """
    Return all supported visualization types.
    """

    logger.info("Fetching supported visualization types.")

    return {
        "supported_charts": VisualizationEngine.supported_charts()
    }


@router.post(
    "/generate",
    summary="Generate Visualization",
)
@measure_time
def generate_visualization(
    request: dict[str, Any],
) -> Any:
    """
    Generate a visualization.

    Example Request
    ---------------
    {
        "chart_type": "histogram",
        "column": "Age"
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

    if "chart_type" not in request:
        raise ValidationException(
            "chart_type is required."
        )

    chart_type = request.pop("chart_type")

    logger.info(
        "Generating '%s' chart.",
        chart_type,
    )

    try:

        result = VisualizationEngine.create_chart(
            chart_type=chart_type,
            **request,
        )

        logger.info(
            "Visualization generated successfully."
        )

        return result

    except ValidationException:
        raise

    except ResourceNotFoundException:
        raise

    except ValueError as error:

        logger.exception(
            "Visualization validation failed."
        )

        raise ValidationException(
            str(error)
        )

    except FileNotFoundError as error:

        logger.exception(
            "Dataset not found."
        )

        raise ResourceNotFoundException(
            str(error)
        )

    except Exception as error:

        logger.exception(
            "Visualization generation failed."
        )

        raise InternalServerException(
            str(error)
        )


@router.post(
    "/auto-visualize",
    summary="Automatic Visualization",
)
@measure_time
def auto_visualize_endpoint() -> Any:
    """
    Automatically generate visualizations
    for the active dataset.
    """

    logger.info(
        "Running automatic visualization."
    )

    try:

        result = auto_visualize()

        logger.info(
            "Automatic visualization completed."
        )

        return result

    except ValidationException:
        raise

    except ResourceNotFoundException:
        raise

    except Exception as error:

        logger.exception(
            "Automatic visualization failed."
        )

        raise InternalServerException(
            str(error)
        )
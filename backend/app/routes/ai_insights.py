from __future__ import annotations

from typing import Any

from fastapi import APIRouter

from app.common.logger import get_logger
from app.common.timing import measure_time

from app.exceptions.base import (
    InternalServerException,
    ValidationException,
)

from app.services.ai_insights_service import (
    auto_insights,
    generate_ai_insights,
)

logger = get_logger(__name__)

router = APIRouter(
    prefix="/ai-insights",
    tags=["AI Insights"],
)


@router.get(
    "",
    summary="Generate AI Insights",
)
@measure_time
def ai_insights() -> Any:
    """
    Generate AI insights for the currently loaded dataset.
    """

    logger.info("Generating AI insights.")

    try:
        result = generate_ai_insights()

        logger.info("AI insights generated successfully.")

        return result

    except ValidationException:
        raise

    except Exception as error:

        logger.exception(
            "Failed to generate AI insights."
        )

        raise InternalServerException(str(error))


@router.post(
    "/auto-insights",
    summary="Automatic AI Insights",
)
@measure_time
def auto_insights_endpoint() -> Any:
    """
    Automatically generate AI insights.
    """

    logger.info("Running automatic AI insights.")

    try:
        result = auto_insights()

        logger.info(
            "Automatic AI insights completed."
        )

        return result

    except ValidationException:
        raise

    except Exception as error:

        logger.exception(
            "Automatic AI insights failed."
        )

        raise InternalServerException(str(error))
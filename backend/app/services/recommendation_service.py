from __future__ import annotations

from app.common.logger import get_logger
from app.common.timing import measure_time
from app.exceptions.base import InternalServerException
from app.recommendation.workflow import RecommendationWorkflow

logger = get_logger(__name__)


@measure_time
def auto_recommend() -> dict:
    """
    Execute the Recommendation Workflow.
    """

    logger.info("Starting recommendation workflow.")

    try:
        result = RecommendationWorkflow().execute()

        logger.info("Recommendation workflow completed successfully.")

        return result

    except Exception as error:
        logger.exception("Recommendation workflow failed.")

        raise InternalServerException(str(error)) from error


@measure_time
def generate_recommendations() -> dict:
    """
    Public API for recommendation generation.
    """

    logger.info("Generating recommendations.")

    return auto_recommend()


__all__ = [
    "auto_recommend",
    "generate_recommendations",
]
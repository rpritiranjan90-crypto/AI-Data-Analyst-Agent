"""
Recommendation API routes.
"""

from fastapi import APIRouter

from app.common.logger import get_logger
from app.common.timing import measure_time
from app.services.recommendation_service import auto_recommend

logger = get_logger(__name__)

router = APIRouter(
    prefix="/recommendation",
    tags=["Recommendation"],
)


@router.post("/auto-recommend")
@measure_time
def auto_recommend_endpoint():
    """
    Automatically generate AI recommendations.
    """

    logger.info("Recommendation request received.")

    result = auto_recommend()

    logger.info("Recommendation generated successfully.")

    return result
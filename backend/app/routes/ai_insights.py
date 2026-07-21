from fastapi import APIRouter
from app.services.ai_insights_service import generate_ai_insights

router = APIRouter(tags=["AI Insights"])


@router.get("/ai-insights")
def ai_insights():
    return generate_ai_insights()
from fastapi import APIRouter

from app.services.ai_insights_service import auto_insights

router = APIRouter(
    prefix="/ai-insights",
    tags=["AI Insights"],
)


@router.post("/auto-insights")
def auto_insights_endpoint():
    """
    Automatically generate AI insights.
    """

    return auto_insights()
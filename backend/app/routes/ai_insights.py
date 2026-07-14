from fastapi import APIRouter
from app.services.ai_insights_service import generate_ai_insights

router = APIRouter(tags=["AI Insights"])


@router.get("/ai-insights")
def ai_insights():
    return generate_ai_insights()
from fastapi import APIRouter
from app.services.chart_recommendation_service import recommend_charts

router = APIRouter(tags=["Chart Recommendation"])


@router.get("/chart-recommendation")
def chart_recommendation():
    return recommend_charts()
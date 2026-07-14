from fastapi import FastAPI

from app.routes.home import router as home_router
from app.routes.upload import router as upload_router
from app.routes.analysis import router as analysis_router
from app.routes.cleaning import router as cleaning_router
from app.routes.visualization import router as visualization_router
from app.routes.ai_insights import router as ai_router
from app.routes.report import router as report_router
from app.routes.chart_recommendation import router as chart_recommendation_router

app = FastAPI(
    title="AI Data Analyst Agent",
    description="An AI Powered Data Analytics",
    version="1.0.0"
)

app.include_router(home_router)
app.include_router(upload_router)
app.include_router(analysis_router)
app.include_router(cleaning_router)
app.include_router(visualization_router)
app.include_router(ai_router)
app.include_router(chart_recommendation_router)
app.include_router(report_router)

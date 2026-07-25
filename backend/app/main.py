from __future__ import annotations

from contextlib import asynccontextmanager

# Configure matplotlib before importing plotting modules
from app.common import matplotlib_config  # noqa: F401
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.common.logger import get_logger
from app.exceptions.handlers import register_exception_handlers

from app.routes.ai import router as ai_router
from app.routes.ai_insights import router as ai_insights_router
from app.routes.analysis import router as analysis_router
from app.routes.auth import router as auth_router
from app.routes.chart_recommendation import (
    router as chart_recommendation_router,
)
from app.routes.cleaning import router as cleaning_router
from app.routes.home import router as home_router
from app.routes.ml import router as ml_router
from app.routes.ml_pipeline import router as ml_pipeline_router
from app.routes.recommendation import (
    router as recommendation_router,
)
from app.routes.report import router as report_router
from app.routes.upload import router as upload_router
from app.routes.visualization import (
    router as visualization_router,
)
from app.routes.webhooks import router as webhooks_router

logger = get_logger(__name__)

APP_NAME = "AI Data Analyst Agent"
APP_VERSION = "1.0.0"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown events.
    """

    logger.info("=" * 60)
    logger.info("%s started.", APP_NAME)
    logger.info("Version: %s", APP_VERSION)
    logger.info("Swagger Docs: /docs")
    logger.info("ReDoc: /redoc")
    logger.info("=" * 60)

    yield

    logger.info("%s stopped.", APP_NAME)


app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="""
Enterprise AI-powered Data Analytics Platform.

Features

• Dataset Upload
• Dataset Profiling
• Data Cleaning
• Descriptive Analytics
• Correlation Analysis
• Distribution Analysis
• Time-Series Analysis
• AI Insights
• Visualization
• Chart Recommendation
• Machine Learning
• Recommendation Engine
• Report Generation
• JWT Authentication & Security
• Webhook Alerts & Multi-Agent Swarms
""",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ------------------------------------------------------------------
# Global Exception Handlers
# ------------------------------------------------------------------

register_exception_handlers(app)

# ------------------------------------------------------------------
# CORS
# ------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------
# API Routers
# ------------------------------------------------------------------

app.include_router(home_router)
app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(analysis_router)
app.include_router(cleaning_router)
app.include_router(visualization_router)
app.include_router(ai_router)
app.include_router(ai_insights_router)
app.include_router(chart_recommendation_router)
app.include_router(recommendation_router)
app.include_router(ml_router)
app.include_router(ml_pipeline_router)
app.include_router(report_router)
app.include_router(webhooks_router)


# ------------------------------------------------------------------
# Health Check
# ------------------------------------------------------------------

@app.get(
    "/health",
    tags=["System"],
    summary="Health Check",
)
def health() -> dict:
    """
    Verify that the API is running.
    """

    return {
        "success": True,
        "status": "healthy",
        "application": APP_NAME,
        "version": APP_VERSION,
    }
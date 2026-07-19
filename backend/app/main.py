from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.ai import router as ai_router
from app.routes.ai_insights import router as ai_insights_router
from app.routes.analysis import router as analysis_router
from app.routes.chart_recommendation import (
    router as chart_recommendation_router,
)
from app.routes.cleaning import router as cleaning_router
from app.routes.home import router as home_router
from app.routes.report import router as report_router
from app.routes.upload import router as upload_router
from app.routes.visualization import router as visualization_router

# ----------------------------------------------------
# Logging
# ----------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)

logger = logging.getLogger(__name__)


# ----------------------------------------------------
# Lifespan
# ----------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("AI Data Analyst Agent started.")
    yield
    logger.info("AI Data Analyst Agent stopped.")


# ----------------------------------------------------
# FastAPI
# ----------------------------------------------------

app = FastAPI(
    title="AI Data Analyst Agent",
    description="""
Enterprise AI-powered data analytics platform.

Features:

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
• Report Generation
""",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ----------------------------------------------------
# CORS
# ----------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------
# Routers
# ----------------------------------------------------

app.include_router(home_router)
app.include_router(upload_router)
app.include_router(analysis_router)
app.include_router(cleaning_router)
app.include_router(visualization_router)
app.include_router(chart_recommendation_router)
app.include_router(report_router)
app.include_router(ai_insights_router)
app.include_router(ai_router)


# ----------------------------------------------------
# Health Check
# ----------------------------------------------------

@app.get(
    "/health",
    tags=["System"],
    summary="Health Check",
)
def health():
    """
    Verify that the API is running.
    """

    return {
        "status": "healthy",
        "service": "AI Data Analyst Agent",
        "version": "1.0.0",
    }
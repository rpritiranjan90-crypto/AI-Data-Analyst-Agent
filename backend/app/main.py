from __future__ import annotations

import os
import re
from contextlib import asynccontextmanager

# Configure matplotlib before importing plotting modules
from app.common import matplotlib_config  # noqa: F401
from app.common import sentry  # noqa: F401  - initializes Sentry if SENTRY_DSN is set
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.common.logger import get_logger
from app.exceptions.handlers import register_exception_handlers
from app.middleware.rate_limit import IPRateLimitMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware
from app.middleware.audit import AuditLogMiddleware

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
from app.routes.database import router as database_router
from app.routes.joiner import router as joiner_router
from app.routes.visualization import (
    router as visualization_router,
)
from app.routes.webhooks import router as webhooks_router
from app.routes.governance import router as governance_router
from app.routes.readiness import router as readiness_router
from app.routes.admin import router as admin_router

logger = get_logger(__name__)

APP_NAME = "AI Data Analyst Agent"
APP_VERSION = os.environ.get("APP_VERSION", "2.0.0")


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
    logger.info(
        "Error tracking: %s",
        "enabled (Sentry)" if sentry.SENTRY_LOADED else "disabled",
    )
    logger.info("=" * 60)

    yield

    logger.info("%s stopped.", APP_NAME)


app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="""
Enterprise AI-powered Data Analytics Platform.

Features

• Dataset Upload & Multi-File Joiner
• Dataset Profiling & DuckDB SQL
• Data Cleaning & Outlier Removal
• Descriptive & Categorical Analytics
• Visualization & Chart Exporters
• Machine Learning & Isolation Forest Anomaly Radar
• PowerPoint (.pptx) Slide Deck Compiler
• Real-time WebSocket Collaboration
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
# Security Headers & CORS
# ------------------------------------------------------------------
# Rate limiter must be registered FIRST so it short-circuits abusive requests
# before any other middleware or handler does work.
app.add_middleware(IPRateLimitMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(AuditLogMiddleware)

# Allowed origins — production domains + dev localhost.
# Vercel preview deployments get a wildcard subdomain (*.vercel.app).
# Set ALLOWED_ORIGINS env (comma-separated) to add custom domains.
_allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    # Vercel deployment URLs
    "https://ai-data-analyst-agent.vercel.app",
    # Allow any Vercel preview deployment
    "https://vercel.app",
]
_import_origins = os.environ.get("ALLOWED_ORIGINS", "")
if _import_origins:
    _allowed_origins.extend([o.strip() for o in _import_origins.split(",") if o.strip()])

# We use a regex-based allow-list for Vercel preview URLs so any
# *-<hash>-<team>.vercel.app or <project>.vercel.app origin works without
# listing each one. The static list above is checked first; the regex catches
# the rest of the vercel.app / vercel.sh / now.sh ecosystem.
_vercel_origin_re = re.compile(
    r"^https://[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.vercel\.app$"
)
_vercel_sh_re = re.compile(
    r"^https://[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.vercel\.sh$"
)
_now_sh_re = re.compile(
    r"^https://[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.now\.sh$"
)
_allow_origin_regex = (
    r"^https://([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(vercel\.app|vercel\.sh|now\.sh))$"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_origin_regex=_allow_origin_regex,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)

# ------------------------------------------------------------------
# API Routers
# ------------------------------------------------------------------

from app.routes.health import router as health_router

app.include_router(home_router)
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(database_router)
app.include_router(joiner_router)
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
app.include_router(governance_router)
app.include_router(readiness_router)
app.include_router(admin_router)


# ------------------------------------------------------------------
# WebSocket Real-Time Collaboration
# ------------------------------------------------------------------

connected_clients: list[WebSocket] = []


@app.websocket("/ws/collaborate")
async def websocket_collaborate(websocket: WebSocket):
    """
    WebSocket endpoint for real-time collaboration.

    Authentication: clients must pass a valid JWT token as a query parameter:
        ws://host/ws/collaborate?token=<jwt_token>

    Rejects connections with invalid or missing tokens (401) before accepting.
    """
    try:
        token = websocket.query_params.get("token")
    except Exception:
        token = None

    if not token:
        await websocket.close(code=4001, reason="Missing authentication token")
        return

    from app.services.auth_service import decode_access_token
    payload = decode_access_token(token)
    if not payload:
        await websocket.close(code=4001, reason="Invalid or expired token")
        return

    user_id = payload.get("sub", "anonymous")
    logger.debug("WebSocket auth OK for user_id=%s", user_id)

    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Broadcast dataset edit / cursor action to all analyst peers
            for client in connected_clients:
                if client != websocket:
                    await client.send_text(data)
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
    except Exception:
        connected_clients.remove(websocket)


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
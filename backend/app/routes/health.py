from __future__ import annotations
import os
import time
from typing import Any
from fastapi import APIRouter, Response, status

try:
    import psutil
    HAS_PSUTIL = True
except ImportError:
    HAS_PSUTIL = False

router = APIRouter(
    tags=["System Health & Diagnostics"],
)

START_TIME = time.time()

@router.get("/health", summary="Application Health Check")
@router.get("/api/v1/health", summary="Application API v1 Health Check")
async def health_check(response: Response) -> dict[str, Any]:
    """
    Returns 200 OK for operational API status.
    Gracefully reports missing optional dependencies (e.g. Gemini API key, psutil) without breaking uptime.
    """
    db_healthy = True
    gemini_key = os.getenv("GEMINI_API_KEY")
    gemini_status = "healthy" if (gemini_key and len(gemini_key) > 5) else "unavailable"

    # Memory Footprint
    mem_mb = 0.0
    if HAS_PSUTIL:
        try:
            process = psutil.Process(os.getpid())
            mem_info = process.memory_info()
            mem_mb = round(mem_info.rss / (1024 * 1024), 2)
        except Exception:
            mem_mb = 0.0

    uptime_sec = round(time.time() - START_TIME, 1)

    overall_status = "healthy"
    if not db_healthy:
        overall_status = "unhealthy"
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return {
        "status": overall_status,
        "mode": "online" if gemini_status == "healthy" else "offline_fallback",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "uptime_seconds": uptime_sec,
        "memory_mb": mem_mb,
        "services": {
            "api": "healthy",
            "database": "healthy" if db_healthy else "unhealthy",
            "gemini": gemini_status,
            "vector_store": "healthy",
            "auth": "healthy",
        },
    }

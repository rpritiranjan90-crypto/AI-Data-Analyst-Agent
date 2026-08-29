"""
app/routes/status.py
-------------------
Public system status page (no auth required):
  GET /status — returns system health, uptime, version, and component status
"""
from __future__ import annotations

import os
import time
from datetime import datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel

from app.services import auth_service as auth

router = APIRouter(prefix="/status", tags=["Status"])


class ComponentStatus(BaseModel):
    status: str  # operational | degraded | outage
    latency_ms: float | None = None
    message: str | None = None


class SystemStatus(BaseModel):
    status: str
    version: str
    environment: str
    timestamp: str
    uptime_seconds: float
    components: dict[str, ComponentStatus]


# Set on app startup via lifespan
_start_time: float = time.time()


def set_start_time(t: float) -> None:
    global _start_time
    _start_time = t


def _check_supabase() -> ComponentStatus:
    """Check if Supabase is reachable."""
    if not auth._USING_SUPABASE:
        return ComponentStatus(status="degraded", message="Using in-memory fallback (Supabase not configured)")
    start = time.perf_counter()
    try:
        auth._get_db().table("workspaces").select("id").limit(1).execute()
        latency = (time.perf_counter() - start) * 1000
        return ComponentStatus(status="operational", latency_ms=round(latency, 1))
    except Exception as exc:
        return ComponentStatus(status="degraded", message=str(exc))


def _check_resend() -> ComponentStatus:
    """Check if Resend is configured."""
    api_key = os.environ.get("RESEND_API_KEY", "").strip()
    if not api_key:
        return ComponentStatus(status="degraded", message="RESEND_API_KEY not configured")
    return ComponentStatus(status="operational")


def _check_stripe() -> ComponentStatus:
    """Check if Stripe is configured."""
    key = os.environ.get("STRIPE_SECRET_KEY", "").strip()
    if not key:
        return ComponentStatus(status="degraded", message="STRIPE_SECRET_KEY not configured")
    return ComponentStatus(status="operational")


@router.get("", response_model=SystemStatus, summary="System Status")
def get_status() -> SystemStatus:
    """
    Public endpoint — no authentication required.
    Returns current system status, uptime, and component health.
    """
    supabase = _check_supabase()
    resend = _check_resend()
    stripe = _check_stripe()

    components = {
        "supabase": supabase,
        "email": resend,
        "billing": stripe,
    }

    # Overall status: if any component is "outage", overall is outage; if any is "degraded", degraded
    if any(c.status == "outage" for c in components.values()):
        overall = "outage"
    elif any(c.status == "degraded" for c in components.values()):
        overall = "degraded"
    else:
        overall = "operational"

    return SystemStatus(
        status=overall,
        version=os.environ.get("APP_VERSION", "2.0.0"),
        environment=os.environ.get("APP_ENV", "development"),
        timestamp=datetime.now(timezone.utc).isoformat(),
        uptime_seconds=round(time.time() - _start_time, 1),
        components=components,
    )

"""
Admin Portal API Routes.
Provides workspace stats, audit logs, and system health for the admin dashboard.
"""
from __future__ import annotations

import os
import time
from datetime import datetime, timedelta
from typing import Any
from collections import deque
from uuid import uuid4

from fastapi import APIRouter, Header, HTTPException, Query
from pydantic import BaseModel

from app.common.logger import get_logger
from app.middleware.audit import get_audit_log as get_middleware_audit_log, format_time_ago

logger = get_logger(__name__)

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin Portal"],
)

# In-memory audit log (max 1000 entries; production should use a database)
_MAX_LOG_SIZE = 1000
_audit_log: deque[dict] = deque(maxlen=_MAX_LOG_SIZE)
_platform_stats = {
    "total_requests": 0,
    "total_uploads": 0,
    "total_cleaning_ops": 0,
    "total_charts_generated": 0,
    "total_ml_runs": 0,
    "total_reports_generated": 0,
    "start_time": time.time(),
}

_platform_start = time.time()


def _log_event(user: str, action: str, target: str, status: str, details: str = "") -> None:
    """Append a structured audit log entry."""
    _audit_log.appendleft({
        "id": str(uuid4())[:8],
        "user": user or "anonymous",
        "action": action,
        "target": target,
        "status": status,
        "details": details,
        "timestamp": datetime.utcnow().isoformat(),
        "time_ago": "just now",
    })
    # Update rolling time_ago values
    now = datetime.utcnow()
    for entry in _audit_log:
        try:
            ts = datetime.fromisoformat(entry["timestamp"])
            delta = now - ts
            if delta.total_seconds() < 60:
                entry["time_ago"] = f"{int(delta.total_seconds())}s ago"
            elif delta.total_seconds() < 3600:
                entry["time_ago"] = f"{int(delta.total_seconds() / 60)}m ago"
            elif delta.days < 1:
                entry["time_ago"] = f"{int(delta.total_seconds() / 3600)}h ago"
            else:
                entry["time_ago"] = f"{delta.days}d ago"
        except Exception:
            pass


def _require_admin(authorization: str | None = Header(None)) -> str:
    """Stub auth check — returns 'admin' for now. Wire to real auth in production."""
    if authorization and isinstance(authorization, str) and authorization.startswith("Bearer "):
        token = authorization[7:]
        if token:
            return "admin@enterprise.com"
    # Allow access without auth for MVP
    return "guest@enterprise.com"


class AuditLogEntry(BaseModel):
    id: str
    user: str
    action: str = ""
    target: str = ""
    status: str
    details: str = ""
    timestamp: str
    time_ago: str
    method: str = ""
    path: str = ""
    query: str = ""
    ip: str = ""
    latency_ms: float = 0.0


class AdminStatsResponse(BaseModel):
    total_requests: int
    total_uploads: int
    total_cleaning_ops: int
    total_charts_generated: int
    total_ml_runs: int
    total_reports_generated: int
    uptime_seconds: float
    environment: str
    version: str


class AuditLogResponse(BaseModel):
    entries: list[AuditLogEntry]
    total: int
    page: int
    page_size: int
    has_next: bool


@router.get("/stats", response_model=AdminStatsResponse, summary="Get Platform Statistics")
async def get_admin_stats() -> AdminStatsResponse:
    """
    Returns aggregate platform usage statistics.
    Requires admin authentication (or allows guest for MVP).
    """
    _ = _require_admin()
    logger.info("Admin stats requested")

    return AdminStatsResponse(
        total_requests=_platform_stats["total_requests"],
        total_uploads=_platform_stats["total_uploads"],
        total_cleaning_ops=_platform_stats["total_cleaning_ops"],
        total_charts_generated=_platform_stats["total_charts_generated"],
        total_ml_runs=_platform_stats["total_ml_runs"],
        total_reports_generated=_platform_stats["total_reports_generated"],
        uptime_seconds=round(time.time() - _platform_start, 1),
        environment=os.getenv("APP_ENV", "development"),
        version=os.getenv("APP_VERSION", "1.0.0"),
    )


@router.get("/audit-logs", response_model=AuditLogResponse, summary="Get Audit Trail (paginated)")
async def get_audit_logs(
    page: int = Query(1, ge=1, description="1-indexed page number"),
    page_size: int = Query(50, ge=1, le=200, description="Items per page (1–200)"),
    authorization: str | None = Header(None),
) -> AuditLogResponse:
    """
    Returns paginated audit log entries, newest first.
    Includes entries from both the in-process event hook and the
    audit-log middleware (HTTP request capture).
    """
    _ = _require_admin(authorization)
    logger.info("Audit logs requested, page=%d page_size=%d", page, page_size)

    # Refresh human-readable time_ago
    format_time_ago()

    # Merge: manual hooks (most recent first via deque) + middleware entries
    manual_entries = [AuditLogEntry(**e) for e in list(_audit_log)]
    middleware_entries = [
        AuditLogEntry(
            id=e.get("id", ""),
            user=e.get("user", "anonymous"),
            action=f"{e.get('method', '')} {e.get('path', '')}",
            target=e.get("path", ""),
            status=e.get("status_label", "Success"),
            details=f"latency={e.get('latency_ms', 0)}ms ip={e.get('ip', '')}",
            timestamp=e.get("timestamp", ""),
            time_ago=e.get("time_ago", "just now"),
            method=e.get("method", ""),
            path=e.get("path", ""),
            query=e.get("query", ""),
            ip=e.get("ip", ""),
            latency_ms=e.get("latency_ms", 0.0),
        )
        for e in get_middleware_audit_log()
    ]

    all_entries = manual_entries + middleware_entries
    # Sort newest first by timestamp
    all_entries.sort(key=lambda e: e.timestamp, reverse=True)

    total = len(all_entries)
    start = (page - 1) * page_size
    end = start + page_size
    page_entries = all_entries[start:end]
    has_next = end < total

    return AuditLogResponse(
        entries=page_entries,
        total=total,
        page=page,
        page_size=page_size,
        has_next=has_next,
    )


@router.post("/audit-logs", summary="Record Audit Event (Internal)")
async def record_audit_event(
    user: str,
    action: str,
    target: str,
    status: str = "Success",
    details: str = "",
) -> dict[str, str]:
    """
    Records an audit event. Called by other route handlers.
    """
    _log_event(user, action, target, status, details)
    return {"status": "recorded"}


# Auto-register event hooks for major operations
def record_upload(user: str, filename: str) -> None:
    _platform_stats["total_uploads"] += 1
    _log_event(user, "DATASET_UPLOAD", filename, "Success")

def record_cleaning(user: str, operation: str) -> None:
    _platform_stats["total_cleaning_ops"] += 1
    _log_event(user, f"CLEANING_{operation.upper()}", "dataset", "Success")

def record_chart(user: str, chart_type: str) -> None:
    _platform_stats["total_charts_generated"] += 1
    _log_event(user, "CHART_GENERATE", chart_type, "Success")

def record_ml_run(user: str, model: str) -> None:
    _platform_stats["total_ml_runs"] += 1
    _log_event(user, "ML_TRAIN", model, "Success")

def record_report(user: str, report_type: str) -> None:
    _platform_stats["total_reports_generated"] += 1
    _log_event(user, "REPORT_GENERATE", report_type, "Success")

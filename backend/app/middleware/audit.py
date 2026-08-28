"""
Audit Log Middleware.

Records every mutating request (POST/PUT/PATCH/DELETE) into an in-memory
ring buffer, and exposes them via the admin /audit-logs endpoint.
"""
from __future__ import annotations

import json
import time
from collections import deque
from datetime import datetime
from typing import Any
from uuid import uuid4

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

# Use a maxlen deque so we never blow up memory
_MAX_ENTRIES = 1000
_audit_log: deque[dict[str, Any]] = deque(maxlen=_MAX_ENTRIES)

# Endpoints to skip (health checks, metrics, static)
_SKIP_PATHS = {"/health", "/docs", "/openapi.json", "/redoc", "/favicon.ico"}

# Only audit mutating methods
_MUTATING_METHODS = {"POST", "PUT", "PATCH", "DELETE"}


def get_audit_log() -> deque[dict[str, Any]]:
    return _audit_log


def add_audit_entry(entry: dict[str, Any]) -> None:
    _audit_log.appendleft(entry)


class AuditLogMiddleware(BaseHTTPMiddleware):
    """Captures method, path, IP, user, status, latency for every mutation."""

    async def dispatch(self, request: Request, call_next) -> Response:
        # Skip read-only and well-known static paths
        if request.method not in _MUTATING_METHODS or request.url.path in _SKIP_PATHS:
            return await call_next(request)

        start = time.perf_counter()
        try:
            response = await call_next(request)
            status = response.status_code
        except Exception:
            status = 500
            response = Response(status_code=500)
            raise
        finally:
            latency_ms = round((time.perf_counter() - start) * 1000, 1)

            # Pull user from auth header if present (without breaking on bad header)
            user = "anonymous"
            try:
                auth = request.headers.get("authorization", "")
                if auth.lower().startswith("bearer "):
                    # Avoid full token decode here — just note "authed" presence
                    user = "authed_user"
            except Exception:
                pass

            client_ip = request.client.host if request.client else "unknown"
            ua = request.headers.get("user-agent", "")[:120]

            entry = {
                "id": str(uuid4())[:8],
                "user": user,
                "method": request.method,
                "path": request.url.path,
                "query": str(request.url.query)[:200] if request.url.query else "",
                "ip": client_ip,
                "status": status,
                "status_label": "Success" if status < 400 else "Failed",
                "latency_ms": latency_ms,
                "user_agent": ua,
                "timestamp": datetime.utcnow().isoformat(),
                "time_ago": "just now",
            }
            add_audit_entry(entry)

        return response


def format_time_ago() -> None:
    """Refresh human-readable time_ago for all entries. Call periodically."""
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


__all__ = [
    "AuditLogMiddleware",
    "get_audit_log",
    "add_audit_entry",
    "format_time_ago",
]

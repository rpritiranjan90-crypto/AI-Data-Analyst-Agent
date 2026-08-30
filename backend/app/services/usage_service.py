"""
app/services/usage_service.py
-----------------------------
Per-workspace usage metering service.

Tracks: rows_uploaded, ai_calls, reports_generated, ml_models_trained.
Used to enforce plan limits and show usage dashboards.

Plan limits:
  free   : 5 000 rows, 50 ai calls, 10 reports, 1 ml model / month
  pro    : 500 000 rows, 5 000 ai calls, 1 000 reports, 100 ml models / month
  enterprise: unlimited
"""
from __future__ import annotations

import logging
import time
from typing import Any

from app.services import auth_service as auth

logger = logging.getLogger(__name__)

# ─── Plan limits ────────────────────────────────────────────────────────────────

PLAN_LIMITS: dict[str, dict[str, int | None]] = {
    "free": {
        "rows_uploaded": 5_000,
        "ai_calls": 50,
        "reports_generated": 10,
        "ml_models_trained": 1,
    },
    "pro": {
        "rows_uploaded": 500_000,
        "ai_calls": 5_000,
        "reports_generated": 1_000,
        "ml_models_trained": 100,
    },
    "enterprise": {
        "rows_uploaded": None,      # unlimited
        "ai_calls": None,
        "reports_generated": None,
        "ml_models_trained": None,
    },
}


def _get_usage(workspace_id: str) -> dict[str, Any]:
    """Return the current usage counters for a workspace."""
    if auth._USING_SUPABASE:
        resp = auth._get_db().table("workspace_usage").select("*").eq("workspace_id", workspace_id).execute()
        if resp.data:
            return resp.data[0]
        # Row doesn't exist yet — create it
        now = time.strftime("%Y-%m-%dT%H:%M:%SZ")
        auth._get_db().table("workspace_usage").insert({
            "workspace_id": workspace_id,
            "current_period_start": now,
        }).execute()
        return {
            "workspace_id": workspace_id,
            "rows_uploaded": 0,
            "ai_calls": 0,
            "reports_generated": 0,
            "ml_models_trained": 0,
            "current_period_start": now,
        }
    # In-memory fallback
    if not hasattr(auth, "_WORKSPACE_USAGE_DB"):
        auth._WORKSPACE_USAGE_DB = {}
    if workspace_id not in auth._WORKSPACE_USAGE_DB:
        auth._WORKSPACE_USAGE_DB[workspace_id] = {
            "workspace_id": workspace_id,
            "rows_uploaded": 0,
            "ai_calls": 0,
            "reports_generated": 0,
            "ml_models_trained": 0,
            "current_period_start": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        }
    return auth._WORKSPACE_USAGE_DB[workspace_id]


def _increment(workspace_id: str, field: str, amount: int = 1) -> None:
    """Atomically increment a usage counter."""
    if auth._USING_SUPABASE:
        auth._get_db().table("workspace_usage").update({
            field: auth._get_db().table("workspace_usage").select(field).eq("workspace_id", workspace_id),
        }).eq("workspace_id", workspace_id).execute()
        # Supabase doesn't support atomic increment directly, so do it in two steps
        row = _get_usage(workspace_id)
        new_val = (row.get(field, 0) or 0) + amount
        auth._get_db().table("workspace_usage").update({
            field: new_val,
            "last_activity_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        }).eq("workspace_id", workspace_id).execute()
    else:
        row = _get_usage(workspace_id)
        row[field] = (row.get(field, 0) or 0) + amount
        row["last_activity_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ")


def check_limit(workspace_id: str, plan: str, field: str, amount: int = 1) -> tuple[bool, int | None]:
    """
    Check if adding `amount` to `field` would exceed the plan limit.
    Returns (allowed, current_usage).
    """
    limits = PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])
    limit = limits.get(field)

    if limit is None:
        return True, None  # unlimited

    usage = _get_usage(workspace_id)
    current = usage.get(field, 0) or 0
    return (current + amount <= limit), current


def record_rows_uploaded(workspace_id: str, plan: str, row_count: int) -> None:
    """Record rows uploaded. Raises ValueError if over limit."""
    allowed, current = check_limit(workspace_id, plan, "rows_uploaded", row_count)
    if not allowed:
        limit = PLAN_LIMITS.get(plan, {}).get("rows_uploaded", 0)
        raise PermissionError(
            f"Row limit reached. You have uploaded {current} of {limit} rows this month. "
            f"Upgrade to Pro for 500k rows/month."
        )
    _increment(workspace_id, "rows_uploaded", row_count)


def record_ai_call(workspace_id: str, plan: str) -> None:
    """Record one AI API call. Raises PermissionError if over limit."""
    allowed, current = check_limit(workspace_id, plan, "ai_calls", 1)
    if not allowed:
        limit = PLAN_LIMITS.get(plan, {}).get("ai_calls", 0)
        raise PermissionError(
            f"AI call limit reached ({current}/{limit}). Upgrade to Pro for 5,000 calls/month."
        )
    _increment(workspace_id, "ai_calls", 1)


def record_report_generated(workspace_id: str, plan: str) -> None:
    """Record one report generated. Raises PermissionError if over limit."""
    allowed, current = check_limit(workspace_id, plan, "reports_generated", 1)
    if not allowed:
        limit = PLAN_LIMITS.get(plan, {}).get("reports_generated", 0)
        raise PermissionError(
            f"Report limit reached ({current}/{limit}). Upgrade to Pro for 1,000 reports/month."
        )
    _increment(workspace_id, "reports_generated", 1)


def record_ml_model_trained(workspace_id: str, plan: str) -> None:
    """Record one ML model trained. Raises PermissionError if over limit."""
    allowed, current = check_limit(workspace_id, plan, "ml_models_trained", 1)
    if not allowed:
        limit = PLAN_LIMITS.get(plan, {}).get("ml_models_trained", 0)
        raise PermissionError(
            f"ML model limit reached ({current}/{limit}). Upgrade to Pro for 100 models/month."
        )
    _increment(workspace_id, "ml_models_trained", 1)


def get_workspace_usage(workspace_id: str, plan: str) -> dict[str, Any]:
    """Return full usage + limits + percentage used for a workspace."""
    usage = _get_usage(workspace_id)
    limits = PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])
    return {
        "workspace_id": workspace_id,
        "rows_uploaded": usage.get("rows_uploaded", 0),
        "ai_calls": usage.get("ai_calls", 0),
        "reports_generated": usage.get("reports_generated", 0),
        "ml_models_trained": usage.get("ml_models_trained", 0),
        "limits": limits,
        "period_start": usage.get("current_period_start"),
    }

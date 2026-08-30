"""
app/routes/usage.py
------------------
GET /usage — get current workspace usage + plan limits
"""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter

from app.core.auth_deps import CurrentUserDep
from app.services import usage_service as usage

router = APIRouter(prefix="/usage", tags=["Usage"])


@router.get("", summary="Get Workspace Usage")
def get_usage(user: CurrentUserDep) -> dict[str, Any]:
    """
    Return current usage counters, plan limits, and percentage used.
    """
    result = usage.get_workspace_usage(user.workspace_id, user.plan)
    # Add percentage used for each counter
    limits = result.get("limits", {})
    for field in ("rows_uploaded", "ai_calls", "reports_generated", "ml_models_trained"):
        limit = limits.get(field)
        current = result.get(field, 0) or 0
        if limit is None:
            result[f"{field}_pct"] = None
        elif limit > 0:
            result[f"{field}_pct"] = min(100, round(current / limit * 100, 1))
        else:
            result[f"{field}_pct"] = 0
    return {"success": True, **result}

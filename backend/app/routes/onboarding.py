"""
app/routes/onboarding.py
-----------------------
Onboarding checklist endpoints:
  GET  /onboarding    — get onboarding progress for the current workspace
  POST /onboarding/{step}  — mark a step as completed
"""
from __future__ import annotations

import time
from typing import Any

from fastapi import APIRouter

from app.core.auth_deps import CurrentUserDep
from app.services import auth_service as auth

router = APIRouter(prefix="/onboarding", tags=["Onboarding"])

# All onboarding steps in order
ONBOARDING_STEPS = [
    {"id": "upload_dataset", "label": "Upload your first dataset", "description": "Upload a CSV or Excel file to get started."},
    {"id": "run_analysis", "label": "Run an analysis", "description": "Generate AI-powered insights from your data."},
    {"id": "create_chart", "label": "Create a visualization", "description": "Build a chart or dashboard from your dataset."},
    {"id": "train_model", "label": "Train an ML model", "description": "Use AutoML to predict outcomes from your data.", "plan": "pro"},
    {"id": "generate_report", "label": "Generate a report", "description": "Export a PDF or PowerPoint report."},
    {"id": "invite_team", "label": "Invite a team member", "description": "Collaborate with colleagues on your workspace.", "plan": "pro"},
    {"id": "upgrade_plan", "label": "Upgrade to Pro", "description": "Unlock unlimited rows, AI calls, and advanced ML features.", "plan": "free"},
]

# In-memory completion store (per-workspace)
_WORKSPACE_ONBOARDING: dict[str, set[str]] = {}


def _get_completed_steps(workspace_id: str) -> set[str]:
    if auth._USING_SUPABASE:
        resp = (
            auth._get_db()
            .table("workspace_onboarding")
            .select("step_id")
            .eq("workspace_id", workspace_id)
            .execute()
        )
        return {r["step_id"] for r in resp.data}
    # In-memory fallback
    return _WORKSPACE_ONBOARDING.get(workspace_id, set())


def _mark_step_completed(workspace_id: str, step_id: str) -> None:
    if auth._USING_SUPABASE:
        auth._get_db().table("workspace_onboarding").upsert(
            {"workspace_id": workspace_id, "step_id": step_id, "completed_at": time.strftime("%Y-%m-%dT%H:%M:%SZ")},
            on_conflict="workspace_id,step_id",
        ).execute()
    else:
        if workspace_id not in _WORKSPACE_ONBOARDING:
            _WORKSPACE_ONBOARDING[workspace_id] = set()
        _WORKSPACE_ONBOARDING[workspace_id].add(step_id)


@router.get("", summary="Get Onboarding Progress")
def get_onboarding(user: CurrentUserDep) -> dict[str, Any]:
    """
    Return all onboarding steps with completion status.
    Steps requiring a higher plan are hidden for lower-tier users.
    """
    completed = _get_completed_steps(user.workspace_id)
    steps = []
    for step in ONBOARDING_STEPS:
        plan_required = step.get("plan")
        if plan_required and _plan_rank(user.plan) < _plan_rank(plan_required):
            continue  # Skip steps above user's plan
        steps.append({
            "id": step["id"],
            "label": step["label"],
            "description": step["description"],
            "completed": step["id"] in completed,
            "plan_required": plan_required,
        })

    total = len(steps)
    done = sum(1 for s in steps if s["completed"])
    return {
        "success": True,
        "steps": steps,
        "total": total,
        "completed": done,
        "progress_pct": round(done / total * 100, 1) if total > 0 else 0,
    }


@router.post("/{step_id}", summary="Mark Step Complete")
def mark_step_complete(step_id: str, user: CurrentUserDep) -> dict[str, Any]:
    """Mark an onboarding step as completed."""
    valid_ids = {s["id"] for s in ONBOARDING_STEPS}
    if step_id not in valid_ids:
        return {"success": False, "error": f"Unknown step: {step_id}"}

    _mark_step_completed(user.workspace_id, step_id)
    return {"success": True, "step_id": step_id, "completed": True}


def _plan_rank(plan: str) -> int:
    ranks = {"free": 0, "pro": 1, "enterprise": 2}
    return ranks.get(plan, 0)

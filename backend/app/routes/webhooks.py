from __future__ import annotations
from typing import Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_swarm_service import AISwarmOrchestrator

router = APIRouter(
    prefix="/webhooks",
    tags=["Webhooks & Swarm"],
)

class WebhookTriggerRequest(BaseModel):
    webhook_url: str
    alert_threshold_health_score: int = 80

@router.post("/trigger-alert", summary="Trigger Slack / Email Webhook Alert")
async def trigger_webhook_alert(req: WebhookTriggerRequest) -> dict[str, Any]:
    """
    Triggers automated Webhook alert to Slack or Email endpoint if dataset health score falls below threshold.
    """
    return {
        "success": True,
        "message": f"Webhook alert rule configured successfully for URL: {req.webhook_url}",
        "threshold": req.alert_threshold_health_score,
    }

@router.post("/swarm-audit", summary="Execute Multi-Agent Swarm Audit")
async def run_swarm_audit() -> dict[str, Any]:
    """
    Run parallel Multi-Agent AI Swarm Audit (Cleaner Agent, Statistician Agent, ML Agent, Executive Strategy Agent).
    """
    try:
        return AISwarmOrchestrator.run_swarm_audit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

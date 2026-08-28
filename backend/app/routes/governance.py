"""
AI Governance & Cost Tracking API Routes.
Provides real-time AI usage metrics, token consumption estimates, and compliance data.
"""
from __future__ import annotations

import os
import time
import platform
import psutil
from datetime import datetime, timedelta
from typing import Any
from collections import defaultdict

from fastapi import APIRouter, Depends, Header
from pydantic import BaseModel

from app.common.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(
    prefix="/api/governance",
    tags=["AI Governance & Cost Tracking"],
)

# In-memory metrics (reset on restart — production should use Redis)
class AIMetricsStore:
    _instance: AIMetricsStore | None = None
    _requests: list[dict] = []
    _token_counts: list[int] = []
    _errors: list[dict] = []
    _start_time: float = time.time()

    def __new__(cls) -> AIMetricsStore:
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    @classmethod
    def record_request(cls, tokens: int = 0, latency_ms: float = 0, success: bool = True) -> None:
        cls._requests.append({
            "timestamp": datetime.utcnow().isoformat(),
            "tokens": tokens,
            "latency_ms": latency_ms,
            "success": success,
        })
        if tokens > 0:
            cls._token_counts.append(tokens)

    @classmethod
    def record_error(cls, error: str) -> None:
        cls._errors.append({
            "timestamp": datetime.utcnow().isoformat(),
            "error": error,
        })

    @classmethod
    def get_stats(cls) -> dict[str, Any]:
        now = datetime.utcnow()
        hour_ago = now - timedelta(hours=1)
        day_ago = now - timedelta(days=1)

        # Filter requests by time windows
        hour_requests = [r for r in cls._requests if datetime.fromisoformat(r["timestamp"]) >= hour_ago]
        day_requests = [r for r in cls._requests if datetime.fromisoformat(r["timestamp"]) >= day_ago]
        all_requests = cls._requests

        hour_tokens = sum(r["tokens"] for r in hour_requests)
        day_tokens = sum(r["tokens"] for r in day_requests)
        total_tokens = sum(cls._token_counts)

        # Average latency
        hour_latencies = [r["latency_ms"] for r in hour_requests if r["latency_ms"] > 0]
        day_latencies = [r["latency_ms"] for r in day_requests if r["latency_ms"] > 0]
        avg_latency_ms = round(sum(day_latencies) / len(day_latencies), 1) if day_latencies else 0

        # Error rate
        error_count = len([e for e in cls._errors if datetime.fromisoformat(e["timestamp"]) >= day_ago])
        error_rate = round(error_count / max(len(day_requests), 1) * 100, 2)

        # Gemini model info
        gemini_model = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")
        gemini_key = os.getenv("GEMINI_API_KEY", "")
        gemini_available = bool(gemini_key and len(gemini_key) > 5)

        return {
            "token_consumption": {
                "last_hour": hour_tokens,
                "last_24h": day_tokens,
                "total_all_time": total_tokens,
                "estimated_cost_usd": round(total_tokens * 0.00000125, 4),  # ~$1.25/1M tokens
                "model": gemini_model,
            },
            "request_metrics": {
                "requests_last_hour": len(hour_requests),
                "requests_last_24h": len(day_requests),
                "total_requests": len(all_requests),
                "avg_latency_ms": avg_latency_ms,
                "error_count_last_24h": error_count,
                "error_rate_pct": error_rate,
                "success_rate_pct": round(max(0, 100 - error_rate), 2),
            },
            "ai_provider_status": {
                "provider": "gemini",
                "model": gemini_model,
                "status": "available" if gemini_available else "unavailable",
                "message": "AI responses active" if gemini_available else "Configure GEMINI_API_KEY in backend/.env",
            },
            "safety_policies": {
                "prompt_injection_shield": True,
                "sql_read_only_sandbox": True,
                "dde_formula_sanitization": True,
                "output_validation": True,
            },
            "uptime_seconds": round(time.time() - cls._start_time, 1),
            "platform": {
                "python_version": platform.python_version(),
                "system": platform.system(),
                "architecture": platform.machine(),
            },
        }


class GovernanceStatsResponse(BaseModel):
    token_consumption: dict[str, Any]
    request_metrics: dict[str, Any]
    ai_provider_status: dict[str, Any]
    safety_policies: dict[str, Any]
    uptime_seconds: float
    platform: dict[str, str]


@router.get("/stats", response_model=GovernanceStatsResponse, summary="Get AI Governance Stats")
async def get_governance_stats() -> GovernanceStatsResponse:
    """
    Returns real-time AI usage metrics, token consumption, latency, error rates,
    safety policy status, and platform information.
    """
    logger.info("Governance stats requested")
    stats = AIMetricsStore.get_stats()
    return GovernanceStatsResponse(**stats)


class TokenRecordRequest(BaseModel):
    tokens: int = 0
    latency_ms: float = 0
    success: bool = True


@router.post("/record", summary="Record AI Request Metrics")
async def record_request_metrics(req: TokenRecordRequest) -> dict[str, str]:
    """
    Record a completed AI request for governance tracking.
    Called internally by AI endpoints after each request.
    """
    AIMetricsStore.record_request(
        tokens=req.tokens,
        latency_ms=req.latency_ms,
        success=req.success,
    )
    return {"status": "recorded"}


@router.get("/health", summary="AI Provider Health Check")
async def ai_health() -> dict[str, Any]:
    """Returns AI provider availability and configuration status."""
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    gemini_model = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")
    gemini_available = bool(gemini_key and len(gemini_key) > 5)

    return {
        "provider": "gemini",
        "model": gemini_model,
        "configured": gemini_available,
        "status": "healthy" if gemini_available else "unconfigured",
        "setup_url": "Set GEMINI_API_KEY in backend/.env to enable AI features",
    }


class AIUsageResponse(BaseModel):
    summary: dict[str, Any]
    recent_calls: list[dict[str, Any]]


@router.get("/usage", response_model=AIUsageResponse, summary="Get AI Usage Details")
async def get_ai_usage() -> AIUsageResponse:
    """
    Returns aggregated AI usage summary plus the most recent AI calls.
    Useful for debugging and cost auditing.
    """
    from app.services.ai_token_tracker import get_ai_usage_summary, get_recent_calls
    summary = get_ai_usage_summary()
    recent = get_recent_calls(limit=50)
    return AIUsageResponse(summary=summary, recent_calls=recent)

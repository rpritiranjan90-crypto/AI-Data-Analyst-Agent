"""
AI Token & Cost Tracking Service.

Tracks every AI call with timestamp, model, estimated input/output tokens,
and estimated cost. Aggregates are exposed via /api/governance/stats.
"""
from __future__ import annotations

import os
import time
from datetime import datetime
from threading import Lock
from typing import Any

from app.common.logger import get_logger

logger = get_logger(__name__)

# ---------------------------------------------------------------------------
# Token estimation helpers
# ---------------------------------------------------------------------------

# Rough average token-per-character ratio for Gemini
_TOKENS_PER_CHAR = 0.25

# Cost per 1M tokens — Gemini 2.0 Flash pricing (input / output blend)
_COST_PER_MILLION = 0.075  # USD


def estimate_tokens(text: str) -> int:
    """Estimate token count from raw text using char-count heuristic."""
    return max(1, int(len(text) * _TOKENS_PER_CHAR))


def estimate_cost(input_tokens: int, output_tokens: int = 0) -> float:
    """Estimate USD cost based on blended input+output token count."""
    total_tokens = input_tokens + output_tokens
    return round(total_tokens * _COST_PER_MILLION / 1_000_000, 6)


# ---------------------------------------------------------------------------
# In-memory store
# ---------------------------------------------------------------------------

class _AIUsageStore:
    _instance: "_AIUsageStore | None" = None
    _lock = Lock()
    _calls: list[dict[str, Any]] = []

    def __new__(cls) -> "_AIUsageStore":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def record(
        self,
        model: str,
        prompt_chars: int,
        response_chars: int,
        latency_ms: float,
        success: bool,
        error: str | None = None,
    ) -> None:
        input_tokens = estimate_tokens(prompt_chars * "x")  # use avg ratio
        output_tokens = estimate_tokens(response_chars * "x")
        cost = estimate_cost(input_tokens, output_tokens)

        with self._lock:
            self._calls.append({
                "timestamp": datetime.utcnow().isoformat(),
                "model": model,
                "input_tokens_estimated": input_tokens,
                "output_tokens_estimated": output_tokens,
                "total_tokens_estimated": input_tokens + output_tokens,
                "estimated_cost_usd": cost,
                "latency_ms": round(latency_ms, 1),
                "success": success,
                "error": error,
            })
            # Keep last 500 calls
            if len(self._calls) > 500:
                self._calls = self._calls[-500:]

    def get_summary(self) -> dict[str, Any]:
        from datetime import timedelta
        now = datetime.utcnow()
        hour_ago = now - timedelta(hours=1)
        day_ago = now - timedelta(days=1)

        with self._lock:
            recent = self._calls[-100:]  # last 100 calls

        hour_calls = [c for c in recent if datetime.fromisoformat(c["timestamp"]) >= hour_ago]
        day_calls = [c for c in recent if datetime.fromisoformat(c["timestamp"]) >= day_ago]

        hour_tokens = sum(c["total_tokens_estimated"] for c in hour_calls)
        day_tokens = sum(c["total_tokens_estimated"] for c in day_calls)
        total_tokens = sum(c["total_tokens_estimated"] for c in self._calls)
        total_cost = sum(c["estimated_cost_usd"] for c in self._calls)

        latencies = [c["latency_ms"] for c in day_calls if c["latency_ms"] > 0]
        avg_latency = round(sum(latencies) / len(latencies), 1) if latencies else 0

        errors = sum(1 for c in day_calls if not c["success"])
        error_rate = round(errors / max(len(day_calls), 1) * 100, 2)

        return {
            "total_calls": len(self._calls),
            "total_tokens_estimated": total_tokens,
            "total_cost_estimated_usd": round(total_cost, 6),
            "last_hour_tokens": hour_tokens,
            "last_24h_tokens": day_tokens,
            "last_hour_calls": len(hour_calls),
            "last_24h_calls": len(day_calls),
            "avg_latency_ms": avg_latency,
            "error_rate_pct": error_rate,
            "success_rate_pct": round(max(0, 100 - error_rate), 2),
        }


_store = _AIUsageStore()


def record_ai_call(
    model: str,
    prompt: str,
    response: str,
    latency_ms: float,
    success: bool = True,
    error: str | None = None,
) -> None:
    """Record a completed AI call. Safe to call even when AI is unconfigured."""
    _store.record(
        model=model,
        prompt_chars=len(prompt),
        response_chars=len(response),
        latency_ms=latency_ms,
        success=success,
        error=error,
    )


def get_ai_usage_summary() -> dict[str, Any]:
    """Return aggregated AI usage metrics."""
    return _store.get_summary()


def get_recent_calls(limit: int = 50) -> list[dict[str, Any]]:
    """Return the most recent AI calls (last `limit` entries)."""
    with _store._lock:
        return list(_store._calls[-limit:])


__all__ = [
    "record_ai_call",
    "get_ai_usage_summary",
    "get_recent_calls",
    "estimate_tokens",
    "estimate_cost",
]

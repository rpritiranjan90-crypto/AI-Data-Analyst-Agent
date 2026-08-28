"""
Simple in-memory TTL cache for expensive operations.

Use this for:
- Dataset profile (computed once per upload, cached by dataset_id)
- Chart recommendations (cached by dataset_id)
- AI summary (cached by dataset_id + column_hash)

For multi-pod production, swap the in-memory store for Redis with the same interface.
"""
from __future__ import annotations

import time
from threading import Lock
from typing import Any, Callable, Generic, TypeVar

logger = __import__("logging").getLogger(__name__)

T = TypeVar("T")


class TTLCache(Generic[T]):
    """Thread-safe time-to-live cache for a single value type."""

    def __init__(self, default_ttl_seconds: int = 300) -> None:
        self._default_ttl = default_ttl_seconds
        self._store: dict[str, tuple[T, float]] = {}
        self._lock = Lock()

    def get(self, key: str) -> T | None:
        """Return the cached value if present and unexpired, else None."""
        with self._lock:
            entry = self._store.get(key)
            if entry is None:
                return None
            value, expires_at = entry
            if expires_at < time.time():
                del self._store[key]
                return None
            return value

    def set(self, key: str, value: T, ttl_seconds: int | None = None) -> None:
        ttl = ttl_seconds if ttl_seconds is not None else self._default_ttl
        with self._lock:
            self._store[key] = (value, time.time() + ttl)

    def invalidate(self, key: str) -> None:
        with self._lock:
            self._store.pop(key, None)

    def clear(self) -> None:
        with self._lock:
            self._store.clear()

    def get_or_compute(
        self,
        key: str,
        compute_fn: Callable[[], T],
        ttl_seconds: int | None = None,
    ) -> T:
        """Return cached value or call compute_fn and cache the result."""
        cached = self.get(key)
        if cached is not None:
            return cached
        value = compute_fn()
        self.set(key, value, ttl_seconds)
        return value

    def stats(self) -> dict[str, int]:
        with self._lock:
            return {"size": len(self._store)}


# Module-level caches for common operations
dataset_profile_cache = TTLCache[dict](default_ttl_seconds=300)
chart_recommendation_cache = TTLCache[dict](default_ttl_seconds=600)
ai_summary_cache = TTLCache[str](default_ttl_seconds=900)


def invalidate_dataset_caches(dataset_id: str | None = None) -> None:
    """Clear all dataset-related caches. Pass dataset_id to clear just that one."""
    if dataset_id is None:
        dataset_profile_cache.clear()
        chart_recommendation_cache.clear()
        ai_summary_cache.clear()
        return
    for prefix in ("profile", "chart_rec", "ai_summary"):
        # Pattern-based invalidation: we just clear all on dataset change,
        # which is safer than tracking keys per dataset. Acceptable for in-memory store.
        pass
    dataset_profile_cache.clear()
    chart_recommendation_cache.clear()
    ai_summary_cache.clear()


__all__ = [
    "TTLCache",
    "dataset_profile_cache",
    "chart_recommendation_cache",
    "ai_summary_cache",
    "invalidate_dataset_caches",
]

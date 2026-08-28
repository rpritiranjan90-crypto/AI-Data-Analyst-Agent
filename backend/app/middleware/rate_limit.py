from __future__ import annotations

import logging
import time
from collections import deque
from typing import Deque, Dict, Tuple

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)


class IPRateLimitMiddleware(BaseHTTPMiddleware):
    """
    Lightweight per-IP sliding-window rate limiter.

    Goal: stop trivial abuse (upload-spam, scrapers, accidental runaways) without
    pulling in Redis. For multi-pod production, swap the in-memory store for Redis.

    Defaults (tunable via env vars):
        WINDOW_SECONDS=60      rolling window length
        MAX_REQUESTS=120       requests per window per IP
        UPLOAD_MAX_REQUESTS=10 uploads per window per IP (any path containing /upload)

    When triggered, responds with 429 + a `Retry-After` header.
    """

    def __init__(self, app, window_seconds: int = 60, max_requests: int = 120, upload_max: int = 10) -> None:
        super().__init__(app)
        self.window_seconds = window_seconds
        self.max_requests = max_requests
        self.upload_max = upload_max
        self._store: Dict[str, Deque[float]] = {}
        self._upload_store: Dict[str, Deque[float]] = {}

    def _trim(self, bucket: Deque[float], now: float) -> None:
        cutoff = now - self.window_seconds
        while bucket and bucket[0] < cutoff:
            bucket.popleft()

    def _client_ip(self, request: Request) -> str:
        # Honor X-Forwarded-For when behind a trusted proxy (nginx/traefik)
        fwd = request.headers.get("x-forwarded-for")
        if fwd:
            return fwd.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

    async def dispatch(self, request: Request, call_next) -> Response:
        # Skip non-API traffic (docs, redoc) and websocket upgrades.
        path = request.url.path
        if not path.startswith("/api") and not path.startswith("/upload"):
            return await call_next(request)

        # WebSocket handshakes
        if request.headers.get("upgrade", "").lower() == "websocket":
            return await call_next(request)

        ip = self._client_ip(request)
        now = time.time()

        # Global rate-limit
        bucket = self._store.setdefault(ip, deque())
        self._trim(bucket, now)
        if len(bucket) >= self.max_requests:
            retry_after = int(self.window_seconds - (now - bucket[0])) + 1
            logger.warning("Rate limit (global) exceeded for ip=%s path=%s", ip, path)
            return Response(
                content='{"success": false, "message": "Too many requests. Please slow down."}',
                status_code=429,
                headers={"Retry-After": str(retry_after), "Content-Type": "application/json"},
            )
        bucket.append(now)

        # Stricter limit on uploads
        if "/upload" in path:
            up_bucket = self._upload_store.setdefault(ip, deque())
            self._trim(up_bucket, now)
            if len(up_bucket) >= self.upload_max:
                retry_after = int(self.window_seconds - (now - up_bucket[0])) + 1
                logger.warning("Rate limit (upload) exceeded for ip=%s", ip)
                return Response(
                    content='{"success": false, "message": "Upload rate limit exceeded. Please wait before uploading more files."}',
                    status_code=429,
                    headers={"Retry-After": str(retry_after), "Content-Type": "application/json"},
                )
            up_bucket.append(now)

        return await call_next(request)

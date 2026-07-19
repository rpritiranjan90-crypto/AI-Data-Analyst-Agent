from __future__ import annotations

import time
import uuid

from fastapi import FastAPI
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from app.core.logging import get_logger

logger = get_logger(__name__)


class RequestContextMiddleware(BaseHTTPMiddleware):
    """
    Middleware that adds request metadata.

    Features
    --------
    - Request ID
    - Processing time
    - Request logging
    """

    async def dispatch(
        self,
        request: Request,
        call_next,
    ) -> Response:

        request_id = str(
            uuid.uuid4()
        )

        request.state.request_id = request_id

        start_time = time.perf_counter()

        logger.info(
            "Incoming request | id=%s | %s %s",
            request_id,
            request.method,
            request.url.path,
        )

        response = await call_next(
            request
        )

        process_time = (
            time.perf_counter()
            - start_time
        )

        response.headers[
            "X-Request-ID"
        ] = request_id

        response.headers[
            "X-Process-Time"
        ] = (
            f"{process_time:.6f}"
        )

        logger.info(
            (
                "Completed request "
                "| id=%s "
                "| status=%s "
                "| %.4fs"
            ),
            request_id,
            response.status_code,
            process_time,
        )

        return response
from __future__ import annotations

from fastapi import FastAPI
from starlette.middleware.gzip import GZipMiddleware
from starlette.middleware.trustedhost import (
    TrustedHostMiddleware,
)
from starlette.responses import Response

from app.core.config import settings


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware that adds common security headers.
    """

    async def dispatch(
        self,
        request: Request,
        call_next,
    ) -> Response:

        response = await call_next(request)

        response.headers["X-Content-Type-Options"] = "nosniff"

        response.headers["X-Frame-Options"] = "DENY"

        response.headers["Referrer-Policy"] = (
            "strict-origin-when-cross-origin"
        )

        response.headers["X-XSS-Protection"] = (
            "1; mode=block"
        )

        response.headers[
            "Permissions-Policy"
        ] = (
            "camera=(), microphone=(), geolocation=()"
        )

        return response


def register_middleware(
    app: FastAPI,
) -> None:
    """
    Register application middleware.
    """

    app.add_middleware(
        RequestContextMiddleware,
    )

    app.add_middleware(
        SecurityHeadersMiddleware,
    )

    app.add_middleware(
        GZipMiddleware,
        minimum_size=1024,
    )

    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*"],
    )
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


def register_all_middleware(
    app: FastAPI,
) -> None:
    """
    Register all application middleware.

    Middleware registration order matters.
    """

    logger.info(
        "Registering application middleware..."
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ALLOW_ORIGINS,
        allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
        allow_methods=settings.CORS_ALLOW_METHODS,
        allow_headers=settings.CORS_ALLOW_HEADERS,
    )

    register_middleware(app)

    logger.info(
        "Application middleware registered successfully."
    )


__all__ = [
    "RequestContextMiddleware",
    "SecurityHeadersMiddleware",
    "register_middleware",
    "register_all_middleware",
]
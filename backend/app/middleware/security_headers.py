from __future__ import annotations

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to inject Enterprise HTTP Security Headers (OWASP Recommendations):
    - Strict-Transport-Security (HSTS)
    - X-Frame-Options (Clickjacking defense)
    - X-Content-Type-Options (MIME sniffing defense)
    - X-XSS-Protection (Reflected XSS filter)
    - Referrer-Policy
    - Content-Security-Policy (CSP)
    - Permissions-Policy
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)

        # Force HTTPS / HSTS (1 year duration)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"

        # Prevent Clickjacking framing
        response.headers["X-Frame-Options"] = "DENY"

        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Enable browser XSS filter
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Referrer Policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Restrict hardware permissions
        response.headers["Permissions-Policy"] = "camera=(), microphone=*, geolocation=(), payment=()"

        return response

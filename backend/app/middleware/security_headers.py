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
    - Content-Security-Policy (CSP) — critical XSS defense
    - Permissions-Policy
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)

        # Content-Security-Policy: Restrict scripts to self + trusted CDN.
        # 'unsafe-inline' disabled — prevents inline script XSS attacks.
        # nonce-based or hash-based CSP recommended for inline React code in future.
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com; "  # Vite dev uses eval; tighten for production
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "  # Tailwind uses inline; fonts.googleapis.com for Outfit/Jakarta
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: blob:; "
            "connect-src 'self' http://localhost:5173 http://localhost:5174 http://localhost:5175 https://ai-data-analyst-agent-xs7p.onrender.com; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self';"
        )
        response.headers["Content-Security-Policy"] = csp

        # Force HTTPS / HSTS (1 year duration)
        # Only enforce in production; local dev should not set this to avoid HSTS preload issues
        import os
        if os.environ.get("APP_ENV", "").lower() != "development":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"

        # Prevent Clickjacking framing
        response.headers["X-Frame-Options"] = "DENY"

        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Enable browser XSS filter (deprecated in modern browsers but still useful for older ones)
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Referrer Policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Restrict hardware permissions
        response.headers["Permissions-Policy"] = "camera=(), microphone=*, geolocation=(), payment=()"

        return response

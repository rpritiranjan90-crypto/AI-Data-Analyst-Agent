"""
Sentry integration for structured error tracking.

Only loads if SENTRY_DSN environment variable is set.
This avoids importing sentry_sdk in environments where it isn't configured.
"""
from __future__ import annotations

import os
from typing import Any

SENTRY_LOADED = False

_sentry_dsn = os.getenv("SENTRY_DSN", "").strip()

if _sentry_dsn and len(_sentry_dsn) > 10:
    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration
    from sentry_sdk.integrations.logging import LoggingIntegration

    # Sample rate: capture 10% of non-error events; capture all errors
    sentry_sdk.init(
        dsn=_sentry_dsn,
        environment=os.getenv("APP_ENV", "development"),
        release=os.getenv("APP_VERSION", "unknown"),
        integrations=[
            FastApiIntegration(transaction_style="url"),
            LoggingIntegration(level=30, event_level=40),
        ],
        # Performance tracing — sample 20% of transactions
        traces_sample_rate=0.2,
        # Profile 5% of transactions (CPU-heavy, enable carefully in prod)
        profiles_sample_rate=0.05,
        # Attach stack traces for errors
        attach_stacktrace=True,
        # Don't send PII (tokens, passwords)
        send_default_pii=False,
        # Ignore common noise
        ignore_errors=[
            "KeyboardInterrupt",
            "SystemExit",
            "ValidationException",
            "ResourceNotFoundException",
            "NotFoundException",
        ],
    )
    SENTRY_LOADED = True


def capture_exception(exc: Exception, **extra: Any) -> None:
    """Capture an exception in Sentry if configured."""
    if not SENTRY_LOADED:
        return
    import sentry_sdk

    with sentry_sdk.configure_scope() as scope:
        for key, value in extra.items():
            scope.set_extra(key, value)
    sentry_sdk.capture_exception(exc)


def capture_message(message: str, level: str = "info", **extra: Any) -> None:
    """Capture a message in Sentry if configured."""
    if not SENTRY_LOADED:
        return
    import sentry_sdk

    with sentry_sdk.configure_scope() as scope:
        for key, value in extra.items():
            scope.set_extra(key, value)
    sentry_sdk.capture_message(message, level=level)


def add_user_context(user_id: str, email: str | None = None) -> None:
    """Tag Sentry events with the current user."""
    if not SENTRY_LOADED:
        return
    import sentry_sdk

    sentry_sdk.set_user({"id": user_id, "email": email or ""})

"""
app/services/billing_service.py
------------------------------
Stripe integration for checkout sessions, customer portal, and webhook handling.

Environment variables required:
    STRIPE_SECRET_KEY       — sk_test_... or sk_live_...
    STRIPE_WEBHOOK_SECRET  — whsec_... from Stripe Dashboard
    STRIPE_PRICE_PRO       — price_xxx for the Pro monthly price
    STRIPE_PRICE_ENTERPRISE — price_xxx for the Enterprise monthly price
    FRONTEND_URL           — e.g. https://ai-data-analyst-agent-five.vercel.app
"""
from __future__ import annotations

import logging
import os
import time
from typing import Any

import stripe
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# ─── Stripe client ────────────────────────────────────────────────────────────
_stripe: "stripe.Stripe | None" = None


def _get_stripe() -> "stripe.Stripe":
    global _stripe
    if _stripe is None:
        key = os.environ.get("STRIPE_SECRET_KEY", "")
        if not key:
            raise RuntimeError(
                "STRIPE_SECRET_KEY is not set. See docs/STRIPE_SETUP.md."
            )
        stripe.api_key = key
        _stripe = stripe  # type: ignore[assignment]
    return _stripe  # type: ignore[return-value]


# ─── Price IDs ────────────────────────────────────────────────────────────────
def _pro_price_id() -> str:
    return os.environ.get("STRIPE_PRICE_PRO", "") or "price_pro_placeholder"


def _enterprise_price_id() -> str:
    return os.environ.get("STRIPE_PRICE_ENTERPRISE", "") or "price_enterprise_placeholder"


def _frontend_url() -> str:
    return os.environ.get("FRONTEND_URL", "http://localhost:5173")


# ─── Checkout session ─────────────────────────────────────────────────────────
def create_checkout_session(
    workspace_id: str,
    workspace_name: str,
    customer_email: str,
    customer_id: str | None,
    price_id: str,
    success_url: str,
    cancel_url: str,
) -> str:
    """
    Create a Stripe Checkout session for upgrading a workspace.
    Returns the checkout URL.
    """
    stripe_obj = _get_stripe()

    kwargs: dict[str, Any] = {
        "mode": "subscription",
        "payment_method_types": ["card"],
        "line_items": [{"price": price_id, "quantity": 1}],
        "success_url": success_url,
        "cancel_url": cancel_url,
        "metadata": {
            "workspace_id": workspace_id,
            "workspace_name": workspace_name,
        },
        "subscription_data": {
            "metadata": {"workspace_id": workspace_id},
        },
    }

    if customer_id:
        kwargs["customer"] = customer_id
    else:
        kwargs["customer_email"] = customer_email

    session = stripe_obj.checkout.Session.create(**kwargs)
    logger.info("[billing] Checkout session created: %s for workspace %s", session.id, workspace_id)
    return session.url or ""


def create_checkout_for_plan(
    workspace_id: str,
    workspace_name: str,
    customer_email: str,
    customer_id: str | None,
    plan: str,  # "pro" | "enterprise"
    success_url: str,
    cancel_url: str,
) -> str:
    """Convenience wrapper — maps plan name to price ID."""
    price_map = {"pro": _pro_price_id(), "enterprise": _enterprise_price_id()}
    price_id = price_map.get(plan.lower())
    if not price_id:
        raise ValueError(f"Unknown plan: {plan}")
    return create_checkout_session(
        workspace_id, workspace_name, customer_email, customer_id,
        price_id, success_url, cancel_url,
    )


# ─── Customer portal ─────────────────────────────────────────────────────────
def create_portal_session(customer_id: str, return_url: str) -> str:
    """Open the Stripe Customer Portal for managing a subscription."""
    stripe_obj = _get_stripe()
    session = stripe_obj.billing_portal.Session.create(
        customer=customer_id,
        return_url=return_url,
    )
    logger.info("[billing] Portal session created: %s for customer %s", session.id, customer_id)
    return session.url


# ─── Webhook signature verification ───────────────────────────────────────────
def verify_webhook_signature(payload: bytes, sig_header: str) -> list[dict[str, Any]]:
    """
    Verify a Stripe webhook and return the deserialised event dict(s).
    Returns the `event.data.object` list for the event.
    """
    stripe_obj = _get_stripe()
    webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
    if not webhook_secret:
        raise RuntimeError("STRIPE_WEBHOOK_SECRET is not set")

    event = stripe_obj.Webhook.construct_event(payload, sig_header, webhook_secret)
    logger.info("[billing] Webhook received: type=%s id=%s", event["type"], event["id"])
    return event.get("data", {}).get("object", [])


# ─── Retrieve a session (for /billing/confirm) ───────────────────────────────
def get_checkout_session(session_id: str) -> dict[str, Any]:
    stripe_obj = _get_stripe()
    return stripe_obj.checkout.Session.retrieve(session_id, expand=["subscription", "customer"])


def get_subscription(subscription_id: str) -> dict[str, Any]:
    stripe_obj = _get_stripe()
    return stripe_obj.Subscription.retrieve(subscription_id)


# ─── Supabase helpers (import here to avoid circular imports) ─────────────────
def _get_db():
    from app.core.supabase import get_db as _get_db_impl
    return _get_db_impl()


def _update_workspace_plan(workspace_id: str, plan: str, stripe_customer_id: str | None = None) -> None:
    """
    Update the workspace plan in Supabase (or in-memory fallback).
    Called by the webhook handler.
    """
    plan_map = {
        "pro": "pro",
        "enterprise": "enterprise",
        "free": "free",
        "canceled": "free",
    }
    mapped_plan = plan_map.get(plan.lower(), "free")

    try:
        db = _get_db()
        update: dict[str, Any] = {"plan": mapped_plan, "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ")}
        if stripe_customer_id:
            update["stripe_customer_id"] = stripe_customer_id
        db.table("workspaces").update(update).eq("id", workspace_id).execute()
        logger.info("[billing] Workspace %s plan updated to %s", workspace_id, mapped_plan)
    except Exception:
        # In-memory fallback
        from app.services import auth_service as auth
        for ws in [auth.WORKSPACES_DB.get(workspace_id)]:
            if ws:
                ws["plan"] = mapped_plan
                if stripe_customer_id:
                    ws["stripe_customer_id"] = stripe_customer_id
                logger.info("[billing] (in-memory) Workspace %s plan updated to %s", workspace_id, mapped_plan)

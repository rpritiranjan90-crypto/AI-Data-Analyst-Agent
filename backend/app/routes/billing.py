"""
app/routes/billing.py
---------------------
Stripe billing endpoints:
  POST /billing/checkout        — create a Stripe Checkout session
  POST /billing/portal          — open Stripe Customer Portal
  POST /billing/confirm         — verify a completed checkout session
  POST /webhooks/stripe         — Stripe webhook receiver

These are workspace-aware: the caller must be authenticated so we know
which workspace to upgrade.
"""
from __future__ import annotations

import logging
import os
from typing import Any

from fastapi import APIRouter, HTTPException, Request, Response, status
from pydantic import BaseModel, field_validator

from app.core.auth_deps import CurrentUserDep, WorkspaceIDDep
from app.services import billing_service as billing
from app.services import auth_service as auth

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/billing", tags=["Billing"])

# ─── Request schemas ──────────────────────────────────────────────────────────


class CheckoutRequest(BaseModel):
    plan: str

    @field_validator("plan")
    @classmethod
    def validate_plan(cls, v: str) -> str:
        if v.lower() not in ("pro", "enterprise"):
            raise ValueError("Plan must be 'pro' or 'enterprise'")
        return v.lower()


class PortalRequest(BaseModel):
    return_url: str | None = None


# ─── Helpers ───────────────────────────────────────────────────────────────────


def _frontend_url() -> str:
    return os.environ.get("FRONTEND_URL", "http://localhost:5173")


def _get_workspace_info(workspace_id: str) -> tuple[str, str, str | None]:
    """
    Returns (workspace_name, owner_email, stripe_customer_id).
    """
    ws = auth.get_workspace(workspace_id)
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")

    # Get the owner's email from the user record
    owner_id = ws.get("owner_user_id")
    owner_email = ""
    if owner_id:
        user = auth.get_user_by_id(owner_id)
        if user:
            owner_email = user.get("email", "")

    return ws.get("name", "Workspace"), owner_email, ws.get("stripe_customer_id")


# ─── Endpoints ────────────────────────────────────────────────────────────────


@router.post("/checkout", summary="Start Stripe Checkout")
def start_checkout(
    body: CheckoutRequest,
    user: CurrentUserDep,
    workspace_id: WorkspaceIDDep,
) -> dict[str, Any]:
    """
    Create a Stripe Checkout session to upgrade the active workspace to a paid plan.
    """
    ws_name, owner_email, stripe_customer_id = _get_workspace_info(workspace_id)

    success_url = f"{_frontend_url()}/billing/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{_frontend_url()}/billing/cancel"

    checkout_url = billing.create_checkout_for_plan(
        workspace_id=workspace_id,
        workspace_name=ws_name,
        customer_email=owner_email,
        customer_id=stripe_customer_id,
        plan=body.plan,
        success_url=success_url,
        cancel_url=cancel_url,
    )

    if not checkout_url:
        raise HTTPException(status_code=500, detail="Failed to create checkout session")

    logger.info("[billing] Checkout started: workspace=%s plan=%s user=%s", workspace_id, body.plan, user.id)
    return {"success": True, "checkout_url": checkout_url}


@router.post("/portal", summary="Open Stripe Customer Portal")
def open_portal(
    body: PortalRequest,
    user: CurrentUserDep,
    workspace_id: WorkspaceIDDep,
) -> dict[str, Any]:
    """
    Open the Stripe Customer Portal for managing/cancelling the subscription.
    """
    _, _, stripe_customer_id = _get_workspace_info(workspace_id)

    if not stripe_customer_id:
        raise HTTPException(
            status_code=400,
            detail="No billing account found for this workspace. Please upgrade first.",
        )

    return_url = body.return_url or f"{_frontend_url()}/settings/workspace"
    portal_url = billing.create_portal_session(stripe_customer_id, return_url)

    if not portal_url:
        raise HTTPException(status_code=500, detail="Failed to open billing portal")

    return {"success": True, "portal_url": portal_url}


@router.post("/confirm", summary="Confirm Checkout Session")
def confirm_checkout(
    session_id: str,
    user: CurrentUserDep,
    workspace_id: WorkspaceIDDep,
) -> dict[str, Any]:
    """
    After Stripe redirects to /billing/success, the frontend calls this to verify
    the session was actually paid and refresh the workspace plan.
    """
    try:
        session = billing.get_checkout_session(session_id)
    except Exception as exc:
        logger.error("[billing] Failed to retrieve checkout session %s: %s", session_id, exc)
        raise HTTPException(status_code=400, detail="Invalid checkout session ID")

    if session.get("payment_status") != "paid" and session.get("status") != "complete":
        raise HTTPException(status_code=400, detail="Checkout session not completed")

    # Extract workspace_id from metadata
    ws_id_from_session = session.get("metadata", {}).get("workspace_id", "")
    if ws_id_from_session and ws_id_from_session != workspace_id:
        logger.warning(
            "[billing] Workspace mismatch: session=%s caller=%s",
            ws_id_from_session, workspace_id,
        )

    # Update the plan
    subscription = session.get("subscription")
    subscription_id = subscription.get("id") if isinstance(subscription, dict) else subscription
    customer_id = session.get("customer")
    plan = session.get("subscription", {}).get("metadata", {}).get("plan", "pro") if isinstance(subscription, dict) else "pro"

    billing._update_workspace_plan(workspace_id, plan, customer_id)

    return {
        "success": True,
        "plan": plan,
        "customer_id": customer_id,
    }


# ─── Stripe Webhook ──────────────────────────────────────────────────────────
# NOTE: This route must NOT use the auth dependency — Stripe calls it directly
# with its own signature. The raw body is required for signature verification.


@router.post("/webhooks/stripe", summary="Stripe Webhook Receiver", include_in_schema=False)
async def stripe_webhook(request: Request) -> dict[str, Any]:
    """
    Receive and process Stripe webhook events.
    Signature is verified; invalid signatures return 400.
    """
    body = await request.body()
    sig = request.headers.get("stripe-signature", "")

    try:
        event_data = billing.verify_webhook_signature(body, sig)
    except Exception as exc:
        logger.warning("[billing] Webhook signature verification failed: %s", exc)
        raise HTTPException(status_code=400, detail=str(exc))

    event_type = (request._json.get("type") if hasattr(request, "_json") else None) or ""
    # Re-read the event type from the raw payload
    import json
    try:
        raw_event = json.loads(body)
        event_type = raw_event.get("type", "")
    except Exception:
        pass

    workspace_id: str | None = None
    new_plan = "free"
    stripe_customer_id: str | None = None

    try:
        raw_event = json.loads(body)
        metadata = raw_event.get("data", {}).get("object", {}).get("metadata", {})
        workspace_id = metadata.get("workspace_id")

        if event_type == "checkout.session.completed":
            session_data = raw_event["data"]["object"]
            stripe_customer_id = session_data.get("customer")
            sub_data = session_data.get("subscription_data", {})
            plan_from_items = session_data.get("metadata", {}).get("plan", "pro")
            new_plan = plan_from_items
            # Try to get from subscription if available
            if not workspace_id:
                workspace_id = session_data.get("metadata", {}).get("workspace_id")
            logger.info(
                "[billing][webhook] checkout.session.completed: ws=%s plan=%s",
                workspace_id, new_plan,
            )

        elif event_type == "customer.subscription.updated":
            sub_data = raw_event["data"]["object"]
            new_plan = sub_data.get("items", {}).get("data", [{}])[0].get("price", {}).get("nickname", "pro").lower()
            stripe_customer_id = sub_data.get("customer")
            if not workspace_id:
                workspace_id = sub_data.get("metadata", {}).get("workspace_id")
            logger.info(
                "[billing][webhook] subscription.updated: ws=%s plan=%s",
                workspace_id, new_plan,
            )

        elif event_type == "customer.subscription.deleted":
            new_plan = "free"
            sub_data = raw_event["data"]["object"]
            stripe_customer_id = sub_data.get("customer")
            if not workspace_id:
                workspace_id = sub_data.get("metadata", {}).get("workspace_id")
            logger.info("[billing][webhook] subscription.deleted: ws=%s", workspace_id)

    except Exception as exc:
        logger.error("[billing][webhook] Error parsing event: %s", exc)

    # Apply the plan update if we found a workspace
    if workspace_id:
        billing._update_workspace_plan(workspace_id, new_plan, stripe_customer_id)

    return {"received": True}

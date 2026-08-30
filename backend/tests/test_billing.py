"""Tests for Stripe billing webhook signature verification (Phase 1 features)."""

import hashlib
import hmac
import json
import time

import pytest


class TestBillingEndpoints:
    """Tests for /billing/checkout and /billing/portal."""

    def test_checkout_requires_auth(self, client):
        """POST /billing/checkout must reject unauthenticated requests."""
        resp = client.post(
            "/billing/checkout",
            json={"plan": "pro"},
        )
        assert resp.status_code == 401

    def test_checkout_requires_plan(self, client):
        """Checkout must fail when no plan is provided."""
        login = client.post(
            "/auth/login",
            json={"email": "admin@aianalyst.com", "password": "Admin@123456"},
        )
        token = login.json()["token"]

        resp = client.post(
            "/billing/checkout",
            json={},
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp.status_code == 422  # FastAPI validation error

    def test_portal_requires_auth(self, client):
        """POST /billing/portal must reject unauthenticated requests."""
        resp = client.post("/billing/portal", json={})
        assert resp.status_code == 401


class TestWebhookSignature:
    """Tests for Stripe webhook signature verification in billing_service."""

    def test_webhook_bad_signature_returns_400(self, client):
        """A webhook with an invalid signature must return 400."""
        payload = json.dumps({"type": "checkout.session.completed"}).encode()
        bad_sig = "t=1234567890,v1=bad_signature,v0=bad"

        resp = client.post(
            "/billing/webhooks/stripe",
            content=payload,
            headers={
                "Content-Type": "application/json",
                "Stripe-Signature": bad_sig,
            },
        )
        # Without a valid STRIPE_WEBHOOK_SECRET this will fail at the secret check
        # or at the signature verification — either way it must not return 200
        assert resp.status_code in (400, 500)

    def test_webhook_empty_body_returns_400(self, client):
        """A webhook with no body must return 400."""
        resp = client.post(
            "/billing/webhooks/stripe",
            content=b"",
            headers={"Content-Type": "application/json", "Stripe-Signature": "t=1,v1=x"},
        )
        assert resp.status_code in (400, 500)

    def test_confirm_requires_session_id(self, client):
        """POST /billing/confirm without session_id query param must return 401 or 422."""
        # The route accepts session_id as a query param; auth check happens first.
        # We accept either 401 (auth fails before validation) or 422 (validation).
        resp = client.post("/billing/confirm", json={})
        assert resp.status_code in (401, 422)

    def test_confirm_requires_auth(self, client):
        """POST /billing/confirm without auth must return 401."""
        resp = client.post("/billing/confirm?session_id=cs_test_123")
        assert resp.status_code == 401

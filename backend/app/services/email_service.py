"""
app/services/email_service.py
----------------------------
Transactional email via Resend.
Three email types:
  1. Password reset
  2. Team workspace invite
  3. Payment receipt

Email template is rendered with Jinja2 and sent via the Resend API.

Environment variables required:
    RESEND_API_KEY      — re_your_key_here
    RESEND_FROM_EMAIL   — e.g. "AI Data Analyst <noreply@yourdomain.com>"
    FRONTEND_URL        — e.g. https://ai-data-analyst-agent-five.vercel.app
"""
from __future__ import annotations

import logging
import os
import time
from typing import Any

from dotenv import load_dotenv
from jinja2 import Template

load_dotenv()

logger = logging.getLogger(__name__)

# ─── Resend client (raw HTTP via requests) ───────────────────────────────────
_RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "").strip()
_RESEND_FROM = os.environ.get("RESEND_FROM_EMAIL", "AI Data Analyst <noreply@resend.dev>")
_FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")

_EMAIL_ENABLED = bool(_RESEND_API_KEY and not _RESEND_API_KEY.startswith("re_your"))


def _send_email(
    to: str,
    subject: str,
    html: str,
    email_type: str,
    user_id: str | None = None,
) -> dict[str, Any]:
    """
    Send an email via the Resend API.
    Returns the Resend API response dict.
    In-memory fallback logs to console if RESEND_API_KEY is not configured.
    """
    if not _EMAIL_ENABLED:
        logger.info(
            "[email] (dev) Would send email to %s — subject: %s\n"
            "  Set RESEND_API_KEY in .env to enable real email delivery.",
            to, subject,
        )
        return {"id": "dev_email", "from": _RESEND_FROM, "to": to, "status": "dev"}

    try:
        import httpx
        resp = httpx.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {_RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "from": _RESEND_FROM,
                "to": [to],
                "subject": subject,
                "html": html,
            },
            timeout=15,
        )
        result = resp.json()
        logger.info("[email] Sent %s email to %s — resend_id=%s", email_type, to, result.get("id"))
        return result
    except Exception as exc:
        logger.error("[email] Failed to send %s email to %s: %s", email_type, to, exc)
        return {"error": str(exc), "id": None, "status": "error"}


def _render(template_str: str, **kwargs: Any) -> str:
    return Template(template_str).render(**kwargs)


# ─── HTML templates ───────────────────────────────────────────────────────────
_PASSWORD_RESET_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 32px; }
    .card { background: white; border-radius: 12px; padding: 32px; max-width: 480px; margin: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .btn { display: inline-block; background: #4f46e5; color: white !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; }
    .footer { margin-top: 24px; font-size: 12px; color: #64748b; }
    .warning { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px; margin-top: 16px; font-size: 13px; color: #9a3412; }
  </style>
</head>
<body>
  <div class="card">
    <h2 style="margin-top:0; color:#1e293b;">Reset your password</h2>
    <p style="color:#475569; line-height:1.6;">
      We received a request to reset the password for <strong>{{ email }}</strong>.
      Click the button below to set a new password. This link expires in 15 minutes.
    </p>
    <p style="text-align:center; margin: 24px 0;">
      <a href="{{ reset_link }}" class="btn">Reset Password</a>
    </p>
    <p style="font-size:13px; color:#64748b;">
      If you didn't request this, you can safely ignore this email — your password won't change.
    </p>
    <div class="warning">
      ⚠️ <strong>Developer mode:</strong> Copy this token manually if the button doesn't work:<br>
      <code style="word-break:break-all; font-size:12px;">{{ token }}</code>
    </div>
    <div class="footer">
      — AI Data Analyst Agent · Your data, amplified by AI<br>
      This email was sent to {{ email }}.
    </div>
  </div>
</body>
</html>
"""


_TEAM_INVITE_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 32px; }
    .card { background: white; border-radius: 12px; padding: 32px; max-width: 480px; margin: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .btn { display: inline-block; background: #4f46e5; color: white !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; }
    .footer { margin-top: 24px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <h2 style="margin-top:0; color:#1e293b;">You've been invited to a workspace</h2>
    <p style="color:#475569; line-height:1.6;">
      <strong>{{ inviter_name }}</strong> has invited you to join the
      <strong>{{ workspace_name }}</strong> workspace on AI Data Analyst Agent.
    </p>
    <p style="text-align:center; margin: 24px 0;">
      <a href="{{ invite_link }}" class="btn">Join Workspace</a>
    </p>
    <p style="font-size:13px; color:#64748b;">
      This invite link expires in 7 days.
    </p>
    <div class="footer">
      — AI Data Analyst Agent<br>
      You're receiving this because someone invited you.
    </div>
  </div>
</body>
</html>
"""


_PAYMENT_RECEIPT_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 32px; }
    .card { background: white; border-radius: 12px; padding: 32px; max-width: 480px; margin: auto; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .footer { margin-top: 24px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <h2 style="margin-top:0; color:#1e293b;">Receipt — {{ plan_name }}</h2>
    <p style="color:#475569; line-height:1.6;">
      Thank you for upgrading to <strong>{{ plan_name }}</strong>, {{ customer_email }}!
    </p>
    <table style="width:100%; border-collapse:collapse; margin: 16px 0;">
      <tr><td style="padding:8px; color:#64748b;">Amount</td><td style="padding:8px; font-weight:bold;">{{ amount }}</td></tr>
      <tr><td style="padding:8px; color:#64748b;">Receipt ID</td><td style="padding:8px;">{{ receipt_id }}</td></tr>
      <tr><td style="padding:8px; color:#64748b;">Date</td><td style="padding:8px;">{{ date }}</td></tr>
    </table>
    <p style="font-size:13px; color:#64748b;">
      Questions? Reply to this email or visit your billing portal.
    </p>
    <div class="footer">
      — AI Data Analyst Agent
    </div>
  </div>
</body>
</html>
"""


# ─── Public API ───────────────────────────────────────────────────────────────
def send_password_reset(
    email: str,
    token: str,
    user_id: str | None = None,
) -> dict[str, Any]:
    """
    Send a password reset email to the user.
    In dev mode (APP_ENV != production) the link is constructed with a mock token.
    """
    reset_link = (
        f"{_FRONTEND_URL}/forgot-password/confirm?token={token}"
        if os.environ.get("APP_ENV", "development").lower() != "production"
        else f"{_FRONTEND_URL}/forgot-password/confirm?token={token}"
    )

    html = _render(
        _PASSWORD_RESET_TEMPLATE,
        email=email,
        reset_link=reset_link,
        token=token,
    )

    result = _send_email(
        to=email,
        subject="Reset your AI Data Analyst Agent password",
        html=html,
        email_type="reset_password",
        user_id=user_id,
    )

    _log_email_event(user_id, email, "reset_password", result)
    return result


def send_team_invite(
    invitee_email: str,
    workspace_name: str,
    inviter_name: str,
    invite_token: str,
    invitee_id: str | None = None,
) -> dict[str, Any]:
    invite_link = f"{_FRONTEND_URL}/invite/{invite_token}"
    html = _render(
        _TEAM_INVITE_TEMPLATE,
        inviter_name=inviter_name,
        workspace_name=workspace_name,
        invite_link=invite_link,
    )
    result = _send_email(
        to=invitee_email,
        subject=f"You've been invited to {workspace_name}",
        html=html,
        email_type="team_invite",
        user_id=invitee_id,
    )
    _log_email_event(invitee_id, invitee_email, "team_invite", result)
    return result


def send_payment_receipt(
    email: str,
    plan_name: str,
    amount: str,
    receipt_id: str,
    date: str,
    user_id: str | None = None,
) -> dict[str, Any]:
    html = _render(
        _PAYMENT_RECEIPT_TEMPLATE,
        customer_email=email,
        plan_name=plan_name,
        amount=amount,
        receipt_id=receipt_id,
        date=date,
    )
    result = _send_email(
        to=email,
        subject=f"Your AI Data Analyst Agent receipt — {plan_name}",
        html=html,
        email_type="payment_receipt",
        user_id=user_id,
    )
    _log_email_event(user_id, email, "payment_receipt", result)
    return result


def _log_email_event(
    user_id: str | None,
    email: str,
    email_type: str,
    result: dict[str, Any],
) -> None:
    """Write an email_events row to Supabase (or log in-memory)."""
    try:
        db = _get_db()
        db.table("email_events").insert({
            "user_id": user_id,
            "email": email,
            "type": email_type,
            "resend_id": result.get("id"),
            "status": result.get("status", "sent"),
            "error": result.get("error"),
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        }).execute()
    except Exception:
        # In-memory fallback — just log
        from app.services import auth_service as auth
        logger.info(
            "[email_event] type=%s email=%s resend_id=%s",
            email_type, email, result.get("id"),
        )
        del auth  # just for the import side-effect / import order


def _get_db():
    from app.core.supabase import get_db as _impl
    return _impl()

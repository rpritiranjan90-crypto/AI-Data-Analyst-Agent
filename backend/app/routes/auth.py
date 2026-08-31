"""
app/routes/auth.py
-----------------
Authentication & workspace management endpoints.

Key design decisions:
- JWT contains workspace_id + plan — FastAPI dependency extracts it so every
  downstream route is automatically workspace-scoped.
- /auth/switch-workspace re-issues a JWT with a different workspace_id claim.
- In Supabase mode: all reads/writes go to Postgres.
  In dev mode (no SUPABASE_URL): in-memory fallback with identical interface.

Cookie strategy (C1):
- On login/register: short-lived `ada_access` cookie (15 min) + long-lived
  `ada_refresh` httpOnly cookie (7 days, path-scoped to /auth/refresh).
- On /auth/refresh: rotate the refresh token, return a new access token in body.
- On /auth/logout: revoke all refresh tokens for the user, clear both cookies.
"""
from __future__ import annotations

import os
import secrets
import time
from typing import Any

from fastapi import APIRouter, HTTPException, Header, Request, Response, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator

from app.services import auth_service as auth

router = APIRouter(prefix="/auth", tags=["Authentication & Workspace"])

# Cookie config
ACCESS_COOKIE_NAME = "ada_access"
REFRESH_COOKIE_NAME = "ada_refresh"
REFRESH_COOKIE_PATH = "/auth/refresh"


def _is_production() -> bool:
    return os.environ.get("APP_ENV", "development").lower() in ("production", "prod", "staging")


def _cookie_secure() -> bool:
    """In dev, cookies can be sent over http; in prod, must be https."""
    return _is_production()


def _set_access_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=ACCESS_COOKIE_NAME,
        value=token,
        max_age=auth.ACCESS_TOKEN_TTL_SECONDS,
        httponly=False,        # readable by JS so axios can build the Authorization header
        secure=_cookie_secure(),
        samesite="strict",
        path="/",
    )


def _set_refresh_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=token,
        max_age=auth.REFRESH_TOKEN_TTL_SECONDS,
        httponly=True,         # invisible to JS — XSS cannot exfiltrate
        secure=_cookie_secure(),
        samesite="strict",
        path=REFRESH_COOKIE_PATH,
    )


def _clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(ACCESS_COOKIE_NAME, path="/")
    response.delete_cookie(REFRESH_COOKIE_NAME, path=REFRESH_COOKIE_PATH)

# ─── Request schemas ─────────────────────────────────────────────────────────


class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    workspace_name: str | None = None  # optional custom first workspace name

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = auth.sanitize_input(v).lower()
        if not auth.validate_email_format(v):
            raise ValueError("Invalid email format")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8 or len(v) > 128:
            raise ValueError("Password must be between 8 and 128 characters")
        return v

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = auth.sanitize_input(v)
        if not v or len(v) > 50:
            raise ValueError("Invalid name")
        return v


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def sanitize_email(cls, v: str) -> str:
        return auth.sanitize_input(v).lower()


class ResetPasswordRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def sanitize_email(cls, v: str) -> str:
        return auth.sanitize_input(v).lower()


class ConfirmResetRequest(BaseModel):
    token: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        if len(v) < 8 or len(v) > 128:
            raise ValueError("Password must be between 8 and 128 characters")
        return v


class SwitchWorkspaceRequest(BaseModel):
    workspace_id: str


class CreateWorkspaceRequest(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = auth.sanitize_input(v)
        if not v or len(v) > 100:
            raise ValueError("Invalid workspace name")
        return v


# ─── In-memory reset token store ─────────────────────────────────────────────
RESET_TOKENS: dict[str, dict[str, Any]] = {}
RESET_TOKEN_TTL_SECONDS = 900


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _user_to_dict(user: dict[str, Any], workspaces: list[dict[str, Any]], active_ws_id: str | None = None) -> dict[str, Any]:
    """Serialise user for client response (never expose password_hash)."""
    active_ws = next((w for w in workspaces if w["id"] == active_ws_id), workspaces[0] if workspaces else {})
    return {
        "id": user["id"],
        "email": user.get("email", ""),
        "name": user.get("full_name", ""),
        "avatar_url": user.get("avatar_url"),
        "current_plan": active_ws.get("plan", "free"),
        "current_workspace_id": active_ws.get("id", ""),
    }


# ─── Endpoints ───────────────────────────────────────────────────────────────


@router.post("/register", summary="User Registration", status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest) -> Response:
    """Create account + first workspace. Issues a workspace-scoped JWT.
    Sets ada_access + ada_refresh cookies and returns the access token in the body
    for backwards compat with the localStorage-era frontend."""
    if auth.user_email_exists(req.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to complete registration with the provided details.",
        )

    user, workspaces = auth.create_user(
        email=req.email,
        password=req.password,
        full_name=req.name,
        workspace_name=req.workspace_name,
    )
    active_ws = workspaces[0] if workspaces else {}

    access_token = auth.create_access_token(
        user_id=user["id"],
        email=user["email"],
        workspaces=workspaces,
        active_workspace_id=active_ws.get("id"),
    )
    refresh_token, _ = auth.create_refresh_token(user["id"])

    response = JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={
            "success": True,
            "message": "Account created successfully.",
            "token": access_token,  # kept in body for migration window
        "user": _user_to_dict(user, workspaces, active_ws.get("id")),
        "workspaces": [
            {
                "id": w["id"],
                "name": w["name"],
                "plan": w.get("plan", "free"),
                "role": w.get("role", "member"),
            }
            for w in workspaces
        ],
    })
    _set_access_cookie(response, access_token)
    _set_refresh_cookie(response, refresh_token)
    return response


@router.post("/login", summary="User Login")
def login(req: LoginRequest, request: Request) -> Response:
    client_ip = request.client.host if request.client else "unknown_ip"
    identifier = f"{client_ip}:{req.email}"

    allowed, error_msg, delay = auth.check_rate_limit_and_lockout(identifier)
    if not allowed:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=error_msg)
    if delay > 0:
        time.sleep(delay)

    result = auth.authenticate_user(req.email, req.password)
    if not result:
        auth.record_failed_attempt(identifier)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    auth.record_successful_attempt(identifier)
    user, workspaces = result

    # Use workspace_id from JWT payload if present (allows staying in the same workspace)
    active_ws = workspaces[0] if workspaces else {}
    access_token = auth.create_access_token(
        user["id"], user["email"], workspaces,
        active_workspace_id=active_ws.get("id"),
    )
    refresh_token, _ = auth.create_refresh_token(user["id"])

    response = JSONResponse({
        "success": True,
        "message": "Authentication successful",
        "token": access_token,  # kept in body for migration window
        "user": _user_to_dict(user, workspaces, active_ws.get("id")),
        "workspaces": [
            {
                "id": w["id"],
                "name": w["name"],
                "plan": w.get("plan", "free"),
                "role": w.get("role", "member"),
            }
            for w in workspaces
        ],
    })
    _set_access_cookie(response, access_token)
    _set_refresh_cookie(response, refresh_token)
    return response


@router.post("/refresh", summary="Refresh access token (cookie-based)")
def refresh(request: Request) -> Response:
    """
    Reads the ada_refresh httpOnly cookie, verifies it, rotates it,
    and returns a new access token in the body.

    This endpoint is path-scoped via the cookie's path=/auth/refresh, so it is
    not sent on normal API calls — only when the browser navigates here.
    """
    raw = request.cookies.get(REFRESH_COOKIE_NAME)
    if not raw:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token")

    payload = auth.decode_refresh_token(raw)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    user_id: str = payload["sub"]
    jti: str = payload["jti"]

    # Reuse detection: if the jti is no longer active, this token has been used
    # already — revoke everything and force re-login.
    from app.services.auth_service import _USING_SUPABASE
    if _USING_SUPABASE:
        is_active = auth._supabase_is_jti_active(user_id, jti)
    else:
        is_active = jti in auth._REFRESH_TOKENS_DB.get(user_id, set())

    if not is_active:
        # Token was already used — possible theft. Wipe all tokens for this user.
        auth.revoke_all_refresh_tokens(user_id)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token reuse detected. Please sign in again.",
        )

    user = auth.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    workspaces = auth.get_user_workspaces(user_id)
    active_ws = workspaces[0] if workspaces else {}

    new_access = auth.create_access_token(
        user_id=user["id"],
        email=user["email"],
        workspaces=workspaces,
        active_workspace_id=active_ws.get("id"),
    )

    # Rotate: invalidate old jti, mint a fresh refresh token.
    new_refresh, _ = auth.rotate_refresh_token(user_id)

    response = JSONResponse({
        "success": True,
        "token": new_access,
        "user": _user_to_dict(user, workspaces, active_ws.get("id")),
        "workspaces": [
            {
                "id": w["id"],
                "name": w["name"],
                "plan": w.get("plan", "free"),
                "role": w.get("role", "member"),
            }
            for w in workspaces
        ],
    })
    _set_access_cookie(response, new_access)
    _set_refresh_cookie(response, new_refresh)
    return response


@router.post("/logout", summary="Logout and revoke all refresh tokens")
def logout(request: Request) -> Response:
    """
    Revokes all refresh tokens for the current user and clears both cookies.
    The access cookie is cleared client-side by the authStore on the next render.
    """
    raw = request.cookies.get(REFRESH_COOKIE_NAME)
    if raw:
        payload = auth.decode_refresh_token(raw)
        if payload:
            auth.revoke_all_refresh_tokens(payload["sub"])

    response = JSONResponse({"success": True, "message": "Signed out."})
    _clear_auth_cookies(response)
    return response


@router.post("/reset-password", summary="Password Reset Request")
def reset_password(req: ResetPasswordRequest) -> dict[str, Any]:
    """
    If the email exists, generate a reset token.
    In production (APP_ENV=production): sends email via Resend.
    In development: returns dev_reset_token for manual testing.
    """
    response: dict[str, Any] = {
        "success": True,
        "message": "If that email is registered, you'll receive a password reset link.",
    }

    if auth.user_email_exists(req.email):
        token = secrets.token_urlsafe(32)
        RESET_TOKENS[token] = {
            "email": req.email,
            "expires_at": time.time() + RESET_TOKEN_TTL_SECONDS,
        }
        # In dev, surface the token so the flow works without an email server.
        if os.environ.get("APP_ENV", "development").lower() != "production":
            response["dev_reset_token"] = token

        # Send the actual email via Resend (in dev, just logs)
        try:
            user = auth._get_user_by_email(req.email)
            from app.services import email_service as email_svc

            email_svc.send_password_reset(
                email=req.email,
                token=token,
                user_id=user.get("id") if user else None,
            )
        except Exception as exc:
            # Log but don't fail — token is still valid for manual completion
            import logging
            logging.getLogger(__name__).warning(
                "[auth] Failed to send password reset email: %s", exc
            )

    return response


@router.post("/reset-password/confirm", summary="Confirm Password Reset")
def confirm_reset_password(req: ConfirmResetRequest) -> dict[str, Any]:
    entry = RESET_TOKENS.get(req.token)
    if not entry or entry["expires_at"] < time.time():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset link is invalid or has expired. Please request a new one.",
        )

    email = entry["email"]
    user = auth._get_user_by_email(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset link is invalid or has expired. Please request a new one.",
        )

    new_hash = auth.hash_password(req.new_password)
    auth.update_user_password(user["id"], new_hash)
    del RESET_TOKENS[req.token]

    return {
        "success": True,
        "message": "Password updated successfully. You can now sign in with your new password.",
    }


@router.get("/me", summary="Get Active User + Workspaces")
def me(authorization: str | None = Header(None)) -> dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid Bearer token")

    token = authorization.split(" ", 1)[1]
    payload = auth.decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired or invalid")

    user_id = payload.get("sub")
    user = auth.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User profile not found")

    workspaces = auth.get_user_workspaces(user_id)
    active_ws_id = payload.get("workspace_id")

    return {
        "success": True,
        "user": _user_to_dict(user, workspaces, active_ws_id),
        "workspaces": [
            {
                "id": w["id"],
                "name": w["name"],
                "plan": w.get("plan", "free"),
                "role": w.get("role", "member"),
            }
            for w in workspaces
        ],
    }


@router.post("/switch-workspace", summary="Switch Active Workspace")
def switch_workspace(
    req: SwitchWorkspaceRequest,
    authorization: str | None = Header(None),
) -> dict[str, Any]:
    """Re-issue JWT with a different workspace_id claim."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid Bearer token")

    token = authorization.split(" ", 1)[1]
    payload = auth.decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired or invalid")

    user_id = payload["sub"]
    workspaces = auth.get_user_workspaces(user_id)

    if not any(w["id"] == req.workspace_id for w in workspaces):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a member of that workspace.",
        )

    new_token = auth.create_workspace_switch_token(
        user_id, payload["email"], workspaces, req.workspace_id
    )
    user = auth.get_user_by_id(user_id)
    active_ws = next((w for w in workspaces if w["id"] == req.workspace_id), workspaces[0] if workspaces else {})

    return {
        "success": True,
        "token": new_token,
        "user": _user_to_dict(user, workspaces, req.workspace_id),
        "workspaces": [
            {
                "id": w["id"],
                "name": w["name"],
                "plan": w.get("plan", "free"),
                "role": w.get("role", "member"),
            }
            for w in workspaces
        ],
    }


@router.get("/workspaces", summary="List User's Workspaces")
def list_workspaces(authorization: str | None = Header(None)) -> dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid Bearer token")

    token = authorization.split(" ", 1)[1]
    payload = auth.decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired or invalid")

    workspaces = auth.get_user_workspaces(payload["sub"])
    return {
        "success": True,
        "workspaces": [
            {
                "id": w["id"],
                "name": w["name"],
                "plan": w.get("plan", "free"),
                "role": w.get("role", "member"),
            }
            for w in workspaces
        ],
    }

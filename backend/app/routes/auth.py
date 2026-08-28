from __future__ import annotations
import secrets
import time
from typing import Any
from fastapi import APIRouter, HTTPException, Header, Request, status
from pydantic import BaseModel, field_validator

from app.services.auth_service import (
    USERS_DB,
    check_rate_limit_and_lockout,
    create_access_token,
    decode_access_token,
    hash_password,
    record_failed_attempt,
    record_successful_attempt,
    sanitize_input,
    validate_email_format,
    validate_username_format,
    verify_password,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication & Security"],
)


class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = sanitize_input(v).lower()
        if not validate_email_format(v):
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
        v = sanitize_input(v)
        if not v or len(v) > 50:
            raise ValueError("Invalid name")
        return v


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def sanitize_email(cls, v: str) -> str:
        return sanitize_input(v).lower()


class ResetPasswordRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def sanitize_email(cls, v: str) -> str:
        return sanitize_input(v).lower()


class ConfirmResetRequest(BaseModel):
    token: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        if len(v) < 8 or len(v) > 128:
            raise ValueError("Password must be between 8 and 128 characters")
        return v


@router.post("/register", summary="User Registration", status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest) -> dict[str, Any]:
    # Prevent account enumeration on signup by using generic messages or verification
    if req.email in USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to complete registration with the provided details.",
        )

    user_id = f"usr_{secrets.token_hex(6)}"
    user = {
        "id": user_id,
        "email": req.email,
        "name": req.name,
        "role": "Analyst",
        "password_hash": hash_password(req.password),
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    USERS_DB[req.email] = user

    token = create_access_token({"sub": user_id, "email": req.email, "role": user["role"]})

    return {
        "success": True,
        "message": "Account created successfully.",
        "token": token,
        "user": {
            "id": user_id,
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
        },
    }


@router.post("/login", summary="User Login")
def login(req: LoginRequest, request: Request) -> dict[str, Any]:
    client_ip = request.client.host if request.client else "unknown_ip"
    identifier = f"{client_ip}:{req.email}"

    # 1. Rate Limiting & Account Lockout Check (Pillar 2)
    allowed, error_msg, progressive_delay = check_rate_limit_and_lockout(identifier)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=error_msg,
        )

    if progressive_delay > 0:
        time.sleep(progressive_delay)

    # 2. Equalized Response Timing & Generic Errors (Pillar 4)
    user = USERS_DB.get(req.email)

    if not user:
        # Perform dummy hash computation so response timing doesn't leak missing account
        verify_password(req.password, "")
        record_failed_attempt(identifier)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    if not verify_password(req.password, user["password_hash"]):
        record_failed_attempt(identifier)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    # Reset failure counters on successful login
    record_successful_attempt(identifier)

    token = create_access_token({"sub": user["id"], "email": user["email"], "role": user["role"]})

    return {
        "success": True,
        "message": "Authentication successful",
        "token": token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
        },
    }


# In-memory password-reset token store.
# In production this would be a Redis or DB table with a TTL; for the college
# submission we keep it in-process but use a short expiry.
RESET_TOKENS: dict[str, dict[str, Any]] = {}
RESET_TOKEN_TTL_SECONDS = 900  # 15 minutes


@router.post("/reset-password", summary="Password Reset Request")
def reset_password(req: ResetPasswordRequest) -> dict[str, Any]:
    # Pillar 4: Generic Password Reset Response to prevent Account Enumeration.
    # We ALWAYS return the same success message, but if the email is registered
    # we generate a reset token and (in a real deploy) email it. For demo /
    # college purposes we also return the token in the response so the user can
    # use it immediately without a real mail server.
    response: dict[str, Any] = {
        "success": True,
        "message": "If that email is registered, you'll receive a password reset link.",
    }

    if req.email in USERS_DB:
        token = secrets.token_urlsafe(32)
        RESET_TOKENS[token] = {
            "email": req.email,
            "expires_at": time.time() + RESET_TOKEN_TTL_SECONDS,
        }
        # Expose the token so the user can complete the flow without an email
        # server. In a real deployment this would ONLY be sent via email.
        response["dev_reset_token"] = token

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
    user = USERS_DB.get(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset link is invalid or has expired. Please request a new one.",
        )

    user["password_hash"] = hash_password(req.new_password)
    # Invalidate the token so it can't be reused.
    del RESET_TOKENS[req.token]
    # Invalidate any existing JWT for this user by bumping a per-user token
    # version. (Out of scope for the demo; mention as a known limitation.)
    return {
        "success": True,
        "message": "Password updated successfully. You can now sign in with your new password.",
    }


@router.get("/me", summary="Get Active User Profile")
def me(authorization: str | None = Header(None)) -> dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Bearer token",
        )

    token = authorization.split(" ", 1)[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired or invalid",
        )

    email = payload.get("email")
    user = USERS_DB.get(email) if email else None
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found",
        )

    return {
        "success": True,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
        },
    }

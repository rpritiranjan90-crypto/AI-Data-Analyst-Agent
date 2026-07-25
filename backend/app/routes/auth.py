from __future__ import annotations
import secrets
import time
from typing import Any
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel

from app.services.auth_service import (
    USERS_DB,
    create_access_token,
    decode_access_token,
    hash_password,
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


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register", summary="User Registration")
def register(req: RegisterRequest) -> dict[str, Any]:
    if req.email in USERS_DB:
        raise HTTPException(status_code=400, detail="User email already registered")

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
        "message": "User registered successfully",
        "token": token,
        "user": {
            "id": user_id,
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
        },
    }


@router.post("/login", summary="User Login")
def login(req: LoginRequest) -> dict[str, Any]:
    user = USERS_DB.get(req.email)
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

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


@router.get("/me", summary="Get Active User Details")
def me(authorization: str | None = Header(None)) -> dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Bearer token")

    token = authorization.split(" ", 1)[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token expired or invalid")

    email = payload.get("email")
    user = USERS_DB.get(email) if email else None
    if not user:
        raise HTTPException(status_code=404, detail="User account not found")

    return {
        "success": True,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
        },
    }

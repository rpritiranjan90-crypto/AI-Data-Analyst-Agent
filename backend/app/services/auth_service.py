"""
app/services/auth_service.py
---------------------------
Authentication service. All user identity lives in Supabase.
When SUPABASE_URL is not set (local dev without a Supabase project) the
service falls back to the in-memory USERS_DB so the app works without any
external dependencies.

JWT claims (all stored in Supabase, written into token at login):
  - sub     : user_id (uuid)
  - email   : user email
  - role    : workspace role for the *active* workspace
  - workspace_id : uuid of the currently-selected workspace
  - plan    : 'free' | 'pro' | 'enterprise' for the active workspace
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import logging
import os
import re
import secrets
import time
import uuid
from typing import TYPE_CHECKING, Any

from dotenv import load_dotenv

load_dotenv()

if TYPE_CHECKING:
    from supabase import Client as SupabaseClient

logger = logging.getLogger(__name__)

# ─── JWT constants ─────────────────────────────────────────────────────────────
_SECRET_KEY: str | None = None  # resolved lazily


def _resolve_jwt_secret() -> str:
    global _SECRET_KEY
    if _SECRET_KEY:
        return _SECRET_KEY

    explicit = os.environ.get("JWT_SECRET", "").strip()
    if explicit:
        if len(explicit) < 32:
            raise RuntimeError(
                "JWT_SECRET must be at least 32 characters. "
                "Generate: python -c \"import secrets; print(secrets.token_urlsafe(48))\""
            )
        _SECRET_KEY = explicit
        return _SECRET_KEY

    app_env = os.environ.get("APP_ENV", "development").lower()
    if app_env in ("production", "prod", "staging"):
        raise RuntimeError(
            "JWT_SECRET is REQUIRED in production. "
            "Refusing to start with a default/weak secret."
        )

    # Development: ephemeral per-process key
    ephemeral = secrets.token_urlsafe(48)
    logger.warning(
        "[SECURITY] JWT_SECRET not set — using an ephemeral per-process key. "
        "Tokens are invalidated on restart. Set JWT_SECRET in .env for stable dev sessions."
    )
    _SECRET_KEY = ephemeral
    return _SECRET_KEY


SECRET_KEY = _resolve_jwt_secret()
ALGORITHM = "HS256"
TOKEN_EXPIRE_SECONDS = 86400 * 7  # legacy alias — access tokens now use ACCESS_TOKEN_TTL

# C1: short-lived access token (15 min) + long-lived refresh token (7 days)
ACCESS_TOKEN_TTL_SECONDS = 15 * 60        # 15 minutes
REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 3600  # 7 days

# ─── Refresh token secret ───────────────────────────────────────────────────
_REFRESH_SECRET_KEY: str | None = None


def _resolve_refresh_secret() -> str:
    global _REFRESH_SECRET_KEY
    if _REFRESH_SECRET_KEY:
        return _REFRESH_SECRET_KEY

    explicit = os.environ.get("REFRESH_TOKEN_SECRET", "").strip()
    if explicit:
        if len(explicit) < 32:
            raise RuntimeError(
                "REFRESH_TOKEN_SECRET must be at least 32 characters. "
                "Generate: python -c \"import secrets; print(secrets.token_urlsafe(48))\""
            )
        _REFRESH_SECRET_KEY = explicit
        return _REFRESH_SECRET_KEY

    app_env = os.environ.get("APP_ENV", "development").lower()
    if app_env in ("production", "prod", "staging"):
        raise RuntimeError(
            "REFRESH_TOKEN_SECRET is REQUIRED in production. "
            "Refusing to start with a default/weak secret."
        )

    ephemeral = secrets.token_urlsafe(48)
    logger.warning(
        "[SECURITY] REFRESH_TOKEN_SECRET not set — using an ephemeral per-process key. "
        "Refresh tokens are invalidated on restart. Set REFRESH_TOKEN_SECRET in .env."
    )
    _REFRESH_SECRET_KEY = ephemeral
    return _REFRESH_SECRET_KEY


REFRESH_SECRET_KEY = _resolve_refresh_secret()

# ─── Supabase availability ────────────────────────────────────────────────────
_supabase_client: "SupabaseClient | None" = None
_USING_SUPABASE = False

_supabase_url = os.environ.get("SUPABASE_URL", "").strip()
_supabase_key = os.environ.get("SUPABASE_SERVICE_KEY", "").strip()

if _supabase_url and _supabase_key:
    try:
        from supabase import create_client

        _supabase_client = create_client(_supabase_url, _supabase_key)
        _USING_SUPABASE = True
        logger.info("[auth] Supabase connected — using persistent user storage.")
    except Exception as exc:  # pragma: no cover
        logger.warning(
            "[auth] Supabase connection failed (%s). Falling back to in-memory store.", exc
        )
        _USING_SUPABASE = False
else:
    logger.warning(
        "[auth] SUPABASE_URL/SUPABASE_SERVICE_KEY not set — "
        "using in-memory USERS_DB (dev mode only, data is NOT persistent)."
    )


# ─── Fallback in-memory store ────────────────────────────────────────────────
USERS_DB: dict[str, dict[str, Any]] = {}
WORKSPACES_DB: dict[str, dict[str, Any]] = {}
WORKSPACE_MEMBERS_DB: list[dict[str, Any]] = []
_DEFAULT_ADMIN_SEEDED = False


def _ensure_default_admin_seeded() -> None:
    """Seed the default admin user/workspace on first access in dev mode.

    Deferred to a function so we can reference ``hash_password`` (defined
    later in the module) without hitting a ``NameError`` at import time.
    """
    global _DEFAULT_ADMIN_SEEDED
    if _DEFAULT_ADMIN_SEEDED or _USING_SUPABASE:
        return
    _DEFAULT_ADMIN_SEEDED = True
    admin_id = str(uuid.uuid4())
    ws_id = str(uuid.uuid4())
    USERS_DB["admin@aianalyst.com"] = {
        "id": admin_id,
        "email": "admin@aianalyst.com",
        "password_hash": hash_password("Admin@123456"),
        "full_name": "Data Analyst Admin",
        "default_workspace_id": ws_id,
        "created_at": "2026-01-01T00:00:00Z",
    }
    WORKSPACES_DB[ws_id] = {
        "id": ws_id,
        "name": "AI Analyst Demo",
        "owner_user_id": admin_id,
        "plan": "free",
        "created_at": "2026-01-01T00:00:00Z",
    }
    WORKSPACE_MEMBERS_DB.append({
        "workspace_id": ws_id,
        "user_id": admin_id,
        "role": "owner",
        "invited_by": admin_id,
        "joined_at": "2026-01-01T00:00:00Z",
    })

# ─── Security tracking (in-memory, per-process) ───────────────────────────────
SECURITY_TRACKER: dict[str, dict[str, Any]] = {}

# ─── Refresh token store ──────────────────────────────────────────────────────
# Maps user_id → set of active jti values.
_REFRESH_TOKENS_DB: dict[str, set[str]] = {}


def _supabase_upsert_refresh_token(user_id: str, jti: str) -> None:
    _get_db().table("refresh_tokens").upsert(
        {"user_id": user_id, "jti": jti},
        on_conflict="user_id,jti",
    ).execute()


def _supabase_revoke_all_refresh_tokens(user_id: str) -> None:
    _get_db().table("refresh_tokens").delete().eq("user_id", user_id).execute()


def _supabase_is_jti_active(user_id: str, jti: str) -> bool:
    resp = (
        _get_db()
        .table("refresh_tokens")
        .select("jti")
        .eq("user_id", user_id)
        .eq("jti", jti)
        .execute()
    )
    return bool(resp.data)


def create_refresh_token(user_id: str) -> tuple[str, str]:
    """
    Mint a new refresh token and register its jti.
    Returns (token_string, jti).
    """
    jti = secrets.token_urlsafe(32)
    payload = {
        "sub": user_id,
        "jti": jti,
        "type": "refresh",
    }
    token = _encode_jwt(payload, secret=REFRESH_SECRET_KEY, ttl=REFRESH_TOKEN_TTL_SECONDS)

    if _USING_SUPABASE:
        _supabase_upsert_refresh_token(user_id, jti)
    else:
        if user_id not in _REFRESH_TOKENS_DB:
            _REFRESH_TOKENS_DB[user_id] = set()
        _REFRESH_TOKENS_DB[user_id].add(jti)

    return token, jti


def decode_refresh_token(token: str) -> dict[str, Any] | None:
    """
    Verify a refresh token: correct signature, not expired, jti still active.
    Returns the payload dict (with 'sub' and 'jti') or None.
    """
    payload = _decode_jwt(token, secret=REFRESH_SECRET_KEY)
    if not payload:
        return None
    if payload.get("type") != "refresh":
        return None

    user_id = payload.get("sub")
    jti = payload.get("jti")
    if not user_id or not jti:
        return None

    if _USING_SUPABASE:
        active = _supabase_is_jti_active(user_id, jti)
    else:
        active = jti in _REFRESH_TOKENS_DB.get(user_id, set())

    return payload if active else None


def rotate_refresh_token(user_id: str) -> tuple[str, str]:
    """
    Invalidate all existing refresh tokens for the user and issue a fresh one.
    Called on every successful /auth/refresh.
    """
    if _USING_SUPABASE:
        _supabase_revoke_all_refresh_tokens(user_id)
    else:
        _REFRESH_TOKENS_DB.pop(user_id, None)

    return create_refresh_token(user_id)


def revoke_all_refresh_tokens(user_id: str) -> None:
    """Revoke every refresh token for the user (logout or breach)."""
    if _USING_SUPABASE:
        _supabase_revoke_all_refresh_tokens(user_id)
    else:
        _REFRESH_TOKENS_DB.pop(user_id, None)

# ─── Supabase helpers ─────────────────────────────────────────────────────────
def _get_db() -> "SupabaseClient":
    if _supabase_client is None:
        raise RuntimeError("Supabase is not configured.")
    return _supabase_client


def _get_user_by_email(email: str) -> dict[str, Any] | None:
    """Fetch one user row by email from Supabase (or in-memory fallback)."""
    if _USING_SUPABASE:
        resp = _get_db().table("users").select("*").eq("email", email.lower()).execute()
        return resp.data[0] if resp.data else None
    _ensure_default_admin_seeded()
    return USERS_DB.get(email.lower())


def _get_user_by_id(user_id: str) -> dict[str, Any] | None:
    if _USING_SUPABASE:
        resp = _get_db().table("users").select("*").eq("id", user_id).execute()
        return resp.data[0] if resp.data else None
    _ensure_default_admin_seeded()
    for u in USERS_DB.values():
        if u["id"] == user_id:
            return u
    return None


def _get_workspace(ws_id: str) -> dict[str, Any] | None:
    if _USING_SUPABASE:
        resp = _get_db().table("workspaces").select("*").eq("id", ws_id).execute()
        return resp.data[0] if resp.data else None
    _ensure_default_admin_seeded()
    return WORKSPACES_DB.get(ws_id)


def _get_user_workspaces(user_id: str) -> list[dict[str, Any]]:
    """Return all workspaces the user is a member of, with their role."""
    if _USING_SUPABASE:
        resp = (
            _get_db()
            .table("workspace_members")
            .select("role, workspaces(*)")
            .eq("user_id", user_id)
            .execute()
        )
        return [
            {**wm["workspaces"], "role": wm["role"]}
            for wm in resp.data
            if wm.get("workspaces")
        ]
    _ensure_default_admin_seeded()
    return [
        {**ws, "role": m["role"]}
        for m in WORKSPACE_MEMBERS_DB
        if m["user_id"] == user_id
        for ws in [WORKSPACES_DB.get(m["workspace_id"], {})]
        if ws
    ]


# ─── Core auth functions ──────────────────────────────────────────────────────
def sanitize_input(text: str) -> str:
    if not text:
        return ""
    clean = re.sub(r"<[^>]*?>", "", text)
    return clean.strip()


def validate_email_format(email: str) -> bool:
    if not email or len(email) > 254:
        return False
    return bool(re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", email))


def validate_username_format(username: str) -> bool:
    if not username or len(username) < 3 or len(username) > 30:
        return False
    return bool(re.match(r"^[a-zA-Z0-9_-]+$", username))


def hash_password(password: str, salt: str | None = None) -> str:
    if not salt:
        salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000)
    return f"{salt}${key.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    if not stored_hash or "$" not in stored_hash:
        hash_password(password, "dummysalt12345678")  # constant-time dummy
        return False
    try:
        salt, _ = stored_hash.split("$", 1)
        return secrets.compare_digest(hash_password(password, salt), stored_hash)
    except Exception:
        return False


def check_rate_limit_and_lockout(identifier: str) -> tuple[bool, str, float]:
    now = time.time()
    record = SECURITY_TRACKER.get(identifier, {"attempts": 0, "lockout_until": 0.0, "last_attempt": 0.0})
    if record["lockout_until"] > now:
        remaining_min = int((record["lockout_until"] - now) / 60) + 1
        return False, f"Too many failed login attempts. Account locked for {remaining_min} minutes.", 0.0
    if now - record["last_attempt"] > 900:
        record["attempts"] = 0
    delay = min(1.0 * (2 ** (max(0, record["attempts"] - 3))), 5.0)
    return True, "", delay


def record_failed_attempt(identifier: str) -> None:
    now = time.time()
    record = SECURITY_TRACKER.get(identifier, {"attempts": 0, "lockout_until": 0.0, "last_attempt": now})
    record["attempts"] += 1
    record["last_attempt"] = now
    if record["attempts"] >= 5:
        record["lockout_until"] = now + 900
    SECURITY_TRACKER[identifier] = record


def record_successful_attempt(identifier: str) -> None:
    SECURITY_TRACKER.pop(identifier, None)


# ─── User CRUD (Supabase + fallback) ────────────────────────────────────────
def create_user(
    email: str,
    password: str,
    full_name: str,
    *,
    workspace_name: str | None = None,
) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    """
    Create a new user and their first workspace.
    Returns (user_dict, workspaces_list).
    """
    user_id = str(uuid.uuid4())
    password_hash = hash_password(password)
    created_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

    if _USING_SUPABASE:
        # Insert user
        _get_db().table("users").insert({
            "id": user_id,
            "email": email.lower(),
            "password_hash": password_hash,
            "full_name": full_name,
            "created_at": created_at,
        }).execute()

        # Create first workspace
        ws_id = str(uuid.uuid4())
        ws_name = workspace_name or f"{full_name}'s Workspace"
        _get_db().table("workspaces").insert({
            "id": ws_id,
            "name": ws_name,
            "owner_user_id": user_id,
            "plan": "free",
            "created_at": created_at,
        }).execute()

        # Link user → workspace as owner
        _get_db().table("workspace_members").insert({
            "workspace_id": ws_id,
            "user_id": user_id,
            "role": "owner",
            "invited_by": user_id,
            "joined_at": created_at,
        }).execute()

        # Update user's default workspace
        _get_db().table("users").update(
            {"default_workspace_id": ws_id}
        ).eq("id", user_id).execute()

        # Fetch the workspace with role
        workspaces = _get_user_workspaces(user_id)
        user = _get_user_by_id(user_id)
        return user, workspaces

    # In-memory fallback
    ws_id = str(uuid.uuid4())
    ws_name = workspace_name or f"{full_name}'s Workspace"
    user = {
        "id": user_id,
        "email": email.lower(),
        "password_hash": password_hash,
        "full_name": full_name,
        "default_workspace_id": ws_id,
        "created_at": created_at,
    }
    USERS_DB[email.lower()] = user
    WORKSPACES_DB[ws_id] = {
        "id": ws_id, "name": ws_name, "owner_user_id": user_id,
        "plan": "free", "created_at": created_at,
    }
    WORKSPACE_MEMBERS_DB.append({
        "workspace_id": ws_id, "user_id": user_id, "role": "owner",
        "invited_by": user_id, "joined_at": created_at,
    })
    workspaces = _get_user_workspaces(user_id)
    return user, workspaces


def authenticate_user(email: str, password: str) -> tuple[dict[str, Any], list[dict[str, Any]]] | None:
    """
    Verify credentials. Returns (user, workspaces) or None.
    """
    user = _get_user_by_email(email)
    if not user:
        verify_password(password, "")  # constant-time dummy
        return None
    if not verify_password(password, user["password_hash"]):
        return None
    workspaces = _get_user_workspaces(user["id"])
    return user, workspaces


def get_user_by_id(user_id: str) -> dict[str, Any] | None:
    return _get_user_by_id(user_id)


def get_user_workspaces(user_id: str) -> list[dict[str, Any]]:
    return _get_user_workspaces(user_id)


def update_user_password(user_id: str, new_password_hash: str) -> None:
    if _USING_SUPABASE:
        _get_db().table("users").update(
            {"password_hash": new_password_hash, "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ")}
        ).eq("id", user_id).execute()
        return
    for u in USERS_DB.values():
        if u["id"] == user_id:
            u["password_hash"] = new_password_hash
            return


def get_workspace(ws_id: str) -> dict[str, Any] | None:
    return _get_workspace(ws_id)


def user_email_exists(email: str) -> bool:
    return _get_user_by_email(email) is not None


# ─── JWT ──────────────────────────────────────────────────────────────────────
def create_access_token(
    user_id: str,
    email: str,
    workspaces: list[dict[str, Any]],
    *,
    active_workspace_id: str | None = None,
) -> str:
    """
    Build a JWT with workspace-scoped claims.
    The active workspace defaults to the user's default workspace.
    """
    if not active_workspace_id:
        active_workspace_id = (
            workspaces[0]["id"] if workspaces else ""
        )

    active_ws = next((w for w in workspaces if w["id"] == active_workspace_id), workspaces[0] if workspaces else {})
    active_role = active_ws.get("role", "member")
    active_plan = active_ws.get("plan", "free")

    payload = {
        "sub": user_id,
        "email": email,
        "role": active_role,
        "workspace_id": active_workspace_id,
        "plan": active_plan,
        "type": "access",
    }
    return _encode_jwt(payload, ttl=ACCESS_TOKEN_TTL_SECONDS)


def create_workspace_switch_token(
    user_id: str,
    email: str,
    workspaces: list[dict[str, Any]],
    new_workspace_id: str,
) -> str:
    """Issue a new JWT with a different active workspace."""
    active_ws = next((w for w in workspaces if w["id"] == new_workspace_id), None)
    if not active_ws:
        raise ValueError(f"Workspace {new_workspace_id} not found for this user")
    return create_access_token(
        user_id, email, workspaces, active_workspace_id=new_workspace_id
    )


def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def _b64url_decode(s: str) -> bytes:
    padding = "=" * (4 - (len(s) % 4))
    return base64.urlsafe_b64decode(s + padding)


def _encode_jwt(
    payload: dict[str, Any],
    secret: str | None = None,
    ttl: int | None = None,
) -> str:
    """Sign a JWT. Uses SECRET_KEY and TOKEN_EXPIRE_SECONDS by default."""
    _secret = secret or SECRET_KEY
    _ttl = ttl if ttl is not None else TOKEN_EXPIRE_SECONDS

    header = {"alg": "HS256", "typ": "JWT"}
    payload_copy = payload.copy()
    payload_copy["exp"] = int(time.time()) + _ttl
    payload_copy["iat"] = int(time.time())

    header_b64 = _b64url(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_b64 = _b64url(json.dumps(payload_copy, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    signature = hmac.new(_secret.encode("utf-8"), signing_input, hashlib.sha256).digest()
    signature_b64 = _b64url(signature)
    return f"{header_b64}.{payload_b64}.{signature_b64}"


def _decode_jwt(token: str, secret: str) -> dict[str, Any] | None:
    """Decode and verify a JWT signed with the given secret. Returns payload or None."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, signature_b64 = parts

        signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
        expected_sig = hmac.new(secret.encode("utf-8"), signing_input, hashlib.sha256).digest()
        if not secrets.compare_digest(expected_sig, _b64url_decode(signature_b64)):
            return None

        payload = json.loads(_b64url_decode(payload_b64).decode("utf-8"))
        if payload.get("exp", 0) < int(time.time()):
            return None
        return payload
    except Exception:
        return None


def decode_access_token(token: str) -> dict[str, Any] | None:
    return _decode_jwt(token, SECRET_KEY)

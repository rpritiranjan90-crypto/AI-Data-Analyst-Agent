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
from typing import Any

logger = logging.getLogger(__name__)

# ----------------------------------------------------------------------------
# JWT Secret Key Resolution
# ----------------------------------------------------------------------------
# CRITICAL: The JWT secret MUST come from an environment variable in production.
# We refuse to start in production mode if JWT_SECRET is not set or weak.
# For local development, we generate a random per-process key (tokens invalidated
# on restart) to avoid the dangerous default that ships in the repo.
# ----------------------------------------------------------------------------


def _resolve_jwt_secret() -> str:
    explicit = os.environ.get("JWT_SECRET", "").strip()
    if explicit:
        if len(explicit) < 32:
            raise RuntimeError(
                "JWT_SECRET must be at least 32 characters. "
                "Generate one with: python -c 'import secrets; print(secrets.token_urlsafe(48))'"
            )
        return explicit

    app_env = os.environ.get("APP_ENV", "development").lower()
    if app_env in ("production", "prod", "staging"):
        raise RuntimeError(
            "JWT_SECRET environment variable is REQUIRED in production. "
            "Refusing to start with a default secret."
        )

    # Development: ephemeral per-process key. Tokens are invalidated on restart,
    # which is the safest fallback for local dev.
    ephemeral = secrets.token_urlsafe(48)
    logger.warning(
        "[SECURITY] JWT_SECRET not set; using an ephemeral per-process key. "
        "All tokens will be invalidated on restart. Set JWT_SECRET in .env for stable dev sessions."
    )
    return ephemeral


SECRET_KEY = _resolve_jwt_secret()
ALGORITHM = "HS256"
TOKEN_EXPIRE_SECONDS = 86400 * 7  # 7 days

# In-memory Security Tracking Store (IP & Account Lockouts)
# Format: { key: { "attempts": int, "lockout_until": float, "last_attempt": float } }
SECURITY_TRACKER: dict[str, dict[str, Any]] = {}

# User Database (Stores hashed passwords, salts, and roles)
USERS_DB: dict[str, dict[str, Any]] = {}


def sanitize_input(text: str) -> str:
    """Strip HTML tags and script injection vectors."""
    if not text:
        return ""
    clean = re.sub(r"<[^>]*?>", "", text)
    clean = clean.replace("<", "&lt;").replace(">", "&gt;")
    return clean.strip()


def validate_email_format(email: str) -> bool:
    """Validate email format, length, and domain structure."""
    if not email or len(email) > 254:
        return False
    email_regex = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return bool(re.match(email_regex, email))


def validate_username_format(username: str) -> bool:
    """Whitelist username: alphanumeric, underscore, hyphen (3 to 30 chars)."""
    if not username or len(username) < 3 or len(username) > 30:
        return False
    return bool(re.match(r"^[a-zA-Z0-9_-]+$", username))


def hash_password(password: str, salt: str | None = None) -> str:
    """
    Hash password using SHA-256 with 100,000 PBKDF2 iterations and random salt.
    Prevents plain-text password exposure.
    """
    if not salt:
        salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"{salt}${key.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    """Verify password using constant-time comparison to prevent timing attacks."""
    if not stored_hash or "$" not in stored_hash:
        # Perform dummy hash computation to preserve constant execution time
        hash_password(password, "dummysalt12345678")
        return False
    try:
        salt, _ = stored_hash.split("$", 1)
        new_hash = hash_password(password, salt)
        return secrets.compare_digest(new_hash, stored_hash)
    except Exception:
        return False


def check_rate_limit_and_lockout(identifier: str) -> tuple[bool, str, float]:
    """
    Check if IP or account is rate limited or locked out.
    Returns: (is_allowed, error_message, progressive_delay_seconds)
    """
    now = time.time()
    record = SECURITY_TRACKER.get(identifier, {"attempts": 0, "lockout_until": 0.0, "last_attempt": 0.0})

    # 1. Check account lockout
    if record["lockout_until"] > now:
        remaining_min = int((record["lockout_until"] - now) / 60) + 1
        return False, f"Too many failed login attempts. Account locked for {remaining_min} minutes.", 0.0

    # Reset attempts if last attempt was > 15 minutes ago
    if now - record["last_attempt"] > 900:
        record["attempts"] = 0

    attempts = record["attempts"]
    delay = 0.0
    if attempts >= 3:
        delay = min(1.0 * (2 ** (attempts - 3)), 5.0)  # Progressive delay: 1s, 2s, 4s, 5s

    return True, "", delay


def record_failed_attempt(identifier: str) -> None:
    """Record a failed login attempt for an IP/account and trigger lockout after 5 failures."""
    now = time.time()
    record = SECURITY_TRACKER.get(identifier, {"attempts": 0, "lockout_until": 0.0, "last_attempt": now})
    record["attempts"] += 1
    record["last_attempt"] = now

    if record["attempts"] >= 5:
        record["lockout_until"] = now + 900  # 15-minute lockout

    SECURITY_TRACKER[identifier] = record


def record_successful_attempt(identifier: str) -> None:
    """Reset failure tracker upon successful authentication."""
    if identifier in SECURITY_TRACKER:
        del SECURITY_TRACKER[identifier]


# Initialize default admin user with hashed password
USERS_DB["admin@aianalyst.com"] = {
    "id": "usr_admin_001",
    "email": "admin@aianalyst.com",
    "name": "Data Analyst Admin",
    "role": "Administrator",
    "password_hash": hash_password("Admin@123456"),
    "created_at": "2026-01-01T00:00:00Z",
}


def create_access_token(payload: dict[str, Any]) -> str:
    """Generate HS256 JWT Token using standard library."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload_copy = payload.copy()
    payload_copy["exp"] = int(time.time()) + TOKEN_EXPIRE_SECONDS
    payload_copy["iat"] = int(time.time())

    def b64url(data: bytes) -> str:
        return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")

    header_b64 = b64url(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_b64 = b64url(json.dumps(payload_copy, separators=(",", ":")).encode("utf-8"))

    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    signature = hmac.new(SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    signature_b64 = b64url(signature)

    return f"{header_b64}.{payload_b64}.{signature_b64}"


def decode_access_token(token: str) -> dict[str, Any] | None:
    """Verify signature & decode JWT Token."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None

        header_b64, payload_b64, signature_b64 = parts

        def b64url_decode(s: str) -> bytes:
            padding = "=" * (4 - (len(s) % 4))
            return base64.urlsafe_b64decode(s + padding)

        signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
        expected_sig = hmac.new(SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
        
        actual_sig = b64url_decode(signature_b64)
        if not secrets.compare_digest(expected_sig, actual_sig):
            return None

        payload = json.loads(b64url_decode(payload_b64).decode("utf-8"))
        if payload.get("exp", 0) < int(time.time()):
            return None

        return payload
    except Exception:
        return None

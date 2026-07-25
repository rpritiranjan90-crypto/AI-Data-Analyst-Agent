from __future__ import annotations
import base64
import hashlib
import hmac
import json
import secrets
import time
from typing import Any

SECRET_KEY = "enterprise_ai_data_analyst_super_secret_jwt_key_change_in_production"
ALGORITHM = "HS256"
TOKEN_EXPIRE_SECONDS = 86400 * 7  # 7 days

USERS_DB: dict[str, dict[str, Any]] = {
    "admin@aianalyst.com": {
        "id": "usr_admin_001",
        "email": "admin@aianalyst.com",
        "name": "Data Analyst Admin",
        "role": "Administrator",
        "password_hash": "",
        "created_at": "2026-01-01T00:00:00Z"
    }
}


def hash_password(password: str, salt: str | None = None) -> str:
    """Hash password using SHA-256 with salt."""
    if not salt:
        salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"{salt}${key.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    """Verify raw password against stored hash."""
    if not stored_hash or "$" not in stored_hash:
        return False
    salt, key = stored_hash.split("$", 1)
    new_hash = hash_password(password, salt)
    return secrets.compare_digest(new_hash, stored_hash)


# Initialize default admin password
USERS_DB["admin@aianalyst.com"]["password_hash"] = hash_password("admin123")


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

from __future__ import annotations

import secrets
import string
from hashlib import sha256

from app.core.config import settings


def generate_secret_key(
    length: int = 64,
) -> str:
    """
    Generate a cryptographically secure secret key.

    Args:
        length:
            Length of generated key.

    Returns:
        Random secret key.
    """

    alphabet = (
        string.ascii_letters
        + string.digits
        + string.punctuation
    )

    return "".join(
        secrets.choice(alphabet)
        for _ in range(length)
    )


def generate_api_key(
    prefix: str = "ada",
) -> str:
    """
    Generate a secure API key.

    Example:
        ada_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    """

    token = secrets.token_urlsafe(32)

    return f"{prefix}_{token}"


def hash_value(
    value: str,
) -> str:
    """
    Generate SHA-256 hash.

    Args:
        value:
            Input string.

    Returns:
        Hexadecimal hash.
    """

    return sha256(
        value.encode(
            settings.DEFAULT_ENCODING,
        )
    ).hexdigest()


def secure_compare(
    first: str,
    second: str,
) -> bool:
    """
    Compare two values using constant-time comparison.
    """

    return secrets.compare_digest(
        first,
        second,
    )
from __future__ import annotations

import secrets
import string

from pwdlib import PasswordHash

password_hasher = PasswordHash.recommended()


def hash_password(
    password: str,
) -> str:
    """
    Hash a password using the recommended algorithm.

    Args:
        password:
            Plain-text password.

    Returns:
        Secure password hash.
    """

    return password_hasher.hash(
        password
    )


def verify_password(
    password: str,
    password_hash: str,
) -> bool:
    """
    Verify a password.

    Args:
        password:
            Plain-text password.

        password_hash:
            Stored password hash.

    Returns:
        True if password is valid.
    """

    return password_hasher.verify(
        password,
        password_hash,
    )


def validate_password_strength(
    password: str,
    minimum_length: int = 8,
) -> None:
    """
    Validate password strength.

    Raises
    ------
    ValueError
        If password does not satisfy
        minimum security requirements.
    """

    if len(password) < minimum_length:
        raise ValueError(
            f"Password must contain at least "
            f"{minimum_length} characters."
        )

    if not any(
        character.isupper()
        for character in password
    ):
        raise ValueError(
            "Password must contain an uppercase letter."
        )

    if not any(
        character.islower()
        for character in password
    ):
        raise ValueError(
            "Password must contain a lowercase letter."
        )

    if not any(
        character.isdigit()
        for character in password
    ):
        raise ValueError(
            "Password must contain a digit."
        )

    if not any(
        character in string.punctuation
        for character in password
    ):
        raise ValueError(
            "Password must contain a special character."
        )


def generate_secure_token(
    length: int = 32,
) -> str:
    """
    Generate a cryptographically secure token.
    """

    return secrets.token_urlsafe(
        length
    )


def generate_random_filename(
    extension: str,
) -> str:
    """
    Generate a secure random filename.

    Example
    -------
    e4e9b5d89efb4c73a5.csv
    """

    return (
        f"{secrets.token_hex(16)}"
        f"{extension}"
    )
from __future__ import annotations

import re
import secrets
from pathlib import Path


def sanitize_filename(
    filename: str,
) -> str:
    """
    Sanitize a filename.

    Removes unsafe characters while preserving
    letters, numbers, '.', '_' and '-'.
    """

    sanitized = re.sub(
        r"[^A-Za-z0-9._-]",
        "_",
        filename,
    )

    return sanitized


def validate_secret_key(
    secret_key: str,
    minimum_length: int = 32,
) -> None:
    """
    Validate application secret key.

    Raises
    ------
    ValueError
        If the secret key is too short.
    """

    if len(secret_key) < minimum_length:
        raise ValueError(
            (
                "Secret key must contain at least "
                f"{minimum_length} characters."
            )
        )


def calculate_entropy(
    value: str,
) -> int:
    """
    Estimate entropy using the number of unique
    characters.

    This is a lightweight helper and should not be
    treated as a cryptographic entropy calculation.
    """

    return len(set(value))


def is_secure_secret(
    secret: str,
) -> bool:
    """
    Determine whether a secret appears reasonably
    secure.

    Returns
    -------
    bool
    """

    return (
        len(secret) >= 32
        and calculate_entropy(secret) >= 16
    )


def generate_csrf_token() -> str:
    """
    Generate a CSRF token.
    """

    return secrets.token_urlsafe(32)


def normalize_path(
    path: str | Path,
) -> Path:
    """
    Normalize a filesystem path.
    """

    return Path(path).expanduser().resolve()


__all__ = [
    "generate_secret_key",
    "generate_api_key",
    "hash_value",
    "secure_compare",
    "hash_password",
    "verify_password",
    "validate_password_strength",
    "generate_secure_token",
    "generate_random_filename",
    "sanitize_filename",
    "validate_secret_key",
    "calculate_entropy",
    "is_secure_secret",
    "generate_csrf_token",
    "normalize_path",
]
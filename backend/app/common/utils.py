"""
Common utility functions for the AI Data Analyst backend.
"""

from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import Any
from uuid import uuid4


def generate_uuid() -> str:
    """Generate a UUID string."""
    return str(uuid4())


def current_timestamp() -> str:
    """Return current UTC timestamp."""
    return datetime.utcnow().isoformat() + "Z"


def ensure_directory(path: str | Path) -> Path:
    """Create directory if it doesn't exist."""
    directory = Path(path)
    directory.mkdir(parents=True, exist_ok=True)
    return directory


def file_extension(filename: str) -> str:
    """Return lowercase file extension."""
    return Path(filename).suffix.lower()


def filename_without_extension(filename: str) -> str:
    """Return filename without extension."""
    return Path(filename).stem


def safe_dict(value: Any) -> dict:
    """Safely return a dictionary."""
    return value if isinstance(value, dict) else {}


def safe_list(value: Any) -> list:
    """Safely return a list."""
    return value if isinstance(value, list) else []


def safe_str(value: Any) -> str:
    """Safely convert value to string."""
    return "" if value is None else str(value)
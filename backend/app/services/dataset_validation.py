from __future__ import annotations

import re
import pandas as pd
from pathlib import Path
from fastapi import UploadFile

from app.common.config import settings
from app.common.utils import file_extension
from app.exceptions.base import ValidationException


def sanitize_filename(filename: str) -> str:
    """
    Sanitize uploaded filename to prevent Path Traversal and Command Injection attacks.
    Removes path separators, null bytes, and dangerous characters.
    """
    if not filename:
        return "unnamed_dataset.csv"

    # Remove path directory traversals
    clean_name = Path(filename).name
    # Strip null bytes and non-printable characters
    clean_name = re.sub(r"[\x00-\x1f\x7f-\x9f]", "", clean_name)
    # Allow alphanumeric, underscore, hyphen, and period only
    clean_name = re.sub(r"[^a-zA-Z0-9._-]", "_", clean_name)

    # Ensure valid extension
    if not any(clean_name.lower().endswith(ext) for ext in settings.ALLOWED_EXTENSIONS):
        clean_name += ".csv"

    return clean_name


def validate_filename(file: UploadFile) -> None:
    """
    Validate uploaded filename.
    """
    if not file.filename:
        raise ValidationException("Filename cannot be empty.")
    if "\x00" in file.filename or ".." in file.filename or "/" in file.filename or "\\" in file.filename:
        raise ValidationException("Invalid filename containing path traversal or dangerous characters.")


def validate_extension(file: UploadFile) -> None:
    """
    Validate uploaded file extension.
    """
    extension = file_extension(file.filename)
    if extension not in settings.ALLOWED_EXTENSIONS:
        allowed = ", ".join(settings.ALLOWED_EXTENSIONS)
        raise ValidationException(
            f"Unsupported file type '{extension}'. Allowed types: {allowed}."
        )


def validate_size(file_size: int) -> None:
    """
    Validate uploaded file size.
    """
    if file_size <= 0:
        raise ValidationException("Uploaded file is empty.")
    if file_size > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise ValidationException(
            f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB} MB."
        )


def validate_magic_bytes(file_bytes: bytes, filename: str) -> None:
    """
    Validate file magic byte signatures to prevent file mime-spoofing attacks.
    """
    ext = file_extension(filename).lower()

    if ext == ".xlsx":
        # ZIP archive signature (PK\x03\x04 or PK\x05\x06)
        if not (file_bytes.startswith(b"PK\x03\x04") or file_bytes.startswith(b"PK\x05\x06")):
            raise ValidationException("Invalid .xlsx file signature. The file format does not match the .xlsx extension.")
    elif ext == ".xls":
        # OLE compound file signature (\xd0\xcf\x11\xe0)
        if not file_bytes.startswith(b"\xd0\xcf\x11\xe0") and not file_bytes.startswith(b"PK\x03\x04"):
            raise ValidationException("Invalid .xls file signature. The file format does not match the .xls extension.")
    elif ext in [".csv", ".txt", ".tsv"]:
        # Block binary executable signatures (MZ, \x7fELF, etc.)
        if file_bytes.startswith(b"MZ") or file_bytes.startswith(b"\x7fELF") or file_bytes.startswith(b"\xca\xfe\xba\xbe"):
            raise ValidationException("Executable files are strictly prohibited.")


def sanitize_csv_formula_injection(df: pd.DataFrame) -> pd.DataFrame:
    """
    Sanitize DataFrame cells against CSV / Excel Formula Injection (DDE attacks).
    Prepends a single quote "'" to cells starting with '=', '+', '-', '@', '\t', '\r'.
    """
    dangerous_prefixes = ("=", "+", "-", "@", "\t", "\r")

    def sanitize_val(val: Any) -> Any:
        if isinstance(val, str) and val.startswith(dangerous_prefixes):
            return f"'{val}"
        return val

    # Apply sanitization to text/object columns
    for col in df.select_dtypes(include=["object", "string"]).columns:
        df[col] = df[col].map(sanitize_val)

    return df


def validate_upload(file: UploadFile, file_size: int, contents: bytes | None = None) -> None:
    """
    Validate uploaded dataset with strict security checks.
    """
    validate_filename(file)
    validate_extension(file)
    validate_size(file_size)
    if contents:
        validate_magic_bytes(contents, file.filename)
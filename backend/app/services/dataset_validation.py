from pathlib import Path
from fastapi import UploadFile

from app.config import (
    ALLOWED_EXTENSIONS,
    MAX_FILE_SIZE,
)


class DatasetValidationError(Exception):
    """Raised when dataset validation fails."""
    pass


def validate_extension(file: UploadFile) -> None:

    extension = Path(file.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise DatasetValidationError(
            f"Unsupported file type: {extension}"
        )


def validate_filename(file: UploadFile) -> None:

    if not file.filename:
        raise DatasetValidationError(
            "Filename cannot be empty."
        )


def validate_size(file_size: int) -> None:

    if file_size <= 0:
        raise DatasetValidationError(
            "Uploaded file is empty."
        )

    if file_size > MAX_FILE_SIZE:
        raise DatasetValidationError(
            "File exceeds maximum allowed size (100 MB)."
        )


def validate_upload(
    file: UploadFile,
    file_size: int
) -> None:

    validate_filename(file)

    validate_extension(file)

    validate_size(file_size)
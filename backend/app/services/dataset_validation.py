from __future__ import annotations

from fastapi import UploadFile

from app.common.config import settings
from app.common.utils import file_extension
from app.exceptions.base import ValidationException


def validate_filename(file: UploadFile) -> None:
    """
    Validate uploaded filename.
    """

    if not file.filename:
        raise ValidationException(
            "Filename cannot be empty."
        )


def validate_extension(file: UploadFile) -> None:
    """
    Validate uploaded file extension.
    """

    extension = file_extension(file.filename)

    if extension not in settings.ALLOWED_EXTENSIONS:
        allowed = ", ".join(settings.ALLOWED_EXTENSIONS)

        raise ValidationException(
            f"Unsupported file type '{extension}'. "
            f"Allowed types: {allowed}."
        )


def validate_size(file_size: int) -> None:
    """
    Validate uploaded file size.
    """

    if file_size <= 0:
        raise ValidationException(
            "Uploaded file is empty."
        )

    if file_size > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise ValidationException(
            f"File exceeds maximum size of "
            f"{settings.MAX_FILE_SIZE_MB} MB."
        )


def validate_upload(
    file: UploadFile,
    file_size: int,
) -> None:
    """
    Validate uploaded dataset.
    """

    validate_filename(file)
    validate_extension(file)
    validate_size(file_size)
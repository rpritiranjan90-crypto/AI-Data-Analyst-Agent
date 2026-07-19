from __future__ import annotations

from pathlib import Path

from fastapi import UploadFile

from app.core.config import settings
from app.core.constants import (
    SUPPORTED_DATASET_EXTENSIONS,
)


# ==========================================================
# File Validators
# ==========================================================

def validate_upload_file(
    file: UploadFile,
) -> None:
    """
    Validate an uploaded file.

    Raises
    ------
    ValueError
        If the uploaded file is invalid.
    """

    if file.filename is None:
        raise ValueError(
            "Uploaded file has no filename."
        )

    extension = (
        Path(file.filename)
        .suffix
        .lower()
    )

    if extension not in SUPPORTED_DATASET_EXTENSIONS:
        raise ValueError(
            f"Unsupported file type: {extension}"
        )


def validate_file_extension(
    filename: str,
) -> None:
    """
    Validate a filename extension.
    """

    extension = (
        Path(filename)
        .suffix
        .lower()
    )

    if extension not in SUPPORTED_DATASET_EXTENSIONS:
        raise ValueError(
            f"Unsupported extension: {extension}"
        )


def validate_file_size(
    size_in_bytes: int,
) -> None:
    """
    Validate uploaded file size.
    """

    max_size = (
        settings.MAX_UPLOAD_SIZE_MB
        * 1024
        * 1024
    )

    if size_in_bytes > max_size:
        raise ValueError(
            (
                "File exceeds maximum upload size "
                f"({settings.MAX_UPLOAD_SIZE_MB} MB)."
            )
        )


def validate_path_exists(
    path: Path,
) -> None:
    """
    Validate that a filesystem path exists.
    """

    if not path.exists():
        raise FileNotFoundError(
            f"{path} does not exist."
        )


import re

import pandas as pd

from app.core.constants import (
    CLASSIFICATION,
    CLUSTERING,
    REGRESSION,
    SUPPORTED_PROBLEM_TYPES,
)
from app.core.exceptions import (
    BadRequestException,
)


# ==========================================================
# Dataset Validators
# ==========================================================

def validate_dataset(
    dataframe: pd.DataFrame,
) -> None:
    """
    Validate a pandas DataFrame.
    """

    if dataframe.empty:
        raise BadRequestException(
            "Dataset is empty."
        )


def validate_target_column(
    dataframe: pd.DataFrame,
    target: str,
) -> None:
    """
    Validate target column existence.
    """

    if target not in dataframe.columns:
        raise BadRequestException(
            f"Target column '{target}' does not exist."
        )


# ==========================================================
# Pagination Validators
# ==========================================================

def validate_page(
    page: int,
) -> None:
    """
    Validate page number.
    """

    if page < 1:
        raise BadRequestException(
            "Page number must be greater than zero."
        )


def validate_page_size(
    page_size: int,
) -> None:
    """
    Validate page size.
    """

    if page_size < 1:
        raise BadRequestException(
            "Page size must be greater than zero."
        )

    if page_size > settings.MAX_PAGE_SIZE:
        raise BadRequestException(
            (
                f"Maximum page size is "
                f"{settings.MAX_PAGE_SIZE}."
            )
        )


# ==========================================================
# Machine Learning Validators
# ==========================================================

def validate_problem_type(
    problem_type: str,
) -> None:
    """
    Validate ML problem type.
    """

    if problem_type not in SUPPORTED_PROBLEM_TYPES:
        raise BadRequestException(
            (
                "Unsupported problem type. "
                f"Supported: {SUPPORTED_PROBLEM_TYPES}"
            )
        )


def validate_model_name(
    model_name: str,
) -> None:
    """
    Validate model name.
    """

    if not re.fullmatch(
        r"[A-Za-z0-9_-]{1,100}",
        model_name,
    ):
        raise BadRequestException(
            (
                "Model name may contain only "
                "letters, numbers, '_' and '-'."
            )
        )


def validate_random_state(
    random_state: int,
) -> None:
    """
    Validate random state.
    """

    if random_state < 0:
        raise BadRequestException(
            "Random state must be non-negative."
        )


def validate_test_size(
    test_size: float,
) -> None:
    """
    Validate train/test split ratio.
    """

    if not 0 < test_size < 1:
        raise BadRequestException(
            (
                "Test size must be between "
                "0 and 1."
            )
        )


from pathlib import Path
from uuid import UUID

from app.core.exceptions import (
    BadRequestException,
    ResourceNotFoundException,
)


# ==========================================================
# Generic Validators
# ==========================================================

def validate_positive_integer(
    value: int,
    field_name: str,
) -> None:
    """
    Validate that an integer is positive.
    """

    if value <= 0:
        raise BadRequestException(
            f"{field_name} must be greater than zero."
        )


def validate_non_negative_integer(
    value: int,
    field_name: str,
) -> None:
    """
    Validate that an integer is non-negative.
    """

    if value < 0:
        raise BadRequestException(
            f"{field_name} must be non-negative."
        )


def validate_string(
    value: str,
    field_name: str,
) -> None:
    """
    Validate a non-empty string.
    """

    if not value.strip():
        raise BadRequestException(
            f"{field_name} cannot be empty."
        )


def validate_uuid(
    value: str,
) -> UUID:
    """
    Validate a UUID string.

    Returns
    -------
    UUID
        Parsed UUID object.
    """

    try:
        return UUID(value)

    except ValueError as exc:
        raise BadRequestException(
            "Invalid UUID."
        ) from exc


def validate_existing_path(
    path: Path,
) -> None:
    """
    Validate that a path exists.
    """

    if not path.exists():
        raise ResourceNotFoundException(
            f"Path not found: {path}"
        )


def validate_directory(
    path: Path,
) -> None:
    """
    Validate that a directory exists.
    """

    validate_existing_path(path)

    if not path.is_dir():
        raise BadRequestException(
            f"{path} is not a directory."
        )


def validate_file(
    path: Path,
) -> None:
    """
    Validate that a file exists.
    """

    validate_existing_path(path)

    if not path.is_file():
        raise BadRequestException(
            f"{path} is not a file."
        )


__all__ = [
    # File Validators
    "validate_upload_file",
    "validate_file_extension",
    "validate_file_size",
    "validate_path_exists",

    # Dataset Validators
    "validate_dataset",
    "validate_target_column",

    # Pagination Validators
    "validate_page",
    "validate_page_size",

    # ML Validators
    "validate_problem_type",
    "validate_model_name",
    "validate_random_state",
    "validate_test_size",

    # Generic Validators
    "validate_positive_integer",
    "validate_non_negative_integer",
    "validate_string",
    "validate_uuid",
    "validate_existing_path",
    "validate_directory",
    "validate_file",
]
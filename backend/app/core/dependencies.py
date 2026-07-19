from __future__ import annotations

from typing import Annotated

from fastapi import Depends, Query

from app.core.config import settings
from app.schemas.common import PaginationMetadata


# ==========================================================
# Configuration Dependencies
# ==========================================================

def get_settings():
    """
    Return application settings singleton.
    """

    return settings


SettingsDependency = Annotated[
    type(settings),
    Depends(get_settings),
]


# ==========================================================
# Pagination Dependencies
# ==========================================================

def pagination_dependency(
    page: int = Query(
        default=1,
        ge=1,
        description="Page number.",
    ),
    page_size: int = Query(
        default=settings.DEFAULT_PAGE_SIZE,
        ge=1,
        le=settings.MAX_PAGE_SIZE,
        description="Items per page.",
    ),
) -> PaginationMetadata:
    """
    Create pagination metadata.
    """

    return PaginationMetadata(
        page=page,
        page_size=page_size,
        total_items=0,
        total_pages=0,
    )


PaginationDependency = Annotated[
    PaginationMetadata,
    Depends(pagination_dependency),
]
from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import Depends, File, Path, UploadFile

from app.core.validators import (
    validate_uuid,
)


# ==========================================================
# Resource Dependencies
# ==========================================================

def dataset_id_dependency(
    dataset_id: UUID = Path(
        ...,
        description="Dataset identifier.",
    ),
) -> UUID:
    """
    Resolve and validate a dataset identifier.
    """

    return dataset_id


DatasetIDDependency = Annotated[
    UUID,
    Depends(dataset_id_dependency),
]


def model_id_dependency(
    model_id: UUID = Path(
        ...,
        description="Model identifier.",
    ),
) -> UUID:
    """
    Resolve and validate a model identifier.
    """

    return model_id


ModelIDDependency = Annotated[
    UUID,
    Depends(model_id_dependency),
]


# ==========================================================
# Upload Dependencies
# ==========================================================

def upload_file_dependency(
    file: UploadFile = File(...),
) -> UploadFile:
    """
    Validate uploaded file.
    """

    validate_upload_file(file)

    return file


UploadFileDependency = Annotated[
    UploadFile,
    Depends(upload_file_dependency),
]


# ==========================================================
# UUID Dependency
# ==========================================================

def uuid_dependency(
    value: str,
) -> UUID:
    """
    Validate and convert UUID.
    """

    return validate_uuid(value)


UUIDDependency = Annotated[
    UUID,
    Depends(uuid_dependency),
]
from __future__ import annotations

from typing import Annotated

from fastapi import Depends, Request

from app.core.logging import get_logger
from app.services.dataset_service import DatasetService
from app.services.training_service import TrainingService


# ==========================================================
# Service Dependencies
# ==========================================================

def get_dataset_service() -> DatasetService:
    """
    Return DatasetService instance.
    """

    return DatasetService()


DatasetServiceDependency = Annotated[
    DatasetService,
    Depends(get_dataset_service),
]


def get_training_service() -> TrainingService:
    """
    Return TrainingService instance.
    """

    return TrainingService()


TrainingServiceDependency = Annotated[
    TrainingService,
    Depends(get_training_service),
]


# ==========================================================
# Request Dependencies
# ==========================================================

def get_request_id(
    request: Request,
) -> str:
    """
    Return request ID assigned by middleware.
    """

    return getattr(
        request.state,
        "request_id",
        "",
    )


RequestIDDependency = Annotated[
    str,
    Depends(get_request_id),
]


def get_logger_dependency():
    """
    Return application logger.
    """

    return get_logger(__name__)


LoggerDependency = Annotated[
    object,
    Depends(get_logger_dependency),
]


# ==========================================================
# Future Database Dependency
# ==========================================================

def get_db():
    """
    Placeholder for future database session.

    Replace with SQLAlchemy session or another
    persistence layer when database support
    is introduced.
    """

    yield None


DatabaseDependency = Annotated[
    object,
    Depends(get_db),
]


__all__ = [
    # Settings
    "get_settings",
    "SettingsDependency",

    # Pagination
    "pagination_dependency",
    "PaginationDependency",

    # Resource IDs
    "dataset_id_dependency",
    "DatasetIDDependency",
    "model_id_dependency",
    "ModelIDDependency",

    # Upload
    "upload_file_dependency",
    "UploadFileDependency",

    # UUID
    "uuid_dependency",
    "UUIDDependency",

    # Services
    "get_dataset_service",
    "DatasetServiceDependency",
    "get_training_service",
    "TrainingServiceDependency",

    # Request
    "get_request_id",
    "RequestIDDependency",
    "get_logger_dependency",
    "LoggerDependency",

    # Database
    "get_db",
    "DatabaseDependency",
]
from __future__ import annotations

from datetime import UTC
from datetime import datetime
from typing import Generic
from typing import TypeVar

from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import Field

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """
    Generic API response.

    Used by every router in the application.
    """

    model_config = ConfigDict(
        extra="forbid",
    )

    success: bool = Field(
        default=True,
        description="Indicates whether the request completed successfully.",
    )

    message: str = Field(
        default="Success",
        description="Human-readable response message.",
    )

    data: T | None = Field(
        default=None,
        description="Response payload.",
    )

    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        description="UTC timestamp.",
    )


class ErrorResponse(BaseModel):
    """
    Standard error response.
    """

    model_config = ConfigDict(
        extra="forbid",
    )

    success: bool = False

    error: str

    detail: str

    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
    )


from typing import Generic

from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import Field

from app.schemas.common import APIResponse
from app.schemas.common import T


class PaginationMetadata(BaseModel):
    """
    Pagination metadata shared across the application.
    """

    model_config = ConfigDict(
        extra="forbid",
    )

    total_records: int = Field(
        ...,
        ge=0,
        description="Total number of records.",
    )

    page: int = Field(
        ...,
        ge=1,
        description="Current page.",
    )

    page_size: int = Field(
        ...,
        ge=1,
        description="Records per page.",
    )

    total_pages: int = Field(
        ...,
        ge=0,
        description="Total pages.",
    )


class PaginatedResponse(
    APIResponse[list[T]],
    Generic[T],
):
    """
    Generic paginated response.
    """

    pagination: PaginationMetadata


class HealthResponse(BaseModel):
    """
    Generic application health response.
    """

    model_config = ConfigDict(
        extra="forbid",
    )

    service: str = Field(
        ...,
        description="Service name.",
    )

    status: str = Field(
        ...,
        description="Health status.",
    )

    version: str = Field(
        ...,
        description="Application version.",
    )

    timestamp: str = Field(
        ...,
        description="Health check timestamp.",
    )


class StatusResponse(BaseModel):
    """
    Generic status response.
    """

    model_config = ConfigDict(
        extra="forbid",
    )

    service: str

    status: str

    details: dict[str, str] | None = None


class MessageResponse(BaseModel):
    """
    Simple success message response.
    """

    model_config = ConfigDict(
        extra="forbid",
    )

    success: bool = True

    message: str


from datetime import UTC, datetime
from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """
    Standard API response.
    """

    model_config = ConfigDict(extra="forbid")

    success: bool = Field(
        default=True,
        description="Whether the request completed successfully.",
    )

    message: str = Field(
        default="Success",
        description="Human-readable response message.",
    )

    data: T | None = Field(
        default=None,
        description="Response payload.",
    )

    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
        description="UTC response timestamp.",
    )


class ErrorResponse(BaseModel):
    """
    Standard error response.
    """

    model_config = ConfigDict(extra="forbid")

    success: bool = False

    error: str

    detail: str

    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
    )


class PaginationMetadata(BaseModel):
    """
    Pagination metadata.
    """

    model_config = ConfigDict(extra="forbid")

    total_records: int = Field(..., ge=0)

    page: int = Field(..., ge=1)

    page_size: int = Field(..., ge=1)

    total_pages: int = Field(..., ge=0)


class PaginatedResponse(APIResponse[list[T]], Generic[T]):
    """
    Generic paginated response.
    """

    pagination: PaginationMetadata


class MessageResponse(BaseModel):
    """
    Simple message response.
    """

    model_config = ConfigDict(extra="forbid")

    success: bool = True

    message: str


class HealthResponse(BaseModel):
    """
    Health check response.
    """

    model_config = ConfigDict(extra="forbid")

    service: str

    status: str

    version: str

    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(UTC),
    )


class StatusResponse(BaseModel):
    """
    Generic service status.
    """

    model_config = ConfigDict(extra="forbid")

    service: str

    status: str

    details: dict[str, str] | None = None


__all__ = [
    "APIResponse",
    "ErrorResponse",
    "PaginationMetadata",
    "PaginatedResponse",
    "MessageResponse",
    "HealthResponse",
    "StatusResponse",
]
from __future__ import annotations

from datetime import UTC
from datetime import datetime
from typing import Any

from app.schemas.common import APIResponse


def success_response(
    *,
    data: Any = None,
    message: str = "Request completed successfully.",
) -> APIResponse[Any]:
    """
    Create a standard success response.

    Args:
        data:
            Response payload.

        message:
            Success message.

    Returns:
        APIResponse
    """

    return APIResponse(
        success=True,
        message=message,
        data=data,
        timestamp=datetime.now(UTC),
    )


def created_response(
    *,
    data: Any = None,
    message: str = "Resource created successfully.",
) -> APIResponse[Any]:
    """
    Create a resource-created response.
    """

    return APIResponse(
        success=True,
        message=message,
        data=data,
        timestamp=datetime.now(UTC),
    )


from datetime import UTC
from datetime import datetime
from math import ceil
from typing import Any

from app.schemas.common import (
    APIResponse,
    HealthResponse,
    MessageResponse,
    PaginatedResponse,
    PaginationMetadata,
)


def message_response(
    *,
    message: str,
) -> MessageResponse:
    """
    Create a simple message response.
    """

    return MessageResponse(
        success=True,
        message=message,
    )


def error_response(
    *,
    error: str,
    detail: str,
) -> dict[str, Any]:
    """
    Create a standardized error payload.

    This is mainly intended for custom exception handlers.
    """

    return {
        "success": False,
        "error": error,
        "detail": detail,
        "timestamp": datetime.now(UTC),
    }


def paginated_response(
    *,
    items: list[Any],
    total_records: int,
    page: int,
    page_size: int,
    message: str = "Request completed successfully.",
) -> PaginatedResponse[Any]:
    """
    Create a paginated API response.
    """

    total_pages = (
        ceil(total_records / page_size)
        if page_size > 0
        else 0
    )

    return PaginatedResponse(
        success=True,
        message=message,
        data=items,
        pagination=PaginationMetadata(
            total_records=total_records,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        ),
    )


def health_response(
    *,
    service: str,
    version: str,
    status: str = "healthy",
) -> HealthResponse:
    """
    Create a health response.
    """

    return HealthResponse(
        service=service,
        status=status,
        version=version,
        timestamp=datetime.now(UTC),
    )
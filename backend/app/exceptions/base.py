"""
Base exception classes for the AI Data Analyst backend.

All custom exceptions should inherit from AppException.
"""

from __future__ import annotations

from typing import Any, Dict, Optional


class AppException(Exception):
    """
    Base application exception.

    Every custom exception should inherit from this class.
    """

    def __init__(
        self,
        message: str,
        *,
        status_code: int = 400,
        error_code: str = "APP_ERROR",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(message)

        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "message": self.message,
            "error_code": self.error_code,
            "details": self.details,
        }


class ValidationException(AppException):
    def __init__(
        self,
        message: str = "Validation failed.",
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(
            message=message,
            status_code=422,
            error_code="VALIDATION_ERROR",
            details=details,
        )


class NotFoundException(AppException):
    def __init__(
        self,
        resource: str,
        details: Optional[Dict[str, Any]] = None,
    ) -> None:
        super().__init__(
            message=f"{resource} not found.",
            status_code=404,
            error_code="NOT_FOUND",
            details=details,
        )


class UnauthorizedException(AppException):
    def __init__(
        self,
        message: str = "Unauthorized.",
    ) -> None:
        super().__init__(
            message=message,
            status_code=401,
            error_code="UNAUTHORIZED",
        )


class ForbiddenException(AppException):
    def __init__(
        self,
        message: str = "Forbidden.",
    ) -> None:
        super().__init__(
            message=message,
            status_code=403,
            error_code="FORBIDDEN",
        )


class ConflictException(AppException):
    def __init__(
        self,
        message: str = "Resource conflict.",
    ) -> None:
        super().__init__(
            message=message,
            status_code=409,
            error_code="CONFLICT",
        )


class InternalServerException(AppException):
    def __init__(
        self,
        message: str = "Internal server error.",
    ) -> None:
        super().__init__(
            message=message,
            status_code=500,
            error_code="INTERNAL_SERVER_ERROR",
        )
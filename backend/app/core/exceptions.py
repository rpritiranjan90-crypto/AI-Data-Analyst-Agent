from __future__ import annotations

from typing import Any

from fastapi import HTTPException
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.core.responses import error_response


class AppException(Exception):
    """
    Base application exception.
    """

    def __init__(
        self,
        message: str,
        *,
        status_code: int = 400,
        details: dict[str, Any] | None = None,
    ) -> None:

        self.message = message
        self.status_code = status_code
        self.details = details or {}

        super().__init__(message)


class ResourceNotFoundException(AppException):
    """
    Raised when a requested resource does not exist.
    """

    def __init__(
        self,
        message: str = "Resource not found.",
    ) -> None:

        super().__init__(
            message=message,
            status_code=404,
        )


class BadRequestException(AppException):
    """
    Raised for invalid requests.
    """

    def __init__(
        self,
        message: str = "Invalid request.",
    ) -> None:

        super().__init__(
            message=message,
            status_code=400,
        )


class UnauthorizedException(AppException):
    """
    Raised for authentication failures.
    """

    def __init__(
        self,
        message: str = "Unauthorized.",
    ) -> None:

        super().__init__(
            message=message,
            status_code=401,
        )


class ForbiddenException(AppException):
    """
    Raised for authorization failures.
    """

    def __init__(
        self,
        message: str = "Forbidden.",
    ) -> None:

        super().__init__(
            message=message,
            status_code=403,
        )


import logging

from fastapi import HTTPException
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError

logger = logging.getLogger(__name__)


async def app_exception_handler(
    request: Request,
    exc: AppException,
) -> JSONResponse:
    """
    Handle application exceptions.
    """

    logger.warning(
        "Application exception: %s",
        exc.message,
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.__class__.__name__,
            "message": exc.message,
            "details": exc.details,
        },
    )


async def http_exception_handler(
    request: Request,
    exc: HTTPException,
) -> JSONResponse:
    """
    Handle FastAPI HTTP exceptions.
    """

    logger.warning(
        "HTTP exception: %s",
        exc.detail,
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": "HTTPException",
            "message": exc.detail,
        },
    )


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    """
    Handle request validation errors.
    """

    logger.warning(
        "Request validation failed."
    )

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "ValidationError",
            "message": "Request validation failed.",
            "details": exc.errors(),
        },
    )


async def pydantic_validation_handler(
    request: Request,
    exc: ValidationError,
) -> JSONResponse:
    """
    Handle internal Pydantic validation errors.
    """

    logger.exception(
        "Pydantic validation error."
    )

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "PydanticValidationError",
            "message": "Internal validation error.",
            "details": exc.errors(),
        },
    )


import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


async def unhandled_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    """
    Handle all unexpected exceptions.

    This should be the final fallback handler.
    """

    logger.exception(
        "Unhandled exception occurred."
    )

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "InternalServerError",
            "message": (
                "An unexpected error occurred."
            ),
        },
    )


def register_exception_handlers(
    app: FastAPI,
) -> None:
    """
    Register all application exception handlers.

    Args:
        app:
            FastAPI application instance.
    """

    app.add_exception_handler(
        AppException,
        app_exception_handler,
    )

    app.add_exception_handler(
        HTTPException,
        http_exception_handler,
    )

    app.add_exception_handler(
        RequestValidationError,
        validation_exception_handler,
    )

    app.add_exception_handler(
        ValidationError,
        pydantic_validation_handler,
    )

    app.add_exception_handler(
        Exception,
        unhandled_exception_handler,
    )


__all__ = [
    "AppException",
    "BadRequestException",
    "ForbiddenException",
    "ResourceNotFoundException",
    "UnauthorizedException",
    "register_exception_handlers",
]
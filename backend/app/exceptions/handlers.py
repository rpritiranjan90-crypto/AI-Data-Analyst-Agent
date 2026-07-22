"""
Global exception handlers for the AI Data Analyst backend.
"""

from __future__ import annotations

import traceback

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.common.responses import APIResponse
from app.exceptions.base import AppException


def register_exception_handlers(app: FastAPI) -> None:
    """
    Register all global exception handlers.
    """

    @app.exception_handler(AppException)
    async def app_exception_handler(
        request: Request,
        exc: AppException,
    ):
        return JSONResponse(
            status_code=exc.status_code,
            content=APIResponse.failure(
                message=exc.message,
                errors=[exc.error_code],
                metadata={
                    "details": exc.details,
                    "path": str(request.url.path),
                },
            ),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ):
        errors = []

        for error in exc.errors():
            errors.append(
                {
                    "field": ".".join(map(str, error["loc"])),
                    "message": error["msg"],
                    "type": error["type"],
                }
            )

        return JSONResponse(
            status_code=422,
            content=APIResponse.failure(
                message="Request validation failed.",
                errors=["VALIDATION_ERROR"],
                metadata={
                    "validation_errors": errors,
                    "path": str(request.url.path),
                },
            ),
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(
        request: Request,
        exc: Exception,
    ):
        traceback.print_exc()

        return JSONResponse(
            status_code=500,
            content=APIResponse.failure(
                message="Unexpected server error.",
                errors=[str(exc)],
                metadata={
                    "exception": exc.__class__.__name__,
                    "path": str(request.url.path),
                },
            ),
        )
"""
Standard API response models and builders.

All routes, workflows and services should use these helpers to return
consistent responses across the application.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional


class APIResponse:
    """
    Standard API response builder.

    Response Format:

    {
        "success": bool,
        "message": str,
        "data": {},
        "errors": [],
        "warnings": [],
        "metadata": {}
    }
    """

    @staticmethod
    def success(
        message: str = "Operation completed successfully.",
        data: Optional[Any] = None,
        metadata: Optional[Dict[str, Any]] = None,
        warnings: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        return {
            "success": True,
            "message": message,
            "data": data if data is not None else {},
            "errors": [],
            "warnings": warnings or [],
            "metadata": {
                "timestamp": datetime.utcnow().isoformat() + "Z",
                **(metadata or {}),
            },
        }

    @staticmethod
    def failure(
        message: str = "Operation failed.",
        errors: Optional[List[str]] = None,
        data: Optional[Any] = None,
        metadata: Optional[Dict[str, Any]] = None,
        warnings: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        return {
            "success": False,
            "message": message,
            "data": data if data is not None else {},
            "errors": errors or [],
            "warnings": warnings or [],
            "metadata": {
                "timestamp": datetime.utcnow().isoformat() + "Z",
                **(metadata or {}),
            },
        }

    @staticmethod
    def validation_error(
        errors: List[str],
    ) -> Dict[str, Any]:
        return APIResponse.failure(
            message="Validation failed.",
            errors=errors,
        )

    @staticmethod
    def not_found(
        resource: str,
    ) -> Dict[str, Any]:
        return APIResponse.failure(
            message=f"{resource} not found.",
            errors=[f"{resource} does not exist."],
        )

    @staticmethod
    def server_error(
        error: Exception,
    ) -> Dict[str, Any]:
        return APIResponse.failure(
            message="Internal server error.",
            errors=[str(error)],
        )
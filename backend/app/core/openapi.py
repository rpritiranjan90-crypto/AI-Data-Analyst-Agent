from __future__ import annotations

from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

from app.core.config import settings


def generate_openapi_schema(
    app: FastAPI,
) -> dict:
    """
    Generate the application's OpenAPI schema.

    The generated schema is cached after the first
    invocation for better performance.
    """

    if app.openapi_schema:
        return app.openapi_schema

    schema = get_openapi(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="""
Enterprise-grade AI Data Analyst API.

Features
--------
- Dataset Upload
- Data Cleaning
- Data Validation
- Feature Engineering
- Machine Learning
- AutoML
- Prediction
- Explainability
- Recommendation Engine
- Model Registry

Built with FastAPI.
""",
        routes=app.routes,
    )

    app.openapi_schema = schema

    return app.openapi_schema


def register_openapi(
    app: FastAPI,
) -> None:
    """
    Register the custom OpenAPI generator.
    """

    app.openapi = lambda: generate_openapi_schema(app)
from __future__ import annotations

from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

from app.core.config import settings


def generate_openapi_schema(
    app: FastAPI,
) -> dict:
    """
    Generate and cache the OpenAPI schema.
    """

    if app.openapi_schema:
        return app.openapi_schema

    schema = get_openapi(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        summary="Enterprise AI Data Analyst API",
        description="""
A production-ready AI Data Analyst platform.

## Features

- Dataset Upload
- Data Cleaning
- Data Validation
- Exploratory Data Analysis (EDA)
- Feature Engineering
- Machine Learning
- AutoML
- Prediction
- Explainability
- Model Registry
- Recommendation Engine

Designed using enterprise architecture and FastAPI.
""",
        routes=app.routes,
        contact={
            "name": "AI Data Analyst Team",
            "email": "support@example.com",
            "url": "https://example.com",
        },
        license_info={
            "name": "MIT License",
            "url": "https://opensource.org/licenses/MIT",
        },
        servers=[
            {
                "url": "http://localhost:8000",
                "description": "Development",
            },
            {
                "url": "https://staging.example.com",
                "description": "Staging",
            },
            {
                "url": "https://api.example.com",
                "description": "Production",
            },
        ],
    )

    schema["tags"] = [
        {
            "name": "Health",
            "description": "Application health monitoring.",
        },
        {
            "name": "Upload",
            "description": "Dataset upload operations.",
        },
        {
            "name": "Cleaning",
            "description": "Dataset cleaning operations.",
        },
        {
            "name": "Analysis",
            "description": "Data analysis and EDA.",
        },
        {
            "name": "Machine Learning",
            "description": "Training and evaluation.",
        },
        {
            "name": "Prediction",
            "description": "Model prediction endpoints.",
        },
        {
            "name": "AutoML",
            "description": "Automatic model selection.",
        },
        {
            "name": "Recommendation",
            "description": "AI-powered recommendations.",
        },
        {
            "name": "Explainability",
            "description": "Model explainability tools.",
        },
    ]

    schema["externalDocs"] = {
        "description": "Project Documentation",
        "url": "https://docs.example.com",
    }

    app.openapi_schema = schema

    return app.openapi_schema
from __future__ import annotations

from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

from app.core.config import settings


def generate_openapi_schema(
    app: FastAPI,
) -> dict:
    """
    Generate and cache the application's OpenAPI schema.
    """

    if app.openapi_schema is not None:
        return app.openapi_schema

    schema = get_openapi(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        summary="Enterprise AI Data Analyst API",
        description="Production-ready AI Data Analyst Platform.",
        routes=app.routes,
    )

    # ------------------------------------------------------
    # Security Schemes (Future Authentication)
    # ------------------------------------------------------

    schema.setdefault("components", {})
    schema["components"].setdefault(
        "securitySchemes",
        {},
    )

    schema["components"]["securitySchemes"][
        "BearerAuth"
    ] = {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": (
            "JWT authentication. "
            "Will be enabled when authentication "
            "module is implemented."
        ),
    }

    # ------------------------------------------------------
    # Standard Error Responses
    # ------------------------------------------------------

    schema["components"].setdefault(
        "responses",
        {},
    )

    schema["components"]["responses"].update(
        {
            "BadRequest": {
                "description": "Bad Request",
            },
            "Unauthorized": {
                "description": "Unauthorized",
            },
            "Forbidden": {
                "description": "Forbidden",
            },
            "NotFound": {
                "description": "Resource Not Found",
            },
            "ValidationError": {
                "description": "Validation Error",
            },
            "InternalServerError": {
                "description": (
                    "Internal Server Error"
                ),
            },
        }
    )

    app.openapi_schema = schema

    return schema


def register_openapi(
    app: FastAPI,
) -> None:
    """
    Register the custom OpenAPI schema generator.
    """

    app.openapi = (
        lambda: generate_openapi_schema(app)
    )


__all__ = [
    "generate_openapi_schema",
    "register_openapi",
]
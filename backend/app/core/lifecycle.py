from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.config import settings
from app.core.logging import (
    configure_logging,
)
from app.core.logging import (
    get_logger,
)
from app.core.logging import (
    log_shutdown,
)
from app.core.logging import (
    log_startup,
)

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(
    app: FastAPI,
):
    """
    Application lifespan manager.

    Responsible for startup and shutdown
    initialization.
    """

    configure_logging()

    logger.info(
        "Initializing application..."
    )

    settings.create_directories()

    log_startup()

    try:

        yield

    finally:

        log_shutdown()
from __future__ import annotations

from fastapi import FastAPI

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger(__name__)


async def initialize_application() -> None:
    """
    Initialize application resources.
    """

    logger.info(
        "Creating application directories..."
    )

    settings.create_directories()

    logger.info(
        "Application directories initialized."
    )

    logger.info(
        "Application initialization completed."
    )


async def cleanup_application() -> None:
    """
    Cleanup application resources.
    """

    logger.info(
        "Starting application cleanup..."
    )

    # Future:
    # - Close database connections
    # - Close Redis connections
    # - Shutdown thread pools
    # - Clear temporary resources

    logger.info(
        "Application cleanup completed."
    )


async def startup_health_check() -> None:
    """
    Perform startup health checks.
    """

    logger.info(
        "Running startup health checks..."
    )

    required_directories = (
        settings.UPLOAD_DIRECTORY,
        settings.DATASET_DIRECTORY,
        settings.CACHE_DIRECTORY,
        settings.MODEL_DIRECTORY,
        settings.EXPORT_DIRECTORY,
        settings.LOG_DIRECTORY,
    )

    for directory in required_directories:

        if not directory.exists():

            raise RuntimeError(
                f"Required directory not found: "
                f"{directory}"
            )

    logger.info(
        "Startup health checks passed."
    )
@asynccontextmanager
async def lifespan(
    app: FastAPI,
):
    """
    Application lifespan manager.

    Handles startup and shutdown events for
    the application.
    """

    logger.info(
        "Starting application lifecycle..."
    )

    try:

        await initialize_application()

        await startup_health_check()

        logger.info(
            "Application startup completed successfully."
        )

        yield

    except Exception:

        logger.exception(
            "Application startup failed."
        )

        raise

    finally:

        await cleanup_application()

        logger.info(
            "Application shutdown completed successfully."
        )


__all__ = [
    "lifespan",
    "initialize_application",
    "startup_health_check",
    "cleanup_application",
]
from __future__ import annotations

import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

from app.core.config import settings

LOG_FORMAT = (
    "%(asctime)s | "
    "%(levelname)-8s | "
    "%(name)s | "
    "%(filename)s:%(lineno)d | "
    "%(message)s"
)

DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


def _create_console_handler() -> logging.Handler:
    """
    Create console log handler.
    """

    handler = logging.StreamHandler()

    handler.setFormatter(
        logging.Formatter(
            fmt=LOG_FORMAT,
            datefmt=DATE_FORMAT,
        )
    )

    return handler


def _create_file_handler() -> logging.Handler:
    """
    Create rotating file handler.
    """

    log_file = (
        Path(settings.LOG_DIRECTORY)
        / settings.LOG_FILE_NAME
    )

    handler = RotatingFileHandler(
        filename=log_file,
        maxBytes=settings.LOG_ROTATION_SIZE_MB
        * 1024
        * 1024,
        backupCount=settings.LOG_BACKUP_COUNT,
        encoding="utf-8",
    )

    handler.setFormatter(
        logging.Formatter(
            fmt=LOG_FORMAT,
            datefmt=DATE_FORMAT,
        )
    )

    return handler


import logging


_CONFIGURED = False


def configure_logging() -> None:
    """
    Configure application logging.

    This function is idempotent and can safely be
    called multiple times.
    """

    global _CONFIGURED

    if _CONFIGURED:
        return

    root_logger = logging.getLogger()

    root_logger.setLevel(settings.LOG_LEVEL.upper())

    root_logger.handlers.clear()

    root_logger.addHandler(
        _create_console_handler()
    )

    root_logger.addHandler(
        _create_file_handler()
    )

    _CONFIGURED = True


def get_logger(
    name: str,
) -> logging.Logger:
    """
    Return a configured logger.

    Args:
        name:
            Logger name.

    Returns:
        Configured logger instance.
    """

    configure_logging()

    logger = logging.getLogger(name)

    logger.propagate = True

    return logger


def set_log_level(
    level: str,
) -> None:
    """
    Update the root logger level.

    Args:
        level:
            Logging level.
    """

    logging.getLogger().setLevel(
        level.upper()
    )


import logging
from typing import Any

logger = get_logger(__name__)


def log_request(
    *,
    method: str,
    path: str,
    client_ip: str | None = None,
) -> None:
    """
    Log an incoming HTTP request.
    """

    logger.info(
        "HTTP Request | method=%s | path=%s | client=%s",
        method,
        path,
        client_ip or "unknown",
    )


def log_exception(
    exception: Exception,
    *,
    context: dict[str, Any] | None = None,
) -> None:
    """
    Log an exception with optional context.
    """

    logger.exception(
        "Exception occurred | %s | context=%s",
        exception,
        context or {},
    )


def log_startup() -> None:
    """
    Log application startup.
    """

    logger.info(
        "Application started successfully."
    )


def log_shutdown() -> None:
    """
    Log application shutdown.
    """

    logger.info(
        "Application shutdown completed."
    )


__all__ = [
    "configure_logging",
    "get_logger",
    "set_log_level",
    "log_request",
    "log_exception",
    "log_startup",
    "log_shutdown",
]
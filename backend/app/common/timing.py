"""
Timing utilities for the AI Data Analyst backend.
"""

from __future__ import annotations

import time
from functools import wraps
from typing import Any, Callable

from app.common.logger import get_logger

logger = get_logger(__name__)


def measure_time(func: Callable) -> Callable:
    """
    Decorator to measure execution time of synchronous functions.
    """

    @wraps(func)
    def wrapper(*args: Any, **kwargs: Any):
        start = time.perf_counter()

        try:
            return func(*args, **kwargs)

        finally:
            elapsed = time.perf_counter() - start

            logger.info(
                "%s executed in %.4f seconds",
                func.__qualname__,
                elapsed,
            )

    return wrapper


def measure_async_time(func: Callable) -> Callable:
    """
    Decorator to measure execution time of asynchronous functions.
    """

    @wraps(func)
    async def wrapper(*args: Any, **kwargs: Any):
        start = time.perf_counter()

        try:
            return await func(*args, **kwargs)

        finally:
            elapsed = time.perf_counter() - start

            logger.info(
                "%s executed in %.4f seconds",
                func.__qualname__,
                elapsed,
            )

    return wrapper
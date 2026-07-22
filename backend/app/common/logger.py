"""
Centralized logging configuration for the AI Data Analyst backend.
"""

from __future__ import annotations

import logging
import os
from pathlib import Path


# ----------------------------------------------------
# Log Directory
# ----------------------------------------------------

LOG_DIR = Path("logs")
LOG_DIR.mkdir(exist_ok=True)

LOG_FILE = LOG_DIR / "application.log"


# ----------------------------------------------------
# Logger
# ----------------------------------------------------

logger = logging.getLogger("ai_data_analyst")

if not logger.handlers:

    logger.setLevel(logging.INFO)

    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
    )

    # Console Handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    # File Handler
    file_handler = logging.FileHandler(
        LOG_FILE,
        encoding="utf-8",
    )
    file_handler.setFormatter(formatter)

    logger.addHandler(console_handler)
    logger.addHandler(file_handler)

    logger.propagate = False


# ----------------------------------------------------
# Helper Functions
# ----------------------------------------------------

def get_logger(name: str | None = None) -> logging.Logger:
    """
    Return the shared application logger.

    Parameters
    ----------
    name : Optional[str]

    Returns
    -------
    logging.Logger
    """

    if name:
        return logger.getChild(name)

    return logger
import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path

from app.config import LOG_LEVEL


# ==========================
# Logs Folder
# ==========================

LOG_FOLDER = Path("logs")
LOG_FOLDER.mkdir(exist_ok=True)


# ==========================
# Logger
# ==========================

logger = logging.getLogger("AIDataAnalyst")

logger.setLevel(LOG_LEVEL)


if not logger.handlers:

    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
    )

    # --------------------------
    # Console Logger
    # --------------------------

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    # --------------------------
    # File Logger
    # --------------------------

    file_handler = RotatingFileHandler(
        LOG_FOLDER / "application.log",
        maxBytes=5 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8"
    )

    file_handler.setFormatter(formatter)

    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
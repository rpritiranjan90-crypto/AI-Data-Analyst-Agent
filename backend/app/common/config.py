"""
Application configuration for the AI Data Analyst backend.

This module centralizes all configurable application settings.
"""

from __future__ import annotations

from pathlib import Path


class Settings:
    """
    Centralized application settings.
    """

    # ======================================================
    # API
    # ======================================================

    APP_NAME: str = "AI Data Analyst Agent"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"

    # ======================================================
    # Base Directory
    # ======================================================

    BASE_DIR: Path = Path(__file__).resolve().parents[2]

    # ======================================================
    # Project Directories
    # ======================================================

    UPLOAD_DIR: Path = BASE_DIR / "uploads"
    REPORT_DIR: Path = BASE_DIR / "reports"
    CHART_DIR: Path = BASE_DIR / "generated_charts"
    MODEL_DIR: Path = BASE_DIR / "saved_models"
    LOG_DIR: Path = BASE_DIR / "logs"
    METADATA_DIR: Path = BASE_DIR / "metadata"

    # ======================================================
    # Logging
    # ======================================================

    LOG_LEVEL: str = "INFO"
    LOG_FILE: Path = LOG_DIR / "application.log"

    # ======================================================
    # Dataset
    # ======================================================

    MAX_FILE_SIZE_MB: int = 100

    ALLOWED_EXTENSIONS: tuple[str, ...] = (
        ".csv",
        ".xlsx",
        ".xls",
        ".json",
    )

    # ======================================================
    # Machine Learning
    # ======================================================

    DEFAULT_RANDOM_STATE: int = 42
    DEFAULT_TEST_SIZE: float = 0.20
    DEFAULT_CV: int = 5

    # ======================================================
    # CORS
    # ======================================================

    ALLOW_ORIGINS: tuple[str, ...] = ("*",)
    ALLOW_METHODS: tuple[str, ...] = ("*",)
    ALLOW_HEADERS: tuple[str, ...] = ("*",)
    ALLOW_CREDENTIALS: bool = True

    # ======================================================
    # Create Required Directories
    # ======================================================

    @classmethod
    def create_directories(cls) -> None:
        """
        Create all required project directories.
        """

        directories = (
            cls.UPLOAD_DIR,
            cls.REPORT_DIR,
            cls.CHART_DIR,
            cls.MODEL_DIR,
            cls.LOG_DIR,
            cls.METADATA_DIR,
        )

        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)


# ======================================================
# Global Settings Instance
# ======================================================

settings = Settings()

# Create required directories automatically
settings.create_directories()
from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    """
    Application settings.

    Configuration is loaded from environment variables
    and the project's .env file.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ======================================================
    # Application
    # ======================================================

    APP_NAME: str = Field(
        default="AI Data Analyst Agent",
    )

    APP_VERSION: str = Field(
        default="1.0.0",
    )

    APP_DESCRIPTION: str = Field(
        default="Enterprise AI Data Analyst Backend",
    )

    DEBUG: bool = Field(
        default=False,
    )

    ENVIRONMENT: str = Field(
        default="development",
    )

    API_PREFIX: str = Field(
        default="/api/v1",
    )

    SECRET_KEY: str = Field(
        default="CHANGE_ME_IN_PRODUCTION",
    )

    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=60,
        ge=1,
    )

    # ======================================================
    # CORS
    # ======================================================

    CORS_ALLOW_CREDENTIALS: bool = Field(
        default=True,
    )

    CORS_ALLOW_ORIGINS: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:8000",
        ],
    )

    CORS_ALLOW_METHODS: list[str] = Field(
        default_factory=lambda: ["*"],
    )

    CORS_ALLOW_HEADERS: list[str] = Field(
        default_factory=lambda: ["*"],
    )

    # ======================================================
    # Upload Configuration
    # ======================================================

    UPLOAD_DIRECTORY: Path = Field(
        default=BASE_DIR / "uploads",
    )

    MAX_UPLOAD_SIZE_MB: int = Field(
        default=100,
        ge=1,
    )

    ALLOWED_FILE_EXTENSIONS: list[str] = Field(
        default_factory=lambda: [
            ".csv",
            ".xlsx",
            ".xls",
            ".json",
            ".parquet",
        ],
    )

    # ======================================================
    # Storage Directories
    # ======================================================

    DATASET_DIRECTORY: Path = Field(
        default=BASE_DIR / "datasets",
    )

    METADATA_DIRECTORY: Path = Field(
        default=BASE_DIR / "metadata",
    )

    CACHE_DIRECTORY: Path = Field(
        default=BASE_DIR / "cache",
    )

    MODEL_DIRECTORY: Path = Field(
        default=BASE_DIR / "models",
    )

    EXPORT_DIRECTORY: Path = Field(
        default=BASE_DIR / "exports",
    )

    # ======================================================
    # Logging
    # ======================================================

    LOG_LEVEL: str = Field(
        default="INFO",
    )

    LOG_DIRECTORY: Path = Field(
        default=BASE_DIR / "logs",
    )

    LOG_FILE_NAME: str = Field(
        default="application.log",
    )

    LOG_ROTATION_SIZE_MB: int = Field(
        default=10,
        ge=1,
    )

    LOG_BACKUP_COUNT: int = Field(
        default=5,
        ge=1,
    )

    # ======================================================
    # Machine Learning
    # ======================================================

    DEFAULT_TEST_SIZE: float = Field(
        default=0.20,
        gt=0.0,
        lt=1.0,
    )

    DEFAULT_RANDOM_STATE: int = Field(
        default=42,
    )

    DEFAULT_CROSS_VALIDATION_FOLDS: int = Field(
        default=5,
        ge=2,
    )

    DEFAULT_SCALER: str = Field(
        default="standard",
    )

    DEFAULT_ENCODER: str = Field(
        default="onehot",
    )

    ENABLE_AUTOML: bool = Field(
        default=True,
    )

    ENABLE_EXPLAINABILITY: bool = Field(
        default=True,
    )

    # ======================================================
    # Pagination
    # ======================================================

    DEFAULT_PAGE_SIZE: int = Field(
        default=25,
        ge=1,
    )

    MAX_PAGE_SIZE: int = Field(
        default=100,
        ge=1,
    )

    # ======================================================
    # API Documentation
    # ======================================================

    DOCS_URL: str | None = Field(
        default="/docs",
    )

    REDOC_URL: str | None = Field(
        default="/redoc",
    )

    OPENAPI_URL: str | None = Field(
        default="/openapi.json",
    )

    # ======================================================
    # Utility
    # ======================================================

    def create_directories(self) -> None:
        """
        Create all required directories.
        """

        directories = (
            self.UPLOAD_DIRECTORY,
            self.DATASET_DIRECTORY,
            self.METADATA_DIRECTORY,
            self.CACHE_DIRECTORY,
            self.MODEL_DIRECTORY,
            self.EXPORT_DIRECTORY,
            self.LOG_DIRECTORY,
        )

        for directory in directories:
            directory.mkdir(
                parents=True,
                exist_ok=True,
            )


@lru_cache
def get_settings() -> Settings:
    """
    Return the singleton Settings instance.
    """

    settings = Settings()
    settings.create_directories()
    return settings


settings = get_settings()


__all__ = [
    "Settings",
    "settings",
    "get_settings",
]
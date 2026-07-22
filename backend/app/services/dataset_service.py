from __future__ import annotations

from pathlib import Path
from typing import Any

import pandas as pd

from app.common.logger import get_logger
from app.common.timing import measure_time

from app.core.constants import DATASET_METADATA_CATEGORY
from app.core.exceptions import ResourceNotFoundException

from app.repositories.dataset_repository import DatasetRepository
from app.repositories.metadata_repository import MetadataRepository

from app.schemas.dataset import DatasetAnalysisResult

from app.services.dataset_cache import DatasetCache
from app.services.dataset_loader_service import DatasetLoaderService
from app.services.dataset_metadata_service import (
    DatasetMetadataService,
)
from app.services.dataset_profile_service import (
    DatasetProfileService,
)
from app.services.dataset_statistics_service import (
    DatasetStatisticsService,
)

logger = get_logger(__name__)


class DatasetService:
    """
    Enterprise Dataset Service.

    Responsibilities
    ----------------
    - Load datasets
    - Cache datasets
    - Generate metadata
    - Generate profile
    - Generate statistics
    - Persist metadata
    """

    def __init__(
        self,
        loader: DatasetLoaderService | None = None,
        dataset_repository: DatasetRepository | None = None,
        metadata_repository: MetadataRepository | None = None,
        metadata_service: DatasetMetadataService | None = None,
        profile_service: DatasetProfileService | None = None,
        statistics_service: DatasetStatisticsService | None = None,
    ) -> None:

        self._loader = loader or DatasetLoaderService()

        self._dataset_repository = (
            dataset_repository
            or DatasetRepository()
        )

        self._metadata_repository = (
            metadata_repository
            or MetadataRepository()
        )

        self._metadata_service = (
            metadata_service
            or DatasetMetadataService()
        )

        self._profile_service = (
            profile_service
            or DatasetProfileService()
        )

        self._statistics_service = (
            statistics_service
            or DatasetStatisticsService()
        )

    @measure_time
    def load_dataset(
        self,
        file_path: str | Path,
        **kwargs: Any,
    ) -> DatasetAnalysisResult:
        """
        Load a dataset, cache it, generate metadata,
        profile and statistics, then persist metadata.
        """

        logger.info("Loading dataset: %s", file_path)

        dataframe = self._loader.load(
            file_path=file_path,
            **kwargs,
        )

        DatasetCache.set_dataset(
            dataframe=dataframe,
            filename=Path(file_path).name,
        )

        logger.info("Dataset cached successfully.")

        metadata = self._metadata_service.generate(
            dataframe=dataframe,
            file_path=str(file_path),
        )

        logger.info("Dataset metadata generated.")

        profile = self._profile_service.generate(
            dataframe,
        )

        logger.info("Dataset profile generated.")

        statistics = self._statistics_service.generate(
            dataframe,
        )

        logger.info("Dataset statistics generated.")

        self._metadata_repository.save(
            category=DATASET_METADATA_CATEGORY,
            entity=metadata,
        )

        logger.info("Dataset metadata saved.")

        return DatasetAnalysisResult(
            metadata=metadata,
            profile=profile,
            statistics=statistics,
        )

    def get_dataset(self) -> pd.DataFrame:
        """
        Return the currently loaded dataset.
        """

        dataset = DatasetCache.get_dataset()

        if dataset is None:
            raise ResourceNotFoundException(
                "No dataset is currently loaded."
            )

        return dataset

    def has_dataset(self) -> bool:
        """
        Check whether a dataset is currently loaded.
        """
        return DatasetCache.has_dataset()

    def clear_dataset(self) -> None:
        """
        Clear the active dataset cache.
        """

        DatasetCache.clear()

        logger.info("Dataset cache cleared.")

    def list_datasets(self) -> list[dict]:
        """
        Return all available datasets.
        """

        return self._dataset_repository.list()

    def delete_dataset(
        self,
        dataset_id: str,
    ) -> None:
        """
        Delete a dataset and its metadata.
        """

        logger.info(
            "Deleting dataset with ID: %s",
            dataset_id,
        )

        metadata = self._dataset_repository.get(
            dataset_id
        )

        self._dataset_repository.delete(
            dataset_id
        )

        self._metadata_repository.delete(
            category=DATASET_METADATA_CATEGORY,
            identifier=metadata["id"],
        )

        if DatasetCache.has_dataset():
            DatasetCache.clear()

            logger.info("Dataset cache cleared.")

        logger.info(
            "Dataset %s deleted successfully.",
            dataset_id,
        )


__all__ = [
    "DatasetService",
]
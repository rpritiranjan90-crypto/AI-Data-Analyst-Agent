from __future__ import annotations

from pathlib import Path
from typing import Any

import pandas as pd

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

    def load_dataset(
        self,
        file_path: str | Path,
        **kwargs: Any,
    ) -> DatasetAnalysisResult:

        dataframe = self._loader.load(
            file_path=file_path,
            **kwargs,
        )

        DatasetCache.set_dataset(
            dataframe=dataframe,
            filename=Path(file_path).name,
        )

        metadata = self._metadata_service.generate(
            dataframe=dataframe,
            file_path=str(file_path),
        )

        profile = self._profile_service.generate(
            dataframe,
        )

        statistics = self._statistics_service.generate(
            dataframe,
        )

        self._metadata_repository.save(
            category=DATASET_METADATA_CATEGORY,
            entity=metadata,
        )

        return DatasetAnalysisResult(
            metadata=metadata,
            profile=profile,
            statistics=statistics,
        )

    def get_dataset(self) -> pd.DataFrame:

        dataset = DatasetCache.get_dataset()

        if dataset is None:
            raise ResourceNotFoundException(
                "No dataset is currently loaded."
            )

        return dataset

    def has_dataset(self) -> bool:
        return DatasetCache.has_dataset()

    def clear_dataset(self) -> None:
        DatasetCache.clear()

    def list_datasets(self) -> list[dict]:
        return self._dataset_repository.list()

    def delete_dataset(
        self,
        dataset_id: str,
    ) -> None:

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


__all__ = [
    "DatasetService",
]
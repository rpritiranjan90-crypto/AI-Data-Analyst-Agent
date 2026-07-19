from __future__ import annotations

import json
import shutil
from pathlib import Path
from uuid import uuid4

from app.core.config import settings
from app.core.exceptions import ResourceNotFoundException
from app.repositories.base_repository import BaseRepository


class DatasetRepository(BaseRepository[dict]):
    """
    Repository responsible for dataset persistence.

    Stores:
        • Dataset metadata
        • Dataset folders
    """

    def __init__(self) -> None:
        super().__init__(
            Path(settings.DATASET_DIRECTORY)
        )

        self._metadata_directory = Path(
            settings.METADATA_DIRECTORY
        )

        self.base_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        self._metadata_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

    @property
    def metadata_directory(
        self,
    ) -> Path:
        """
        Metadata storage directory.
        """

        return self._metadata_directory

    def _metadata_file(
        self,
        dataset_id: str,
    ) -> Path:
        """
        Return metadata JSON path.
        """

        return (
            self.metadata_directory
            / f"{dataset_id}.json"
        )

    def _dataset_directory(
        self,
        dataset_id: str,
    ) -> Path:
        """
        Return dataset directory.
        """

        return (
            self.base_directory
            / dataset_id
        )

    def exists(
        self,
        identifier: str,
    ) -> bool:
        """
        Check whether dataset exists.
        """

        return self._dataset_directory(
            identifier
        ).exists()

    def get(
        self,
        identifier: str,
    ) -> dict:
        """
        Return dataset metadata.
        """

        metadata_file = self._metadata_file(
            identifier
        )

        if not metadata_file.exists():
            raise ResourceNotFoundException(
                f"Dataset '{identifier}' not found."
            )

        with metadata_file.open(
            "r",
            encoding="utf-8",
        ) as file:
            return json.load(file)
    def save(
        self,
        entity: dict,
    ) -> str:
        """
        Save dataset metadata.

        Creates the dataset directory if it
        does not already exist.
        """

        dataset_id = entity.get("id")

        if not dataset_id:
            dataset_id = str(uuid4())
            entity["id"] = dataset_id

        dataset_directory = self._dataset_directory(
            dataset_id
        )

        dataset_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        metadata_file = self._metadata_file(
            dataset_id
        )

        with metadata_file.open(
            "w",
            encoding="utf-8",
        ) as file:
            json.dump(
                entity,
                file,
                indent=4,
                ensure_ascii=False,
            )

        return dataset_id

    def list(
        self,
    ) -> list[dict]:
        """
        Return metadata for all datasets.
        """

        datasets: list[dict] = []

        for metadata_file in sorted(
            self.metadata_directory.glob("*.json")
        ):
            with metadata_file.open(
                "r",
                encoding="utf-8",
            ) as file:
                datasets.append(
                    json.load(file)
                )

        return datasets

    def delete(
        self,
        identifier: str,
    ) -> None:
        """
        Delete a dataset and its metadata.
        """

        dataset_directory = self._dataset_directory(
            identifier
        )

        metadata_file = self._metadata_file(
            identifier
        )

        if dataset_directory.exists():
            shutil.rmtree(
                dataset_directory
            )

        if metadata_file.exists():
            metadata_file.unlink()

    def count(
        self,
    ) -> int:
        """
        Return total number of datasets.
        """

        return len(
            list(
                self.metadata_directory.glob(
                    "*.json"
                )
            )
        )

    def clear(
        self,
    ) -> None:
        """
        Remove every stored dataset.
        """

        if self.base_directory.exists():
            shutil.rmtree(
                self.base_directory
            )

        if self.metadata_directory.exists():
            shutil.rmtree(
                self.metadata_directory
            )

        self.base_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        self.metadata_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

    def __repr__(
        self,
    ) -> str:
        return (
            f"{self.__class__.__name__}("
            f"datasets={self.count()}, "
            f"base_directory='{self.base_directory}', "
            f"metadata_directory='{self.metadata_directory}'"
            f")"
        )


__all__ = [
    "DatasetRepository",
]
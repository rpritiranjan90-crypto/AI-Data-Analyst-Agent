from __future__ import annotations

import json
import shutil
from pathlib import Path
from uuid import uuid4

from app.core.config import settings
from app.core.exceptions import ResourceNotFoundException
from app.repositories.base_repository import BaseRepository


class MetadataRepository(
    BaseRepository[dict],
):
    """
    Repository responsible for application metadata.

    Stores metadata for:

    - datasets
    - models
    - artifacts
    - AutoML runs
    - training jobs

    Does NOT store actual files.
    """

    def __init__(
        self,
    ) -> None:
        super().__init__(
            Path(settings.METADATA_DIRECTORY)
        )

        self.base_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

    def _metadata_directory(
        self,
        category: str,
    ) -> Path:
        """
        Return metadata category directory.
        """

        directory = (
            self.base_directory
            / category
        )

        directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        return directory

    def _metadata_file(
        self,
        category: str,
        identifier: str,
    ) -> Path:
        """
        Return metadata file path.
        """

        return (
            self._metadata_directory(category)
            / f"{identifier}.json"
        )

    def exists(
        self,
        category: str,
        identifier: str,
    ) -> bool:

        return self._metadata_file(
            category,
            identifier,
        ).exists()

    def get(
        self,
        category: str,
        identifier: str,
    ) -> dict:

        metadata_file = self._metadata_file(
            category,
            identifier,
        )

        if not metadata_file.exists():
            raise ResourceNotFoundException(
                f"{category} metadata '{identifier}' not found."
            )

        with metadata_file.open(
            "r",
            encoding="utf-8",
        ) as file:
            return json.load(file)
    def save(
        self,
        category: str,
        entity: dict,
    ) -> str:

        metadata_id = entity.get("id")

        if metadata_id is None:
            metadata_id = str(uuid4())
            entity["id"] = metadata_id

        metadata_file = self._metadata_file(
            category,
            metadata_id,
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

        return metadata_id

    def list(
        self,
        category: str,
    ) -> list[dict]:

        metadata: list[dict] = []

        for metadata_file in sorted(
            self._metadata_directory(category).glob("*.json")
        ):
            with metadata_file.open(
                "r",
                encoding="utf-8",
            ) as file:
                metadata.append(
                    json.load(file)
                )

        return metadata

    def delete(
        self,
        category: str,
        identifier: str,
    ) -> None:

        metadata_file = self._metadata_file(
            category,
            identifier,
        )

        if metadata_file.exists():
            metadata_file.unlink()

    def count(
        self,
        category: str,
    ) -> int:

        return len(
            list(
                self._metadata_directory(category).glob("*.json")
            )
        )

    def clear(
        self,
        category: str,
    ) -> None:

        directory = self._metadata_directory(
            category
        )

        if directory.exists():
            shutil.rmtree(directory)

        directory.mkdir(
            parents=True,
            exist_ok=True,
        )

    def categories(
        self,
    ) -> list[str]:

        return sorted(
            directory.name
            for directory in self.base_directory.iterdir()
            if directory.is_dir()
        )

    def __repr__(
        self,
    ) -> str:

        return (
            f"{self.__class__.__name__}("
            f"categories={len(self.categories())}, "
            f"base_directory='{self.base_directory}'"
            f")"
        )


__all__ = [
    "MetadataRepository",
]
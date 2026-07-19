from __future__ import annotations

import json
from pathlib import Path
from uuid import uuid4

from app.core.config import settings
from app.core.exceptions import ResourceNotFoundException
from app.repositories.base_repository import BaseRepository


class ArtifactRepository(
    BaseRepository[dict],
):
    """
    Repository responsible for ML artifact persistence.

    Stores reusable artifacts including:

    - preprocessing pipelines
    - scalers
    - encoders
    - feature selectors
    - reports
    - plots
    - explainability outputs
    """

    def __init__(
        self,
    ) -> None:
        super().__init__(
            Path(settings.ARTIFACT_DIRECTORY)
        )

        self.base_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

    def _artifact_directory(
        self,
        artifact_id: str,
    ) -> Path:
        """
        Return artifact directory.
        """

        return (
            self.base_directory
            / artifact_id
        )

    def _metadata_file(
        self,
        artifact_id: str,
    ) -> Path:
        """
        Metadata file path.
        """

        return (
            self._artifact_directory(
                artifact_id
            )
            / "metadata.json"
        )

    def _artifact_file(
        self,
        artifact_id: str,
        filename: str,
    ) -> Path:
        """
        Artifact file path.
        """

        return (
            self._artifact_directory(
                artifact_id
            )
            / filename
        )
from __future__ import annotations

import json
from uuid import uuid4

from app.core.exceptions import ResourceNotFoundException


class ArtifactRepository(
    BaseRepository[dict],
):
    ...

    def exists(
        self,
        identifier: str,
    ) -> bool:
        """
        Check whether an artifact exists.
        """

        return self._artifact_directory(
            identifier
        ).exists()

    def get(
        self,
        identifier: str,
    ) -> dict:
        """
        Retrieve artifact metadata.
        """

        metadata_file = self._metadata_file(
            identifier
        )

        if not metadata_file.exists():
            raise ResourceNotFoundException(
                f"Artifact '{identifier}' not found."
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
        Save artifact metadata.

        The artifact itself is written by the
        corresponding service.
        """

        artifact_id = entity.get("id")

        if artifact_id is None:
            artifact_id = str(uuid4())
            entity["id"] = artifact_id

        artifact_directory = (
            self._artifact_directory(
                artifact_id
            )
        )

        artifact_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        metadata_file = self._metadata_file(
            artifact_id
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

        return artifact_id

    def artifact_directory(
        self,
        artifact_id: str,
    ):
        """
        Return the directory assigned to
        an artifact.
        """

        if not self.exists(
            artifact_id
        ):
            raise ResourceNotFoundException(
                f"Artifact '{artifact_id}' not found."
            )

        return self._artifact_directory(
            artifact_id
        )

    def metadata_path(
        self,
        artifact_id: str,
    ):
        """
        Return metadata path.
        """

        if not self.exists(
            artifact_id
        ):
            raise ResourceNotFoundException(
                f"Artifact '{artifact_id}' not found."
            )

        return self._metadata_file(
            artifact_id
        )
from __future__ import annotations

import json
import shutil


class ArtifactRepository(
    BaseRepository[dict],
):
    ...

    def list(
        self,
    ) -> list[dict]:
        """
        Return metadata for all artifacts.
        """

        artifacts: list[dict] = []

        for metadata_file in sorted(
            self.base_directory.glob("*/metadata.json")
        ):
            with metadata_file.open(
                "r",
                encoding="utf-8",
            ) as file:
                artifacts.append(
                    json.load(file)
                )

        return artifacts

    def delete(
        self,
        identifier: str,
    ) -> None:
        """
        Delete an artifact and all associated files.
        """

        artifact_directory = (
            self._artifact_directory(
                identifier
            )
        )

        if artifact_directory.exists():
            shutil.rmtree(
                artifact_directory
            )

    def count(
        self,
    ) -> int:
        """
        Return total number of stored artifacts.
        """

        return len(
            list(
                self.base_directory.glob(
                    "*/metadata.json"
                )
            )
        )

    def clear(
        self,
    ) -> None:
        """
        Remove every stored artifact.
        """

        if self.base_directory.exists():
            shutil.rmtree(
                self.base_directory
            )

        self.base_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

    def __repr__(
        self,
    ) -> str:
        """
        Developer-friendly representation.
        """

        return (
            f"{self.__class__.__name__}("
            f"artifacts={self.count()}, "
            f"base_directory='{self.base_directory}'"
            f")"
        )


__all__ = [
    "ArtifactRepository",
]
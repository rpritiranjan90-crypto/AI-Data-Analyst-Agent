from __future__ import annotations

import json
from pathlib import Path
from uuid import uuid4

from app.core.config import settings
from app.core.exceptions import ResourceNotFoundException
from app.repositories.base_repository import BaseRepository


class ModelRepository(
    BaseRepository[dict],
):
    """
    Repository responsible for trained model persistence.

    Stores:
        - Trained models
        - Model metadata
        - Metrics
        - Preprocessing artifacts
    """

    def __init__(
        self,
    ) -> None:
        super().__init__(
            Path(settings.MODEL_DIRECTORY)
        )

        self.base_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

    def _model_directory(
        self,
        model_id: str,
    ) -> Path:
        """
        Return model directory.
        """

        return (
            self.base_directory
            / model_id
        )

    def _metadata_file(
        self,
        model_id: str,
    ) -> Path:
        """
        Metadata file.
        """

        return (
            self._model_directory(model_id)
            / "metadata.json"
        )

    def _model_file(
        self,
        model_id: str,
    ) -> Path:
        """
        Serialized model path.
        """

        return (
            self._model_directory(model_id)
            / "model.pkl"
        )

    def _metrics_file(
        self,
        model_id: str,
    ) -> Path:
        """
        Metrics file.
        """

        return (
            self._model_directory(model_id)
            / "metrics.json"
        )
from __future__ import annotations

import json
from uuid import uuid4

from app.core.exceptions import ResourceNotFoundException


class ModelRepository(BaseRepository[dict]):
    ...

    def exists(
        self,
        identifier: str,
    ) -> bool:
        """
        Check whether a model exists.
        """

        return self._model_directory(
            identifier
        ).exists()

    def get(
        self,
        identifier: str,
    ) -> dict:
        """
        Retrieve model metadata.
        """

        metadata_file = self._metadata_file(
            identifier
        )

        if not metadata_file.exists():
            raise ResourceNotFoundException(
                f"Model '{identifier}' not found."
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
        Save model metadata.

        The serialized model and other artifacts
        are stored separately by the service layer.
        """

        model_id = entity.get("id")

        if model_id is None:
            model_id = str(uuid4())
            entity["id"] = model_id

        model_directory = self._model_directory(
            model_id
        )

        model_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        metadata_file = self._metadata_file(
            model_id
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

        return model_id

    def model_path(
        self,
        model_id: str,
    ):
        """
        Return the location where the serialized
        model should be stored.
        """

        if not self.exists(model_id):
            raise ResourceNotFoundException(
                f"Model '{model_id}' not found."
            )

        return self._model_file(model_id)

    def metrics_path(
        self,
        model_id: str,
    ):
        """
        Return the metrics file path.
        """

        if not self.exists(model_id):
            raise ResourceNotFoundException(
                f"Model '{model_id}' not found."
            )

        return self._metrics_file(model_id)
from __future__ import annotations

import json
import shutil
from pathlib import Path


class ModelRepository(BaseRepository[dict]):
    ...

    def list(
        self,
    ) -> list[dict]:
        """
        Return metadata for all stored models.
        """

        models: list[dict] = []

        for metadata_file in sorted(
            self.base_directory.glob("*/metadata.json")
        ):
            with metadata_file.open(
                "r",
                encoding="utf-8",
            ) as file:
                models.append(
                    json.load(file)
                )

        return models

    def delete(
        self,
        identifier: str,
    ) -> None:
        """
        Delete a model and all associated artifacts.
        """

        model_directory = self._model_directory(
            identifier
        )

        if model_directory.exists():
            shutil.rmtree(
                model_directory
            )

    def count(
        self,
    ) -> int:
        """
        Return total number of stored models.
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
        Remove every stored model.
        """

        if self.base_directory.exists():
            shutil.rmtree(
                self.base_directory
            )

        self.base_directory.mkdir(
            parents=True,
            exist_ok=True,
        )

    # =====================================================
    # Artifact Paths
    # =====================================================

    def preprocessor_path(
        self,
        model_id: str,
    ) -> Path:
        """
        Path to serialized preprocessing pipeline.
        """

        return (
            self._model_directory(model_id)
            / "preprocessor.pkl"
        )

    def scaler_path(
        self,
        model_id: str,
    ) -> Path:
        """
        Path to scaler artifact.
        """

        return (
            self._model_directory(model_id)
            / "scaler.pkl"
        )

    def encoder_path(
        self,
        model_id: str,
    ) -> Path:
        """
        Path to encoder artifact.
        """

        return (
            self._model_directory(model_id)
            / "encoder.pkl"
        )

    def feature_names_path(
        self,
        model_id: str,
    ) -> Path:
        """
        Path to feature names.
        """

        return (
            self._model_directory(model_id)
            / "feature_names.json"
        )

    def reports_directory(
        self,
        model_id: str,
    ) -> Path:
        """
        Reports directory.
        """

        directory = (
            self._model_directory(model_id)
            / "reports"
        )

        directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        return directory

    def plots_directory(
        self,
        model_id: str,
    ) -> Path:
        """
        Plots directory.
        """

        directory = (
            self._model_directory(model_id)
            / "plots"
        )

        directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        return directory

    def shap_directory(
        self,
        model_id: str,
    ) -> Path:
        """
        SHAP artifacts directory.
        """

        directory = (
            self._model_directory(model_id)
            / "shap"
        )

        directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        return directory

    def __repr__(
        self,
    ) -> str:
        return (
            f"{self.__class__.__name__}("
            f"models={self.count()}, "
            f"base_directory='{self.base_directory}'"
            f")"
        )


__all__ = [
    "ModelRepository",
]
from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any

import joblib
from sklearn.base import BaseEstimator

from app.services.ml.ml_artifact_registry import (
    MLArtifactRegistry,
)


class ModelRegistry:
    """
    Enterprise Model Registry.

    Stores complete ML pipelines instead of
    only trained models.

    Each model is stored as

    models/
        model_name/
            model.joblib
            artifacts.joblib
            metadata.json
    """

    MODELS_DIRECTORY = Path("models")

    MODELS_DIRECTORY.mkdir(
        parents=True,
        exist_ok=True,
    )

    @classmethod
    def _model_directory(
        cls,
        model_name: str,
    ) -> Path:

        directory = (
            cls.MODELS_DIRECTORY /
            model_name
        )

        directory.mkdir(
            parents=True,
            exist_ok=True,
        )

        return directory

    @staticmethod
    def _collect_artifacts() -> dict[str, Any]:
        """
        Collect all runtime ML artifacts.
        """

        return {

            "model": MLArtifactRegistry.get_model(),

            "encoder": MLArtifactRegistry.get_encoder(),

            "scaler": MLArtifactRegistry.get_scaler(),

            "feature_selector":
                MLArtifactRegistry.get_feature_selector(),

            "pca":
                MLArtifactRegistry.get_pca(),

            "feature_columns":
                MLArtifactRegistry.get_feature_columns(),

            "target_column":
                MLArtifactRegistry.get_target_column(),

            "metadata":
                MLArtifactRegistry.get_metadata(),
        }

    @classmethod
    def save_registered_model(
        cls,
        model_name: str,
    ) -> dict[str, Any]:
        """
        Save the complete ML pipeline.
        """

        artifacts = cls._collect_artifacts()

        model = artifacts["model"]

        if model is None:

            raise ValueError(
                "No trained model available."
            )

        model_directory = cls._model_directory(
            model_name
        )

        model_file = (
            model_directory /
            "model.joblib"
        )

        artifacts_file = (
            model_directory /
            "artifacts.joblib"
        )

        metadata_file = (
            model_directory /
            "metadata.json"
        )
        joblib.dump(
            model,
            model_file,
        )

        joblib.dump(
            artifacts,
            artifacts_file,
        )

        metadata = {
            "model_name": model_name,
            "model_class": model.__class__.__name__,
            "saved_at": datetime.now().isoformat(),
            "artifacts": {
                "encoder": artifacts["encoder"] is not None,
                "scaler": artifacts["scaler"] is not None,
                "feature_selector": (
                    artifacts["feature_selector"]
                    is not None
                ),
                "pca": (
                    artifacts["pca"]
                    is not None
                ),
            },
            "feature_count": len(
                artifacts["feature_columns"]
                or []
            ),
            "target_column": (
                artifacts["target_column"]
            ),
            "training_metadata": (
                artifacts["metadata"]
            ),
        }

        with open(
            metadata_file,
            "w",
            encoding="utf-8",
        ) as file:

            json.dump(
                metadata,
                file,
                indent=4,
            )

        return {
            "success": True,
            "model_name": model_name,
            "directory": str(
                model_directory
            ),
            "saved_files": [
                "model.joblib",
                "artifacts.joblib",
                "metadata.json",
            ],
            "message": (
                "Complete ML pipeline saved successfully."
            ),
        }

    @classmethod
    def load_model(
        cls,
        model_name: str,
    ) -> BaseEstimator:
        """
        Load an entire ML pipeline and
        restore all runtime artifacts.
        """

        model_directory = (
            cls.MODELS_DIRECTORY
            / model_name
        )

        if not model_directory.exists():

            raise FileNotFoundError(
                f"Model '{model_name}' not found."
            )

        model_file = (
            model_directory
            / "model.joblib"
        )

        artifacts_file = (
            model_directory
            / "artifacts.joblib"
        )

        if (
            not model_file.exists()
            or not artifacts_file.exists()
        ):

            raise FileNotFoundError(
                "Model files are incomplete."
            )

        model = joblib.load(
            model_file
        )

        artifacts = joblib.load(
            artifacts_file
        )

        MLArtifactRegistry.clear()

        MLArtifactRegistry.set_model(
            model
        )

        if artifacts.get(
            "encoder"
        ) is not None:

            MLArtifactRegistry.set_encoder(
                artifacts["encoder"]
            )

        if artifacts.get(
            "scaler"
        ) is not None:

            MLArtifactRegistry.set_scaler(
                artifacts["scaler"]
            )

        if artifacts.get(
            "feature_selector"
        ) is not None:

            MLArtifactRegistry.set_feature_selector(
                artifacts["feature_selector"]
            )

        if artifacts.get(
            "pca"
        ) is not None:

            MLArtifactRegistry.set_pca(
                artifacts["pca"]
            )

        MLArtifactRegistry.set_feature_columns(
            artifacts.get(
                "feature_columns",
                [],
            )
        )

        if artifacts.get(
            "target_column"
        ) is not None:

            MLArtifactRegistry.set_target_column(
                artifacts["target_column"]
            )

        if artifacts.get(
            "metadata"
        ) is not None:

            MLArtifactRegistry.set_metadata(
                artifacts["metadata"]
            )

        return model
    @classmethod
    def delete_model(
        cls,
        model_name: str,
    ) -> dict[str, Any]:
        """
        Delete a saved ML pipeline.
        """

        import shutil

        model_directory = (
            cls.MODELS_DIRECTORY /
            model_name
        )

        if not model_directory.exists():

            raise FileNotFoundError(
                f"Model '{model_name}' not found."
            )

        shutil.rmtree(
            model_directory
        )

        return {
            "success": True,
            "model_name": model_name,
            "message": (
                "Model deleted successfully."
            ),
        }

    @classmethod
    def list_models(
        cls,
    ) -> list[dict[str, Any]]:
        """
        List all saved ML pipelines.
        """

        models = []

        for directory in sorted(
            cls.MODELS_DIRECTORY.iterdir()
        ):

            if not directory.is_dir():
                continue

            metadata_file = (
                directory /
                "metadata.json"
            )

            metadata = {}

            if metadata_file.exists():

                with open(
                    metadata_file,
                    "r",
                    encoding="utf-8",
                ) as file:

                    metadata = json.load(
                        file
                    )

            models.append(
                {
                    "model_name": directory.name,
                    "saved_at": metadata.get(
                        "saved_at"
                    ),
                    "model_class": metadata.get(
                        "model_class"
                    ),
                    "feature_count": metadata.get(
                        "feature_count"
                    ),
                }
            )

        return models

    @classmethod
    def model_exists(
        cls,
        model_name: str,
    ) -> bool:
        """
        Check whether a model exists.
        """

        return (
            cls.MODELS_DIRECTORY /
            model_name
        ).exists()

    @classmethod
    def rename_model(
        cls,
        old_name: str,
        new_name: str,
    ) -> dict[str, Any]:
        """
        Rename a stored ML pipeline.
        """

        old_directory = (
            cls.MODELS_DIRECTORY /
            old_name
        )

        new_directory = (
            cls.MODELS_DIRECTORY /
            new_name
        )

        if not old_directory.exists():

            raise FileNotFoundError(
                f"Model '{old_name}' not found."
            )

        if new_directory.exists():

            raise FileExistsError(
                f"Model '{new_name}' already exists."
            )

        old_directory.rename(
            new_directory
        )

        metadata_file = (
            new_directory /
            "metadata.json"
        )

        if metadata_file.exists():

            with open(
                metadata_file,
                "r",
                encoding="utf-8",
            ) as file:

                metadata = json.load(
                    file
                )

            metadata["model_name"] = (
                new_name
            )

            with open(
                metadata_file,
                "w",
                encoding="utf-8",
            ) as file:

                json.dump(
                    metadata,
                    file,
                    indent=4,
                )

        return {
            "success": True,
            "old_name": old_name,
            "new_name": new_name,
            "message": (
                "Model renamed successfully."
            ),
        }

    @classmethod
    def model_info(
        cls,
        model_name: str,
    ) -> dict[str, Any]:
        """
        Return metadata for a saved ML pipeline.
        """

        metadata_file = (
            cls.MODELS_DIRECTORY /
            model_name /
            "metadata.json"
        )

        if not metadata_file.exists():

            raise FileNotFoundError(
                f"Model '{model_name}' not found."
            )

        with open(
            metadata_file,
            "r",
            encoding="utf-8",
        ) as file:

            return json.load(
                file
            )

    @classmethod
    def registry_summary(
        cls,
    ) -> dict[str, Any]:
        """
        Return Model Registry summary.
        """

        models = cls.list_models()

        return {
            "registry": "Enterprise Model Registry",
            "model_count": len(
                models
            ),
            "models": models,
            "directory": str(
                cls.MODELS_DIRECTORY.resolve()
            ),
            "runtime_registry": (
                MLArtifactRegistry.registry_info()
            ),
        }
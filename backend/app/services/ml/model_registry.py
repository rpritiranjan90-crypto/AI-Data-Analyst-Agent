from __future__ import annotations

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
    Enterprise Model Registry Service.

    Responsible for persisting trained machine learning
    models to disk and retrieving them when needed.
    """

    MODELS_DIRECTORY = Path("models")

    MODELS_DIRECTORY.mkdir(
        parents=True,
        exist_ok=True,
    )

    @classmethod
    def save_model(
        cls,
        model: BaseEstimator,
        model_name: str,
    ) -> dict[str, Any]:
        """
        Save a trained model.

        Args:
            model:
                Trained sklearn model.

            model_name:
                File name without extension.
        """

        file_path = (
            cls.MODELS_DIRECTORY /
            f"{model_name}.joblib"
        )

        joblib.dump(
            model,
            file_path,
        )

        return {
            "success": True,
            "model_name": model_name,
            "file_path": str(file_path),
            "saved_at": datetime.now().isoformat(),
            "message": "Model saved successfully.",
        }

    @classmethod
    def save_registered_model(
        cls,
        model_name: str,
    ) -> dict[str, Any]:
        """
        Save the model currently stored in
        MLArtifactRegistry.
        """

        model = MLArtifactRegistry.get_model()

        if model is None:
            raise ValueError(
                "No trained model available."
            )

        return cls.save_model(
            model,
            model_name,
        )

    @classmethod
    def load_model(
        cls,
        model_name: str,
    ) -> BaseEstimator:
        """
        Load a saved model.
        """

        file_path = (
            cls.MODELS_DIRECTORY /
            f"{model_name}.joblib"
        )

        if not file_path.exists():
            raise FileNotFoundError(
                f"Model '{model_name}' not found."
            )

        model = joblib.load(
            file_path
        )

        MLArtifactRegistry.set_model(
            model
        )

        return model
    @classmethod
    def delete_model(
        cls,
        model_name: str,
    ) -> dict[str, Any]:
        """
        Delete a saved model.

        Args:
            model_name:
                Model filename without extension.

        Returns:
            Deletion summary.
        """

        file_path = (
            cls.MODELS_DIRECTORY /
            f"{model_name}.joblib"
        )

        if not file_path.exists():
            raise FileNotFoundError(
                f"Model '{model_name}' not found."
            )

        file_path.unlink()

        return {
            "success": True,
            "model_name": model_name,
            "message": "Model deleted successfully.",
        }

    @classmethod
    def list_models(
        cls,
    ) -> list[dict[str, Any]]:
        """
        List all saved models.

        Returns:
            List of saved model metadata.
        """

        models = []

        for model_file in sorted(
            cls.MODELS_DIRECTORY.glob("*.joblib")
        ):

            stat = model_file.stat()

            models.append(
                {
                    "model_name": model_file.stem,
                    "file_name": model_file.name,
                    "size_bytes": stat.st_size,
                    "modified_at": datetime.fromtimestamp(
                        stat.st_mtime
                    ).isoformat(),
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
            f"{model_name}.joblib"
        ).exists()

    @classmethod
    def rename_model(
        cls,
        old_name: str,
        new_name: str,
    ) -> dict[str, Any]:
        """
        Rename a saved model.
        """

        old_file = (
            cls.MODELS_DIRECTORY /
            f"{old_name}.joblib"
        )

        new_file = (
            cls.MODELS_DIRECTORY /
            f"{new_name}.joblib"
        )

        if not old_file.exists():
            raise FileNotFoundError(
                f"Model '{old_name}' not found."
            )

        if new_file.exists():
            raise FileExistsError(
                f"Model '{new_name}' already exists."
            )

        old_file.rename(new_file)

        return {
            "success": True,
            "old_name": old_name,
            "new_name": new_name,
            "message": "Model renamed successfully.",
        }

    @classmethod
    def model_info(
        cls,
        model_name: str,
    ) -> dict[str, Any]:
        """
        Return information about a saved model.
        """

        file_path = (
            cls.MODELS_DIRECTORY /
            f"{model_name}.joblib"
        )

        if not file_path.exists():
            raise FileNotFoundError(
                f"Model '{model_name}' not found."
            )

        stat = file_path.stat()

        return {
            "model_name": model_name,
            "file_name": file_path.name,
            "file_path": str(file_path.resolve()),
            "size_bytes": stat.st_size,
            "created_at": datetime.fromtimestamp(
                stat.st_ctime
            ).isoformat(),
            "modified_at": datetime.fromtimestamp(
                stat.st_mtime
            ).isoformat(),
        }

    @classmethod
    def registry_summary(
        cls,
    ) -> dict[str, Any]:
        """
        Return model registry summary.
        """

        models = cls.list_models()

        return {
            "model_count": len(models),
            "models": models,
            "directory": str(
                cls.MODELS_DIRECTORY.resolve()
            ),
        }
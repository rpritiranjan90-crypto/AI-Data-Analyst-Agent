from __future__ import annotations

from typing import Any


class MLArtifactRegistry:
    """
    Enterprise Machine Learning Artifact Registry.

    Central registry for storing preprocessing artifacts,
    trained models, feature metadata, and training metadata.

    This registry allows different ML services to share
    fitted objects without duplicating state.
    """

    _artifacts: dict[str, Any] = {}

    @classmethod
    def set_scaler(
        cls,
        scaler: Any,
    ) -> None:
        """
        Store a fitted scaler.
        """
        cls._artifacts["scaler"] = scaler

    @classmethod
    def get_scaler(
        cls,
    ) -> Any:
        """
        Retrieve the fitted scaler.
        """
        return cls._artifacts.get("scaler")

    @classmethod
    def set_encoder(
        cls,
        encoder: Any,
    ) -> None:
        """
        Store a fitted encoder.
        """
        cls._artifacts["encoder"] = encoder

    @classmethod
    def get_encoder(
        cls,
    ) -> Any:
        """
        Retrieve the fitted encoder.
        """
        return cls._artifacts.get("encoder")

    @classmethod
    def set_feature_selector(
        cls,
        selector: Any,
    ) -> None:
        """
        Store a fitted feature selector.
        """
        cls._artifacts["feature_selector"] = selector

    @classmethod
    def get_feature_selector(
        cls,
    ) -> Any:
        """
        Retrieve the fitted feature selector.
        """
        return cls._artifacts.get(
            "feature_selector"
        )

    @classmethod
    def set_pca(
        cls,
        pca: Any,
    ) -> None:
        """
        Store a fitted PCA model.
        """
        cls._artifacts["pca"] = pca

    @classmethod
    def get_pca(
        cls,
    ) -> Any:
        """
        Retrieve the fitted PCA model.
        """
        return cls._artifacts.get("pca")
    @classmethod
    def set_model(
        cls,
        model: Any,
    ) -> None:
        """
        Store a trained machine learning model.
        """
        cls._artifacts["model"] = model

    @classmethod
    def get_model(
        cls,
    ) -> Any:
        """
        Retrieve the trained machine learning model.
        """
        return cls._artifacts.get("model")

    @classmethod
    def set_feature_columns(
        cls,
        columns: list[str],
    ) -> None:
        """
        Store feature column names.
        """
        cls._artifacts["feature_columns"] = columns.copy()

    @classmethod
    def get_feature_columns(
        cls,
    ) -> list[str]:
        """
        Retrieve feature column names.
        """
        return cls._artifacts.get(
            "feature_columns",
            [],
        )

    @classmethod
    def set_target_column(
        cls,
        target: str,
    ) -> None:
        """
        Store target column name.
        """
        cls._artifacts["target_column"] = target

    @classmethod
    def get_target_column(
        cls,
    ) -> str | None:
        """
        Retrieve target column name.
        """
        return cls._artifacts.get(
            "target_column"
        )

    @classmethod
    def set_metadata(
        cls,
        metadata: dict[str, Any],
    ) -> None:
        """
        Store training metadata.
        """
        cls._artifacts["metadata"] = metadata.copy()

    @classmethod
    def get_metadata(
        cls,
    ) -> dict[str, Any]:
        """
        Retrieve training metadata.
        """
        return cls._artifacts.get(
            "metadata",
            {},
        )

    @classmethod
    def clear(
        cls,
    ) -> None:
        """
        Remove every stored artifact.
        """

        cls._artifacts.clear()

    @classmethod
    def has_artifact(
        cls,
        name: str,
    ) -> bool:
        """
        Check whether an artifact exists.

        Args:
            name: Artifact name.

        Returns:
            True if present.
        """

        return name in cls._artifacts

    @classmethod
    def remove_artifact(
        cls,
        name: str,
    ) -> None:
        """
        Remove a single artifact.
        """

        cls._artifacts.pop(
            name,
            None,
        )

    @classmethod
    def registry_info(
        cls,
    ) -> dict[str, Any]:
        """
        Return registry metadata.
        """

        return {
            "artifact_count": len(
                cls._artifacts
            ),
            "artifacts": sorted(
                cls._artifacts.keys()
            ),
            "has_model": cls.has_artifact(
                "model"
            ),
            "has_scaler": cls.has_artifact(
                "scaler"
            ),
            "has_encoder": cls.has_artifact(
                "encoder"
            ),
            "has_pca": cls.has_artifact(
                "pca"
            ),
            "has_feature_selector": cls.has_artifact(
                "feature_selector"
            ),
        }
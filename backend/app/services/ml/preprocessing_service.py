from __future__ import annotations

from typing import Any

import pandas as pd

from app.services.ml.encoding_service import EncodingService
from app.services.ml.feature_selection_service import (
    FeatureSelectionService,
)
from app.services.ml.metadata_service import MetadataService
from app.services.ml.ml_artifact_registry import (
    MLArtifactRegistry,
)
from app.services.ml.scaling_service import ScalingService
from app.services.ml.split_service import SplitService
from app.services.ml.validation_service import (
    ValidationService,
)


class PreprocessingService:
    """
    Enterprise Machine Learning Preprocessing Service.

    This service orchestrates all preprocessing operations
    required before model training.

    Responsibilities
    ----------------
    - Dataset validation
    - Metadata generation
    - Encoding
    - Scaling
    - Feature selection
    - Dataset splitting
    - Artifact registration

    It does not implement preprocessing algorithms itself.
    Instead, it coordinates specialized services.
    """

    @staticmethod
    def validate_dataset(
        dataframe: pd.DataFrame,
    ) -> dict[str, Any]:
        """
        Validate the dataset.

        Returns:
            Validation summary.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        return {
            "success": True,
            "rows": len(dataframe),
            "columns": len(dataframe.columns),
            "message": "Dataset validation completed.",
        }

    @staticmethod
    def generate_metadata(
        dataframe: pd.DataFrame,
        target: str | None = None,
    ) -> dict[str, Any]:
        """
        Generate dataset metadata.
        """

        return MetadataService.metadata_report(
            dataframe,
            target,
        )

    @staticmethod
    def encode(
        dataframe: pd.DataFrame,
        columns: list[str],
        encoder: str = "label",
    ) -> dict[str, Any]:
        """
        Encode categorical features.
        """

        result = EncodingService.fit_transform(
            dataframe,
            columns,
            encoder,
        )

        MLArtifactRegistry.set_encoder(
            EncodingService.get_encoder_info()
        )

        return result

    @staticmethod
    def scale(
        dataframe: pd.DataFrame,
        columns: list[str],
        scaler: str = "standard",
    ) -> dict[str, Any]:
        """
        Scale numeric features.
        """

        result = ScalingService.fit_transform(
            dataframe,
            columns,
            scaler,
        )

        MLArtifactRegistry.set_scaler(
            ScalingService.get_scaler_info()
        )

        return result

    @staticmethod
    def split(
        dataframe: pd.DataFrame,
        target: str,
        test_size: float = 0.2,
        random_state: int = 42,
    ) -> dict[str, Any]:
        """
        Perform train-test split.
        """

        return SplitService.train_test(
            dataframe,
            target,
            test_size,
            random_state,
        )
    @staticmethod
    def select_features(
        dataframe: pd.DataFrame,
        target: str,
        method: str = "select_k_best",
        **kwargs: Any,
    ) -> dict[str, Any]:
        """
        Perform feature selection.

        Supported methods:
        - variance_threshold
        - select_k_best
        - chi_square
        - mutual_information
        - pca
        """

        method = method.lower()

        if method == "variance_threshold":

            result = (
                FeatureSelectionService.variance_threshold(
                    dataframe,
                    threshold=kwargs.get(
                        "threshold",
                        0.0,
                    ),
                )
            )

        elif method == "select_k_best":

            result = (
                FeatureSelectionService.select_k_best(
                    dataframe,
                    target,
                    kwargs.get(
                        "k",
                        10,
                    ),
                )
            )

        elif method == "chi_square":

            result = (
                FeatureSelectionService.chi_square_selection(
                    dataframe,
                    target,
                    kwargs.get(
                        "k",
                        10,
                    ),
                )
            )

        elif method == "mutual_information":

            result = (
                FeatureSelectionService.mutual_information(
                    dataframe,
                    target,
                )
            )

        elif method == "pca":

            result = (
                FeatureSelectionService.pca(
                    dataframe,
                    kwargs.get(
                        "n_components",
                        2,
                    ),
                )
            )

        else:

            raise ValueError(
                f"Unsupported feature selection method '{method}'."
            )

        if "selected_features" in result:

            MLArtifactRegistry.set_feature_columns(
                result["selected_features"]
            )

        return result

    @staticmethod
    def preprocess(
        dataframe: pd.DataFrame,
        target: str,
        *,
        categorical_columns: list[str] | None = None,
        numeric_columns: list[str] | None = None,
        encoder: str = "label",
        scaler: str = "standard",
        feature_selection: str | None = None,
        test_size: float = 0.2,
        random_state: int = 42,
    ) -> dict[str, Any]:
        """
        Execute the complete preprocessing workflow.

        Steps
        -----
        1. Validate dataset
        2. Generate metadata
        3. Encode categorical features
        4. Scale numeric features
        5. Optional feature selection
        6. Train/Test split
        """

        ValidationService.validate_dataset(
            dataframe
        )

        ValidationService.validate_target(
            dataframe,
            target,
        )

        df = dataframe.copy()

        metadata = MetadataService.metadata_report(
            df,
            target,
        )

        if categorical_columns:

            encoding = EncodingService.fit_transform(
                df,
                categorical_columns,
                encoder,
            )

            df = encoding["dataframe"]

            MLArtifactRegistry.set_encoder(
                EncodingService.get_encoder_info()
            )

        if numeric_columns:

            scaling = ScalingService.fit_transform(
                df,
                numeric_columns,
                scaler,
            )

            df = scaling["dataframe"]

            MLArtifactRegistry.set_scaler(
                ScalingService.get_scaler_info()
            )

        feature_selection_result = None

        if feature_selection:

            feature_selection_result = (
                PreprocessingService.select_features(
                    df,
                    target,
                    feature_selection,
                )
            )

        split = SplitService.train_test(
            df,
            target,
            test_size,
            random_state,
        )

        MLArtifactRegistry.set_target_column(
            target
        )

        MLArtifactRegistry.set_metadata(
            metadata
        )

        return {
            "success": True,
            "metadata": metadata,
            "feature_selection": (
                feature_selection_result
            ),
            "split": split,
            "message": (
                "Preprocessing pipeline completed successfully."
            ),
        }
    @staticmethod
    def automatic_preprocessing(
        dataframe: pd.DataFrame,
        target: str,
        test_size: float = 0.2,
        random_state: int = 42,
    ) -> dict[str, Any]:
        """
        Automatically preprocess a dataset.

        Automatically identifies numeric and categorical
        columns before executing the preprocessing pipeline.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        ValidationService.validate_target(
            dataframe,
            target,
        )

        numeric_columns = (
            dataframe
            .drop(columns=[target])
            .select_dtypes(include="number")
            .columns
            .tolist()
        )

        categorical_columns = (
            dataframe
            .drop(columns=[target])
            .select_dtypes(exclude="number")
            .columns
            .tolist()
        )

        return PreprocessingService.preprocess(
            dataframe=dataframe,
            target=target,
            numeric_columns=numeric_columns,
            categorical_columns=categorical_columns,
            scaler="standard",
            encoder="onehot",
            feature_selection=None,
            test_size=test_size,
            random_state=random_state,
        )

    @staticmethod
    def preprocessing_summary() -> dict[str, Any]:
        """
        Return preprocessing artifacts currently
        registered in memory.
        """

        return {
            "registry": MLArtifactRegistry.registry_info(),
            "scaler": ScalingService.get_scaler_info(),
            "encoder": EncodingService.get_encoder_info(),
        }

    @staticmethod
    def available_operations() -> dict[str, list[str]]:
        """
        Return all supported preprocessing operations.
        """

        return {
            "encoders": EncodingService.available_encoders(),
            "scalers": ScalingService.available_scalers(),
            "feature_selection": (
                FeatureSelectionService.available_methods()
            ),
        }

    @staticmethod
    def reset_preprocessing() -> dict[str, Any]:
        """
        Reset the preprocessing environment.

        Clears all fitted preprocessing artifacts.
        """

        ScalingService.reset_scaler()

        EncodingService.reset_encoder()

        MLArtifactRegistry.clear()

        return {
            "success": True,
            "message": (
                "Preprocessing artifacts reset successfully."
            ),
        }

    @staticmethod
    def pipeline_status() -> dict[str, Any]:
        """
        Return the current preprocessing pipeline status.
        """

        return {
            "validation": True,
            "artifacts": MLArtifactRegistry.registry_info(),
            "scaler": ScalingService.has_fitted_scaler(),
            "encoder": EncodingService.has_fitted_encoder(),
            "ready_for_training": (
                MLArtifactRegistry.has_artifact("feature_columns")
                and MLArtifactRegistry.has_artifact("target_column")
            ),
        }
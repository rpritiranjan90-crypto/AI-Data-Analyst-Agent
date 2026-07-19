from __future__ import annotations

from typing import Any

import pandas as pd
from sklearn.model_selection import (
    KFold,
    StratifiedKFold,
    TimeSeriesSplit,
    train_test_split,
)

from app.services.ml.validation_service import ValidationService


class SplitService:
    """
    Enterprise Dataset Splitting Service.

    This service centralizes all dataset splitting strategies used
    throughout the Machine Learning module.

    Supported strategies:
    - Train/Test Split
    - Stratified Train/Test Split
    - K-Fold Cross Validation
    - Stratified K-Fold
    - Time Series Split
    """

    @staticmethod
    def split_features_target(
        dataframe: pd.DataFrame,
        target: str,
    ) -> tuple[pd.DataFrame, pd.Series]:
        """
        Split dataset into feature matrix (X) and target vector (y).

        Args:
            dataframe: Input dataset.
            target: Target column.

        Returns:
            Tuple containing (X, y).
        """

        ValidationService.validate_target(
            dataframe,
            target,
        )

        x = dataframe.drop(columns=[target])

        y = dataframe[target]

        return x, y

    @staticmethod
    def train_test(
        dataframe: pd.DataFrame,
        target: str,
        test_size: float = 0.2,
        random_state: int = 42,
        shuffle: bool = True,
    ) -> dict[str, Any]:
        """
        Perform a standard train-test split.

        Returns:
            Dictionary containing train/test datasets.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        ValidationService.validate_target(
            dataframe,
            target,
        )

        ValidationService.validate_test_size(
            test_size
        )

        ValidationService.validate_random_state(
            random_state
        )

        x, y = SplitService.split_features_target(
            dataframe,
            target,
        )

        (
            x_train,
            x_test,
            y_train,
            y_test,
        ) = train_test_split(
            x,
            y,
            test_size=test_size,
            random_state=random_state,
            shuffle=shuffle,
        )

        return {
            "x_train": x_train,
            "x_test": x_test,
            "y_train": y_train,
            "y_test": y_test,
            "train_rows": len(x_train),
            "test_rows": len(x_test),
            "features": list(x.columns),
            "target": target,
        }

    @staticmethod
    def stratified_train_test(
        dataframe: pd.DataFrame,
        target: str,
        test_size: float = 0.2,
        random_state: int = 42,
    ) -> dict[str, Any]:
        """
        Perform a stratified train-test split.

        Intended for classification problems.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        ValidationService.validate_target(
            dataframe,
            target,
        )

        ValidationService.validate_test_size(
            test_size
        )

        x, y = SplitService.split_features_target(
            dataframe,
            target,
        )

        (
            x_train,
            x_test,
            y_train,
            y_test,
        ) = train_test_split(
            x,
            y,
            test_size=test_size,
            random_state=random_state,
            stratify=y,
        )

        return {
            "x_train": x_train,
            "x_test": x_test,
            "y_train": y_train,
            "y_test": y_test,
            "train_rows": len(x_train),
            "test_rows": len(x_test),
            "features": list(x.columns),
            "target": target,
        }
    @staticmethod
    def kfold_split(
        dataframe: pd.DataFrame,
        target: str,
        n_splits: int = 5,
        shuffle: bool = True,
        random_state: int = 42,
    ) -> dict[str, Any]:
        """
        Generate K-Fold cross-validation splits.

        Args:
            dataframe: Input dataset.
            target: Target column.
            n_splits: Number of folds.
            shuffle: Whether to shuffle data.
            random_state: Random seed.

        Returns:
            Dictionary containing fold indices.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        ValidationService.validate_target(
            dataframe,
            target,
        )

        if n_splits < 2:
            raise ValueError(
                "n_splits must be at least 2."
            )

        x, y = SplitService.split_features_target(
            dataframe,
            target,
        )

        kfold = KFold(
            n_splits=n_splits,
            shuffle=shuffle,
            random_state=random_state,
        )

        folds = []

        for fold, (
            train_idx,
            test_idx,
        ) in enumerate(kfold.split(x), start=1):

            folds.append(
                {
                    "fold": fold,
                    "train_indices": train_idx.tolist(),
                    "test_indices": test_idx.tolist(),
                    "train_size": len(train_idx),
                    "test_size": len(test_idx),
                }
            )

        return {
            "method": "kfold",
            "n_splits": n_splits,
            "folds": folds,
        }

    @staticmethod
    def stratified_kfold_split(
        dataframe: pd.DataFrame,
        target: str,
        n_splits: int = 5,
        shuffle: bool = True,
        random_state: int = 42,
    ) -> dict[str, Any]:
        """
        Generate Stratified K-Fold splits.

        Suitable for classification datasets.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        ValidationService.validate_target(
            dataframe,
            target,
        )

        if n_splits < 2:
            raise ValueError(
                "n_splits must be at least 2."
            )

        x, y = SplitService.split_features_target(
            dataframe,
            target,
        )

        splitter = StratifiedKFold(
            n_splits=n_splits,
            shuffle=shuffle,
            random_state=random_state,
        )

        folds = []

        for fold, (
            train_idx,
            test_idx,
        ) in enumerate(
            splitter.split(x, y),
            start=1,
        ):

            folds.append(
                {
                    "fold": fold,
                    "train_indices": train_idx.tolist(),
                    "test_indices": test_idx.tolist(),
                    "train_size": len(train_idx),
                    "test_size": len(test_idx),
                }
            )

        return {
            "method": "stratified_kfold",
            "n_splits": n_splits,
            "folds": folds,
        }

    @staticmethod
    def timeseries_split(
        dataframe: pd.DataFrame,
        target: str,
        n_splits: int = 5,
    ) -> dict[str, Any]:
        """
        Generate Time Series cross-validation splits.

        Maintains chronological order and avoids data leakage.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        ValidationService.validate_target(
            dataframe,
            target,
        )

        if n_splits < 2:
            raise ValueError(
                "n_splits must be at least 2."
            )

        x, _ = SplitService.split_features_target(
            dataframe,
            target,
        )

        splitter = TimeSeriesSplit(
            n_splits=n_splits
        )

        folds = []

        for fold, (
            train_idx,
            test_idx,
        ) in enumerate(
            splitter.split(x),
            start=1,
        ):

            folds.append(
                {
                    "fold": fold,
                    "train_indices": train_idx.tolist(),
                    "test_indices": test_idx.tolist(),
                    "train_size": len(train_idx),
                    "test_size": len(test_idx),
                }
            )

        return {
            "method": "timeseries",
            "n_splits": n_splits,
            "folds": folds,
        }

    @staticmethod
    def split_summary(
        dataframe: pd.DataFrame,
        target: str,
    ) -> dict[str, Any]:
        """
        Generate a summary of the dataset before splitting.

        Returns:
            Dataset split metadata.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        ValidationService.validate_target(
            dataframe,
            target,
        )

        x, y = SplitService.split_features_target(
            dataframe,
            target,
        )

        return {
            "rows": len(dataframe),
            "features": len(x.columns),
            "feature_names": list(x.columns),
            "target": target,
            "target_dtype": str(y.dtype),
            "target_unique_values": int(
                y.nunique(dropna=True)
            ),
            "missing_values": int(
                dataframe.isna().sum().sum()
            ),
            "duplicate_rows": int(
                dataframe.duplicated().sum()
            ),
        }
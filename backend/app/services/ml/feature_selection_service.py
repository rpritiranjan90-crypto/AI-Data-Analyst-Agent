from __future__ import annotations

from typing import Any

import pandas as pd
from sklearn.decomposition import PCA
from sklearn.feature_selection import (
    SelectKBest,
    VarianceThreshold,
    chi2,
    f_classif,
    mutual_info_classif,
)

from app.services.ml.validation_service import ValidationService


class FeatureSelectionService:
    """
    Enterprise Feature Selection Service.

    Provides multiple feature selection techniques
    for supervised machine learning.

    Supported Techniques
    --------------------
    - Variance Threshold
    - SelectKBest
    - Chi-Square
    - Mutual Information
    - PCA
    """

    @staticmethod
    def variance_threshold(
        dataframe: pd.DataFrame,
        threshold: float = 0.0,
    ) -> dict[str, Any]:
        """
        Remove low variance features.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        numeric_df = dataframe.select_dtypes(
            include="number"
        )

        selector = VarianceThreshold(
            threshold=threshold
        )

        transformed = selector.fit_transform(
            numeric_df
        )

        selected = numeric_df.columns[
            selector.get_support()
        ].tolist()

        transformed_df = pd.DataFrame(
            transformed,
            columns=selected,
            index=dataframe.index,
        )

        return {
            "success": True,
            "method": "variance_threshold",
            "selected_features": selected,
            "removed_features": list(
                set(numeric_df.columns) - set(selected)
            ),
            "dataframe": transformed_df,
        }

    @staticmethod
    def select_k_best(
        dataframe: pd.DataFrame,
        target: str,
        k: int = 10,
    ) -> dict[str, Any]:
        """
        Select top-k features using ANOVA F-test.
        """

        ValidationService.validate_target(
            dataframe,
            target,
        )

        x = dataframe.drop(
            columns=[target]
        ).select_dtypes(
            include="number"
        )

        y = dataframe[target]

        selector = SelectKBest(
            score_func=f_classif,
            k=min(k, x.shape[1]),
        )

        transformed = selector.fit_transform(
            x,
            y,
        )

        selected = x.columns[
            selector.get_support()
        ].tolist()

        transformed_df = pd.DataFrame(
            transformed,
            columns=selected,
            index=dataframe.index,
        )

        scores = dict(
            zip(
                x.columns,
                selector.scores_,
            )
        )

        return {
            "success": True,
            "method": "select_k_best",
            "selected_features": selected,
            "scores": scores,
            "dataframe": transformed_df,
        }
    @staticmethod
    def chi_square_selection(
        dataframe: pd.DataFrame,
        target: str,
        k: int = 10,
    ) -> dict[str, Any]:
        """
        Select top-k features using the Chi-Square test.

        Suitable for classification datasets with
        non-negative feature values.
        """

        ValidationService.validate_target(
            dataframe,
            target,
        )

        x = dataframe.drop(
            columns=[target]
        ).select_dtypes(
            include="number"
        )

        y = dataframe[target]

        if (x < 0).any().any():
            raise ValueError(
                "Chi-Square requires non-negative numeric features."
            )

        selector = SelectKBest(
            score_func=chi2,
            k=min(k, x.shape[1]),
        )

        transformed = selector.fit_transform(
            x,
            y,
        )

        selected = x.columns[
            selector.get_support()
        ].tolist()

        transformed_df = pd.DataFrame(
            transformed,
            columns=selected,
            index=dataframe.index,
        )

        scores = dict(
            zip(
                x.columns,
                selector.scores_,
            )
        )

        return {
            "success": True,
            "method": "chi_square",
            "selected_features": selected,
            "scores": scores,
            "dataframe": transformed_df,
        }

    @staticmethod
    def mutual_information(
        dataframe: pd.DataFrame,
        target: str,
    ) -> dict[str, Any]:
        """
        Rank features using Mutual Information.
        """

        ValidationService.validate_target(
            dataframe,
            target,
        )

        x = dataframe.drop(
            columns=[target]
        ).select_dtypes(
            include="number"
        )

        y = dataframe[target]

        scores = mutual_info_classif(
            x,
            y,
        )

        ranking = (
            pd.DataFrame(
                {
                    "feature": x.columns,
                    "score": scores,
                }
            )
            .sort_values(
                by="score",
                ascending=False,
            )
            .reset_index(drop=True)
        )

        return {
            "success": True,
            "method": "mutual_information",
            "ranking": ranking.to_dict(
                orient="records"
            ),
        }

    @staticmethod
    def pca(
        dataframe: pd.DataFrame,
        n_components: int = 2,
    ) -> dict[str, Any]:
        """
        Perform Principal Component Analysis.
        """

        ValidationService.validate_dataset(
            dataframe
        )

        x = dataframe.select_dtypes(
            include="number"
        )

        if n_components > x.shape[1]:
            raise ValueError(
                "n_components cannot exceed the number of numeric features."
            )

        pca = PCA(
            n_components=n_components
        )

        transformed = pca.fit_transform(
            x
        )

        columns = [
            f"PC{i + 1}"
            for i in range(n_components)
        ]

        transformed_df = pd.DataFrame(
            transformed,
            columns=columns,
            index=dataframe.index,
        )

        return {
            "success": True,
            "method": "pca",
            "explained_variance": (
                pca.explained_variance_ratio_.tolist()
            ),
            "components": columns,
            "dataframe": transformed_df,
        }

    @staticmethod
    def available_methods() -> list[str]:
        """
        Return supported feature selection methods.
        """

        return [
            "variance_threshold",
            "select_k_best",
            "chi_square",
            "mutual_information",
            "pca",
        ]

    @staticmethod
    def feature_ranking(
        dataframe: pd.DataFrame,
        target: str,
    ) -> dict[str, Any]:
        """
        Generate a complete feature ranking using
        Mutual Information.
        """

        return FeatureSelectionService.mutual_information(
            dataframe,
            target,
        )
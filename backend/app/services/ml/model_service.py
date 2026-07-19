from __future__ import annotations

from typing import Any

from sklearn.cluster import (
    AgglomerativeClustering,
    DBSCAN,
    KMeans,
)
from sklearn.ensemble import (
    ExtraTreesClassifier,
    ExtraTreesRegressor,
    GradientBoostingClassifier,
    GradientBoostingRegressor,
    RandomForestClassifier,
    RandomForestRegressor,
)
from sklearn.linear_model import (
    ElasticNet,
    Lasso,
    LinearRegression,
    LogisticRegression,
    Ridge,
)
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import (
    DecisionTreeClassifier,
    DecisionTreeRegressor,
)


class ModelService:
    """
    Enterprise Machine Learning Model Factory.

    Responsible only for creating model instances.

    This service does NOT train models.
    Training is handled by TrainingService.
    """

    REGRESSION_MODELS = {
        "linear_regression": LinearRegression,
        "ridge": Ridge,
        "lasso": Lasso,
        "elasticnet": ElasticNet,
        "decision_tree_regressor": DecisionTreeRegressor,
        "random_forest_regressor": RandomForestRegressor,
        "gradient_boosting_regressor": GradientBoostingRegressor,
        "extra_trees_regressor": ExtraTreesRegressor,
    }

    CLASSIFICATION_MODELS = {
        "logistic_regression": LogisticRegression,
        "decision_tree_classifier": DecisionTreeClassifier,
        "random_forest_classifier": RandomForestClassifier,
        "gradient_boosting_classifier": GradientBoostingClassifier,
        "extra_trees_classifier": ExtraTreesClassifier,
        "knn": KNeighborsClassifier,
        "naive_bayes": GaussianNB,
        "svm": SVC,
    }

    CLUSTERING_MODELS = {
        "kmeans": KMeans,
        "dbscan": DBSCAN,
        "agglomerative": AgglomerativeClustering,
    }

    @classmethod
    def create(
        cls,
        algorithm: str,
        **kwargs: Any,
    ) -> Any:
        """
        Create a machine learning model.

        Args:
            algorithm:
                Algorithm name.

            kwargs:
                Hyperparameters.

        Returns:
            Sklearn estimator.
        """

        algorithm = algorithm.lower()

        if algorithm in cls.REGRESSION_MODELS:

            return cls.REGRESSION_MODELS[
                algorithm
            ](**kwargs)

        if algorithm in cls.CLASSIFICATION_MODELS:

            return cls.CLASSIFICATION_MODELS[
                algorithm
            ](**kwargs)

        if algorithm in cls.CLUSTERING_MODELS:

            return cls.CLUSTERING_MODELS[
                algorithm
            ](**kwargs)

        raise ValueError(
            f"Unsupported algorithm '{algorithm}'."
        )

    @classmethod
    def available_models(
        cls,
    ) -> dict[str, list[str]]:
        """
        Return all supported models.
        """

        return {
            "regression": sorted(
                cls.REGRESSION_MODELS.keys()
            ),
            "classification": sorted(
                cls.CLASSIFICATION_MODELS.keys()
            ),
            "clustering": sorted(
                cls.CLUSTERING_MODELS.keys()
            ),
        }
    @classmethod
    def regression_models(
        cls,
    ) -> list[str]:
        """
        Return all supported regression models.

        Returns:
            List of regression model names.
        """

        return sorted(
            cls.REGRESSION_MODELS.keys()
        )

    @classmethod
    def classification_models(
        cls,
    ) -> list[str]:
        """
        Return all supported classification models.

        Returns:
            List of classification model names.
        """

        return sorted(
            cls.CLASSIFICATION_MODELS.keys()
        )

    @classmethod
    def clustering_models(
        cls,
    ) -> list[str]:
        """
        Return all supported clustering models.

        Returns:
            List of clustering model names.
        """

        return sorted(
            cls.CLUSTERING_MODELS.keys()
        )

    @classmethod
    def is_supported(
        cls,
        algorithm: str,
    ) -> bool:
        """
        Check whether an algorithm is supported.

        Args:
            algorithm: Algorithm name.

        Returns:
            True if supported.
        """

        algorithm = algorithm.lower()

        return (
            algorithm in cls.REGRESSION_MODELS
            or algorithm in cls.CLASSIFICATION_MODELS
            or algorithm in cls.CLUSTERING_MODELS
        )

    @classmethod
    def model_category(
        cls,
        algorithm: str,
    ) -> str:
        """
        Determine the category of a model.

        Args:
            algorithm: Algorithm name.

        Returns:
            Model category.

        Raises:
            ValueError
        """

        algorithm = algorithm.lower()

        if algorithm in cls.REGRESSION_MODELS:
            return "regression"

        if algorithm in cls.CLASSIFICATION_MODELS:
            return "classification"

        if algorithm in cls.CLUSTERING_MODELS:
            return "clustering"

        raise ValueError(
            f"Unsupported algorithm '{algorithm}'."
        )

    @classmethod
    def model_info(
        cls,
        algorithm: str,
    ) -> dict[str, Any]:
        """
        Return metadata about a supported model.

        Args:
            algorithm: Algorithm name.

        Returns:
            Dictionary containing model information.
        """

        category = cls.model_category(
            algorithm
        )

        model = cls.create(
            algorithm
        )

        return {
            "algorithm": algorithm,
            "category": category,
            "class_name": model.__class__.__name__,
            "parameters": model.get_params(),
        }

    @classmethod
    def default_parameters(
        cls,
        algorithm: str,
    ) -> dict[str, Any]:
        """
        Return the default hyperparameters of a model.

        Args:
            algorithm: Algorithm name.

        Returns:
            Default parameter dictionary.
        """

        model = cls.create(
            algorithm
        )

        return model.get_params()

    @classmethod
    def supported_categories(
        cls,
    ) -> list[str]:
        """
        Return all supported ML categories.
        """

        return [
            "regression",
            "classification",
            "clustering",
        ]
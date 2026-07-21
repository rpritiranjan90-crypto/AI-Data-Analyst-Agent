from __future__ import annotations

from typing import Any

from sklearn.cluster import (
    AgglomerativeClustering,
    DBSCAN,
    KMeans,
)
from sklearn.ensemble import (
    AdaBoostClassifier,
    AdaBoostRegressor,
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

try:
    from xgboost import (
        XGBClassifier,
        XGBRegressor,
    )

    XGBOOST_AVAILABLE = True

except Exception:
    XGBOOST_AVAILABLE = False


class ModelService:
    """
    Enterprise Machine Learning Model Service.

    Responsible only for creating machine learning models.
    Training, prediction and evaluation are handled by
    dedicated services.
    """

    CLASSIFICATION_MODELS = {
        "logistic_regression": LogisticRegression,
        "decision_tree": DecisionTreeClassifier,
        "random_forest": RandomForestClassifier,
        "gradient_boosting": GradientBoostingClassifier,
        "extra_trees": ExtraTreesClassifier,
        "adaboost": AdaBoostClassifier,
        "knn": KNeighborsClassifier,
        "svm": SVC,
        "naive_bayes": GaussianNB,
    }

    REGRESSION_MODELS = {
        "linear_regression": LinearRegression,
        "ridge": Ridge,
        "lasso": Lasso,
        "elasticnet": ElasticNet,
        "decision_tree": DecisionTreeRegressor,
        "random_forest": RandomForestRegressor,
        "gradient_boosting": GradientBoostingRegressor,
        "extra_trees": ExtraTreesRegressor,
        "adaboost": AdaBoostRegressor,
    }

    CLUSTERING_MODELS = {
        "kmeans": KMeans,
        "dbscan": DBSCAN,
        "agglomerative": AgglomerativeClustering,
    }

    if XGBOOST_AVAILABLE:
        CLASSIFICATION_MODELS["xgboost"] = XGBClassifier
        REGRESSION_MODELS["xgboost"] = XGBRegressor

    @classmethod
    def create(
        cls,
        algorithm: str,
        **kwargs: Any,
    ):
        """
        Create a machine learning model.
        """

        algorithm = algorithm.lower()

        if algorithm in cls.CLASSIFICATION_MODELS:

            if algorithm == "svm":
                kwargs.setdefault(
                    "probability",
                    True,
                )

            return cls.CLASSIFICATION_MODELS[
                algorithm
            ](**kwargs)

        if algorithm in cls.REGRESSION_MODELS:

            return cls.REGRESSION_MODELS[
                algorithm
            ](**kwargs)

        if algorithm in cls.CLUSTERING_MODELS:

            if algorithm == "kmeans":
                kwargs.setdefault(
                    "random_state",
                    42,
                )
                kwargs.setdefault(
                    "n_init",
                    10,
                )

            return cls.CLUSTERING_MODELS[
                algorithm
            ](**kwargs)

        raise ValueError(
            f"Unsupported algorithm '{algorithm}'."
        )

    @classmethod
    def model_category(
        cls,
        algorithm: str,
    ) -> str:

        algorithm = algorithm.lower()

        if algorithm in cls.CLASSIFICATION_MODELS:
            return "classification"

        if algorithm in cls.REGRESSION_MODELS:
            return "regression"

        if algorithm in cls.CLUSTERING_MODELS:
            return "clustering"

        raise ValueError(
            f"Unsupported algorithm '{algorithm}'."
        )

    @classmethod
    def available_models(cls):

        return {
            "classification": sorted(
                cls.CLASSIFICATION_MODELS.keys()
            ),
            "regression": sorted(
                cls.REGRESSION_MODELS.keys()
            ),
            "clustering": sorted(
                cls.CLUSTERING_MODELS.keys()
            ),
        }

    @classmethod
    def classification_models(cls):
        return sorted(
            cls.CLASSIFICATION_MODELS.keys()
        )

    @classmethod
    def regression_models(cls):
        return sorted(
            cls.REGRESSION_MODELS.keys()
        )

    @classmethod
    def clustering_models(cls):
        return sorted(
            cls.CLUSTERING_MODELS.keys()
        )

    @classmethod
    def supported_categories(cls):
        return [
            "classification",
            "regression",
            "clustering",
        ]

    @classmethod
    def is_supported(
        cls,
        algorithm: str,
    ) -> bool:

        algorithm = algorithm.lower()

        return (
            algorithm in cls.CLASSIFICATION_MODELS
            or algorithm in cls.REGRESSION_MODELS
            or algorithm in cls.CLUSTERING_MODELS
        )

    @classmethod
    def default_parameters(
        cls,
        algorithm: str,
    ):

        model = cls.create(
            algorithm
        )

        return model.get_params()

    @classmethod
    def model_info(
        cls,
        algorithm: str,
    ):

        model = cls.create(
            algorithm
        )

        return {
            "algorithm": algorithm,
            "category": cls.model_category(
                algorithm
            ),
            "class_name": model.__class__.__name__,
            "parameters": model.get_params(),
        }

    @classmethod
    def service_status(cls):

        return {
            "service": "ModelService",
            "status": "ready",
            "xgboost_available": XGBOOST_AVAILABLE,
            "classification_models": len(
                cls.CLASSIFICATION_MODELS
            ),
            "regression_models": len(
                cls.REGRESSION_MODELS
            ),
            "clustering_models": len(
                cls.CLUSTERING_MODELS
            ),
        }
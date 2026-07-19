from __future__ import annotations

# ==========================================================
# Application
# ==========================================================

APP_NAME = "AI Data Analyst Agent"

APP_VERSION = "1.0.0"

API_VERSION = "v1"

API_PREFIX = "/api/v1"

DEFAULT_ENCODING = "utf-8"

DEFAULT_TIMEZONE = "UTC"

# ==========================================================
# Machine Learning Problem Types
# ==========================================================

CLASSIFICATION = "classification"

REGRESSION = "regression"

CLUSTERING = "clustering"

SUPPORTED_PROBLEM_TYPES = (
    CLASSIFICATION,
    REGRESSION,
    CLUSTERING,
)

# ==========================================================
# Dataset
# ==========================================================

DEFAULT_TARGET_COLUMN = "target"

DEFAULT_TEST_SIZE = 0.20

DEFAULT_RANDOM_STATE = 42

DEFAULT_CV_FOLDS = 5

# ==========================================================
# Default Preprocessing
# ==========================================================

STANDARD_SCALER = "standard"

MINMAX_SCALER = "minmax"

ROBUST_SCALER = "robust"

MAXABS_SCALER = "maxabs"

NORMALIZER = "normalizer"

ONEHOT_ENCODER = "onehot"

LABEL_ENCODER = "label"

ORDINAL_ENCODER = "ordinal"

# ==========================================================
# Machine Learning Algorithms
# ==========================================================

LINEAR_REGRESSION = "linear_regression"

RIDGE = "ridge"

LASSO = "lasso"

ELASTIC_NET = "elastic_net"

LOGISTIC_REGRESSION = "logistic_regression"

DECISION_TREE_CLASSIFIER = "decision_tree_classifier"

DECISION_TREE_REGRESSOR = "decision_tree_regressor"

RANDOM_FOREST_CLASSIFIER = "random_forest_classifier"

RANDOM_FOREST_REGRESSOR = "random_forest_regressor"

GRADIENT_BOOSTING_CLASSIFIER = (
    "gradient_boosting_classifier"
)

GRADIENT_BOOSTING_REGRESSOR = (
    "gradient_boosting_regressor"
)

EXTRA_TREES_CLASSIFIER = (
    "extra_trees_classifier"
)

EXTRA_TREES_REGRESSOR = (
    "extra_trees_regressor"
)

K_NEIGHBORS = "knn"

GAUSSIAN_NAIVE_BAYES = (
    "gaussian_naive_bayes"
)

SUPPORT_VECTOR_MACHINE = "svm"

KMEANS = "kmeans"

DBSCAN = "dbscan"

AGGLOMERATIVE_CLUSTERING = (
    "agglomerative_clustering"
)
# ==========================================================
# Evaluation Metrics
# ==========================================================

ACCURACY = "accuracy"

PRECISION = "precision"

RECALL = "recall"

F1_SCORE = "f1"

ROC_AUC = "roc_auc"

LOG_LOSS = "log_loss"

MAE = "mae"

MSE = "mse"

RMSE = "rmse"

R2_SCORE = "r2"

MAPE = "mape"

SILHOUETTE_SCORE = (
    "silhouette_score"
)

DAVIES_BOULDIN_SCORE = (
    "davies_bouldin_score"
)

CALINSKI_HARABASZ_SCORE = (
    "calinski_harabasz_score"
)

# ==========================================================
# Supported File Types
# ==========================================================

CSV_EXTENSION = ".csv"

XLSX_EXTENSION = ".xlsx"

XLS_EXTENSION = ".xls"

JSON_EXTENSION = ".json"

PARQUET_EXTENSION = ".parquet"

SUPPORTED_DATASET_EXTENSIONS = (
    CSV_EXTENSION,
    XLSX_EXTENSION,
    XLS_EXTENSION,
    JSON_EXTENSION,
    PARQUET_EXTENSION,
)

# ==========================================================
# HTTP Headers
# ==========================================================

HEADER_REQUEST_ID = "X-Request-ID"

HEADER_PROCESS_TIME = "X-Process-Time"

HEADER_CONTENT_TYPE = "Content-Type"

HEADER_AUTHORIZATION = "Authorization"

HEADER_ACCEPT = "Accept"

# ==========================================================
# MIME Types
# ==========================================================

MIME_CSV = "text/csv"

MIME_JSON = "application/json"

MIME_XLSX = (
    "application/vnd.openxmlformats-officedocument."
    "spreadsheetml.sheet"
)

MIME_XLS = "application/vnd.ms-excel"

MIME_PARQUET = "application/octet-stream"

# ==========================================================
# Directory Names
# ==========================================================

UPLOADS_DIRECTORY = "uploads"

DATASETS_DIRECTORY = "datasets"

CACHE_DIRECTORY = "cache"

MODELS_DIRECTORY = "models"

EXPORTS_DIRECTORY = "exports"

LOGS_DIRECTORY = "logs"

# ==========================================================
# Cache Keys
# ==========================================================

DATASET_CACHE_KEY = "dataset"

MODEL_CACHE_KEY = "model"

PREPROCESSOR_CACHE_KEY = "preprocessor"

METADATA_CACHE_KEY = "metadata"

AUTOML_CACHE_KEY = "automl"

# ==========================================================
# Metadata Categories
# ==========================================================

DATASET_METADATA_CATEGORY = "dataset_metadata"

MODEL_METADATA_CATEGORY = "model_metadata"

REPORT_METADATA_CATEGORY = "report_metadata"
# ==========================================================
# Logging
# ==========================================================

LOG_FORMAT = (
    "%(asctime)s | "
    "%(levelname)s | "
    "%(name)s | "
    "%(message)s"
)

LOG_DATE_FORMAT = "%Y-%m-%d %H:%M:%S"

# ==========================================================
# Miscellaneous
# ==========================================================

UTF8 = "utf-8"

EMPTY_STRING = ""

DEFAULT_SEPARATOR = ","

NEW_LINE = "\n"


__all__ = [
    # ======================================================
    # Application
    # ======================================================
    "APP_NAME",
    "APP_VERSION",
    "API_VERSION",
    "API_PREFIX",
    "DEFAULT_ENCODING",
    "DEFAULT_TIMEZONE",

    # ======================================================
    # Machine Learning Problem Types
    # ======================================================
    "CLASSIFICATION",
    "REGRESSION",
    "CLUSTERING",
    "SUPPORTED_PROBLEM_TYPES",

    # ======================================================
    # Dataset
    # ======================================================
    "DEFAULT_TARGET_COLUMN",
    "DEFAULT_TEST_SIZE",
    "DEFAULT_RANDOM_STATE",
    "DEFAULT_CV_FOLDS",

    # ======================================================
    # Preprocessing
    # ======================================================
    "STANDARD_SCALER",
    "MINMAX_SCALER",
    "ROBUST_SCALER",
    "MAXABS_SCALER",
    "NORMALIZER",
    "ONEHOT_ENCODER",
    "LABEL_ENCODER",
    "ORDINAL_ENCODER",

    # ======================================================
    # Algorithms
    # ======================================================
    "LINEAR_REGRESSION",
    "RIDGE",
    "LASSO",
    "ELASTIC_NET",
    "LOGISTIC_REGRESSION",
    "DECISION_TREE_CLASSIFIER",
    "DECISION_TREE_REGRESSOR",
    "RANDOM_FOREST_CLASSIFIER",
    "RANDOM_FOREST_REGRESSOR",
    "GRADIENT_BOOSTING_CLASSIFIER",
    "GRADIENT_BOOSTING_REGRESSOR",
    "EXTRA_TREES_CLASSIFIER",
    "EXTRA_TREES_REGRESSOR",
    "K_NEIGHBORS",
    "GAUSSIAN_NAIVE_BAYES",
    "SUPPORT_VECTOR_MACHINE",
    "KMEANS",
    "DBSCAN",
    "AGGLOMERATIVE_CLUSTERING",

    # ======================================================
    # Metrics
    # ======================================================
    "ACCURACY",
    "PRECISION",
    "RECALL",
    "F1_SCORE",
    "ROC_AUC",
    "LOG_LOSS",
    "MAE",
    "MSE",
    "RMSE",
    "R2_SCORE",
    "MAPE",
    "SILHOUETTE_SCORE",
    "DAVIES_BOULDIN_SCORE",
    "CALINSKI_HARABASZ_SCORE",

    # ======================================================
    # File Types
    # ======================================================
    "CSV_EXTENSION",
    "XLSX_EXTENSION",
    "XLS_EXTENSION",
    "JSON_EXTENSION",
    "PARQUET_EXTENSION",
    "SUPPORTED_DATASET_EXTENSIONS",

    # ======================================================
    # HTTP Headers
    # ======================================================
    "HEADER_REQUEST_ID",
    "HEADER_PROCESS_TIME",
    "HEADER_CONTENT_TYPE",
    "HEADER_AUTHORIZATION",
    "HEADER_ACCEPT",

    # ======================================================
    # MIME Types
    # ======================================================
    "MIME_CSV",
    "MIME_JSON",
    "MIME_XLSX",
    "MIME_XLS",
    "MIME_PARQUET",

    # ======================================================
    # Directories
    # ======================================================
    "UPLOADS_DIRECTORY",
    "DATASETS_DIRECTORY",
    "CACHE_DIRECTORY",
    "MODELS_DIRECTORY",
    "EXPORTS_DIRECTORY",
    "LOGS_DIRECTORY",

    # ======================================================
    # Cache Keys
    # ======================================================
    "DATASET_CACHE_KEY",
    "MODEL_CACHE_KEY",
    "PREPROCESSOR_CACHE_KEY",
    "METADATA_CACHE_KEY",
    "AUTOML_CACHE_KEY",

    # ======================================================
    # Metadata Categories
    # ======================================================
    "DATASET_METADATA_CATEGORY",
    "MODEL_METADATA_CATEGORY",
    "REPORT_METADATA_CATEGORY",

    # ======================================================
    # Logging
    # ======================================================
    "LOG_FORMAT",
    "LOG_DATE_FORMAT",

    # ======================================================
    # Miscellaneous
    # ======================================================
    "UTF8",
    "EMPTY_STRING",
    "DEFAULT_SEPARATOR",
    "NEW_LINE",
]
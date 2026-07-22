"""
Application-wide constants for the AI Data Analyst backend.
"""

from __future__ import annotations


# ==========================================================
# API
# ==========================================================

API_NAME = "AI Data Analyst Agent"
API_VERSION = "1.0.0"

SUCCESS = "success"
FAILED = "failed"


# ==========================================================
# Dataset
# ==========================================================

DEFAULT_DATASET_NAME = "dataset"

SUPPORTED_FILE_TYPES = (
    ".csv",
    ".xlsx",
    ".xls",
    ".json",
)


# ==========================================================
# Machine Learning
# ==========================================================

CLASSIFICATION = "classification"
REGRESSION = "regression"
CLUSTERING = "clustering"

DEFAULT_RANDOM_STATE = 42

DEFAULT_TEST_SIZE = 0.2

DEFAULT_CV = 5


# ==========================================================
# Models
# ==========================================================

LINEAR_REGRESSION = "linear_regression"
LOGISTIC_REGRESSION = "logistic_regression"
DECISION_TREE = "decision_tree"
RANDOM_FOREST = "random_forest"
EXTRA_TREES = "extra_trees"
KNN = "knn"
SVM = "svm"
NAIVE_BAYES = "naive_bayes"
XGBOOST = "xgboost"
LIGHTGBM = "lightgbm"


# ==========================================================
# Charts
# ==========================================================

BAR = "bar"
LINE = "line"
PIE = "pie"
SCATTER = "scatter"
HISTOGRAM = "histogram"
BOX = "box"
HEATMAP = "heatmap"


# ==========================================================
# Report
# ==========================================================

REPORT_FOLDER = "reports"

CHART_FOLDER = "generated_charts"

UPLOAD_FOLDER = "uploads"

MODEL_FOLDER = "saved_models"


# ==========================================================
# Logging
# ==========================================================

LOG_FOLDER = "logs"

LOG_FILE = "application.log"
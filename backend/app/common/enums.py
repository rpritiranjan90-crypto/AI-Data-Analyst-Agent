"""
Application enums for the AI Data Analyst backend.
"""

from __future__ import annotations

from enum import Enum


# ==========================================================
# Response
# ==========================================================

class ResponseStatus(str, Enum):
    SUCCESS = "success"
    FAILED = "failed"


# ==========================================================
# Machine Learning Task
# ==========================================================

class MLTask(str, Enum):
    CLASSIFICATION = "classification"
    REGRESSION = "regression"
    CLUSTERING = "clustering"


# ==========================================================
# Chart Types
# ==========================================================

class ChartType(str, Enum):
    BAR = "bar"
    LINE = "line"
    PIE = "pie"
    SCATTER = "scatter"
    HISTOGRAM = "histogram"
    BOX = "box"
    HEATMAP = "heatmap"


# ==========================================================
# Dataset Status
# ==========================================================

class DatasetStatus(str, Enum):
    NOT_LOADED = "not_loaded"
    LOADED = "loaded"
    CLEANED = "cleaned"
    ANALYZED = "analyzed"


# ==========================================================
# Report Format
# ==========================================================

class ReportFormat(str, Enum):
    PDF = "pdf"
    HTML = "html"
    JSON = "json"


# ==========================================================
# File Types
# ==========================================================

class FileType(str, Enum):
    CSV = ".csv"
    XLSX = ".xlsx"
    XLS = ".xls"
    JSON = ".json"


# ==========================================================
# Model Status
# ==========================================================

class ModelStatus(str, Enum):
    NOT_TRAINED = "not_trained"
    TRAINING = "training"
    TRAINED = "trained"
    FAILED = "failed"


# ==========================================================
# AI Modules
# ==========================================================

class AIModule(str, Enum):
    ANALYSIS = "analysis"
    CLEANING = "cleaning"
    VISUALIZATION = "visualization"
    RECOMMENDATION = "recommendation"
    ML = "ml"
    REPORT = "report"
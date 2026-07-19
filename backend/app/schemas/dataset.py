from __future__ import annotations

from typing import Any, Dict, List

from pydantic import BaseModel


class DatasetMetadata(BaseModel):
    """
    Metadata about the uploaded dataset.
    """

    filename: str
    extension: str
    rows: int
    columns: int
    column_names: List[str]
    memory_usage_mb: float
    missing_values: int
    duplicate_rows: int
    upload_time: str


class DatasetProfile(BaseModel):
    """
    Dataset profiling information.
    """

    rows: int
    columns: int
    numeric_columns: List[str]
    categorical_columns: List[str]
    datetime_columns: List[str]
    boolean_columns: List[str]
    missing_values: Dict[str, int]
    unique_values: Dict[str, int]
    data_types: Dict[str, str]


class DatasetAnalysisResult(BaseModel):
    """
    Result returned by DatasetService after loading a dataset.
    """

    metadata: DatasetMetadata
    profile: DatasetProfile
    statistics: Dict[str, Any]


class UploadResponse(BaseModel):
    """
    API response for dataset upload.
    """

    success: bool
    message: str
    metadata: DatasetMetadata
    profile: DatasetProfile
    statistics: Dict[str, Any]


__all__ = [
    "DatasetMetadata",
    "DatasetProfile",
    "DatasetAnalysisResult",
    "UploadResponse",
]
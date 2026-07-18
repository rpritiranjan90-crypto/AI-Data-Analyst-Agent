from pydantic import BaseModel
from typing import Dict, List, Any


class DatasetMetadata(BaseModel):
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
    rows: int
    columns: int
    numeric_columns: List[str]
    categorical_columns: List[str]
    datetime_columns: List[str]
    boolean_columns: List[str]
    missing_values: Dict[str, int]
    unique_values: Dict[str, int]
    data_types: Dict[str, str]


class UploadResponse(BaseModel):
    success: bool
    message: str
    metadata: DatasetMetadata
    profile: DatasetProfile
    statistics: Dict[str, Any]
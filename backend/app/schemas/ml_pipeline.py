from __future__ import annotations

from typing import Any

import pandas as pd
from pydantic import BaseModel, Field, ConfigDict


# ---------------------------------------------------------
# Training Request
# ---------------------------------------------------------


class TrainingRequest(BaseModel):
    """
    Request schema for training a machine learning model.
    """

    target: str = Field(
        ...,
        description="Target column name.",
    )

    algorithm: str | None = Field(
        default=None,
        description="Machine learning algorithm. If omitted, the pipeline selects a default algorithm.",
    )

    test_size: float = Field(
        default=0.2,
        ge=0.05,
        le=0.50,
        description="Percentage of data reserved for testing.",
    )

    random_state: int = Field(
        default=42,
        description="Random seed.",
    )


# ---------------------------------------------------------
# Prediction Request
# ---------------------------------------------------------


class PredictionRequest(BaseModel):
    """
    Batch prediction request.
    """

    records: list[dict[str, Any]]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "records": [
                    {
                        "age": 35,
                        "salary": 52000,
                        "city": "Delhi",
                    },
                    {
                        "age": 42,
                        "salary": 71000,
                        "city": "Mumbai",
                    },
                ]
            }
        }
    )

    def to_dataframe(self) -> pd.DataFrame:
        return pd.DataFrame(self.records)


# ---------------------------------------------------------
# Single Prediction Request
# ---------------------------------------------------------


class SinglePredictionRequest(BaseModel):
    """
    Single prediction request.
    """

    data: dict[str, Any]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "data": {
                    "age": 30,
                    "salary": 48000,
                    "city": "Bhubaneswar",
                }
            }
        }
    )


# ---------------------------------------------------------
# Prediction Response
# ---------------------------------------------------------


class PredictionResponse(BaseModel):
    """
    Batch prediction response.
    """

    success: bool

    result: dict[str, Any]


# ---------------------------------------------------------
# Probability Prediction Response
# ---------------------------------------------------------


class ProbabilityPredictionResponse(BaseModel):
    """
    Probability prediction response.
    """

    success: bool

    result: dict[str, Any]


# ---------------------------------------------------------
# Training Response
# ---------------------------------------------------------


class TrainingResponse(BaseModel):
    """
    Training response.
    """

    success: bool

    pipeline: str

    steps: list[dict[str, Any]]

    warnings: list[str]

    errors: list[str]

    results: dict[str, Any]

    summary: dict[str, Any]


# ---------------------------------------------------------
# Pipeline Status Response
# ---------------------------------------------------------


class PipelineStatusResponse(BaseModel):
    """
    ML pipeline status.
    """

    dataset_loaded: bool

    trained: bool

    prediction: dict[str, Any]

    artifacts: dict[str, Any]


# ---------------------------------------------------------
# Metadata Response
# ---------------------------------------------------------


class MetadataResponse(BaseModel):
    """
    Model metadata response.
    """

    success: bool

    metadata: dict[str, Any]


# ---------------------------------------------------------
# Health Response
# ---------------------------------------------------------


class HealthResponse(BaseModel):
    """
    Pipeline health response.
    """

    pipeline: str

    status: str

    dataset_loaded: bool

    trained: bool

    prediction: dict[str, Any]

    artifacts: dict[str, Any]
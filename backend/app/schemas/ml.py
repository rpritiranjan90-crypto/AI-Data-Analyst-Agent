from __future__ import annotations

from typing import Any

from pydantic import BaseModel
from pydantic import ConfigDict
from pydantic import Field


class DatasetRequest(BaseModel):
    """
    Base dataset request.
    """

    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
    )

    data: list[dict[str, Any]] = Field(
        ...,
        min_length=1,
        description="Dataset records.",
    )


class TargetDatasetRequest(DatasetRequest):
    """
    Dataset request containing a target column.
    """

    target: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Target column.",
    )


class PredictionRequest(DatasetRequest):
    """
    Prediction request.
    """

    pass


class SaveModelRequest(BaseModel):
    """
    Save model request.
    """

    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
    )

    model_name: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )


class LoadModelRequest(BaseModel):
    """
    Load model request.
    """

    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
    )

    model_name: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )
class ModelInfo(BaseModel):
    """
    Information about a persisted machine learning model.
    """

    model_config = ConfigDict(
        extra="forbid",
    )

    model_name: str = Field(
        ...,
        description="Unique model name.",
    )

    algorithm: str = Field(
        ...,
        description="Algorithm used by the model.",
    )

    file_name: str = Field(
        ...,
        description="Model file name.",
    )

    file_path: str = Field(
        ...,
        description="Absolute model path.",
    )

    size_bytes: int = Field(
        ...,
        ge=0,
        description="Model size in bytes.",
    )

    created_at: str = Field(
        ...,
        description="Creation timestamp.",
    )

    modified_at: str = Field(
        ...,
        description="Last modification timestamp.",
    )


class ModelList(BaseModel):
    """
    Collection of registered models.
    """

    model_config = ConfigDict(
        extra="forbid",
    )

    models: list[ModelInfo]


class LeaderboardEntry(BaseModel):
    """
    AutoML leaderboard entry.
    """

    model_config = ConfigDict(
        extra="forbid",
    )

    rank: int = Field(
        ...,
        ge=1,
    )

    model: str

    score: float

    evaluation: dict[str, Any] | None = None


class PredictionResult(BaseModel):
    """
    Prediction output.
    """

    model_config = ConfigDict(
        extra="forbid",
    )

    predictions: list[Any]

    prediction_rows: int = Field(
        ...,
        ge=0,
    )


class RecommendationResult(BaseModel):
    """
    Recommendation output.
    """

    model_config = ConfigDict(
        extra="forbid",
    )

    recommended_scaler: str

    recommended_encoder: str

    feature_selection: str | None = None

    recommended_models: list[str]

    recommended_metrics: list[str]

    problem_type: str
class AutoMLResult(BaseModel):
    """
    AutoML execution result.
    """

    model_config = ConfigDict(
        extra="forbid",
    )

    problem_type: str = Field(
        ...,
        description="Detected machine learning problem type.",
    )

    best_model: str = Field(
        ...,
        description="Best performing model.",
    )

    best_score: float = Field(
        ...,
        description="Best evaluation score.",
    )

    models_tested: int = Field(
        ...,
        ge=0,
        description="Number of evaluated models.",
    )

    leaderboard: list[LeaderboardEntry] = Field(
        default_factory=list,
        description="Ranked leaderboard.",
    )


class ExplainabilityResult(BaseModel):
    """
    Explainability result.
    """

    model_config = ConfigDict(
        extra="forbid",
    )

    model_name: str = Field(
        ...,
        description="Model name.",
    )

    explanation: str = Field(
        ...,
        description="Generated explanation.",
    )

    feature_importance: list[dict[str, Any]] | None = Field(
        default=None,
        description="Feature importance values.",
    )

    coefficients: list[dict[str, Any]] | None = Field(
        default=None,
        description="Linear model coefficients.",
    )


class PredictionSummary(BaseModel):
    """
    Prediction summary.
    """

    model_config = ConfigDict(
        extra="forbid",
    )

    total_predictions: int = Field(
        ...,
        ge=0,
    )

    model_name: str

    execution_time: float | None = Field(
        default=None,
        ge=0,
        description="Execution time in seconds.",
    )


class RecommendationSummary(BaseModel):
    """
    Recommendation summary.
    """

    model_config = ConfigDict(
        extra="forbid",
    )

    problem_type: str

    best_model: str

    recommended_scaler: str

    recommended_encoder: str

    recommended_models: list[str]

    recommended_metrics: list[str]


__all__ = [
    # Request Models
    "DatasetRequest",
    "TargetDatasetRequest",
    "PredictionRequest",
    "SaveModelRequest",
    "LoadModelRequest",

    # Domain Models
    "ModelInfo",
    "ModelList",
    "LeaderboardEntry",
    "PredictionResult",
    "PredictionSummary",
    "RecommendationResult",
    "RecommendationSummary",
    "AutoMLResult",
    "ExplainabilityResult",
]
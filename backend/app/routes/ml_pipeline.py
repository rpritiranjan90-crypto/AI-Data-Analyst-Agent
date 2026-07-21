from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.schemas.ml_pipeline import (
    PredictionRequest,
    SinglePredictionRequest,
    TrainingRequest,
)
from app.workflows.ml_pipeline import MLPipeline

router = APIRouter(
    prefix="/ml",
    tags=["Machine Learning"],
)


# ---------------------------------------------------------
# Train Model
# ---------------------------------------------------------


@router.post("/train")
def train_model(
    request: TrainingRequest,
):
    """
    Execute the complete ML training pipeline.
    """

    pipeline = MLPipeline()

    try:

        return pipeline.execute(
            target=request.target,
            algorithm=request.algorithm,
            test_size=request.test_size,
            random_state=request.random_state,
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# ---------------------------------------------------------
# Batch Prediction
# ---------------------------------------------------------


@router.post("/predict")
def predict(
    request: PredictionRequest,
):
    """
    Predict multiple records.
    """

    pipeline = MLPipeline()

    try:

        return pipeline.predict(
            request.to_dataframe()
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# ---------------------------------------------------------
# Single Prediction
# ---------------------------------------------------------


@router.post("/predict-single")
def predict_single(
    request: SinglePredictionRequest,
):
    """
    Predict a single record.
    """

    pipeline = MLPipeline()

    try:

        return pipeline.predict_single(
            request.data
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# ---------------------------------------------------------
# Probability Prediction
# ---------------------------------------------------------


@router.post("/predict-probability")
def predict_probability(
    request: PredictionRequest,
):
    """
    Predict class probabilities.
    """

    pipeline = MLPipeline()

    try:

        return pipeline.predict_probability(
            request.to_dataframe()
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


# ---------------------------------------------------------
# Pipeline Status
# ---------------------------------------------------------


@router.get("/status")
def status():
    """
    Return pipeline status.
    """

    pipeline = MLPipeline()

    return pipeline.status()


# ---------------------------------------------------------
# Health
# ---------------------------------------------------------


@router.get("/health")
def health():
    """
    Health check.
    """

    pipeline = MLPipeline()

    return pipeline.health()


# ---------------------------------------------------------
# Metadata
# ---------------------------------------------------------


@router.get("/metadata")
def metadata():
    """
    Model metadata.
    """

    pipeline = MLPipeline()

    return pipeline.metadata()


# ---------------------------------------------------------
# Artifacts
# ---------------------------------------------------------


@router.get("/artifacts")
def artifacts():
    """
    Artifact registry.
    """

    pipeline = MLPipeline()

    return pipeline.artifacts()


# ---------------------------------------------------------
# Available Models
# ---------------------------------------------------------


@router.get("/models")
def available_models():
    """
    Supported machine learning models.
    """

    pipeline = MLPipeline()

    return pipeline.available_models()


# ---------------------------------------------------------
# Training Summary
# ---------------------------------------------------------


@router.get("/training-summary")
def training_summary():
    """
    Latest training summary.
    """

    pipeline = MLPipeline()

    return pipeline.training_summary()


# ---------------------------------------------------------
# Reset Pipeline
# ---------------------------------------------------------


@router.post("/reset")
def reset():
    """
    Reset the machine learning pipeline.
    """

    pipeline = MLPipeline()

    return pipeline.reset()
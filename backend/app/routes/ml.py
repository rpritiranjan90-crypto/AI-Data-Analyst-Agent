from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.services.ml.automl_service import (
    AutoMLService,
)
from app.services.ml.explainability_service import (
    ExplainabilityService,
)
from app.services.ml.model_registry import (
    ModelRegistry,
)
from app.services.ml.prediction_service import (
    PredictionService,
)
from app.services.ml.recommendation_service import (
    RecommendationService,
)

router = APIRouter(
    prefix="/ml",
    tags=["Machine Learning"],
)


@router.get(
    "/status",
    summary="Machine Learning Service Status",
)
async def ml_status():
    """
    Return the overall ML service status.
    """

    return {
        "status": "ready",
        "services": {
            "automl": AutoMLService.service_status(),
            "recommendation": RecommendationService.recommendation_status(),
            "explainability": ExplainabilityService.service_status(),
        },
    }


@router.get(
    "/models",
    summary="List Saved Models",
)
async def list_models():
    """
    List all saved models.
    """

    try:
        return ModelRegistry.registry_summary()

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.get(
    "/models/{model_name}",
    summary="Model Information",
)
async def model_info(
    model_name: str,
):
    """
    Return information about a saved model.
    """

    try:
        return ModelRegistry.model_info(
            model_name
        )

    except Exception as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        )


@router.delete(
    "/models/{model_name}",
    summary="Delete Model",
)
async def delete_model(
    model_name: str,
):
    """
    Delete a saved model.
    """

    try:
        return ModelRegistry.delete_model(
            model_name
        )

    except Exception as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        )


@router.post(
    "/models/{model_name}/load",
    summary="Load Model",
)
async def load_model(
    model_name: str,
):
    """
    Load a saved model into the registry.
    """

    try:
        ModelRegistry.load_model(
            model_name
        )

        return {
            "success": True,
            "message": f"Model '{model_name}' loaded successfully.",
        }

    except Exception as error:
        raise HTTPException(
            status_code=404,
            detail=str(error),
        )
from fastapi import Body

import pandas as pd


@router.post(
    "/automl",
    summary="Run AutoML",
)
async def run_automl(
    payload: dict = Body(...),
):
    """
    Automatically preprocess, train, compare,
    and select the best machine learning model.
    """

    try:

        dataframe = pd.DataFrame(
            payload["data"]
        )

        target = payload["target"]

        return AutoMLService.compare_models(
            dataframe,
            target,
        )

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.post(
    "/recommendation",
    summary="Generate Recommendations",
)
async def recommendation(
    payload: dict = Body(...),
):
    """
    Generate preprocessing and model
    recommendations.
    """

    try:

        dataframe = pd.DataFrame(
            payload["data"]
        )

        target = payload["target"]

        return RecommendationService.recommend(
            dataframe,
            target,
        )

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.post(
    "/predict",
    summary="Predict",
)
async def predict(
    payload: dict = Body(...),
):
    """
    Predict using the currently loaded model.
    """

    try:

        dataframe = pd.DataFrame(
            payload["data"]
        )

        return PredictionService.predict_registered(
            dataframe
        )

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.post(
    "/explain",
    summary="Explain Prediction",
)
async def explain_prediction(
    payload: dict = Body(...),
):
    """
    Generate prediction explanations.
    """

    try:

        dataframe = pd.DataFrame(
            payload["data"]
        )

        return ExplainabilityService.local_explanation(
            dataframe
        )

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.get(
    "/explainability",
    summary="Explainability Summary",
)
async def explainability():
    """
    Return explainability information.
    """

    try:

        return (
            ExplainabilityService.explainability_summary()
        )

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )
@router.post(
    "/models/{model_name}/save",
    summary="Save Current Model",
)
async def save_model(
    model_name: str,
):
    """
    Save the currently loaded model.
    """

    try:

        return ModelRegistry.save_registered_model(
            model_name
        )

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


@router.get(
    "/leaderboard",
    summary="Available AutoML Models",
)
async def leaderboard():
    """
    Return the supported AutoML models.
    """

    try:

        return {
            "supported_models": (
                AutoMLService.available_models()
            )
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.get(
    "/recommendations",
    summary="Available Recommendations",
)
async def available_recommendations():
    """
    Return all supported recommendation types.
    """

    try:

        return {
            "recommendations":
            RecommendationService.available_recommendations()
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.get(
    "/health",
    summary="ML Health Check",
)
async def health():
    """
    Machine Learning module health check.
    """

    return {
        "status": "healthy",
        "router": "ml",
        "services": {
            "automl": "ready",
            "recommendation": "ready",
            "prediction": "ready",
            "explainability": "ready",
            "model_registry": "ready",
        },
    }


@router.get(
    "/summary",
    summary="ML Module Summary",
)
async def summary():
    """
    Return an overview of the Machine Learning module.
    """

    return {
        "module": "Machine Learning",
        "status": "ready",
        "features": {
            "automl": True,
            "prediction": True,
            "recommendation": True,
            "explainability": True,
            "model_registry": True,
        },
        "supported_problem_types": [
            "classification",
            "regression",
        ],
    }
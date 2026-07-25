from __future__ import annotations

from fastapi import APIRouter, HTTPException, Body
import pandas as pd

from app.services.ml.automl_service import AutoMLService
from app.services.ml.explainability_service import ExplainabilityService
from app.services.ml.model_registry import ModelRegistry
from app.services.ml.prediction_service import PredictionService
from app.services.ml.recommendation_service import RecommendationService
from app.services.anomaly_detection_service import AnomalyDetectionService

router = APIRouter(
    prefix="/ml",
    tags=["Machine Learning"],
)


@router.get(
    "/status",
    summary="Machine Learning Service Status",
)
async def ml_status():
    return {
        "status": "ready",
        "services": {
            "automl": AutoMLService.service_status(),
            "recommendation": RecommendationService.recommendation_status(),
            "explainability": ExplainabilityService.service_status(),
            "anomaly_detection": "ready",
        },
    }


@router.get(
    "/models",
    summary="List Saved Models",
)
async def list_models():
    try:
        return ModelRegistry.registry_summary()
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get(
    "/models/{model_name}",
    summary="Model Information",
)
async def model_info(model_name: str):
    try:
        return ModelRegistry.model_info(model_name)
    except Exception as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.delete(
    "/models/{model_name}",
    summary="Delete Model",
)
async def delete_model(model_name: str):
    try:
        return ModelRegistry.delete_model(model_name)
    except Exception as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.post(
    "/models/{model_name}/load",
    summary="Load Model",
)
async def load_model(model_name: str):
    try:
        ModelRegistry.load_model(model_name)
        return {"success": True, "message": f"Model '{model_name}' loaded successfully."}
    except Exception as error:
        raise HTTPException(status_code=404, detail=str(error))


@router.post(
    "/automl",
    summary="Run AutoML",
)
async def run_automl(payload: dict = Body(...)):
    try:
        dataframe = pd.DataFrame(payload["data"])
        target = payload["target"]
        return AutoMLService.compare_models(dataframe, target)
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post(
    "/recommendation",
    summary="Generate Recommendations",
)
async def recommendation(payload: dict = Body(...)):
    try:
        dataframe = pd.DataFrame(payload["data"])
        target = payload["target"]
        return RecommendationService.recommend(dataframe, target)
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post(
    "/predict",
    summary="Predict",
)
async def predict(payload: dict = Body(...)):
    try:
        dataframe = pd.DataFrame(payload["data"])
        return PredictionService.predict_registered(dataframe)
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post(
    "/explain",
    summary="Explain Prediction",
)
async def explain_prediction(payload: dict = Body(...)):
    try:
        dataframe = pd.DataFrame(payload["data"])
        return ExplainabilityService.local_explanation(dataframe)
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get(
    "/explainability",
    summary="Explainability Summary",
)
async def explainability():
    try:
        return ExplainabilityService.explainability_summary()
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.post(
    "/models/{model_name}/save",
    summary="Save Current Model",
)
async def save_model(model_name: str):
    try:
        return ModelRegistry.save_registered_model(model_name)
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error))


@router.get(
    "/leaderboard",
    summary="Available AutoML Models",
)
async def leaderboard():
    try:
        return {
            "classification": AutoMLService.available_models("classification"),
            "regression": AutoMLService.available_models("regression"),
        }
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get(
    "/recommendations",
    summary="Available Recommendations",
)
async def available_recommendations():
    try:
        return {"recommendations": RecommendationService.available_recommendations()}
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get(
    "/health",
    summary="ML Health Check",
)
async def health():
    return {
        "status": "healthy",
        "router": "ml",
        "services": {
            "automl": "ready",
            "recommendation": "ready",
            "prediction": "ready",
            "explainability": "ready",
            "model_registry": "ready",
            "anomaly_detection": "ready",
        },
    }


@router.post(
    "/detect-anomalies",
    summary="Isolation Forest Anomaly & Fraud Detection Radar",
)
async def detect_anomalies(contamination: float = 0.05):
    try:
        return AnomalyDetectionService.detect_anomalies(contamination)
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@router.get(
    "/summary",
    summary="ML Module Summary",
)
async def summary():
    return {
        "module": "Machine Learning",
        "status": "ready",
        "features": {
            "automl": True,
            "prediction": True,
            "recommendation": True,
            "explainability": True,
            "model_registry": True,
            "anomaly_detection": True,
        },
        "supported_problem_types": [
            "classification",
            "regression",
            "anomaly_detection",
        ],
    }
from fastapi import APIRouter
from app.services.dataset_service import analyze_dataset, dataset_summary
router = APIRouter()

@router.get("/analyze")
def analyze():
    return analyze_dataset()

@router.get("/summary")
def summary():
    return dataset_summary()
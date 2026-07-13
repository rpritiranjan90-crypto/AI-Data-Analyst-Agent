from fastapi import APIRouter
from app.services.cleaning_service import clean_dataset

router = APIRouter()

@router.post("/clean")
def clean():
    return clean_dataset()
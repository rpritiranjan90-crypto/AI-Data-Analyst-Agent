import os

from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def home():
    return {
        "project": "AI Data Analyst Agent",
        "developer": "Pritiranjan Rout",
        "version": os.environ.get("APP_VERSION", "2.0.0"),
        "status": "Backend Running Successfully"
    }
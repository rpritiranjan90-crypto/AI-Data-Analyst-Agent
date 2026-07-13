from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def home():
    return {
        "project": "AI Data Analyst Agent",
        "developer": "Pritiranjan Rout",
        "version": "1.0.0",
        "status": "Backend Running Successfully"
    }
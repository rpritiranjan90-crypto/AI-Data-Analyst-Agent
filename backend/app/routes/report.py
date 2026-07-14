from fastapi import APIRouter
from app.services.report_service import generate_report

router = APIRouter(tags=["Report"])


@router.get("/generate-report")
def report():
    return generate_report()
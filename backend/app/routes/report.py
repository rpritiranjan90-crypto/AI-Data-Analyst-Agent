from fastapi import APIRouter

from app.services.report_service import (
    generate_report,
    list_reports,
    download_report,
    delete_report
)

router = APIRouter(tags=["Report"])


@router.get("/generate-report")
def report():
    return generate_report()


@router.get("/reports")
def reports():
    return list_reports()


@router.get("/download-report/{filename}")
def download(filename: str):
    return download_report(filename)


@router.delete("/delete-report/{filename}")
def delete(filename: str):
    return delete_report(filename)
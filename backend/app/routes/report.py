from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import traceback

from app.services.report_service import (
    generate_report,
    list_reports,
    download_report,
    delete_report,
)
from app.services.pptx_generator_service import generate_pptx_deck

router = APIRouter(tags=["Report"])


@router.get("/generate-report")
def report():
    try:
        return generate_report()
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/generate-pptx", summary="1-Click PowerPoint Slide Deck Exporter")
def generate_pptx():
    try:
        filepath = generate_pptx_deck()
        return FileResponse(
            filepath,
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            filename="AI_Data_Analyst_Presentation.pptx"
        )
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/reports")
def reports():
    try:
        return list_reports()
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/download-report/{filename}")
def download(filename: str):
    try:
        return download_report(filename)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.delete("/delete-report/{filename}")
def delete(filename: str):
    try:
        return delete_report(filename)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
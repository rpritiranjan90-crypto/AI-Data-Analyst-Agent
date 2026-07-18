from typing import Optional

from fastapi import APIRouter, HTTPException

from app.services.cleaning_service import CleaningService

router = APIRouter(
    prefix="/clean",
    tags=["Data Cleaning"]
)


@router.post("/missing-values")
def fill_missing_values(
    column: str,
    method: str,
    value: Optional[str] = None
):
    try:

        CleaningService.fill_missing(
            column,
            method,
            value
        )

        return {
            "success": True,
            "message": f"Missing values in '{column}' filled using '{method}'."
        }

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.post("/duplicates")
def remove_duplicates():

    try:

        CleaningService.remove_duplicates()

        return {
            "success": True,
            "message": "Duplicate rows removed successfully."
        }

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.post("/outliers/iqr")
def remove_iqr_outliers(
    column: str
):

    try:

        CleaningService.remove_iqr_outliers(
            column
        )

        return {
            "success": True,
            "message": f"IQR outliers removed from '{column}'."
        }

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.post("/outliers/zscore")
def remove_zscore_outliers(
    column: str,
    threshold: float = 3.0
):

    try:

        CleaningService.remove_zscore_outliers(
            column,
            threshold
        )

        return {
            "success": True,
            "message": f"Z-score outliers removed from '{column}'."
        }

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.post("/datatype")
def convert_datatype(
    column: str,
    datatype: str
):

    try:

        CleaningService.convert_datatype(
            column,
            datatype
        )

        return {
            "success": True,
            "message": f"'{column}' converted to '{datatype}'."
        }

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.get("/quality")
def dataset_quality():

    return CleaningService.dataset_quality()


@router.get("/history")
def cleaning_history():

    return CleaningService.cleaning_history()
from typing import Any

from fastapi import APIRouter, HTTPException

from app.services.cleaning_service import CleaningService

router = APIRouter(
    prefix="/clean",
    tags=["Data Cleaning"],
)


def execute(operation):
    """
    Execute a cleaning operation with consistent
    exception handling.
    """
    try:
        return operation()
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        )
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Internal Server Error: {error}",
        )


@router.post(
    "/missing-values",
    summary="Fill Missing Values",
    description="Fill missing values using mean, median, mode, constant, forward-fill or backward-fill.",
)
def fill_missing_values(
    column: str,
    method: str,
    value: str | None = None,
) -> dict[str, Any]:

    return execute(
        lambda: CleaningService.fill_missing(
            column,
            method,
            value,
        )
    )


@router.post(
    "/duplicates",
    summary="Remove Duplicate Rows",
)
def remove_duplicates() -> dict[str, Any]:

    return execute(
        CleaningService.remove_duplicates
    )


@router.post(
    "/outliers/iqr",
    summary="Remove IQR Outliers",
)
def remove_iqr_outliers(
    column: str,
) -> dict[str, Any]:

    return execute(
        lambda: CleaningService.remove_iqr_outliers(
            column
        )
    )


@router.post(
    "/outliers/zscore",
    summary="Remove Z-Score Outliers",
)
def remove_zscore_outliers(
    column: str,
    threshold: float = 3.0,
) -> dict[str, Any]:

    return execute(
        lambda: CleaningService.remove_zscore_outliers(
            column,
            threshold,
        )
    )


@router.post(
    "/datatype",
    summary="Convert Datatype",
)
def convert_datatype(
    column: str,
    datatype: str,
) -> dict[str, Any]:

    return execute(
        lambda: CleaningService.convert_datatype(
            column,
            datatype,
        )
    )


@router.get(
    "/quality",
    summary="Dataset Quality",
)
def dataset_quality() -> dict[str, Any]:

    return execute(
        CleaningService.dataset_quality
    )


@router.get(
    "/history",
    summary="Cleaning History",
)
def cleaning_history() -> list[dict[str, Any]]:

    return execute(
        CleaningService.cleaning_history
    )
@router.post("/auto-clean")
def auto_clean():
    return CleaningService.auto_clean()
from __future__ import annotations

from typing import Any, Callable, Literal

from fastapi import APIRouter
from pydantic import BaseModel

from app.common.logger import get_logger
from app.common.timing import measure_time

from app.core.exceptions import ResourceNotFoundException

from app.exceptions.base import (
    InternalServerException,
    ValidationException,
)

from app.services.cleaning_service import CleaningService

logger = get_logger(__name__)

router = APIRouter(
    prefix="/clean",
    tags=["Data Cleaning"],
)


# ---------------------------------------------------------------------------
# Typed response models
# ---------------------------------------------------------------------------

class CleaningOperationResponse(BaseModel):
    """Standard response for a single cleaning operation."""
    success: Literal[True]
    message: str
    rows_before: int
    rows_after: int
    rows_removed: int
    details: dict[str, Any] = {}


class AutoCleanResponse(BaseModel):
    """Response from the auto-clean pipeline."""
    success: Literal[True]
    message: str
    operations_applied: list[str]
    rows_cleaned: int
    missing_values_filled: int
    outliers_removed: int
    duplicates_removed: int
    details: dict[str, Any] = {}


class DatasetQualityResponse(BaseModel):
    """Dataset quality scorecard."""
    success: Literal[True]
    overall_score: float  # 0–100
    issues: list[dict[str, Any]]
    missing_values_pct: float
    duplicate_rows_pct: float
    column_quality: dict[str, dict[str, Any]]


class CleaningHistoryEntry(BaseModel):
    timestamp: str
    operation: str
    column: str | None
    details: dict[str, Any]


class ChartTypesResponse(BaseModel):
    supported_charts: list[str]


@measure_time
def execute(
    operation: Callable[..., Any],
    *args: Any,
) -> Any:
    """
    Execute a cleaning operation with centralized
    logging and exception handling.
    """

    logger.info(
        "Executing cleaning operation: %s",
        operation.__name__,
    )

    try:
        result = operation(*args)

        logger.info(
            "Cleaning operation '%s' completed successfully.",
            operation.__name__,
        )

        return result

    except ValidationException:
        raise

    except ResourceNotFoundException:
        raise

    except ValueError as error:

        logger.exception(
            "Validation error during cleaning."
        )

        raise ValidationException(
            str(error)
        )

    except FileNotFoundError as error:

        logger.exception(
            "Dataset not found."
        )

        raise ResourceNotFoundException(
            str(error)
        )

    except Exception as error:

        logger.exception(
            "Unexpected cleaning error."
        )

        raise InternalServerException(
            str(error)
        )


@router.post(
    "/missing-values",
    response_model=CleaningOperationResponse,
    summary="Fill Missing Values",
    description=(
        "Fill missing values using mean, median, "
        "mode, constant, forward-fill or backward-fill."
    ),
)
def fill_missing_values(
    column: str,
    method: str,
    value: str | None = None,
) -> CleaningOperationResponse:

    result = execute(
        CleaningService.fill_missing,
        column,
        method,
        value,
    )
    return CleaningOperationResponse(
        success=True,
        message=f"Filled missing values in '{column}' using {method}",
        rows_before=result.get("rows_before", 0),
        rows_after=result.get("rows_after", 0),
        rows_removed=result.get("rows_before", 0) - result.get("rows_after", 0),
        details=result,
    )


@router.post(
    "/duplicates",
    response_model=CleaningOperationResponse,
    summary="Remove Duplicate Rows",
)
def remove_duplicates() -> CleaningOperationResponse:

    result = execute(
        CleaningService.remove_duplicates,
    )
    return CleaningOperationResponse(
        success=True,
        message="Duplicates removed",
        rows_before=result.get("rows_before", 0),
        rows_after=result.get("rows_after", 0),
        rows_removed=result.get("duplicates_removed", 0),
        details=result,
    )


@router.post(
    "/outliers/iqr",
    response_model=CleaningOperationResponse,
    summary="Remove IQR Outliers",
)
def remove_iqr_outliers(
    column: str,
) -> CleaningOperationResponse:

    result = execute(
        CleaningService.remove_iqr_outliers,
        column,
    )
    return CleaningOperationResponse(
        success=True,
        message=f"IQR outliers removed from '{column}'",
        rows_before=result.get("rows_before", 0),
        rows_after=result.get("rows_after", 0),
        rows_removed=result.get("rows_before", 0) - result.get("rows_after", 0),
        details=result,
    )


@router.post(
    "/outliers/zscore",
    response_model=CleaningOperationResponse,
    summary="Remove Z-Score Outliers",
)
def remove_zscore_outliers(
    column: str,
    threshold: float = 3.0,
) -> CleaningOperationResponse:

    result = execute(
        CleaningService.remove_zscore_outliers,
        column,
        threshold,
    )
    return CleaningOperationResponse(
        success=True,
        message=f"Z-score outliers removed from '{column}'",
        rows_before=result.get("rows_before", 0),
        rows_after=result.get("rows_after", 0),
        rows_removed=result.get("rows_before", 0) - result.get("rows_after", 0),
        details=result,
    )


@router.post(
    "/datatype",
    response_model=CleaningOperationResponse,
    summary="Convert Datatype",
)
def convert_datatype(
    column: str,
    datatype: str,
) -> CleaningOperationResponse:

    result = execute(
        CleaningService.convert_datatype,
        column,
        datatype,
    )
    return CleaningOperationResponse(
        success=True,
        message=f"Converted '{column}' to {datatype}",
        rows_before=result.get("rows_before", 0),
        rows_after=result.get("rows_after", 0),
        rows_removed=0,
        details=result,
    )


@router.get(
    "/quality",
    response_model=DatasetQualityResponse,
    summary="Dataset Quality",
)
def dataset_quality() -> DatasetQualityResponse:

    result = execute(
        CleaningService.dataset_quality,
    )
    return DatasetQualityResponse(
        success=True,
        overall_score=result.get("overall_score", 0),
        issues=result.get("issues", []),
        missing_values_pct=result.get("missing_values_pct", 0),
        duplicate_rows_pct=result.get("duplicate_rows_pct", 0),
        column_quality=result.get("column_quality", {}),
    )


@router.get(
    "/history",
    response_model=list[CleaningHistoryEntry],
    summary="Cleaning History",
)
def cleaning_history() -> list[CleaningHistoryEntry]:

    result = execute(
        CleaningService.cleaning_history,
    )
    return [CleaningHistoryEntry(**e) for e in result]


@router.post(
    "/auto-clean",
    response_model=AutoCleanResponse,
    summary="Automatic Dataset Cleaning",
)
def auto_clean() -> AutoCleanResponse:
    """
    Automatically clean the uploaded dataset.
    """

    result = execute(
        CleaningService.auto_clean,
    )
    return AutoCleanResponse(
        success=True,
        message="Auto-clean pipeline completed",
        operations_applied=result.get("operations_applied", []),
        rows_cleaned=result.get("rows_cleaned", 0),
        missing_values_filled=result.get("missing_values_filled", 0),
        outliers_removed=result.get("outliers_removed", 0),
        duplicates_removed=result.get("duplicates_removed", 0),
        details=result,
    )
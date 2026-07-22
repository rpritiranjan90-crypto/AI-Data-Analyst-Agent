from __future__ import annotations

from typing import Any, Callable

from fastapi import APIRouter

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
) -> dict[str, Any]:

    return execute(
        CleaningService.fill_missing,
        column,
        method,
        value,
    )


@router.post(
    "/duplicates",
    summary="Remove Duplicate Rows",
)
def remove_duplicates() -> dict[str, Any]:

    return execute(
        CleaningService.remove_duplicates,
    )


@router.post(
    "/outliers/iqr",
    summary="Remove IQR Outliers",
)
def remove_iqr_outliers(
    column: str,
) -> dict[str, Any]:

    return execute(
        CleaningService.remove_iqr_outliers,
        column,
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
        CleaningService.remove_zscore_outliers,
        column,
        threshold,
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
        CleaningService.convert_datatype,
        column,
        datatype,
    )


@router.get(
    "/quality",
    summary="Dataset Quality",
)
def dataset_quality() -> dict[str, Any]:

    return execute(
        CleaningService.dataset_quality,
    )


@router.get(
    "/history",
    summary="Cleaning History",
)
def cleaning_history() -> list[dict[str, Any]]:

    return execute(
        CleaningService.cleaning_history,
    )


@router.post(
    "/auto-clean",
    summary="Automatic Dataset Cleaning",
)
def auto_clean() -> dict[str, Any]:
    """
    Automatically clean the uploaded dataset.
    """

    return execute(
        CleaningService.auto_clean,
    )
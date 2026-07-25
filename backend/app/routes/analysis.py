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

from app.services.analysis_engine import AnalysisEngine
from app.services.nl_query_service import NaturalLanguageQueryService

logger = get_logger(__name__)

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
)


class NLQueryRequest(BaseModel):
    query: str


@measure_time
def execute(
    operation: Callable[..., Any],
    *args: Any,
) -> Any:
    """
    Execute an analysis operation with centralized
    exception handling and logging.
    """

    logger.info(
        "Executing analysis operation: %s",
        operation.__name__,
    )

    try:
        result = operation(*args)

        logger.info(
            "Analysis operation '%s' completed.",
            operation.__name__,
        )

        return result

    except ValidationException:
        raise

    except ResourceNotFoundException:
        raise

    except ValueError as error:

        logger.exception(
            "Validation error during analysis."
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
            "Unexpected analysis error."
        )

        raise InternalServerException(
            str(error)
        )


@router.get(
    "/summary",
    summary="Complete Dataset Analysis",
    description=(
        "Returns descriptive statistics, correlation, "
        "categorical analysis, distribution analysis, "
        "time-series analysis and AI insights."
    ),
)
def summary() -> Any:
    return execute(
        AnalysisEngine.summary,
    )


@router.get(
    "/descriptive",
    summary="Descriptive Statistics",
    description="Returns descriptive statistics for numeric columns.",
)
def descriptive() -> Any:
    return execute(
        AnalysisEngine.descriptive,
    )


@router.get(
    "/correlation",
    summary="Correlation Analysis",
    description="Returns Pearson, Spearman or Kendall correlation.",
)
def correlation(
    method: Literal[
        "pearson",
        "spearman",
        "kendall",
    ] = "pearson",
) -> Any:
    return execute(
        AnalysisEngine.correlation,
        method,
    )


@router.get(
    "/strong-correlations",
    summary="Strong Correlations",
)
def strong_correlations() -> Any:
    return execute(
        AnalysisEngine.strong_correlations,
    )


@router.get(
    "/categorical",
    summary="Categorical Analysis",
)
def categorical() -> Any:
    return execute(
        AnalysisEngine.categorical,
    )


@router.get(
    "/distribution",
    summary="Distribution Analysis",
)
def distribution() -> Any:
    return execute(
        AnalysisEngine.distribution,
    )


@router.get(
    "/timeseries",
    summary="Time Series Analysis",
)
def timeseries() -> Any:
    return execute(
        AnalysisEngine.timeseries,
    )


@router.get(
    "/insights",
    summary="AI Dataset Insights",
)
def insights() -> Any:
    return execute(
        AnalysisEngine.insights,
    )


@router.post(
    "/nl-query",
    summary="Natural Language Data Querying (Talk to CSV)",
    description="Convert plain text natural language queries into Pandas & DuckDB SQL results.",
)
def nl_query(req: NLQueryRequest) -> Any:
    df = AnalysisEngine._get_dataset()
    return NaturalLanguageQueryService.process_query(df, req.query)
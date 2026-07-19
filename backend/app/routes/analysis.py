from __future__ import annotations

from typing import Any, Callable, Literal

from fastapi import APIRouter, HTTPException

from app.services.analysis_engine import AnalysisEngine

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
)


def execute(
    operation: Callable[..., Any],
    *args: Any,
) -> Any:
    """
    Execute an analysis operation with centralized error handling.
    """
    try:
        return operation(*args)

    except ValueError as error:

        raise HTTPException(
            status_code=422,
            detail=str(error),
        )

    except FileNotFoundError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error),
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


@router.get(
    "/summary",
    summary="Complete Dataset Analysis",
    description="Returns a complete dataset analysis including descriptive statistics, correlation, categorical analysis, distribution analysis, time-series analysis, and AI insights.",
)
def summary() -> Any:
    return execute(AnalysisEngine.summary)


@router.get(
    "/descriptive",
    summary="Descriptive Statistics",
    description="Returns descriptive statistics for all numeric columns.",
)
def descriptive() -> Any:
    return execute(AnalysisEngine.descriptive)


@router.get(
    "/correlation",
    summary="Correlation Analysis",
    description="Returns the correlation matrix using Pearson, Spearman, or Kendall correlation.",
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
    description="Returns highly correlated numeric column pairs.",
)
def strong_correlations() -> Any:
    return execute(
        AnalysisEngine.strong_correlations,
    )


@router.get(
    "/categorical",
    summary="Categorical Analysis",
    description="Returns frequency and cardinality analysis for categorical columns.",
)
def categorical() -> Any:
    return execute(
        AnalysisEngine.categorical,
    )


@router.get(
    "/distribution",
    summary="Distribution Analysis",
    description="Returns skewness, kurtosis, outliers, quartiles, and distribution statistics.",
)
def distribution() -> Any:
    return execute(
        AnalysisEngine.distribution,
    )


@router.get(
    "/timeseries",
    summary="Time Series Analysis",
    description="Returns date range, frequency, duration, and other time-series statistics.",
)
def timeseries() -> Any:
    return execute(
        AnalysisEngine.timeseries,
    )


@router.get(
    "/insights",
    summary="AI Dataset Insights",
    description="Generates intelligent business insights and recommendations for the uploaded dataset.",
)
def insights() -> Any:
    return execute(
        AnalysisEngine.insights,
    )
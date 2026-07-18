from fastapi import APIRouter, HTTPException

from app.services.analysis_engine import AnalysisEngine

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"]
)


@router.get("/summary")
def summary():

    try:
        return AnalysisEngine.summary()

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.get("/descriptive")
def descriptive():

    try:
        return AnalysisEngine.descriptive()

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.get("/correlation")
def correlation(
    method: str = "pearson"
):

    try:
        return AnalysisEngine.correlation(method)

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.get("/strong-correlations")
def strong_correlations():

    try:
        return AnalysisEngine.strong_correlations()

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.get("/categorical")
def categorical():

    try:
        return AnalysisEngine.categorical()

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.get("/distribution")
def distribution():

    try:
        return AnalysisEngine.distribution()

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.get("/timeseries")
def timeseries():

    try:
        return AnalysisEngine.timeseries()

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )


@router.get("/insights")
def insights():

    try:
        return AnalysisEngine.insights()

    except Exception as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )
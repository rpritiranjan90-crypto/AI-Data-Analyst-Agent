from fastapi import APIRouter, HTTPException

from app.services.recommendation_service import auto_recommend

router = APIRouter(
    prefix="/recommendation",
    tags=["Recommendation"],
)


@router.post("/auto-recommend")
def auto_recommend_endpoint():
    """
    Automatically generate recommendations.
    """

    try:
        return auto_recommend()

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )
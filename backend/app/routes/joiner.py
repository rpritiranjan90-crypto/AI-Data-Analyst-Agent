from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter

from app.common.logger import get_logger
from app.services.dataset_joiner_service import DatasetJoinerService
from app.services.dataset_service import DatasetService

logger = get_logger(__name__)

router = APIRouter(
    prefix="/datasets",
    tags=["Dataset Joiner"],
)


class JoinRequest(BaseModel):
    left_filename: str = Field(..., description="Name of left dataset file in upload directory")
    right_filename: str = Field(..., description="Name of right dataset file in upload directory")
    left_on: str = Field(..., description="Key column in left dataset")
    right_on: str = Field(..., description="Key column in right dataset")
    how: str = Field("inner", description="Join type: inner, left, right, outer")
    output_filename: Optional[str] = Field("joined_dataset.csv", description="Output dataset name")


@router.post("/join", summary="Join Two Datasets")
def join_datasets(req: JoinRequest):
    """
    Perform a SQL-style JOIN between two uploaded datasets (CSV or Excel), load result into memory,
    and trigger instant AI profiling.
    """
    out_path = DatasetJoinerService.join_datasets(
        left_filename=req.left_filename,
        right_filename=req.right_filename,
        left_on=req.left_on,
        right_on=req.right_on,
        how=req.how,
        output_filename=req.output_filename or "joined_dataset.csv",
    )

    dataset_service = DatasetService()
    result = dataset_service.load_dataset(file_path=out_path)

    return {
        "success": True,
        "message": f"Successfully joined '{req.left_filename}' and '{req.right_filename}' ({req.how.upper()} JOIN).",
        "metadata": result.metadata,
        "profile": result.profile,
        "statistics": result.statistics,
    }

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config import UPLOAD_FOLDER
from app.schemas.dataset import UploadResponse
from app.services.dataset_service import DatasetService
from app.services.dataset_validation import (
    DatasetValidationError,
    validate_upload,
)

router = APIRouter(
    tags=["Dataset"],
)


@router.post(
    "/upload",
    response_model=UploadResponse,
    summary="Upload Dataset",
    description="Upload a CSV or Excel dataset for analysis.",
)
async def upload_dataset(
    file: UploadFile = File(...),
) -> UploadResponse:
    """
    Upload a dataset, validate it, save it,
    load it into memory, and return metadata.
    """

    file_path: Path | None = None

    try:
        contents = await file.read()

        validate_upload(
            file,
            len(contents),
        )

        UPLOAD_FOLDER.mkdir(
            parents=True,
            exist_ok=True,
        )

        filename = Path(file.filename).name

        file_path = UPLOAD_FOLDER / filename

        file_path.write_bytes(contents)

        dataset_service = DatasetService()

        result = dataset_service.load_dataset(
            file_path=str(file_path),
        )

        return UploadResponse(
            success=True,
            message="Dataset uploaded successfully.",
            metadata=result.metadata,
            profile=result.profile,
            statistics=result.statistics,
        )

    except DatasetValidationError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )

    except FileNotFoundError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error),
        )

    except ValueError as error:

        if file_path and file_path.exists():
            file_path.unlink()

        raise HTTPException(
            status_code=422,
            detail=str(error),
        )

    except Exception as error:

        if file_path and file_path.exists():
            file_path.unlink()

        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {error}",
        )

    finally:
        await file.close()
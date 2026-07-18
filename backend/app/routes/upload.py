from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.dataset_service import DatasetService
from app.services.dataset_validation import (
    DatasetValidationError,
    validate_upload,
)

from app.config import UPLOAD_FOLDER
from app.schemas.dataset import UploadResponse

router = APIRouter(tags=["Dataset"])


@router.post(
    "/upload",
    response_model=UploadResponse
)
async def upload_dataset(
    file: UploadFile = File(...)
):
    try:

        contents = await file.read()

        validate_upload(
            file,
            len(contents)
        )

        file_path = UPLOAD_FOLDER / file.filename

        with open(file_path, "wb") as buffer:
            buffer.write(contents)

        result = DatasetService.load_dataset(
            str(file_path)
        )

        return {
            "success": True,
            "message": "Dataset uploaded successfully.",
            **result
        }

    except DatasetValidationError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
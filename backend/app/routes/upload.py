from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, File, UploadFile

from app.common.config import settings
from app.common.logger import get_logger
from app.common.timing import measure_async_time

from app.core.exceptions import ResourceNotFoundException

from app.exceptions.base import (
    InternalServerException,
    ValidationException,
)

from app.schemas.dataset import UploadResponse

from app.services.dataset_service import DatasetService
from app.services.dataset_validation import validate_upload

logger = get_logger(__name__)

router = APIRouter(
    tags=["Dataset"],
)


@router.post(
    "/upload",
    response_model=UploadResponse,
    summary="Upload Dataset",
    description="Upload a CSV or Excel dataset for analysis.",
)
@measure_async_time
async def upload_dataset(
    file: UploadFile = File(...),
) -> UploadResponse:
    """
    Upload a dataset, validate it, save it,
    load it into memory, and return metadata.
    """

    file_path: Path | None = None

    try:
        logger.info(
            "Receiving upload request: %s",
            file.filename,
        )

        contents = await file.read()

        validate_upload(
            file=file,
            file_size=len(contents),
        )

        settings.UPLOAD_DIR.mkdir(
            parents=True,
            exist_ok=True,
        )

        filename = Path(file.filename).name

        file_path = settings.UPLOAD_DIR / filename

        file_path.write_bytes(contents)

        logger.info(
            "Dataset saved to %s",
            file_path,
        )

        dataset_service = DatasetService()

        result = dataset_service.load_dataset(
            file_path=file_path,
        )

        logger.info(
            "Dataset uploaded successfully."
        )

        return UploadResponse(
            success=True,
            message="Dataset uploaded successfully.",
            metadata=result.metadata,
            profile=result.profile,
            statistics=result.statistics,
        )

    except ValidationException:
        raise

    except ResourceNotFoundException:
        raise

    except FileNotFoundError as error:
        logger.exception(
            "File not found during upload."
        )

        raise ResourceNotFoundException(
            str(error)
        )

    except ValueError as error:

        if file_path and file_path.exists():
            file_path.unlink()

        logger.exception(
            "Dataset processing failed."
        )

        raise ValidationException(
            str(error)
        )

    except Exception as error:

        if file_path and file_path.exists():
            file_path.unlink()

        logger.exception(
            "Unexpected upload error."
        )

        raise InternalServerException(
            str(error)
        )

    finally:
        await file.close()
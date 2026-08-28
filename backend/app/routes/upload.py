from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, File, Query, UploadFile

from app.common.config import settings
from app.common.logger import get_logger
from app.common.timing import measure_async_time

from app.core.exceptions import ResourceNotFoundException

from app.exceptions.base import (
    InternalServerException,
    ValidationException,
)

from app.schemas.dataset import UploadResponse
from pydantic import BaseModel
from typing import List

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
            contents=contents,
        )

        settings.UPLOAD_DIR.mkdir(
            parents=True,
            exist_ok=True,
        )

        from app.services.dataset_validation import sanitize_filename
        filename = sanitize_filename(file.filename or "dataset.csv")

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


class DatasetListItem(BaseModel):
    filename: str
    size_bytes: int
    uploaded_at: str
    rows: int | None = None
    columns: int | None = None


class DatasetListResponse(BaseModel):
    success: bool
    total: int
    page: int
    page_size: int
    has_next: bool
    items: List[DatasetListItem]


@router.get(
    "/api/datasets/list",
    response_model=DatasetListResponse,
    summary="List Uploaded Datasets (paginated)",
    description="Returns paginated metadata for all datasets currently stored in the upload directory.",
)
def list_datasets(
    page: int = Query(1, ge=1, description="1-indexed page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page (1–100)"),
) -> DatasetListResponse:
    """List all datasets that have been uploaded to the server (paginated)."""
    upload_dir = settings.UPLOAD_DIR
    all_items: List[DatasetListItem] = []

    if upload_dir.exists():
        for path in sorted(upload_dir.iterdir(), key=lambda p: p.stat().st_mtime, reverse=True):
            if not path.is_file():
                continue
            if path.suffix.lower() not in {".csv", ".xlsx", ".xls", ".json", ".parquet"}:
                continue
            stat = path.stat()
            from datetime import datetime
            uploaded_at = datetime.fromtimestamp(stat.st_mtime).isoformat()
            all_items.append(
                DatasetListItem(
                    filename=path.name,
                    size_bytes=stat.st_size,
                    uploaded_at=uploaded_at,
                )
            )

    total = len(all_items)
    start = (page - 1) * page_size
    end = start + page_size
    page_items = all_items[start:end]
    has_next = end < total

    return DatasetListResponse(
        success=True,
        total=total,
        page=page,
        page_size=page_size,
        has_next=has_next,
        items=page_items,
    )
from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import pandas as pd

from app.common.logger import get_logger
from app.common.timing import measure_time

logger = get_logger(__name__)


class DatasetMetadataService:
    """
    Service responsible for generating metadata
    for an uploaded dataset.
    """

    @measure_time
    def generate(
        self,
        dataframe: pd.DataFrame,
        file_path: str | Path,
    ) -> dict[str, Any]:
        """
        Generate metadata describing the dataset.
        """

        path = Path(file_path)

        logger.info(
            "Generating metadata for dataset '%s'.",
            path.name,
        )

        memory_usage_mb = (
            dataframe.memory_usage(
                deep=True,
            ).sum()
            / (1024 * 1024)
        )

        metadata = {
            "filename": path.name,
            "extension": path.suffix.lower(),
            "rows": len(dataframe),
            "columns": len(dataframe.columns),
            "column_names": dataframe.columns.tolist(),
            "memory_usage_mb": round(
                memory_usage_mb,
                2,
            ),
            "missing_values": int(
                dataframe.isna().sum().sum()
            ),
            "duplicate_rows": int(
                dataframe.duplicated().sum()
            ),
            "upload_time": datetime.now(
                UTC
            ).isoformat(),
        }

        logger.info(
            "Metadata generated successfully."
        )

        return metadata


__all__ = [
    "DatasetMetadataService",
]
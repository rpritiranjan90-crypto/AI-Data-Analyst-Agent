from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import pandas as pd


class DatasetMetadataService:
    """
    Generate metadata for an uploaded dataset.
    """

    def generate(
        self,
        dataframe: pd.DataFrame,
        file_path: str | Path,
    ) -> dict[str, Any]:
        """
        Generate dataset metadata.
        """

        path = Path(file_path)

        memory_usage_mb = (
            dataframe.memory_usage(
                deep=True
            ).sum()
            / (1024 * 1024)
        )

        return {
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


__all__ = [
    "DatasetMetadataService",
]
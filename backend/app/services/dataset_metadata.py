from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import Any

import pandas as pd


def generate_metadata(
    dataframe: pd.DataFrame,
    file_path: str
) -> dict[str, Any]:
    """
    Generate metadata for the uploaded dataset.
    """

    file = Path(file_path)

    memory_usage = (
        dataframe.memory_usage(
            deep=True
        ).sum()
        / 1024
        / 1024
    )

    metadata = {

        "filename": file.name,

        "extension": file.suffix.lower(),

        "rows": len(dataframe),

        "columns": len(dataframe.columns),

        "column_names": list(dataframe.columns),

        "memory_usage_mb": round(
            memory_usage,
            2
        ),

        "missing_values": int(
            dataframe.isnull().sum().sum()
        ),

        "duplicate_rows": int(
            dataframe.duplicated().sum()
        ),

        "upload_time": datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        )
    }

    return metadata
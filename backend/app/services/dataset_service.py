from __future__ import annotations

from pathlib import Path
from typing import Any

import pandas as pd

from app.services.dataset_cache import DatasetCache
from app.services.dataset_metadata import generate_metadata
from app.services.dataset_profile import generate_profile
from app.services.dataset_statistics import generate_statistics


class DatasetService:

    @staticmethod
    def load_dataset(file_path: str) -> dict[str, Any]:
        """
        Load a dataset, cache it and return all related information.
        """

        extension = Path(file_path).suffix.lower()

        if extension == ".csv":
            dataframe = pd.read_csv(file_path)

        elif extension in [".xlsx", ".xls"]:
            dataframe = pd.read_excel(file_path)

        else:
            raise ValueError(
                f"Unsupported file format: {extension}"
            )

        DatasetCache.set_dataset(
            dataframe,
            Path(file_path).name
        )

        return {
            "metadata": generate_metadata(
                dataframe,
                file_path
            ),
            "profile": generate_profile(
                dataframe
            ),
            "statistics": generate_statistics(
                dataframe
            )
        }

    @staticmethod
    def get_dataset() -> pd.DataFrame:

        dataset = DatasetCache.get_dataset()

        if dataset is None:
            raise ValueError(
                "No dataset has been loaded."
            )

        return dataset

    @staticmethod
    def clear_dataset() -> None:

        DatasetCache.clear()

    @staticmethod
    def has_dataset() -> bool:

        return DatasetCache.has_dataset()
# After all this section will deleted
def get_latest_dataset():
    return DatasetService.get_dataset()

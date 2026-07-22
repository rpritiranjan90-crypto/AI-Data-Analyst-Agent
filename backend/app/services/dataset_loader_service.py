from __future__ import annotations

from pathlib import Path
from typing import Any, Callable

import pandas as pd
from pandas.errors import EmptyDataError, ParserError

from app.common.logger import get_logger
from app.common.timing import measure_time

from app.exceptions.base import ValidationException

from app.core.validators import validate_existing_path

logger = get_logger(__name__)


class DatasetLoaderService:
    """
    Service responsible for loading datasets into pandas DataFrames.
    """

    def __init__(self) -> None:
        self._loaders: dict[
            str,
            Callable[..., pd.DataFrame],
        ] = {
            ".csv": self._load_csv,
            ".xlsx": self._load_excel,
            ".xls": self._load_excel,
            ".parquet": self._load_parquet,
            ".json": self._load_json,
            ".feather": self._load_feather,
        }

    @property
    def loaders(
        self,
    ) -> dict[str, Callable[..., pd.DataFrame]]:
        """
        Return all supported dataset loaders.
        """
        return self._loaders

    @measure_time
    def load(
        self,
        file_path: str | Path,
        **kwargs: Any,
    ) -> pd.DataFrame:
        """
        Load a dataset into a pandas DataFrame.
        """

        path = Path(file_path)

        validate_existing_path(path)

        extension = path.suffix.lower()

        loader = self.loaders.get(extension)

        if loader is None:
            raise ValidationException(
                f"Unsupported dataset format: {extension}"
            )

        logger.info(
            "Loading dataset '%s'",
            path.name,
        )

        try:
            dataframe = loader(
                path,
                **kwargs,
            )

        except EmptyDataError as exc:
            raise ValidationException(
                "Dataset is empty."
            ) from exc

        except ParserError as exc:
            raise ValidationException(
                "Unable to parse dataset."
            ) from exc

        except UnicodeDecodeError as exc:
            raise ValidationException(
                "Unsupported file encoding."
            ) from exc

        except Exception as exc:
            logger.exception(
                "Failed to load dataset '%s'.",
                path.name,
            )

            raise ValidationException(
                f"Unable to load dataset: {exc}"
            ) from exc

        logger.info(
            "Dataset '%s' loaded successfully. Rows=%d Columns=%d",
            path.name,
            len(dataframe),
            len(dataframe.columns),
        )

        return dataframe

    def _load_csv(
        self,
        path: Path,
        **kwargs: Any,
    ) -> pd.DataFrame:
        return pd.read_csv(path, **kwargs)

    def _load_excel(
        self,
        path: Path,
        **kwargs: Any,
    ) -> pd.DataFrame:
        return pd.read_excel(path, **kwargs)

    def _load_parquet(
        self,
        path: Path,
        **kwargs: Any,
    ) -> pd.DataFrame:
        return pd.read_parquet(path, **kwargs)

    def _load_json(
        self,
        path: Path,
        **kwargs: Any,
    ) -> pd.DataFrame:
        return pd.read_json(path, **kwargs)

    def _load_feather(
        self,
        path: Path,
        **kwargs: Any,
    ) -> pd.DataFrame:
        return pd.read_feather(path, **kwargs)


__all__ = [
    "DatasetLoaderService",
]

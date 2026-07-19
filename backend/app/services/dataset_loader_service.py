from __future__ import annotations

from pathlib import Path
from typing import Any, Callable

import pandas as pd
from pandas.errors import EmptyDataError, ParserError

from app.core.exceptions import BadRequestException
from app.core.logging import get_logger
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
        return self._loaders

    def load(
        self,
        file_path: str | Path,
        **kwargs: Any,
    ) -> pd.DataFrame:

        path = Path(file_path)

        validate_existing_path(path)

        extension = path.suffix.lower()

        loader = self.loaders.get(extension)

        if loader is None:
            raise BadRequestException(
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
            raise BadRequestException(
                "Dataset is empty."
            ) from exc

        except ParserError as exc:
            raise BadRequestException(
                "Unable to parse dataset."
            ) from exc

        except UnicodeDecodeError as exc:
            raise BadRequestException(
                "Unsupported file encoding."
            ) from exc

        except Exception as exc:
            logger.exception(
                "Failed to load dataset."
            )

            raise BadRequestException(
                f"Unable to load dataset: {exc}"
            ) from exc

        logger.info(
            "Dataset loaded successfully. Rows=%d Columns=%d",
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

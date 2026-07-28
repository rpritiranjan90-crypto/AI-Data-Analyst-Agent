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

        loader = self.loaders.get(extension, self._load_csv)

        logger.info(
            "Loading dataset '%s'",
            path.name,
        )

        try:
            dataframe = loader(
                path,
                **kwargs,
            )

        except ValidationException:
            raise

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
            logger.info("Attempting fallback loader for '%s'", path.name)
            try:
                dataframe = self._load_csv(path, **kwargs)
            except Exception:
                logger.exception(
                    "Failed to load dataset '%s'.",
                    path.name,
                )
                raise ValidationException(
                    f"Unable to load dataset: {exc}"
                ) from exc

        if dataframe is None or dataframe.empty:
            raise ValidationException("The dataset file contains no readable data rows.")

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
        # Auto-detect separator if comma yields single column
        try:
            df = pd.read_csv(path, **kwargs)
            if len(df.columns) == 1 and ";" in str(df.columns[0]):
                df = pd.read_csv(path, sep=";", **kwargs)
            return df
        except Exception:
            return pd.read_csv(path, sep=None, engine="python", **kwargs)

    def _load_excel(
        self,
        path: Path,
        **kwargs: Any,
    ) -> pd.DataFrame:
        try:
            return pd.read_excel(path, engine="openpyxl", **kwargs)
        except Exception as exc1:
            logger.warning("openpyxl engine failed for '%s': %s. Trying default read_excel...", path.name, exc1)
            try:
                return pd.read_excel(path, **kwargs)
            except Exception as exc2:
                # Check magic bytes to determine if it's binary zip/excel vs plain text
                try:
                    with open(path, "rb") as f:
                        header = f.read(4)
                    if not header.startswith(b"PK") and not header.startswith(b"\xd0\xcf\x11\xe0"):
                        # Plain text file renamed to .xlsx
                        return self._load_csv(path, **kwargs)
                except Exception:
                    pass

                logger.error("Failed to parse Excel file '%s': %s", path.name, exc2)
                raise ValidationException(
                    f"Unable to parse Excel file '{path.name}'. Please ensure the file is valid and unencrypted."
                ) from exc2

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

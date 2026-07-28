from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List, Optional
import pandas as pd

from app.common.config import settings
from app.common.logger import get_logger
from app.exceptions.base import ValidationException

logger = get_logger(__name__)


class DatasetJoinerService:
    """
    Multi-Dataset Joiner Service.
    Joins two datasets (CSV/Excel) using INNER, LEFT, RIGHT, or OUTER joins on specified key columns.
    """

    @staticmethod
    def join_datasets(
        left_filename: str,
        right_filename: str,
        left_on: str,
        right_on: str,
        how: str = "inner",
        output_filename: str = "joined_dataset.csv",
    ) -> Path:
        """
        Merge two dataset files from upload directory and return path to joined file.
        """
        left_path = settings.UPLOAD_DIR / left_filename
        right_path = settings.UPLOAD_DIR / right_filename

        if not left_path.exists():
            raise ValidationException(f"Left dataset file '{left_filename}' not found.")
        if not right_path.exists():
            raise ValidationException(f"Right dataset file '{right_filename}' not found.")

        # Load datasets
        try:
            df_left = pd.read_csv(left_path) if left_path.suffix.lower() == ".csv" else pd.read_excel(left_path)
            df_right = pd.read_csv(right_path) if right_path.suffix.lower() == ".csv" else pd.read_excel(right_path)
        except Exception as exc:
            raise ValidationException(f"Error reading dataset files: {exc}") from exc

        if left_on not in df_left.columns:
            raise ValidationException(f"Column '{left_on}' not found in left dataset '{left_filename}'.")
        if right_on not in df_right.columns:
            raise ValidationException(f"Column '{right_on}' not found in right dataset '{right_filename}'.")

        # Perform Join
        try:
            merged_df = pd.merge(df_left, df_right, left_on=left_on, right_on=right_on, how=how)
            if merged_df.empty:
                raise ValidationException("Datasets joined successfully, but resulted in 0 matching rows.")

            out_path = settings.UPLOAD_DIR / output_filename
            merged_df.to_csv(out_path, index=False)
            logger.info(f"Datasets '{left_filename}' and '{right_filename}' joined successfully -> {len(merged_df)} rows.")
            return out_path
        except ValidationException:
            raise
        except Exception as exc:
            logger.error(f"Dataset join error: {exc}")
            raise ValidationException(f"Failed to join datasets: {exc}") from exc

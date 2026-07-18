from __future__ import annotations

from datetime import datetime
from pathlib import Path
from uuid import uuid4


class OutputManager:
    """
    Enterprise Output Manager.

    Responsibilities
    ----------------
    • Create output directories
    • Generate unique filenames
    • Centralize chart output paths
    • Prevent accidental overwrites
    """

    DEFAULT_DIRECTORY = Path("generated_charts")
    DEFAULT_EXTENSION = ".png"

    @classmethod
    def ensure_directory(
        cls,
        directory: Path | None = None
    ) -> Path:

        directory = directory or cls.DEFAULT_DIRECTORY

        directory.mkdir(
            parents=True,
            exist_ok=True
        )

        return directory

    @classmethod
    def generate_filename(
        cls,
        chart_type: str
    ) -> str:

        timestamp = datetime.now().strftime(
            "%Y%m%d_%H%M%S"
        )

        unique_id = uuid4().hex[:8]

        return (
            f"{chart_type}_"
            f"{timestamp}_"
            f"{unique_id}"
            f"{cls.DEFAULT_EXTENSION}"
        )

    @classmethod
    def get_output_path(
        cls,
        chart_type: str,
        directory: Path | None = None
    ) -> Path:

        directory = cls.ensure_directory(
            directory
        )

        return directory / cls.generate_filename(
            chart_type
        )
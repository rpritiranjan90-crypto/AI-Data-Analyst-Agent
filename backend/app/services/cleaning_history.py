from __future__ import annotations

from datetime import datetime
from typing import Any


class CleaningHistory:

    _history: list[dict[str, Any]] = []

    @classmethod
    def add(
        cls,
        operation: str,
        details: str
    ) -> None:

        cls._history.append(
            {
                "time": datetime.now().strftime(
                    "%Y-%m-%d %H:%M:%S"
                ),
                "operation": operation,
                "details": details
            }
        )

    @classmethod
    def get_history(
        cls
    ) -> list[dict[str, Any]]:

        return cls._history

    @classmethod
    def clear(
        cls
    ) -> None:

        cls._history.clear()
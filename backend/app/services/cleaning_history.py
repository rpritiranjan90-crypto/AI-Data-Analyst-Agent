from __future__ import annotations

from collections import deque
from datetime import datetime, timezone
from typing import Any


class CleaningHistory:
    """
    Stores the history of data cleaning operations.

    The history is maintained in memory and capped to a
    maximum number of entries to prevent unbounded growth.
    """

    MAX_HISTORY = 1000

    _history: deque[dict[str, Any]] = deque(maxlen=MAX_HISTORY)

    @classmethod
    def add(
        cls,
        operation: str,
        details: str,
    ) -> None:
        """
        Add a new cleaning operation to the history.

        Args:
            operation: Cleaning operation name.
            details: Description of the operation.
        """

        cls._history.append(
            {
                "timestamp": datetime.now(
                    timezone.utc
                ).isoformat(),
                "operation": operation,
                "details": details,
            }
        )

    @classmethod
    def get_history(
        cls,
    ) -> list[dict[str, Any]]:
        """
        Return a copy of the cleaning history.

        Returns:
            List of cleaning history records.
        """

        return list(cls._history)

    @classmethod
    def count(cls) -> int:
        """
        Return the number of history entries.
        """

        return len(cls._history)

    @classmethod
    def clear(cls) -> None:
        """
        Clear the cleaning history.
        """

        cls._history.clear()
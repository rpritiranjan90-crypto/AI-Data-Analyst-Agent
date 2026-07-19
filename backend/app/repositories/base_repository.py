from __future__ import annotations

from abc import ABC, abstractmethod
from pathlib import Path
from typing import Generic, Iterator, TypeVar

T = TypeVar("T")


class BaseRepository(
    ABC,
    Generic[T],
):
    """
    Abstract base repository.

    All repositories inherit from this class.
    """

    def __init__(
        self,
        base_directory: Path,
    ) -> None:
        self._base_directory = base_directory

    @property
    def base_directory(
        self,
    ) -> Path:
        """
        Repository storage location.
        """

        return self._base_directory

    @abstractmethod
    def exists(
        self,
        identifier: str,
    ) -> bool:
        """
        Check whether an entity exists.
        """
        raise NotImplementedError

    @abstractmethod
    def get(
        self,
        identifier: str,
    ) -> T:
        """
        Retrieve an entity.
        """
        raise NotImplementedError

    @abstractmethod
    def save(
        self,
        entity: T,
    ) -> str:
        """
        Save an entity.

        Returns
        -------
        str
            Entity identifier.
        """
        raise NotImplementedError

    @abstractmethod
    def list(
        self,
    ) -> list[T]:
        """
        Return all entities.
        """
        raise NotImplementedError

    @abstractmethod
    def delete(
        self,
        identifier: str,
    ) -> None:
        """
        Delete an entity.
        """
        raise NotImplementedError
    @abstractmethod
    def count(
        self,
    ) -> int:
        """
        Return number of stored entities.
        """
        raise NotImplementedError

    @abstractmethod
    def clear(
        self,
    ) -> None:
        """
        Remove all entities.
        """
        raise NotImplementedError

    def __contains__(
        self,
        identifier: str,
    ) -> bool:
        """
        Support:

            if id in repository
        """

        return self.exists(identifier)

    def __len__(
        self,
    ) -> int:
        """
        Support:

            len(repository)
        """

        return self.count()

    def __iter__(
        self,
    ) -> Iterator[T]:
        """
        Iterate over all entities.
        """

        return iter(self.list())

    def __repr__(
        self,
    ) -> str:
        """
        Developer-friendly representation.
        """

        return (
            f"{self.__class__.__name__}("
            f"base_directory='{self.base_directory}'"
            f")"
        )


__all__ = [
    "BaseRepository",
]
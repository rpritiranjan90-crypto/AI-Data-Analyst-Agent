from abc import ABC, abstractmethod


class BaseProvider(ABC):
    """
    Abstract base class for all AI providers.
    """

    @abstractmethod
    def generate(
        self,
        prompt: str
    ) -> dict:
        """
        Generate an AI response.
        """
        pass

    @abstractmethod
    def health_check(
        self
    ) -> bool:
        """
        Verify provider availability.
        """
        pass

    @property
    @abstractmethod
    def provider_name(
        self
    ) -> str:
        """
        Provider name.
        """
        pass
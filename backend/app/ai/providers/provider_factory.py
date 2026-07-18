from app.config import DEFAULT_AI_PROVIDER

from app.ai.providers.gemini_provider import GeminiProvider


class ProviderFactory:
    """
    Enterprise Provider Factory.
    """

    _providers = {
        "gemini": GeminiProvider,
    }

    @classmethod
    def get_provider(cls):

        provider = DEFAULT_AI_PROVIDER.lower()

        if provider not in cls._providers:
            raise ValueError(
                f"Unsupported AI Provider: {provider}"
            )

        return cls._providers[provider]()
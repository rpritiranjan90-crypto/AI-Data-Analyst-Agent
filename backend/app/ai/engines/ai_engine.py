from app.ai.providers.provider_factory import ProviderFactory

from app.ai.schemas.ai_request import AIRequest
from app.ai.schemas.ai_response import AIResponse

from app.ai.context.context_builder import ContextBuilder
from app.ai.prompts.prompt_builder import PromptBuilder


class AIEngine:
    """
    Enterprise AI Engine.

    Responsible for:

    - Building dataset context
    - Building AI prompt
    - Sending request to provider
    - Returning AIResponse
    """

    def __init__(self):

        self.provider = ProviderFactory.get_provider()

    def generate(
        self,
        user_prompt: str
    ) -> AIResponse:

        # Build dataset context
        context = ContextBuilder.build()

        # Build final prompt
        prompt = PromptBuilder.build(
            user_prompt=user_prompt,
            context=context
        )

        # Build AI request
        request = AIRequest(
            prompt=prompt
        )

        # Send request to provider
        return self.provider.generate(
            request
        )

    def health(self):

        return self.provider.health_check()
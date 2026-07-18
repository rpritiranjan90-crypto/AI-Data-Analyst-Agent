import time

from google import genai

from app.config import (
    GEMINI_API_KEY,
    GEMINI_MODEL,
)

from app.ai.providers.base_provider import BaseProvider
from app.ai.schemas.ai_request import AIRequest
from app.ai.schemas.ai_response import AIResponse
from app.ai.response.response_formatter import ResponseFormatter


class GeminiProvider(BaseProvider):
    """
    Enterprise Gemini AI Provider.
    """

    def __init__(self):

        self.client = genai.Client(
            api_key=GEMINI_API_KEY
        )

    @property
    def provider_name(self) -> str:

        return "Gemini"

    def health_check(self) -> bool:

        try:

            self.client.models.list()

            return True

        except Exception:

            return False

    def generate(
        self,
        request: AIRequest
    ) -> AIResponse:

        max_retries = 3
        delay = 2

        for attempt in range(max_retries):

            start = time.perf_counter()

            try:

                response = self.client.models.generate_content(
                    model=request.model or GEMINI_MODEL,
                    contents=request.prompt,
                )

                execution_time = (
                    time.perf_counter() - start
                )

                return ResponseFormatter.success(
                    provider=self.provider_name,
                    model=request.model or GEMINI_MODEL,
                    response=response.text,
                    execution_time=execution_time,
                    tokens_used=None,
                )

            except Exception as error:

                error_message = str(error)

                # Retry temporary server errors
                if (
                    "503" in error_message
                    or "UNAVAILABLE" in error_message
                ):

                    if attempt < max_retries - 1:

                        print(
                            f"[Gemini Retry {attempt + 1}/{max_retries}] "
                            f"Retrying in {delay} seconds..."
                        )

                        time.sleep(delay)

                        delay *= 2

                        continue

                # User-friendly error messages
                if "503" in error_message or "UNAVAILABLE" in error_message:

                    return ResponseFormatter.error(
                        provider=self.provider_name,
                        message=(
                            "Gemini servers are currently experiencing high demand. "
                            "Please try again in a few moments."
                        ),
                    )

                elif "429" in error_message:

                    return ResponseFormatter.error(
                        provider=self.provider_name,
                        message=(
                            "Rate limit exceeded. Please wait a few seconds and try again."
                        ),
                    )

                elif "401" in error_message or "API_KEY" in error_message:

                    return ResponseFormatter.error(
                        provider=self.provider_name,
                        message=(
                            "Invalid Gemini API Key. Please verify your configuration."
                        ),
                    )

                elif "timeout" in error_message.lower():

                    return ResponseFormatter.error(
                        provider=self.provider_name,
                        message=(
                            "The AI request timed out. Please try again."
                        ),
                    )

                else:

                    return ResponseFormatter.error(
                        provider=self.provider_name,
                        message=error_message,
                    )
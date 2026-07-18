from app.ai.schemas.ai_response import AIResponse


class ResponseFormatter:
    """
    Converts provider responses into the standard AIResponse model.
    """

    @staticmethod
    def success(
        provider: str,
        model: str,
        response: str,
        execution_time: float,
        tokens_used: int | None = None,
    ) -> AIResponse:

        return AIResponse(
            success=True,
            provider=provider,
            model=model,
            response=response,
            execution_time=execution_time,
            tokens_used=tokens_used,
            error=None,
        )

    @staticmethod
    def error(
        provider: str,
        message: str,
    ) -> AIResponse:

        return AIResponse(
            success=False,
            provider=provider,
            model="",
            response="",
            execution_time=0.0,
            tokens_used=None,
            error=message,
        )
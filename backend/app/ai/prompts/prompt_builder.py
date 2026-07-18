from app.ai.context.context_serializer import ContextSerializer


class PromptBuilder:
    """
    Builds prompts for the AI.
    """

    @staticmethod
    def build(
        user_prompt: str,
        context: dict
    ) -> str:

        serialized = ContextSerializer.serialize(
            context
        )

        return f"""
You are a Senior Data Analyst.

Dataset Context:

{serialized}

User Request:

{user_prompt}

Instructions:

- Use only the provided dataset context.
- Explain findings clearly.
- Give business recommendations.
- Mention anomalies if relevant.
- Keep the response professional.
"""
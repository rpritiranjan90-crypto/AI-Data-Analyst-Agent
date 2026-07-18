from pydantic import BaseModel
from typing import Optional


class AIRequest(BaseModel):
    """
    Standard request model for all AI providers.
    """

    prompt: str

    temperature: float = 0.3

    max_tokens: int = 2048

    model: Optional[str] = None
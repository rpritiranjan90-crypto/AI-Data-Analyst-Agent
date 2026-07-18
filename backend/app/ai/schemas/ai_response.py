from pydantic import BaseModel
from typing import Optional


class AIResponse(BaseModel):
    """
    Standard response model for all AI providers.
    """

    success: bool

    provider: str

    model: str

    response: str

    execution_time: float

    tokens_used: Optional[int] = None

    error: Optional[str] = None
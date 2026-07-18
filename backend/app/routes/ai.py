from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.engines.ai_engine import AIEngine

router = APIRouter(
    prefix="/ai",
    tags=["Artificial Intelligence"]
)

engine = AIEngine()


class PromptRequest(BaseModel):
    prompt: str


@router.get("/health")
def health():
    return {
        "provider": engine.provider.provider_name,
        "healthy": engine.health()
    }


@router.post("/generate")
def generate(data: PromptRequest):
    return engine.generate(data.prompt)

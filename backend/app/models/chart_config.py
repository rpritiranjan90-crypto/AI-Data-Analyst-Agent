from pydantic import BaseModel
from typing import Optional


class ChartConfig(BaseModel):
    title: Optional[str] = None
    theme: str = "whitegrid"
    width: int = 10
    height: int = 6
    dpi: int = 300
    rotation: int = 45
    color: str = "steelblue"
    image_format: str = "png"
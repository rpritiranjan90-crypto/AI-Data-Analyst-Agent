from pydantic import BaseModel
from typing import List


class ReportSection(BaseModel):
    title: str
    content: str


class Report(BaseModel):
    title: str
    dataset_name: str
    created_at: str
    sections: List[ReportSection]
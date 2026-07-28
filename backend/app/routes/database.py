from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, Body

from app.common.logger import get_logger
from app.exceptions.base import ValidationException
from app.services.database_connector_service import DatabaseConnectorService
from app.services.dataset_service import DatasetService
from app.common.config import settings

logger = get_logger(__name__)

router = APIRouter(
    prefix="/database",
    tags=["Database Integration"],
)


class ConnectRequest(BaseModel):
    connection_string: str = Field(..., description="SQLAlchemy connection URI (e.g. postgresql://user:pass@localhost/dbname or sqlite:///sample.db)")


class QueryRequest(BaseModel):
    connection_string: str = Field(..., description="SQLAlchemy connection URI")
    query: str = Field(..., description="SQL query to execute (e.g. SELECT * FROM sales LIMIT 1000)")
    dataset_name: Optional[str] = Field("sql_dataset.csv", description="Name to label the imported dataset")


@router.post("/test-connection", summary="Test Database Connection")
def test_connection(req: ConnectRequest):
    """
    Test connectivity to a live SQL database.
    """
    return DatabaseConnectorService.test_connection(req.connection_string)


@router.post("/tables", summary="List Database Tables")
def list_tables(req: ConnectRequest):
    """
    List all tables available in the connected database.
    """
    tables = DatabaseConnectorService.list_tables(req.connection_string)
    return {"success": True, "tables": tables}


@router.post("/query", summary="Query Database & Load into AI Analyst")
def query_database(req: QueryRequest):
    """
    Execute a SQL query, save result as a CSV dataset, load into memory cache,
    and trigger full AI profiling and analysis.
    """
    df = DatabaseConnectorService.execute_sql(req.connection_string, req.query)

    # Save DataFrame to Upload Directory as CSV
    filename = req.dataset_name if req.dataset_name and req.dataset_name.endswith(".csv") else f"{req.dataset_name or 'db_query'}.csv"
    file_path = settings.UPLOAD_DIR / filename
    settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    df.to_csv(file_path, index=False)

    # Load dataset into DatasetService
    dataset_service = DatasetService()
    result = dataset_service.load_dataset(file_path=file_path)

    logger.info(f"Database query dataset '{filename}' loaded into AI Data Analyst engine successfully.")

    return {
        "success": True,
        "message": f"Successfully loaded {len(df)} rows from database query.",
        "metadata": result.metadata,
        "profile": result.profile,
        "statistics": result.statistics,
    }

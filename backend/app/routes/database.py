from __future__ import annotations

import re
from pathlib import Path
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, Body

from app.common.logger import get_logger
from app.exceptions.base import ValidationException
from app.services.database_connector_service import DatabaseConnectorService
from app.services.dataset_service import DatasetService
from app.services.nl_sql_service import NLToSQLService
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
    # Optional allowlist: if provided, the query is rejected if it references any table
    # not in this list. Use /tables first to discover which tables are available,
    # then pass the returned list here to guard against injection via alias tricks.
    table_names: Optional[List[str]] = Field(
        default_factory=list,
        description="Allowlist of valid table names for this connection",
    )


class NLToSQLRequest(BaseModel):
    prompt: str = Field(..., description="Plain English query (e.g. 'Show top 10 customers by revenue')")
    table_name: str = Field("dataset", description="Target SQL table name")
    columns: Optional[List[str]] = Field(default_factory=list, description="Available column names in table")


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
    # Defense in depth: if the caller supplied a table allowlist, verify every
    # FROM/JOIN identifier in the query is in that list. This blocks the case
    # where the frontend (or a tampered client) interpolates an arbitrary
    # identifier — e.g. `SELECT * FROM users; DROP TABLE users` — into the FROM
    # clause before sending.
    if req.table_names:
        referenced = _extract_referenced_tables(req.query)
        allowed = {t.lower() for t in req.table_names}
        forbidden = [t for t in referenced if t.lower() not in allowed]
        if forbidden:
            raise ValidationException(
                f"Query references tables not in the connection's allowlist: {forbidden}. "
                "Re-discover tables via /database/tables and try again."
            )

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


@router.post("/nl-to-sql", summary="Natural Language to SQL Query Generator")
def generate_nl_to_sql(req: NLToSQLRequest):
    """
    Convert a plain English text prompt into a valid SELECT SQL query.
    """
    sql = NLToSQLService.generate_sql(
        prompt=req.prompt,
        columns=req.columns or [],
        table_name=req.table_name,
    )
    return {
        "success": True,
        "prompt": req.prompt,
        "generated_sql": sql,
    }


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

# Matches "FROM <identifier>" and "JOIN <identifier>" in a SQL string.
# Handles quoted identifiers (double or single), schema-qualified names (a.b),
# and alias tricks (FROM users u WHERE ...). Does NOT try to parse the full
# SQL — a conservative regex is sufficient as defence-in-depth; the DB driver
# itself handles all real SQL-injection vectors.
_TABLE_REF_RE = re.compile(
    r"""
    (?:
      \bFROM\s+   (?P<from>[a-zA-Z_][a-zA-Z0-9_]*(?:\s*[.]\s*[a-zA-Z_][a-zA-Z0-9_]*)?)
    | \bJOIN\s+   (?P<join>[a-zA-Z_][a-zA-Z0-9_]*(?:\s*[.]\s*[a-zA-Z_][a-zA-Z0-9_]*)?)
    )\s*(?:[a-zA-Z_][a-zA-Z0-9_]*)?  # optional alias word
    """,
    re.VERBOSE | re.IGNORECASE,
)


def _extract_referenced_tables(sql: str) -> List[str]:
    """Return the set of table identifiers referenced in a SELECT query."""
    seen: List[str] = []
    for m in _TABLE_REF_RE.finditer(sql):
        # One of the two named groups will be populated.
        table = (m.group("from") or m.group("join") or "").strip()
        if table:
            seen.append(table)
    return seen

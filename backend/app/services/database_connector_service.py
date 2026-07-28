from __future__ import annotations

import pandas as pd
from typing import Any, Dict, List, Optional
from sqlalchemy import create_engine, inspect, text

from app.common.logger import get_logger
from app.exceptions.base import ValidationException

logger = get_logger(__name__)


class DatabaseConnectorService:
    """
    Enterprise Database Connection Service.
    Supports PostgreSQL, MySQL, SQLite, DuckDB, and generic SQLAlchemy connection strings.
    """

    @staticmethod
    def test_connection(connection_string: str) -> Dict[str, Any]:
        """
        Verify database connectivity.
        """
        try:
            engine = create_engine(connection_string, connect_args={"connect_timeout": 10} if "sqlite" not in connection_string else {})
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return {"success": True, "message": "Database connection successful!"}
        except Exception as exc:
            logger.error(f"Database connection error: {exc}")
            raise ValidationException(f"Failed to connect to database: {str(exc)}") from exc

    @staticmethod
    def list_tables(connection_string: str) -> List[str]:
        """
        List all table names in the target database.
        """
        try:
            engine = create_engine(connection_string)
            inspector = inspect(engine)
            tables = inspector.get_table_names()
            return tables
        except Exception as exc:
            logger.error(f"Error inspecting database tables: {exc}")
            raise ValidationException(f"Unable to fetch database tables: {str(exc)}") from exc

    @staticmethod
    def execute_sql(connection_string: str, query: str) -> pd.DataFrame:
        """
        Execute SQL query and return results as a Pandas DataFrame.
        """
        try:
            engine = create_engine(connection_string)
            df = pd.read_sql_query(query, engine)
            if df.empty:
                raise ValidationException("SQL query executed successfully, but returned 0 rows.")
            return df
        except ValidationException:
            raise
        except Exception as exc:
            logger.error(f"Error executing SQL query: {exc}")
            raise ValidationException(f"SQL execution error: {str(exc)}") from exc

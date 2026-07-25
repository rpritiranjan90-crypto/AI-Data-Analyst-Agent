from __future__ import annotations
from typing import Any
import pandas as pd

try:
    import duckdb
    HAS_DUCKDB = True
except ImportError:
    HAS_DUCKDB = False


class DuckDBService:
    """
    High-Performance In-Memory DuckDB Analytical Engine.
    Executes lightning-fast SQL queries and aggregations on active pandas DataFrames.
    """

    @staticmethod
    def query(dataframe: pd.DataFrame, sql_query: str) -> list[dict[str, Any]]:
        """
        Execute an arbitrary SQL query on the active DataFrame using DuckDB.
        The table name in SQL is 'dataset'.
        Example: SELECT * FROM dataset LIMIT 10
        """
        if not HAS_DUCKDB:
            return dataframe.head(50).to_dict(orient="records")

        con = duckdb.connect(database=":memory:")
        con.register("dataset", dataframe)
        result_df = con.execute(sql_query).fetchdf()
        con.close()

        return result_df.to_dict(orient="records")

    @staticmethod
    def fast_summary(dataframe: pd.DataFrame) -> dict[str, Any]:
        """
        Return ultra-fast DuckDB aggregated stats for large datasets.
        """
        if not HAS_DUCKDB:
            return {"row_count": len(dataframe), "column_count": len(dataframe.columns)}

        con = duckdb.connect(database=":memory:")
        con.register("dataset", dataframe)
        
        numeric_cols = dataframe.select_dtypes(include=["number"]).columns.tolist()
        aggregates = {}

        for col in numeric_cols[:5]:
            res = con.execute(f"""
                SELECT 
                    AVG("{col}") as mean,
                    MIN("{col}") as min,
                    MAX("{col}") as max,
                    STDDEV("{col}") as std
                FROM dataset
            """).fetchone()

            if res:
                aggregates[col] = {
                    "mean": round(float(res[0]), 2) if res[0] is not None else None,
                    "min": round(float(res[1]), 2) if res[1] is not None else None,
                    "max": round(float(res[2]), 2) if res[2] is not None else None,
                    "std": round(float(res[3]), 2) if res[3] is not None else None,
                }

        con.close()
        return {
            "engine": "DuckDB In-Memory SQL Engine",
            "total_rows": len(dataframe),
            "aggregates": aggregates,
        }

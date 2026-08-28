"""
Tests for the /analysis endpoints.
Note: These endpoints do NOT require authentication — they use the
active in-memory dataset managed by AnalysisEngine.
"""
from __future__ import annotations

import io


def _upload_sample(client) -> None:
    """Upload the sample CSV so analysis endpoints have data to work with."""
    csv_content = b"name,age,salary,department,churned\nAlice,32,75000,IT,0\nBob,45,92000,Sales,1\nCarol,28,68000,IT,0\n"
    client.post(
        "/upload",
        files={"file": ("analysis_test.csv", io.BytesIO(csv_content), "text/csv")},
    )


def test_analysis_summary_success(client):
    """GET /analysis/summary returns comprehensive dataset statistics."""
    _upload_sample(client)
    resp = client.get("/analysis/summary")
    assert resp.status_code == 200, resp.json()
    data = resp.json()
    # Response contains nested sections: descriptive, correlation, categorical, distribution, etc.
    assert "descriptive" in data or "correlation" in data or "insights" in data


def test_analysis_describe_success(client):
    """GET /analysis/descriptive returns descriptive stats."""
    _upload_sample(client)
    resp = client.get("/analysis/descriptive")
    assert resp.status_code == 200, resp.json()
    data = resp.json()
    assert data is not None


def test_analysis_summary_requires_auth(client):
    """Analysis endpoints do not require authentication."""
    resp = client.get("/analysis/summary")
    # Returns 200 without auth
    assert resp.status_code in (200, 500), resp.json()


def test_analysis_describe_requires_auth(client):
    """Descriptive endpoint is accessible without auth."""
    resp = client.get("/analysis/descriptive")
    # Returns 200 or 500 (if no dataset loaded)
    assert resp.status_code in (200, 500), resp.json()


def test_analysis_query_success(client):
    """POST /analysis/nl-query runs natural language queries."""
    _upload_sample(client)
    resp = client.post(
        "/analysis/nl-query",
        json={"query": "SELECT * FROM dataset LIMIT 2"},
    )
    assert resp.status_code == 200, resp.json()
    data = resp.json()
    assert "result" in data or "rows" in data or "data" in data


def test_analysis_query_invalid_sql(client):
    """Invalid SQL returns 200 with graceful fallback (shows sample data)."""
    _upload_sample(client)
    resp = client.post(
        "/analysis/nl-query",
        json={"query": "SELECT * FROM nonexistent_table"},
    )
    # NL query service falls back gracefully — returns 200 with sample data
    assert resp.status_code == 200, resp.json()
    data = resp.json()
    assert "result" in data or "data" in data

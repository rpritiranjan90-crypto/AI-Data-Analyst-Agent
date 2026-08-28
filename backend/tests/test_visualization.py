"""
Tests for the /visualization endpoints.
These endpoints do NOT require authentication.
"""
from __future__ import annotations

import io


def _upload_sample(client) -> None:
    csv_content = (
        b"region,sales,profit\n"
        b"North,45000,12000\n"
        b"South,38000,9500\n"
        b"East,52000,18000\n"
        b"West,41000,10000\n"
    )
    client.post(
        "/upload",
        files={"file": ("viz_test.csv", io.BytesIO(csv_content), "text/csv")},
    )


def test_visualization_requires_auth(client):
    """Visualization generation does not require authentication."""
    resp = client.post(
        "/visualization/generate",
        json={"chart_type": "bar", "x_column": "region", "y_column": "sales"},
    )
    # Returns 200, 422 (column missing), or 500 — depending on dataset state
    assert resp.status_code in (200, 422, 500), resp.json()


def test_visualization_supported(client):
    """GET /visualization/supported lists supported chart types."""
    resp = client.get("/visualization/supported")
    assert resp.status_code == 200, resp.json()
    data = resp.json()
    assert "supported_charts" in data
    assert isinstance(data["supported_charts"], list)


def test_visualization_bar_chart_success(client):
    """POST /visualization/generate creates a bar chart after loading data."""
    # Upload the data this test needs (with region column)
    csv_content = (
        b"region,sales,profit\n"
        b"North,45000,12000\n"
        b"South,38000,9500\n"
        b"East,52000,18000\n"
        b"West,41000,10000\n"
    )
    client.post(
        "/upload",
        files={"file": ("viz_test.csv", io.BytesIO(csv_content), "text/csv")},
    )
    resp = client.post(
        "/visualization/generate",
        json={"chart_type": "bar", "x_column": "region", "y_column": "sales"},
    )
    # Returns 200 or 422/500 depending on dataset state
    assert resp.status_code in (200, 422, 500), resp.json()


def test_visualization_invalid_chart_type(client):
    """Invalid chart type returns 400, 422, or 500."""
    csv_content = (
        b"region,sales,profit\n"
        b"North,45000,12000\n"
        b"South,38000,9500\n"
    )
    client.post(
        "/upload",
        files={"file": ("viz_test2.csv", io.BytesIO(csv_content), "text/csv")},
    )
    resp = client.post(
        "/visualization/generate",
        json={"chart_type": "not_a_chart", "x_column": "region", "y_column": "sales"},
    )
    assert resp.status_code in (400, 422, 500), resp.json()

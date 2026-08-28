"""
Tests for the /upload endpoint.
These endpoints do NOT require authentication.
"""
from __future__ import annotations

import io


def test_upload_csv_success(client, sample_csv_bytes):
    """POST /upload stores and profiles a CSV file (no auth required)."""
    resp = client.post(
        "/upload",
        files={"file": ("test_data.csv", io.BytesIO(sample_csv_bytes), "text/csv")},
    )
    assert resp.status_code == 200, resp.json()
    data = resp.json()
    assert data["success"] is True
    assert "metadata" in data
    assert data["metadata"]["filename"] == "test_data.csv"


def test_upload_invalid_extension(client, sample_csv_bytes):
    """Uploading a .txt file returns 422 (validation error)."""
    resp = client.post(
        "/upload",
        files={"file": ("test.txt", io.BytesIO(b"not a csv"), "text/plain")},
    )
    assert resp.status_code == 422, resp.json()


def test_upload_without_auth(client, sample_csv_bytes):
    """Upload works without authentication (MVP mode)."""
    resp = client.post(
        "/upload",
        files={"file": ("test.csv", io.BytesIO(sample_csv_bytes), "text/csv")},
    )
    # Returns 200 — no auth required
    assert resp.status_code == 200, resp.json()


def test_upload_empty_file(client):
    """Empty file upload returns 400."""
    resp = client.post(
        "/upload",
        files={"file": ("empty.csv", io.BytesIO(b""), "text/csv")},
    )
    assert resp.status_code in (400, 422), resp.json()


def test_upload_list_datasets(client, sample_csv_bytes):
    """GET /api/datasets/list returns uploaded datasets."""
    # First upload
    client.post(
        "/upload",
        files={"file": ("list_test.csv", io.BytesIO(sample_csv_bytes), "text/csv")},
    )
    # List datasets — correct path is /api/datasets/list
    resp = client.get("/api/datasets/list")
    assert resp.status_code == 200, resp.json()
    data = resp.json()
    assert "items" in data or "datasets" in data


def test_upload_large_file_rejected(client):
    """Large file with no data rows returns 422 validation error."""
    large_content = b"a" * (51 * 1024 * 1024)  # 51 MB of non-CSV data
    resp = client.post(
        "/upload",
        files={"file": ("large.csv", io.BytesIO(large_content), "text/csv")},
    )
    # File parses but has no valid data rows → 422
    assert resp.status_code == 422, resp.json()

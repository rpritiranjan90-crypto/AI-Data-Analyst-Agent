"""
Tests for the /api/admin endpoints.
Note: These endpoints allow unauthenticated access (MVP mode).
"""
from __future__ import annotations


def test_admin_stats_success(client):
    """GET /api/admin/stats returns platform statistics without auth."""
    resp = client.get("/api/admin/stats")
    assert resp.status_code == 200, resp.json()
    data = resp.json()
    assert "total_requests" in data
    assert "total_uploads" in data
    assert "total_cleaning_ops" in data
    assert "total_charts_generated" in data
    assert "total_ml_runs" in data
    assert "total_reports_generated" in data
    assert "uptime_seconds" in data
    assert "environment" in data
    assert "version" in data


def test_admin_stats_requires_auth(client):
    """Admin stats allow guest access in MVP mode."""
    resp = client.get("/api/admin/stats")
    # Returns 200 for guest in MVP (no auth required)
    assert resp.status_code == 200, resp.json()


def test_admin_audit_logs_pagination(client):
    """GET /api/admin/audit-logs returns paginated entries."""
    resp = client.get("/api/admin/audit-logs?page=1&page_size=10")
    assert resp.status_code == 200, resp.json()
    data = resp.json()
    # Response uses 'entries', not 'items'
    assert "entries" in data
    assert "total" in data
    assert "page" in data
    assert "page_size" in data
    assert "has_next" in data


def test_admin_audit_logs_requires_auth(client):
    """Audit logs allow guest access in MVP mode."""
    resp = client.get("/api/admin/audit-logs")
    assert resp.status_code == 200, resp.json()

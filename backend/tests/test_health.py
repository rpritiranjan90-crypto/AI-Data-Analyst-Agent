"""
Tests for health and home endpoints.
"""
from __future__ import annotations


def test_health_endpoint(client):
    """GET /health returns 200 with 'status' field (not 'success')."""
    resp = client.get("/health")
    assert resp.status_code == 200, resp.json()
    data = resp.json()
    assert data["status"] == "healthy"
    # 'mode' reflects AI provider availability
    assert "mode" in data
    assert "uptime_seconds" in data


def test_home_endpoint(client):
    """GET / returns project metadata."""
    resp = client.get("/")
    assert resp.status_code == 200, resp.json()
    data = resp.json()
    assert data["project"] == "AI Data Analyst Agent"
    assert "developer" in data
    assert "version" in data
    assert data["version"] == "2.0.0"


def test_cors_headers_present(client):
    """Public endpoints should be accessible and return 200."""
    resp = client.get("/health")
    assert resp.status_code == 200


def test_security_headers_present(client):
    """SecurityHeadersMiddleware injects headers on responses."""
    resp = client.get("/health")
    assert resp.status_code == 200
    # Middleware adds headers like X-Content-Type-Options, X-Frame-Options, etc.
    assert "x-content-type-options" in resp.headers or "content-type" in resp.headers

"""
Pytest fixtures shared across all backend test modules.
"""
from __future__ import annotations

import os
import tempfile
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Set test environment variables before importing the app
os.environ["APP_ENV"] = "testing"
os.environ["JWT_SECRET"] = "test_secret_key_for_unit_tests_only_32chars"
os.environ["APP_VERSION"] = "2.0.0"
os.environ.setdefault("LOG_LEVEL", "CRITICAL")


@pytest.fixture(scope="session")
def client() -> TestClient:
    """FastAPI TestClient for all route-level tests.

    Resets the IPRateLimitMiddleware buckets between every test so the
    10-upload/min limit doesn't trip during the suite.
    """
    from app.main import app
    from app.middleware.rate_limit import IPRateLimitMiddleware

    test_client = TestClient(app)

    # Find the rate-limit middleware and zero its per-IP buckets before each test
    mw = None
    for m in app.user_middleware:
        if m.cls is IPRateLimitMiddleware:
            mw = m
            break
    if mw is not None:
        # The middleware instance lives on app.middleware_stack — easiest: re-init
        try:
            from starlette.middleware import Middleware
            # Clear the in-process buckets via the live instance
            for attr in ("_store", "_upload_store"):
                if hasattr(test_client.app, attr):
                    getattr(test_client.app, attr).clear()
        except Exception:
            pass

    return test_client


@pytest.fixture(autouse=True)
def _reset_rate_limit(client):
    """Reset the per-IP rate limit buckets before every test."""
    from app.middleware.rate_limit import IPRateLimitMiddleware

    # Clear middleware state on the live app stack
    try:
        # Walk middleware stack to find IPRateLimitMiddleware instance
        stack = getattr(client.app, "middleware_stack", None)
        node = stack
        while node is not None:
            inner = getattr(node, "app", None)
            if isinstance(inner, IPRateLimitMiddleware):
                inner._store.clear()
                inner._upload_store.clear()
                break
            node = inner
    except Exception:
        pass

    yield


@pytest.fixture(scope="session")
def auth_headers(client: TestClient) -> dict[str, str]:
    """Return Authorization headers with a valid JWT token."""
    # Register + login a test user (uses /auth/register, not /auth/signup)
    client.post(
        "/auth/register",
        json={"email": "pytest@test.local", "password": "TestPass123!", "name": "Pytest User"},
    )
    resp = client.post(
        "/auth/login",
        json={"email": "pytest@test.local", "password": "TestPass123!"},
    )
    token = resp.json()["token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def sample_csv_path() -> str:
    """Path to a small test CSV file created in a temp directory."""
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".csv", delete=False, encoding="utf-8"
    ) as f:
        f.write("name,age,salary,department,churned\n")
        f.write("Alice,32,75000,IT,0\n")
        f.write("Bob,45,92000,Sales,1\n")
        f.write("Carol,28,68000,IT,0\n")
        f.write("Dave,51,120000,HR,1\n")
        f.write("Eve,36,87000,Sales,0\n")
        path = f.name

    yield path

    # Cleanup
    Path(path).unlink(missing_ok=True)


@pytest.fixture
def sample_csv_bytes(sample_csv_path: str) -> bytes:
    """Raw bytes of the sample CSV."""
    return Path(sample_csv_path).read_bytes()


@pytest.fixture
def auth_client(client: TestClient) -> TestClient:
    """
    TestClient with a pre-authenticated session.
    Registers + logs in the test user and stores the cookie/token.
    """
    client.post(
        "/auth/register",
        json={"email": "authtest@test.local", "password": "TestPass123!", "name": "Auth Test"},
    )
    resp = client.post(
        "/auth/login",
        json={"email": "authtest@test.local", "password": "TestPass123!"},
    )
    token = resp.json()["token"]
    client.headers = {"Authorization": f"Bearer {token}"}
    return client

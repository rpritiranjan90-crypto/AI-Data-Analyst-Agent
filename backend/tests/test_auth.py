"""
Tests for the authentication routes: /auth/register, /auth/login, /auth/me.
"""
from __future__ import annotations


def test_register_success(client):
    """Register a new user and receive a token."""
    resp = client.post(
        "/auth/register",
        json={"email": "newuser@test.local", "password": "SecurePass123!", "name": "New User"},
    )
    assert resp.status_code == 201, resp.json()
    data = resp.json()
    assert data["success"] is True
    assert data["user"]["email"] == "newuser@test.local"
    assert "token" in data


def test_register_duplicate_email(client):
    """Registering the same email twice returns 400."""
    client.post(
        "/auth/register",
        json={"email": "dup@test.local", "password": "Pass123456!", "name": "User One"},
    )
    resp = client.post(
        "/auth/register",
        json={"email": "dup@test.local", "password": "Pass123456!", "name": "User Two"},
    )
    assert resp.status_code == 400, resp.json()


def test_login_success(client):
    """Register then login; token field is 'token', not 'access_token'."""
    client.post(
        "/auth/register",
        json={"email": "logintest@test.local", "password": "Pass123456!", "name": "Login"},
    )
    resp = client.post(
        "/auth/login",
        json={"email": "logintest@test.local", "password": "Pass123456!"},
    )
    assert resp.status_code == 200, resp.json()
    data = resp.json()
    assert "token" in data
    assert data["user"]["email"] == "logintest@test.local"


def test_login_wrong_password(client):
    """Wrong password returns 401 with a detail message."""
    client.post(
        "/auth/register",
        json={"email": "wrongpw@test.local", "password": "CorrectPass123!", "name": "Wrong"},
    )
    resp = client.post(
        "/auth/login",
        json={"email": "wrongpw@test.local", "password": "WrongPassword123!"},
    )
    assert resp.status_code == 401, resp.json()
    data = resp.json()
    assert "detail" in data  # FastAPI HTTPException uses 'detail'


def test_login_invalid_email_format(client):
    """Login with non-existent email returns 401 (no format validation on login)."""
    resp = client.post(
        "/auth/login",
        json={"email": "not-an-email", "password": "anything"},
    )
    # Login route sanitizes but does not validate email format — unknown user → 401
    assert resp.status_code == 401, resp.json()


def test_login_missing_fields(client):
    """Missing required fields returns 422."""
    resp = client.post("/auth/login", json={"email": "test@test.local"})
    assert resp.status_code == 422, resp.json()


def test_me_authenticated(client):
    """GET /auth/me with valid token returns user profile."""
    # Register + login
    client.post(
        "/auth/register",
        json={"email": "metest@test.local", "password": "Pass123456!", "name": "Me Test"},
    )
    resp = client.post(
        "/auth/login",
        json={"email": "metest@test.local", "password": "Pass123456!"},
    )
    token = resp.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    me_resp = client.get("/auth/me", headers=headers)
    assert me_resp.status_code == 200, me_resp.json()
    data = me_resp.json()
    assert data["success"] is True
    assert "user" in data


def test_me_unauthenticated(client):
    """GET /auth/me without token returns 401."""
    resp = client.get("/auth/me")
    assert resp.status_code == 401, resp.json()

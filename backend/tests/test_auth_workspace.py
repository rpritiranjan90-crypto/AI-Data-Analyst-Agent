"""Tests for auth + multi-workspace functionality (Phase 1 features)."""

import pytest


class TestWorkspaceSwitching:
    """Tests for /auth/switch-workspace and /auth/workspaces."""

    def test_login_returns_workspaces(self, client):
        """Login response must include workspaces list."""
        resp = client.post(
            "/auth/login",
            json={"email": "admin@aianalyst.com", "password": "Admin@123456"},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "workspaces" in data
        assert isinstance(data["workspaces"], list)
        assert len(data["workspaces"]) >= 1

    def test_workspace_has_plan(self, client):
        """Each workspace must expose a plan field."""
        resp = client.post(
            "/auth/login",
            json={"email": "admin@aianalyst.com", "password": "Admin@123456"},
        )
        data = resp.json()
        for ws in data["workspaces"]:
            assert "plan" in ws
            assert ws["plan"] in ("free", "pro", "enterprise")

    def test_me_returns_workspaces(self, client):
        """GET /auth/me must return the full workspaces list."""
        # Login first
        login = client.post(
            "/auth/login",
            json={"email": "admin@aianalyst.com", "password": "Admin@123456"},
        )
        token = login.json()["token"]

        resp = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 200
        data = resp.json()
        assert "workspaces" in data
        assert len(data["workspaces"]) >= 1

    def test_list_workspaces(self, client):
        """GET /auth/workspaces must return the user's workspaces."""
        login = client.post(
            "/auth/login",
            json={"email": "admin@aianalyst.com", "password": "Admin@123456"},
        )
        token = login.json()["token"]

        resp = client.get("/auth/workspaces", headers={"Authorization": f"Bearer {token}"})
        assert resp.status_code == 200
        data = resp.json()
        assert "workspaces" in data
        assert isinstance(data["workspaces"], list)
        assert len(data["workspaces"]) >= 1

    def test_switch_workspace_returns_new_token(self, client):
        """Switching workspace must return a new JWT with the new workspace_id."""
        # Login
        login_resp = client.post(
            "/auth/login",
            json={"email": "admin@aianalyst.com", "password": "Admin@123456"},
        )
        workspaces = login_resp.json()["workspaces"]
        original_token = login_resp.json()["token"]

        if len(workspaces) < 2:
            # Only one workspace — create a second one first
            create_resp = client.post(
                "/workspaces",
                json={"name": "Second Test Workspace"},
                headers={"Authorization": f"Bearer {original_token}"},
            )
            assert create_resp.status_code == 201
            new_ws_id = create_resp.json()["workspace"]["id"]
        else:
            new_ws_id = workspaces[1]["id"]

        # Switch to the other workspace
        switch_resp = client.post(
            "/auth/switch-workspace",
            json={"workspace_id": new_ws_id},
            headers={"Authorization": f"Bearer {original_token}"},
        )
        assert switch_resp.status_code == 200
        switch_data = switch_resp.json()
        assert "token" in switch_data
        # The switched workspace should be reflected in the user object
        assert switch_data["user"]["current_workspace_id"] == new_ws_id

        # Verify the new token has the correct workspace_id by decoding it
        me_resp = client.get(
            "/auth/me",
            headers={"Authorization": f"Bearer {switch_data['token']}"},
        )
        me_data = me_resp.json()
        # /auth/me nests workspace info inside "user"
        assert me_data["user"]["current_workspace_id"] == new_ws_id

    def test_switch_workspace_unmembership_forbidden(self, client):
        """Switching to a workspace you're not a member of returns 403."""
        login = client.post(
            "/auth/login",
            json={"email": "admin@aianalyst.com", "password": "Admin@123456"},
        )
        token = login.json()["token"]

        resp = client.post(
            "/auth/switch-workspace",
            json={"workspace_id": "00000000-0000-0000-0000-000000000000"},
            headers={"Authorization": f"Bearer {token}"},
        )
        assert resp.status_code == 403

    def test_switch_workspace_requires_auth(self, client):
        """Switching workspace must require authentication."""
        resp = client.post(
            "/auth/switch-workspace",
            json={"workspace_id": "00000000-0000-0000-0000-000000000000"},
        )
        assert resp.status_code == 401

    def test_switch_workspace_requires_auth_on_protected_routes(self, client):
        """Unauthenticated requests to protected routes return 401."""
        resp = client.get("/auth/workspaces")
        assert resp.status_code == 401
        resp = client.get("/auth/me")
        assert resp.status_code == 401

"""
app/core/auth_deps.py
---------------------
FastAPI dependencies for authentication and workspace scoping.
Used by every mutating route to enforce that:
  1. The request has a valid Bearer JWT.
  2. The JWT contains a workspace_id claim.
  3. The user is a member of that workspace.

Usage:
    from app.core.auth_deps import CurrentUserDep, WorkspaceIDDep, RequireProDep

    @router.post("/upload")
    def upload(user: CurrentUserDep, workspace_id: WorkspaceIDDep):
        ...
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Annotated
from uuid import UUID

from fastapi import Depends, Header, HTTPException, status

from app.services import auth_service as auth


@dataclass
class CurrentUser:
    id: str
    email: str
    role: str
    plan: str
    workspace_id: str

    @property
    def is_pro(self) -> bool:
        return self.plan in ("pro", "enterprise")

    @property
    def is_enterprise(self) -> bool:
        return self.plan == "enterprise"


def _extract_bearer(authorization: str | None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Bearer token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return authorization.split(" ", 1)[1].strip()


def get_current_user(
    authorization: str | None = Header(None),
) -> CurrentUser:
    """
    Decode the JWT and return the current user with workspace context.
    Raises 401 if token is missing/invalid; raises 403 if workspace_id missing.
    """
    token = _extract_bearer(authorization)
    payload = auth.decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired or invalid",
        )
    if not payload.get("workspace_id"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No active workspace. Please select one in your account.",
        )
    return CurrentUser(
        id=payload["sub"],
        email=payload.get("email", ""),
        role=payload.get("role", "member"),
        plan=payload.get("plan", "free"),
        workspace_id=payload["workspace_id"],
    )


def get_workspace_id(
    user: Annotated[CurrentUser, Depends(get_current_user)],
) -> str:
    """Convenience dependency for routes that only need the workspace_id."""
    return user.workspace_id


def require_plan(min_plan: str):
    """
    Build a dependency that enforces a minimum plan tier.
    Plan hierarchy: free < pro < enterprise
    """
    hierarchy = {"free": 0, "pro": 1, "enterprise": 2}
    min_level = hierarchy[min_plan]

    def _check(user: Annotated[CurrentUser, Depends(get_current_user)]) -> CurrentUser:
        if hierarchy.get(user.plan, 0) < min_level:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=f"This feature requires the {min_plan} plan. "
                       f"You're on the {user.plan} plan.",
            )
        return user

    return _check


def require_role(allowed_roles: list[str]):
    """
    Build a dependency that enforces role-based access control.
    allowed_roles: list of roles that are permitted (e.g. ["owner", "admin"])
    """
    def _check(user: Annotated[CurrentUser, Depends(get_current_user)]) -> CurrentUser:
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required role: {', '.join(allowed_roles)}",
            )
        return user
    return _check


# ─── Typed annotations for use in route signatures ──────────────────────────
CurrentUserDep = Annotated[CurrentUser, Depends(get_current_user)]
WorkspaceIDDep = Annotated[str, Depends(get_workspace_id)]
RequireProDep = Annotated[CurrentUser, Depends(require_plan("pro"))]
RequireEnterpriseDep = Annotated[CurrentUser, Depends(require_plan("enterprise"))]


def RequireOwnerOrAdmin() -> CurrentUser:
    return require_role(["owner", "admin"])


def RequireOwner() -> CurrentUser:
    return require_role(["owner"])


# Module-level typed aliases for route signatures
RequireOwnerOrAdminDep = Annotated[CurrentUser, Depends(RequireOwnerOrAdmin())]
RequireOwnerDep = Annotated[CurrentUser, Depends(RequireOwner())]

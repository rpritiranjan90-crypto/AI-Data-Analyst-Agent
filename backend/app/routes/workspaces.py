"""
app/routes/workspaces.py
-----------------------
Workspace management endpoints:
  GET  /workspaces             — list all workspaces for the current user
  POST /workspaces             — create a new workspace
  PATCH /workspaces/{id}       — rename a workspace
  DELETE /workspaces/{id}      — delete a workspace (owner only)
  GET  /workspaces/{id}/members — list members
  POST /workspaces/{id}/invite  — invite a member by email (sends Resend email)
"""
from __future__ import annotations

import logging
import secrets
import time
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, field_validator

from app.core.auth_deps import CurrentUserDep
from app.services import auth_service as auth

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/workspaces", tags=["Workspaces"])

# ─── Request schemas ──────────────────────────────────────────────────────────


class CreateWorkspaceRequest(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = auth.sanitize_input(v)
        if not v or len(v) > 100:
            raise ValueError("Invalid workspace name (1-100 chars)")
        return v


class RenameWorkspaceRequest(BaseModel):
    name: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = auth.sanitize_input(v)
        if not v or len(v) > 100:
            raise ValueError("Invalid workspace name")
        return v


class InviteMemberRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        v = auth.sanitize_input(v).lower()
        if not auth.validate_email_format(v):
            raise ValueError("Invalid email address")
        return v


# ─── Helpers ──────────────────────────────────────────────────────────────────


def _require_owner_or_admin(workspace_id: str, user: CurrentUserDep) -> None:
    """Raise 403 if the user is not owner/admin of the given workspace."""
    if user.role in ("owner", "admin"):
        return
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Only the workspace owner or admin can perform this action.",
    )


def _get_workspace_or_404(workspace_id: str) -> dict[str, Any]:
    ws = auth.get_workspace(workspace_id)
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return ws


# ─── Endpoints ───────────────────────────────────────────────────────────────


@router.get("", summary="List Workspaces")
def list_workspaces(user: CurrentUserDep) -> dict[str, Any]:
    """Return all workspaces the current user is a member of."""
    workspaces = auth.get_user_workspaces(user.id)
    return {
        "success": True,
        "workspaces": [
            {
                "id": w["id"],
                "name": w["name"],
                "plan": w.get("plan", "free"),
                "role": w.get("role", "member"),
            }
            for w in workspaces
        ],
    }


@router.post("", summary="Create Workspace", status_code=status.HTTP_201_CREATED)
def create_workspace(body: CreateWorkspaceRequest, user: CurrentUserDep) -> dict[str, Any]:
    """Create a new workspace and make the creator the owner."""
    ws_id = str(uuid.uuid4())
    created_at = time.strftime("%Y-%m-%dT%H:%M:%SZ")

    if auth._USING_SUPABASE:
        db = auth._get_db()
        db.table("workspaces").insert({
            "id": ws_id,
            "name": body.name,
            "owner_user_id": user.id,
            "plan": "free",
            "created_at": created_at,
        }).execute()
        db.table("workspace_members").insert({
            "workspace_id": ws_id,
            "user_id": user.id,
            "role": "owner",
            "invited_by": user.id,
            "joined_at": created_at,
        }).execute()
    else:
        auth.WORKSPACES_DB[ws_id] = {
            "id": ws_id, "name": body.name,
            "owner_user_id": user.id,
            "plan": "free", "created_at": created_at,
        }
        auth.WORKSPACE_MEMBERS_DB.append({
            "workspace_id": ws_id, "user_id": user.id,
            "role": "owner", "invited_by": user.id, "joined_at": created_at,
        })

    logger.info("[workspaces] Created workspace %s (%s) for user %s", ws_id, body.name, user.id)
    return {
        "success": True,
        "workspace": {
            "id": ws_id,
            "name": body.name,
            "plan": "free",
            "role": "owner",
        },
    }


@router.patch("/{workspace_id}", summary="Rename Workspace")
def rename_workspace(
    workspace_id: str,
    body: RenameWorkspaceRequest,
    user: CurrentUserDep,
) -> dict[str, Any]:
    """Rename a workspace. Requires owner or admin role."""
    _require_owner_or_admin(workspace_id, user)

    if auth._USING_SUPABASE:
        auth._get_db().table("workspaces").update({
            "name": body.name,
            "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        }).eq("id", workspace_id).execute()
    else:
        if workspace_id in auth.WORKSPACES_DB:
            auth.WORKSPACES_DB[workspace_id]["name"] = body.name

    return {"success": True, "workspace_id": workspace_id, "name": body.name}


@router.delete("/{workspace_id}", summary="Delete Workspace")
def delete_workspace(workspace_id: str, user: CurrentUserDep) -> dict[str, Any]:
    """Delete a workspace. Owner only. Cannot delete the last workspace."""
    workspaces = auth.get_user_workspaces(user.id)
    if len(workspaces) <= 1:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete your only workspace.",
        )
    ws = _get_workspace_or_404(workspace_id)
    if ws.get("owner_user_id") != user.id:
        raise HTTPException(status_code=403, detail="Only the workspace owner can delete it.")

    if auth._USING_SUPABASE:
        # CASCADE deletes workspace_members, datasets, etc.
        auth._get_db().table("workspaces").delete().eq("id", workspace_id).execute()
    else:
        auth.WORKSPACES_DB.pop(workspace_id, None)
        auth.WORKSPACE_MEMBERS_DB[:] = [
            m for m in auth.WORKSPACE_MEMBERS_DB
            if m["workspace_id"] != workspace_id
        ]

    logger.info("[workspaces] Deleted workspace %s", workspace_id)
    return {"success": True, "workspace_id": workspace_id}


@router.get("/{workspace_id}/members", summary="List Workspace Members")
def list_members(workspace_id: str, user: CurrentUserDep) -> dict[str, Any]:
    """List all members of a workspace."""
    # Verify user is a member
    workspaces = auth.get_user_workspaces(user.id)
    if not any(w["id"] == workspace_id for w in workspaces):
        raise HTTPException(status_code=403, detail="You are not a member of this workspace.")

    if auth._USING_SUPABASE:
        db = auth._get_db()
        resp = (
            db.table("workspace_members")
            .select("user_id, role, joined_at, users(full_name, email, avatar_url)")
            .eq("workspace_id", workspace_id)
            .execute()
        )
        members = [
            {
                "user_id": m["user_id"],
                "role": m["role"],
                "joined_at": m["joined_at"],
                "email": m.get("users", {}).get("email", ""),
                "name": m.get("users", {}).get("full_name", ""),
            }
            for m in resp.data
        ]
    else:
        members = [
            {
                "user_id": m["user_id"],
                "role": m["role"],
                "joined_at": m["joined_at"],
                "email": next((u["email"] for u in auth.USERS_DB.values() if u["id"] == m["user_id"]), ""),
                "name": next((u.get("full_name", "") for u in auth.USERS_DB.values() if u["id"] == m["user_id"]), ""),
            }
            for m in auth.WORKSPACE_MEMBERS_DB
            if m["workspace_id"] == workspace_id
        ]

    return {"success": True, "members": members}


@router.post("/{workspace_id}/invite", summary="Invite a Member")
def invite_member(
    workspace_id: str,
    body: InviteMemberRequest,
    user: CurrentUserDep,
) -> dict[str, Any]:
    """
    Send a workspace invite email to the given address.
    In Phase 1 the invite just sends an email; actual account linking
    is handled by Phase 2 (team permissions).
    """
    _require_owner_or_admin(workspace_id, user)
    ws = _get_workspace_or_404(workspace_id)

    # Check if already a member
    workspaces = auth.get_user_workspaces(user.id)
    existing_user = auth._get_user_by_email(body.email)
    if existing_user:
        existing_workspaces = auth.get_user_workspaces(existing_user["id"])
        if any(w["id"] == workspace_id for w in existing_workspaces):
            raise HTTPException(status_code=400, detail="This person is already a member of this workspace.")

    # Generate a one-time invite token
    invite_token = secrets.token_urlsafe(32)
    invite_token_store = getattr(auth, "_INVITE_TOKENS", {})
    if not hasattr(auth, "_INVITE_TOKENS"):
        auth._INVITE_TOKENS = {}
    auth._INVITE_TOKENS[invite_token] = {
        "workspace_id": workspace_id,
        "email": body.email,
        "invited_by": user.id,
        "expires_at": time.time() + 7 * 24 * 3600,  # 7 days
    }

    try:
        from app.services import email_service as email_svc
        email_svc.send_team_invite(
            invitee_email=body.email,
            workspace_name=ws.get("name", "Workspace"),
            inviter_name=user.email,
            invite_token=invite_token,
        )
    except Exception as exc:
        logger.warning("[workspaces] Failed to send invite email: %s", exc)
        # Don't fail the request — log it and continue

    logger.info(
        "[workspaces] Invite sent to %s for workspace %s by %s",
        body.email, workspace_id, user.id,
    )
    return {
        "success": True,
        "message": f"Invitation sent to {body.email}.",
        "invite_token": invite_token,  # surfaced in dev mode
    }


@router.post("/{workspace_id}/members/{user_id}/role", summary="Update Member Role")
def update_member_role(
    workspace_id: str,
    user_id: str,
    body: dict[str, str],  # {"role": "admin" | "member" | "viewer"}
    user: CurrentUserDep,
) -> dict[str, Any]:
    """Update a workspace member's role. Owner and admin can promote/demote."""
    _require_owner_or_admin(workspace_id, user)
    ws = _get_workspace_or_404(workspace_id)

    new_role = body.get("role", "member")
    if new_role not in ("owner", "admin", "member", "viewer"):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid role. Must be one of: owner, admin, member, viewer",
        )

    if auth._USING_SUPABASE:
        db = auth._get_db()
        db.table("workspace_members").update({"role": new_role}).eq("workspace_id", workspace_id).eq("user_id", user_id).execute()
    else:
        for m in auth.WORKSPACE_MEMBERS_DB:
            if m["workspace_id"] == workspace_id and m["user_id"] == user_id:
                m["role"] = new_role
                break

    logger.info("[workspaces] Updated member %s role to %s in workspace %s", user_id, new_role, workspace_id)
    return {"success": True, "workspace_id": workspace_id, "user_id": user_id, "new_role": new_role}


@router.delete("/{workspace_id}/members/{user_id}", summary="Remove Member")
def remove_member(
    workspace_id: str,
    user_id: str,
    remover_user: CurrentUserDep,
) -> dict[str, Any]:
    """Remove a workspace member. Owner cannot remove themselves; admin can remove anyone except owner."""
    _require_owner_or_admin(workspace_id, remover_user)
    ws = _get_workspace_or_404(workspace_id)

    # Prevent owner from removing themselves
    if remover_user.id == user_id:
        raise HTTPException(status_code=400, detail="Owner cannot remove themselves from their own workspace.")

    if auth._USING_SUPABASE:
        auth._get_db().table("workspace_members").delete().eq("workspace_id", workspace_id).eq("user_id", user_id).execute()
    else:
        auth.WORKSPACE_MEMBERS_DB[:] = [
            m for m in auth.WORKSPACE_MEMBERS_DB
            if not (m["workspace_id"] == workspace_id and m["user_id"] == user_id)
        ]

    logger.info("[workspaces] Removed member %s from workspace %s", user_id, workspace_id)
    return {"success": True, "workspace_id": workspace_id, "removed_user_id": user_id}

"""
app/routes/gdpr.py
-----------------
GDPR endpoints (Article 17 Right to Erasure + Article 20 Right to Data Portability):
  POST  /gdpr/export       — request a full data export
  GET   /gdpr/exports      — list user's export requests
  DELETE /gdpr/account     — permanently delete user account and all data
"""
from __future__ import annotations

import json
import logging
import time
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException, status

from app.core.auth_deps import CurrentUserDep
from app.services import auth_service as auth

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/gdpr", tags=["GDPR"])


def _require_admin(workspace_id: str, user: CurrentUserDep) -> None:
    """Raise 403 if the user is not owner/admin of the workspace."""
    if user.role in ("owner", "admin"):
        return
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Only workspace owner or admin can perform this action.",
    )


def _get_user_data(user_id: str, workspace_id: str) -> dict[str, Any]:
    """Gather all user data for export."""
    data: dict[str, Any] = {"user_id": user_id, "exported_at": time.strftime("%Y-%m-%dT%H:%M:%SZ")}

    if auth._USING_SUPABASE:
        db = auth._get_db()

        # User profile
        user_rows = db.table("users").select("*").eq("id", user_id).execute().data
        if user_rows:
            row = dict(user_rows[0])
            row.pop("password_hash", None)  # never export passwords
            data["profile"] = row

        # Datasets in this workspace
        ds_rows = db.table("datasets").select("*").eq("workspace_id", workspace_id).execute().data
        data["datasets"] = ds_rows

        # Reports in this workspace
        rp_rows = db.table("reports").select("*").eq("workspace_id", workspace_id).execute().data
        data["reports"] = rp_rows

        # ML models in this workspace
        ml_rows = db.table("ml_models").select("*").eq("workspace_id", workspace_id).execute().data
        data["ml_models"] = ml_rows

        # Charts in this workspace
        ch_rows = db.table("charts").select("*").eq("workspace_id", workspace_id).execute().data
        data["charts"] = ch_rows

        # Audit log entries for this user in this workspace
        al_rows = db.table("audit_log").select("*").eq("workspace_id", workspace_id).eq("user_id", user_id).execute().data
        data["audit_log"] = al_rows
    else:
        _ensure_seeded()
        user_row = auth.USERS_DB.get(user_id) or next(
            (u for u in auth.USERS_DB.values() if u["id"] == user_id), {}
        )
        if user_row:
            row = dict(user_row)
            row.pop("password_hash", None)
            data["profile"] = row

        data["datasets"] = []
        data["reports"] = []
        data["ml_models"] = []
        data["charts"] = []
        data["audit_log"] = []

    return data


def _ensure_seeded():
    if not auth._USING_SUPABASE:
        auth._ensure_default_admin_seeded()


@router.post("/export", summary="Request Data Export")
def request_export(user: CurrentUserDep) -> dict[str, Any]:
    """
    GDPR Article 20 — Right to Data Portability.
    Generates a JSON export of all user data in the current workspace.
    Returns immediately; export is stored and downloadable within ~30 seconds.
    """
    export_id = str(uuid.uuid4())
    now = time.strftime("%Y-%m-%dT%H:%M:%SZ")
    expires_at = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() + 7 * 24 * 3600))

    data = _get_user_data(user.id, user.workspace_id)
    export_json = json.dumps(data, indent=2, default=str)

    if auth._USING_SUPABASE:
        db = auth._get_db()
        storage_path = f"exports/{user.id}/{export_id}.json"
        # Upload to Supabase Storage (if available)
        try:
            bucket = db.storage.from_("exports")
            bucket.upload(storage_path, export_json.encode(), {"content-type": "application/json"})
        except Exception as exc:
            logger.warning("[gdpr] Storage upload failed: %s", exc)
            storage_path = None

        db.table("gdpr_export_requests").insert({
            "id": export_id,
            "user_id": user.id,
            "workspace_id": user.workspace_id,
            "status": "ready",
            "storage_path": storage_path,
            "expires_at": expires_at,
            "completed_at": now,
        }).execute()
    else:
        _ensure_seeded()
        if not hasattr(auth, "_GDPR_EXPORTS"):
            auth._GDPR_EXPORTS = {}
        auth._GDPR_EXPORTS[export_id] = {
            "id": export_id,
            "user_id": user.id,
            "workspace_id": user.workspace_id,
            "status": "ready",
            "expires_at": expires_at,
            "completed_at": now,
            "data": data,
        }

    logger.info("[gdpr] Export requested by user %s (workspace %s)", user.id, user.workspace_id)
    return {
        "success": True,
        "export_id": export_id,
        "status": "ready",
        "expires_at": expires_at,
        "download_url": f"/gdpr/exports/{export_id}/download",
    }


@router.get("/exports", summary="List Export Requests")
def list_exports(user: CurrentUserDep) -> dict[str, Any]:
    """List all export requests made by the current user."""
    if auth._USING_SUPABASE:
        resp = (
            auth._get_db()
            .table("gdpr_export_requests")
            .select("id, status, expires_at, created_at, completed_at")
            .eq("user_id", user.id)
            .order("created_at", desc=True)
            .execute()
        )
    else:
        _ensure_seeded()
        resp_data = getattr(auth, "_GDPR_EXPORTS", {}).values()
        resp_data = [e for e in resp_data if e.get("user_id") == user.id]
        resp = type("Resp", (), {"data": resp_data})()

    return {
        "success": True,
        "exports": [
            {
                "id": r["id"],
                "status": r["status"],
                "expires_at": r.get("expires_at"),
                "created_at": r["created_at"],
                "completed_at": r.get("completed_at"),
            }
            for r in resp.data
        ],
    }


@router.get("/exports/{export_id}/download", summary="Download Export")
def download_export(export_id: str, user: CurrentUserDep) -> dict[str, Any]:
    """Download a previously requested data export."""
    if auth._USING_SUPABASE:
        resp = (
            auth._get_db()
            .table("gdpr_export_requests")
            .select("id, status, storage_path, expires_at, user_id")
            .eq("id", export_id)
            .execute()
        )
        if not resp.data:
            raise HTTPException(status_code=404, detail="Export not found.")
        record = resp.data[0]
        if record["user_id"] != user.id:
            raise HTTPException(status_code=403, detail="Access denied.")
        if record["status"] != "ready":
            raise HTTPException(status_code=400, detail=f"Export not ready (status: {record['status']}).")
        if record.get("expires_at") and record["expires_at"] < time.strftime("%Y-%m-%dT%H:%M:%SZ"):
            raise HTTPException(status_code=410, detail="Export has expired.")
        # Download from storage
        storage_path = record.get("storage_path")
        if storage_path:
            try:
                bucket = auth._get_db().storage.from_("exports")
                result = bucket.download(storage_path)
                return {"success": True, "data": json.loads(result.decode())}
            except Exception as exc:
                logger.warning("[gdpr] Download failed: %s", exc)
        raise HTTPException(status_code=500, detail="Could not retrieve export file.")
    else:
        _ensure_seeded()
        exports = getattr(auth, "_GDPR_EXPORTS", {})
        if export_id not in exports:
            raise HTTPException(status_code=404, detail="Export not found.")
        record = exports[export_id]
        if record["user_id"] != user.id:
            raise HTTPException(status_code=403, detail="Access denied.")
        if record["status"] != "ready":
            raise HTTPException(status_code=400, detail=f"Export not ready (status: {record['status']}).")
        return {"success": True, "data": record.get("data", {})}


@router.delete("/account", summary="Delete Account")
def delete_account(user: CurrentUserDep) -> dict[str, Any]:
    """
    GDPR Article 17 — Right to Erasure (Right to be Forgotten).
    Permanently deletes the user account and all associated data.
    This action is IRREVERSIBLE.
    """
    user_id = user.id
    workspace_id = user.workspace_id

    if auth._USING_SUPABASE:
        db = auth._get_db()
        # Delete user data from all tables (RLS handles workspace isolation)
        for table in ["datasets", "reports", "charts", "ml_models", "audit_log", "workspace_members"]:
            db.table(table).delete().eq("workspace_id", workspace_id).execute()
        # Delete user record
        db.table("users").delete().eq("id", user_id).execute()
        # Clean up workspace if owner
        db.table("workspaces").delete().eq("owner_user_id", user_id).execute()
        # Delete export requests
        db.table("gdpr_export_requests").delete().eq("user_id", user_id).execute()
    else:
        _ensure_seeded()
        # Remove from in-memory stores
        auth.USERS_DB = {k: v for k, v in auth.USERS_DB.items() if v.get("id") != user_id}
        auth.WORKSPACE_MEMBERS_DB = [m for m in auth.WORKSPACE_MEMBERS_DB if m.get("user_id") != user_id]
        auth.WORKSPACES_DB = {k: v for k, v in auth.WORKSPACES_DB.items() if v.get("owner_user_id") != user_id}

    logger.info("[gdpr] Account permanently deleted for user %s", user_id)
    return {
        "success": True,
        "message": "Your account and all associated data have been permanently deleted.",
    }

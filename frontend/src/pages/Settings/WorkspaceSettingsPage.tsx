import { useState, useEffect } from "react";
import {
  Settings,
  Building2,
  Users,
  CreditCard,
  Plus,
  Crown,
  Shield,
  Eye,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  listMembers,
  renameWorkspace,
  inviteMember,
  createWorkspace,
  type MemberInfo,
  updateMemberRole,
  removeMember,
} from "../../api/workspaces";
import { openPortal } from "../../api/billing";
import { useAuthStore } from "../../store/authStore";

export default function WorkspaceSettingsPage() {
  const { user, activeWorkspace } = useAuthStore();
  const wsId = activeWorkspace?.id;

  const [tab, setTab] = useState<"general" | "members" | "billing">("general");
  const [workspaceName, setWorkspaceName] = useState(activeWorkspace?.name ?? "");
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [newWsName, setNewWsName] = useState("");
  const [creatingWs, setCreatingWs] = useState(false);

  useEffect(() => {
    if (wsId) setWorkspaceName(activeWorkspace?.name ?? "");
  }, [activeWorkspace?.name, wsId]);

  useEffect(() => {
    if (tab === "members" && wsId) {
      setMembersLoading(true);
      listMembers(wsId)
        .then(setMembers)
        .catch(() => toast.error("Failed to load members"))
        .finally(() => setMembersLoading(false));
    }
  }, [tab, wsId]);

  const handleRename = async () => {
    if (!wsId || !workspaceName.trim()) return;
    setSaving(true);
    try {
      await renameWorkspace(wsId, workspaceName.trim());
      toast.success("Workspace renamed");
    } catch {
      toast.error("Failed to rename workspace");
    } finally {
      setSaving(false);
    }
  };

  const handleInvite = async () => {
    if (!wsId || !inviteEmail.trim()) return;
    setInviting(true);
    try {
      await inviteMember(wsId, inviteEmail.trim());
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
    } catch (err) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        || "Failed to send invitation";
      toast.error(msg);
    } finally {
      setInviting(false);
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const url = await openPortal();
      window.location.href = url;
    } catch (err) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        || "Failed to open billing portal";
      toast.error(msg);
    } finally {
      setPortalLoading(false);
    }
  };

  const handleCreateWorkspace = async () => {
    if (!newWsName.trim()) return;
    setCreatingWs(true);
    try {
      const ws = await createWorkspace(newWsName.trim());
      toast.success(`Workspace "${ws.name}" created`);
      setNewWsName("");
      // Switch to it
      const { setActiveWorkspace, setAuth } = useAuthStore.getState();
      const updatedWorkspaces = [...useAuthStore.getState().workspaces, ws];
      if (user) setAuth(user, useAuthStore.getState().token || "", updatedWorkspaces);
      setActiveWorkspace(ws);
    } catch {
      toast.error("Failed to create workspace");
    } finally {
      setCreatingWs(false);
    }
  };

  const roleIcon = (role: string) => {
    if (role === "owner") return <Crown size={14} className="text-amber-500" />;
    if (role === "admin") return <Shield size={14} className="text-indigo-500" />;
    return <Eye size={14} className="text-slate-400" />;
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!wsId) return;
    try {
      await updateMemberRole(wsId, userId, newRole as "owner" | "admin" | "member" | "viewer");
      toast.success(`Role updated to ${newRole}`);
    } catch (err) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
        || "Failed to update role";
      toast.error(msg);
    }
  };

  const handleRemoveMember = (userId: string, name: string) => {
    if (!wsId) return;
    if (confirm(`Remove member ${name} from this workspace?`)) {
      removeMember(wsId, userId);
      toast.success(`Member ${name} removed`);
      // Refresh members list
      if (tab === "members" && wsId) {
        setMembersLoading(true);
        listMembers(wsId)
          .then(setMembers)
          .catch(() => toast.error("Failed to refresh members"))
          .finally(() => setMembersLoading(false));
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950">
          <Settings size={22} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Workspace Settings
          </h1>
          <p className="text-sm text-slate-500">
            Manage <strong>{activeWorkspace?.name}</strong> settings and members.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {(["general", "members", "billing"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-bold border-b-2 -mb-px transition ${
              tab === t
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {t === "general" && <Building2 size={14} className="inline mr-1.5" />}
            {t === "members" && <Users size={14} className="inline mr-1.5" />}
            {t === "billing" && <CreditCard size={14} className="inline mr-1.5" />}
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── General ── */}
      {tab === "general" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Workspace Name
            </h2>
            <div className="flex gap-3">
              <input
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleRename}
                disabled={saving || !workspaceName.trim() || workspaceName === activeWorkspace?.name}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-4 py-2 text-sm transition"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Create New Workspace
            </h2>
            <p className="text-xs text-slate-500">
              Create separate workspaces for different clients or projects. Each workspace has its own datasets and billing.
            </p>
            <div className="flex gap-3">
              <input
                value={newWsName}
                onChange={(e) => setNewWsName(e.target.value)}
                placeholder="e.g. Client Acme Corp"
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleCreateWorkspace}
                disabled={creatingWs || !newWsName.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold px-4 py-2 text-sm transition"
              >
                <Plus size={15} />
                {creatingWs ? "Creating…" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Members ── */}
      {tab === "members" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Users size={16} /> Team Members
            </h2>
            {membersLoading ? (
              <Loader2 className="animate-spin text-indigo-600" />
            ) : (
              <div className="space-y-2">
                {members.map((m) => (
                  <div
                    key={m.user_id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                        {m.name ? m.name.substring(0, 2).toUpperCase() : m.email.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {m.name || m.email}
                        </p>
                        <p className="text-xs text-slate-500">{m.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      {roleIcon(m.role)}
                      {m.role.charAt(0).toUpperCase() + m.role.slice(1)}
                    </div>
                    {/* Role editing controls - visible to owner/admin only */}
                    {user && (user.role === "owner" || user.role === "admin") && (
                      <div className="flex items-center gap-2">
                        <select
                          value={m.role}
                          onChange={(e) => handleRoleChange(m.user_id, e.target.value as "owner" | "admin" | "member" | "viewer")}
                          className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-sm rounded"
                        >
                          <option value="owner">Owner</option>
                          <option value="admin">Admin</option>
                          <option value="member">Member</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      </div>
                    )}
                    {/* Remove member button - visible to owner/admin only */}
                    {user && (user.role === "owner" || user.role === "admin") && (
                      <button
                        onClick={() => handleRemoveMember(m.user_id, m.name || m.email)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        title="Remove member"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Invite a Team Member
            </h2>
            <p className="text-xs text-slate-500">
              Send an invite email — they'll create an account and join this workspace.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleInvite}
                disabled={inviting || !inviteEmail.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-4 py-2 text-sm transition"
              >
                {inviting ? "Sending…" : "Send Invite"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Billing ── */}
      {tab === "billing" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CreditCard size={16} /> Current Plan
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <span className="rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs px-3 py-1 uppercase">
                {activeWorkspace?.plan || "free"}
              </span>
              <button
                onClick={handleManageBilling}
                disabled={portalLoading}
                className="rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 disabled:opacity-50 text-white font-bold px-4 py-2 text-sm transition"
              >
                {portalLoading ? <Loader2 size={14} className="animate-spin inline" /> : null}
                {portalLoading ? "Loading…" : "Manage Billing"}
              </button>
            </div>
            {activeWorkspace?.plan === "free" && (
              <p className="mt-3 text-xs text-slate-500">
                Upgrade to unlock AutoML, larger uploads, and team features.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
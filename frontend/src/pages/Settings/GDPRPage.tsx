import { useEffect, useState } from "react";
import { Shield, Download, Trash2, Loader2, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { requestDataExport, listExports, deleteAccount, type ExportRequest } from "../../api/phase2";
import { useAuthStore } from "../../store/authStore";

function statusBadge(status: string) {
  if (status === "ready") return <CheckCircle size={14} className="text-emerald-500" />;
  if (status === "processing") return <Clock size={14} className="text-amber-500" />;
  return <AlertTriangle size={14} className="text-red-500" />;
}

export default function GDPRPage() {
  const { user, activeWorkspace } = useAuthStore();
  const [exports, setExports] = useState<ExportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    listExports()
      .then(setExports)
      .catch(() => toast.error("Failed to load exports"))
      .finally(() => setLoading(false));
  }, [activeWorkspace?.id]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const result = await requestDataExport();
      toast.success("Data export ready! Download will be available in a moment.");
      setExports((prev) => [
        {
          id: result.export_id,
          status: result.status,
          expires_at: result.expires_at,
          created_at: new Date().toISOString(),
          completed_at: result.status === "ready" ? new Date().toISOString() : null,
        },
        ...prev,
      ]);
    } catch (err) {
      toast.error("Failed to start export");
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      `This will PERMANENTLY delete your account and ALL associated data. This action CANNOT be undone.\n\n` +
        `Type "DELETE" to confirm:\n\n` +
        `(Click Cancel to abort)`
    );
    if (!confirmed) return;

    const typed = window.prompt('Type "DELETE" to confirm account deletion:');
    if (typed !== "DELETE") {
      toast.info("Account deletion cancelled.");
      return;
    }

    setDeleting(true);
    try {
      await deleteAccount();
      toast.success("Account deleted. You will be redirected shortly.");
      setTimeout(() => {
        localStorage.removeItem("ai_analyst_jwt_token");
        window.location.href = "/";
      }, 2000);
    } catch {
      toast.error("Failed to delete account. Please try again or contact support.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950">
          <Shield size={22} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Privacy & Data
          </h1>
          <p className="text-sm text-slate-500">
            GDPR-compliant tools for <strong>{activeWorkspace?.name}</strong>
          </p>
        </div>
      </div>

      {/* ── Data Export ── */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Download size={16} /> Data Export (GDPR Article 20)
        </h2>
        <p className="text-xs text-slate-500">
          Download a complete copy of all your data in JSON format, including your profile,
          datasets, reports, ML models, and audit history.
        </p>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-4 py-2 text-sm transition"
        >
          {exporting ? <Loader2 size={14} className="animate-spin inline mr-1.5" /> : null}
          {exporting ? "Generating export…" : "Request Data Export"}
        </button>

        {loading ? (
          <Loader2 className="animate-spin text-slate-400 mx-auto block" />
        ) : exports.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase">Past Exports</h3>
            {exports.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 px-4 py-2.5"
              >
                <div className="flex items-center gap-2">
                  {statusBadge(e.status)}
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    Export {e.id.slice(0, 8)}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(e.created_at).toLocaleDateString()}
                  </span>
                </div>
                {e.status === "ready" && (
                  <a
                    href={`/gdpr/exports/${e.id}/download`}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    Download
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* ── Account Deletion ── */}
      <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 p-6 space-y-4">
        <h2 className="text-sm font-extrabold text-red-600 dark:text-red-400 flex items-center gap-2">
          <Trash2 size={16} /> Delete Account (GDPR Article 17)
        </h2>
        <p className="text-xs text-slate-500">
          Permanently delete your account and all associated data. This removes your profile,
          all datasets, reports, ML models, and audit history. This action is{" "}
          <strong>irreversible</strong>.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="rounded-xl border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 font-bold px-4 py-2 text-sm transition"
        >
          {deleting ? <Loader2 size={14} className="animate-spin inline mr-1.5" /> : null}
          {deleting ? "Deleting…" : "Delete My Account"}
        </button>
      </div>
    </div>
  );
}

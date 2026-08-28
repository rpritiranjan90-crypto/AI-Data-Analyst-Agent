import { useState, useEffect } from "react";
import { ShieldCheck, Cpu, Search, RefreshCw, Upload, Wand2, BarChart2, BrainCircuit, FileText } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { getAdminStats, getAuditLogs, type AdminStats, type AuditLogEntry } from "../../services/adminService";

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function AdminPortalPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function fetchAll() {
    try {
      const [statsData, logsData] = await Promise.all([
        getAdminStats(),
        getAuditLogs(50),
      ]);
      setStats(statsData);
      setAuditLogs(logsData.entries);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to load admin data");
    }
  }

  useEffect(() => {
    fetchAll().finally(() => setLoading(false));
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchAll();
    setRefreshing(false);
  }

  const filteredLogs = auditLogs.filter((log) => {
    const q = search.toLowerCase();
    return (
      !q ||
      log.user.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.target.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader
          breadcrumb="Platform / Administration"
          title="Enterprise Security & Admin Portal"
          subtitle="Monitor platform statistics, API utilization, active security logs, and usage metrics."
        />
        <div className="flex items-center justify-center py-24">
          <Spinner size={36} label="Loading admin portal..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <PageHeader
          breadcrumb="Platform / Administration"
          title="Enterprise Security & Admin Portal"
          subtitle="Monitor platform statistics, API utilization, active security logs, and usage metrics."
        />
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 p-6 space-y-3">
          <p className="font-bold text-amber-900 dark:text-amber-300 text-sm">Backend Unavailable</p>
          <p className="text-xs text-amber-700 dark:text-amber-400">{error}</p>
          <Button size="sm" variant="outline" onClick={handleRefresh}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const kpis = [
    {
      label: "Total Requests",
      val: stats.total_requests.toLocaleString(),
      change: `Uptime: ${formatUptime(stats.uptime_seconds)}`,
      icon: Cpu,
      color: "indigo",
    },
    {
      label: "Dataset Uploads",
      val: stats.total_uploads.toLocaleString(),
      change: "All-time uploads",
      icon: Upload,
      color: "blue",
    },
    {
      label: "Cleaning Operations",
      val: stats.total_cleaning_ops.toLocaleString(),
      change: "Preprocessing runs",
      icon: Wand2,
      color: "purple",
    },
    {
      label: "Charts Generated",
      val: stats.total_charts_generated.toLocaleString(),
      change: "Visualizations rendered",
      icon: BarChart2,
      color: "emerald",
    },
    {
      label: "ML Model Runs",
      val: stats.total_ml_runs.toLocaleString(),
      change: "Training sessions",
      icon: BrainCircuit,
      color: "amber",
    },
    {
      label: "Reports Generated",
      val: stats.total_reports_generated.toLocaleString(),
      change: "PDF/PPTX exports",
      icon: FileText,
      color: "rose",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="Platform / Administration"
        title="Enterprise Security & Admin Portal"
        subtitle="Monitor platform statistics, API utilization, active security logs, and usage metrics."
      />

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{k.label}</span>
                <div className={`rounded-xl bg-${k.color}-50 dark:bg-${k.color}-950 p-2 text-${k.color}-600 dark:text-${k.color}-400`}>
                  <Icon size={16} />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white">{k.val}</div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">{k.change}</div>
            </div>
          );
        })}
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={20} /> Security & Operations Audit Trail
            </h3>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {auditLogs.length} events logged · Environment: <span className="capitalize font-mono">{stats.environment}</span> v{stats.version}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search audit trail..."
                className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-8 pr-4 text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 w-48"
              />
            </div>
            <Button size="sm" variant="outline" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            </Button>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">No audit events found.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Event Action</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{log.time_ago}</td>
                    <td className="px-4 py-3 font-bold text-xs">{log.user}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{log.action}</td>
                    <td className="px-4 py-3 text-xs">{log.target}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === "Success"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

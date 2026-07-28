import { useState } from "react";
import { ShieldCheck, Users, HardDrive, Cpu, Search, Database } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";

export default function AdminPortalPage() {
  const [search, setSearch] = useState("");

  const stats = [
    { label: "Active Enterprise Users", val: "1,248", change: "+12% this month", icon: Users },
    { label: "AI Requests Today", val: "48,920", change: "Sub-second avg latency", icon: Cpu },
    { label: "Active Workspaces", val: "184", change: "Multi-tenant isolated", icon: Database },
    { label: "Storage Utilization", val: "42.8 GB / 500 GB", change: "8.5% allocated", icon: HardDrive },
  ];

  const auditLogs = [
    { id: "1", user: "analyst@enterprise.com", action: "SQL_QUERY_EXECUTE", target: "sales_q3_table", time: "2 mins ago", status: "Success" },
    { id: "2", user: "admin@enterprise.com", action: "WORKSPACE_MEMBER_ADD", target: "user_jane_doe", time: "14 mins ago", status: "Success" },
    { id: "3", user: "system@security", action: "MAGIC_BYTE_VALIDATION", target: "dataset_upload_check", time: "1 hour ago", status: "Blocked Threat" },
    { id: "4", user: "ds_lead@enterprise.com", action: "AUTOML_MODEL_TRAIN", target: "XGBoost Classifier", time: "2 hours ago", status: "Success" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="Platform / Administration"
        title="Enterprise Security & Admin Portal"
        subtitle="Monitor multi-tenant workspaces, API utilization, active security logs, and AI request metrics."
      />

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{s.label}</span>
                <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-2 text-indigo-600 dark:text-indigo-400">
                  <Icon size={18} />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{s.val}</div>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{s.change}</div>
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
              Real-time immutable log of workspace operations, authentication events, and AI executions.
            </p>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail..."
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-8 pr-4 text-xs font-semibold text-slate-900 dark:text-slate-100 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">User Principal</th>
                <th className="px-4 py-3">Event Action</th>
                <th className="px-4 py-3">Target Object</th>
                <th className="px-4 py-3">Result Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{log.time}</td>
                  <td className="px-4 py-3 font-bold">{log.user}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{log.action}</td>
                  <td className="px-4 py-3">{log.target}</td>
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
      </div>
    </div>
  );
}

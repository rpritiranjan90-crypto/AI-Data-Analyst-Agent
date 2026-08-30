import { useEffect, useState } from "react";
import { Activity, CheckCircle, AlertTriangle, XCircle, RefreshCw, Clock, Database, Mail, CreditCard } from "lucide-react";
import { getSystemStatus, type SystemStatus } from "../../api/phase2";

function statusIcon(status: string) {
  if (status === "operational") return <CheckCircle size={18} className="text-emerald-500" />;
  if (status === "degraded") return <AlertTriangle size={18} className="text-amber-500" />;
  return <XCircle size={18} className="text-red-500" />;
}

function componentIcon(name: string) {
  if (name === "supabase") return <Database size={16} />;
  if (name === "email") return <Mail size={16} />;
  if (name === "billing") return <CreditCard size={16} />;
  return <Activity size={16} />;
}

export default function StatusPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetch = () => {
    setLoading(true);
    setError(false);
    getSystemStatus()
      .then(setStatus)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 60_000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0F1629] flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-100 dark:bg-indigo-950">
              <Activity size={28} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            System Status
          </h1>
          <p className="text-sm text-slate-500">AI Data Analyst Agent</p>
        </div>

        {loading && !status ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 flex items-center justify-center">
            <RefreshCw size={24} className="animate-spin text-indigo-600" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-6 text-center">
            <XCircle size={32} className="text-red-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-red-600">Unable to reach system</p>
            <button onClick={fetch} className="mt-3 text-xs font-bold text-indigo-600 hover:underline">
              Retry
            </button>
          </div>
        ) : status ? (
          <>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {statusIcon(status.status)}
                  <div>
                    <p className="text-base font-extrabold text-slate-900 dark:text-slate-100 capitalize">
                      {status.status}
                    </p>
                    <p className="text-xs text-slate-500">
                      Version {status.version} · {status.environment}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock size={12} />
                  <span>{new Date(status.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                {Object.entries(status.components).map(([name, comp]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 dark:text-slate-400">
                        {componentIcon(name)}
                      </span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 capitalize">
                        {name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {comp.latency_ms != null && (
                        <span className="text-xs text-slate-400 font-mono">{comp.latency_ms}ms</span>
                      )}
                      {statusIcon(comp.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-center">
              <p className="text-xs text-slate-400">
                Uptime: {Math.floor(status.uptime_seconds / 3600)}h{" "}
                {Math.floor((status.uptime_seconds % 3600) / 60)}m
              </p>
              <button
                onClick={fetch}
                className="mt-2 text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 mx-auto"
              >
                <RefreshCw size={11} /> Refresh
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

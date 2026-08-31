import { useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck, Activity, RefreshCw, AlertTriangle, XCircle } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { getReadinessChecks, type ReadinessResponse } from "../../services/readinessService";

export default function ProductionReadinessPage() {
  const [data, setData] = useState<ReadinessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runChecks() {
    setRunning(true);
    setError(null);
    try {
      const result = await getReadinessChecks();
      setData(result);
    } catch (err) {
      const detail = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
      const message = (err as Error).message;
      setError(detail || message || "Readiness check failed");
    } finally {
      setRunning(false);
      setLoading(false);
    }
  }

  // Auto-run on mount so users immediately see the diagnostics result.
  useEffect(() => {
    runChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-run on mount
  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader
          breadcrumb="Platform / Administration"
          title="Production Operations & Deployment Readiness Checklist"
          subtitle="Automated verification scorecard for enterprise compliance, security controls, database health, and AI readiness."
        />
        <div className="flex items-center justify-center py-24">
          <Spinner size={36} label="Initializing diagnostics..." />
        </div>
      </div>
    );
  }

  const pct = data ? Math.round((data.total_score / data.max_score) * 100) : 0;

  const gradeColors: Record<string, string> = {
    "A+": "from-emerald-600 to-teal-600",
    A: "from-emerald-500 to-green-600",
    "B+": "from-blue-600 to-indigo-600",
    B: "from-blue-500 to-indigo-500",
    C: "from-amber-500 to-orange-500",
    D: "from-red-500 to-rose-600",
  };
  const gradeColor = gradeColors[data?.grade ?? "C"] || "from-slate-500 to-slate-600";

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="Platform / Administration"
        title="Production Operations & Deployment Readiness Checklist"
        subtitle="Automated verification scorecard for enterprise compliance, security controls, database health, and AI readiness."
      />

      {/* Scorecard Summary Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-5">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradeColor} text-white font-black text-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
            {data?.grade ?? "?"}
          </div>
          <div>
            {data ? (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 mb-1">
                  <CheckCircle2 size={14} /> Grade {data.grade}
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                  {pct >= 80 ? "Platform Ready for Deployment" : pct >= 60 ? "Platform Mostly Ready" : "Action Required Before Deployment"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {data.total_score}/{data.max_score} points across {data.checks.length} automated checks
                </p>
              </>
            ) : error ? (
              <>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 mb-1">
                  <XCircle size={14} /> Check Failed
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Readiness Check Error</h3>
                <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{error}</p>
              </>
            ) : null}
          </div>
        </div>

        <Button
          onClick={runChecks}
          disabled={running}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md"
        >
          {running ? <RefreshCw size={16} className="animate-spin mr-2" /> : <Activity size={16} className="mr-2" />}
          {running ? "Running Diagnostics..." : "Run Diagnostics"}
        </Button>
      </div>

      {/* Environment Info */}
      {data && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-4">
          <div className="flex flex-wrap gap-4 text-xs">
            {Object.entries(data.environment).map(([key, val]) => (
              <span key={key} className="flex items-center gap-1.5">
                <span className="font-bold text-slate-500 dark:text-slate-400 capitalize">{key}:</span>
                <span className="font-mono text-slate-700 dark:text-slate-200">{val}</span>
              </span>
            ))}
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 dark:text-slate-400">Checked:</span>
              <span className="text-slate-600 dark:text-slate-300">{new Date(data.checked_at).toLocaleString()}</span>
            </span>
          </div>
        </div>
      )}

      {/* Checks by Category */}
      {data && (
        <div className="space-y-6">
          {(["Security", "Architecture", "Database", "AI Engine", "Operations"] as const).map((category) => {
            const categoryChecks = data.checks.filter((c) => c.category === category);
            if (categoryChecks.length === 0) return null;
            return (
              <div key={category} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-xs">
                <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck size={16} className="text-indigo-600 dark:text-indigo-400" /> {category}
                </h4>
                <div className="space-y-2">
                  {categoryChecks.map((check) => (
                    <div key={check.name} className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <div className="mt-0.5 shrink-0">
                        {check.passed ? (
                          <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <AlertTriangle size={16} className="text-amber-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{check.name}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            check.passed
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                              : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                          }`}>
                            {check.passed ? "PASSED" : "WARNING"}
                          </span>
                          <span className="ml-auto font-mono text-[11px] text-indigo-600 dark:text-indigo-400">+{check.score} pts</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{check.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!data && !error && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Activity size={48} className="text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-500">Click "Run Diagnostics" to start the readiness check.</p>
          <Button variant="primary" onClick={runChecks}>
            <Activity size={16} className="mr-2" /> Run Diagnostics
          </Button>
        </div>
      )}
    </div>
  );
}

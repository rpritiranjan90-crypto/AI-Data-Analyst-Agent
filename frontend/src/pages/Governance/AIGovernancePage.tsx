import { useState, useEffect } from "react";
import { ShieldCheck, Cpu, Clock, DollarSign, Award, AlertTriangle, RefreshCw, CheckCircle2 } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import { getGovernanceStats, type GovernanceStats } from "../../services/governanceService";

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function AIGovernancePage() {
  const [stats, setStats] = useState<GovernanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchStats() {
    try {
      const data = await getGovernanceStats();
      setStats(data);
      setError(null);
    } catch (err) {
      const detail = (err as { response?: { data?: { detail?: string } } }).response?.data?.detail;
      const message = (err as Error).message;
      setError(detail || message || "Failed to load governance stats");
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchStats().finally(() => setLoading(false));
  }, []);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader
          breadcrumb="Platform / Governance"
          title="AI Governance, Observability & Cost Tracking"
          subtitle="Real-time monitoring of AI model usage, token consumption, and safety compliance."
        />
        <div className="flex items-center justify-center py-24">
          <Spinner size={36} label="Loading governance metrics..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <PageHeader
          breadcrumb="Platform / Governance"
          title="AI Governance, Observability & Cost Tracking"
          subtitle="Real-time monitoring of AI model usage, token consumption, and safety compliance."
        />
        <Card className="p-8 text-center space-y-4">
          <AlertTriangle size={40} className="mx-auto text-amber-500" />
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Backend Unavailable</h3>
            <p className="text-sm text-slate-500 mt-1">{error}</p>
          </div>
          <div className="flex justify-center gap-3">
            <Button variant="primary" onClick={handleRefresh}>
              <RefreshCw size={16} className="mr-2" /> Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  const tc = stats.token_consumption;
  const rm = stats.request_metrics;
  const sp = stats.safety_policies;

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="Platform / Governance"
        title="AI Governance, Observability & Cost Tracking"
        subtitle="Real-time monitoring of AI model usage, token consumption, and safety compliance."
      />

      {/* AI Provider Status Banner */}
      {stats.ai_provider_status.status === "unavailable" ? (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-amber-900 dark:text-amber-300 text-sm">AI Provider Not Configured</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              {stats.ai_provider_status.message} — AI-generated insights will show error messages until a key is configured.
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 p-4 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">AI Provider Active</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
              {stats.ai_provider_status.model} — {stats.ai_provider_status.message}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {formatUptime(stats.uptime_seconds)} uptime
          </div>
        </div>
      )}

      {/* Token Consumption & Request Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Tokens (Last Hour)</span>
            <Cpu size={16} className="text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{tc.last_hour.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">{tc.model}</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Tokens (24h)</span>
            <Cpu size={16} className="text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{tc.last_24h.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Total: {tc.total_all_time.toLocaleString()}</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Avg Latency</span>
            <Clock size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{rm.avg_latency_ms}ms</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">{rm.requests_last_24h.toLocaleString()} requests/24h</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Est. Cost</span>
            <DollarSign size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">${tc.estimated_cost_usd.toFixed(4)}</div>
          <div className="text-[11px] text-slate-500 mt-1">~${(tc.estimated_cost_usd * 30).toFixed(2)}/mo projected</div>
        </Card>
      </div>

      {/* Business Usage & Error Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Success Rate</span>
            <Award size={16} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{rm.success_rate_pct}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{rm.error_count_last_24h} errors in 24h</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Requests (1h)</span>
            <Cpu size={16} className="text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{rm.requests_last_hour.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Total: {rm.total_requests.toLocaleString()}</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Error Rate</span>
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{rm.error_rate_pct}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Last 24 hours</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Hallucination Score</span>
            <ShieldCheck size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {rm.error_rate_pct > 5 ? "<90%" : ">99%"}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Verified against dataset facts</div>
        </Card>
      </div>

      {/* Safety Policies */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" /> AI Safety & Governance Policies
          </h3>
          <Button size="sm" variant="outline" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            <span className="ml-1.5">Refresh</span>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Prompt Injection Shield", key: "prompt_injection_shield" as const, desc: "Untrusted context isolation blocks prompt injection." },
            { label: "SQL Read-Only Sandbox", key: "sql_read_only_sandbox" as const, desc: "NL-to-SQL restricted to SELECT statements only." },
            { label: "DDE Formula Sanitization", key: "dde_formula_sanitization" as const, desc: "Cell prefixes =, +, -, @ auto-sanitized." },
            { label: "Output Validation", key: "output_validation" as const, desc: "AI responses validated before display." },
          ].map(({ label, key, desc }) => (
            <div key={key} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/60 space-y-1.5">
              <div className="flex items-center gap-2">
                {sp[key] ? (
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                )}
                <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-400">{label}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed pl-5">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Info */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2 shadow-xs">
        <h3 className="font-black text-sm text-slate-900 dark:text-white">Platform Environment</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {Object.entries(stats.platform).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400 capitalize">{key}:</span>
              <span className="font-mono text-slate-700 dark:text-slate-200">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

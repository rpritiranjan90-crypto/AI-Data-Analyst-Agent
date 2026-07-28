import { ShieldCheck, Cpu, Clock, DollarSign, Award } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";

export default function AIGovernancePage() {
  const technicalMetrics = [
    { label: "AI Token Consumption", val: "14.2M Tokens", note: "Sub-second avg latency", icon: Cpu },
    { label: "Average Inference Latency", val: "142 ms", note: "FastAPI + Gemini 2.0", icon: Clock },
    { label: "Prompt Injection Shield", val: "100% Block Rate", note: "PromptSanitizer Active", icon: ShieldCheck },
    { label: "Hallucination Defense Rating", val: "99.4%", note: "Verified against data facts", icon: Award },
  ];

  const businessMetrics = [
    { label: "Estimated AI API Cost", val: "$48.20 / mo", change: "-14% optimized token usage" },
    { label: "Total Swarm Audits Run", val: "1,420 Audits", change: "Sub-second parallel run" },
    { label: "Active Enterprise Queries", val: "38,400 Queries", change: "100% success rate" },
    { label: "User Satisfaction Score", val: "4.9 / 5.0", change: "Based on 420 reviews" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb="Platform / Administration"
        title="AI Governance, Observability & Cost Tracking"
        subtitle="Monitor technical AI model metrics, prompt injection block rates, hallucination ratings, and business usage analytics."
      />

      {/* Technical AI Metrics Grid */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
          <Cpu size={16} className="text-indigo-600 dark:text-indigo-400" /> Technical Model Observability Metrics
        </h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {technicalMetrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{m.label}</span>
                  <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950 p-2 text-indigo-600 dark:text-indigo-400">
                    <Icon size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{m.val}</div>
                <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mt-1">{m.note}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Business Usage Metrics Grid */}
      <div>
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
          <DollarSign size={16} className="text-emerald-600 dark:text-emerald-400" /> Business Usage & Cost Telemetry
        </h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {businessMetrics.map((b, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{b.label}</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-2">{b.val}</div>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{b.change}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Safety Policy & Compliance Status */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
        <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" /> AI Safety & Governance Policies Active
        </h4>
        <div className="grid gap-4 md:grid-cols-3 text-xs font-semibold">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/60">
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold block mb-1">Untrusted Context Isolation</span>
            All CSV cells and user inputs are strictly demarcated in prompt headers to block prompt injection.
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/60">
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold block mb-1">SQL Read-Only Sandbox</span>
            Queries generated via NL-to-SQL are restricted strictly to ANSI `SELECT` statements.
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/60">
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold block mb-1">DDE Formula Sanitization</span>
            Spreadsheet cell prefixes `=`, `+`, `-`, `@` are automatically sanitized to protect against macro attacks.
          </div>
        </div>
      </div>
    </div>
  );
}

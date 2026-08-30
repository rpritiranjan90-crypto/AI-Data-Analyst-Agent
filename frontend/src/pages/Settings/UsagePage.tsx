import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Database,
  Sparkles,
  FileText,
  Brain,
  Loader2,
  TrendingUp,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { getUsage, type UsageInfo } from "../../api/phase2";
import { useAuthStore } from "../../store/authStore";

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  current: number;
  limit: number | null;
  pct: number | null;
  unit?: string;
  color: string;
}

function MetricCard({ icon, label, current, limit, pct, color }: MetricCardProps) {
  const isUnlimited = limit === null;
  const isOver = !isUnlimited && pct !== null && pct >= 90;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${color}`}>{icon}</div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{label}</h3>
        </div>
        {isUnlimited ? (
          <span className="text-[10px] font-bold uppercase rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 px-2 py-0.5">
            <Crown size={10} className="inline mr-1" /> Unlimited
          </span>
        ) : (
          <span className="text-[10px] font-bold text-slate-500">
            {current.toLocaleString()} / {limit?.toLocaleString()}
          </span>
        )}
      </div>

      {isUnlimited ? (
        <div className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {current.toLocaleString()}
        </div>
      ) : (
        <>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                isOver
                  ? "bg-gradient-to-r from-red-500 to-orange-500"
                  : "bg-gradient-to-r from-indigo-500 to-cyan-500"
              }`}
              style={{ width: `${Math.min(100, pct ?? 0)}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{pct ?? 0}% used</span>
            {isOver && <span className="text-red-500 font-bold">Near limit</span>}
          </div>
        </>
      )}
    </div>
  );
}

export default function UsagePage() {
  const navigate = useNavigate();
  const { activeWorkspace } = useAuthStore();
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUsage()
      .then(setUsage)
      .catch(() => toast.error("Failed to load usage"))
      .finally(() => setLoading(false));
  }, [activeWorkspace?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (!usage) {
    return <div className="p-6 text-slate-500">No usage data available.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950">
            <TrendingUp size={22} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              Usage & Limits
            </h1>
            <p className="text-sm text-slate-500">
              <strong>{activeWorkspace?.name}</strong> · {activeWorkspace?.plan?.toUpperCase()} plan
            </p>
          </div>
        </div>
        {activeWorkspace?.plan === "free" && (
          <button
            onClick={() => navigate("/pricing")}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-bold px-4 py-2 text-sm transition"
          >
            <Crown size={14} className="inline mr-1.5" />
            Upgrade
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          icon={<Database size={16} className="text-indigo-600" />}
          label="Rows Uploaded"
          current={usage.rows_uploaded}
          limit={usage.limits.rows_uploaded}
          pct={usage.rows_uploaded_pct}
          color="bg-indigo-100 dark:bg-indigo-950"
        />
        <MetricCard
          icon={<Sparkles size={16} className="text-purple-600" />}
          label="AI Calls"
          current={usage.ai_calls}
          limit={usage.limits.ai_calls}
          pct={usage.ai_calls_pct}
          color="bg-purple-100 dark:bg-purple-950"
        />
        <MetricCard
          icon={<FileText size={16} className="text-emerald-600" />}
          label="Reports Generated"
          current={usage.reports_generated}
          limit={usage.limits.reports_generated}
          pct={usage.reports_generated_pct}
          color="bg-emerald-100 dark:bg-emerald-950"
        />
        <MetricCard
          icon={<Brain size={16} className="text-orange-600" />}
          label="ML Models Trained"
          current={usage.ml_models_trained}
          limit={usage.limits.ml_models_trained}
          pct={usage.ml_models_trained_pct}
          color="bg-orange-100 dark:bg-orange-950"
        />
      </div>

      {usage.period_start && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 text-sm text-slate-500">
          <strong className="text-slate-700 dark:text-slate-300">Current period:</strong>{" "}
          started {new Date(usage.period_start).toLocaleDateString()}. Counters reset at the
          start of each billing cycle.
        </div>
      )}
    </div>
  );
}

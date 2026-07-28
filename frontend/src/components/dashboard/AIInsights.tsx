import {
  AlertTriangle,
  Brain,
  Copy,
  Database,
  HardDrive,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import Badge from "../ui/Badge";
import Card from "../ui/Card";
import { useDatasetStore } from "../../store/datasetStore";

export default function AIInsights() {
  const dataset = useDatasetStore((state) => state.dataset);
  const metadata = dataset?.metadata;

  if (!metadata) return null;

  const missingRatio = metadata.missing_values / (metadata.rows * metadata.columns || 1);
  const duplicateRatio = metadata.duplicate_rows / (metadata.rows || 1);

  let health = "Excellent";
  let healthColor = "emerald";

  if (missingRatio > 0.05 || duplicateRatio > 0.05) {
    health = "Needs Cleaning";
    healthColor = "amber";
  }

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 p-3 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
            <Brain size={22} />
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              AI Workspace Profile
            </h3>

            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Intelligent dataset health & structural overview
            </p>
          </div>
        </div>

        <Badge color="green">
          Dataset Ready
        </Badge>
      </div>

      {/* Health Banner */}
      <div className={`rounded-2xl p-5 border flex items-center justify-between ${
        healthColor === "emerald"
          ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200"
          : "bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200"
      }`}>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-wider opacity-80">
            DATASET HEALTH
          </p>

          <h2 className="mt-1 text-2xl font-black">
            {health}
          </h2>
        </div>

        <ShieldCheck
          className={healthColor === "emerald" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}
          size={32}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        <InfoCard
          icon={<Database size={16} />}
          label="Rows"
          value={metadata.rows.toLocaleString()}
        />

        <InfoCard
          icon={<Layers3 size={16} />}
          label="Columns"
          value={metadata.columns}
        />

        <InfoCard
          icon={<AlertTriangle size={16} />}
          label="Missing"
          value={metadata.missing_values}
        />

        <InfoCard
          icon={<Copy size={16} />}
          label="Duplicates"
          value={metadata.duplicate_rows}
        />

        <InfoCard
          icon={<HardDrive size={16} />}
          label="Memory"
          value={`${metadata.memory_usage_mb.toFixed(2)} MB`}
        />
      </div>

      {/* Recommendations */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-5 space-y-2">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400 animate-pulse" /> AI Synthesis Summary
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          {metadata.missing_values > 0 || metadata.duplicate_rows > 0
            ? `Detected ${metadata.missing_values} missing cells and ${metadata.duplicate_rows} duplicate rows. Recommended: Run 1-Click Auto Clean before building ML pipelines.`
            : "Dataset is structurally clean with zero missing values or duplicate rows. Ready for correlation analysis and automated AutoML model building."}
        </p>
      </div>
    </Card>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3 flex flex-col justify-between space-y-1">
      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
        <span className="text-[10px] font-extrabold uppercase tracking-wider">{label}</span>
        <span className="text-indigo-600 dark:text-indigo-400">{icon}</span>
      </div>
      <p className="text-sm font-black text-slate-900 dark:text-white tabular-nums">{value}</p>
    </div>
  );
}
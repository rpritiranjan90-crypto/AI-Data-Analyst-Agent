import {
  Activity,
  Network,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

import type { StrongCorrelation } from "../../types/analysis";

interface CorrelationSummaryProps {
  method?: string;
  totalNumericColumns?: number;
  correlations?: StrongCorrelation[];
}

interface SummaryCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: React.ReactNode;
  subtitle: React.ReactNode;
}

function SummaryCard({
  icon,
  iconBg,
  title,
  value,
  subtitle,
}: SummaryCardProps) {
  return (
    <Card className="p-5 h-full">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            {title}
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {value}
          </h2>

          <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            {subtitle}
          </div>
        </div>

        <div className={`rounded-xl p-3 ${iconBg}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default function CorrelationSummary({
  method = "pearson",
  totalNumericColumns = 0,
  correlations = [],
}: CorrelationSummaryProps) {
  const safeList = Array.isArray(correlations) ? correlations : [];
  const strongest = safeList
    .slice()
    .sort(
      (a, b) =>
        (b?.absolute_correlation ?? 0) -
        (a?.absolute_correlation ?? 0)
    )[0];

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <SummaryCard
        title="Method"
        value={(method || "pearson").toUpperCase()}
        subtitle="Correlation Algorithm"
        icon={<Network size={22} className="text-blue-600 dark:text-blue-400" />}
        iconBg="bg-blue-100 dark:bg-blue-950/60"
      />

      <SummaryCard
        title="Numeric Columns"
        value={totalNumericColumns}
        subtitle="Included in Analysis"
        icon={<Activity size={22} className="text-violet-600 dark:text-violet-400" />}
        iconBg="bg-violet-100 dark:bg-violet-950/60"
      />

      <SummaryCard
        title="Strongest Pair"
        value={
          strongest
            ? `${strongest.column_1} ↔ ${strongest.column_2}`
            : "None"
        }
        subtitle={
          strongest
            ? `${strongest.direction ?? "Positive"} (${(strongest.correlation ?? 0).toFixed(2)})`
            : "No correlation exceeded threshold."
        }
        icon={<TrendingUp size={22} className="text-emerald-600 dark:text-emerald-400" />}
        iconBg="bg-emerald-100 dark:bg-emerald-950/60"
      />

      <SummaryCard
        title="Highest Correlation"
        value={
          strongest
            ? (strongest.absolute_correlation ?? Math.abs(strongest.correlation ?? 0)).toFixed(2)
            : "—"
        }
        subtitle={
          strongest
            ? (strongest.interpretation || "Strong correlation detected")
            : "No measurable relationship"
        }
        icon={<TrendingDown size={22} className="text-amber-600 dark:text-amber-400" />}
        iconBg="bg-amber-100 dark:bg-amber-950/60"
      />
    </div>
  );
}
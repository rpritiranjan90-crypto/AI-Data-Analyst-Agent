import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

import MetricCard from "../../../../components/ui/MetricCard";

import type { DistributionResponse } from "../../types/analysis";

interface DistributionSummaryProps {
  distribution: DistributionResponse;
}

export default function DistributionSummary({
  distribution,
}: DistributionSummaryProps) {
  const columns = Object.entries(distribution || {})
    .filter(([col, val]) => col !== "message" && val && typeof val === "object")
    .map(([, val]) => val);

  const totalColumns = columns.length;

  const normalColumns = columns.filter(
    (item) => item?.normal_distribution
  ).length;

  const skewedColumns = totalColumns - normalColumns;

  const outlierColumns = columns.filter(
    (item) => (item?.outliers?.count ?? 0) > 0
  ).length;

  const distributionQuality =
    totalColumns === 0
      ? 0
      : Math.round((normalColumns / totalColumns) * 100);

  return (
    <div className="space-y-6">
      {/* Executive KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Numeric Columns"
          value={totalColumns}
          subtitle="Analysed Features"
          icon={BarChart3}
          color="blue"
        />

        <MetricCard
          title="Normal Distribution"
          value={normalColumns}
          subtitle="Normally Distributed"
          icon={CheckCircle2}
          color="green"
        />

        <MetricCard
          title="Skewed Columns"
          value={skewedColumns}
          subtitle="Require Attention"
          icon={Activity}
          color="orange"
        />

        <MetricCard
          title="Outlier Columns"
          value={outlierColumns}
          subtitle="Contain Outliers"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Executive Summary */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Distribution Overview
            </h3>

            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-300">
              {normalColumns} of {totalColumns} numeric columns approximately
              follow a normal distribution.
            </p>
          </div>

          <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 px-5 py-3 text-center border border-indigo-100 dark:border-indigo-900/50">
            <p className="text-xs font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
              Distribution Quality
            </p>

            <p className="mt-1 text-2xl font-extrabold text-indigo-700 dark:text-indigo-400">
              {distributionQuality}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
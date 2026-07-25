import {
  Brain,
  Database,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import Card from "../../../../components/ui/Card";
import StatusBadge from "../../../../components/ui/StatusBadge";

interface ExecutiveSummaryCardProps {
  rows: number;
  columns: number;
  qualityLabel: string;
  qualityVariant:
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral";
  missingValues: number;
  duplicateRows: number;
  numericColumns: number;
  categoricalColumns: number;
  qualityInsight: string;
}

export default function ExecutiveSummaryCard({
  rows,
  columns,
  qualityLabel,
  qualityVariant,
  missingValues,
  duplicateRows,
  numericColumns,
  categoricalColumns,
  qualityInsight,
}: ExecutiveSummaryCardProps) {
  const recommendation =
    qualityLabel === "Excellent"
      ? "Dataset is ready for advanced analytics and machine learning."
      : qualityLabel === "Good"
      ? "Minor preprocessing is recommended before model training."
      : qualityLabel === "Fair"
      ? "Perform data cleaning before continuing with analysis."
      : "Significant preprocessing is recommended to improve data quality.";

  return (
    <Card className="space-y-6 p-6 border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md shadow-slate-300/40 dark:shadow-none">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-black text-black dark:text-white">
              Executive Summary
            </h2>
          </div>

          <p className="mt-1.5 text-xs font-semibold text-gray-800 dark:text-slate-300">
            A concise overview of your dataset generated from the current analysis.
          </p>
        </div>

        <StatusBadge
          label={qualityLabel}
          variant={qualityVariant}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="font-extrabold text-black dark:text-white text-xs uppercase tracking-wider">Dataset Size</span>
          </div>

          <p className="mt-2 text-xl font-black text-black dark:text-white">
            {rows.toLocaleString()} × {columns}
          </p>

          <p className="mt-0.5 text-xs font-semibold text-gray-800 dark:text-slate-400">
            Rows × Columns
          </p>
        </div>

        <div className="rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-extrabold text-black dark:text-white text-xs uppercase tracking-wider">Structure</span>
          </div>

          <p className="mt-2 text-xl font-black text-black dark:text-white">
            {numericColumns} Numeric
          </p>

          <p className="mt-0.5 text-xs font-semibold text-gray-800 dark:text-slate-400">
            {categoricalColumns} Categorical
          </p>
        </div>

        <div className="rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span className="font-extrabold text-black dark:text-white text-xs uppercase tracking-wider">Data Quality</span>
          </div>

          <p className="mt-2 text-xl font-black text-black dark:text-white">
            {missingValues} Missing
          </p>

          <p className="mt-0.5 text-xs font-semibold text-gray-800 dark:text-slate-400">
            {duplicateRows} Duplicate Rows
          </p>
        </div>

        <div className="rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            <span className="font-extrabold text-black dark:text-white text-xs uppercase tracking-wider">Recommendation</span>
          </div>

          <p className="mt-2 text-xs font-semibold leading-relaxed text-gray-800 dark:text-slate-300">
            {recommendation}
          </p>
        </div>
      </div>

      {qualityInsight && (
        <div className="rounded-xl border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-slate-800/80 p-4">
          <p className="text-xs font-bold leading-relaxed text-slate-900 dark:text-slate-100">
            {qualityInsight}
          </p>
        </div>
      )}
    </Card>
  );
}
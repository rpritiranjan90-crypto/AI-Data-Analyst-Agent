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
    <Card className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Executive Summary
            </h2>
          </div>

          <p className="mt-2 text-sm text-slate-600">
            A concise overview of your dataset generated from the current
            analysis.
          </p>
        </div>

        <StatusBadge
          label={qualityLabel}
          variant={qualityVariant}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">Dataset Size</span>
          </div>

          <p className="mt-2 text-lg font-bold">
            {rows.toLocaleString()} × {columns}
          </p>

          <p className="text-sm text-slate-500">
            Rows × Columns
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <span className="font-semibold">Structure</span>
          </div>

          <p className="mt-2 text-lg font-bold">
            {numericColumns} Numeric
          </p>

          <p className="text-sm text-slate-500">
            {categoricalColumns} Categorical
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span className="font-semibold">Data Quality</span>
          </div>

          <p className="mt-2 text-lg font-bold">
            {missingValues} Missing
          </p>

          <p className="text-sm text-slate-500">
            {duplicateRows} Duplicate Rows
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-600" />
            <span className="font-semibold">Recommendation</span>
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            {recommendation}
          </p>
        </div>
      </div>

      {qualityInsight && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <p className="text-sm leading-6 text-slate-700">
            {qualityInsight}
          </p>
        </div>
      )}
    </Card>
  );
}
import {
  CheckCircle2,
  AlertTriangle,
  Database,
  Brain,
  ShieldCheck,
} from "lucide-react";

import Card from "../../../../components/ui/Card";
import StatusBadge from "../../../../components/ui/StatusBadge";

interface DatasetHealthCardProps {
  rows: number;
  columns: number;
  missingValues: number;
  duplicateRows: number;
  numericColumns: number;
  categoricalColumns: number;
  qualityLabel: string;
  qualityVariant:
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral";
  qualityInsight: string;
}

export default function DatasetHealthCard({
  rows,
  columns,
  missingValues,
  duplicateRows,
  numericColumns,
  categoricalColumns,
  qualityLabel,
  qualityVariant,
  qualityInsight,
}: DatasetHealthCardProps) {
  const totalCells = Math.max(rows * columns, 1);

  const missingPercent = Number(
    ((missingValues / totalCells) * 100).toFixed(2)
  );

  const duplicatePercent = Number(
    ((duplicateRows / Math.max(rows, 1)) * 100).toFixed(2)
  );

  let score = 100;

  score -= Math.min(missingPercent * 2, 35);
  score -= Math.min(duplicatePercent * 2, 25);

  if (numericColumns === 0) score -= 15;

  if (categoricalColumns === 0) score -= 5;

  score = Math.max(0, Math.min(100, Math.round(score)));

  const scoreColor =
    score >= 90
      ? "text-emerald-600"
      : score >= 75
      ? "text-sky-600"
      : score >= 50
      ? "text-amber-600"
      : "text-red-600";

  const progressColor =
    score >= 90
      ? "bg-emerald-500"
      : score >= 75
      ? "bg-sky-500"
      : score >= 50
      ? "bg-amber-500"
      : "bg-red-500";

  const mlReady =
    score >= 80 &&
    missingPercent < 5 &&
    duplicatePercent < 5 &&
    numericColumns > 0;

  return (
    <Card>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-6">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-8 border-slate-100 bg-slate-50">
            <span className={`text-3xl font-bold ${scoreColor}`}>
              {score}%
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Dataset Health
            </h2>

            <div className="mt-2">
              <StatusBadge
                label={qualityLabel}
                variant={qualityVariant}
              />
            </div>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
              {qualityInsight ||
                "Overall dataset quality has been calculated from completeness, duplicate records, and data balance."}
            </p>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-2 flex justify-between text-sm font-medium text-slate-600">
            <span>Health Score</span>
            <span>{score}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full ${progressColor} transition-all duration-500`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <span className="font-semibold">Missing Data</span>
          </div>

          <p className="text-2xl font-bold">{missingPercent}%</p>

          <p className="mt-1 text-sm text-slate-500">
            {missingValues.toLocaleString()} missing values
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Database className="h-5 w-5 text-red-500" />
            <span className="font-semibold">Duplicates</span>
          </div>

          <p className="text-2xl font-bold">{duplicatePercent}%</p>

          <p className="mt-1 text-sm text-slate-500">
            {duplicateRows.toLocaleString()} duplicate rows
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-500" />
            <span className="font-semibold">ML Readiness</span>
          </div>

          <p
            className={`text-2xl font-bold ${
              mlReady ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {mlReady ? "Ready" : "Needs Cleaning"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Suitable for model training
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <span className="font-semibold">Recommendation</span>
          </div>

          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />

            <span className="font-semibold">
              {score >= 90
                ? "Excellent"
                : score >= 75
                ? "Good"
                : score >= 50
                ? "Fair"
                : "Needs Improvement"}
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            {mlReady
              ? "Dataset is ready for advanced analytics and machine learning."
              : "Improve data quality before training predictive models."}
          </p>
        </div>
      </div>
    </Card>
  );
}
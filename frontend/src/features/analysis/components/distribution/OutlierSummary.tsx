import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

import Card from "../../../../components/ui/Card";
import StatusBadge from "../../../../components/ui/StatusBadge";

import type { DistributionResponse } from "../../types/analysis";

interface OutlierSummaryProps {
  distribution: DistributionResponse;
}

export default function OutlierSummary({
  distribution,
}: OutlierSummaryProps) {
  const outlierColumns = Object.entries(distribution || {})
    .filter(([col, stats]) => col !== "message" && stats && stats.outliers && (stats.outliers.count ?? 0) > 0)
    .sort(
      (a, b) =>
        (b[1].outliers?.count ?? 0) - (a[1].outliers?.count ?? 0)
    );

  if (!outlierColumns.length) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-green-100 dark:bg-green-950/60 p-4">
            <AlertTriangle
              size={34}
              className="text-green-600 dark:text-green-400"
            />
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            No Outliers Detected
          </h3>

          <p className="mt-3 max-w-xl text-slate-500 dark:text-slate-400 font-medium">
            None of the analysed numeric columns contain
            statistical outliers based on the IQR method.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Outlier Summary
          </h3>

          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-300">
            Columns containing statistical outliers.
          </p>
        </div>

        <StatusBadge
          label={`${outlierColumns.length} Columns`}
          variant="warning"
        />
      </div>

      <div className="space-y-4">
        {outlierColumns.map(([column, stats]) => (
          <div
            key={column}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {column}
                </h4>

                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stats.outliers?.count ?? 0} outlier(s) detected
                </p>
              </div>

              <StatusBadge
                label={
                  (stats.outliers?.count ?? 0) > 20
                    ? "High"
                    : (stats.outliers?.count ?? 0) > 5
                    ? "Moderate"
                    : "Low"
                }
                variant={
                  (stats.outliers?.count ?? 0) > 20
                    ? "danger"
                    : "warning"
                }
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200/60 dark:border-slate-700/60">
                <div className="mb-2 flex items-center gap-2 text-red-600 dark:text-red-400">
                  <ArrowDown size={18} />
                  <span className="font-bold">
                    Lower Bound
                  </span>
                </div>

                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                  {(stats.outliers?.lower_bound ?? 0).toFixed(2)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200/60 dark:border-slate-700/60">
                <div className="mb-2 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <ArrowUp size={18} />
                  <span className="font-bold">
                    Upper Bound
                  </span>
                </div>

                <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                  {(stats.outliers?.upper_bound ?? 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
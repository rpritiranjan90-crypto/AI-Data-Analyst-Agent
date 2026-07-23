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
  const outlierColumns = Object.entries(distribution)
    .filter(([, stats]) => stats.outliers.count > 0)
    .sort(
      (a, b) =>
        b[1].outliers.count - a[1].outliers.count
    );

  if (!outlierColumns.length) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-green-100 p-4">
            <AlertTriangle
              size={34}
              className="text-green-600"
            />
          </div>

          <h3 className="text-xl font-bold text-slate-900">
            No Outliers Detected
          </h3>

          <p className="mt-3 max-w-xl text-slate-500">
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
          <h3 className="text-xl font-bold text-slate-900">
            Outlier Summary
          </h3>

          <p className="mt-1 text-sm text-slate-500">
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
            className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-slate-900">
                  {column}
                </h4>

                <p className="mt-1 text-sm text-slate-500">
                  {stats.outliers.count} outlier(s) detected
                </p>
              </div>

              <StatusBadge
                label={
                  stats.outliers.count > 20
                    ? "High"
                    : stats.outliers.count > 5
                    ? "Moderate"
                    : "Low"
                }
                variant={
                  stats.outliers.count > 20
                    ? "danger"
                    : "warning"
                }
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-red-600">
                  <ArrowDown size={18} />
                  <span className="font-medium">
                    Lower Bound
                  </span>
                </div>

                <p className="text-2xl font-bold">
                  {stats.outliers.lower_bound.toFixed(2)}
                </p>
              </div>

              <div className="rounded-lg bg-white p-4">
                <div className="mb-2 flex items-center gap-2 text-green-600">
                  <ArrowUp size={18} />
                  <span className="font-medium">
                    Upper Bound
                  </span>
                </div>

                <p className="text-2xl font-bold">
                  {stats.outliers.upper_bound.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
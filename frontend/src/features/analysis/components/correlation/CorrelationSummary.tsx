import {
  Activity,
  Network,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

import type { StrongCorrelation } from "../../types/analysis";

interface CorrelationSummaryProps {
  method: string;
  totalNumericColumns: number;
  correlations: StrongCorrelation[];
}

export default function CorrelationSummary({
  method,
  totalNumericColumns,
  correlations,
}: CorrelationSummaryProps) {
  const strongest = correlations
    .slice()
    .sort(
      (a, b) =>
        b.absolute_correlation -
        a.absolute_correlation
    )[0];

  return (
    <Card>
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Method */}

        <div>
          <div className="flex items-center gap-2 text-blue-600">
            <Network size={18} />

            <span className="text-sm font-semibold">
              Method
            </span>
          </div>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {method.toUpperCase()}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Correlation Algorithm
          </p>
        </div>

        {/* Numeric Columns */}

        <div>
          <div className="flex items-center gap-2 text-violet-600">
            <Activity size={18} />

            <span className="text-sm font-semibold">
              Numeric Columns
            </span>
          </div>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {totalNumericColumns}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Included in Analysis
          </p>
        </div>

        {/* Strongest Relationship */}

        <div>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp size={18} />

            <span className="text-sm font-semibold">
              Strongest Relationship
            </span>
          </div>

          {strongest ? (
            <>
              <h2 className="mt-3 text-lg font-bold text-slate-900">
                {strongest.column_1} ↔ {strongest.column_2}
              </h2>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {strongest.correlation.toFixed(2)}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {strongest.direction}
              </p>
            </>
          ) : (
            <>
              <h2 className="mt-3 text-lg font-bold text-slate-900">
                No Strong Relationship
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                No correlation exceeded the configured threshold.
              </p>
            </>
          )}
        </div>

        {/* Highest Correlation */}

        <div>
          <div className="flex items-center gap-2 text-orange-600">
            <TrendingDown size={18} />

            <span className="text-sm font-semibold">
              Highest Correlation
            </span>
          </div>

          {strongest ? (
            <>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {strongest.absolute_correlation.toFixed(2)}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {strongest.column_1} ↔ {strongest.column_2}
              </p>

              <p className="mt-2 font-medium text-emerald-600">
                {strongest.interpretation}
              </p>
            </>
          ) : (
            <>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                —
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                No measurable relationship
              </p>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
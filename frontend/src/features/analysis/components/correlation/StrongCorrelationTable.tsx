import {
  ArrowDownRight,
  ArrowUpRight,
  Network,
  TrendingUp,
} from "lucide-react";

import Badge from "../../../../components/ui/Badge";
import Card from "../../../../components/ui/Card";
import StatusBadge from "../../../../components/ui/StatusBadge";

import type { StrongCorrelation } from "../../types/analysis";

interface StrongCorrelationTableProps {
  correlations: StrongCorrelation[];
}

function getStrength(value: number) {
  const abs = Math.abs(value);

  if (abs >= 0.9) return "Very Strong";
  if (abs >= 0.7) return "Strong";
  if (abs >= 0.5) return "Moderate";

  return "Weak";
}

export default function StrongCorrelationTable({
  correlations,
}: StrongCorrelationTableProps) {
  if (!correlations.length) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-5 rounded-full bg-slate-100 p-5">
            <Network
              size={36}
              className="text-slate-500"
            />
          </div>

          <h3 className="text-2xl font-bold text-slate-900">
            No Strong Correlations Found
          </h3>

          <p className="mt-3 max-w-2xl text-slate-500">
            No relationships exceeded the configured
            correlation threshold for this dataset.
          </p>

          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-sm leading-6 text-slate-700">
              Upload a dataset with additional numeric
              variables or more observations to uncover
              stronger statistical relationships.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Strong Correlations
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Significant relationships detected between numeric variables.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="info">
            {correlations.length} Relationships
          </Badge>

          <div className="rounded-2xl bg-indigo-50 p-3">
            <TrendingUp
              className="text-indigo-600"
              size={20}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-4 text-left text-sm font-semibold">
                Variable A
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Variable B
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold">
                Correlation
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold">
                Strength
              </th>

              <th className="px-5 py-4 text-center text-sm font-semibold">
                Direction
              </th>

              <th className="px-5 py-4 text-left text-sm font-semibold">
                Interpretation
              </th>
            </tr>
          </thead>

          <tbody>
            {correlations.map((item, index) => {
              const positive = item.correlation >= 0;

              return (
                <tr
                  key={`${item.column_1}-${item.column_2}-${index}`}
                  className="border-t transition-colors hover:bg-slate-50"
                >
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {item.column_1}
                  </td>

                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {item.column_2}
                  </td>

                  <td
                    className={`px-5 py-4 text-center text-lg font-bold ${
                      positive
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {item.correlation.toFixed(2)}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <Badge variant="default">
                      {getStrength(item.correlation)}
                    </Badge>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {positive ? (
                        <ArrowUpRight
                          className="text-emerald-600"
                          size={18}
                        />
                      ) : (
                        <ArrowDownRight
                          className="text-red-600"
                          size={18}
                        />
                      )}

                      <StatusBadge
                        label={item.direction}
                        variant={
                          positive
                            ? "success"
                            : "danger"
                        }
                      />
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {item.interpretation}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
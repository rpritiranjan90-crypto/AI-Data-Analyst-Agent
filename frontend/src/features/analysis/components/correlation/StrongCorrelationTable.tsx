import {
  ArrowDownRight,
  ArrowUpRight,
  Network,
} from "lucide-react";

import Card from "../../../../components/ui/Card";
import StatusBadge from "../../../../components/ui/StatusBadge";

import type { StrongCorrelation } from "../../types/analysis";

interface StrongCorrelationTableProps {
  correlations: StrongCorrelation[];
}

export default function StrongCorrelationTable({
  correlations,
}: StrongCorrelationTableProps) {
  if (!correlations.length) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-4">
            <Network
              size={34}
              className="text-slate-500"
            />
          </div>

          <h3 className="text-xl font-bold text-slate-900">
            No Strong Correlations Found
          </h3>

          <p className="mt-3 max-w-xl text-slate-500">
            This dataset does not contain any
            relationships above the configured
            correlation threshold.
          </p>

          <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 px-6 py-4">
            <p className="text-sm leading-6 text-slate-700">
              Try analysing a dataset with more
              numeric variables or a larger number
              of observations to reveal stronger
              statistical relationships.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Strong Correlations
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Automatically detected relationships
            between numeric variables.
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 px-4 py-2">
          <span className="text-sm font-semibold text-blue-700">
            {correlations.length} Found
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Variable A
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Variable B
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold">
                Correlation
              </th>

              <th className="px-4 py-3 text-center text-sm font-semibold">
                Direction
              </th>

              <th className="px-4 py-3 text-left text-sm font-semibold">
                Interpretation
              </th>
            </tr>
          </thead>

          <tbody>
            {correlations.map((item, index) => {
              const positive =
                item.correlation >= 0;

              return (
                <tr
                  key={`${item.column_1}-${item.column_2}-${index}`}
                  className="border-b transition-colors hover:bg-slate-50"
                >
                  <td className="px-4 py-4 font-medium text-slate-800">
                    {item.column_1}
                  </td>

                  <td className="px-4 py-4 font-medium text-slate-800">
                    {item.column_2}
                  </td>

                  <td
                    className={`px-4 py-4 text-center text-lg font-bold ${
                      positive
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {item.correlation.toFixed(2)}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {positive ? (
                        <ArrowUpRight
                          className="text-green-600"
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

                  <td className="px-4 py-4 text-slate-600">
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
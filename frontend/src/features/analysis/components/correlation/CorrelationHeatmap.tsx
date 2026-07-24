import { Grid2X2, Info } from "lucide-react";

import Badge from "../../../../components/ui/Badge";
import Card from "../../../../components/ui/Card";
import type { CorrelationMatrix } from "../../types/analysis";

interface CorrelationHeatmapProps {
  columns: string[];
  matrix: CorrelationMatrix;
}

function getCellClass(value: number, diagonal: boolean) {
  if (diagonal) return "bg-slate-900 text-white";

  if (value >= 0.8) return "bg-emerald-700 text-white";
  if (value >= 0.5) return "bg-emerald-500 text-white";
  if (value >= 0.2) return "bg-emerald-200 text-emerald-900";

  if (value <= -0.8) return "bg-red-700 text-white";
  if (value <= -0.5) return "bg-red-500 text-white";
  if (value <= -0.2) return "bg-red-200 text-red-900";

  return "bg-slate-100 text-slate-700";
}

export default function CorrelationHeatmap({
  columns,
  matrix,
}: CorrelationHeatmapProps) {
  return (
    <Card className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-50 p-3">
            <Grid2X2
              size={22}
              className="text-indigo-600"
            />
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Correlation Heatmap
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Explore pairwise relationships between numeric variables.
            </p>
          </div>
        </div>

        <Badge variant="info">
          {columns.length} Variables
        </Badge>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-red-600" />
            Strong Negative
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-slate-300" />
            Weak
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-emerald-600" />
            Strong Positive
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Info size={16} />
          Diagonal values represent self-correlation (1.00).
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-auto rounded-2xl border border-slate-200">
        <table className="min-w-full border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-30 bg-white p-3 text-left font-semibold">
                Variable
              </th>

              {columns.map((column) => (
                <th
                  key={column}
                  className="sticky top-0 z-20 bg-white p-3 text-center font-semibold whitespace-nowrap"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {columns.map((row) => (
              <tr key={row}>
                <th className="sticky left-0 z-10 bg-white p-3 text-left font-semibold whitespace-nowrap">
                  {row}
                </th>

                {columns.map((column) => {
                  const value = matrix[row]?.[column] ?? 0;
                  const diagonal = row === column;

                  return (
                    <td
                      key={`${row}-${column}`}
                      className="p-0"
                    >
                      <div
                        className={`
                          flex
                          h-14
                          w-16
                          items-center
                          justify-center
                          rounded-xl
                          text-sm
                          font-bold
                          shadow-sm
                          transition-all
                          duration-200
                          hover:scale-105
                          hover:shadow-md
                          ${getCellClass(value, diagonal)}
                        `}
                      >
                        {value.toFixed(2)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
import { useMemo, useState } from "react";

import type { CorrelationResponse } from "../../types/analysis";
import HeatmapCell from "./HeatmapCell";

interface HeatmapGridProps {
  correlation: CorrelationResponse;
  search: string;
  threshold: number;
}

interface CellData {
  row: string;
  column: string;
  value: number;
}

export default function HeatmapGrid({
  correlation,
  search,
  threshold,
}: HeatmapGridProps) {
  const [selected, setSelected] =
    useState<CellData | null>(null);

  const columns = correlation.numeric_columns;

  const matrix = correlation.correlation_matrix;

  const filteredColumns = useMemo(() => {
    if (!search.trim()) {
      return columns;
    }

    const query = search.toLowerCase();

    return columns.filter((column) =>
      column.toLowerCase().includes(query),
    );
  }, [columns, search]);

  const maxCorrelation = useMemo(() => {
    let max = 0;

    Object.values(matrix).forEach((row) => {
      Object.values(row).forEach((value) => {
        max = Math.max(max, Math.abs(value));
      });
    });

    return max;
  }, [matrix]);

  const visibleCells = useMemo(() => {
    return filteredColumns.length * filteredColumns.length;
  }, [filteredColumns]);

  return (
    <div className="space-y-5">
      <div className="overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-30 bg-slate-100 px-4 py-3 text-left text-sm font-semibold">
                Column
              </th>

              {filteredColumns.map((column) => (
                <th
                  key={column}
                  className="bg-slate-100 px-4 py-3 text-center text-xs font-semibold whitespace-nowrap"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
                      {filteredColumns.map((rowName) => (
              <tr key={rowName}>
                <td className="sticky left-0 z-20 border bg-white px-4 py-3 text-sm font-semibold whitespace-nowrap">
                  {rowName}
                </td>

                {filteredColumns.map((columnName) => {
                  const value =
                    matrix[rowName]?.[columnName] ?? 0;

                  return (
                    <td
                      key={`${rowName}-${columnName}`}
                      className="border p-1"
                    >
                      <HeatmapCell
                        row={rowName}
                        column={columnName}
                        value={value}
                        selected={
                          selected?.row === rowName &&
                          selected?.column === columnName
                        }
                        onClick={(row, column, value) =>
                          setSelected({
                            row,
                            column,
                            value,
                          })
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold">
            Matrix Summary
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Visible Columns</span>

              <strong>{filteredColumns.length}</strong>
            </div>

            <div className="flex justify-between">
              <span>Visible Cells</span>

              <strong>{visibleCells}</strong>
            </div>

            <div className="flex justify-between">
              <span>Maximum |Correlation|</span>

              <strong>{maxCorrelation.toFixed(2)}</strong>
            </div>

            <div className="flex justify-between">
              <span>Threshold</span>

              <strong>{threshold.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold">
            Selected Cell
          </h3>
                    {selected ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Row
                  </p>

                  <p className="mt-2 text-base font-semibold text-slate-800">
                    {selected.row}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Column
                  </p>

                  <p className="mt-2 text-base font-semibold text-slate-800">
                    {selected.column}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Correlation
                  </p>

                  <p
                    className={`mt-2 text-lg font-bold ${
                      selected.value >= 0
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {selected.value.toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h4 className="mb-2 font-semibold">
                  Interpretation
                </h4>

                <p className="text-sm leading-7 text-slate-600">
                  {Math.abs(selected.value) >= 0.9
                    ? "Very strong relationship detected. These variables have an extremely high correlation and should be reviewed for multicollinearity before model training."
                    : Math.abs(selected.value) >= 0.7
                    ? "Strong relationship detected. This pair is highly associated and may be valuable during feature engineering."
                    : Math.abs(selected.value) >= 0.5
                    ? "Moderate relationship detected. The variables show a noticeable association."
                    : Math.abs(selected.value) >= threshold
                    ? "Weak but meaningful relationship between the variables."
                    : "Very weak or negligible relationship between the variables."}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-center text-slate-500">
              Click any heatmap cell to view detailed correlation information.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
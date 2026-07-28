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
  const [selected, setSelected] = useState<CellData | null>(null);

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
      <div className="overflow-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <table className="min-w-full border-collapse text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-30 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-3 text-left text-xs font-bold uppercase">
                Column
              </th>

              {filteredColumns.map((column) => (
                <th
                  key={column}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-3 text-center text-xs font-bold uppercase whitespace-nowrap"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredColumns.map((rowName) => (
              <tr key={rowName}>
                <td className="sticky left-0 z-20 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 text-xs font-bold whitespace-nowrap">
                  {rowName}
                </td>

                {filteredColumns.map((columnName) => {
                  const value = matrix[rowName]?.[columnName] ?? 0;

                  return (
                    <td
                      key={`${rowName}-${columnName}`}
                      className="border border-slate-200 dark:border-slate-800/60 p-1"
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
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <h3 className="mb-3 text-sm font-extrabold text-slate-900 dark:text-white">
            Matrix Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
              <span>Visible Columns</span>
              <strong className="text-slate-900 dark:text-white font-mono">{filteredColumns.length}</strong>
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
              <span>Visible Cells</span>
              <strong className="text-slate-900 dark:text-white font-mono">{visibleCells}</strong>
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
              <span>Maximum |Correlation|</span>
              <strong className="text-slate-900 dark:text-white font-mono">{maxCorrelation.toFixed(2)}</strong>
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
              <span>Threshold</span>
              <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{threshold.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <h3 className="mb-3 text-sm font-extrabold text-slate-900 dark:text-white">
            Selected Cell Information
          </h3>

          {selected ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Row
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                    {selected.row}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Column
                  </p>

                  <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">
                    {selected.column}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200 dark:border-slate-800">
                  <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Correlation
                  </p>

                  <p
                    className={`mt-1 text-sm font-black font-mono ${
                      selected.value >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-500 dark:text-red-400"
                    }`}
                  >
                    {selected.value.toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4">
                <h4 className="mb-1 font-bold text-xs text-slate-900 dark:text-white">
                  Statistical Interpretation
                </h4>

                <p className="text-xs font-medium leading-relaxed text-slate-600 dark:text-slate-300">
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
            <div className="flex h-36 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
              Click any heatmap cell to view detailed correlation information.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
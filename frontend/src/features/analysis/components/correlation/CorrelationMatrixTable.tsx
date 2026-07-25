import type { CorrelationResponse } from "../../types/analysis";

interface CorrelationMatrixTableProps {
  correlation: CorrelationResponse;
  search: string;
  threshold: number;
}

function getCorrelationColor(value: number): string {
  const abs = Math.abs(value);

  if (abs >= 0.9) return "text-red-600 font-bold";
  if (abs >= 0.7) return "text-orange-600 font-semibold";
  if (abs >= 0.5) return "text-yellow-600";
  if (abs >= 0.3) return "text-blue-600";

  return "text-slate-400";
}

export default function CorrelationMatrixTable({
  correlation,
  search,
  threshold,
}: CorrelationMatrixTableProps) {
  const columns = correlation.numeric_columns.filter((column) =>
    column.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse">
        <thead className="bg-slate-100">
          <tr>
            <th className="sticky left-0 bg-slate-100 px-4 py-3 text-left text-sm font-semibold">
              Column
            </th>

            {columns.map((column) => (
              <th
                key={column}
                className="px-4 py-3 text-center text-sm font-semibold whitespace-nowrap"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {columns.map((row) => (
            <tr key={row} className="border-t">
              <td className="sticky left-0 bg-white px-4 py-3 font-semibold">
                {row}
              </td>

              {columns.map((col) => {
                const value =
                  correlation.correlation_matrix[row]?.[col] ?? 0;

                const visible =
                  row === col || Math.abs(value) >= threshold;

                return (
                  <td
                    key={col}
                    className="px-4 py-3 text-center"
                  >
                    {visible ? (
                      <span className={getCorrelationColor(value)}>
                        {value.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
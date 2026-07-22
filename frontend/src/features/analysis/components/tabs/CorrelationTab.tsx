import { Network } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import LoadingCard from "../../../../components/ui/LoadingCard";
import SectionHeader from "../../../../components/ui/SectionHeader";

import { useCorrelation } from "../../hooks";

export default function CorrelationTab() {
  const { data, isLoading, isError } = useCorrelation();

  if (isLoading) {
    return <LoadingCard rows={5} />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={Network}
        title="Correlation Analysis Unavailable"
        description="Unable to load the correlation matrix."
      />
    );
  }

  const columns = data.numeric_columns;

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Network}
        title="Correlation Matrix"
        subtitle={`Method: ${data.method}`}
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">
                Column
              </th>

              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-center font-semibold"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {columns.map((row) => (
              <tr key={row} className="border-t hover:bg-slate-50">
                <td className="px-4 py-3 font-semibold">
                  {row}
                </td>

                {columns.map((column) => (
                  <td
                    key={column}
                    className="px-4 py-3 text-center"
                  >
                    {data.correlation_matrix[row][column].toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
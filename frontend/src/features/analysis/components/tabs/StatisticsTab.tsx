import { BarChart3, Sigma } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import LoadingCard from "../../../../components/ui/LoadingCard";
import SectionHeader from "../../../../components/ui/SectionHeader";

import { useDescriptiveStats } from "../../hooks";

export default function StatisticsTab() {
  const { data, isLoading, isError } = useDescriptiveStats();

  if (isLoading) {
    return <LoadingCard rows={6} />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Statistics Not Available"
        description="Unable to load descriptive statistics."
      />
    );
  }

  const columns = Object.entries(data);

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Sigma}
        title="Descriptive Statistics"
        subtitle="Statistical summary of all numeric columns."
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">
                Column
              </th>

              <th className="px-4 py-3 text-right">Count</th>

              <th className="px-4 py-3 text-right">Mean</th>

              <th className="px-4 py-3 text-right">
                Std Dev
              </th>

              <th className="px-4 py-3 text-right">
                Minimum
              </th>

              <th className="px-4 py-3 text-right">
                Q1
              </th>

              <th className="px-4 py-3 text-right">
                Median
              </th>

              <th className="px-4 py-3 text-right">
                Q3
              </th>

              <th className="px-4 py-3 text-right">
                Maximum
              </th>

              <th className="px-4 py-3 text-right">
                Missing
              </th>
            </tr>
          </thead>

          <tbody>
            {columns.map(([column, stats]) => (
              <tr
                key={column}
                className="border-t hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium">
                  {column}
                </td>

                <td className="px-4 py-3 text-right">
                  {stats.count}
                </td>

                <td className="px-4 py-3 text-right">
                  {stats.mean.toFixed(2)}
                </td>

                <td className="px-4 py-3 text-right">
                  {stats.standard_deviation.toFixed(2)}
                </td>

                <td className="px-4 py-3 text-right">
                  {stats.minimum}
                </td>

                <td className="px-4 py-3 text-right">
                  {stats.q1}
                </td>

                <td className="px-4 py-3 text-right">
                  {stats.q2}
                </td>

                <td className="px-4 py-3 text-right">
                  {stats.q3}
                </td>

                <td className="px-4 py-3 text-right">
                  {stats.maximum}
                </td>

                <td className="px-4 py-3 text-right">
                  {stats.missing_values}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
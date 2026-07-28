import { Link2 } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import SectionHeader from "../../../../components/ui/SectionHeader";
import StatusBadge from "../../../../components/ui/StatusBadge";

import { useAnalysisData } from "../../context/AnalysisContext";

export default function StrongCorrelationTab() {
  const { correlation } = useAnalysisData();

  const data = correlation?.strong_correlations ?? [];

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={Link2}
        title="No Strong Correlations"
        description="No strong linear or monotonic relationships (|r| ≥ 0.70) were found between numeric columns."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<Link2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
        title="Strong Correlations"
        subtitle={`${data.length} strong relationships detected`}
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800/80">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-slate-800 dark:text-slate-200">
                Column 1
              </th>

              <th className="px-4 py-3 text-left font-bold text-slate-800 dark:text-slate-200">
                Column 2
              </th>

              <th className="px-4 py-3 text-center font-bold text-slate-800 dark:text-slate-200">
                Correlation
              </th>

              <th className="px-4 py-3 text-center font-bold text-slate-800 dark:text-slate-200">
                Direction
              </th>

              <th className="px-4 py-3 text-center font-bold text-slate-800 dark:text-slate-200">
                Strength
              </th>

              <th className="px-4 py-3 text-left font-bold text-slate-800 dark:text-slate-200">
                Interpretation
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {data.map((item, index) => (
              <tr
                key={index}
                className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                  {item.column_1}
                </td>

                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                  {item.column_2}
                </td>

                <td
                  className={`px-4 py-3 text-center font-extrabold ${
                    (item.correlation ?? 0) >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {(item.correlation ?? 0).toFixed(3)}
                </td>

                <td className="px-4 py-3 text-center font-semibold text-slate-800 dark:text-slate-200">
                  {item.direction ?? "Positive"}
                </td>

                <td className="px-4 py-3 text-center">
                  <StatusBadge
                    label={(item.absolute_correlation ?? Math.abs(item.correlation ?? 0)).toFixed(2)}
                    variant={
                      (item.absolute_correlation ?? 0) >= 0.90
                        ? "success"
                        : (item.absolute_correlation ?? 0) >= 0.70
                        ? "info"
                        : "warning"
                    }
                  />
                </td>

                <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300">
                  {item.interpretation || "Strong correlation detected"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
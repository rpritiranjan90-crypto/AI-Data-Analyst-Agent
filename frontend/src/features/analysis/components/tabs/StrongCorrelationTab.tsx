import { Link2 } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import LoadingCard from "../../../../components/ui/LoadingCard";
import SectionHeader from "../../../../components/ui/SectionHeader";
import StatusBadge from "../../../../components/ui/StatusBadge";

import { useStrongCorrelation } from "../../hooks";

export default function StrongCorrelationTab() {
  const { data, isLoading, isError } = useStrongCorrelation();

  if (isLoading) {
    return <LoadingCard rows={5} />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={Link2}
        title="Strong Correlations Not Available"
        description="Unable to load strong correlation analysis."
      />
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Link2}
        title="No Strong Correlations"
        description="No strong relationships were found between numeric columns."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Link2}
        title="Strong Correlations"
        subtitle={`${data.length} strong relationships detected`}
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left">Column 1</th>
              <th className="px-4 py-3 text-left">Column 2</th>
              <th className="px-4 py-3 text-center">Correlation</th>
              <th className="px-4 py-3 text-center">Direction</th>
              <th className="px-4 py-3 text-center">Strength</th>
              <th className="px-4 py-3 text-left">Interpretation</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-t hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium">
                  {item.column_1}
                </td>

                <td className="px-4 py-3 font-medium">
                  {item.column_2}
                </td>

                <td className="px-4 py-3 text-center">
                  {item.correlation.toFixed(3)}
                </td>

                <td className="px-4 py-3 text-center">
                  {item.direction}
                </td>

                <td className="px-4 py-3 text-center">
                  <StatusBadge
                    label={item.absolute_correlation.toFixed(2)}
                    variant={
                      item.absolute_correlation >= 0.8
                        ? "success"
                        : item.absolute_correlation >= 0.6
                        ? "info"
                        : "warning"
                    }
                  />
                </td>

                <td className="px-4 py-3">
                  {item.interpretation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import { Activity } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import LoadingCard from "../../../../components/ui/LoadingCard";
import MetricCard from "../../../../components/ui/MetricCard";
import SectionHeader from "../../../../components/ui/SectionHeader";
import StatusBadge from "../../../../components/ui/StatusBadge";

import { useDistribution } from "../../hooks";

export default function DistributionTab() {
  const { data, isLoading, isError } = useDistribution();

  if (isLoading) {
    return <LoadingCard rows={4} />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={Activity}
        title="Distribution Analysis Unavailable"
        description="Unable to load distribution statistics."
      />
    );
  }

  const columns = Object.entries(data);

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={Activity}
        title="Distribution Analysis"
        subtitle={`${columns.length} numeric columns analysed`}
      />

      {columns.map(([column, stats]) => (
        <div
          key={column}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <SectionHeader
            title={column}
            subtitle="Distribution Summary"
          />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Mean"
              value={stats.mean.toFixed(2)}
              subtitle="Average"
              icon={Activity}
            />

            <MetricCard
              title="Median"
              value={stats.median.toFixed(2)}
              subtitle="Middle Value"
              icon={Activity}
              color="green"
            />

            <MetricCard
              title="Std Dev"
              value={stats.standard_deviation.toFixed(2)}
              subtitle="Dispersion"
              icon={Activity}
              color="orange"
            />

            <MetricCard
              title="Range"
              value={stats.range.toFixed(2)}
              subtitle="Maximum - Minimum"
              icon={Activity}
              color="purple"
            />
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl border">
            <table className="min-w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Minimum</td>
                  <td className="px-4 py-3">{stats.minimum}</td>

                  <td className="px-4 py-3 font-medium">Maximum</td>
                  <td className="px-4 py-3">{stats.maximum}</td>
                </tr>

                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Q1</td>
                  <td className="px-4 py-3">{stats.q1}</td>

                  <td className="px-4 py-3 font-medium">Q3</td>
                  <td className="px-4 py-3">{stats.q3}</td>
                </tr>

                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">IQR</td>
                  <td className="px-4 py-3">{stats.iqr}</td>

                  <td className="px-4 py-3 font-medium">Variance</td>
                  <td className="px-4 py-3">{stats.variance}</td>
                </tr>

                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">Skewness</td>
                  <td className="px-4 py-3">
                    {stats.skewness.toFixed(3)}
                  </td>

                  <td className="px-4 py-3 font-medium">Kurtosis</td>
                  <td className="px-4 py-3">
                    {stats.kurtosis.toFixed(3)}
                  </td>
                </tr>

                <tr>
                  <td className="px-4 py-3 font-medium">
                    Distribution
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge
                      label={
                        stats.normal_distribution
                          ? "Normal"
                          : "Non-Normal"
                      }
                      variant={
                        stats.normal_distribution
                          ? "success"
                          : "warning"
                      }
                    />
                  </td>

                  <td className="px-4 py-3 font-medium">
                    Outliers
                  </td>

                  <td className="px-4 py-3">
                    {stats.outliers.count}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
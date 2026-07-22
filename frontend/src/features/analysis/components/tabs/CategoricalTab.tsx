import { Tags } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import LoadingCard from "../../../../components/ui/LoadingCard";
import MetricCard from "../../../../components/ui/MetricCard";
import SectionHeader from "../../../../components/ui/SectionHeader";
import StatusBadge from "../../../../components/ui/StatusBadge";

import { useCategorical } from "../../hooks";

export default function CategoricalTab() {
  const { data, isLoading, isError } = useCategorical();

  if (isLoading) {
    return <LoadingCard rows={4} />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={Tags}
        title="Categorical Analysis Unavailable"
        description="Unable to load categorical analysis."
      />
    );
  }

  const columns = Object.entries(data);

  if (columns.length === 0) {
    return (
      <EmptyState
        icon={Tags}
        title="No Categorical Columns"
        description="No categorical columns were detected."
      />
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={Tags}
        title="Categorical Analysis"
        subtitle={`${columns.length} categorical columns`}
      />

      {columns.map(([column, stats]) => (
        <div
          key={column}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <SectionHeader
            title={column}
            subtitle="Column Summary"
          />

          <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Unique"
              value={stats.unique_values}
              subtitle="Distinct values"
              icon={Tags}
            />

            <MetricCard
              title="Missing"
              value={stats.missing_values}
              subtitle={`${stats.missing_percentage.toFixed(2)}%`}
              icon={Tags}
              color="orange"
            />

            <MetricCard
              title="Most Frequent"
              value={stats.most_frequent}
              subtitle={`${stats.most_frequent_count} records`}
              icon={Tags}
              color="green"
            />

            <MetricCard
              title="Cardinality"
              value={stats.cardinality}
              subtitle="Category type"
              icon={Tags}
              color="purple"
            />
          </div>

          <div className="mb-4 flex gap-3">
            <StatusBadge
              label={stats.binary_column ? "Binary" : "Not Binary"}
              variant={stats.binary_column ? "success" : "neutral"}
            />

            <StatusBadge
              label={stats.constant_column ? "Constant" : "Variable"}
              variant={stats.constant_column ? "warning" : "info"}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
import { useMemo } from "react";
import {
  PieChart,
  Tags,
  ListFilter,
} from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import MetricCard from "../../../../components/ui/MetricCard";
import SectionHeader from "../../../../components/ui/SectionHeader";
import StatusBadge from "../../../../components/ui/StatusBadge";

import AnalyticsBarChart from "../charts/AnalyticsBarChart";
import AnalyticsPieChart from "../charts/AnalyticsPieChart";

import type { CategoricalColumnAnalysis } from "../../types/analysis";
import { buildCategoryChartData } from "../../utils/chartData";

interface CategoricalCardProps {
  column: string;
  stats: CategoricalColumnAnalysis;
}

export default function CategoricalCard({
  column,
  stats,
}: CategoricalCardProps) {
  const chartData = useMemo(
    () => buildCategoryChartData(stats),
    [stats]
  );

  const showPieChart = stats.unique_values <= 10;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <SectionHeader
  icon={
    <ListFilter className="h-6 w-6 text-indigo-600" />
  }
  title={column}
  subtitle="Categorical feature analysis"
/>

      {/* KPI Cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

      {/* Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AnalyticsBarChart
          title={`Top Categories - ${column}`}
          subtitle="Top category frequency"
          data={chartData}
          xKey="category"
          yKey="count"
        />

        {showPieChart ? (
          <AnalyticsPieChart
            title={`${column} Distribution`}
            subtitle="Category share"
            data={chartData}
            nameKey="category"
            dataKey="count"
          />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <EmptyState
              icon={PieChart}
              title="Pie Chart Not Available"
              description={`"${column}" has ${stats.unique_values} unique categories. Pie charts are only shown for columns with 10 or fewer categories.`}
            />
          </div>
        )}
      </div>

      {/* Status */}
      <div className="mt-6 flex flex-wrap gap-3">
        <StatusBadge
          label={stats.binary_column ? "Binary Column" : "Non-Binary Column"}
          variant={stats.binary_column ? "success" : "neutral"}
        />

        <StatusBadge
          label={stats.constant_column ? "Constant Column" : "Variable Column"}
          variant={stats.constant_column ? "warning" : "info"}
        />
      </div>
    </div>
  );
}
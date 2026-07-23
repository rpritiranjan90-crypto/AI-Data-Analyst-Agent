import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

import Card from "../../../../components/ui/Card";
import MetricCard from "../../../../components/ui/MetricCard";

import type { DistributionResponse } from "../../types/analysis";

interface DistributionSummaryProps {
  distribution: DistributionResponse;
}

export default function DistributionSummary({
  distribution,
}: DistributionSummaryProps) {
  const columns = Object.values(distribution);

  const totalColumns = columns.length;

  const normalColumns = columns.filter(
    (item) => item.normal_distribution
  ).length;

  const skewedColumns = columns.filter(
    (item) => !item.normal_distribution
  ).length;

  const outlierColumns = columns.filter(
    (item) => item.outliers.count > 0
  ).length;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="Numeric Columns"
        value={totalColumns}
        subtitle="Analysed Features"
        icon={BarChart3}
        color="blue"
      />

      <MetricCard
        title="Normal Distribution"
        value={normalColumns}
        subtitle="Normally Distributed"
        icon={CheckCircle2}
        color="green"
      />

      <MetricCard
        title="Skewed Columns"
        value={skewedColumns}
        subtitle="Require Attention"
        icon={Activity}
        color="orange"
      />

      <MetricCard
        title="Outlier Columns"
        value={outlierColumns}
        subtitle="Contain Outliers"
        icon={AlertTriangle}
        color="red"
      />
    </div>
  );
}
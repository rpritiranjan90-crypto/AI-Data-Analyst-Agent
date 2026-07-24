import {
  Activity,
  Network,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

import type { StrongCorrelation } from "../../types/analysis";

interface CorrelationSummaryProps {
  method: string;
  totalNumericColumns: number;
  correlations: StrongCorrelation[];
}

interface SummaryCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: React.ReactNode;
  subtitle: React.ReactNode;
}

function SummaryCard({
  icon,
  iconBg,
  title,
  value,
  subtitle,
}: SummaryCardProps) {
  return (
    <Card className="p-5 h-full">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900">
            {value}
          </h2>

          <div className="mt-2 text-sm text-slate-500">
            {subtitle}
          </div>
        </div>

        <div className={`rounded-2xl p-3 ${iconBg}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

export default function CorrelationSummary({
  method,
  totalNumericColumns,
  correlations,
}: CorrelationSummaryProps) {
  const strongest = correlations
    .slice()
    .sort(
      (a, b) =>
        b.absolute_correlation -
        a.absolute_correlation
    )[0];

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <SummaryCard
        title="Method"
        value={method.toUpperCase()}
        subtitle="Correlation Algorithm"
        icon={
          <Network
            size={22}
            className="text-blue-600"
          />
        }
        iconBg="bg-blue-50"
      />

      <SummaryCard
        title="Numeric Columns"
        value={totalNumericColumns}
        subtitle="Included in Analysis"
        icon={
          <Activity
            size={22}
            className="text-violet-600"
          />
        }
        iconBg="bg-violet-50"
      />

      <SummaryCard
        title="Strongest Pair"
        value={
          strongest
            ? `${strongest.column_1} ↔ ${strongest.column_2}`
            : "None"
        }
        subtitle={
          strongest
            ? `${strongest.direction} (${strongest.correlation.toFixed(
                2
              )})`
            : "No correlation exceeded the threshold."
        }
        icon={
          <TrendingUp
            size={22}
            className="text-emerald-600"
          />
        }
        iconBg="bg-emerald-50"
      />

      <SummaryCard
        title="Highest Correlation"
        value={
          strongest
            ? strongest.absolute_correlation.toFixed(2)
            : "—"
        }
        subtitle={
          strongest
            ? strongest.interpretation
            : "No measurable relationship"
        }
        icon={
          <TrendingDown
            size={22}
            className="text-orange-600"
          />
        }
        iconBg="bg-orange-50"
      />
    </div>
  );
}
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  Sigma,
  TrendingUp,
} from "lucide-react";

import Card from "../../../../components/ui/Card";
import MetricCard from "../../../../components/ui/MetricCard";
import StatusBadge from "../../../../components/ui/StatusBadge";

import { formatCompactNumber } from "../../utils/numberFormat";
import type { DistributionResponse } from "../../types/analysis";

interface DistributionCardsProps {
  distribution: DistributionResponse;
}

function getRecommendation(
  normal: boolean,
  skewness: number,
  outliers: number
) {
  if (normal && outliers === 0) {
    return {
      title: "Excellent",
      message:
        "This feature is well suited for most statistical methods and machine learning algorithms without additional preprocessing.",
    };
  }

  if (outliers > 0 && Math.abs(skewness) > 1) {
    return {
      title: "Transformation Recommended",
      message:
        "Consider log, Box-Cox or Yeo-Johnson transformation before linear modelling. Tree-based models can usually handle this feature directly.",
    };
  }

  if (outliers > 0) {
    return {
      title: "Review Outliers",
      message:
        "Investigate detected outliers before modelling. They may represent data quality issues or important rare events.",
    };
  }

  return {
    title: "Moderate",
    message:
      "This feature is usable, but review its distribution before selecting statistical techniques.",
  };
}

export default function DistributionCards({
  distribution,
}: DistributionCardsProps) {
  const columns = Object.entries(distribution);

  return (
    <div className="space-y-8">
      {columns.map(([column, stats]) => {
        const recommendation = getRecommendation(
          stats.normal_distribution,
          stats.skewness,
          stats.outliers.count
        );

        return (
          <Card key={column}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {column}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Distribution Analysis
                </p>
              </div>

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
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Mean"
                value={formatCompactNumber(stats.mean)}
                subtitle="Average"
                icon={BarChart3}
                color="blue"
              />

              <MetricCard
                title="Median"
                value={formatCompactNumber(stats.median)}
                subtitle="Middle Value"
                icon={Activity}
                color="green"
              />

              <MetricCard
                title="Std Dev"
                value={formatCompactNumber(
                  stats.standard_deviation
                )}
                subtitle="Dispersion"
                icon={TrendingUp}
                color="orange"
              />

              <MetricCard
                title="Outliers"
                value={stats.outliers.count}
                subtitle="Detected"
                icon={AlertTriangle}
                color={
                  stats.outliers.count > 0
                    ? "red"
                    : "green"
                }
              />
            </div>

            <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Brain
                  size={20}
                  className="text-blue-600"
                />

                <h3 className="text-lg font-semibold text-slate-900">
                  Quick Facts
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Skew Type
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {stats.skewness_type}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Kurtosis
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {stats.kurtosis_type}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Variation
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {stats.coefficient_of_variation.toFixed(2)}%
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    ML Readiness
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {stats.normal_distribution
                      ? "Ready"
                      : "Review"}
                  </p>
                </div>
              </div>
            </div>
                        <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <BarChart3
                    size={18}
                    className="text-blue-600"
                  />
                  <h3 className="text-lg font-semibold text-slate-900">
                    Statistics
                  </h3>
                </div>

                <div className="space-y-3 text-sm">
                  {[
                    ["Minimum", formatCompactNumber(stats.minimum)],
                    ["Maximum", formatCompactNumber(stats.maximum)],
                    ["Range", formatCompactNumber(stats.range)],
                    ["Variance", formatCompactNumber(stats.variance)],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between border-b border-slate-200 pb-2 last:border-b-0"
                    >
                      <span className="text-slate-600">{label}</span>

                      <span className="font-semibold text-slate-900 text-right">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Sigma
                    size={18}
                    className="text-violet-600"
                  />

                  <h3 className="text-lg font-semibold text-slate-900">
                    Shape Analysis
                  </h3>
                </div>

                <div className="space-y-3 text-sm">
                  {[
                    [
                      "Skewness",
                      stats.skewness.toFixed(3),
                    ],
                    [
                      "Skew Type",
                      stats.skewness_type,
                    ],
                    [
                      "Kurtosis",
                      stats.kurtosis.toFixed(3),
                    ],
                    [
                      "Kurtosis Type",
                      stats.kurtosis_type,
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between border-b border-slate-200 pb-2 last:border-b-0"
                    >
                      <span className="text-slate-600">{label}</span>

                      <span className="font-semibold text-slate-900 text-right">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <Brain
                  size={22}
                  className="mt-1 text-emerald-600"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">
                    AI Recommendation
                  </h3>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Status
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {recommendation.title}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Distribution
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {stats.normal_distribution
                          ? "Normal"
                          : "Non-Normal"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Outliers
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {stats.outliers.count}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-700">
                    {recommendation.message}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
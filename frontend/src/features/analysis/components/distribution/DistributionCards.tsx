import { useMemo, useState } from "react";
import {
  BarChart3,
  Brain,
  Box,
  Filter,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

import type { DistributionResponse } from "../../types/analysis";

interface DistributionChartsProps {
  distribution: DistributionResponse;
}

export default function DistributionCharts({
  distribution,
}: DistributionChartsProps) {
  const columns = Object.keys(distribution);

  const [selectedColumn, setSelectedColumn] =
    useState(columns[0] ?? "");

  const stats = useMemo(() => {
    return distribution[selectedColumn];
  }, [distribution, selectedColumn]);

  if (!stats) {
    return null;
  }

  const histogramData = [
    {
      label: "Minimum",
      value: stats.minimum,
    },
    {
      label: "Q1",
      value: stats.q1,
    },
    {
      label: "Median",
      value: stats.median,
    },
    {
      label: "Q3",
      value: stats.q3,
    },
    {
      label: "Maximum",
      value: stats.maximum,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar */}

      <Card>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Distribution Visual Explorer
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Explore statistical distributions for every numeric
              feature.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Filter
              size={18}
              className="text-indigo-600"
            />

            <select
              value={selectedColumn}
              onChange={(e) =>
                setSelectedColumn(e.target.value)
              }
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            >
              {columns.map((column) => (
                <option
                  key={column}
                  value={column}
                >
                  {column}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Charts */}

      <div className="grid gap-6 lg:grid-cols-2">

        <Card>

          <div className="mb-5 flex items-center gap-2">
            <BarChart3
              size={20}
              className="text-blue-600"
            />

            <h3 className="text-lg font-semibold">
              Histogram Preview
            </h3>
          </div>

          <div className="flex h-72 items-end justify-between gap-3">

            {histogramData.map((item) => {

              const height =
                ((item.value - stats.minimum) /
                  (stats.maximum -
                    stats.minimum || 1)) *
                100;

              return (
                <div
                  key={item.label}
                  className="flex flex-1 flex-col items-center"
                >
                  <div
                    className="w-full rounded-t-xl bg-blue-500 transition-all duration-500 hover:bg-blue-600"
                    style={{
                      height: `${Math.max(
                        height,
                        5,
                      )}%`,
                    }}
                  />

                  <span className="mt-3 text-xs font-medium">
                    {item.label}
                  </span>
                </div>
              );
            })}

          </div>

        </Card>
                <Card>
          <div className="mb-5 flex items-center gap-2">
            <Box
              size={20}
              className="text-violet-600"
            />

            <h3 className="text-lg font-semibold">
              Box Plot Summary
            </h3>
          </div>

          <div className="space-y-5">

            <div className="relative h-20">

              <div className="absolute top-9 left-0 right-0 h-1 rounded-full bg-slate-200" />

              <div
                className="absolute top-6 h-8 rounded-lg border-2 border-violet-500 bg-violet-200"
                style={{
                  left: "25%",
                  width: "50%",
                }}
              />

              <div
                className="absolute top-2 h-16 w-1 bg-violet-700"
                style={{
                  left: "50%",
                }}
              />

              <div
                className="absolute top-8 h-2 w-12 bg-slate-700"
                style={{
                  left: "5%",
                }}
              />

              <div
                className="absolute top-8 h-2 w-12 bg-slate-700"
                style={{
                  right: "5%",
                }}
              />
            </div>

            <div className="grid grid-cols-5 gap-3 text-center text-xs">

              <div>
                <p className="text-slate-500">
                  Min
                </p>

                <p className="font-semibold">
                  {stats.minimum.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-slate-500">
                  Q1
                </p>

                <p className="font-semibold">
                  {stats.q1.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-slate-500">
                  Median
                </p>

                <p className="font-semibold">
                  {stats.median.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-slate-500">
                  Q3
                </p>

                <p className="font-semibold">
                  {stats.q3.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-slate-500">
                  Max
                </p>

                <p className="font-semibold">
                  {stats.maximum.toFixed(2)}
                </p>
              </div>

            </div>
          </div>
        </Card>

      </div>

      <Card>

        <div className="mb-5 flex items-center gap-2">
          <Brain
            size={20}
            className="text-emerald-600"
          />

          <h3 className="text-lg font-semibold">
            AI Distribution Insights
          </h3>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">

          <div className="rounded-xl bg-slate-50 p-5">

            <h4 className="mb-4 font-semibold">
              Statistical Summary
            </h4>

            <div className="space-y-3 text-sm">

              <div className="flex justify-between">
                <span>Mean</span>

                <strong>
                  {stats.mean.toFixed(3)}
                </strong>
              </div>

              <div className="flex justify-between">
                <span>Median</span>

                <strong>
                  {stats.median.toFixed(3)}
                </strong>
              </div>

              <div className="flex justify-between">
                <span>Std. Deviation</span>

                <strong>
                  {stats.standard_deviation.toFixed(3)}
                </strong>
              </div>

              <div className="flex justify-between">
                <span>Variance</span>

                <strong>
                  {stats.variance.toFixed(3)}
                </strong>
              </div>

              <div className="flex justify-between">
                <span>Outliers</span>

                <strong>
                  {stats.outliers.count}
                </strong>
              </div>

            </div>
          </div>
                    <div className="rounded-xl bg-emerald-50 p-5">
            <h4 className="mb-4 font-semibold">
              AI Recommendation
            </h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Distribution
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    stats.normal_distribution
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {stats.normal_distribution
                    ? "Normal"
                    : "Non-Normal"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Skewness
                </span>

                <strong>
                  {stats.skewness.toFixed(3)}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Kurtosis
                </span>

                <strong>
                  {stats.kurtosis.toFixed(3)}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  ML Readiness
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    stats.normal_distribution &&
                    stats.outliers.count === 0
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {stats.normal_distribution &&
                  stats.outliers.count === 0
                    ? "Ready"
                    : "Needs Review"}
                </span>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-white p-4">
                <p className="text-sm leading-7 text-slate-700">
                  {stats.normal_distribution &&
                  stats.outliers.count === 0
                    ? "This feature is well suited for statistical analysis and most machine learning algorithms without additional preprocessing."
                    : stats.outliers.count > 0 &&
                      Math.abs(stats.skewness) > 1
                    ? "Consider applying logarithmic, Box-Cox, or Yeo-Johnson transformation before linear modelling. Investigate extreme values prior to training."
                    : stats.outliers.count > 0
                    ? "Outliers were detected. Verify whether they represent data quality issues or genuine rare observations."
                    : "The distribution is not perfectly normal. Consider feature scaling or transformation depending on the algorithm you plan to use."}
                </p>
              </div>
            </div>
          </div>

        </div>
      </Card>
    </div>
  );
}
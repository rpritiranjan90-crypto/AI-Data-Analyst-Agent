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
  const columns = Object.keys(distribution || {}).filter(
    (col) => col !== "message" && distribution[col] && typeof distribution[col] === "object"
  );

  const [selectedColumn, setSelectedColumn] = useState(columns[0] ?? "");

  const stats = useMemo(() => {
    return distribution[selectedColumn] || distribution[columns[0]];
  }, [distribution, selectedColumn, columns]);

  if (!stats) {
    return null;
  }

  const histogramData = [
    {
      label: "Minimum",
      value: stats.minimum ?? 0,
    },
    {
      label: "Q1",
      value: stats.q1 ?? 0,
    },
    {
      label: "Median",
      value: stats.median ?? 0,
    },
    {
      label: "Q3",
      value: stats.q3 ?? 0,
    },
    {
      label: "Maximum",
      value: stats.maximum ?? 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Distribution Visual Explorer
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-300">
              Explore statistical distributions for every numeric feature.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Filter
              size={18}
              className="text-indigo-600 dark:text-indigo-400"
            />

            <select
              value={selectedColumn || columns[0]}
              onChange={(e) =>
                setSelectedColumn(e.target.value)
              }
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:border-indigo-500 focus:outline-none"
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
              className="text-blue-600 dark:text-blue-400"
            />

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Histogram Preview
            </h3>
          </div>

          <div className="flex h-72 items-end justify-between gap-3 pt-6">
            {histogramData.map((item) => {
              const minVal = stats.minimum ?? 0;
              const maxVal = stats.maximum ?? 1;
              const height =
                ((item.value - minVal) / (maxVal - minVal || 1)) * 100;

              return (
                <div
                  key={item.label}
                  className="flex flex-1 flex-col items-center"
                >
                  <div
                    className="w-full rounded-t-xl bg-blue-500 dark:bg-blue-600 transition-all duration-500 hover:bg-blue-600"
                    style={{
                      height: `${Math.max(height, 8)}%`,
                    }}
                  />

                  <span className="mt-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
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
              className="text-violet-600 dark:text-violet-400"
            />

            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Box Plot Summary
            </h3>
          </div>

          <div className="space-y-5">
            <div className="relative h-20">
              <div className="absolute top-9 left-0 right-0 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />

              <div
                className="absolute top-6 h-8 rounded-lg border-2 border-violet-500 bg-violet-200 dark:bg-violet-900/60"
                style={{
                  left: "25%",
                  width: "50%",
                }}
              />

              <div
                className="absolute top-2 h-16 w-1 bg-violet-700 dark:bg-violet-400"
                style={{
                  left: "50%",
                }}
              />

              <div
                className="absolute top-8 h-2 w-12 bg-slate-700 dark:bg-slate-300"
                style={{
                  left: "5%",
                }}
              />

              <div
                className="absolute top-8 h-2 w-12 bg-slate-700 dark:bg-slate-300"
                style={{
                  right: "5%",
                }}
              />
            </div>

            <div className="grid grid-cols-5 gap-3 text-center text-xs">
              <div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Min
                </p>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {(stats.minimum ?? 0).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Q1
                </p>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {(stats.q1 ?? 0).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Median
                </p>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {(stats.median ?? 0).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Q3
                </p>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {(stats.q3 ?? 0).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Max
                </p>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {(stats.maximum ?? 0).toFixed(2)}
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
            className="text-emerald-600 dark:text-emerald-400"
          />

          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            AI Distribution Insights
          </h3>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-xl bg-slate-100 dark:bg-slate-800/80 p-5 border border-slate-200 dark:border-slate-700">
            <h4 className="mb-4 font-bold text-slate-900 dark:text-slate-100">
              Statistical Summary
            </h4>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Mean</span>
                <strong className="text-slate-900 dark:text-slate-100">
                  {(stats.mean ?? 0).toFixed(3)}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Median</span>
                <strong className="text-slate-900 dark:text-slate-100">
                  {(stats.median ?? 0).toFixed(3)}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Std. Deviation</span>
                <strong className="text-slate-900 dark:text-slate-100">
                  {(stats.standard_deviation ?? 0).toFixed(3)}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Variance</span>
                <strong className="text-slate-900 dark:text-slate-100">
                  {(stats.variance ?? 0).toFixed(3)}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Outliers</span>
                <strong className="text-slate-900 dark:text-slate-100">
                  {stats.outliers?.count ?? 0}
                </strong>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-5 border border-emerald-100 dark:border-emerald-900/50">
            <h4 className="mb-4 font-bold text-slate-900 dark:text-slate-100">
              AI Recommendation
            </h4>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  Distribution
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    stats.normal_distribution
                      ? "bg-green-100 dark:bg-green-950/80 text-green-700 dark:text-green-300"
                      : "bg-orange-100 dark:bg-orange-950/80 text-orange-700 dark:text-orange-300"
                  }`}
                >
                  {stats.normal_distribution ? "Normal" : "Non-Normal"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  Skewness
                </span>

                <strong className="text-slate-900 dark:text-slate-100">
                  {(stats.skewness ?? 0).toFixed(3)}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  Kurtosis
                </span>

                <strong className="text-slate-900 dark:text-slate-100">
                  {(stats.kurtosis ?? 0).toFixed(3)}
                </strong>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                  ML Readiness
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    stats.normal_distribution && (stats.outliers?.count ?? 0) === 0
                      ? "bg-green-100 dark:bg-green-950/80 text-green-700 dark:text-green-300"
                      : "bg-yellow-100 dark:bg-yellow-950/80 text-yellow-700 dark:text-yellow-300"
                  }`}
                >
                  {stats.normal_distribution && (stats.outliers?.count ?? 0) === 0
                    ? "Ready"
                    : "Needs Review"}
                </span>
              </div>

              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-slate-900 p-4">
                <p className="text-sm leading-7 font-medium text-slate-800 dark:text-slate-200">
                  {stats.normal_distribution && (stats.outliers?.count ?? 0) === 0
                    ? "This feature is well suited for statistical analysis and most machine learning algorithms without additional preprocessing."
                    : (stats.outliers?.count ?? 0) > 0 && Math.abs(stats.skewness ?? 0) > 1
                    ? "Consider applying logarithmic, Box-Cox, or Yeo-Johnson transformation before linear modelling. Investigate extreme values prior to training."
                    : (stats.outliers?.count ?? 0) > 0
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
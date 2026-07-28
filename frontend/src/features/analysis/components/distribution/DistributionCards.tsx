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
      <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Distribution Visual Explorer
            </h2>

            <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
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
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
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
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3
              size={18}
              className="text-indigo-600 dark:text-indigo-400"
            />

            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Histogram Preview
            </h3>
          </div>

          <div className="flex h-64 items-end justify-between gap-3 pt-6">
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
                    className="w-full rounded-t-xl bg-indigo-600 dark:bg-indigo-500 transition-all duration-500 hover:bg-indigo-500"
                    style={{
                      height: `${Math.max(height, 8)}%`,
                    }}
                  />

                  <span className="mt-3 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl">
          <div className="mb-5 flex items-center gap-2">
            <Box
              size={18}
              className="text-purple-600 dark:text-purple-400"
            />

            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Box Plot Summary
            </h3>
          </div>

          <div className="space-y-6">
            <div className="relative h-20">
              <div className="absolute top-9 left-0 right-0 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />

              <div
                className="absolute top-6 h-7 rounded-lg border-2 border-purple-500 bg-purple-500/20 dark:bg-purple-900/60"
                style={{
                  left: "25%",
                  width: "50%",
                }}
              />

              <div
                className="absolute top-2 h-15 w-1 bg-purple-600 dark:bg-purple-400"
                style={{
                  left: "50%",
                }}
              />

              <div
                className="absolute top-8 h-2 w-10 bg-slate-400 dark:bg-slate-500"
                style={{
                  left: "5%",
                }}
              />

              <div
                className="absolute top-8 h-2 w-10 bg-slate-400 dark:bg-slate-500"
                style={{
                  right: "5%",
                }}
              />
            </div>

            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              <div>
                <p className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                  Min
                </p>
                <p className="font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
                  {(stats.minimum ?? 0).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                  Q1
                </p>
                <p className="font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
                  {(stats.q1 ?? 0).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                  Median
                </p>
                <p className="font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
                  {(stats.median ?? 0).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                  Q3
                </p>
                <p className="font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
                  {(stats.q3 ?? 0).toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                  Max
                </p>
                <p className="font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
                  {(stats.maximum ?? 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl">
        <div className="mb-5 flex items-center gap-2">
          <Brain
            size={18}
            className="text-emerald-600 dark:text-emerald-400"
          />

          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            AI Distribution Insights
          </h3>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 p-5 border border-slate-200 dark:border-slate-800">
            <h4 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              Statistical Summary
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                <span>Mean</span>
                <strong className="text-slate-900 dark:text-white font-mono">
                  {(stats.mean ?? 0).toFixed(3)}
                </strong>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                <span>Median</span>
                <strong className="text-slate-900 dark:text-white font-mono">
                  {(stats.median ?? 0).toFixed(3)}
                </strong>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                <span>Std. Deviation</span>
                <strong className="text-slate-900 dark:text-white font-mono">
                  {(stats.standard_deviation ?? 0).toFixed(3)}
                </strong>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                <span>Variance</span>
                <strong className="text-slate-900 dark:text-white font-mono">
                  {(stats.variance ?? 0).toFixed(3)}
                </strong>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400 font-medium">
                <span>Outliers</span>
                <strong className="text-slate-900 dark:text-white font-mono">
                  {stats.outliers?.count ?? 0}
                </strong>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 p-5 border border-emerald-200/80 dark:border-emerald-900/50">
            <h4 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
              AI Recommendation
            </h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  Distribution
                </span>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    stats.normal_distribution
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                      : "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300"
                  }`}
                >
                  {stats.normal_distribution ? "Normal" : "Non-Normal"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  Skewness
                </span>

                <strong className="text-slate-900 dark:text-white font-mono">
                  {(stats.skewness ?? 0).toFixed(3)}
                </strong>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  Kurtosis
                </span>

                <strong className="text-slate-900 dark:text-white font-mono">
                  {(stats.kurtosis ?? 0).toFixed(3)}
                </strong>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">
                  ML Readiness
                </span>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    stats.normal_distribution && (stats.outliers?.count ?? 0) === 0
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                      : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {stats.normal_distribution && (stats.outliers?.count ?? 0) === 0
                    ? "Ready"
                    : "Needs Review"}
                </span>
              </div>

              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-slate-900 p-3.5">
                <p className="text-xs leading-relaxed font-medium text-slate-700 dark:text-slate-300">
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
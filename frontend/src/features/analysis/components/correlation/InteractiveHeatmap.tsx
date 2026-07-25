import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Filter,
  Search,
} from "lucide-react";

import SectionHeader from "../../../../components/ui/SectionHeader";

import type {
  CorrelationResponse,
  StrongCorrelation,
} from "../../types/analysis";

import CorrelationLegend from "./CorrelationLegend";
import ExportHeatmapButton from "./ExportHeatmapButton";
import HeatmapGrid from "./HeatmapGrid";

interface InteractiveHeatmapProps {
  correlation: CorrelationResponse;
}

export default function InteractiveHeatmap({
  correlation,
}: InteractiveHeatmapProps) {
  const [search, setSearch] = useState("");
  const [threshold, setThreshold] = useState(0.7);

  const safeStrongCorrelations = useMemo(() => {
    return Array.isArray(correlation?.strong_correlations)
      ? correlation.strong_correlations
      : [];
  }, [correlation]);

  const safeNumericColumns = useMemo(() => {
    return Array.isArray(correlation?.numeric_columns)
      ? correlation.numeric_columns
      : [];
  }, [correlation]);

  const strongCorrelations = useMemo(() => {
    return safeStrongCorrelations.filter((item) => {
      const col1 = item?.column_1 ?? "";
      const col2 = item?.column_2 ?? "";
      const matchesSearch =
        col1.toLowerCase().includes(search.toLowerCase()) ||
        col2.toLowerCase().includes(search.toLowerCase());

      return (
        matchesSearch &&
        Math.abs(item?.correlation ?? 0) >= threshold
      );
    });
  }, [safeStrongCorrelations, search, threshold]);

  const visibleCells = useMemo(() => {
    const cols = safeNumericColumns.length;
    return cols * cols;
  }, [safeNumericColumns]);

  const averageCorrelation = useMemo(() => {
    if (safeStrongCorrelations.length === 0) {
      return 0;
    }

    return (
      safeStrongCorrelations.reduce(
        (sum, item) =>
          sum + Math.abs(item?.correlation ?? 0),
        0
      ) / safeStrongCorrelations.length
    );
  }, [safeStrongCorrelations]);

  return (
    <div
      id="interactive-heatmap"
      className="space-y-6"
    >
      <SectionHeader
        icon={Activity}
        title="Interactive Correlation Explorer"
        subtitle="Professional AI powered correlation analysis"
      />

      {/* Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search columns..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <Filter
                size={18}
                className="text-blue-600"
              />

              <span className="text-sm font-medium">
                Threshold
              </span>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={threshold}
                onChange={(e) =>
                  setThreshold(
                    Number(e.target.value)
                  )
                }
                className="w-32"
              />

              <span className="font-bold text-blue-600">
                {threshold.toFixed(2)}
              </span>
            </div>

            <ExportHeatmapButton targetId="interactive-heatmap" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-lg">
          <p className="text-sm opacity-90">
            Numeric Columns
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {correlation?.total_numeric_columns ?? safeNumericColumns.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 p-5 text-white shadow-lg">
          <p className="text-sm opacity-90">
            Strong Correlations
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {strongCorrelations.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 p-5 text-white shadow-lg">
          <p className="text-sm opacity-90">
            Visible Cells
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {visibleCells}
          </h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 p-5 text-white shadow-lg">
          <p className="text-sm opacity-90">
            Average Strength
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {averageCorrelation.toFixed(2)}
          </h2>
        </div>
      </div>

      {/* Legend */}
      <CorrelationLegend />

      {/* Heatmap */}
      <HeatmapGrid
        correlation={correlation}
        search={search}
        threshold={threshold}
      />

      {/* AI Details */}
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3
              size={20}
              className="text-blue-600"
            />

            <h3 className="text-lg font-semibold">
              AI Correlation Summary
            </h3>
          </div>

          <div className="space-y-4 text-sm leading-7 text-slate-600">
            <p>
              Total Numeric Columns :
              <strong className="ml-2">
                {correlation?.total_numeric_columns ?? safeNumericColumns.length}
              </strong>
            </p>

            <p>
              Strong Correlations :
              <strong className="ml-2 text-green-600">
                {strongCorrelations.length}
              </strong>
            </p>

            <p>
              Average Correlation :
              <strong className="ml-2 text-blue-600">
                {averageCorrelation.toFixed(2)}
              </strong>
            </p>

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="font-medium text-blue-700">
                AI Recommendation
              </p>

              <p className="mt-2 text-slate-700">
                {strongCorrelations.length > 5
                  ? "Several strong relationships were detected. Review highly correlated variables to reduce multicollinearity before training machine learning models."
                  : "The dataset has a balanced correlation structure. Continue with feature engineering and model preparation."}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">
            Top Strong Correlations
          </h3>

          {strongCorrelations.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-6 text-center text-slate-500">
              No correlations above the selected threshold.
            </div>
          ) : (
            <div className="space-y-3">
              {strongCorrelations
                .slice(0, 6)
                .map(
                  (
                    item: StrongCorrelation,
                    index
                  ) => (
                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-300 hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-slate-800">
                            {item.column_1}
                            {"  ↔  "}
                            {item.column_2}
                          </h4>

                          <p className="mt-1 text-sm text-slate-500">
                            {item.interpretation}
                          </p>
                        </div>

                        <div
                          className={`rounded-lg px-3 py-2 text-sm font-bold ${
                            (item.correlation ?? 0) >= 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {(item.correlation ?? 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useMemo, useState } from "react";
import { Search, Filter, Activity, BarChart3 } from "lucide-react";

import type { CorrelationResponse, StrongCorrelation } from "../../types/analysis";
import CorrelationLegend from "./CorrelationLegend";
import ExportHeatmapButton from "./ExportHeatmapButton";
import HeatmapGrid from "./HeatmapGrid";
import SectionHeader from "../../../../components/ui/SectionHeader";

interface InteractiveHeatmapProps {
  correlation: CorrelationResponse;
}

export default function InteractiveHeatmap({
  correlation,
}: InteractiveHeatmapProps) {
  const [search, setSearch] = useState("");
  const [threshold, setThreshold] = useState(0.7);

  const safeNumericColumns = useMemo(
    () => correlation?.numeric_columns ?? [],
    [correlation]
  );
  const safeStrongCorrelations = useMemo(
    () => correlation?.strong_correlations ?? [],
    [correlation]
  );

  const strongCorrelations = useMemo(() => {
    return safeStrongCorrelations.filter(
      (item) => Math.abs(item?.correlation ?? 0) >= threshold
    );
  }, [safeStrongCorrelations, threshold]);

  const visibleCells = useMemo(() => {
    const cols = safeNumericColumns.filter((column) =>
      column.toLowerCase().includes(search.toLowerCase())
    );
    return cols.length * cols.length;
  }, [safeNumericColumns, search]);

  const averageCorrelation = useMemo(() => {
    if (safeStrongCorrelations.length === 0) return 0;
    return (
      safeStrongCorrelations.reduce(
        (sum, item) => sum + Math.abs(item?.correlation ?? 0),
        0
      ) / safeStrongCorrelations.length
    );
  }, [safeStrongCorrelations]);

  return (
    <div id="interactive-heatmap" className="space-y-6">
      <SectionHeader
        icon={Activity}
        title="Interactive Correlation Explorer"
        subtitle="Professional AI-powered correlation matrix and statistical analysis"
      />

      {/* Toolbar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
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
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 py-2.5 pl-11 pr-4 text-xs font-semibold outline-none transition focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Filter size={16} className="text-indigo-600 dark:text-indigo-400" />
              <span>Threshold</span>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-28 accent-indigo-600"
              />

              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                {threshold.toFixed(2)}
              </span>
            </div>

            <ExportHeatmapButton targetId="interactive-heatmap" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 p-5 text-white shadow-md space-y-1">
          <p className="text-xs font-extrabold uppercase tracking-wider opacity-90">Numeric Columns</p>
          <h2 className="text-3xl font-black tabular-nums">{correlation?.total_numeric_columns ?? safeNumericColumns.length}</h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white shadow-md space-y-1">
          <p className="text-xs font-extrabold uppercase tracking-wider opacity-90">Strong Correlations</p>
          <h2 className="text-3xl font-black tabular-nums">{strongCorrelations.length}</h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 p-5 text-white shadow-md space-y-1">
          <p className="text-xs font-extrabold uppercase tracking-wider opacity-90">Visible Cells</p>
          <h2 className="text-3xl font-black tabular-nums">{visibleCells}</h2>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 p-5 text-white shadow-md space-y-1">
          <p className="text-xs font-extrabold uppercase tracking-wider opacity-90">Average Strength</p>
          <h2 className="text-3xl font-black tabular-nums">{averageCorrelation.toFixed(2)}</h2>
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
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">AI Correlation Summary</h3>
          </div>

          <div className="space-y-3 text-xs font-medium text-slate-700 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Total Numeric Columns:</span>
              <strong className="text-slate-900 dark:text-white font-mono">{correlation?.total_numeric_columns ?? safeNumericColumns.length}</strong>
            </div>

            <div className="flex justify-between">
              <span>Strong Correlations:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{strongCorrelations.length}</strong>
            </div>

            <div className="flex justify-between">
              <span>Average Correlation:</span>
              <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{averageCorrelation.toFixed(2)}</strong>
            </div>

            <div className="rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/40 p-4 space-y-1">
              <p className="font-extrabold text-xs text-indigo-900 dark:text-indigo-300">AI Recommendation</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {strongCorrelations.length > 5
                  ? "Several strong relationships were detected. Review highly correlated variables to reduce multicollinearity before training machine learning models."
                  : "The dataset has a balanced correlation structure. Continue with feature engineering and model preparation."}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Top Strong Correlations</h3>

          {strongCorrelations.length === 0 ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-6 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
              No correlations above the selected threshold ({threshold.toFixed(2)}).
            </div>
          ) : (
            <div className="space-y-3">
              {strongCorrelations.slice(0, 6).map((item: StrongCorrelation, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-3.5 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                      {item.column_1} <span className="text-indigo-600 dark:text-indigo-400">↔</span> {item.column_2}
                    </h4>
                    <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {item.interpretation}
                    </p>
                  </div>

                  <div
                    className={`rounded-lg px-2.5 py-1 text-xs font-black font-mono ${
                      (item.correlation ?? 0) >= 0
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                        : "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300"
                    }`}
                  >
                    {(item.correlation ?? 0).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
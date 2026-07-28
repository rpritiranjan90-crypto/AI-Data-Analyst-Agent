import { CalendarClock } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import SectionHeader from "../../../../components/ui/SectionHeader";
import StatusBadge from "../../../../components/ui/StatusBadge";

import { useAnalysisData } from "../../context/AnalysisContext";

export default function TimeSeriesTab() {
  const { timeseries } = useAnalysisData();

  if (!timeseries) {
    return (
      <EmptyState
        icon={CalendarClock}
        title="Time Series Analysis Unavailable"
        description="Unable to analyse datetime columns."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={<CalendarClock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
        title="Time Series Analysis"
        subtitle="Datetime column detection and temporal analysis"
      />

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-4">
          <StatusBadge
            label={
              timeseries.has_datetime
                ? "Datetime Column Found"
                : "No Datetime Column"
            }
            variant={
              timeseries.has_datetime
                ? "success"
                : "warning"
            }
          />
        </div>

        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
          {timeseries.message}
        </p>
      </div>
    </div>
  );
}
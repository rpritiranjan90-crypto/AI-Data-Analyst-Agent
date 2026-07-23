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
        icon={CalendarClock}
        title="Time Series Analysis"
        subtitle="Datetime column detection"
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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

        <p className="text-slate-600">
          {timeseries.message}
        </p>
      </div>
    </div>
  );
}
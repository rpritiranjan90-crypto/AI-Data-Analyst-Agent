import { CalendarClock } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import LoadingCard from "../../../../components/ui/LoadingCard";
import SectionHeader from "../../../../components/ui/SectionHeader";
import StatusBadge from "../../../../components/ui/StatusBadge";

import { useTimeSeries } from "../../hooks";

export default function TimeSeriesTab() {
  const { data, isLoading, isError } = useTimeSeries();

  if (isLoading) {
    return <LoadingCard rows={2} />;
  }

  if (isError || !data) {
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
              data.has_datetime
                ? "Datetime Column Found"
                : "No Datetime Column"
            }
            variant={
              data.has_datetime
                ? "success"
                : "warning"
            }
          />
        </div>

        <p className="text-slate-600">
          {data.message}
        </p>
      </div>
    </div>
  );
}
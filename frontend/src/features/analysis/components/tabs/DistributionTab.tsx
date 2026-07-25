import { useMemo } from "react";
import { Activity } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import SectionHeader from "../../../../components/ui/SectionHeader";

import { useAnalysisData } from "../../context/AnalysisContext";

import DistributionCards from "../distribution/DistributionCards";
import DistributionSummary from "../distribution/DistributionSummary";
import OutlierSummary from "../distribution/OutlierSummary";

export default function DistributionTab() {
  const { distribution } = useAnalysisData();

  const columns = useMemo(() => {
    if (!distribution || typeof distribution !== "object") return [];
    return Object.entries(distribution).filter(
      ([col, val]) => col !== "message" && val && typeof val === "object"
    );
  }, [distribution]);

  if (columns.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="Distribution Analysis Unavailable"
        description="No numeric columns were found for distribution analysis in this dataset."
      />
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={Activity}
        title="Distribution Analysis"
        subtitle={`${columns.length} numeric column${
          columns.length === 1 ? "" : "s"
        } analysed`}
      />

      {/* Executive Summary */}
      <DistributionSummary distribution={distribution} />

      {/* Distribution Cards */}
      <DistributionCards distribution={distribution} />

      {/* Outlier Analysis */}
      <OutlierSummary distribution={distribution} />
    </div>
  );
}
import { useMemo } from "react";
import { Activity } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import SectionHeader from "../../../../components/ui/SectionHeader";

import { useAnalysisData } from "../../context/AnalysisContext";

import DistributionSummary from "../distribution/DistributionSummary";
import DistributionCards from "../distribution/DistributionCards";
import OutlierSummary from "../distribution/OutlierSummary";

export default function DistributionTab() {
  const { distribution } = useAnalysisData();

  const columns = useMemo(
    () => Object.entries(distribution),
    [distribution]
  );

  if (columns.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No Distribution Data"
        description="No numeric columns were found."
      />
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={Activity}
        title="Distribution Analysis"
        subtitle={`${columns.length} numeric columns analysed`}
      />

      <DistributionSummary
        distribution={distribution}
      />

      <DistributionCards
        distribution={distribution}
      />

      <OutlierSummary
        distribution={distribution}
      />
    </div>
  );
}
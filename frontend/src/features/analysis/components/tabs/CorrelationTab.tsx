import { Network } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import SectionHeader from "../../../../components/ui/SectionHeader";

import { useAnalysisData } from "../../context/AnalysisContext";
import type { CorrelationResponse } from "../../types/analysis";

import CorrelationSummary from "../correlation/CorrelationSummary";
import StrongCorrelationTable from "../correlation/StrongCorrelationTable";
import InteractiveHeatmap from "../correlation/InteractiveHeatmap";

export default function CorrelationTab() {
  const { correlation } = useAnalysisData();

  const columns = correlation?.numeric_columns ?? [];

  if (!correlation || columns.length === 0) {
    // Backend may return a message in the response body on error.
    const msg = (correlation as (CorrelationResponse & { message?: string }) | undefined)?.message;
    return (
      <EmptyState
        icon={<Network className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />}
        title="Correlation Analysis Unavailable"
        description={
          msg ||
          "No numeric columns are available in this dataset for correlation analysis."
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<Network className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
        title="Correlation Analysis"
        subtitle={`Method: ${
          correlation?.method?.toUpperCase() ?? "PEARSON"
        }`}
      />

      {/* Executive Summary */}
      <CorrelationSummary
        method={correlation?.method}
        totalNumericColumns={correlation?.total_numeric_columns}
        correlations={correlation?.strong_correlations}
      />

      {/* Interactive Explorer */}
      <InteractiveHeatmap correlation={correlation} />

      {/* Strong Correlations */}
      <StrongCorrelationTable
        correlations={correlation?.strong_correlations ?? []}
      />
    </div>
  );
}
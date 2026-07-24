import { Network } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import SectionHeader from "../../../../components/ui/SectionHeader";

import { useAnalysisData } from "../../context/AnalysisContext";

import CorrelationHeatmap from "../correlation/CorrelationHeatmap";
import CorrelationSummary from "../correlation/CorrelationSummary";
import StrongCorrelationTable from "../correlation/StrongCorrelationTable";

export default function CorrelationTab() {
  const { correlation } = useAnalysisData();

  const columns = correlation?.numeric_columns ?? [];

  if (columns.length === 0) {
    return (
      <EmptyState
        icon={<Network className="h-10 w-10" />}
        title="Correlation Analysis Unavailable"
        description="No numeric columns are available for correlation analysis."
      />
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={<Network className="h-6 w-6 text-indigo-600" />}
        title="Correlation Analysis"
        subtitle={`Method: ${correlation?.method?.toUpperCase() ?? "Unknown"}`}
      />

      {/* Executive Summary */}
      <CorrelationSummary
        method={correlation?.method ?? ""}
        totalNumericColumns={correlation?.total_numeric_columns ?? 0}
        correlations={correlation?.strong_correlations ?? []}
      />

      {/* Correlation Matrix */}
      <CorrelationHeatmap
        columns={columns}
        matrix={correlation?.correlation_matrix ?? {}}
      />

      {/* Strong Correlations */}
      <StrongCorrelationTable
        correlations={correlation?.strong_correlations ?? []}
      />
    </div>
  );
}
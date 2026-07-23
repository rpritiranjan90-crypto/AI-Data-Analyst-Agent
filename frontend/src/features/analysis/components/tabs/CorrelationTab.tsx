import { Network } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import SectionHeader from "../../../../components/ui/SectionHeader";

import { useAnalysisData } from "../../context/AnalysisContext";

import CorrelationSummary from "../correlation/CorrelationSummary";
import CorrelationHeatmap from "../correlation/CorrelationHeatmap";
import StrongCorrelationTable from "../correlation/StrongCorrelationTable";

export default function CorrelationTab() {
  const { correlation } = useAnalysisData();

  const columns = correlation.numeric_columns;

  if (columns.length === 0) {
    return (
      <EmptyState
        icon={Network}
        title="Correlation Analysis Unavailable"
        description="No numeric columns are available for correlation analysis."
      />
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={Network}
        title="Correlation Analysis"
        subtitle={`Method: ${correlation.method.toUpperCase()}`}
      />

      <CorrelationSummary
        method={correlation.method}
        totalNumericColumns={correlation.total_numeric_columns}
        correlations={correlation.strong_correlations}
      />

      <CorrelationHeatmap
        columns={correlation.numeric_columns}
        matrix={correlation.correlation_matrix}
      />

      <StrongCorrelationTable
        correlations={correlation.strong_correlations}
      />
    </div>
  );
}
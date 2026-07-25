import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import Button from "../../../components/ui/Button";
import LoadingCard from "../../../components/ui/LoadingCard";
import PageHeader from "../../../components/ui/PageHeader";
import ExecutiveEmptyStateBanner from "../../../components/ui/ExecutiveEmptyStateBanner";

import ErrorState from "../common/ErrorState";

import AIInsightsTab from "../components/tabs/AIInsightsTab";
import AnalysisTabs from "../components/tabs/AnalysisTabs";
import CategoricalTab from "../components/tabs/CategoricalTab";
import CorrelationTab from "../components/tabs/CorrelationTab";
import DistributionTab from "../components/tabs/DistributionTab";
import OverviewTab from "../components/tabs/OverviewTab";
import StatisticsTab from "../components/tabs/StatisticsTab";
import StrongCorrelationTab from "../components/tabs/StrongCorrelationTab";
import TimeSeriesTab from "../components/tabs/TimeSeriesTab";

import AIReport from "../components/report/AIReport";

import { AnalysisProvider } from "../context/AnalysisContext";
import { useAnalysisSummary } from "../hooks/useAnalysisSummary";
import { useDatasetStore } from "../../../store/datasetStore";

export type AnalysisTab =
  | "overview"
  | "statistics"
  | "correlation"
  | "strong-correlation"
  | "categorical"
  | "distribution"
  | "timeseries"
  | "insights"
  | "report";

export default function AnalysisPage() {
  const { dataset, setDataset } = useDatasetStore();
  const metadata = dataset?.metadata;

  const [activeTab, setActiveTab] = useState<AnalysisTab>("overview");

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useAnalysisSummary();

  function loadDemoDataset() {
    const mockDemo = {
      filename: "HR_Analytics_Demo.csv",
      filepath: "uploads/HR_Analytics_Demo.csv",
      extension: ".csv",
      rows: 1500,
      columns: 5,
      missing_values: 12,
      duplicate_rows: 3,
      memory_usage_mb: 0.12,
      file_size_bytes: 125000,
      column_names: ["employee_id", "age", "salary", "department", "churned"],
      columns_detail: [
        { name: "employee_id", type: "string" },
        { name: "age", type: "number" },
        { name: "salary", type: "number" },
        { name: "department", type: "string" },
        { name: "churned", type: "number" },
      ],
      head: [
        { employee_id: "EMP_001", age: 34, salary: 75000, department: "IT", churned: 0 },
        { employee_id: "EMP_002", age: 42, salary: 92000, department: "Sales", churned: 1 },
      ],
    };
    setDataset({ metadata: mockDemo, success: true, message: "Loaded demo" });
    toast.success("Loaded HR Analytics Demo dataset!");
  }

  if (!metadata) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Dataset Analysis"
          subtitle="Explore statistical summaries, correlations, distributions, categorical analysis, time series, AI insights, and AI-generated reports."
        />
        <ExecutiveEmptyStateBanner
          badgeText="Statistical & Intelligence Engine"
          title="Dataset Analysis Studio"
          subtitle="Comprehensive statistical profiling, correlation matrices, categorical distributions, and AI insights."
          actionText="Upload First Dataset"
          onLoadDemo={loadDemoDataset}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <LoadingCard
        cards={4}
        rows={8}
        showChart
      />
    );
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Unable to Load Analysis"
        description="We couldn't load your dataset analysis. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />;

      case "statistics":
        return <StatisticsTab />;

      case "correlation":
        return <CorrelationTab />;

      case "strong-correlation":
        return <StrongCorrelationTab />;

      case "categorical":
        return <CategoricalTab />;

      case "distribution":
        return <DistributionTab />;

      case "timeseries":
        return <TimeSeriesTab />;

      case "insights":
        return <AIInsightsTab />;

      case "report":
        return <AIReport />;

      default:
        return <OverviewTab />;
    }
  };

  return (
    <AnalysisProvider data={data}>
      <div className="space-y-6">
        <PageHeader
          title="Dataset Analysis"
          subtitle="Explore statistical summaries, correlations, distributions, categorical analysis, time series, AI insights, and AI-generated reports."
          action={
            <Button
              variant="secondary"
              onClick={() => refetch()}
            >
              <RefreshCcw
                size={16}
                className="mr-2"
              />
              Refresh
            </Button>
          }
        />

        <AnalysisTabs
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {renderTab()}
      </div>
    </AnalysisProvider>
  );
}
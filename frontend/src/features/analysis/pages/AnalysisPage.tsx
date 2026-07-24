import { useState } from "react";
import { RefreshCcw } from "lucide-react";

import Button from "../../../components/ui/Button";
import LoadingCard from "../../../components/ui/LoadingCard";
import PageHeader from "../../../components/ui/PageHeader";

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
  const [activeTab, setActiveTab] =
    useState<AnalysisTab>("overview");

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useAnalysisSummary();

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
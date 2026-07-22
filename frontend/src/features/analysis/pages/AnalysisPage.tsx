import { useState } from "react";

import PageHeader from "../../../components/ui/PageHeader";

import AIInsightsTab from "../components/tabs/AIInsightsTab";
import AnalysisTabs from "../components/tabs/AnalysisTabs";
import CategoricalTab from "../components/tabs/CategoricalTab";
import CorrelationTab from "../components/tabs/CorrelationTab";
import DistributionTab from "../components/tabs/DistributionTab";
import OverviewTab from "../components/tabs/OverviewTab";
import StatisticsTab from "../components/tabs/StatisticsTab";
import StrongCorrelationTab from "../components/tabs/StrongCorrelationTab";
import TimeSeriesTab from "../components/tabs/TimeSeriesTab";

export type AnalysisTab =
  | "overview"
  | "statistics"
  | "correlation"
  | "strong-correlation"
  | "categorical"
  | "distribution"
  | "timeseries"
  | "insights";

export default function AnalysisPage() {
  const [activeTab, setActiveTab] =
    useState<AnalysisTab>("overview");

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

      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dataset Analysis"
        subtitle="Explore statistical summaries, correlations, distributions, categorical analysis, time series, and AI-generated insights."
      />

      <AnalysisTabs
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {renderTab()}
    </div>
  );
}
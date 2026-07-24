import { BrainCircuit } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import SectionHeader from "../../../../components/ui/SectionHeader";

import { useAnalysisData } from "../../context/AnalysisContext";

import AIOverview from "../insights/AIOverview";
import InsightCards from "../insights/InsightCards";
import KeyFindings from "../insights/KeyFindings";
import RecommendationPanel from "../insights/RecommendationPanel";

export default function AIInsightsTab() {
  const { insights } = useAnalysisData();

  if (!insights || insights.length === 0) {
    return (
      <EmptyState
        icon={BrainCircuit}
        title="No AI Insights"
        description="No AI insights were generated for this dataset."
      />
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        icon={BrainCircuit}
        title="AI Analytics Assistant"
        subtitle={`${insights.length} AI-generated insights available`}
      />

      <AIOverview insights={insights} />

      <KeyFindings insights={insights} />

      <RecommendationPanel insights={insights} />

      <InsightCards insights={insights} />
    </div>
  );
}
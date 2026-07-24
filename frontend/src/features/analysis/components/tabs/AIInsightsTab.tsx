import { BrainCircuit } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import SectionHeader from "../../../../components/ui/SectionHeader";

import { useAnalysisData } from "../../context/AnalysisContext";
import { useAIAnalysis } from "../../hooks/useAIAnalysis";

import ExecutiveSummary from "../insights/ExecutiveSummary";
import DatasetScore from "../insights/DatasetScore";
import MLReadinessCard from "../insights/MLReadinessCard";
import KeyFindings from "../insights/KeyFindings";
import FeatureEngineering from "../insights/FeatureEngineering";
import ModelRecommendations from "../insights/ModelRecommendations";
import RecommendationPanel from "../insights/RecommendationPanel";
import InsightCards from "../insights/InsightCards";

export default function AIInsightsTab() {
  const { insights } = useAnalysisData();

  const ai = useAIAnalysis();

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
        subtitle="AI-powered dataset interpretation and machine learning guidance"
      />

      <ExecutiveSummary
  result={ai.executiveSummary}
/>

      <div className="grid gap-8 xl:grid-cols-2">
        <DatasetScore result={ai.datasetScore} />

        <MLReadinessCard
          result={ai.mlReadiness}
        />
      </div>

      <KeyFindings insights={insights} />

      <FeatureEngineering
  recommendations={ai.featureEngineering}
/>

      <ModelRecommendations
  models={ai.modelRecommendations}
/>

      <RecommendationPanel insights={insights} />

      <InsightCards insights={insights} />
    </div>
  );
}
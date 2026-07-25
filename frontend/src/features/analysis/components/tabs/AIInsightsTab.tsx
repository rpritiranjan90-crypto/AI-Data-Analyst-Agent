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
        icon={<BrainCircuit className="h-8 w-8" />}
        title="No AI Insights"
        description="No AI insights were generated for this dataset."
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 dark:from-slate-950 dark:to-slate-900/40 p-6 rounded-3xl border border-cyan-100/60 dark:border-cyan-950/40 space-y-8">
      <div className="flex items-center justify-between">
        <SectionHeader
          icon={<BrainCircuit className="h-6 w-6 text-cyan-600" />}
          title="AI Analytics Assistant"
          subtitle="AI-powered dataset interpretation, feature synthesis, and machine learning guidance"
        />

        <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs shrink-0">
          <span>●</span> AI ENGINE ACTIVE
        </div>
      </div>

      <div className="border-l-4 border-cyan-400 bg-white dark:bg-slate-900 rounded-r-2xl shadow-xs p-6">
        <ExecutiveSummary result={ai.executiveSummary} />
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <DatasetScore result={ai.datasetScore} />
        <MLReadinessCard result={ai.mlReadiness} />
      </div>

      <KeyFindings insights={insights} />

      <FeatureEngineering recommendations={ai.featureEngineering} />

      <ModelRecommendations models={ai.modelRecommendations} />

      <RecommendationPanel insights={insights} />

      <InsightCards insights={insights} />
    </div>
  );
}
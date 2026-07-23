import { BrainCircuit } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import SectionHeader from "../../../../components/ui/SectionHeader";

import { useAnalysisData } from "../../context/AnalysisContext";

export default function AIInsightsTab() {
  const { insights } = useAnalysisData();

  if (!insights || insights.length === 0) {
    return (
      <EmptyState
        icon={BrainCircuit}
        title="No Insights"
        description="No AI insights were generated."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={BrainCircuit}
        title="AI Insights"
        subtitle={`${insights.length} insights generated`}
      />

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex gap-3">
              <BrainCircuit
                size={20}
                className="mt-1 flex-shrink-0 text-blue-600"
              />

              <p className="leading-7 text-slate-700">
                {insight}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
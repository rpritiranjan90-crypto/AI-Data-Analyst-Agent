import { BrainCircuit } from "lucide-react";

import EmptyState from "../../../../components/ui/EmptyState";
import LoadingCard from "../../../../components/ui/LoadingCard";
import SectionHeader from "../../../../components/ui/SectionHeader";

import { useAnalysisInsights } from "../../hooks";

export default function AIInsightsTab() {
  const { data, isLoading, isError } =
    useAnalysisInsights();

  if (isLoading) {
    return <LoadingCard rows={5} />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        icon={BrainCircuit}
        title="AI Insights Unavailable"
        description="Unable to generate AI insights."
      />
    );
  }

  if (data.length === 0) {
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
        subtitle={`${data.length} insights generated`}
      />

      <div className="space-y-4">
        {data.map((insight, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex gap-3">
              <div className="mt-1">
                <BrainCircuit
                  size={20}
                  className="text-blue-600"
                />
              </div>

              <p className="text-slate-700">
                {insight}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
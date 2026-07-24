import {
  BrainCircuit,
  CheckCircle2,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import MetricCard from "../../../../components/ui/MetricCard";

interface AIOverviewProps {
  insights: string[];
}

export default function AIOverview({
  insights,
}: AIOverviewProps) {
  const totalInsights = insights.length;

  const highPriority = insights.filter((insight) => {
    const text = insight.toLowerCase();

    return (
      text.includes("outlier") ||
      text.includes("missing") ||
      text.includes("duplicate") ||
      text.includes("error")
    );
  }).length;

  const recommendations = insights.filter((insight) => {
    const text = insight.toLowerCase();

    return (
      text.includes("recommend") ||
      text.includes("should") ||
      text.includes("consider") ||
      text.includes("suggest")
    );
  }).length;

  const readiness =
    totalInsights === 0
      ? 100
      : Math.max(60, 100 - highPriority * 10);

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        title="AI Insights"
        value={totalInsights}
        subtitle="Generated"
        icon={BrainCircuit}
        color="blue"
      />

      <MetricCard
        title="Recommendations"
        value={recommendations}
        subtitle="Action Items"
        icon={Lightbulb}
        color="orange"
      />

      <MetricCard
        title="Critical Findings"
        value={highPriority}
        subtitle="Need Attention"
        icon={Sparkles}
        color={highPriority > 0 ? "red" : "green"}
      />

      <MetricCard
        title="ML Readiness"
        value={`${readiness}%`}
        subtitle="Estimated Score"
        icon={CheckCircle2}
        color={readiness >= 85 ? "green" : "orange"}
      />
    </div>
  );
}
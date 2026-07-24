import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import type { AIInsights as AIInsightsType } from "../../engine/insights/types";

interface Props {
  insights: AIInsightsType;
}

export default function AIInsights({
  insights,
}: Props) {
  const healthColor =
    insights.overallHealth === "Excellent"
      ? "text-green-600"
      : insights.overallHealth === "Good"
      ? "text-blue-600"
      : insights.overallHealth === "Average"
      ? "text-yellow-600"
      : "text-red-600";

  const complexityColor =
    insights.trainingComplexity === "Low"
      ? "text-green-600"
      : insights.trainingComplexity === "Medium"
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Activity className="h-7 w-7 text-indigo-600" />

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            AI Insights
          </h2>

          <p className="text-sm text-slate-500">
            Executive intelligence generated from your dataset
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <InsightCard
          icon={<CheckCircle2 className="h-6 w-6 text-green-600" />}
          title="Overall Health"
          value={insights.overallHealth}
          valueClass={healthColor}
        />

        <InsightCard
          icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
          title="Strongest Area"
          value={insights.strongestArea}
        />

        <InsightCard
          icon={<AlertTriangle className="h-6 w-6 text-amber-600" />}
          title="Weakest Area"
          value={insights.weakestArea}
        />

        <InsightCard
          icon={<Target className="h-6 w-6 text-purple-600" />}
          title="Next Action"
          value={insights.nextAction}
        />

        <InsightCard
          icon={<TrendingUp className="h-6 w-6 text-indigo-600" />}
          title="Estimated Success"
          value={`${insights.estimatedSuccess}%`}
        />

        <InsightCard
          icon={<Zap className="h-6 w-6 text-orange-600" />}
          title="Training Complexity"
          value={insights.trainingComplexity}
          valueClass={complexityColor}
        />
      </div>
    </div>
  );
}

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  valueClass?: string;
}

function InsightCard({
  icon,
  title,
  value,
  valueClass = "text-slate-900",
}: InsightCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-3">{icon}</div>

      <h3 className="mb-2 text-sm font-semibold text-slate-500">
        {title}
      </h3>

      <p className={`text-lg font-bold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}
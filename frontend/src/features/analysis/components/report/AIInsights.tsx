import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

import Badge from "../../../../components/ui/Badge";
import Card from "../../../../components/ui/Card";

import type { AIInsights as AIInsightsType } from "../../engine/insights/types";

interface Props {
  insights: AIInsightsType;
}

export default function AIInsights({
  insights,
}: Props) {
  const healthColor =
    insights.overallHealth === "Excellent"
      ? "text-emerald-600"
      : insights.overallHealth === "Good"
      ? "text-blue-600"
      : insights.overallHealth === "Average"
      ? "text-amber-600"
      : "text-red-600";

  const complexityColor =
    insights.trainingComplexity === "Low"
      ? "text-emerald-600"
      : insights.trainingComplexity === "Medium"
      ? "text-amber-600"
      : "text-red-600";

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-slate-50 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-indigo-100 p-4">
              <Activity className="h-8 w-8 text-indigo-600" />
            </div>

            <div>
              <div className="mb-2">
                <Badge color="purple">
                  <span className="flex items-center gap-1">
                    <Sparkles size={14} />
                    AI Intelligence
                  </span>
                </Badge>
              </div>

              <h2 className="text-2xl font-bold text-slate-900">
                AI Insights
              </h2>

              <p className="mt-2 max-w-3xl text-slate-600">
                Executive intelligence generated from statistical,
                correlation, distribution, and machine learning
                readiness analysis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-3">
        <InsightCard
          icon={
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          }
          title="Overall Health"
          value={insights.overallHealth}
          valueClass={healthColor}
        />

        <InsightCard
          icon={
            <TrendingUp className="h-6 w-6 text-blue-600" />
          }
          title="Strongest Area"
          value={insights.strongestArea}
        />

        <InsightCard
          icon={
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          }
          title="Weakest Area"
          value={insights.weakestArea}
        />

        <InsightCard
          icon={
            <Target className="h-6 w-6 text-purple-600" />
          }
          title="Recommended Next Action"
          value={insights.nextAction}
        />

        <InsightCard
          icon={
            <TrendingUp className="h-6 w-6 text-indigo-600" />
          }
          title="Estimated Success"
          value={`${insights.estimatedSuccess}%`}
        />

        <InsightCard
          icon={
            <Zap className="h-6 w-6 text-orange-600" />
          }
          title="Training Complexity"
          value={insights.trainingComplexity}
          valueClass={complexityColor}
        />
      </div>
    </Card>
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
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-200
        hover:shadow-lg
      "
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
        {icon}
      </div>

      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>

      <p className={`mt-3 text-xl font-bold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}
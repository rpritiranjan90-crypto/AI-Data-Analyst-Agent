import {
  BrainCircuit,
  CheckCircle2,
  Info,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

interface InsightCardsProps {
  insights: string[];
}

function getCategory(insight: string) {
  const text = insight.toLowerCase();

  if (
    text.includes("recommend") ||
    text.includes("should") ||
    text.includes("consider") ||
    text.includes("suggest")
  ) {
    return {
      label: "Recommendation",
      icon: Lightbulb,
      badge: "bg-amber-100 text-amber-700",
      color: "text-amber-600",
    };
  }

  if (
    text.includes("missing") ||
    text.includes("duplicate") ||
    text.includes("outlier")
  ) {
    return {
      label: "Data Quality",
      icon: CheckCircle2,
      badge: "bg-red-100 text-red-700",
      color: "text-red-600",
    };
  }

  if (
    text.includes("correlation") ||
    text.includes("distribution") ||
    text.includes("skew")
  ) {
    return {
      label: "Statistical Insight",
      icon: Sparkles,
      badge: "bg-violet-100 text-violet-700",
      color: "text-violet-600",
    };
  }

  return {
    label: "General Insight",
    icon: Info,
    badge: "bg-blue-100 text-blue-700",
    color: "text-blue-600",
  };
}

export default function InsightCards({
  insights,
}: InsightCardsProps) {
  return (
    <div className="grid gap-6">
      {insights.map((insight, index) => {
        const category = getCategory(insight);
        const Icon = category.icon;

        return (
          <Card
            key={index}
            className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-1 gap-4">
                <div className="rounded-xl bg-blue-50 p-3">
                  <BrainCircuit
                    className="text-blue-600"
                    size={22}
                  />
                </div>

                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${category.badge}`}
                    >
                      {category.label}
                    </span>

                    <div
                      className={`flex items-center gap-1 text-sm ${category.color}`}
                    >
                      <Icon size={16} />
                      <span>AI Analysis</span>
                    </div>
                  </div>

                  <p className="leading-7 text-slate-700">
                    {insight}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
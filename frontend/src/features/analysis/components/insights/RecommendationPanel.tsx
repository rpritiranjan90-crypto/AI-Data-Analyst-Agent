import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

interface RecommendationPanelProps {
  insights: string[];
}

interface Recommendation {
  text: string;
  priority: "High" | "Medium" | "Low";
}

export default function RecommendationPanel({
  insights,
}: RecommendationPanelProps) {
  const recommendations: Recommendation[] = insights
    .filter((insight) => {
      const text = insight.toLowerCase();

      return (
        text.includes("recommend") ||
        text.includes("should") ||
        text.includes("consider") ||
        text.includes("suggest")
      );
    })
    .map((text) => {
      const lower = text.toLowerCase();

      let priority: Recommendation["priority"] = "Low";

      if (
        lower.includes("missing") ||
        lower.includes("duplicate") ||
        lower.includes("outlier") ||
        lower.includes("error")
      ) {
        priority = "High";
      } else if (
        lower.includes("correlation") ||
        lower.includes("transform") ||
        lower.includes("encode") ||
        lower.includes("scale")
      ) {
        priority = "Medium";
      }

      return {
        text,
        priority,
      };
    });

  const priorityConfig = {
    High: {
      icon: AlertCircle,
      color: "text-red-600",
      badge: "bg-red-100 text-red-700",
    },
    Medium: {
      icon: AlertTriangle,
      color: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
    },
    Low: {
      icon: CheckCircle2,
      color: "text-green-600",
      badge: "bg-green-100 text-green-700",
    },
  };

  return (
    <Card>
      <div className="flex items-center gap-3">
        <Lightbulb
          size={24}
          className="text-amber-500"
        />

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Recommended Actions
          </h2>

          <p className="text-sm text-slate-500">
            AI-generated suggestions based on the analysis.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {recommendations.length === 0 ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center">
            <CheckCircle2
              className="mx-auto mb-3 text-green-600"
              size={30}
            />

            <h3 className="font-semibold text-slate-900">
              No Immediate Action Required
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              The AI assistant did not detect any explicit
              recommendations from the current dataset.
            </p>
          </div>
        ) : (
          recommendations.map((recommendation, index) => {
            const config =
              priorityConfig[recommendation.priority];

            const Icon = config.icon;

            return (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <Icon
                      size={20}
                      className={`${config.color} mt-1 flex-shrink-0`}
                    />

                    <p className="leading-7 text-slate-700">
                      {recommendation.text}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${config.badge}`}
                  >
                    {recommendation.priority}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
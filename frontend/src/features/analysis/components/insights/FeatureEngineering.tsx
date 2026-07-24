import {
  ArrowRight,
  CheckCircle2,
  Settings2,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

interface FeatureEngineeringProps {
  insights: string[];
}

interface Recommendation {
  feature: string;
  action: string;
  priority: "High" | "Medium" | "Low";
}

export default function FeatureEngineering({
  insights,
}: FeatureEngineeringProps) {
  const recommendations: Recommendation[] = [];

  const text = insights.join(" ").toLowerCase();

  if (text.includes("missing")) {
    recommendations.push({
      feature: "Missing Values",
      action: "Impute or remove missing records.",
      priority: "High",
    });
  }

  if (text.includes("outlier")) {
    recommendations.push({
      feature: "Outliers",
      action: "Review or cap extreme values.",
      priority: "High",
    });
  }

  if (text.includes("categorical")) {
    recommendations.push({
      feature: "Categorical Features",
      action: "Apply One-Hot Encoding.",
      priority: "Medium",
    });
  }

  if (text.includes("skew")) {
    recommendations.push({
      feature: "Skewed Features",
      action: "Apply Log / Yeo-Johnson Transformation.",
      priority: "Medium",
    });
  }

  if (text.includes("scale")) {
    recommendations.push({
      feature: "Numeric Features",
      action: "Standardize before training.",
      priority: "Low",
    });
  }

  return (
    <Card>
      <div className="flex items-center gap-3">
        <Settings2
          size={26}
          className="text-indigo-600"
        />

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Feature Engineering Advisor
          </h2>

          <p className="text-sm text-slate-500">
            AI preprocessing recommendations
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {recommendations.length === 0 ? (
          <div className="rounded-xl bg-green-50 p-6 text-center">
            <CheckCircle2
              className="mx-auto mb-3 text-green-600"
              size={30}
            />

            <h3 className="font-semibold">
              No preprocessing required
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              The AI assistant did not identify any
              significant preprocessing requirements.
            </p>
          </div>
        ) : (
          recommendations.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-5"
            >
              <div>
                <h4 className="font-semibold text-slate-900">
                  {item.feature}
                </h4>

                <p className="mt-2 text-sm text-slate-600">
                  {item.action}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    item.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : item.priority === "Medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.priority}
                </span>

                <ArrowRight
                  className="text-slate-400"
                  size={18}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
import {
  BrainCircuit,
  CheckCircle2,
  Star,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

interface ModelRecommendationsProps {
  insights: string[];
}

interface ModelRecommendation {
  name: string;
  rating: number;
  reason: string;
}

export default function ModelRecommendations({
  insights,
}: ModelRecommendationsProps) {
  const text = insights.join(" ").toLowerCase();

  const models: ModelRecommendation[] = [
    {
      name: "Random Forest",
      rating: 5,
      reason:
        "Excellent baseline model for structured datasets and robust to outliers.",
    },
    {
      name: "XGBoost",
      rating: 5,
      reason:
        "High predictive performance on tabular data.",
    },
    {
      name: "CatBoost",
      rating: text.includes("categorical") ? 5 : 4,
      reason:
        "Very effective when categorical features are present.",
    },
    {
      name: "LightGBM",
      rating: 4,
      reason:
        "Fast training with strong performance on large datasets.",
    },
    {
      name: "Logistic Regression",
      rating: text.includes("skew") ? 3 : 4,
      reason:
        "Good interpretable baseline after preprocessing.",
    },
  ];

  return (
    <Card>
      <div className="flex items-center gap-3">
        <BrainCircuit
          size={26}
          className="text-indigo-600"
        />

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Model Recommendations
          </h2>

          <p className="text-sm text-slate-500">
            Suggested machine learning algorithms
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {models.map((model) => (
          <div
            key={model.name}
            className="rounded-xl border border-slate-200 bg-slate-50 p-5"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {model.name}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {model.reason}
                </p>
              </div>

              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className={
                      index < model.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-300"
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2
            className="mt-1 text-blue-600"
            size={20}
          />

          <p className="text-sm leading-7 text-slate-700">
            These recommendations are based on the current statistical analysis.
            As we continue developing the platform, this section will become
            fully data-driven using correlation, distribution, categorical,
            and data quality metrics instead of keyword matching.
          </p>
        </div>
      </div>
    </Card>
  );
}
import {
  CheckCircle2,
  Wrench,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import type { FeatureCard } from "../../engine/featureCards/types";

interface Props {
  cards: FeatureCard[];
}

export default function FeatureEngineeringCards({
  cards,
}: Props) {
  const priorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  const impactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-indigo-100 text-indigo-700";
      case "Medium":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <Wrench className="h-7 w-7 text-blue-600" />

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Feature Engineering Recommendations
          </h2>

          <p className="text-sm text-slate-500">
            AI-generated preprocessing suggestions
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-200 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <TrendingUp className="h-6 w-6 text-indigo-600" />

              {card.recommended ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
            </div>

            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              {card.title}
            </h3>

            <p className="mb-4 text-sm leading-6 text-slate-600">
              {card.description}
            </p>

            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityColor(
                  card.priority
                )}`}
              >
                Priority: {card.priority}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${impactColor(
                  card.impact
                )}`}
              >
                Impact: {card.impact}
              </span>
            </div>

            <div className="mt-5 border-t pt-4">
              <span
                className={`text-sm font-semibold ${
                  card.recommended
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {card.recommended
                  ? "✔ Recommended"
                  : "⚠ Optional"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import {
  BrainCircuit,
  CheckCircle2,
  Star,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

import type {
  RecommendedModel,
} from "../../engine/modelRecommendation";

interface ModelRecommendationsProps {
  models: RecommendedModel[];
}

export default function ModelRecommendations({
  models,
}: ModelRecommendationsProps) {
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
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {model.name}
                  </h3>

                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    {model.category}
                  </span>
                </div>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {model.reason}
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">
                  {model.score}
                </div>

                <div className="mt-2 flex justify-end gap-1">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const rating =
                      Math.max(
                        1,
                        Math.min(
                          5,
                          Math.round(model.score / 20)
                        )
                      );

                    return (
                      <Star
                        key={index}
                        size={18}
                        className={
                          index < rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300"
                        }
                      />
                    );
                  })}
                </div>
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
            Model recommendations are generated automatically using
            dataset quality, machine learning readiness, missing values,
            and correlation analysis.
          </p>
        </div>
      </div>
    </Card>
  );
}
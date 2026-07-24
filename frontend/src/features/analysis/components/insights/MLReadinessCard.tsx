import {
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

interface MLReadinessCardProps {
  score: number;
}

export default function MLReadinessCard({
  score,
}: MLReadinessCardProps) {
  const status =
    score >= 90
      ? "Ready"
      : score >= 80
      ? "Nearly Ready"
      : score >= 70
      ? "Needs Preparation"
      : "Not Ready";

  const confidence =
    score >= 90
      ? "High"
      : score >= 80
      ? "Medium"
      : "Low";

  const progressColor =
    score >= 90
      ? "bg-green-500"
      : score >= 80
      ? "bg-blue-500"
      : score >= 70
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <Card>
      <div className="flex items-center gap-3">
        <BrainCircuit
          className="text-violet-600"
          size={28}
        />

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Machine Learning Readiness
          </h2>

          <p className="text-sm text-slate-500">
            AI evaluation of dataset readiness
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-slate-700">
              Readiness Score
            </span>

            <span className="text-lg font-bold">
              {score}%
            </span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{
                width: `${score}%`,
              }}
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-xl bg-green-50 p-5">
            <div className="flex items-center gap-2">
              <CheckCircle2
                className="text-green-600"
                size={20}
              />

              <span className="font-semibold">
                Status
              </span>
            </div>

            <p className="mt-4 text-2xl font-bold text-slate-900">
              {status}
            </p>
          </div>

          <div className="rounded-xl bg-blue-50 p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck
                className="text-blue-600"
                size={20}
              />

              <span className="font-semibold">
                Confidence
              </span>
            </div>

            <p className="mt-4 text-2xl font-bold text-slate-900">
              {confidence}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-violet-200 bg-violet-50 p-5">
          <h3 className="font-semibold text-slate-900">
            AI Assessment
          </h3>

          <p className="mt-3 leading-7 text-slate-700">
            {score >= 90
              ? "The dataset is well prepared for machine learning. Only minor validation is recommended before model training."
              : score >= 80
              ? "The dataset is suitable for machine learning after a few preprocessing steps such as handling missing values or encoding categorical features."
              : score >= 70
              ? "Additional preprocessing is recommended before training machine learning models."
              : "Significant data preparation is recommended before using this dataset for predictive modeling."}
          </p>
        </div>
      </div>
    </Card>
  );
}
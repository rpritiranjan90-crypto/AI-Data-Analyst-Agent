import {
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

import type { MLReadinessResult } from "../../engine/mlReadiness";

interface MLReadinessCardProps {
  result: MLReadinessResult;
}

export default function MLReadinessCard({
  result,
}: MLReadinessCardProps) {
  const {
    score,
    status,
    confidence,
    strengths,
    improvements,
  } = result;

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
              {confidence}%
            </p>
          </div>
        </div>

        {strengths.length > 0 && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <h3 className="font-semibold text-green-800">
              Strengths
            </h3>

            <ul className="mt-3 space-y-2">
              {strengths.map((item, index) => (
                <li
                  key={index}
                  className="text-sm text-green-700"
                >
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {improvements.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="font-semibold text-amber-800">
              Recommended Improvements
            </h3>

            <ul className="mt-3 space-y-2">
              {improvements.map((item, index) => (
                <li
                  key={index}
                  className="text-sm text-amber-700"
                >
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
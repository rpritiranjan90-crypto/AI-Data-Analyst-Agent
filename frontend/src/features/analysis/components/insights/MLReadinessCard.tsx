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
      ? "bg-emerald-500"
      : score >= 80
      ? "bg-indigo-500"
      : score >= 70
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-purple-50 dark:bg-purple-950/60 p-3 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40">
          <BrainCircuit size={24} />
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Machine Learning Readiness
          </h2>

          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            AI evaluation of dataset readiness for predictive modeling
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-extrabold">
            <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Readiness Score
            </span>

            <span className="text-slate-900 dark:text-white font-mono text-sm">
              {score}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{
                width: `${score}%`,
              }}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 p-4">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 size={18} />
              <span className="text-xs font-extrabold uppercase tracking-wider">
                Status
              </span>
            </div>

            <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white">
              {status}
            </p>
          </div>

          <div className="rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/50 p-4">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
              <ShieldCheck size={18} />
              <span className="text-xs font-extrabold uppercase tracking-wider">
                Confidence
              </span>
            </div>

            <p className="mt-3 text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {confidence}%
            </p>
          </div>
        </div>

        {strengths.length > 0 && (
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/70 dark:bg-emerald-950/40 p-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Strengths
            </h3>

            <ul className="mt-2 space-y-1.5">
              {strengths.map((item, index) => (
                <li
                  key={index}
                  className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-start gap-2"
                >
                  <span className="text-emerald-500">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {improvements.length > 0 && (
          <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/70 dark:bg-amber-950/40 p-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Recommended Improvements
            </h3>

            <ul className="mt-2 space-y-1.5">
              {improvements.map((item, index) => (
                <li
                  key={index}
                  className="text-xs font-medium text-amber-700 dark:text-amber-400 flex items-start gap-2"
                >
                  <span className="text-amber-500">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}
import {
  Award,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

import type { DatasetScoreResult } from "../../engine/scoring";

interface DatasetScoreProps {
  result: DatasetScoreResult;
}

export default function DatasetScore({
  result,
}: DatasetScoreProps) {
  const {
    score,
    grade,
    status,
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
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/60 p-3 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/40">
          <Award size={24} />
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Dataset Score
          </h2>

          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            AI quality assessment & statistical grade
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 p-6 text-center">
          <div className="text-6xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
            {grade}
          </div>

          <div className="mt-2 text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
            {score}/100
          </div>

          <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {status}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-xs font-extrabold">
              <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Overall Quality
              </span>

              <span className="text-slate-900 dark:text-white font-mono">
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
            <div className="flex items-start gap-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/50 p-4">
              <ShieldCheck
                className="mt-0.5 text-indigo-600 dark:text-indigo-400 shrink-0"
                size={20}
              />

              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                  Reliability
                </h4>

                <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  Dataset quality is suitable for analytical workflows.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 p-4">
              <TrendingUp
                className="mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0"
                size={20}
              />

              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                  AI Assessment
                </h4>

                <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                  Generated using statistical characteristics and AI insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
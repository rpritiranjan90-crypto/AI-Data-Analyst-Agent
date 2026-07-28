import {
  BrainCircuit,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

import type { ExecutiveSummaryResult } from "../../engine/executiveSummary";

interface ExecutiveSummaryProps {
  result: ExecutiveSummaryResult;
}

export default function ExecutiveSummary({
  result,
}: ExecutiveSummaryProps) {
  const {
    assessment,
    score,
    summary,
  } = result;

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 p-3 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
          <BrainCircuit size={24} />
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Executive Summary
          </h2>

          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            AI-generated overview of dataset quality & machine learning readiness
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-900/50 p-5 space-y-2">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
            <Sparkles size={18} />
            <span className="text-xs font-extrabold uppercase tracking-wider">
              Overall Assessment
            </span>
          </div>

          <h3 className="text-3xl font-black text-slate-900 dark:text-white">
            {assessment}
          </h3>

          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
            Dataset quality based on statistical AI analysis.
          </p>
        </div>

        <div className="rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/50 p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 size={18} />
            <span className="text-xs font-extrabold uppercase tracking-wider">
              AI Readiness Score
            </span>
          </div>

          <h3 className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
            {score}%
          </h3>

          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
            Estimated readiness for automated machine learning.
          </p>
        </div>

        <div className="rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-900/50 p-5 space-y-2">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <BrainCircuit size={18} />
            <span className="text-xs font-extrabold uppercase tracking-wider">
              AI Summary
            </span>
          </div>

          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
            {summary}
          </p>
        </div>
      </div>
    </Card>
  );
}
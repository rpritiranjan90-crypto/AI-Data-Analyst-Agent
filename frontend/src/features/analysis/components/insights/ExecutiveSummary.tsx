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
    <Card>
      <div className="flex items-center gap-3">
        <BrainCircuit
          className="text-blue-600"
          size={28}
        />

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Executive Summary
          </h2>

          <p className="text-sm text-slate-500">
            AI-generated overview of the dataset.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-blue-50 p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-blue-600" />

            <span className="font-semibold">
              Overall Assessment
            </span>
          </div>

          <h3 className="mt-5 text-3xl font-bold text-slate-900">
            {assessment}
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            Dataset quality based on AI analysis.
          </p>
        </div>

        <div className="rounded-2xl bg-green-50 p-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600" />

            <span className="font-semibold">
              AI Readiness Score
            </span>
          </div>

          <h3 className="mt-5 text-3xl font-bold text-slate-900">
            {score}%
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            Estimated readiness for machine learning.
          </p>
        </div>

        <div className="rounded-2xl bg-violet-50 p-6">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-violet-600" />

            <span className="font-semibold">
              AI Summary
            </span>
          </div>

          <p className="mt-5 leading-7 text-slate-700">
            {summary}
          </p>
        </div>
      </div>
    </Card>
  );
}
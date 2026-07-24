import {
  BrainCircuit,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

interface ExecutiveSummaryProps {
  insights: string[];
}

export default function ExecutiveSummary({
  insights,
}: ExecutiveSummaryProps) {
  const text = insights.join(" ").toLowerCase();

  const hasMissing = text.includes("missing");
  const hasOutliers = text.includes("outlier");
  const hasDuplicates = text.includes("duplicate");
  const hasCorrelation = text.includes("correlation");
  const hasRecommendation =
    text.includes("recommend") ||
    text.includes("should") ||
    text.includes("consider");

  const issues = [
    hasMissing,
    hasOutliers,
    hasDuplicates,
  ].filter(Boolean).length;

  const score = Math.max(60, 100 - issues * 10);

  const assessment =
    score >= 90
      ? "Excellent"
      : score >= 80
      ? "Good"
      : score >= 70
      ? "Fair"
      : "Needs Attention";

  const summary = [
    hasCorrelation &&
      "Strong relationships were detected between several variables.",
    hasMissing &&
      "Missing values should be handled before model training.",
    hasOutliers &&
      "Outliers may influence model performance and should be reviewed.",
    hasDuplicates &&
      "Duplicate records should be removed.",
    hasRecommendation &&
      "The AI assistant generated preprocessing recommendations.",
  ]
    .filter(Boolean)
    .join(" ");

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
            {summary ||
              "The AI assistant did not detect any significant issues in the current dataset."}
          </p>
        </div>
      </div>
    </Card>
  );
}
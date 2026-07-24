import {
  Award,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

interface DatasetScoreProps {
  score: number;
}

export default function DatasetScore({
  score,
}: DatasetScoreProps) {
  const grade =
    score >= 95
      ? "A+"
      : score >= 90
      ? "A"
      : score >= 80
      ? "B"
      : score >= 70
      ? "C"
      : "D";

  const status =
    score >= 95
      ? "Excellent"
      : score >= 90
      ? "Very Good"
      : score >= 80
      ? "Good"
      : score >= 70
      ? "Fair"
      : "Needs Improvement";

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
        <Award
          size={28}
          className="text-yellow-500"
        />

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Dataset Score
          </h2>

          <p className="text-sm text-slate-500">
            AI quality assessment
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-8">
          <div className="text-6xl font-extrabold text-blue-600">
            {grade}
          </div>

          <div className="mt-3 text-lg font-semibold text-slate-900">
            {score}/100
          </div>

          <div className="mt-2 text-sm text-slate-500">
            {status}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-slate-700">
                Overall Quality
              </span>

              <span className="font-semibold">
                {score}%
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full rounded-full ${progressColor}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-4">
              <ShieldCheck
                className="mt-1 text-blue-600"
                size={20}
              />

              <div>
                <h4 className="font-semibold">
                  Reliability
                </h4>

                <p className="mt-1 text-sm text-slate-600">
                  Dataset quality is suitable for
                  analytical workflows.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl bg-green-50 p-4">
              <TrendingUp
                className="mt-1 text-green-600"
                size={20}
              />

              <div>
                <h4 className="font-semibold">
                  AI Assessment
                </h4>

                <p className="mt-1 text-sm text-slate-600">
                  Generated using statistical
                  characteristics and AI insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
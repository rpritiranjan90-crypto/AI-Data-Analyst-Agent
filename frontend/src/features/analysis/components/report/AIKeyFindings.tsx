import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

import type { AIFinding } from "../../engine/findings/types";

interface AIKeyFindingsProps {
  findings: AIFinding[];
}

function getFindingStyle(type: AIFinding["type"]) {
  switch (type) {
    case "success":
      return {
        icon: CheckCircle2,
        iconColor: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
      };

    case "warning":
      return {
        icon: AlertTriangle,
        iconColor: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
      };

    case "error":
      return {
        icon: AlertCircle,
        iconColor: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
      };

    default:
      return {
        icon: Info,
        iconColor: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
      };
  }
}

export default function AIKeyFindings({
  findings,
}: AIKeyFindingsProps) {
  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          🤖 AI Key Findings
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          AI-generated insights based on dataset quality,
          readiness, confidence, and recommended models.
        </p>
      </div>

      <div className="space-y-4">
        {findings.map((finding, index) => {
          const style = getFindingStyle(finding.type);
          const Icon = style.icon;

          return (
            <div
              key={index}
              className={`rounded-xl border p-4 ${style.bg} ${style.border}`}
            >
              <div className="flex items-start gap-4">
                <Icon
                  size={24}
                  className={style.iconColor}
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {finding.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-700">
                    {finding.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
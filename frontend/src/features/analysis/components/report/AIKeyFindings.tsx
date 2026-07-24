import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  Sparkles,
} from "lucide-react";

import Badge from "../../../../components/ui/Badge";
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
        iconColor: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        badge: "Success",
        badgeColor: "green" as const,
      };

    case "warning":
      return {
        icon: AlertTriangle,
        iconColor: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        badge: "Warning",
        badgeColor: "amber" as const,
      };

    case "error":
      return {
        icon: AlertCircle,
        iconColor: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        badge: "Critical",
        badgeColor: "red" as const,
      };

    default:
      return {
        icon: Info,
        iconColor: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        badge: "Information",
        badgeColor: "blue" as const,
      };
  }
}

export default function AIKeyFindings({
  findings,
}: AIKeyFindingsProps) {
  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-blue-50 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-blue-100 p-4">
              <Sparkles
                className="h-8 w-8 text-blue-600"
              />
            </div>

            <div>
              <Badge color="purple">
                AI Findings
              </Badge>

              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                Executive Findings
              </h2>

              <p className="mt-2 max-w-3xl text-slate-600">
                AI-generated observations based on data quality,
                statistical analysis, correlations, distribution,
                and machine learning readiness.
              </p>
            </div>
          </div>

          <Badge color="blue">
            {findings.length} Findings
          </Badge>
        </div>
      </div>

      {/* Findings */}
      <div className="space-y-4 p-6">
        {findings.map((finding, index) => {
          const style = getFindingStyle(finding.type);
          const Icon = style.icon;

          return (
            <div
              key={index}
              className={`
                rounded-2xl
                border
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
                ${style.bg}
                ${style.border}
              `}
            >
              <div className="flex items-start gap-5">
                <div className="rounded-xl bg-white p-3 shadow-sm">
                  <Icon
                    size={24}
                    className={style.iconColor}
                  />
                </div>

                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-900">
                      {finding.title}
                    </h3>

                    <Badge color={style.badgeColor}>
                      {style.badge}
                    </Badge>
                  </div>

                  <p className="leading-7 text-slate-700">
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
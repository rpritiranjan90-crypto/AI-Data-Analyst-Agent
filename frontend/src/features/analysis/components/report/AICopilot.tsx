import {
  AlertTriangle,
  Bot,
  Brain,
  CheckCircle2,
  Gauge,
  Sparkles,
} from "lucide-react";

import Badge from "../../../../components/ui/Badge";
import Card from "../../../../components/ui/Card";

import type { AICopilot as CopilotData } from "../../engine/copilot/types";

interface Props {
  copilot: CopilotData;
}

export default function AICopilot({
  copilot,
}: Props) {
  const riskColor =
    copilot.risk === "Low"
      ? "text-emerald-600"
      : copilot.risk === "Medium"
      ? "text-amber-600"
      : "text-red-600";

  const statusColor =
    copilot.status === "Ready for Machine Learning"
      ? "green"
      : copilot.status === "Partially Ready"
      ? "amber"
      : "red";

  return (
    <Card className="overflow-hidden">
      {/* Hero Header */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-blue-50 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-blue-100 p-4">
              <Bot
                className="h-8 w-8 text-blue-600"
              />
            </div>

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge color="blue">
                  <span className="flex items-center gap-1">
                    <Sparkles size={14} />
                    AI Copilot
                  </span>
                </Badge>

                <Badge color={statusColor}>
                  {copilot.status}
                </Badge>
              </div>

              <h2 className="text-2xl font-bold text-slate-900">
                Executive AI Assessment
              </h2>

              <p className="mt-2 max-w-3xl text-slate-600">
                AI-generated evaluation based on dataset
                quality, statistical analysis, feature
                engineering readiness, and machine
                learning suitability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-5 p-6 md:grid-cols-2">
        {/* Overall Assessment */}
        <div className="rounded-2xl border border-slate-200 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />

            <h3 className="font-semibold text-slate-900">
              Overall Assessment
            </h3>
          </div>

          <p className="leading-7 text-slate-600">
            {copilot.overallAssessment}
          </p>
        </div>

        {/* Next Action */}
        <div className="rounded-2xl border border-slate-200 p-5">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />

            <h3 className="font-semibold text-slate-900">
              Recommended Next Action
            </h3>
          </div>

          <p className="leading-7 text-slate-600">
            {copilot.nextAction}
          </p>
        </div>

        {/* Readiness */}
        <div className="rounded-2xl border border-slate-200 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Gauge className="h-5 w-5 text-blue-600" />

            <h3 className="font-semibold text-slate-900">
              Estimated Readiness
            </h3>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-700"
              style={{
                width: `${copilot.readiness}%`,
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Readiness Score
            </span>

            <span className="text-lg font-bold text-slate-900">
              {copilot.readiness}%
            </span>
          </div>
        </div>

        {/* Risk */}
        <div className="rounded-2xl border border-slate-200 p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle
              className={`h-5 w-5 ${riskColor}`}
            />

            <h3 className="font-semibold text-slate-900">
              Risk Assessment
            </h3>
          </div>

          <p
            className={`text-xl font-bold ${riskColor}`}
          >
            {copilot.risk}
          </p>

          <div className="mt-5 border-t border-slate-200 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Suggested First Model
            </p>

            <p className="mt-2 font-semibold text-slate-900">
              🌲 {copilot.suggestedModel}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
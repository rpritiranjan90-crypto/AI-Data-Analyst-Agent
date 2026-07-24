import {
  Bot,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Gauge,
} from "lucide-react";

import type { AICopilot as CopilotData } from "../../engine/copilot/types";

interface Props {
  copilot: CopilotData;
}

export default function AICopilot({
  copilot,
}: Props) {
  const riskColor =
    copilot.risk === "Low"
      ? "text-green-600"
      : copilot.risk === "Medium"
      ? "text-yellow-600"
      : "text-red-600";

  const statusColor =
    copilot.status === "Ready for Machine Learning"
      ? "bg-green-100 text-green-700"
      : copilot.status === "Partially Ready"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="h-7 w-7 text-blue-600" />

          <div>
            <h2 className="text-xl font-bold">
              AI Copilot
            </h2>

            <p className="text-sm text-gray-500">
              AI-generated executive assessment
            </p>
          </div>
        </div>

        <span
          className={`rounded-full px-4 py-1 text-sm font-semibold ${statusColor}`}
        >
          {copilot.status}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <div className="mb-2 flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            <h3 className="font-semibold">
              Overall Assessment
            </h3>
          </div>

          <p className="text-sm text-gray-600">
            {copilot.overallAssessment}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">
              Recommended Next Action
            </h3>
          </div>

          <p className="text-sm text-gray-600">
            {copilot.nextAction}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="mb-2 flex items-center gap-2">
            <Gauge className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">
              Estimated Readiness
            </h3>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${copilot.readiness}%`,
              }}
            />
          </div>

          <p className="mt-2 text-sm font-semibold">
            {copilot.readiness}%
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle
              className={`h-5 w-5 ${riskColor}`}
            />

            <h3 className="font-semibold">
              Risk Level
            </h3>
          </div>

          <p
            className={`text-sm font-semibold ${riskColor}`}
          >
            {copilot.risk}
          </p>

          <div className="mt-4">
            <h4 className="mb-1 text-sm font-semibold">
              Suggested First Model
            </h4>

            <p className="text-sm text-gray-600">
              🌲 {copilot.suggestedModel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
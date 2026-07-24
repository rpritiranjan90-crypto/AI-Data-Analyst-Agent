import {
  Bot,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";

import Card from "../../../../components/ui/Card";

import ExportActions from "./ExportActions";

interface ReportHeaderProps {
  title: string;
  generatedAt: string;
}

export default function ReportHeader({
  title,
  generatedAt,
}: ReportHeaderProps) {
  return (
    <Card>
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        {/* Left Side */}
        <div>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-blue-100 p-4">
              <Bot
                size={36}
                className="text-blue-600"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {title}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                AI Generated Dataset Analysis Report
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-2 text-slate-500">
                <CalendarDays size={16} />

                <span className="text-xs uppercase tracking-wide">
                  Generated
                </span>
              </div>

              <div className="mt-2 text-sm font-semibold text-slate-900">
                {generatedAt}
              </div>
            </div>

            <div className="rounded-xl bg-green-50 px-4 py-3">
              <div className="flex items-center gap-2 text-green-700">
                <ShieldCheck size={16} />

                <span className="text-xs uppercase tracking-wide">
                  Status
                </span>
              </div>

              <div className="mt-2 text-sm font-semibold text-green-700">
                Analysis Complete
              </div>
            </div>
          </div>

          <ExportActions />
        </div>
      </div>
    </Card>
  );
}
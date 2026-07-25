import {
  BrainCircuit,
  CalendarDays,
  Download,
  Sparkles,
} from "lucide-react";

import ExportMenu from "../../../../components/export/ExportMenu";
import Badge from "../../../../components/ui/Badge";
import Card from "../../../../components/ui/Card";

import type { ExportFormat } from "../../../../types/export";

interface ReportHeaderProps {
  title: string;
  generatedAt: string;
  onExportClick?: () => void;
  showExportMenu?: boolean;
  onExportSelect?: (format: ExportFormat) => void;
}

export default function ReportHeader({
  title,
  generatedAt,
  onExportClick,
  showExportMenu = false,
  onExportSelect,
}: ReportHeaderProps) {
  return (
    <Card className="relative border-0 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 p-0 text-white shadow-xl">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 left-0 h-52 w-52 rounded-full bg-blue-400 blur-3xl" />
      </div>

      <div className="relative z-10 p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}
          <div className="flex items-start gap-5">
            <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
              <BrainCircuit
                size={34}
                className="text-cyan-300"
              />
            </div>

            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge color="blue">
                  <span className="flex items-center gap-1">
                    <Sparkles size={14} />
                    AI Generated
                  </span>
                </Badge>

                <Badge color="green">
                  Production Ready
                </Badge>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight">
                {title}
              </h1>

              <p className="mt-3 max-w-3xl text-slate-300">
                Executive analytics report generated using
                AI-assisted statistical analysis,
                correlation, distribution, and machine
                learning readiness evaluation.
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm text-slate-300">
                <CalendarDays size={16} />
                <span>
                  Generated on{" "}
                  {new Date(generatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div className="rounded-3xl border border-white/10 bg-white/10 px-6 py-5 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                Report Status
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Complete
              </h2>

              <p className="mt-1 text-sm text-slate-300">
                AI analysis finished successfully
              </p>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={onExportClick}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 shadow transition hover:scale-105 hover:shadow-lg"
              >
                <Download size={18} />
                Export Report
              </button>

              {showExportMenu && onExportSelect && (
                <div className="absolute bottom-full right-0 z-[9999] mb-3">
                  <ExportMenu onSelect={onExportSelect} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
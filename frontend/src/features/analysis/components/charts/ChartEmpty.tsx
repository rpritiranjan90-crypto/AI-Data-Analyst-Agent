import { BarChart3 } from "lucide-react";

import type { ChartEmptyProps } from "./types";

export default function ChartEmpty({
  title = "No chart data available",
  description = "There isn't enough data to visualize this information.",
}: ChartEmptyProps) {
  return (
    <div className="flex h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
      <BarChart3
        size={48}
        className="mb-4 text-slate-400"
      />

      <h3 className="text-lg font-semibold text-slate-700">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
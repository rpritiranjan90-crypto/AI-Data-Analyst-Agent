import Card from "../../../../components/ui/Card";

import type { ChartCardProps } from "./types";

export default function ChartCard({
  title,
  subtitle,
  children,
  className = "",
}: ChartCardProps) {
  return (
    <Card
      className={`overflow-hidden rounded-2xl border border-slate-200 shadow-sm ${className}`}
    >
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-sm text-slate-500">
            {subtitle}
          </p>
        )}
      </div>

      <div className="p-6">
        {children}
      </div>
    </Card>
  );
}
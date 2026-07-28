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
      className={`overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs ${className}`}
    >
      <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
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
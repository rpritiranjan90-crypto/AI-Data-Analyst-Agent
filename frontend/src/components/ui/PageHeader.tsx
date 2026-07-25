import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  badge?: string;
  gradient?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  action,
  badge,
  gradient = false,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
      {/* Card container with strong border + shadow */}
      <div className="flex-1 flex items-start gap-4 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl shadow-md shadow-slate-300/50 dark:shadow-none px-5 py-4">
        {/* Gradient accent bar */}
        <div className="mt-0.5 w-1.5 h-9 rounded-full bg-gradient-to-b from-blue-600 via-indigo-500 to-violet-500 flex-shrink-0" />

        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1
              className={`text-xl sm:text-2xl tracking-tight leading-tight ${
                gradient
                  ? "font-black gradient-text"
                  : "font-black text-black dark:text-white"
              }`}
            >
              {title}
            </h1>
            {badge && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-300 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {action && (
        <div className="flex items-center gap-3 shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
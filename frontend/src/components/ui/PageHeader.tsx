import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  breadcrumb?: string;
  badge?: string;
  gradient?: boolean;
}

export default function PageHeader({
  title,
  subtitle,
  action,
  breadcrumb = "Platform / Workspace",
  badge,
}: PageHeaderProps) {
  return (
    <div className="border-b border-slate-200/80 dark:border-slate-800 pb-5 mb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {/* Breadcrumb Row */}
          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide">
            {breadcrumb}
          </div>

          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h1>
            {badge && (
              <span className="rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-xs font-semibold px-2.5 py-0.5 inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                {badge}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className="flex items-center gap-2 shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
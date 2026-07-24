import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  action,
}: PageHeaderProps) {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-gradient-to-br
        from-white
        via-slate-50
        to-blue-50
        p-8
        shadow-sm
      "
    >
      {/* Decorative Background */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="absolute -bottom-20 left-1/2 h-52 w-52 rounded-full bg-indigo-100/30 blur-3xl" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
            AI Data Analyst Workspace
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className="flex items-center gap-3">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
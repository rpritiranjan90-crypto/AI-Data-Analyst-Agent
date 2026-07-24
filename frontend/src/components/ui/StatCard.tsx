import type { ReactNode } from "react";

import Card from "./Card";
import ProgressBar from "./ProgressBar";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  progress?: number;
  badge?: ReactNode;
  className?: string;
}

export default function StatCard({
  icon,
  title,
  value,
  subtitle,
  progress,
  badge,
  className = "",
}: StatCardProps) {
  return (
    <Card
      className={`
        group
        p-6
        transition-all
        duration-300
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            from-blue-50
            to-indigo-100
            text-blue-600
            shadow-sm
            transition-all
            duration-300
            group-hover:scale-105
            group-hover:shadow-md
          "
        >
          {icon}
        </div>

        {badge && <div>{badge}</div>}
      </div>

      {/* Title */}
      <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>

      {/* Main Value */}
      <div className="mt-2">
        <p className="text-4xl font-bold tracking-tight text-slate-900">
          {value}
        </p>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {subtitle}
        </p>
      )}

      {/* Progress */}
      {progress !== undefined && (
        <div className="mt-6">
          <ProgressBar
            value={progress}
            showLabel
          />
        </div>
      )}
    </Card>
  );
}
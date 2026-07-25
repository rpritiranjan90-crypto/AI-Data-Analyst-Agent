import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  circle?: boolean;
  lines?: number;
}

/**
 * Skeleton — shimmer loading placeholder
 *
 * Usage:
 *   <Skeleton height="h-6" width="w-40" />
 *   <Skeleton circle height="h-10" width="w-10" />
 *   <Skeleton lines={3} />
 */
export default function Skeleton({
  width = "w-full",
  height = "h-4",
  circle = false,
  lines,
  className = "",
  ...props
}: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <div className={`space-y-2.5 ${className}`} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`skeleton ${height} ${
              i === lines - 1 ? "w-3/4" : "w-full"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`skeleton ${height} ${width} ${
        circle ? "rounded-full" : "rounded-xl"
      } ${className}`}
      {...props}
    />
  );
}

/* ── Skeleton Card — full card loading placeholder ── */
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800/70 bg-white dark:bg-slate-900/90 p-5 space-y-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <Skeleton circle width="w-10" height="h-10" />
        <div className="flex-1 space-y-2">
          <Skeleton height="h-3.5" width="w-1/3" />
          <Skeleton height="h-2.5" width="w-1/2" />
        </div>
      </div>
      <Skeleton height="h-2.5" />
      <Skeleton height="h-2.5" width="w-5/6" />
      <Skeleton height="h-2.5" width="w-4/5" />
      <Skeleton height="h-24" className="rounded-xl" />
    </div>
  );
}

/* ── Skeleton Table Row ── */
export function SkeletonTableRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton height="h-3" width={i === 0 ? "w-8" : "w-full"} />
        </td>
      ))}
    </tr>
  );
}

/* ── Skeleton KPI Grid ── */
export function SkeletonKPIGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
        >
          <div className="flex items-start justify-between mb-4">
            <Skeleton height="h-3" width="w-24" />
            <Skeleton circle width="w-9" height="h-9" />
          </div>
          <Skeleton height="h-8" width="w-20" />
          <Skeleton height="h-2.5" width="w-16" className="mt-2" />
        </div>
      ))}
    </div>
  );
}

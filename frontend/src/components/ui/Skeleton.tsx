import type { HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Tailwind height class, e.g. "h-4", "h-32". */
  h?: string;
  /** Tailwind width class, e.g. "w-32", "w-full". */
  w?: string;
  /** Rounded corner size. */
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  /** "pulse" (default) or "shimmer" (gradient sweep). */
  variant?: "pulse" | "shimmer";
}

const ROUNDED: Record<NonNullable<SkeletonProps["rounded"]>, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

/**
 * Skeleton placeholder for content that's loading.
 * Use instead of spinners for smoother perceived performance.
 */
export default function Skeleton({
  h = "h-4",
  w = "w-full",
  rounded = "md",
  variant = "pulse",
  className = "",
  ...rest
}: SkeletonProps) {
  const base = `${h} ${w} ${ROUNDED[rounded]} ${
    variant === "shimmer"
      ? "bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 bg-[length:200%_100%] animate-shimmer"
      : "bg-slate-200 dark:bg-slate-800 animate-pulse"
  } ${className}`.trim();

  return <div className={base} aria-hidden="true" {...rest} />;
}

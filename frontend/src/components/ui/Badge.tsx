import type { ReactNode } from "react";

type BadgeVariant =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "ai"
  | "green"
  | "blue"
  | "red"
  | "amber"
  | "purple"
  | "gray";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  color?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; dotColor: string }> = {
  default: { bg: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", dotColor: "bg-slate-600" },
  gray:    { bg: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300", dotColor: "bg-slate-600" },
  info:    { bg: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300", dotColor: "bg-indigo-700" },
  blue:    { bg: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300", dotColor: "bg-indigo-700" },
  success: { bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300", dotColor: "bg-emerald-700" },
  green:   { bg: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300", dotColor: "bg-emerald-700" },
  warning: { bg: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300", dotColor: "bg-amber-700" },
  amber:   { bg: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300", dotColor: "bg-amber-700" },
  danger:  { bg: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300", dotColor: "bg-red-700" },
  red:     { bg: "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300", dotColor: "bg-red-700" },
  ai:      { bg: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300", dotColor: "bg-cyan-700" },
  purple:  { bg: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300", dotColor: "bg-purple-700" },
};

export default function Badge({
  children,
  variant,
  color,
  dot = false,
  className = "",
}: BadgeProps) {
  const selectedKey = color ?? variant ?? "default";
  const { bg, dotColor } = variantStyles[selectedKey] || variantStyles.default;

  return (
    <span
      className={`
        rounded-full px-2.5 py-0.5 text-xs font-semibold 
        inline-flex items-center gap-1.5 whitespace-nowrap
        ${bg}
        ${className}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {children}
    </span>
  );
}
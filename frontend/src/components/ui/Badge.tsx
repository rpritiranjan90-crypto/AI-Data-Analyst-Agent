import type { ReactNode } from "react";

type BadgeColor =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "default"
  | "green"
  | "blue"
  | "red"
  | "amber"
  | "purple"
  | "gray";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeColor;
  color?: BadgeColor;
  className?: string;
}

const variants: Record<BadgeColor, string> = {
  success: "bg-emerald-100 text-emerald-700",
  green: "bg-emerald-100 text-emerald-700",

  warning: "bg-amber-100 text-amber-700",
  amber: "bg-amber-100 text-amber-700",

  danger: "bg-red-100 text-red-700",
  red: "bg-red-100 text-red-700",

  info: "bg-blue-100 text-blue-700",
  blue: "bg-blue-100 text-blue-700",

  purple: "bg-purple-100 text-purple-700",

  default: "bg-slate-100 text-slate-700",
  gray: "bg-slate-100 text-slate-700",
};

export default function Badge({
  children,
  variant,
  color,
  className = "",
}: BadgeProps) {
  const style = variants[color ?? variant ?? "default"];

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        tracking-wide
        whitespace-nowrap
        ${style}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
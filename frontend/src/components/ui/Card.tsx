import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverEffect?: boolean;
  glass?: boolean;
}

export default function Card({
  children,
  className = "",
  hoverEffect = true,
  glass = false,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border ${
        glass
          ? "glass-card"
          : "border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white shadow-sm shadow-slate-200/50 dark:shadow-none"
      } ${hoverEffect ? "card-hover" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
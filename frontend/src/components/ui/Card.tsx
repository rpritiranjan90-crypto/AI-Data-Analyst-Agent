import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "glass" | "dark" | "elevated" | "outline";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverEffect?: boolean;
  glass?: boolean;
  variant?: CardVariant;
}

const variantStyles: Record<CardVariant, string> = {
  default:
    "border border-slate-200/80 dark:border-slate-800/70 " +
    "bg-white dark:bg-slate-900/90 " +
    "shadow-sm shadow-slate-200/60 dark:shadow-none " +
    "text-slate-900 dark:text-white",

  glass:
    "glass-card text-slate-900 dark:text-white",

  dark:
    "dark-glass-card border-0 text-white",

  elevated:
    "border border-slate-200/80 dark:border-slate-700/60 " +
    "bg-white dark:bg-slate-900 " +
    "shadow-[0_8px_24px_-4px_rgba(15,23,42,0.10)] dark:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.30)] " +
    "text-slate-900 dark:text-white",

  outline:
    "border-2 border-slate-200 dark:border-slate-700/70 " +
    "bg-transparent " +
    "text-slate-900 dark:text-white",
};

export default function Card({
  children,
  className = "",
  hoverEffect = true,
  glass = false,
  variant = "default",
  ...props
}: CardProps) {
  // glass prop is backward-compat shorthand
  const resolvedVariant: CardVariant = glass ? "glass" : variant;

  return (
    <div
      className={`
        rounded-2xl
        ${variantStyles[resolvedVariant]}
        ${hoverEffect ? "card-hover" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
import type { HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "glass" | "dark" | "elevated" | "outline";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverEffect?: boolean;
  glass?: boolean;
  variant?: CardVariant;
}

export function CardHeader({
  title,
  subtitle,
  className = "",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-4 space-y-0.5 ${className}`}>
      <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-base">
        {title}
      </h3>
      {subtitle && (
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default function Card({
  children,
  className = "",
  hoverEffect = false,
  glass = false,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={`
        bg-white dark:bg-slate-900 
        rounded-2xl 
        border border-slate-200/70 dark:border-slate-800 
        shadow-[0_1px_3px_rgba(0,0,0,0.04)] 
        p-6 
        ${hoverEffect ? "hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:border-slate-300/70 transition-all duration-200" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
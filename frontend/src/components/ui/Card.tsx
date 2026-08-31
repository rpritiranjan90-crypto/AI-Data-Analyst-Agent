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
  const glassStyle = (glass || variant === "glass") ? "backdrop-blur-md bg-white/80 dark:bg-slate-900/80" : "bg-white dark:bg-slate-900";
  const variantStyle = variant === "outline" ? "border-2 border-indigo-500/30" : variant === "elevated" ? "shadow-lg shadow-indigo-950/10" : "";

  return (
    <div
      className={`
        ${glassStyle}
        ${variantStyle}
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
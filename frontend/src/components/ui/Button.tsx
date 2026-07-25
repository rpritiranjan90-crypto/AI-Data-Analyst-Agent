import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline" | "success";
  size?: "xs" | "sm" | "md" | "lg";
  loading?: boolean;
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-gradient-to-r from-blue-600 to-indigo-600 text-white " +
    "hover:from-blue-500 hover:to-indigo-500 " +
    "shadow-md shadow-blue-500/20 border border-blue-400/25 " +
    "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",

  secondary:
    "border border-slate-200 dark:border-slate-700 " +
    "bg-white dark:bg-slate-800 " +
    "text-slate-700 dark:text-slate-200 " +
    "hover:bg-slate-50 dark:hover:bg-slate-700 " +
    "hover:border-slate-300 dark:hover:border-slate-600 " +
    "shadow-xs hover:shadow-sm " +
    "focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",

  outline:
    "border-2 border-indigo-500/60 dark:border-indigo-500/50 " +
    "bg-transparent text-indigo-600 dark:text-indigo-400 " +
    "hover:bg-indigo-50 dark:hover:bg-indigo-950/40 " +
    "hover:border-indigo-600 dark:hover:border-indigo-400 " +
    "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",

  danger:
    "bg-gradient-to-r from-red-600 to-rose-600 text-white " +
    "hover:from-red-500 hover:to-rose-500 " +
    "shadow-md shadow-red-500/20 border border-red-400/25 " +
    "focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",

  success:
    "bg-gradient-to-r from-emerald-600 to-teal-600 text-white " +
    "hover:from-emerald-500 hover:to-teal-500 " +
    "shadow-md shadow-emerald-500/20 border border-emerald-400/25 " +
    "focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",

  ghost:
    "bg-transparent text-slate-600 dark:text-slate-400 " +
    "hover:bg-slate-100 dark:hover:bg-slate-800 " +
    "hover:text-slate-900 dark:hover:text-white " +
    "focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2",
};

const sizeClasses: Record<string, string> = {
  xs: "px-2.5 py-1   text-[11px] rounded-lg   gap-1",
  sm: "px-3.5 py-1.5 text-xs     rounded-xl   gap-1.5",
  md: "px-4   py-2.5 text-xs     rounded-xl   gap-2",
  lg: "px-5.5 py-3   text-sm     rounded-2xl  gap-2.5",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        font-bold tracking-tight
        transition-all duration-200
        active:scale-95
        outline-none
        disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin mr-2 h-3.5 w-3.5 opacity-80"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Loading…
        </>
      ) : (
        children
      )}
    </button>
  );
}
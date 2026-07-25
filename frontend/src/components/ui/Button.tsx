import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline" | "success";
  size?: "xs" | "sm" | "md" | "lg";
  loading?: boolean;
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-indigo-600 hover:bg-indigo-700 text-white " +
    "shadow-[0_1px_8px_rgba(79,70,229,0.3)] hover:shadow-[0_2px_12px_rgba(79,70,229,0.45)] " +
    "transition-all duration-150",

  secondary:
    "bg-white border border-slate-200 text-slate-700 " +
    "hover:bg-slate-50 hover:border-slate-300 " +
    "transition-all duration-150",

  danger:
    "bg-red-50 border border-red-200 text-red-600 " +
    "hover:bg-red-100 " +
    "transition-all duration-150",

  ghost:
    "text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 " +
    "transition-all duration-150",

  outline:
    "border border-indigo-500 text-indigo-600 hover:bg-indigo-50 " +
    "transition-all duration-150",

  success:
    "bg-emerald-600 hover:bg-emerald-700 text-white " +
    "shadow-[0_1px_8px_rgba(16,185,129,0.3)] " +
    "transition-all duration-150",
};

const sizeClasses: Record<string, string> = {
  xs: "px-2.5 py-1 text-xs font-medium rounded-full gap-1",
  sm: "px-3 py-1.5 text-xs font-medium rounded-full gap-1.5",
  md: "px-5 py-2.5 text-sm font-medium rounded-full gap-2",
  lg: "px-6 py-3 text-base font-medium rounded-full gap-2.5",
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
        font-medium tracking-tight
        active:scale-[0.97]
        disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100
        cursor-pointer
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
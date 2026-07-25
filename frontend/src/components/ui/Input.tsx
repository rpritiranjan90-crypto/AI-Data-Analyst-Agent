import type { InputHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          bg-white dark:bg-slate-900 
          border border-slate-200 dark:border-slate-700 
          rounded-xl 
          px-3.5 py-2.5 
          text-sm text-slate-900 dark:text-slate-100 
          placeholder:text-slate-400 
          focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 
          transition-all duration-150 
          w-full
          ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : ""}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
          <AlertCircle size={12} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
import type { LucideIcon } from "lucide-react";
import { isValidElement, type ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon | ReactNode;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  const IconComponent = typeof icon === "function" ? icon : null;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-5 mb-5 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-slate-200 dark:border-slate-700">
        {IconComponent ? (
          <IconComponent size={32} />
        ) : (
          isValidElement(icon) && icon
        )}
      </div>

      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
        {title}
      </h2>

      <p className="text-sm font-medium text-slate-600 dark:text-slate-200 text-center max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      {action && <div>{action}</div>}
    </div>
  );
}
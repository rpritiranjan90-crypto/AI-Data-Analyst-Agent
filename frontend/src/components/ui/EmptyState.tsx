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
      <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-5 mb-5 text-slate-400 flex items-center justify-center">
        {IconComponent ? (
          <IconComponent size={32} />
        ) : (
          isValidElement(icon) && icon
        )}
      </div>

      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">
        {title}
      </h2>

      <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs mb-6">
        {description}
      </p>

      {action && <div>{action}</div>}
    </div>
  );
}
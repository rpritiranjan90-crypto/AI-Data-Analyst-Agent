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
  const IconComponent =
    typeof icon === "function" ? icon : null;

  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        {IconComponent ? (
          <IconComponent size={40} strokeWidth={2} />
        ) : (
          isValidElement(icon) && icon
        )}
      </div>

      <h2 className="text-2xl font-semibold text-slate-900">
        {title}
      </h2>

      <p className="mt-3 max-w-md text-slate-500">
        {description}
      </p>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
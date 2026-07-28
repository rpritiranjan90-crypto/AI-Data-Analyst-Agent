import type { LucideIcon } from "lucide-react";
import { isValidElement, type ReactNode } from "react";

interface SectionHeaderProps {
  icon: LucideIcon | ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function SectionHeader({
  icon,
  title,
  subtitle,
  action,
}: SectionHeaderProps) {
  const IconComponent =
    typeof icon === "function" ? icon : null;

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-4 shadow-md shadow-slate-300/40 dark:shadow-none">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            border
            border-blue-200
            bg-blue-50
            dark:bg-slate-800
            dark:border-slate-700
            shadow-sm
            shrink-0
          "
        >
          {IconComponent ? (
            <IconComponent
              size={24}
              className="text-blue-600 dark:text-blue-400"
            />
          ) : (
            isValidElement(icon) && icon
          )}
        </div>

        {/* Title */}
        <div className="min-w-0">
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Side */}
      {action && (
        <div className="flex items-center gap-3 shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
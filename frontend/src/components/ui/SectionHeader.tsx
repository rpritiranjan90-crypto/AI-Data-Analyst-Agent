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
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            border
            border-blue-100
            bg-gradient-to-br
            from-blue-50
            via-indigo-50
            to-purple-50
            shadow-sm
          "
        >
          {IconComponent ? (
            <IconComponent
              size={26}
              className="text-blue-600"
            />
          ) : (
            isValidElement(icon) && icon
          )}
        </div>

        {/* Title */}
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right Side */}
      {action && (
        <div className="flex items-center gap-3">
          {action}
        </div>
      )}
    </div>
  );
}
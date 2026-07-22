import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "blue" | "green" | "orange" | "red" | "purple";
}

const colors = {
  blue: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    icon: "bg-blue-100 text-blue-600",
    value: "text-blue-700",
  },
  green: {
    border: "border-green-200",
    bg: "bg-green-50",
    icon: "bg-green-100 text-green-600",
    value: "text-green-700",
  },
  orange: {
    border: "border-orange-200",
    bg: "bg-orange-50",
    icon: "bg-orange-100 text-orange-600",
    value: "text-orange-700",
  },
  red: {
    border: "border-red-200",
    bg: "bg-red-50",
    icon: "bg-red-100 text-red-600",
    value: "text-red-700",
  },
  purple: {
    border: "border-purple-200",
    bg: "bg-purple-50",
    icon: "bg-purple-100 text-purple-600",
    value: "text-purple-700",
  },
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
}: MetricCardProps) {
  const style = colors[color];

  return (
    <div
      className={`
        rounded-2xl
        border
        ${style.border}
        ${style.bg}
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2
            className={`mt-2 text-4xl font-bold ${style.value}`}
          >
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-xl
            ${style.icon}
          `}
        >
          <Icon size={28} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}
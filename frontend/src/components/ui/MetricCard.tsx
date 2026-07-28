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
    border: "border-blue-300 dark:border-blue-800",
    bg: "bg-white dark:bg-slate-900",
    icon: "bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
    value: "text-blue-700 dark:text-blue-300 font-extrabold",
  },
  green: {
    border: "border-emerald-300 dark:border-emerald-800",
    bg: "bg-white dark:bg-slate-900",
    icon: "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
    value: "text-emerald-700 dark:text-emerald-300 font-extrabold",
  },
  orange: {
    border: "border-amber-300 dark:border-amber-800",
    bg: "bg-white dark:bg-slate-900",
    icon: "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
    value: "text-amber-700 dark:text-amber-300 font-extrabold",
  },
  red: {
    border: "border-red-300 dark:border-red-800",
    bg: "bg-white dark:bg-slate-900",
    icon: "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400",
    value: "text-red-700 dark:text-red-300 font-extrabold",
  },
  purple: {
    border: "border-purple-300 dark:border-purple-800",
    bg: "bg-white dark:bg-slate-900",
    icon: "bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400",
    value: "text-purple-700 dark:text-purple-300 font-extrabold",
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
        border-2
        ${style.border}
        ${style.bg}
        p-5
        shadow-md shadow-slate-300/40 dark:shadow-none
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
      `}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
            {title}
          </p>

          <h2
            className={`mt-2 text-3xl ${style.value}`}
          >
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`
            flex
            h-13
            w-13
            items-center
            justify-center
            rounded-xl
            ${style.icon}
          `}
        >
          <Icon size={26} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}
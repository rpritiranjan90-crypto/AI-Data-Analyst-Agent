import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  trend?: number;
  trendLabel?: string;
}

export default function KPICard({
  title,
  value,
  icon: Icon,
  trend = 0,
  trendLabel = "Active dataset stats",
}: KPICardProps) {
  const positive = trend >= 0;

  return (
    <div className="group min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/70 dark:border-slate-800 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col justify-between">
      {/* Icon Top Left */}
      <div>
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-200 inline-flex items-center justify-center">
            <Icon size={16} />
          </div>

          {trend !== 0 && (
            <div
              className={`inline-flex items-center gap-0.5 text-xs font-semibold rounded-full px-2 py-0.5 ${
                positive
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300"
              }`}
            >
              {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>

        {/* Metric Label */}
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-3 truncate">
          {title}
        </p>

        {/* Big Number */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums leading-tight truncate">
          {typeof value === "number" ? value.toLocaleString() : value}
        </h2>

        {trendLabel && (
          <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1 truncate">
            {trendLabel}
          </p>
        )}
      </div>

      {/* Bottom Sparkline Placeholder Area */}
      <div className="h-8 mt-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 flex items-end p-1.5 gap-1 overflow-hidden opacity-60">
        <div className="flex-1 bg-indigo-200 dark:bg-indigo-900/50 rounded-xs h-[30%]" />
        <div className="flex-1 bg-indigo-300 dark:bg-indigo-800/50 rounded-xs h-[50%]" />
        <div className="flex-1 bg-indigo-200 dark:bg-indigo-900/50 rounded-xs h-[40%]" />
        <div className="flex-1 bg-indigo-400 dark:bg-indigo-700/50 rounded-xs h-[70%]" />
        <div className="flex-1 bg-indigo-300 dark:bg-indigo-800/50 rounded-xs h-[60%]" />
        <div className="flex-1 bg-indigo-500 dark:bg-indigo-600/50 rounded-xs h-[90%]" />
        <div className="flex-1 bg-indigo-400 dark:bg-indigo-700/50 rounded-xs h-[75%]" />
      </div>
    </div>
  );
}
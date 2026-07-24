import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import Card from "../ui/Card";

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
  color = "bg-blue-500",
  trend = 0,
  trendLabel = "Compared to previous upload",
}: KPICardProps) {
  const positive = trend >= 0;

  return (
    <Card className="group relative overflow-hidden p-6">
      {/* Accent Bar */}
      <div
        className={`absolute left-0 top-0 h-1 w-full ${color}`}
      />

      <div className="flex items-start justify-between">
        {/* Left */}
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {title}
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>

          <div className="mt-6 flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                positive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {positive ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}

              {Math.abs(trend)}%
            </div>

            <span className="text-xs text-slate-500">
              {trendLabel}
            </span>
          </div>
        </div>

        {/* Right */}
        <div
          className={`
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            ${color}
            text-white
            shadow-lg
            transition-all
            duration-300
            group-hover:scale-105
            group-hover:rotate-3
          `}
        >
          <Icon size={30} strokeWidth={2.2} />
        </div>
      </div>
    </Card>
  );
}
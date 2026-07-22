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
  trendLabel = "Since last month",
}: KPICardProps) {
  const positive = trend >= 0;

  return (
    <Card className="group cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>

          <div className="mt-4 flex items-center gap-2">
            <div
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                positive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
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

        <div
          className={`rounded-2xl p-4 text-white shadow-sm transition-transform duration-300 group-hover:scale-110 ${color}`}
        >
          <Icon size={28} />
        </div>
      </div>
    </Card>
  );
}
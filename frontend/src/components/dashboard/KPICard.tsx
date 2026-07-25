import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
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
  color = "bg-blue-600",
  trend = 0,
  trendLabel = "Active dataset stats",
}: KPICardProps) {
  const positive = trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card className="group relative overflow-hidden p-6 glass-card">
        {/* Glowing Top Accent */}
        <div className={`absolute left-0 top-0 h-1.5 w-full ${color}`} />

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              {title}
            </p>

            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {typeof value === "number" ? value.toLocaleString() : value}
            </h2>

            <div className="mt-4 flex items-center gap-2.5">
              <div
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  positive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {positive ? (
                  <ArrowUpRight size={13} />
                ) : (
                  <ArrowDownRight size={13} />
                )}
                {Math.abs(trend)}%
              </div>

              <span className="text-[11px] font-medium text-slate-400">
                {trendLabel}
              </span>
            </div>
          </div>

          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color} text-white shadow-lg shadow-blue-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
          >
            <Icon size={26} strokeWidth={2.2} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
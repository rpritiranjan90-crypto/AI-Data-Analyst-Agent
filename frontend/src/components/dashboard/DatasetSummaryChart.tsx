import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  TrendingUp,
  Database,
} from "lucide-react";

import Card from "../ui/Card";

const data = [
  { month: "Jan", datasets: 2 },
  { month: "Feb", datasets: 5 },
  { month: "Mar", datasets: 7 },
  { month: "Apr", datasets: 12 },
  { month: "May", datasets: 15 },
  { month: "Jun", datasets: 18 },
];

export default function DatasetSummaryChart() {
  const latest = data[data.length - 1]?.datasets ?? 0;

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            Dataset Growth
          </h3>

          <p className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Monthly uploaded datasets
          </p>
        </div>

        <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 p-3 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
          <TrendingUp size={22} />
        </div>
      </div>

      {/* KPI Card */}
      <div className="mb-6 flex items-center justify-between rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 p-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Current Total
          </p>

          <h2 className="mt-1 text-3xl font-black text-slate-900 dark:text-white tabular-nums">
            {latest}
          </h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <Database size={24} />
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="datasetGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#4f46e5"
                  stopOpacity={0.45}
                />
                <stop
                  offset="100%"
                  stopColor="#4f46e5"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#334155"
              strokeDasharray="4 4"
              opacity={0.15}
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 11,
                fontWeight: 600,
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#94a3b8",
                fontSize: 11,
                fontWeight: 600,
              }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: 16,
                color: "#f8fafc",
                fontSize: 12,
                fontWeight: 600,
                boxShadow: "0 12px 32px rgba(0,0,0,.3)",
              }}
            />

            <Area
              type="monotone"
              dataKey="datasets"
              stroke="#6366f1"
              strokeWidth={3}
              fill="url(#datasetGradient)"
              activeDot={{
                r: 6,
                fill: "#818cf8",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
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
    <Card className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Dataset Growth
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Monthly uploaded datasets
          </p>
        </div>

        <div className="rounded-2xl bg-blue-50 p-3">
          <TrendingUp
            size={24}
            className="text-blue-600"
          />
        </div>
      </div>

      {/* KPI */}
      <div className="mb-6 flex items-center justify-between rounded-2xl bg-slate-50 p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Current Total
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {latest}
          </h2>
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
          <Database
            className="text-blue-600"
            size={28}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
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
                  stopColor="#2563eb"
                  stopOpacity={0.45}
                />

                <stop
                  offset="100%"
                  stopColor="#2563eb"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#e2e8f0"
              strokeDasharray="4 4"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 12,
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: "#64748b",
                fontSize: 12,
              }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: 16,
                border: "1px solid #e2e8f0",
                boxShadow:
                  "0 12px 32px rgba(15,23,42,.08)",
              }}
            />

            <Area
              type="monotone"
              dataKey="datasets"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#datasetGradient)"
              activeDot={{
                r: 6,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
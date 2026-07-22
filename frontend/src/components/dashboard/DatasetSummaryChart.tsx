import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
  return (
    <Card>
      <h3 className="mb-6 text-lg font-semibold text-slate-900">
        Dataset Summary
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="datasetGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#2563eb"
                  stopOpacity={0.4}
                />

                <stop
                  offset="95%"
                  stopColor="#2563eb"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="datasets"
              stroke="#2563eb"
              fill="url(#datasetGradient)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
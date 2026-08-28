import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CHART_COLORS, CHART_PALETTE } from "./chartColors";
import { CHART_CONFIG } from "./chartConfig";

import ChartCard from "./ChartCard";
import ChartContainer from "./ChartContainer";
import ChartEmpty from "./ChartEmpty";

import type { AnalyticsBarChartProps } from "./types";

export default function AnalyticsBarChart({
  title,
  subtitle,
  data,
  xKey,
  yKey,
  className,
  height = CHART_CONFIG.height,
  color = CHART_COLORS.primary,
  showGrid = true,
  showLegend = false,
  emptyTitle,
  emptyDescription,
}: AnalyticsBarChartProps) {
  const ariaLabel =
    title || `Bar chart with ${data?.length ?? 0} bars`;
  if (!data || data.length === 0) {
    return (
      <ChartCard
        title={title}
        subtitle={subtitle}
        className={className}
      >
        <ChartEmpty
          title={emptyTitle}
          description={emptyDescription}
        />
      </ChartCard>
    );
  }

  const horizontal = data.length >= 5;

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      className={className}
    >
      <ChartContainer height={height} ariaLabel={ariaLabel}>
        <RechartsBarChart
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{
            top: 20,
            right: 35,
            left: horizontal ? 40 : 20,
            bottom: 20,
          }}
        >
          {showGrid && (
            <CartesianGrid
              stroke="#334155"
              strokeDasharray="4 4"
              opacity={0.15}
              vertical={!horizontal}
              horizontal={horizontal}
            />
          )}

          {horizontal ? (
            <>
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
              />

              <YAxis
                type="category"
                dataKey={xKey}
                width={120}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={xKey}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
              />
            </>
          )}

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

          {showLegend && <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 11, fontWeight: 600 }} />}

          <Bar
            dataKey={yKey}
            fill={color}
            radius={CHART_CONFIG.bar.radius}
          >
            <LabelList
              dataKey={yKey}
              position={horizontal ? "right" : "top"}
              fill="#818cf8"
              fontSize={11}
              fontWeight={700}
            />

            {data.map((_, index) => (
              <Cell
                key={index}
                fill={
                  CHART_PALETTE[
                    index % CHART_PALETTE.length
                  ]
                }
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ChartContainer>
    </ChartCard>
  );
}
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
      <ChartContainer height={height}>
        <RechartsBarChart
          data={data}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{
            top: 20,
            right: 30,
            left: horizontal ? 50 : 20,
            bottom: 20,
          }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={!horizontal}
              horizontal={horizontal}
            />
          )}

          {horizontal ? (
            <>
              <XAxis type="number" />

              <YAxis
                type="category"
                dataKey={xKey}
                width={140}
                tick={{
                  fontSize: 12,
                }}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={xKey}
                tick={{
                  fontSize: 12,
                }}
              />

              <YAxis
                tick={{
                  fontSize: 12,
                }}
              />
            </>
          )}

          <Tooltip />

          {showLegend && <Legend />}

          <Bar
            dataKey={yKey}
            fill={color}
            radius={CHART_CONFIG.bar.radius}
          >
            <LabelList
              dataKey={yKey}
              position={horizontal ? "right" : "top"}
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
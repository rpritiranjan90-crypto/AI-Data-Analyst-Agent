import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CHART_COLORS } from "./chartColors";
import { CHART_CONFIG } from "./chartConfig";

import ChartCard from "./ChartCard";
import ChartContainer from "./ChartContainer";
import ChartEmpty from "./ChartEmpty";

import type { AnalyticsLineChartProps } from "./types";

export default function AnalyticsLineChart({
  title,
  subtitle,
  data,
  xKey,
  yKey,
  className,
  height = CHART_CONFIG.height,
  color = CHART_COLORS.primary,
  showGrid = true,
  showLegend = true,
  emptyTitle,
  emptyDescription,
}: AnalyticsLineChartProps) {
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

  return (
    <ChartCard
      title={title}
      subtitle={subtitle}
      className={className}
    >
      <ChartContainer height={height}>
        <RechartsLineChart
          data={data}
          margin={CHART_CONFIG.margin}
        >
          {showGrid && (
            <CartesianGrid {...CHART_CONFIG.grid} />
          )}

          <XAxis
            dataKey={xKey}
            {...CHART_CONFIG.xAxis}
          />

          <YAxis
            {...CHART_CONFIG.yAxis}
          />

          <Tooltip />

          {showLegend && <Legend />}

          <Line
            type="monotone"
            dataKey={yKey}
            stroke={color}
            strokeWidth={CHART_CONFIG.line.strokeWidth}
            dot={CHART_CONFIG.line.dot}
            activeDot={CHART_CONFIG.line.activeDot}
          />
        </RechartsLineChart>
      </ChartContainer>
    </ChartCard>
  );
}
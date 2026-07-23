import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  Tooltip,
} from "recharts";

import { CHART_COLORS, CHART_PALETTE } from "./chartColors";
import { CHART_CONFIG } from "./chartConfig";

import ChartCard from "./ChartCard";
import ChartContainer from "./ChartContainer";
import ChartEmpty from "./ChartEmpty";

import type { AnalyticsPieChartProps } from "./types";

export default function AnalyticsPieChart({
  title,
  subtitle,
  data,
  nameKey,
  dataKey,
  className,
  height = CHART_CONFIG.height,
  color = CHART_COLORS.primary,
  showLegend = true,
  emptyTitle,
  emptyDescription,
}: AnalyticsPieChartProps) {
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
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={CHART_CONFIG.pie.outerRadius}
            dataKey={dataKey}
            nameKey={nameKey}
            labelLine={false}
            label={({ percent }) =>
              `${((percent ?? 0) * 100).toFixed(0)}%`
            }
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  index === 0
                    ? color
                    : CHART_PALETTE[index % CHART_PALETTE.length]
                }
              />
            ))}
          </Pie>

          <Tooltip />
          {showLegend && <Legend />}
        </RechartsPieChart>
      </ChartContainer>
    </ChartCard>
  );
}
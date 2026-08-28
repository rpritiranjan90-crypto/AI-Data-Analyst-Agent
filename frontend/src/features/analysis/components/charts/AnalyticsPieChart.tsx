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
  const ariaLabel =
    title || `Pie chart with ${data?.length ?? 0} slices`;
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
      <ChartContainer height={height} ariaLabel={ariaLabel}>
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
          {showLegend && (
            <Legend
              wrapperStyle={{
                color: "#94a3b8",
                fontSize: 11,
                fontWeight: 600,
                paddingTop: 12,
              }}
            />
          )}
        </RechartsPieChart>
      </ChartContainer>
    </ChartCard>
  );
}
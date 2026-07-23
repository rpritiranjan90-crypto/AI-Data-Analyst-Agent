import type { ReactNode } from "react";

/* -------------------------------------------------------------------------- */
/*                                Base Types                                  */
/* -------------------------------------------------------------------------- */

export type ChartData = Record<
  string,
  string | number | boolean | null
>[];

/* -------------------------------------------------------------------------- */
/*                              Base Chart Props                              */
/* -------------------------------------------------------------------------- */

export interface BaseChartProps<T = ChartData> {
  title: string;

  data: T;

  subtitle?: string;

  className?: string;

  /**
   * Chart height in pixels.
   * Default: 320
   */
  height?: number;

  /**
   * Primary series color.
   */
  color?: string;

  /**
   * Show chart legend.
   * Default: true
   */
  showLegend?: boolean;

  /**
   * Show grid lines.
   * Default: true
   */
  showGrid?: boolean;

  /**
   * Empty state title.
   */
  emptyTitle?: string;

  /**
   * Empty state description.
   */
  emptyDescription?: string;
}

/* -------------------------------------------------------------------------- */
/*                              Chart Container                               */
/* -------------------------------------------------------------------------- */

export interface ChartContainerProps {
  children: ReactNode;

  height?: number;

  className?: string;
}

/* -------------------------------------------------------------------------- */
/*                                 Chart Card                                 */
/* -------------------------------------------------------------------------- */

export interface ChartCardProps {
  title: string;

  subtitle?: string;

  children: ReactNode;

  className?: string;
}

/* -------------------------------------------------------------------------- */
/*                                Empty State                                 */
/* -------------------------------------------------------------------------- */

export interface ChartEmptyProps {
  title?: string;

  description?: string;
}

/* -------------------------------------------------------------------------- */
/*                              Tooltip Payload                               */
/* -------------------------------------------------------------------------- */

export interface TooltipPayloadItem {
  name: string;

  value: number | string;

  color?: string;
}

/* -------------------------------------------------------------------------- */
/*                              Tooltip Props                                 */
/* -------------------------------------------------------------------------- */

export interface ChartTooltipProps {
  active?: boolean;

  payload?: TooltipPayloadItem[];

  label?: string;
}

/* -------------------------------------------------------------------------- */
/*                               Legend Props                                 */
/* -------------------------------------------------------------------------- */

export interface ChartLegendItem {
  value: string;

  color: string;
}

export interface ChartLegendProps {
  payload?: ChartLegendItem[];
}

/* -------------------------------------------------------------------------- */
/*                              Bar Chart Props                               */
/* -------------------------------------------------------------------------- */

export interface AnalyticsBarChartProps extends BaseChartProps {
  xKey: string;

  yKey: string;
}

/* -------------------------------------------------------------------------- */
/*                              Pie Chart Props                               */
/* -------------------------------------------------------------------------- */

export interface AnalyticsPieChartProps extends BaseChartProps {
  nameKey: string;

  dataKey: string;
}

/* -------------------------------------------------------------------------- */
/*                              Line Chart Props                              */
/* -------------------------------------------------------------------------- */

export interface AnalyticsLineChartProps extends BaseChartProps {
  xKey: string;

  yKey: string;
}

/* -------------------------------------------------------------------------- */
/*                           Scatter Chart Props                              */
/* -------------------------------------------------------------------------- */

export interface AnalyticsScatterChartProps extends BaseChartProps {
  xKey: string;

  yKey: string;
}

/* -------------------------------------------------------------------------- */
/*                         Histogram Chart Props                              */
/* -------------------------------------------------------------------------- */

export interface AnalyticsHistogramChartProps extends BaseChartProps {
  valueKey: string;
}

/* -------------------------------------------------------------------------- */
/*                          Heatmap Chart Props                               */
/* -------------------------------------------------------------------------- */

export interface AnalyticsHeatmapChartProps
  extends BaseChartProps<number[][]> {
  xLabels: string[];

  yLabels: string[];
}
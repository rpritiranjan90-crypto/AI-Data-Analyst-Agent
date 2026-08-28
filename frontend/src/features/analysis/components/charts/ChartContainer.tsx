import { ResponsiveContainer } from "recharts";

import type { ChartContainerProps } from "./types";

export default function ChartContainer({
  children,
  height = 320,
  className = "",
  ariaLabel,
}: ChartContainerProps) {
  return (
    <div
      className={`w-full ${className}`}
      style={{
        width: "100%",
        height,
        minHeight: height,
      }}
      // Recharts renders as <svg>; expose it to assistive tech with role="img"
      // and a descriptive aria-label so screen-reader users get the chart context.
      role="img"
      aria-label={ariaLabel}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}
import { ResponsiveContainer } from "recharts";

import type { ChartContainerProps } from "./types";

export default function ChartContainer({
  children,
  height = 320,
  className = "",
}: ChartContainerProps) {
  return (
    <div
      className={`w-full ${className}`}
      style={{
        width: "100%",
        height,
        minHeight: height,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}
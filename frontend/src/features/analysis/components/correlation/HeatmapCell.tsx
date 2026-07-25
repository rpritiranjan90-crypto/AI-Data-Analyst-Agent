import clsx from "clsx";

interface HeatmapCellProps {
  row: string;
  column: string;
  value: number;
  selected?: boolean;
  onClick?: (
    row: string,
    column: string,
    value: number
  ) => void;
}

function getCellColor(value: number): string {
  const abs = Math.abs(value);

  if (value >= 0.9)
    return "bg-blue-700 text-white";

  if (value >= 0.7)
    return "bg-blue-600 text-white";

  if (value >= 0.5)
    return "bg-blue-400 text-white";

  if (value >= 0.3)
    return "bg-blue-200 text-slate-900";

  if (value <= -0.9)
    return "bg-red-700 text-white";

  if (value <= -0.7)
    return "bg-red-600 text-white";

  if (value <= -0.5)
    return "bg-red-400 text-white";

  if (value <= -0.3)
    return "bg-red-200 text-slate-900";

  if (abs < 0.3)
    return "bg-slate-100 text-slate-600";

  return "bg-white text-slate-700";
}

export default function HeatmapCell({
  row,
  column,
  value,
  selected = false,
  onClick,
}: HeatmapCellProps) {
  return (
    <button
      type="button"
      title={`${row} ↔ ${column}\nCorrelation: ${value.toFixed(3)}`}
      onClick={() =>
        onClick?.(row, column, value)
      }
      className={clsx(
        "aspect-square",
        "flex items-center justify-center",
        "rounded-md",
        "border border-white",
        "text-xs font-semibold",
        "transition-all duration-200",
        "hover:scale-105 hover:shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        getCellColor(value),
        selected &&
          "ring-2 ring-slate-900"
      )}
      aria-label={`${row} correlated with ${column}: ${value.toFixed(
        3
      )}`}
    >
      {value.toFixed(2)}
    </button>
  );
}
import {
  getCorrelationStrength,
  getTooltipText,
  isStrongCorrelation,
} from "./HeatmapUtils";

interface CorrelationCellProps {
  row: string;
  column: string;
  value: number;
}

export default function CorrelationCell({
  row,
  column,
  value,
}: CorrelationCellProps) {
  const diagonal = row === column;

  const strength = getCorrelationStrength(
    value,
    diagonal,
  );

  const highlight = isStrongCorrelation(
    value,
    diagonal,
  );

  return (
    <div
      title={getTooltipText(
        row,
        column,
        value,
        diagonal,
      )}
      aria-label={`${row} correlated with ${column}: ${value.toFixed(
        2,
      )}`}
      className={`
        flex
        h-14
        w-16
        cursor-pointer
        items-center
        justify-center
        rounded-xl
        text-sm
        font-bold
        shadow-sm
        transition-all
        duration-200
        hover:scale-105
        hover:shadow-lg
        ${strength.bgClass}
        ${strength.textClass}
        ${
          highlight
            ? "ring-2 ring-amber-300"
            : ""
        }
      `}
    >
      {value.toFixed(2)}
    </div>
  );
}
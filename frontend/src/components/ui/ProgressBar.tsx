interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: string;
  showLabel?: boolean;
  ariaLabel?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  color = "bg-indigo-600",
  height = "h-2",
  showLabel = false,
  ariaLabel,
}: ProgressBarProps) {
  const percentage = Math.min(
    100,
    Math.max(0, (value / max) * 100)
  );

  return (
    <div className="w-full">
      <div
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel ?? "Progress"}
        className={`w-full overflow-hidden rounded-full bg-slate-200 ${height}`}
      >
        <div
          className={`${height} rounded-full transition-all duration-500 ${color}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      {showLabel && (
        <p className="mt-2 text-sm font-medium text-slate-600">
          {Math.round(percentage)}%
        </p>
      )}
    </div>
  );
}
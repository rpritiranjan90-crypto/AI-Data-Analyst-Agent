import type { CleaningPriority } from "../../engine/cleaning/types";

interface PriorityBadgeProps {
  priority: CleaningPriority;
}

const styles: Record<
  CleaningPriority,
  string
> = {
  critical:
    "bg-red-100 text-red-700 border-red-200",

  warning:
    "bg-amber-100 text-amber-700 border-amber-200",

  info:
    "bg-blue-100 text-blue-700 border-blue-200",
};

const labels: Record<
  CleaningPriority,
  string
> = {
  critical: "Critical",
  warning: "Warning",
  info: "Info",
};

export default function PriorityBadge({
  priority,
}: PriorityBadgeProps) {
  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        border
        px-3
        py-1
        text-xs
        font-semibold
        ${styles[priority]}
      `}
    >
      {labels[priority]}
    </span>
  );
}